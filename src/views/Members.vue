<template>
  <div class="members" style="text-align: center;">
    <h1 class="pa-md-4 mx-lg-auto">Membres</h1>

    <v-data-table
      :items="memberList"
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
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nouveau membre</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Nouveau membre</span>
              </v-card-title>

              <v-card-text>
                <v-container fluid>
                  <v-text-field v-model="lastName" label="Nom"></v-text-field>

                  <v-text-field v-model="firstName" label="Prénom"></v-text-field>

                  <v-combobox v-model="instrument" :items="postsList.posts" label="Instrument"></v-combobox>

                  <v-text-field
                    v-model="birthday"
                    label="Date de naissance"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    @blur="date = parseDate(dateFormatted)"
                  ></v-text-field>

                  <v-text-field v-model="entry" label="Date d'entrée"></v-text-field>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="addMember">Ajouter</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      "
      <template v-slot:item.actions="{ item }">
        <v-btn-toggle v-model="activeButton" @change="resetActiveButton">
          <v-btn small @click.stop="info(item)">Modifier</v-btn>
          <v-btn small @click="deleteMember(item)">Supprimer</v-btn>
        </v-btn-toggle>
      </template>
    </v-data-table>

    <v-dialog v-model="modifDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Modifier membre</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field v-model="infoModal.lastName" label="Nom"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="infoModal.firstName" label="Prénom"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-combobox
                  v-model="infoModal.instrument"
                  :items="postsList.posts"
                  label="Instrument"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="modifDialog = false">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="modifyMember">Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "Members",

  data() {
    return {
      activeButton: null,
      dialog: false,
      modifDialog: false,
      headers: [
        { value: "firstName", text: "Prénom", sortable: true },
        { value: "lastName", text: "Nom", sortable: true },
        { value: "instrument", text: "Instrument", sortable: true },
        { value: "birthday", text: "Date de naissance", sortable: true },
        { value: "entry", text: "Date d'entrée", sortable: true },
        { value: "actions", text: "Actions", sortable: false }
      ],
      memberList: [],
      lastName: "",
      firstName: "",
      instrument: null,
      birthday: "",
      entry: "",
      filter: null,
      infoModal: {
        id: "info-modal",
        firstName: "",
        lastName: "",
        instrument: "",
        birthday: "",
        entry: "",
        key: ""
      },
      dMember: {},
      postsList: {}
    };
  },
  firestore() {
    return {
      memberList: db.collection("memberList"),
      postsList: db.collection("postsList").doc("list")
    };
  },

  methods: {
    resetActiveButton() {
      this.$nextTick(() => {
        this.activeButton = null;
      });
    },
    addMember: function() {
      var id = this.memberList.length + 1;
      this.$firestore.memberList
        .add({
          id: id,
          lastName: this.lastName,
          firstName: this.firstName,
          instrument: this.instrument,
          birthday: this.birthday,
          entry: this.entry
        })
        .then(() => {
          this.dialog = false;
          this.lastName = "";
          this.firstName = "";
          this.instrument = null;
          this.birthday = "";
          this.entry = "";
        });
    },
    modifyMember() {
      db.collection("memberList")
        .doc(this.infoModal.key)
        .update({
          firstName: this.infoModal.firstName,
          lastName: this.infoModal.lastName,
          instrument: this.infoModal.instrument,
          birthday: this.infoModal.birthday,
          entry: this.infoModal.entry
        })
        .then(() => {
          this.modifDialog = false;
          //Reset modal
          this.infoModal.firstName = "";
          this.infoModal.lastName = "";
          this.infoModal.instrument = null;
          this.infoModal.key = "";
          this.infoModal.birthday = "";
          this.infoModal.entry = "";
        });
    },
    cancelModify() {
      this.modifDialog = false;
      //Reset modal
      this.infoModal.firstName = "";
      this.infoModal.lastName = "";
      this.infoModal.instrument = "";
      this.infoModal.key = "";
      this.infoModal.birthday = "";
      this.infoModal.entry = "";
    },
    info(item) {
      this.infoModal.firstName = item.firstName;
      this.infoModal.lastName = item.lastName;
      this.infoModal.instrument = item.instrument;
      this.infoModal.birthday = item.birthday;
      this.infoModal.entry = item.entry;
      this.infoModal.key = item[".key"];
      this.modifDialog = true;
    },
    deleteMember(member) {
      confirm("Are you sure you want to delete this item?") &&
        this.$firestore.memberList.doc(member[".key"]).delete();
    }
  }
};
</script>
