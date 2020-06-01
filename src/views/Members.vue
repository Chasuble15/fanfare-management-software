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
  </div>
</template>

<script>
export default {
  name: "Members",
  data() {
    return {
      memberList: [
        {
          key: 1,
          lastName: "Carrupt",
          firstName: "Thibaud",
          instrument: "Percussion"
        },
        {
          key: 2,
          lastName: "Carrupt",
          firstName: "Robin",
          instrument: "Percussion"
        },
        {
          key: 3,
          lastName: "Carruzzo",
          firstName: "Olivier",
          instrument: "Cornet"
        }
      ]
    };
  }
};
</script>
