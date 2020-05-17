<template>
  <div class="q-pa-md">
    <p class="text-h5">{{ $t("territoryPage.comparer") }}</p>
    <span>{{ $t("territoryPage.affichage") }}</span>
    <LinearChart></LinearChart>
  </div>
</template>

<script>
import LinearChart from "../../components/chart/Linear/Linear";

export default {
  name: "chartTerritory",
  components: { LinearChart },
  data() {
    return {};
  }
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
