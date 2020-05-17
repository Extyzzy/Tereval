<template>
  <div>
    <q-expansion-item
      header-class="expansion-header"
      v-model="model"
      dense
      expand-separator
      :icon="getIcon(label)"
      :label="label"
    >
      <q-card>
        <q-card-section v-bind:class="{ tagCloud: tagCloud }">
          <slot></slot>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
export default {
  props: {
    tagCloud: Boolean,
    label: String,
    opened: Boolean,
    icons: Array
  },
  data() {
    return {
      model: null,
      st: true
    };
  },
  methods: {
    getIcon(label) {
      let icon = "";
      switch (label) {
        case "Type de projet":
          icon = "account_tree";
          break;
        case "Statut":
          icon = "network_check";
          break;
        case "Type de document":
          icon = "portrait";
          break;
        case "Thèmes":
          icon = "landscape";
          break;
        case "Concepts":
          icon = "local_offer";
          break;
        case "Type de territoire":
          icon = "near_me";
          break;
        case "% d’artificialisation":
          icon = "streetview";
          break;
        case "Prescriptions":
          icon = "hdr_weak";
          break;
        case "Nombre d’habitants":
          icon = "looks";
          break;
        case "Densité de population":
          icon = "loupe";
          break;
        default:
      }

      return icon;
    }
  },
  beforeMount() {
    this.model = this.opened;
  }
};
</script>

<style>
.tagCloud {
  height: 170px;
}
.expansion-header > div > i {
  color: grey;
}
.expansion-header > .q-item__section {
  min-width: 30px;
  padding-right: 0;
}
</style>
