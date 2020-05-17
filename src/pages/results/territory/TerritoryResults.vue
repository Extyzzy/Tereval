<template>
  <q-page class="q-pa-sm-md">
    <div>
      <div class="row" v-if="resultExist()">
        <div class="q-pa-sm col-xs-12 col-sm-12 col-md-3 facets">
          <q-btn class="q-my-md" icon="arrow_back" @click="undo(true)">{{
            $t("general.back")
          }}</q-btn>
          <q-btn
            v-if="filtersSelected.length"
            class="q-my-md reset"
            icon="loop"
            @click="clear()"
          >
            {{ $t("filter.reset") }}</q-btn
          >
          <Facets
            v-if="response && response.aggrs"
            :data="response.aggrs"
            :loading="loading"
            @update="update"
          ></Facets>
        </div>

        <div class="q-pa-sm col">
          <div class="row">
            <div
              v-bind:style="{
                display:
                  !showOnlySelected && !currentlySelectedList
                    ? 'initial'
                    : 'none'
              }"
              class="col-xs-12 col-sm-12 col-md-12 col-lg-10"
            >
              <TerritoryResultsHeader
                :toggleSelected="toggleSelected"
                :selectCustomList="selectCustomList"
                :len="response.total"
                :results="response.results"
                :selectedFilters="response.selected_filters"
                :query="query"
                :sort="response.sort"
                @update="update"
              />
              <TerritoryResultsList
                class="results-list"
                :results="response.results"
                :total="response.total"
                :loading="loading"
                :update="loadMore"
              />
            </div>
            <div
              v-bind:style="{ display: showOnlySelected ? 'initial' : 'none' }"
              class="col-xs-12 col-sm-12 col-md-10"
            >
              <SelectedResultsHeader :toggleSelected="toggleSelected" />
              <SelectedResultsList type="territory" />
            </div>
            <div
              v-if="currentlySelectedList"
              class="col-xs-12 col-sm-12 col-md-10"
            >
              <CustomListHeader
                :type="territory"
                :selectCustomList="selectCustomList"
                :currentlySelectedList="currentlySelectedList"
              />
              <CustomListResults
                type="territory"
                :currentlySelectedList="currentlySelectedList"
              />
            </div>
            <div class="col-1"></div>
          </div>
        </div>
      </div>
      <div class="row text-center no-result" v-else-if="!loading">
        <div class="col">
          <div class="q-pa-sm col-auto text-h5 text-center">
            {{ $t("searchPage.noResult") }}
          </div>
          <q-btn class="q-my-md" icon="arrow_back" @click="undo(true)">{{
            $t("general.back")
          }}</q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Facets from "../../../components/facets/Facets";
import TerritoryResultsHeader from "./main-results/TerritoryResultsHeader";
import TerritoryResultsList from "./main-results/TerritoryResultsList";
import SelectedResultsList from "../../../components/selected-results/SelectedResultsList";
import SelectedResultsHeader from "../../../components/selected-results/SelectedResulstHeader";
import RequestService from "../../../services/request.service";
import UtilService from "../../../services/util.service";
import CustomListHeader from "../../../components/custom-list-results/CustomListHeader";
import CustomListResults from "../../../components/custom-list-results/CustomListResults";

export default {
  props: ["data"],
  components: {
    Facets,
    TerritoryResultsHeader,
    TerritoryResultsList,
    SelectedResultsHeader,
    SelectedResultsList,
    CustomListHeader,
    CustomListResults
  },
  data() {
    return {
      type: "territory",
      response: null,
      len: null,
      query: null,
      sort: null,
      loading: false,
      showOnlySelected: false,
      currentlySelectedList: null,
      prevRoute: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from && from.path;
    });
  },
  computed: {
    filtersSelected() {
      return this.$store.state.search.query.search_query.filters;
    }
  },
  methods: {
    toggleSelected() {
      this.showOnlySelected = !this.showOnlySelected;
    },
    selectCustomList(listName) {
      this.currentlySelectedList = listName;
    },
    undo(customButton) {
      if (customButton) {
        this.$router.go(-1);
      } else {
        const { path } = this.$router.history.current;
        if (path.includes("territory-results")) {
          UtilService.getFiltersFromQueryParams(this.$route.query, this.$store);
          this.update();
        }
      }
    },
    clear() {
      this.$store.commit("search/CLEAR_QUERY", { pushEmptyParams: true });
      this.update();
    },
    resultExist() {
      return this.response && this.response.results.length;
    },
    loadMore(index, infiniteScroll) {
      this.$store.commit("search/SET_PAGE", index);
      const state = this.$store.state.search;
      this.loading = true;
      return RequestService.search(this.type, state.query, this.$store).then(
        response => {
          this.loading = false;
          if (!this.response) {
            this.response = response;
          } else {
            if (!infiniteScroll) {
              this.response.results = response.results;
            } else {
              this.response.results.push(...response.results);
            }
          }
          return this.response;
        }
      );
    },
    update() {
      this.loading = true;
      this.$store.commit("search/SET_PAGE", 0);
      const state = this.$store.state.search;
      return RequestService.search(this.type, state.query, this.$store).then(
        response => {
          if (response) {
            this.response = response;
          }
          this.loading = false;
          UtilService.scrollToTop();
          return this.response;
        }
      );
    }
  },
  mounted() {
    if (!Object.keys(this.$route.query).length) {
      this.$store.commit("search/CLEAR_QUERY");
    } else {
      UtilService.getFiltersFromQueryParams(this.$route.query, this.$store);
    }
    this.update();
    window.onpopstate = () => {
      this.undo();
    };
    this.$root.$on("UPDATE_REQUIRED", this.update);
  },
  beforeDestroy() {
    this.$store.commit("search/DESELECT_ALL_RESULTS");
    this.$root.$off("UPDATE_REQUIRED", this.update);
  }
};
</script>

<style scoped>
.results-list {
  min-height: 100px;
}
.no-result {
  justify-content: center;
  height: calc(100vh - 150px);
  align-items: center;
}
.reset {
  padding: 4px 12px !important;
}
@media only screen and (min-width: 1440px) {
  .facets {
    max-width: 400px;
  }
}
</style>
