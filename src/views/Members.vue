<template>
  <div class="members" style="text-align: center">
    <h1 class="pa-md-4 mx-lg-auto">Membres</h1>

    <v-data-table
      :items="memberList"
      :headers="headers"
      item-key="name"
      class="elevation-1"
      :search="filter"
      disable-pagination
      @click:row="getDetail"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            v-model="filter"
            type="search"
            id="filterInput"
            placeholder="Rechercher..."
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >Nouveau membre</v-btn
              >

              <!-- NEW MEMBER template -->
            </template>
            <v-card>
              <v-card-title>
                <h3>Nouveau Membre</h3>
              </v-card-title>

              <v-card-text>
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

                <h3>Données personnelles</h3>
                <v-row>
                  <v-col>
                    <v-text-field v-model="lastName" label="Nom"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="firstName"
                      label="Prénom"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <template>
                      <div>
                        <v-text-field-simplemask
                          v-model="birthday"
                          label="Date de naissance"
                          v-bind:options="{
                            inputMask: '##/##/####',
                            outputMask: '##/##/####',
                            empty: null,
                            applyAfter: false,
                            alphanumeric: true,
                            lowerCase: false,
                          }"
                        />
                      </div>
                    </template>
                  </v-col>

                  <v-col>
                    <template>
                      <div>
                        <v-text-field-simplemask
                          v-model="entry"
                          label="Date d'entrée"
                          v-bind:options="{
                            inputMask: '##/##/####',
                            outputMask: '##/##/####',
                            empty: null,
                            applyAfter: false,
                            alphanumeric: true,
                            lowerCase: false,
                          }"
                        />
                      </div>
                    </template>
                  </v-col>
                </v-row>

                <v-combobox
                  v-model="post"
                  :items="postsList.posts"
                  label="Poste"
                ></v-combobox>

                <h3>Données de contact</h3>

                <v-text-field v-model="rue" label="Rue"></v-text-field>

                <v-row>
                  <v-col>
                    <v-text-field v-model="npa" label="NPA"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="commune"
                      label="Commune"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <template>
                      <div>
                        <v-text-field-simplemask
                          v-model="phone"
                          label="Numéro de téléphone"
                          v-bind:options="{
                            inputMask: '### ### ## ##',
                            outputMask: '### ### ## ##',
                            empty: null,
                            applyAfter: false,
                            alphanumeric: true,
                            lowerCase: false,
                          }"
                        />
                      </div>
                    </template>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="email" label="Email"></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false"
                  >Annuler</v-btn
                >
                <v-btn color="blue darken-1" text @click="addMember"
                  >Ajouter</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <div>
          <v-btn icon small @click.stop.prevent="info(item)"
            ><v-icon>mdi-pencil-circle</v-icon></v-btn
          >
          <v-btn icon small @click.stop.prevent="deleteMember(item)"
            ><v-icon>mdi-close-circle</v-icon></v-btn
          >
        </div>
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

    <!-- Modifier un membre dialog -->
    <v-dialog v-model="modifDialog" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          <h3>Modifier Membre</h3>
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

            <h3>Données personnelles</h3>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="infoModal.lastName"
                  label="Nom"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="infoModal.firstName"
                  label="Prénom"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <template>
                  <div>
                    <v-text-field-simplemask
                      v-model="infoModal.birthday"
                      label="Date de naissance"
                      v-bind:options="{
                        inputMask: '##/##/####',
                        outputMask: '##/##/####',
                        empty: null,
                        applyAfter: false,
                        alphanumeric: true,
                        lowerCase: false,
                      }"
                    />
                  </div>
                </template>
              </v-col>

              <v-col>
                <template>
                  <div>
                    <v-text-field-simplemask
                      v-model="infoModal.entry"
                      label="Date d'entrée"
                      v-bind:options="{
                        inputMask: '##/##/####',
                        outputMask: '##/##/####',
                        empty: null,
                        applyAfter: false,
                        alphanumeric: true,
                        lowerCase: false,
                      }"
                    />
                  </div>
                </template>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-combobox
                  v-model="infoModal.post"
                  :items="postsList.posts"
                  label="Poste"
                ></v-combobox>
              </v-col>
            </v-row>
            <h3>Données de contact</h3>

            <v-text-field v-model="infoModal.rue" label="Rue"></v-text-field>

            <v-row>
              <v-col>
                <v-text-field
                  v-model="infoModal.npa"
                  label="NPA"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="infoModal.commune"
                  label="Commune"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <template>
                  <div>
                    <v-text-field-simplemask
                      v-model="infoModal.phone"
                      label="Numéro de téléphone"
                      v-bind:options="{
                        inputMask: '### ### ## ##',
                        outputMask: '### ### ## ##',
                        empty: null,
                        applyAfter: false,
                        alphanumeric: true,
                        lowerCase: false,
                      }"
                    />
                  </div>
                </template>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="infoModal.email"
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="modifDialog = false"
            >Annuler</v-btn
          >
          <v-btn color="blue darken-1" text @click="modifyMember"
            >Modifier</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Detail info dialog -->
    <v-dialog v-model="detailDialog" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          <h3>{{ detail.firstName }} {{ detail.lastName }}</h3>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="detail.avatar"></v-img>
            </v-avatar>

            <template>
              <v-simple-table dense>
                <tbody>
                  <tr>
                    <td><b>Prénom</b></td>
                    <td>{{ detail.firstName }}</td>
                  </tr>
                  <tr>
                    <td><b>Nom</b></td>
                    <td>{{ detail.lastName }}</td>
                  </tr>
                  <tr>
                    <td><b>Date de naissance</b></td>
                    <td>{{ detail.birthday }}</td>
                  </tr>
                  <tr>
                    <td><b>Date d'entrée</b></td>
                    <td>{{ detail.entry }}</td>
                  </tr>
                  <tr>
                    <td><b>Poste</b></td>
                    <td>{{ detail.post }}</td>
                  </tr>
                  <tr>
                    <td><b>Rue</b></td>
                    <td>{{ detail.rue }}</td>
                  </tr>
                  <tr>
                    <td><b>NPA</b></td>
                    <td>{{ detail.npa }}</td>
                  </tr>
                  <tr>
                    <td><b>Commune</b></td>
                    <td>{{ detail.commune }}</td>
                  </tr>
                  <tr>
                    <td><b>Téléphone</b></td>
                    <td>{{ detail.phone }}</td>
                  </tr>
                  <tr>
                    <td><b>Email</b></td>
                    <td>{{ detail.email }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </template>
          </v-container>
        </v-card-text>
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
      focus: false,
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
      activeButton: null,
      dialog: false,
      modifDialog: false,
      headers: [
        { value: "firstName", text: "Prénom", sortable: true },
        { value: "lastName", text: "Nom", sortable: true },
        { value: "post", text: "Poste", sortable: true },
        { value: "email", text: "Email", sortable: true },
        { value: "phone", text: "Téléphone", sortable: true },
        { value: "birthday", text: "Date de naissance", sortable: true },
        { value: "entry", text: "Date d'entrée", sortable: true },
        { value: "actions", text: "Actions", sortable: false },
      ],
      memberList: [],
      lastName: "",
      firstName: "",
      post: null,
      email: "",
      birthday: "",
      entry: "",
      rue: "",
      npa: "",
      commune: "",
      phone: "",
      id: "",
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
        key: "",
        rue: "",
        npa: "",
        commune: "",
        phone: "",
      },
      dMember: {},
      postsList: {},
      json_field: {
        Prenom: "firstName",
        Nom: "lastName",
        Poste: "post",
        Email: "email",
        "Date de naissance": "birthday",
        "Date d' entree": "entry",
        Rue: "rue",
        NPA: "npa",
        Commune: "commune",
        Telephone: "phone",
      },
      avatar: require("@/assets/default.png"),
      detail: {},
      detailDialog: false,
    };
  },
  firestore() {
    return {
      memberList: db.collection("memberList"),
      postsList: db.collection("postsList").doc("list"),
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
    },
  },

  methods: {
    generateId() {
      let id = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
      console.log(id);
      return id;
    },
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            if (downloadURL) {
              this.infoModal.avatar = downloadURL;
            }
          });
        }
      );
    },
    uploadImageNew(event) {
      let file = event;
      this.id = this.generateId();
      var storageRef = st.ref("photo_membre/" + "pic_" + this.id + ".png");

      let uploadTask = storageRef.put(file);
      uploadTask.on(
        "state_changed", // or 'state_changed'
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
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
      if (this.id === "") {
        this.id = this.generateId();
      }
      this.$firestore.memberList
        .add({
          id: this.id,
          lastName: this.lastName,
          firstName: this.firstName,
          post: this.post,
          email: this.email,
          birthday: this.birthday,
          entry: this.entry,
          rue: this.rue,
          npa: this.npa,
          commune: this.commune,
          phone: this.phone,
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
          this.rue = "";
          this.npa = "";
          this.commune = "";
          this.phone = "";
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
          entry: this.infoModal.entry,
          rue: this.infoModal.rue,
          npa: this.infoModal.npa,
          commune: this.infoModal.commune,
          phone: this.infoModal.phone,
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
          this.infoModal.rue = "";
          this.infoModal.npa = "";
          this.infoModal.commune = "";
          this.infoModal.phone = "";
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
      this.infoModal.rue = "";
      this.infoModal.npa = "";
      this.infoModal.commune = "";
      this.infoModal.phone = "";
    },

    info(item) {
      st.ref("photo_membre/" + "pic_" + item.id + ".png")
        .getDownloadURL()
        .then((downloadURL) => {
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
      this.infoModal.rue = item.rue;
      this.infoModal.npa = item.npa;
      this.infoModal.commune = item.commune;
      this.infoModal.phone = item.phone;
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
        desertRef.delete().then(function () {
          console.log("Image from member deleted successfully");
        });
      }
    },
    getDetail(value) {
      this.detail = value;
      st.ref("photo_membre/" + "pic_" + value.id + ".png")
        .getDownloadURL()
        .then((downloadURL) => {
          this.detail.avatar = downloadURL;
          console.log(this.detail);
          this.detailDialog = true;
        })
        .catch(() => {
          this.detail.avatar = require("@/assets/default.png");
          console.log(this.detail);
          this.detailDialog = true;
        });
    },
  },
};
</script>
