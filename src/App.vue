<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-list>
        <v-list-item :to="{ path: '/' }">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Tableau de bord</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/members' }">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Membres</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/formation' }">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Formation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/friends' }">
          <v-list-item-icon>
            <v-icon>mdi-account-star</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Club des amis</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/ms' }">
          <v-list-item-icon>
            <v-icon>mdi-school</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Ecole de musique</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/transcript' }">
          <v-list-item-icon>
            <v-icon>mdi-book-open-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>PV Maker</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/inventory' }">
          <v-list-item-icon>
            <v-icon>mdi-view-list-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Inventaire</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ path: '/calendar' }">
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Calendrier</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left>
      <v-img
        contain
        src="@/assets/logoAvenir.jpg"
        max-height="50"
        max-width="70"
      ></v-img>

      <v-divider class="mx-4" inset vertical></v-divider>
      <v-toolbar-title>
        <h2 class="font-weight-regular">Fanfare Management</h2>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="mx-4" v-bind="attrs" v-on="on">
            mdi-help-circle-outline
          </v-icon>
        </template>
        <h3>V1.5</h3>
        <h4>Tableau de bord</h4>
        <ul>
          <li>Ajout du prochain anniversaire</li>
        </ul>
        <h3>V1.4</h3>
        <h4>General</h4>
        <ul>
          <li>Modification du menu principal</li>
          <li>Modification des bontons d'action</li>
        </ul>
        <h4>Club des amis</h4>
        <ul>
          <li>Ajout d'une data table</li>
        </ul>
        <h3>V1.3</h3>
        <h4>PV Maker</h4>
        <ul>
          <li>Ajout de l'option de sauvegarde</li>
          <li>Ajout d'une confirmation lors de la suppression</li>
          <li>Changement du design des boutons</li>
          <li>Nombre de lignes des zone de texte adaptées</li>
          <li>Ajout d'une liste des PV</li>
        </ul>
      </v-tooltip>
      Alpha - Version 1.5
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

