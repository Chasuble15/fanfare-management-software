<template>
  <div class="formation" style="text-align: center">
    <!-- Title -->
    <h1 class="pa-md-4 mx-lg-auto">Inventaire</h1>

    <!-- Inventory data table -->
    <v-data-table
      :items="instrumentList"
      :headers="headers"
      item-key="name"
      class="elevation-1"
      :search="filter"
      disable-pagination
    >
      <!-- Entête de la table -->
      <template v-slot:top>
        <v-toolbar flat color="white">
          <!-- Filtre de recherche -->
          <v-text-field
            v-model="filter"
            type="search"
            id="filterInput"
            placeholder="Rechercher..."
          ></v-text-field>
          <v-spacer></v-spacer>

          <!-- Boite de dialogue "Ajouter instrument" -->
          <v-dialog v-model="dialog" max-width="600px" scrollable>
            <!-- Bouton -->
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >Ajouter instrument</v-btn
              >
            </template>

            <!-- Card Ajouter instrument -->
            <v-card>
              <v-card-title>
                <span class="headline">Ajouter Instrument</span>
              </v-card-title>

              <v-card-text>
                <v-container fluid>
                  <v-text-field
                    v-model="name"
                    label="Instrument"
                  ></v-text-field>

                  <v-text-field
                    v-model="serial"
                    label="N° de série"
                  ></v-text-field>

                  <template>
                    <v-menu
                      ref="menuService"
                      v-model="menuService"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="service"
                          label="Date du dernier service"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        ref="picker"
                        v-model="service"
                        :max="new Date().toISOString()"
                        min="1950-01-01"
                        @change="saveService"
                        locale="fr-CH"
                      ></v-date-picker>
                    </v-menu>
                  </template>
                  <!-- <v-text-field
                      v-model="service"
                      label="Date du dernier service"
                    ></v-text-field> -->

                  <v-slider
                    v-model="state"
                    min="0"
                    max="100"
                    label="Etat"
                  ></v-slider>

                  <v-checkbox v-model="free" label="Occupé ?"></v-checkbox>

                  <!-- Selecteur possesseur -->
                  <v-row v-if="free">
                    <v-col>
                      <v-overflow-btn
                        dense
                        v-model="possessorKey"
                        label="Possesseur"
                        :items="getPossessors()"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col>
                      <!-- Selecteur de date possesseur -->
                      <template>
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="date"
                              label="Date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            ref="picker"
                            v-model="date"
                            :max="new Date().toISOString()"
                            min="1950-01-01"
                            @change="save"
                            locale="fr-CH"
                          ></v-date-picker>
                        </v-menu>
                      </template>
                      <!-- <v-text-field
                          v-model="date"
                          label="Date"
                          append-icon="mdi-calendar-month"
                        ></v-text-field> -->
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelAdd"
                  >Annuler</v-btn
                >
                <v-btn color="blue darken-1" text @click="addInstrument"
                  >Ajouter</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- Colonne Libre -->
      <template v-slot:item.free="{ item }">
        <v-icon v-if="!item.free" color="teal">mdi-check</v-icon>
        <v-icon v-else color="pink">mdi-close</v-icon>
      </template>

      <!-- Colonne Possesseur -->
      <template v-slot:item.possessorKey="{ item }">
        {{ getPossessorName(item.possessorKey) }}
      </template>

      <!-- Colonne Etat -->
      <template v-slot:item.state="{ item }">
        <v-progress-circular
          :rotate="360"
          :size="20"
          :width="4"
          :value="item.state"
          color="teal"
        ></v-progress-circular>
      </template>

      <!-- Colonne Modifier/Supprimer -->
      <template v-slot:item.actions="{ item }">
        <v-btn-toggle v-model="activeButton" @change="resetActiveButton">
          <v-btn small @click.stop="editModal(item)">Modifier</v-btn>
          <v-btn small @click="deleteInstr(item)">Supprimer</v-btn>
        </v-btn-toggle>
      </template>
    </v-data-table>

    <!-- Edit item dialog -->
    <v-dialog v-model="editDialog" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">Modifier instrument</span>
        </v-card-title>

        <v-card-text>
          <v-container fluid>
            <v-text-field v-model="edit.name" label="Instrument"></v-text-field>

            <v-text-field
              v-model="edit.serial"
              label="N° de série"
            ></v-text-field>

            <v-text-field
              v-model="edit.service"
              label="Date du dernier service"
            ></v-text-field>

            <v-slider
              v-model="edit.state"
              min="0"
              max="100"
              label="Etat"
            ></v-slider>

            <v-checkbox v-model="edit.free" label="Occupé ?"></v-checkbox>

            <!-- Selecteur possesseur -->
            <v-row v-if="edit.free">
              <v-col>
                <v-overflow-btn
                  dense
                  v-model="edit.possessorKey"
                  label="Possesseur"
                  :items="getPossessors()"
                ></v-overflow-btn>
              </v-col>
              <v-col>
                <!-- Selecteur de date possesseur -->

                <v-text-field
                  v-model="edit.date"
                  label="Date"
                  append-icon="mdi-calendar-month"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false"
            >Annuler</v-btn
          >
          <v-btn color="blue darken-1" text @click="modifyMember"
            >Modifier</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "../firebase";

function member(text, value) {
  this.text = text;
  this.value = value;
}

export default {
  name: "Inventory",

  data() {
    return {
      headers: [
        { value: "name", text: "Instrument", sortable: true },
        { value: "serial", text: "N° de série", sortable: true },
        { value: "state", text: "Etat", sortable: true },
        { value: "service", text: "Dernier service", sortable: true },
        { value: "free", text: "Libre", sortable: true },
        { value: "possessorKey", text: "Possesseur", sortable: true },
        { value: "date", text: "Date d'aquisition", sortable: true },
        { value: "actions", text: "Actions", sortable: false },
      ],
      instrumentList: [],
      possessorKey: null,
      date: "",
      menu: false,
      menuService: false,
      filter: null,
      dialog: false,
      editDialog: false,
      name: "",
      serial: "",
      state: 50,
      service: "",
      free: false,
      activeButton: null,
      edit: {
        name: "",
        serial: "",
        state: "",
        service: "",
        free: true,
        key: "",
        possessorKey: "",
        date: "",
      },
    };
  },

  firestore() {
    return {
      instrumentList: db.collection("instrumentList"),
      memberList: db.collection("memberList"),
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    menuService(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  methods: {
    editModal(item) {
      this.editDialog = true;
      this.edit.name = item.name;
      this.edit.serial = item.serial;
      this.edit.state = item.state;
      this.edit.service = item.service;
      this.edit.free = item.free;
      this.edit.key = item[".key"];
      this.edit.possessorKey = item.possessorKey;
      this.edit.date = item.date;
    },
    modifyMember() {
      if (!this.edit.free) {
        db.collection("instrumentList")
          .doc(this.edit.key)
          .update({
            name: this.edit.name,
            serial: this.edit.serial,
            state: this.edit.state,
            service: this.edit.service,
            free: this.edit.free,
            possessorKey: null,
            date: "",
          })
          .then(() => {
            //Reset modal
            this.editDialog = false;
            this.edit.name = "";
            this.edit.serial = "";
            this.edit.state = 50;
            this.edit.service = "";
            this.edit.free = false;
            this.edit.possessorKey = null;
            this.edit.date = "";
          });
      } else {
        db.collection("instrumentList")
          .doc(this.edit.key)
          .update({
            name: this.edit.name,
            serial: this.edit.serial,
            state: this.edit.state,
            service: this.edit.service,
            free: this.edit.free,
            possessorKey: this.edit.possessorKey,
            date: this.edit.date,
          })
          .then(() => {
            //Reset modal
            this.editDialog = false;
            this.edit.name = "";
            this.edit.serial = "";
            this.edit.state = 50;
            this.edit.service = "";
            this.edit.free = false;
            this.edit.possessorKey = null;
            this.edit.date = "";
          });
      }
    },
    cancelModify() {
      //Reset modal
      this.editDialog = false;
      this.edit.name = "";
      this.edit.serial = "";
      this.edit.state = 50;
      this.edit.service = "";
      this.edit.free = false;
      this.edit.possessorKey = "";
      this.edit.date = "";
    },
    getPossessors() {
      var possessors = [];
      this.memberList.forEach((element) => {
        possessors.push(
          new member(
            element.firstName + " " + element.lastName,
            element[".key"]
          )
        );
      });
      return possessors;
    },
    getPossessorName(key) {
      if (key) {
        const resultat = this.memberList.find(
          (member) => member[".key"] === key
        );
        return resultat.firstName + " " + resultat.lastName;
      } else {
        return "";
      }
    },
    addInstrument() {
      const possessor = this.getPossessorName(this.possessorKey);
      this.$firestore.instrumentList
        .add({
          name: this.name,
          serial: this.serial,
          state: this.state,
          service: this.service,
          free: this.free,
          date: this.date,
          possessorKey: this.possessorKey,
          possessor: possessor,
        })
        .then(() => {
          this.dialog = false;
          this.resetFields();
        });
    },
    cancelAdd() {
      this.dialog = false;
      this.resetFields();
    },
    resetFields() {
      this.name = "";
      this.serial = "";
      this.state = 50;
      this.service = null;
      this.free = false;
      this.dialog = false;
      this.possessorKey = null;
      this.date = "";
    },
    deleteInstr(instrument) {
      var r = confirm(
        "Êtes-vous sûr de vouloir supprimer " + instrument.name + " ?"
      );
      if (r == true) {
        this.$firestore.instrumentList.doc(instrument[".key"]).delete();
      }
    },
    resetActiveButton() {
      this.$nextTick(() => {
        this.activeButton = null;
      });
    },

    // Date management
    save(date) {
      const dateformated = this.formatDate(date);
      console.log(dateformated);
      this.$refs.menu.save(dateformated);
      this.date = dateformated;
    },
    saveService(date) {
      const dateformated = this.formatDate(date);
      this.memberList.forEach((element) => {
        console.log(element.firstName);
      });
      this.$refs.menuService.save(dateformated);
      this.service = dateformated;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
  },
};
</script>