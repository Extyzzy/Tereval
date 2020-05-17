<template>
  <q-item clickable v-ripple @click="getData" class="item">
    <q-item-section top class="col-6">
      <span class="highlight">{{ result.data.label }}</span>
      <div class="row infovalue">
        <div class="col-7">
          <div class="text-weight-light">
            {{ $t("searchPage.card.communes") }}:
            <span>{{ result.calculated.nb_towns }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.department") }}:
            <span>{{ result.data.nom_dep }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.epci") }}:
            <span>{{ result.calculated.nb_ecpi }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.region") }}:
            <span>{{ result.data.nom_reg }}</span>
          </div>
        </div>

        <div class="col-5">
          <div class="text-weight-light">
            {{ $t("searchPage.card.people") }}:
            <span>{{ result.calculated.nb_people_formated }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.area") }}:
            <span>{{ result.calculated.areal_size_formated }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.density") }}:
            <span>{{ result.calculated.density_formated }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.artificialization") }}:
            <span>{{ result.calculated.artificialisation_formated }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.distance") }}:
            <span>{{ result.data.distance_formated }}</span>
          </div>
        </div>
      </div>
    </q-item-section>

    <q-item-section class="col-1 q-pa-xs items-center">
      <q-icon
        name="people"
        class="text-h4"
        :class="getClassColor(result.calculated.demog_indicator)"
      />
      <q-icon
        name="home"
        class="text-h4"
        :class="getClassColor(result.calculated.eco_indicator)"
      />
      <q-icon
        name="autorenew"
        class="text-h4"
        :class="getClassColor(result.calculated.foncier_indicator)"
      />
    </q-item-section>

    <q-item-section
      class="col-2"
      v-if="parseInt(result.calculated.surfaceprocevol_formated, 10)"
    >
      <q-circular-progress
        show-value
        class="text-light-blue q-ma-xs"
        :value="parseInt(result.calculated.surfaceprocevol_formated, 10)"
        size="50px"
        :color="getColor(result.calculated.env_indicator)"
        track-color="grey-3"
        >{{ result.calculated.surfaceprocevol_formated }}</q-circular-progress
      >
    </q-item-section>
  </q-item>
</template>

<script>
import UtilService from "../../services/util.service";

export default {
  name: "search",
  props: ["result", "type", "getProfile"],
  components: {},
  data() {
    return {};
  },
  methods: {
    getColor(value) {
      if (value === 1) {
        return "green";
      } else if (value === 0) {
        return "orange";
      } else {
        return "red";
      }
    },
    getClassColor(value) {
      const name = `text-${this.getColor(value)}`;
      return { [name]: true };
    },
    getData() {
      this.$router.push({ path: `/territory/${this.result.data._id}` });
      this.getProfile();
      UtilService.scrollToTop();
    }
  },
  mounted() {
    // console.log(
    //   "PROJECARD",
    //   this.result.calculated.artificialisation_formated,
    //   parseInt(this.result.calculated.artificialisation_formated, 10)
    // );
  }
};
</script>

<style scoped>
.highlight {
  color: #3bb7f1;
  font-weight: bold;
}

.border-left {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}

.infovalue span {
  font-weight: 400;
}
</style>
