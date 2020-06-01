<template>
  <div class="members">
    <table class="table table-bordered">
      <thead class="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nom</th>
          <th scope="col">Prénom</th>
          <th scope="col">Instrument</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in memberList" :key="member.key">
          <th scope="row">{{ member.key }}</th>
          <td>{{ member.lastName }}</td>
          <td>{{ member.firstName }}</td>
          <td>{{ member.instrument }}</td>
        </tr>
      </tbody>
    </table>
    <div class="container">
      <form>
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

        <button type="submit" class="btn btn-primary" @click="addMember">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "Members",

  data() {
    return {
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
      this.lastName = "";
      this.firstName = "";
      this.instrument = "";
    }
  }
};
</script>
