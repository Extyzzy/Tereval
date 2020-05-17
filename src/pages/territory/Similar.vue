<template>
  <div class="q-pa-md">
    <p class="text-h5 q-pt-xl q-pb-md">{{ $t("territoryPage.projets") }}</p>
    <div v-if="territoryList">
      <div v-for="(territory, index) in territoryList" :key="index">
        <CardList :getProfile="getProfile" :result="territory"></CardList>
      </div>
    </div>
  </div>
</template>

<script>
import CardList from "../../components/card-list/CardList";

export default {
  name: "similar",
  components: {
    CardList
  },
  props: ["territoryList", "getProfile"],
  mounted() {}
};
</script>

<style scoped>
.text-h5 {
  color: #3bb7f1;
}
.col {
  min-height: 40px;
  border: 1px solid white;
}
.col-header {
  background-color: #4471c4;
  min-height: 45px;
  border-bottom: 5px solid white;
}
.col-impair {
  background-color: #cdd4ea;
}

.col-pair {
  background-color: #e8ebf5;
}
</style>
