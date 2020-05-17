<template>
  <div class="checkbox-container">
    <q-option-group
      dense
      :options="getLabels()"
      type="checkbox"
      v-model="model"
      @input="refresh"
      :disable="loading"
      class="checkbox"
    />
  </div>
</template>

<script>
export default {
  props: ["fieldname", "options", "label", "update", "loading", "showCount"],
  data() {
    return {
      model: []
    };
  },
  watch: {
    // todo improve this
    options() {
      const index = this.$store.state.search.query.search_query.filters
        .map(e => e.filter)
        .indexOf(this.fieldname);
      if (index < 0) {
        this.model = [];
      }
    },
    "$store.state.search.query.search_query.filters"() {
      this.checkForSelectionChanges();
    }
  },
  methods: {
    getLabels() {
      return this.options.map(l => {
        let label = this.showCount
          ? `${l.label}` + ` ` + `(${l.count})`
          : `${l.label}`;

        return { label: label, value: l.value };
      });
    },
    refresh(value) {
      this.$emit("update", {
        value: value,
        field: this.fieldname,
        label: this.label,
        showCount: this.showCount
      });
    },
    checkForSelectionChanges() {
      // Check for filters in query params
      const filter = this.$store.state.search.query.search_query.filters;
      const index = filter.map(e => e.filter).indexOf(this.fieldname);
      if (index >= 0) {
        this.model = filter[index].values;
      } else {
        this.model = [];
      }
    }
  },
  mounted() {
    // Check for filters in query params
    this.checkForSelectionChanges();
  }
};
</script>

<style>
.checkbox .q-checkbox__bg {
  width: 16px;
  height: 16px;
  left: 3px;
  top: 1px;
}
</style>

<style scoped>
.checkbox-container {
  margin-left: 28px;
}
</style>
