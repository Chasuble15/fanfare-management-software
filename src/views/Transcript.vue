<template>
  <div class="transcript" style="text-align: center">
    <h1 class="pa-md-4 mx-lg-auto">PV Maker</h1>
    <v-navigation-drawer v-model="menu" absolute temporary right width="400">
      <template v-slot:prepend>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-file</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title><h3>Liste des PV</h3></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list>
        <v-list-item v-for="(pv, i) in pvref" :key="pv.pvname">
          <v-list-item-content>
            <v-list-item-title>{{ pv.pvname }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <div>
              <v-btn icon @click="openpv(i)"
                ><v-icon>mdi-folder-open</v-icon></v-btn
              >
              <v-btn icon @click="createPDF(i)"
                ><v-icon>mdi-file-pdf</v-icon></v-btn
              >
              <v-btn icon :disabled="lockdelete(i)" @click="deletepv(i)"
                ><v-icon>mdi-close-circle</v-icon></v-btn
              >
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-card>
      <v-toolbar flat color="blue-grey" dark>
        <v-toolbar-title>Réunion du comité</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon rounded class="mx-1" @click="updateData"
          ><v-icon>mdi-content-save</v-icon></v-btn
        >
        <v-btn icon rounded class="mx-1" @click="menu = true"
          ><v-icon>mdi-folder-open</v-icon></v-btn
        >
        <v-btn icon rounded class="mx-1" @click="clearData"
          ><v-icon>mdi-broom</v-icon></v-btn
        >
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              filled
              label="Nom de la société"
              v-model="comityData.society"
              hint="p. ex. Jeunesse de Chamoson"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              filled
              label="Lieu de la réunion"
              v-model="comityData.lieu"
              hint="p. ex. chez Olivier"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              filled
              label="Heure de la réunion"
              v-model="comityData.heure"
              hint="p. ex. 20h"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              filled
              label="Date de la réunion"
              v-model="comityData.date"
              hint="p. ex. 09 novembre 2018"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-card-title>Présence</v-card-title>
        <v-combobox
          v-model="comityData.membres"
          chips
          clearable
          label="Membres présents à la réunion"
          multiple
          solo
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip v-bind="attrs" :input-value="selected" @click="select">
              <strong>{{ item }}</strong>
              &nbsp;
            </v-chip>
          </template>
        </v-combobox>

        <v-card-title>Questions posées</v-card-title>
        <v-container
          fluid
          v-for="(question, u) in comityData.questions"
          :key="u"
        >
          <v-card class="mx-auto">
            <v-card-title v-if="!comityData.questions[u].edit">
              {{ question.title }}
              <v-btn icon @click="edit(u)">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-title v-else>
              <v-row>
                <v-col>
                  <v-text-field
                    solo
                    v-model="comityData.questions[u].title"
                  ></v-text-field>
                </v-col>
                <v-col class="text-right">
                  <v-btn
                    rounded
                    @click="removeBloc(u)"
                    class="mx-2"
                    dark
                    color="red"
                  >
                    <v-icon>mdi-close-circle</v-icon>
                    <div class="mx-2">Question posée</div>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-list dense flat card-title>
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(question, i) in comityData.questions[u].content"
                  :key="i"
                  :ripple="false"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-circle-medium</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content
                    v-if="!comityData.questions[u].edit"
                    class="d-flex left"
                    >{{ question }}</v-list-item-content
                  >
                  <v-list-item-content v-else class="d-flex left">
                    <v-textarea
                      auto-grow
                      rows="3"
                      dense
                      v-model="comityData.questions[u].content[i]"
                      filled
                      append-icon="mdi-close-circle"
                      @click:append="removeQuestion(u, i)"
                    ></v-textarea>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-btn
              @click="addQuestion(u)"
              v-show="comityData.questions[u].edit"
              class="mx-2"
              dark
              color="indigo"
              rounded
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              @click="edit(u)"
              v-show="comityData.questions[u].edit"
              color="success"
              class="my-2"
              rounded
              ><v-icon dark> mdi-check</v-icon>
            </v-btn>
          </v-card>
        </v-container>
        <v-btn rounded @click="addBloc" class="mx-2" dark color="indigo">
          <v-icon>mdi-plus-circle</v-icon>
          <div class="mx-2">Question posée</div>
        </v-btn>
        <v-card-title>Tâches à effectuer prochainement</v-card-title>
        <v-data-table
          dense
          hide-default-footer
          :items="comityData.items"
          :headers="comityData.headers"
          disable-sort
        >
          <template v-slot:item.0="{ item }">
            <v-text-field
              placeholder="Nom..."
              filled
              dense
              v-model="item['0']"
            ></v-text-field>
          </template>
          <template v-slot:item.1="{ item }">
            <v-textarea
              auto-grow
              rows="3"
              placeholder="Tâche..."
              dense
              v-model="item['1']"
              append-icon="mdi-close-circle"
              @click:append="removeTask(item)"
            ></v-textarea>
          </template>
        </v-data-table>
        <v-btn rounded @click="addTask" class="my-2" dark color="indigo">
          <v-icon>mdi-plus-circle</v-icon>
          <div class="mx-2">tâche</div>
        </v-btn>
        <v-card-title>Prochaine réunion</v-card-title>
        <v-textarea
          auto-grow
          rows="3"
          v-model="comityData.nextReunion"
          filled
        ></v-textarea>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions
        ><v-row justify="center">
          <v-col sm="2">
            <v-text-field
              v-model="comityData.pvname"
              label="Nom du PV"
            ></v-text-field>
          </v-col>
          <v-col sm="2">
            <v-btn
              rounded
              color="dark-grey"
              class="text-center"
              dark
              @click="savepv"
              >Sauvegarder</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="2000" width="50">
      Page sauvegardée
      <v-icon dark>mdi-check-bold</v-icon>
    </v-snackbar>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import { RobotoRegular, RobotoBold } from "../fonts.js";
import { db } from "../firebase";

function textBloc(title, content) {
  this.title = title;
  this.content = content;
  this.edit = true;
}

export default {
  name: "transcript",
  data() {
    return {
      resetData: {
        society: "",
        heure: "",
        date: "",
        lieu: "",
        nextReunion: "",
        questions: [],
        items: [],
        membres: [],
        pvname: "",
      },
      comityData: {},
      snackbar: false,
      menu: false,
    };
  },
  firestore() {
    return {
      comityData: db.collection("comityData").doc("data"),
      pvref: db.collection("pvList"),
    };
  },
  methods: {
    lockdelete(index) {
      if (this.pvref[index].pvname == "PV d'exemple Jeunesse") {
        return true;
      } else {
        return false;
      }
    },
    presence(comityData) {
      var temp = "";
      for (let index = 0; index < comityData.membres.length; index++) {
        temp += comityData.membres[index] + ", ";
      }
      temp = temp.substring(0, temp.length - 2);
      return (temp += ".");
    },
    taches(comityData) {
      var temp = [];
      comityData.items.forEach((element) => {
        temp.push(Object.assign([], element));
      });
      return temp;
    },
    openpv(index) {
      var r = confirm("Êtes-vous sûr ? Le contenu actuel sera écrasé.");
      if (r == true) {
        this.$firestore.comityData.set(this.pvref[index]);
      }
    },
    updateData() {
      this.$firestore.comityData.set(this.comityData);
      this.snackbar = true;
    },
    edit(index) {
      this.comityData.questions[index].edit = !this.comityData.questions[index]
        .edit;
    },
    addQuestion(index) {
      this.comityData.questions[index].content.push("");
    },
    removeQuestion(index1, index2) {
      confirm("Êtes vous sûr de vouloir supprimer cet élément ?") &&
        this.comityData.questions[index1].content.splice(index2, 1);
    },
    addBloc() {
      this.comityData.questions.push(
        new textBloc("Titre de la question", ["Premier élément"])
      );
    },
    removeBloc(index) {
      confirm("Êtes vous sûr de vouloir supprimer cet élément ?") &&
        this.comityData.questions.splice(index, 1);
    },
    addTask() {
      this.comityData.items.push({
        0: "",
        1: "",
      });
    },
    removeTask(item) {
      const index = this.comityData.items.indexOf(item);
      confirm("Êtes vous sûr de vouloir supprimer cet élément ?") &&
        this.comityData.items.splice(index, 1);
    },
    clearData() {
      var r = confirm("Êtes-vous sûr ? Le contenu sera supprimé.");
      if (r == true) {
        this.$firestore.comityData.update(this.resetData);
      }
    },
    remove(item) {
      this.comityData.membres.splice(this.membres.indexOf(item), 1);
      this.comityData.membres = [...this.membres];
    },
    savepv() {
      this.$firestore.pvref.doc(this.comityData.pvname).set(this.comityData);
    },
    deletepv(index) {
      var r = confirm("Êtes-vous sûr de vouloir supprimer de PV ?");
      if (r == true) {
        this.$firestore.pvref.doc(this.pvref[index][".key"]).delete();
      }
    },
    createPDF(index) {
      var comityData = this.pvref[index];
      var doc = new jsPDF();

      doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
      doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

      doc.setFont("Roboto");

      doc.setFontSize(16);

      doc.text("PROCES VERBAL DE REUNION", 105, 20, null, null, "center");
      doc.text(comityData.society.toUpperCase(), 105, 27, null, null, "center");
      doc.line(10, 31, 200, 31);

      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("I.", 30, 50);
      doc.text("Mention de l'ouverture :", 40, 50);
      doc.setFontSize(12);

      doc.setFontStyle("normal");
      doc.text(
        doc.splitTextToSize(
          `Une séance ordinaire de la société "${comityData.society}" a été convoquée, à ${comityData.heure}, le ${comityData.date} ${comityData.lieu}, par le comité.`,
          160
        ),
        25,
        60
      );

      let h = 80;
      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("II.", 30, h);
      doc.text("En présence de :", 40, h);
      doc.setFontSize(12);

      h += 10;

      doc.setFontStyle("normal");
      doc.text(doc.splitTextToSize(this.presence(comityData), 160), 25, h);

      h +=
        15 +
        (doc.splitTextToSize(this.presence(comityData), 160).length - 1) * 5.5;

      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("III.", 30, h);
      doc.text("Questions abordées :", 40, h);
      doc.setFontSize(12);

      h += 10;

      for (let i = 0; i < comityData.questions.length; i++) {
        doc.setFontStyle("bold");
        doc.text(`${i + 1})  ${comityData.questions[i].title}`, 25, h);

        h += 8;

        doc.setFontStyle("normal");
        for (
          let index = 0;
          index < comityData.questions[i].content.length;
          index++
        ) {
          if (h >= 280) {
            doc.addPage();
            h = 20;
          }
          let numberOfLines =
            doc.splitTextToSize(comityData.questions[i].content[index], 160)
              .length - 1;

          doc.text("-", 25, h);
          doc.text(
            doc.splitTextToSize(comityData.questions[i].content[index], 160),
            30,
            h
          );

          h += 10 + numberOfLines * 5.5;
        }
      }

      if (h >= 280 - this.taches(comityData).length * 10) {
        doc.addPage();
        h = 20;
      }

      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("IV.", 30, h);
      doc.text("Tâches à effectuer prochainement :", 40, h);

      h += 10;

      doc.setFontStyle("normal");
      doc.setFontSize(12);

      doc.autoTable({
        theme: "grid",
        columnStyles: {
          0: {
            halign: "left",
            textColor: [0, 0, 0],
            fontSize: 12,
            lineColor: [100, 100, 100],
          },
          1: {
            halign: "left",
            textColor: [0, 0, 0],
            fontSize: 12,
            lineColor: [100, 100, 100],
          },
        },
        margin: { top: h, left: 25, right: 25 },
        body: this.taches(comityData),
        willDrawCell: function (HookData) {
          h += HookData.cell.height / 2;
        },
      });

      h += 12;

      if (h >= 280) {
        doc.addPage();
        h = 20;
      }

      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("V.", 30, h);
      doc.text("Prochaine réunion :", 40, h);

      h += 10;

      doc.setFontStyle("normal");
      doc.setFontSize(12);
      doc.text(doc.splitTextToSize(comityData.nextReunion, 160), 25, h);
      doc.save(comityData.pvname + ".pdf");
      //doc.output("dataurlnewwindow");
    },
  },
};
</script>

<style>
.v-list-item__content {
  justify-content: left;
  text-align: left;
  display: grid;
}
</style>