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
          <v-dialog v-model="dialog" max-width="600px" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nouveau membre</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Nouveau membre</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-avatar class="ma-3" size="125" tile>
                    <v-img :src="avatar"></v-img>
                  </v-avatar>

                  <v-file-input
                    ref="fileupload"
                    :rules="rules"
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Choisir une photo"
                    prepend-icon="mdi-camera"
                    label="Photo"
                    @change="uploadImageNew"
                  ></v-file-input>
                  <v-text-field v-model="lastName" label="Nom"></v-text-field>

                  <v-text-field v-model="firstName" label="Prénom"></v-text-field>

                  <v-combobox v-model="post" :items="postsList.posts" label="Poste"></v-combobox>

                  <v-text-field v-model="email" label="Email"></v-text-field>

                  <v-text-field
                    v-model="birthday"
                    label="Date de naissance"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    @blur="date = parseDate(dateFormatted)"
                  ></v-text-field>

                  <v-text-field
                    v-model="entry"
                    label="Date d'entrée"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                    @blur="date = parseDate(dateFormatted)"
                  ></v-text-field>
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
      <template v-slot:footer>
        <v-toolbar flat>
          <download-excel
            class="export-excel-wrapper"
            :data="memberList"
            :fields="json_field"
            :name="filename"
          >
            <v-btn>Exporter vers Excel</v-btn>
          </download-excel>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-dialog v-model="modifDialog" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">Modifier membre</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="infoModal.avatar"></v-img>
            </v-avatar>

            <v-file-input
              ref="fileupload"
              :rules="rules"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Choisir une photo"
              prepend-icon="mdi-camera"
              label="Photo"
              @change="uploadImage"
            ></v-file-input>

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
                <v-combobox v-model="infoModal.post" :items="postsList.posts" label="Poste"></v-combobox>
              </v-col>
            </v-row>
            <v-text-field v-model="infoModal.email" label="Email"></v-text-field>

            <v-text-field
              v-model="infoModal.birthday"
              label="Date de naissance"
              hint="MM/DD/YYYY format"
              persistent-hint
              @blur="date = parseDate(dateFormatted)"
            ></v-text-field>

            <v-text-field
              v-model="infoModal.entry"
              label="Date d'entrée"
              hint="MM/DD/YYYY format"
              persistent-hint
              @blur="date = parseDate(dateFormatted)"
            ></v-text-field>
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
import { db, st } from "../firebase";

export default {
  name: "Members",

  data() {
    return {
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!"
      ],
      activeButton: null,
      dialog: false,
      modifDialog: false,
      headers: [
        { value: "firstName", text: "Prénom", sortable: true },
        { value: "lastName", text: "Nom", sortable: true },
        { value: "post", text: "Poste", sortable: true },
        { value: "email", text: "Email", sortable: true },
        { value: "birthday", text: "Date de naissance", sortable: true },
        { value: "entry", text: "Date d'entrée", sortable: true },
        { value: "actions", text: "Actions", sortable: false }
      ],
      memberList: [],
      lastName: "",
      firstName: "",
      post: null,
      email: "",
      birthday: "",
      entry: "",
      filter: null,
      infoModal: {
        avatar: require("@/assets/default.png"),
        id: "",
        firstName: "",
        lastName: "",
        post: "",
        email: "",
        birthday: "",
        entry: "",
        key: ""
      },
      dMember: {},
      postsList: {},
      json_field: {
        Prenom: "firstName",
        Nom: "lastName",
        Poste: "post",
        Email: "email",
        "Date de naissance": "birthday",
        "Date d' entree": "entry"
      },
      avatar: require("@/assets/default.png")
    };
  },
  firestore() {
    return {
      memberList: db.collection("memberList"),
      postsList: db.collection("postsList").doc("list")
    };
  },
  computed: {
    filename() {
      const today = new Date();
      const date =
        today.getDate() +
        "_" +
        (today.getMonth() + 1) +
        "_" +
        today.getFullYear();
      const time = today.getHours() + "h" + today.getMinutes();
      const dateTime = date + "_" + time;
      return "Liste_des_membres_" + dateTime;
    }
  },
  methods: {
    uploadImage(event) {
      let file = event;

      var storageRef = st.ref(
        "photo_membre/" + "pic_" + this.infoModal.id + ".png"
      );

      let uploadTask = storageRef.put(file);
      uploadTask.on(
        "state_changed", // or 'state_changed'
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            if (downloadURL) {
              this.infoModal.avatar = downloadURL;
            }
          });
        }
      );
    },
    uploadImageNew(event) {
      let file = event;

      var storageRef = st.ref(
        "photo_membre/" + "pic_" + (this.memberList.length + 1) + ".png"
      );

      let uploadTask = storageRef.put(file);
      uploadTask.on(
        "state_changed", // or 'state_changed'
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            if (downloadURL) {
              this.avatar = downloadURL;
            }
          });
        }
      );
    },
    resetActiveButton() {
      this.$nextTick(() => {
        this.activeButton = null;
      });
    },
    addMember() {
      var id = this.memberList.length + 1;
      this.$firestore.memberList
        .add({
          id: id,
          lastName: this.lastName,
          firstName: this.firstName,
          post: this.post,
          email: this.email,
          birthday: this.birthday,
          entry: this.entry
        })
        .then(() => {
          this.dialog = false;
          this.lastName = "";
          this.firstName = "";
          this.post = null;
          this.email = "";
          this.birthday = "";
          this.entry = "";
          this.avatar = require("@/assets/default.png");
        });
    },
    modifyMember() {
      db.collection("memberList")
        .doc(this.infoModal.key)
        .update({
          firstName: this.infoModal.firstName,
          lastName: this.infoModal.lastName,
          post: this.infoModal.post,
          email: this.infoModal.email,
          birthday: this.infoModal.birthday,
          entry: this.infoModal.entry
        })
        .then(() => {
          this.modifDialog = false;
          //Reset modal
          this.infoModal.firstName = "";
          this.infoModal.lastName = "";
          this.infoModal.post = null;
          this.infoModal.email = "";
          this.infoModal.key = "";
          this.infoModal.birthday = "";
          this.infoModal.entry = "";
          this.infoModal.avatar = "";
        });
    },
    cancelModify() {
      this.modifDialog = false;
      //Reset modal
      this.infoModal.firstName = "";
      this.infoModal.lastName = "";
      this.infoModal.post = "";
      this.infoModal.email = "";
      this.infoModal.key = "";
      this.infoModal.birthday = "";
      this.infoModal.entry = "";
      this.infoModal.avatar = "";
    },

    info(item) {
      st.ref("photo_membre/" + "pic_" + item.id + ".png")
        .getDownloadURL()
        .then(downloadURL => {
          this.infoModal.avatar = downloadURL;
        })
        .catch(() => {
          this.infoModal.avatar = require("@/assets/default.png");
        });
      this.infoModal.firstName = item.firstName;
      this.infoModal.lastName = item.lastName;
      this.infoModal.post = item.post;
      this.infoModal.email = item.email;
      this.infoModal.birthday = item.birthday;
      this.infoModal.entry = item.entry;
      this.infoModal.key = item[".key"];
      this.infoModal.id = item.id;
      this.modifDialog = true;
    },
    deleteMember(member) {
      var r = confirm(
        "Êtes-vous sûr de vouloir supprimer " +
          member.firstName +
          " " +
          member.lastName +
          " ?"
      );
      if (r == true) {
        this.$firestore.memberList.doc(member[".key"]).delete();
        var desertRef = st.ref("photo_membre/" + "pic_" + member.id + ".png");
        // Delete the file
        desertRef.delete().then(function() {
          console.log("Image from member deleted successfully");
        });
      }
    }
  }
};
</script>
