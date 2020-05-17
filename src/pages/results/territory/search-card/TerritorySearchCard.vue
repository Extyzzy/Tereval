<template>
  <q-item clickable v-ripple class="item q-pa-xs-none q-pa-sm-none q-pa-md-md">
    <q-item-section
      @click="goToTeritorryPage()"
      class="col-auto vertical-top img-section"
    >
      <q-img
        :src="imageApi + result.data._id + '?type=' + result.data.projet_type"
        class="img"
      />
    </q-item-section>

    <q-item-section
      @click="goToTeritorryPage()"
      top
      class="col-xs-7 col-sm-6 info-value"
    >
      <span class="highlight">{{ result.data.label }}</span>
      <div class="row">
        <div class="col-xs-12 col-sm-7">
          <div class="text-weight-light">
            {{ $t("searchPage.card.region") }}:
            <span>{{ result.data.nom_reg }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.department") }}:
            <span>{{ result.data.nom_dep }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.scot") }}:
            <span>{{ result.data.nom_scot }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.epci") }}:
            <span>{{ result.calculated.nb_ecpi }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.card.communes") }}:
            <span>{{ result.calculated.nb_towns }}</span>
          </div>
        </div>

        <div class="col-xs-12 col-sm-5">
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

    <q-item-section
      @click="goToTeritorryPage()"
      class="col-sm-1 q-pa-xs items-center right indicators"
    >
      <q-checkbox
        @input="selectCard($event)"
        color="blue"
        class="justify-end xs"
        v-model="isSelected"
      />
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
      <!--For small screens-->
      <q-circular-progress
        v-bind:style="{
          visibility: parseInt(result.calculated.surfaceprocevol_formated, 10)
            ? 'initial'
            : 'hidden'
        }"
        show-value
        class="text-light-blue q-ma-xs xs"
        :value="parseInt(result.calculated.surfaceprocevol_formated, 10)"
        size="50px"
        :color="getColor(result.calculated.env_indicator)"
        track-color="grey-3"
        >{{ result.calculated.surfaceprocevol_formated }}</q-circular-progress
      >
    </q-item-section>

    <q-item-section @click="goToTeritorryPage()" class="col-1 xs-hide">
      <q-circular-progress
        v-if="parseInt(result.calculated.surfaceprocevol_formated, 10)"
        show-value
        class="text-light-blue q-ma-xs"
        :value="parseInt(result.calculated.surfaceprocevol_formated, 10)"
        size="50px"
        :color="getColor(result.calculated.env_indicator)"
        track-color="grey-3"
        >{{ result.calculated.surfaceprocevol_formated }}</q-circular-progress
      >
    </q-item-section>
    <q-item-section class="xs-hide">
      <q-checkbox
        @input="selectCard($event)"
        color="blue"
        class="justify-end"
        v-model="isSelected"
      />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "search",
  props: ["result", "customList"],
  components: {},
  data() {
    return {
      imageApi: process.env.DEV_API.concat("images/"),
      isSelected: !!this.customList
    };
  },
  watch: {
    "$store.state.search.selectedResults"() {
      this.checkForSelectionChanges(this.result);
    },
    isSelected() {
      if (this.customList) {
        this.isSelected = true;
      }
    }
  },
  methods: {
    checkForSelectionChanges(newResult) {
      const selectedResults = this.$store.state.search.selectedResults;
      const isSelected = selectedResults.find(
        selected => selected.data._id === newResult.data._id
      );
      if (this.isSelected !== !!isSelected) {
        this.isSelected = !!isSelected;
      }
    },
    selectCard(value) {
      if (this.customList) {
        this.$store.commit("customList/REMOVE_ELEMENTS_FROM_LIST", {
          listName: this.customList.name,
          elements: [this.result],
          type: "territory"
        });
      } else {
        if (value) {
          this.$store.commit("search/SELECT_RESULTS", [this.result]);
        } else {
          this.$store.commit("search/DESELECT_RESULTS", [this.result]);
        }
      }
    },
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
    goToTeritorryPage() {
      this.$router.push({ path: `/territory/${this.result.data._id}` });
    }
  },
  beforeMount() {
    this.checkForSelectionChanges(this.result);
  }
};
</script>

<style scoped>
.highlight {
  color: #3bb7f1;
  font-weight: bold;
}

.info-value {
  flex-wrap: initial;
}

.info-value span {
  font-weight: 400;
}

.img-section {
  justify-content: start;
  margin-top: 5px;
}

.img {
  height: 120px;
  width: 120px;
}
@media only screen and (max-width: 650px) {
  .img {
    height: 74px;
    width: 74px;
  }
}
@media only screen and (max-width: 600px) {
  .indicators {
    align-content: flex-end;
    margin-right: -12px;
  }
}
</style>
