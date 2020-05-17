<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col col-header flex flex-center">Label</div>
      <div class="col col-header flex flex-center">2010</div>
      <div class="col col-header flex flex-center">2015</div>
      <div class="col col-header flex flex-center">%</div>
    </div>
    <div class="row">
      <div class="col col-impair flex flex-center">
        Évolution de la population
      </div>
      <div class="col col-impair flex flex-center">205 650</div>
      <div class="col col-impair flex flex-center">218 397</div>
      <div class="col col-impair flex flex-center">6.2 %</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "grid",
  components: {},
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
  color: white;
  width: 100%;
}
.col-impair {
  background-color: #cdd4ea;
}

.col-pair {
  background-color: #e8ebf5;
}
</style>
