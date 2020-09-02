<template>
  <div class="transcript" style="text-align: center;">
    <h1 class="pa-md-4 mx-lg-auto">PV Maker</h1>
    <v-card>
      <v-toolbar flat color="blue-grey" dark>
        <v-toolbar-title>Réunion du comité</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="example">Exemple</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="clearData">Clear les champs</v-btn>
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

        <v-subheader>Présence</v-subheader>
        <v-combobox
          v-model="comityData.membres"
          chips
          clearable
          label="Membres présents à la réunion"
          multiple
          solo
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="remove(item)"
            >
              <strong>{{ item }}</strong>
              &nbsp;
            </v-chip>
          </template>
        </v-combobox>

        <v-subheader>Questions posées</v-subheader>
        <v-container fluid v-for="(question, u) in comityData.questions" :key="u">
          <v-card class="mx-auto">
            <v-card-title v-if="!comityData.questions[u].edit">
              {{question.title}}
              <v-btn icon @click="edit(u)">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-title v-else>
              <v-row>
                <v-col>
                  <v-text-field solo v-model="comityData.questions[u].title"></v-text-field>
                </v-col>
                <v-col class="text-right">
                  <v-btn @click="removeBloc(u)" class="mx-2" dark color="red">
                    <v-icon>mdi-close</v-icon>bloc
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-list flat subheader>
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
                  >{{question}}</v-list-item-content>
                  <v-list-item-content v-else class="d-flex left">
                    <v-textarea
                      dense
                      v-model="comityData.questions[u].content[i]"
                      filled
                      append-icon="mdi-close"
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
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              @click="edit(u)"
              v-show="comityData.questions[u].edit"
              color="blue-grey"
              dark
              class="my-6"
            >Valider</v-btn>
          </v-card>
        </v-container>
        <v-btn @click="addBloc" class="mx-2" dark color="indigo">
          <v-icon>mdi-plus</v-icon>bloc
        </v-btn>
        <v-subheader>Tâches à effectuer prochainement</v-subheader>
        <v-data-table
          dense
          hide-default-footer
          :items="comityData.items"
          :headers="comityData.headers"
          disable-sort
        >
          <template v-slot:item.0="{ item }">
            <v-text-field placeholder="Nom..." filled dense v-model="item['0']"></v-text-field>
          </template>
          <template v-slot:item.1="{ item }">
            <v-textarea
              placeholder="Tâche..."
              dense
              v-model="item['1']"
              append-icon="mdi-close"
              @click:append="removeTask(item)"
            ></v-textarea>
          </template>
        </v-data-table>
        <v-btn @click="addTask" class="mx-2" dark color="indigo">
          <v-icon>mdi-plus</v-icon>tâche
        </v-btn>
        <v-subheader>Prochaine réunion</v-subheader>
        <v-textarea v-model="comityData.nextReunion" filled></v-textarea>
        <v-divider class="my-2"></v-divider>
        <v-btn color="blue-grey" class="text-center" dark @click="createPDF">Create PDF</v-btn>
      </v-card-text>
    </v-card>
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
        membres: []
      },
      exampleData: {
        pdfName: "Procès-Verbal",
        society: "Jeunesse de Chamoson",
        heure: "20h",
        date: "09 novembre 2018",
        lieu: "chez Olivier",
        nextReunion: "A définir...",
        membres: [
          "David Carrupt",
          "Olivier Carruzzo",
          "Julien Dénis",
          "Nicolas Carrupt",
          "Clémence Thurre"
        ],
        questions: [
          {
            title: "Volley",
            content: [
              "Refaire de la pub.",
              "Nourriture : frites demander à Egglof les proportions. Acheter minimum 30kg. 100 saucisses, 100 tranches de porc.",
              "Feldschlosschen : tireuse, blanche et blonde.",
              "Vin : pas besoin d’acheter, stock.",
              "Sponsors : Raiffaisen (David), Menuiserie Carr. (David), Charlie Moulin (Nicolas), ESC (Olivier), Dom Rénovation (Jordan), Garage des Plantys(Olivier), Valelectric (David), Fuchs (Clémence), Atra SA (Rémy) Martin Michel Transport (Rémy), Haut de Cry Paysage (Crettenand), Favre Alain Transport (Sylvain), CX (Olivier).",
              "Doodle :  pour les bénévoles. Caisse, bar, nourriture. 17h-20h-23h-02h. Besoin de monde pour le montage. 2p. caisse, bar 3-4 p., food 2-4 p. "
            ],
            edit: false
          },
          {
            title: "Divers",
            content: [
              "Téléthon : 6 personnes.",
              "Noss : coup de main et mise en place et rangement le lendemain.",
              "Assemblée générale et souper : samedi 2 février",
              "Carnaval : 4 mars"
            ],
            edit: false
          }
        ],
        headers: [
          {
            text: "Membre",
            value: "0",
            width: "200px"
          },
          {
            text: "Tâche",
            value: "1"
          }
        ],
        items: [
          {
            0: "David",
            1: "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation"
          },
          {
            0: "Clémence",
            1: "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation"
          },
          {
            0: "Julien",
            1: "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation"
          },
          {
            0: "Tous",
            1: "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation."
          }
        ]
      },
      comityData: {}
    };
  },

  computed: {
    presence() {
      var temp = "";
      for (let index = 0; index < this.comityData.membres.length; index++) {
        temp += this.comityData.membres[index] + ", ";
      }
      temp = temp.substring(0, temp.length - 2);
      return (temp += ".");
    },
    taches() {
      var temp = [];
      this.comityData.items.forEach(element => {
        temp.push(Object.assign([], element));
      });
      return temp;
    }
  },
  firestore() {
    return {
      comityData: db.collection("comityData").doc("data")
    };
  },
  methods: {
    example() {
      this.$firestore.comityData.update(this.exampleData);
    },
    edit(index) {
      this.comityData.questions[index].edit = !this.comityData.questions[index]
        .edit;
    },
    addQuestion(index) {
      this.comityData.questions[index].content.push("");
    },
    removeQuestion(index1, index2) {
      confirm("Are you sure you want to delete this item?") &&
        this.comityData.questions[index1].content.splice(index2, 1);
    },
    addBloc() {
      this.comityData.questions.push(
        new textBloc("Titre du bloc", ["Premier élément"])
      );
    },
    removeBloc(index) {
      confirm("Are you sure you want to delete this item?") &&
        this.comityData.questions.splice(index, 1);
    },
    addTask() {
      this.comityData.items.push({
        0: "",
        1: ""
      });
    },
    removeTask(item) {
      const index = this.comityData.items.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.comityData.items.splice(index, 1);
    },
    clearData() {
      this.$firestore.comityData.update(this.resetData);
    },
    remove(item) {
      this.comityData.membres.splice(this.membres.indexOf(item), 1);
      this.comityData.membres = [...this.membres];
    },
    createPDF() {
      var doc = new jsPDF();

      doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegular);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.addFileToVFS("Roboto-Bold.ttf", RobotoBold);
      doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

      doc.setFont("Roboto");

      doc.setFontSize(16);

      doc.text("PROCES VERBAL DE REUNION", 105, 20, null, null, "center");
      doc.text(
        this.comityData.society.toUpperCase(),
        105,
        27,
        null,
        null,
        "center"
      );
      doc.line(10, 31, 200, 31);

      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("I.", 30, 50);
      doc.text("Mention de l'ouverture :", 40, 50);
      doc.setFontSize(12);

      doc.setFontStyle("normal");
      doc.text(
        doc.splitTextToSize(
          `Une séance ordinaire de la société "${this.comityData.society}" a été convoquée, à ${this.comityData.heure}, le ${this.comityData.date} ${this.comityData.lieu}, par le comité.`,
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
      doc.text(doc.splitTextToSize(this.presence, 160), 25, h);

      h += 15 + (doc.splitTextToSize(this.presence, 160).length - 1) * 5.5;

      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("III.", 30, h);
      doc.text("Questions abordées :", 40, h);
      doc.setFontSize(12);

      h += 10;

      for (let i = 0; i < this.comityData.questions.length; i++) {
        doc.setFontStyle("bold");
        doc.text(`${i + 1})  ${this.comityData.questions[i].title}`, 25, h);

        h += 8;

        doc.setFontStyle("normal");
        for (
          let index = 0;
          index < this.comityData.questions[i].content.length;
          index++
        ) {
          if (h >= 280) {
            doc.addPage();
            h = 20;
          }
          let numberOfLines =
            doc.splitTextToSize(
              this.comityData.questions[i].content[index],
              160
            ).length - 1;

          doc.text("-", 25, h);
          doc.text(
            doc.splitTextToSize(
              this.comityData.questions[i].content[index],
              160
            ),
            30,
            h
          );

          h += 10 + numberOfLines * 5.5;
        }
      }

      if (h >= 280 - this.taches.length * 10) {
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
            lineColor: [100, 100, 100]
          },
          1: {
            halign: "left",
            textColor: [0, 0, 0],
            fontSize: 12,
            lineColor: [100, 100, 100]
          }
        },
        margin: { top: h, left: 25, right: 25 },
        body: this.taches,
        willDrawCell: function(HookData) {
          h += HookData.cell.height / 2;
        }
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
      doc.text(doc.splitTextToSize(this.comityData.nextReunion, 160), 25, h);
      //doc.save(this.pdfName + ".pdf");
      doc.output("dataurlnewwindow");
    }
  }
};
</script>

<style>
.v-list-item__content {
  justify-content: left;
  text-align: left;
  display: grid;
}
</style>