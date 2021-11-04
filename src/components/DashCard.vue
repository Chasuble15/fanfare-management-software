<template>
  <div class="card">
    <div class="round">
      <img src="../assets/gift-outline.svg" alt="gift" />
    </div>
    <div class="container">
      <h4>
        <b>{{ title }}</b>
      </h4>
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<style>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px; /* 5px rounded corners */
  padding: 1em;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.round {
  border-radius: 100%;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2);
  width: 70px;
  height: 70px;
  margin: auto;
}

img {
  width: 30px;
  height: auto;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Add some padding inside the card container */
.container {
  padding: 10px 16px;
  margin-top: 10px;
}
</style>

<script>
export default {
  name: "DashCard",
  props: {
    title: String,
    text: String,
  },
};
</script>
 