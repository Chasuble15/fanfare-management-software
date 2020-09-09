<template>
  <div class="formation" style="text-align: center;">
    <h1 class="pa-md-4 mx-lg-auto">Inventaire</h1>
    <v-data-table
      :items="instrumentList"
      :headers="headers"
      item-key="name"
      class="elevation-1"
      :search="filter"
      disable-pagination
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field v-model="filter" type="search" id="filterInput" placeholder="Rechercher..."></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Ajouter instrument</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Ajouter instrument</span>
              </v-card-title>

              <v-card-text>
                <v-container fluid>
                  <v-text-field v-model="name" label="Instrument"></v-text-field>

                  <v-text-field v-model="serial" label="N° de série"></v-text-field>

                  <v-text-field v-model="service" label="Dernier service"></v-text-field>

                  <v-slider v-model="state" min="0" max="100" label="Etat"></v-slider>

                  <v-checkbox v-model="free" label="Occupé ?"></v-checkbox>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="addInstrument">Ajouter</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.free="{ item }">
        <v-icon v-if="!item.free" color="teal">mdi-check</v-icon>
        <v-icon v-else color="pink">mdi-close</v-icon>
      </template>

      <template v-slot:item.state="{ item }">
        <v-progress-circular :rotate="360" :size="20" :width="4" :value="item.state" color="teal"></v-progress-circular>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn-toggle v-model="activeButton" @change="resetActiveButton">
          <v-btn small @click.stop="editModal(item)">Modifier</v-btn>
          <v-btn small @click="deleteInstr(item)">Supprimer</v-btn>
        </v-btn-toggle>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">Modifier instrument</span>
        </v-card-title>

        <v-card-text>
          <v-container fluid>
            <v-text-field v-model="edit.name" label="Instrument"></v-text-field>

            <v-text-field v-model="edit.serial" label="N° de série"></v-text-field>

            <v-text-field v-model="edit.service" label="Dernier service"></v-text-field>

            <v-slider v-model="edit.state" min="0" max="100" label="Etat"></v-slider>

            <v-checkbox v-model="edit.free" label="Occupé ?"></v-checkbox>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editDialog = false">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="modifyMember">Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "../firebase";
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
        { value: "actions", text: "Actions", sortable: false },
      ],
      instrumentList: [],
      filter: null,
      dialog: false,
      editDialog: false,
      name: "",
      serial: "",
      state: "",
      service: "",
      free: true,
      activeButton: null,
      edit: {
        name: "",
        serial: "",
        state: "",
        service: "",
        free: true,
        key: "",
      },
    };
  },
  firestore() {
    return {
      instrumentList: db.collection("instrumentList"),
    };
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
    },
    modifyMember() {
      db.collection("instrumentList")
        .doc(this.edit.key)
        .update({
          name: this.edit.name,
          serial: this.edit.serial,
          state: this.edit.state,
          service: this.edit.service,
          free: this.edit.free,
        })
        .then(() => {
          //Reset modal
          this.editDialog = false;
          this.edit.name = "";
          this.edit.serial = "";
          this.edit.state = "";
          this.edit.service = "";
          this.edit.free = true;
        });
    },
    cancelModify() {
      //Reset modal
      this.editDialog = false;
      this.edit.name = "";
      this.edit.serial = "";
      this.edit.state = "";
      this.edit.service = "";
      this.edit.free = true;
    },
    addInstrument() {
      var id = this.instrumentList.length + 1;
      this.$firestore.instrumentList
        .add({
          id: id,
          name: this.name,
          serial: this.serial,
          state: this.state,
          service: this.service,
          free: this.free,
        })
        .then(() => {
          this.name = "";
          this.serial = "";
          this.state = "";
          this.service = null;
          this.free = false;
          this.dialog = false;
        });
    },
    resetActiveButton() {
      this.$nextTick(() => {
        this.activeButton = null;
      });
    },
  },
};
</script>