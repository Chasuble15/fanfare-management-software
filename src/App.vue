<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-list>
        <v-list-item :to="{path: '/home'}">
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{path: '/members'}">
          <v-list-item-content>
            <v-list-item-title>Membres</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{path: '/formation'}">
          <v-list-item-content>
            <v-list-item-title>Formation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-toolbar-title>Fanfare Management Software</v-toolbar-title>
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
  })
};
</script>
