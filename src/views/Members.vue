<template>
  <div class="members">
    <h2>Membres</h2>
    <b-col cols="4">
      <b-form-group label-for="filterInput" label-cols-sm="1">
        <b-input-group size="sm">
          <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Rechercher..."></b-form-input>
          <b-input-group-append>
            <b-button id="show-btn" @click="$bvModal.show('bv-modal-example')">Nouveau membre</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-col>

    <div>
      <b-table
        hover
        bordered
        head-variant="light"
        :items="memberList"
        :fields="fields"
        :filter="filter"
      >
        <template v-slot:cell(actions)="row">
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            class="mr-1"
          >Modifier</b-button>
          <b-button size="sm" @click="deleteMember(row.item)" class="mr-1">Supprimer</b-button>
        </template>
      </b-table>

      <b-modal :id="infoModal.id" title="Modifier un membre" hide-footer>
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input type="text" class="form-control" id="firstName" v-model="infoModal.firstName" />
        </div>
        <div class="form-group">
          <label for="lastName">Nom</label>
          <input type="text" class="form-control" id="lastName" v-model="infoModal.lastName" />
        </div>
        <div class="form-group">
          <label for="newInstrument">Instrument</label>
          <b-form-select v-model="infoModal.instrument" :options="postsList.posts">Instrument</b-form-select>
        </div>
        <b-row>
          <b-col>
            <b-button variant="success" block @click="modifyMember">Modifier</b-button>
          </b-col>
          <b-col>
            <b-button variant="danger" block @click="cancelModify">Annuler</b-button>
          </b-col>
        </b-row>
      </b-modal>
    </div>
    <div>
      <b-modal id="bv-modal-example" hide-footer>
        <template v-slot:modal-title>Nouveau membre</template>
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input
            type="text"
            class="form-control"
            id="firstName"
            placeholder="Prénom"
            v-model="firstName"
          />
        </div>
        <div class="form-group">
          <label for="lastName">Nom</label>
          <input
            type="text"
            class="form-control"
            id="lastName"
            placeholder="Nom"
            v-model="lastName"
          />
        </div>
        <div class="form-group">
          <label for="instrument">Instrument</label>
          <b-form-select v-model="instrument" :options="postsList.posts">
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Choisir un instrument --</b-form-select-option>
            </template>
          </b-form-select>
        </div>
        <b-button variant="success" block @click="addMember">Valider</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "Members",

  data() {
    return {
      fields: [
        {
          key: "lastName",
          label: "Nom",
          sortable: true
        },
        {
          key: "firstName",
          label: "Prénom",
          sortable: true
        },
        {
          key: "instrument",
          label: "Instrument",
          sortable: true
        },
        { key: "actions", label: "Actions" }
      ],
      memberList: [],
      lastName: "",
      firstName: "",
      instrument: null,
      filter: null,
      infoModal: {
        id: "info-modal",
        firstName: "",
        lastName: "",
        instrument: "",
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
    addMember: function() {
      var id = this.memberList.length + 1;
      this.$firestore.memberList
        .add({
          id: id,
          lastName: this.lastName,
          firstName: this.firstName,
          instrument: this.instrument
        })
        .then(() => {
          // Hide the modal manually
          this.$nextTick(() => {
            this.$bvModal.hide("bv-modal-example");
          });

          this.lastName = "";
          this.firstName = "";
          this.instrument = null;
        });
    },
    modifyMember() {
      db.collection("memberList")
        .doc(this.infoModal.key)
        .update({
          firstName: this.infoModal.firstName,
          lastName: this.infoModal.lastName,
          instrument: this.infoModal.instrument
        })
        .then(() => {
          this.$nextTick(() => {
            this.$bvModal.hide(this.infoModal.id);
          });
          //Reset modal
          this.infoModal.firstName = "";
          this.infoModal.lastName = "";
          this.infoModal.instrument = null;
          this.infoModal.key = "";
        });
    },
    cancelModify() {
      this.$nextTick(() => {
        this.$bvModal.hide(this.infoModal.id);
      });
      //Reset modal
      this.infoModal.firstName = "";
      this.infoModal.lastName = "";
      this.infoModal.instrument = "";
      this.infoModal.key = "";
    },
    info(item, index, button) {
      this.infoModal.firstName = item.firstName;
      this.infoModal.lastName = item.lastName;
      this.infoModal.instrument = item.instrument;
      this.infoModal.key = item[".key"];

      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    deleteMember(member) {
      this.$firestore.memberList.doc(member[".key"]).delete();
    }
  }
};
</script>
