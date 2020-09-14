<template>
  <div class="ms" style="text-align: center;">
    <h1 class="pa-md-4 mx-lg-auto">Ecole de musique</h1>

    <v-toolbar flat height="100px">
      <v-spacer></v-spacer>
      <v-btn dark right color="teal" @click="edit = !edit" rounded>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-toolbar>

    <v-row v-if="!edit">
      <v-col v-for="(annee, i) in eleves" :key="i">
        <v-card class="mx-auto" max-width="300" tile>
          <v-list disabled>
            <v-subheader>ANNÉE {{i+1}}</v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item v-for="(item, j) in annee" :key="j">
                <v-list-item-icon>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="(annee, i) in eleves" :key="i">
        <v-card class="mx-auto" max-width="300" tile>
          <v-list>
            <v-subheader>ANNÉE {{i+1}}</v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item v-for="(item, j) in annee" :key="j">
                <v-list-item-icon v-if="i != 0">
                  <v-btn icon @click="downgrade(i,j)">
                    <v-icon color="teal">mdi-arrow-left-thick</v-icon>
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon v-if="i != eleves.length-1">
                  <v-btn icon @click="upgrade(i, j)">
                    <v-icon color="teal">mdi-arrow-right-thick</v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ms",

  data() {
    return {
      item: null,
      eleves: [
        ["1eleve1", "1eleve2", "1eleve3"],
        ["2eleve1", "2eleve2", "2eleve3"],
        ["3eleve1", "3eleve2", "3eleve3"],
        ["4eleve1", "4eleve2", "4eleve3"]
      ],
      edit: false
    };
  },

  methods: {
    upgrade(bloc, ligne) {
      this.eleves[bloc + 1].push(this.eleves[bloc][ligne]);
      this.eleves[bloc].splice(ligne, 1);
    },
    downgrade(bloc, ligne) {
      this.eleves[bloc - 1].push(this.eleves[bloc][ligne]);
      this.eleves[bloc].splice(ligne, 1);
    }
  }
};
</script>