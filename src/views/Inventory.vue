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

                  <v-slider v-model="state" min="-100" max="100" label="Etat"></v-slider>

                  <v-checkbox v-model="busy" label="Occupé ?"></v-checkbox>
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
    </v-data-table>
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
        { value: "busy", text: "Occupé", sortable: true }
      ],
      instrumentList: [],
      filter: null,
      dialog: false,
      name: "",
      serial: "",
      state: "",
      service: "",
      busy: false
    };
  },
  firestore() {
    return {
      instrumentList: db.collection("instrumentList")
    };
  },
  methods: {
    addInstrument() {
      var id = this.instrumentList.length + 1;
      this.$firestore.instrumentList
        .add({
          id: id,
          name: this.name,
          serial: this.serial,
          state: this.state,
          service: this.service,
          busy: this.busy
        })
        .then(() => {
          this.name = "";
          this.serial = "";
          this.state = "";
          this.service = null;
          this.busy = false;
          this.dialog = false;
        });
    }
  }
};
</script>