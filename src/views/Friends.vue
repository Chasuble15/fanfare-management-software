<template>
  <div class="friends" style="text-align: center">
    <h1 class="pa-md-4 mx-lg-auto">Club des Amis</h1>

    <v-data-table
      :items="friendsList"
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
          <v-dialog v-model="addDialog" max-width="600px" scrollable>
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
                <h3>Données personnelles</h3>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="friend.lastName"
                      label="Nom"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="friend.firstName"
                      label="Prénom"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="friend.compagny"
                      label="Entreprise"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-overflow-btn
                      append-icon="mdi-star-circle"
                      v-model="friend.type"
                      label="Type d'amis"
                      :items="friendTypes"
                      item-value="text"
                    >
                    </v-overflow-btn>
                  </v-col>
                </v-row>

                <h3>Données de contact</h3>

                <v-text-field v-model="friend.rue" label="Rue"></v-text-field>

                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="friend.npa"
                      label="NPA"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="friend.commune"
                      label="Commune"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <template>
                      <div>
                        <v-text-field-simplemask
                          v-model="friend.phone"
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
                      v-model="friend.email"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="addDialog = false"
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

      <template v-slot:item.type="{ item }">
        <v-icon v-if="item.type === 'Ami en Platine'" color="teal darken-1"
          >mdi-star-circle</v-icon
        >
        <v-icon v-if="item.type === 'Ami en Or'" color="amber accent-3"
          >mdi-star-circle</v-icon
        >
        <v-icon v-if="item.type === 'Ami en Argent'" color="blue-grey lighten-2"
          >mdi-star-circle</v-icon
        >
        <v-icon v-if="item.type === 'Ami en Bronze'" color="brown darken-1"
          >mdi-star-circle</v-icon
        >
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
            :data="friendsList"
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
            <v-col>
              <v-text-field
                v-model="infoModal.compagny"
                label="Entreprise"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-overflow-btn
                append-icon="mdi-star-circle"
                v-model="infoModal.type"
                label="Type d'amis"
                :items="friendTypes"
                item-value="text"
              >
              </v-overflow-btn>
            </v-col>
          </v-row>

          <h3>Données de contact</h3>

          <v-text-field v-model="infoModal.rue" label="Rue"></v-text-field>

          <v-row>
            <v-col>
              <v-text-field v-model="infoModal.npa" label="NPA"></v-text-field>
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
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelModify"
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
                    <td><b>Entreprise</b></td>
                    <td>{{ detail.compagny }}</td>
                  </tr>
                  <tr>
                    <td><b>Type</b></td>
                    <td>{{ detail.type }}</td>
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
import { db } from "../firebase";

export default {
  name: "Friends",

  data() {
    return {
      headers: [
        { value: "type", text: "Type", sortable: true },
        { value: "firstName", text: "Prénom", sortable: true },
        { value: "lastName", text: "Nom", sortable: true },
        { value: "compagny", text: "Entreprise", sortable: true },
        { value: "email", text: "Email", sortable: true },
        { value: "phone", text: "Téléphone", sortable: true },
        { value: "rue", text: "Rue", sortable: true },
        { value: "commune", text: "Commune", sortable: true },
        { value: "actions", text: "Actions", sortable: false },
      ],
      friendTypes: [
        { text: "Ami en Bronze" },
        { text: "Ami en Argent" },
        { text: "Ami en Or" },
        { text: "Ami en Platine" },
      ],
      friendsList: [],
      friend: {},
      filter: null,
      addDialog: false,
      detailDialog: false,
      detail: {},
      infoModal: {},
      modifDialog: false,
      json_field: {
        Prenom: "firstName",
        Nom: "lastName",
        Type: "type",
        Email: "email",
        Rue: "rue",
        NPA: "npa",
        Commune: "commune",
        Telephone: "phone",
      },
    };
  },
  firestore() {
    return {
      friendsList: db.collection("friendsList"),
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
      return "Liste_club_des_amis_" + dateTime;
    },
  },

  methods: {
    addMember() {
      this.$firestore.friendsList.add(this.friend).then(() => {
        this.friend = {};
      });
    },
    modifyMember() {
      this.$firestore.friendsList
        .doc(this.infoModal[".key"])
        .set(this.infoModal)
        .then(() => {
          this.modifDialog = false;
          this.infoModal = {};
        });
    },
    cancelModify() {
      this.modifDialog = false;
      //Reset modal
      this.infoModal = null;
    },

    info(item) {
      console.log(item);
      this.infoModal = item;
      this.modifDialog = true;
    },
    deleteMember(friend) {
      var r = confirm(
        "Êtes-vous sûr de vouloir supprimer " +
          friend.firstName +
          " " +
          friend.lastName +
          " ?"
      );
      if (r == true) {
        this.$firestore.friendsList.doc(friend[".key"]).delete();
      }
    },
    getDetail(value) {
      this.detail = value;
      console.log(this.detail);
      this.detailDialog = true;
    },
  },
};
</script>
