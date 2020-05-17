<template>
  <div>
    <q-option-group
      dense
      :options="options"
      type="radio"
      v-model="model"
      @input="refresh"
    />
    <!-- model: {{ model }} -->
  </div>
</template>

<script>
export default {
  props: ["fieldname", "options", "label", "update"],
  data() {
    return {
      model: ""
    };
  },
  methods: {
    refresh: function(value) {
      this.$emit("update", {
        value: value,
        field: this.fieldname,
        label: this.label
      });
    }
  },
  mounted() {
    for (let i = 0; i < this.options.length; i++) {
      const element = this.options[i];
      if (element.selected) {
        this.model = element.value;
      }
    }
  }
};
</script>
