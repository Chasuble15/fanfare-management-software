<template>
  <div class="home">
    <h1 class="pa-md-4 mx-lg-auto" style="text-align: center">Dashboard</h1>
    <v-container fluid>
      <v-row>
        <v-col cols="sm-3">
          <DashCard title="Prochain anniversaire" :text="nextBirthday" />
        </v-col>
        <v-col cols="sm-3">
          <DashCard title="Age moyen des membres" :text="averageAge" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { db } from "../firebase";
import DashCard from "../components/DashCard.vue";

export default {
  name: "home",
  components: {
    DashCard,
  },
  data() {
    return {
      nextBirthday: "",
      averageAge: "",
    };
  },
  computed: {},
  created() {
    const birthdays = new Map();
    const today = new Date();
    db.collection("memberList")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          const birth = doc.data().birthday;
          const month = parseInt(birth.substr(3, 2)) - 1;
          const day = parseInt(birth.substr(0, 2));
          var date = new Date(today.getFullYear(), month, day);
          if (date.getTime() - today.getTime() < 0) {
            date = new Date(today.getFullYear() + 1, month, day);
          }
          birthdays.set(date, doc.data().firstName + " " + doc.data().lastName);
        });
        var counter = Number.MAX_VALUE;
        var closest = "";
        birthdays.forEach((value, key) => {
          const delta = key.getTime() - today.getTime();
          if (delta <= counter) {
            counter = delta;
            closest = key;
          }
        });
        var options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        this.nextBirthday =
          birthdays.get(closest) +
          " : " +
          closest.toLocaleDateString("fr-CH", options);
      });
    this.getAges();
  },
  firestore() {
    return {
      memberList: db.collection("memberList"),
    };
  },
  methods: {
    getAges() {
      var ages = [];
      db.collection("memberList")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const birth = doc.data().birthday;
            const year = parseInt(birth.substr(6, 10));
            if (!Number.isNaN(year)) {
              ages.push(2021 - year);
            }
          });
          this.averageAge = this.numAverage(ages) + " ans";
        });
    },
    numAverage(a) {
      var b = a.length,
        c = 0,
        i;
      for (i = 0; i < b; i++) {
        c += Number(a[i]);
      }
      return c / b;
    },
  },
};
</script>


