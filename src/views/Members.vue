<template>
  <div class="members">
    <div>
      <b-table hover bordered head-variant="light" :items="memberList" :fields="fields"></b-table>
    </div>
    <div>
      <b-button id="show-btn" @click="$bvModal.show('bv-modal-example')">Nouveau membre</b-button>

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
          <input
            type="text"
            class="form-control"
            id="instrument"
            placeholder="Instrument"
            v-model="instrument"
          />
        </div>
        <b-button class="mt-3" block @click="addMember">Valider</b-button>
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
        }
      ],
      memberList: [],
      lastName: "",
      firstName: "",
      instrument: ""
    };
  },
  firestore() {
    return {
      memberList: db.collection("memberList")
    };
  },
  methods: {
    addMember: function() {
      var id = this.memberList.length + 1;
      this.$firestore.memberList.add({
        key: id,
        lastName: this.lastName,
        firstName: this.firstName,
        instrument: this.instrument
      });

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("bv-modal-example");
      });

      this.lastName = "";
      this.firstName = "";
      this.instrument = "";
    }
  }
};
</script>
