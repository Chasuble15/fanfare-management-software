<template>
  <div class="transcript">
    <h1 class="pa-md-4 mx-lg-auto">PV Maker</h1>
    <v-card>
      <v-toolbar flat color="blue-grey" dark>
        <v-toolbar-title>Réunion du comité</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              filled
              label="Nom de la société"
              v-model="society"
              hint="p. ex. Jeunesse de Chamoson"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              filled
              label="Lieu de la réunion"
              v-model="lieu"
              hint="p. ex. chez Olivier"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field filled label="Heure de la réunion" v-model="heure" hint="p. ex. 20h"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              filled
              label="Date de la réunion"
              v-model="date"
              hint="p. ex. 09 novembre 2018"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-item-group multiple>
          <v-subheader>Présence</v-subheader>
          <v-item v-for="membre in membres" :key="membre.name">
            <v-chip
              class="ma-2"
              active-class="purple--text"
              @click="membre.active = !membre.active"
              :input-value="membre.active"
            >{{ membre.name }}</v-chip>
          </v-item>
        </v-item-group>

        <v-subheader>Questions posées</v-subheader>
        <v-container fluid v-for="(question, u) in questions" :key="u">
          <v-card class="mx-auto">
            <v-card-title>
              {{question.title}}
              <v-btn icon @click="editor = !editor">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-card-title>
            <v-list flat subheader>
              <v-list-item-group color="primary">
                <v-list-item v-for="(post, i) in questions[u].content" :key="i">
                  <v-list-item-icon>
                    <v-icon>mdi-circle-medium</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content v-if="!editor" class="d-flex left">{{post}}</v-list-item-content>
                  <v-list-item-content v-else class="d-flex left">
                    <v-textarea dense v-model="question.content[i]" filled></v-textarea>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-container>

        <v-divider class="my-2"></v-divider>

        <v-btn color="blue-grey" dark @click="createPDF">Create PDF</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import { RobotoRegular, RobotoBold } from "../fonts.js";

/*function textBloc(title, content) {
  this.title = title;
  this.content = content;
}*/

export default {
  name: "transcript",
  data() {
    return {
      editor: false,
      pdfName: "Procès-Verbal",
      society: "Jeunesse de Chamoson",
      heure: "20h",
      date: "09 novembre 2018",
      lieu: "chez Olivier",
      membres: [
        {
          name: "David Carrupt",
          active: true
        },
        {
          name: "Olivier Carruzzo",
          active: true
        },
        {
          name: "Julien Dénis",
          active: true
        },
        {
          name: "Nicolas Carrupt",
          active: true
        },
        {
          name: "Clémence Thurre",
          active: true
        }
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
          ]
        },
        {
          title: "Divers",
          content: [
            "Téléthon : 6 personnes.",
            "Noss : coup de main et mise en place et rangement le lendemain.",
            "Assemblée générale et souper : samedi 2 février",
            "Carnaval : 4 mars"
          ]
        }
      ],
      taches: [
        [
          "David",
          "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation"
        ],
        [
          "Clémence",
          "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation"
        ],
        [
          "Julien",
          "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation"
        ],
        [
          "Tous",
          "Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation. Recontacter la commune pour l’autorisation."
        ]
      ]
    };
  },
  computed: {
    presence() {
      var temp = "";
      for (let index = 0; index < this.membres.length; index++) {
        if (this.membres[index].active == true) {
          temp += this.membres[index].name + ", ";
        }
      }
      temp = temp.substring(0, temp.length - 2);
      return (temp += ".");
    }
  },
  methods: {
    edit(index) {
      this.editor = true;
      console.log(index);
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
      doc.text(this.society.toUpperCase(), 105, 27, null, null, "center");
      doc.line(10, 31, 200, 31);

      doc.setFontSize(13);
      doc.setFontStyle("bold");
      doc.text("I.", 30, 50);
      doc.text("Mention de l'ouverture :", 40, 50);
      doc.setFontSize(12);

      doc.setFontStyle("normal");
      doc.text(
        doc.splitTextToSize(
          `Une séance ordinaire de la société "${this.society}" a été convoquée, à ${this.heure}, le ${this.date} ${this.lieu}, par le comité.`,
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

      for (let i = 0; i < this.questions.length; i++) {
        doc.setFontStyle("bold");
        doc.text(`${i + 1})  ${this.questions[i].title}`, 25, h);

        h += 8;

        doc.setFontStyle("normal");
        for (let index = 0; index < this.questions[i].content.length; index++) {
          if (h >= 280) {
            doc.addPage();
            h = 20;
          }
          let numberOfLines =
            doc.splitTextToSize(this.questions[i].content[index], 160).length -
            1;

          doc.text("-", 25, h);
          doc.text(
            doc.splitTextToSize(this.questions[i].content[index], 160),
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
      doc.text(doc.splitTextToSize(`A définir.`, 160), 25, h);
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