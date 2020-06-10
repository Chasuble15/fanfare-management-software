<template>
  <div class="formation">
    <!--<b-button @click="update">Update</b-button>-->
    <h1 class="pa-md-4 mx-lg-auto">Formation</h1>
    <v-list>
      <v-list-item-group v-for="post in postsList.posts" :key="post">{{ post }}</v-list-item-group>
    </v-list>
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
    /*update() {
      console.log(this.postsList.posts);
    }*/
  }
};
</script>