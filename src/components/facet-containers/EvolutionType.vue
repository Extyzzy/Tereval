<template>
  <div class="container row">
    <div class="checkboxes col-xs-4 col-sm-2 col-md-4 col-lg-3">
      <div
        v-bind:style="{ visibility: orangeFacet ? 'initial' : 'hidden' }"
        class="checkbox-width checkbox-size"
      >
        <q-checkbox
          @input="onChange(orangeFacet)"
          keep-color
          v-model="orangeFacet.selected"
          color="orange"
          :class="{
            disabled: facet.label !== 'Démographie'
          }"
          class="color-select-checkbox"
        >
          <q-icon
            name="trending_flat"
            class="q-icon__material"
            color="orange-7"
          />
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
            <strong>{{ labels[orangeFacet.value] }}</strong>
          </q-tooltip>
        </q-checkbox>
      </div>
      <div
        v-bind:style="{ visibility: greenFacet ? 'initial' : 'hidden' }"
        class="checkbox-width"
      >
        <q-checkbox
          @input="onChange(greenFacet)"
          keep-color
          v-model="greenFacet.selected"
          color="green"
          class="color-select-checkbox"
        >
          <q-icon name="trending_up" class="q-icon__material" color="green-7" />
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
            <strong>{{ labels[greenFacet.value] }}</strong>
          </q-tooltip>
        </q-checkbox>
      </div>
      <div
        v-bind:style="{ visibility: redFacet ? 'initial' : 'hidden' }"
        class="checkbox-width"
      >
        <q-checkbox
          @input="onChange(redFacet)"
          keep-color
          v-model="redFacet.selected"
          color="red"
          class="color-select-checkbox"
        >
          <q-icon name="trending_down" class="q-icon__material" color="red-7" />
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[5, 5]">
            <strong>{{ labels[redFacet.value] }}</strong>
          </q-tooltip>
        </q-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options", "update", "facet"],
  data() {
    return {
      greenFacet: null,
      orangeFacet: null,
      redFacet: null,
      currentFilter: null,
      labels: {
        "1": this.$t("filter.positive"),
        "0": this.$t("filter.neutral"),
        "-1": this.$t("filter.negative")
      }
    };
  },
  methods: {
    onChange(facet) {
      let { filter, label } = this.facet;
      this.$emit("update", {
        label,
        field: filter,
        value: facet.selected ? facet.value : []
      });
    },
    renderModels() {
      const { filters } = this.$store.state.search.query.search_query;
      this.currentFilter = filters.find(v => v.filter === this.facet.filter);
      const greenCheckbox = this.options.find(v => v.value === "1");
      const orangeCheckbox = this.options.find(v => v.value === "0");
      const redCheckbox = this.options.find(v => v.value === "-1");
      this.greenFacet = greenCheckbox ? greenCheckbox : false;
      this.orangeFacet = orangeCheckbox ? orangeCheckbox : false;
      this.redFacet = redCheckbox ? redCheckbox : false;
    }
  },
  beforeMount() {
    this.renderModels();
  },
  updated() {
    this.renderModels();
  }
};
</script>

<style scoped>
.container {
  justify-content: flex-end;
  padding: 0 16px;
}
.checkboxes {
  display: flex;
  justify-content: space-between;
}
.checkbox-width {
  width: 33%;
}
.q-icon__material {
  font-size: 1.25rem;
}
</style>

<style>
.disabled > div:first-child {
  cursor: not-allowed !important;
  pointer-events: all !important;
}
.color-select-checkbox > div:first-child {
  visibility: hidden;
}
.color-select-checkbox > div:nth-child(2) {
  position: absolute;
}
</style>
