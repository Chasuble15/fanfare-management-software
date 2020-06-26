<template>
  <div class="formation" style="text-align: center;">
    <h1 class="pa-md-4 mx-lg-auto">Formation</h1>
    <v-card class="mx-auto" max-width="400" tile>
      <v-list>
        <v-list-item-group color="primary">
          <v-list-item v-for="(post, i) in postsList.posts" :key="i">
            <v-list-item-content>{{post}}</v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="edit(i)">
                <v-icon color="grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

    <v-dialog v-model="editor" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Modifier le poste</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field v-model="newPost"></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="editor = false">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="save">Modifier</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "../firebase";
export default {
  name: "Formation",

  data() {
    return {
      postsList: {
        posts: []
      },
      editor: false,
      index: 0,
      newPost: ""
    };
  },
  firestore() {
    return {
      postsList: db.collection("postsList").doc("list")
    };
  },
  methods: {
    edit(index) {
      this.index = index;
      this.newPost = this.postsList.posts[index];
      this.editor = true;
    },
    save() {
      this.postsList.posts[this.index] = this.newPost;
      this.$firestore.postsList
        .update({
          posts: this.postsList.posts
        })
        .then(() => {
          this.editor = false;
        });
    }
  }
};
</script>