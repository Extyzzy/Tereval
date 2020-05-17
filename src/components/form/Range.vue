<template>
  <div class="q-pa-md">
    <!-- <p v-if="label" class="text-weight-thin">{{ label }}</p> -->
    <div v-if="model" class="q-pa-xs">
      <q-range
        v-model="model"
        color="blue"
        :min="!sortedIntervals ? options.min : 0"
        :max="!sortedIntervals ? options.max : sortedIntervals.length - 1"
        :left-label-value="
          !sortedIntervals ? model.min : sortedIntervals[model.min]
        "
        :right-label-value="
          !sortedIntervals ? model.max : sortedIntervals[model.max]
        "
        :step="
          !sortedIntervals
            ? Math.round((options.max - options.min) / 10) || 1
            : 1
        "
        label
        snap
        markers
        label-always
        @change="nv => refresh(nv)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["fieldname", "label", "options", "sortedIntervals"],
  data() {
    return {
      model: null,
      step: 1
    };
  },
  watch: {
    options(newVal) {
      const index = this.$store.state.search.query.search_query.filters
        .map(e => e.filter)
        .indexOf(name);
      let min, max;
      if (!this.sortedIntervals) {
        min = newVal.min;
        max = newVal.max;
        if (index < 0) {
          this.model.min = min;
          this.model.max = max;
        }
        if (newVal.max > this.model.max) {
          this.model.max = max;
        }
        if (newVal.min < this.model.min) {
          this.model.min = min;
        }
      } else {
        let min =
          this.sortedIntervals.indexOf(newVal.min) !== -1
            ? this.sortedIntervals.indexOf(newVal.min)
            : 0;
        let max =
          this.sortedIntervals.indexOf(newVal.max) !== -1
            ? this.sortedIntervals.indexOf(newVal.max)
            : this.sortedIntervals.length - 1;
        this.model.min = min;
        this.model.max = max;
      }
    }
  },
  methods: {
    refresh(newValue) {
      this.model = newValue;
      let value;
      if (!this.sortedIntervals) {
        value = {
          min: newValue.min,
          max: newValue.max
        };
      } else {
        value = {
          min: this.sortedIntervals[newValue.min],
          max: this.sortedIntervals[newValue.max]
        };
      }
      this.$emit("update", {
        value,
        field: this.fieldname,
        label: this.label
      });
    }
  },
  beforeMount() {
    if (!this.sortedIntervals) {
      this.model = {
        min: this.options.min,
        max: this.options.max
      };
    } else {
      this.model = {
        min:
          this.sortedIntervals.indexOf(this.options.min) !== -1
            ? this.sortedIntervals.indexOf(this.options.min)
            : 0,
        max: this.sortedIntervals.length - 1
      };
    }
  }
};
</script>
