<template>
  <div>
    <div class="row q-pa-md-md">
      <div class="col-xs-12 col-sm-auto">
        <div>
          <span class="text-h5 text-weight-thin"
            >{{ len }}
            {{ $t("searchPage.results") }}
          </span>
        </div>
        <q-chip
          clickable
          dense
          class="custom-chip"
          color="#e0e0e0"
          text-color="black"
          @click="toggleSelected()"
        >
          {{ $t("searchPage.showSelected") }}</q-chip
        >
        <q-btn-dropdown
          v-if="$store.state.customList.territoryLists.length"
          class="addToList"
          color="primary"
          label="Lists"
        >
          <q-list>
            <q-item
              v-for="(todo, index) in $store.state.customList.territoryLists"
              v-bind:key="index"
              clickable
              v-close-popup
              @click="selectCustomList(todo.name)"
            >
              <q-item-section>
                <q-item-label>{{ todo.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          class="addToList"
          @click="openListModal"
          color="primary"
          label="Add to list"
          v-if="$store.state.search.selectedResults.length"
        />
      </div>

      <q-space></q-space>
      <div class="col-xs-6 col-sm-auto">
        <span> {{ $t("searchPage.sortBy") }}:</span>
        <q-select
          dense
          outlined
          v-model="filters.model"
          :options="filters.options"
          @input="sortHandler"
        />
      </div>
      <div class="col-xs-6 col-sm-auto">
        <div class="text-right">
          <span> {{ $t("searchPage.selectAll") }}:</span>
        </div>
        <div class="text-right">
          <q-checkbox
            color="blue"
            @input="allItemsSelect($event)"
            v-model="allItemsSelected"
          />
        </div>
      </div>
    </div>
    <div class="row q-pl-md-md q-pr-md-md">
      <div>
        <span v-if="selectedFilters.length" class="text-weight-thin"
          >{{ $t("filter.resultsfilterSelected") }} :</span
        >
        <div class="flex">
          <div v-for="(filter, index) in selectedFilters" :key="filter.filter">
            <q-chip
              v-if="filter.filter"
              dense
              removable
              v-model="chips[index]"
              @remove="removeChip(index, filter.filter)"
            >
              <q-avatar
                icon="bookmark"
                :color="colors[filter.values[0].value]"
                text-color="white"
                v-if="filter.type === 'color_selector'"
              ></q-avatar
              >{{ getLabel(filter) }}</q-chip
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilService from "../../../../services/util.service";
import CustomListModal from "../../../../components/custom-list-modal/CustomListModal";
export default {
  name: "search",
  props: [
    "len",
    "sort",
    "selectedFilters",
    "results",
    "toggleSelected",
    "selectCustomList"
  ],
  components: {},
  data() {
    return {
      strip: UtilService.strip,
      chips: [],
      filters: {
        model: this.sort[0],
        options: this.sort
      },
      allItemsSelected: false,
      colors: {
        "0": "orange",
        "1": "green",
        "-1": "red"
      }
    };
  },
  watch: {
    results() {
      this.checkForSelectionChanges();
    },
    "$store.state.search.selectedResults"() {
      this.checkForSelectionChanges();
    }
  },
  methods: {
    openListModal() {
      this.$q.dialog({
        component: CustomListModal,
        root: this.$root,
        type: "territory"
      });
    },
    allItemsSelect(value) {
      if (value) {
        this.$store.commit("search/SELECT_RESULTS", this.results);
      } else {
        this.$store.commit("search/DESELECT_RESULTS", this.results);
      }
    },
    checkForSelectionChanges() {
      const allSelectedResults = this.$store.state.search.selectedResults;
      let currentPageSelectedResults = 0;
      this.results.forEach(newResult => {
        const isSelected = allSelectedResults.find(
          selected => selected.data._id === newResult.data._id
        );
        if (isSelected) {
          ++currentPageSelectedResults;
        }
      });
      if (!currentPageSelectedResults) {
        this.allItemsSelected = false;
      } else if (currentPageSelectedResults < this.results.length) {
        this.allItemsSelected = null;
      } else {
        this.allItemsSelected = true;
      }
    },
    removeChip(index, name) {
      // console.log("removeChip", index, name);
      this.$store.commit("search/REMOVE_FILTER", name);
      this.chips.splice(index, 1);
      this.$emit("update");
    },
    sortHandler(value) {
      this.$store.commit("search/SET_SORT", value.value);
      this.$emit("update");
    },
    getName(number) {
      if (number.value === "1") {
        return this.$t("filter.positive");
      } else if (number.value === "0") {
        return this.$t("filter.neutral");
      } else {
        return this.$t("filter.negative");
      }
    },
    getLabel(filterObject) {
      let label = "";
      label = `${filterObject.label}: `;
      if (typeof filterObject.values[0].value === "string") {
        const labelsArray = [];
        filterObject.values.forEach(valueInfo => {
          if (filterObject.type === "color_selector") {
            labelsArray.push(this.getName(valueInfo));
          } else {
            labelsArray.push(valueInfo.label);
          }
        });
        label = label.concat(labelsArray.join(", "));
      } else {
        label = label.concat(
          `${filterObject.values[0].value.min} - ${
            filterObject.values[0].value.max
          }`
        );
      }
      return label;
    }
  },
  mounted() {
    let filters = this.$store.state.search.query.search_query.filters;
    this.chips.length = filters.length + 1;
    this.chips.fill(true);
  }
};
</script>
<style scoped>
@media only screen and (max-width: 605px) {
  .custom-chip {
    padding: 0 3px !important;
  }
}
.addToList {
  padding: 0 16px;
  font-size: 11px;
  margin-left: 10px;
}
</style>
