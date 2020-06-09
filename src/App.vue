<template>
  <div id="app">
    <b-container>
      <b-breadcrumb>
        <b-breadcrumb-item to="/">Home</b-breadcrumb-item>
        <b-breadcrumb-item to="/members">Membres</b-breadcrumb-item>
        <b-breadcrumb-item to="/formation">Formation</b-breadcrumb-item>
      </b-breadcrumb>
    </b-container>
    <router-view />
  </div>
</template>
