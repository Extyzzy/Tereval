<template>
  <div>
    <div class="row q-pa-md-md">
      <div class="col-xs-auto col-sm-auto">
        <div>
          <span class="text-h5 text-weight-thin"
            >{{
              SelectedList &&
                SelectedList.name.concat(` (${SelectedList.items.length})`)
            }}
          </span>
        </div>
        <q-chip
          clickable
          dense
          color="blue"
          text-color="white"
          @click="selectCustomList(null)"
        >
          {{ $t("general.back") }}
        </q-chip>
      </div>
      <q-space></q-space>
      <div
        v-if="SelectedList && SelectedList.items.length"
        class="col-xs-auto col-sm-3"
      >
        <div class="text-right">
          <span> {{ $t("searchPage.selectAll") }}:</span>
        </div>
        <div class="text-right">
          <q-checkbox
            color="blue"
            @input="removeAllElementsFromList()"
            v-model="allItemsSelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["selectCustomList", "currentlySelectedList", "type"],
  components: {},
  data() {
    return {
      allItemsSelected: true
    };
  },
  computed: {
    SelectedList() {
      if (this.type === "territory") {
        return this.$store.state.customList.territoryLists.find(
          li => li.name === this.currentlySelectedList
        );
      } else {
        return this.$store.state.customList.projectLists.find(
          li => li.name === this.currentlySelectedList
        );
      }
    }
  },
  methods: {
    removeAllElementsFromList() {
      this.$store.commit("customList/REMOVE_ALL_ELEMENTS_FROM_LIST", {
        listName: this.SelectedList.name,
        type: this.type
      });
    }
  }
};
</script>
