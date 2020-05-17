<template>
  <div>
    <div class="row q-pa-md-md">
      <div class="col-xs-auto col-sm-auto">
        <div>
          <span class="text-h5 text-weight-thin"
            >{{ $store.state.search.selectedResults.length }}
            {{ $t("searchPage.results") }}
          </span>
        </div>
        <q-chip
          clickable
          dense
          color="blue"
          text-color="white"
          @click="toggleSelected()"
        >
          {{ $t("searchPage.showSelected") }}</q-chip
        >
      </div>
      <q-space></q-space>
      <div
        v-if="$store.state.search.selectedResults.length"
        class="col-xs-auto col-sm-3"
      >
        <div class="text-right">
          <span> {{ $t("searchPage.selectAll") }}:</span>
        </div>
        <div class="text-right">
          <q-checkbox
            color="blue"
            @input="deselectAllItems()"
            v-model="allItemsSelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["toggleSelected"],
  components: {},
  data() {
    return {
      allItemsSelected: true
    };
  },
  methods: {
    deselectAllItems() {
      this.$store.commit(
        "search/DESELECT_RESULTS",
        this.$store.state.search.selectedResults
      );
      this.allItemsSelected = true;
    }
  }
};
</script>
