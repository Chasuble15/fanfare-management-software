<template>
  <div class="formation">
    <b-button @click="update">Update</b-button>
    <b-container>
      <b-row>
        <b-col>
          <h2>Liste des postes</h2>
          <b-list-group>
            <b-list-group-item v-for="post in postsList.posts" :key="post">{{ post }}</b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col>2 of 3</b-col>
        <b-col>3 of 3</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { db } from "../firebase";
export default {
  name: "Formation",

  data() {
    return {
      postsList: {}

      /*"Cornet Principal",
        "Cornet Solo",
        "Cornet Soprano",
        "Cornet Répiano",
        "2e Cornet",
        "3e Cornet",
        "Bugle",
        "Alto Solo",
        "1er Alto",
        "2e Alto",
        "Euphonium Solo",
        "2e Euphonium",
        "Baryton Solo",
        "2e Baryton",
        "Trombone Solo",
        "2e Trombone",
        "Trombone Basse",
        "Basse Mib Solo",
        "Basse Mib",
        "Basse Sib Solo",
        "Basse Sib",
        "Percussion",
        "Tambour",
        "Fille d'honneur"*/
    };
  },
  firestore() {
    return {
      postsList: db.collection("postsList").doc("list")
    };
  },
  methods: {
    update() {
      console.log(this.postsList.posts);
    }
  }
};
</script>