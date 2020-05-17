<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="flex">
    <q-input
      ref="input"
      class="main-page-search-input"
      :class="{ 'global-page-search-input': global }"
      @keyup.enter.native="onEnter(false)"
      @keyup.down="onArrowDown"
      @keyup.up="onArrowUp"
      v-model="searchModel"
      debounce="500"
      :loading="loading"
      @input="autoCompleteSearch"
      @blur="onBlur"
      @focus="onFocus"
      :label="getSearchLabel()"
      :filled="!global"
      :dark="global"
      :dense="global"
      :standout="global"
    >
      <template v-slot:before>
        <q-btn
          color="primary"
          class="main-page-button"
          :class="{ 'global-page-button': global }"
          :label="$t(selectedSearchType.label)"
        >
          <q-menu fit auto-close :offset="[0, 5]">
            <q-list style="min-width: 100px">
              <q-item
                v-for="(search, index) in mappedSearchTypes"
                :key="index"
                clickable
                @click="changeSearchType(search)"
              >
                <q-item-section>{{ $t(search.label) }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
      <template v-if="!loading" v-slot:append>
        <q-icon style="cursor: pointer" name="search" @click="onEnter(true)" />
      </template>
    </q-input>
    <div class="main-page-results">
      <div
        class="main-page-results-section"
        :class="{ 'global-page-results-section': global }"
        v-if="searchResults && searchResults.length && searchFocus"
      >
        <ol
          class="main-page-search-item row"
          :class="{ 'global-page-search-item': global }"
          v-for="(category, currentCategoryIndex) in searchResults"
          :key="currentCategoryIndex"
        >
          <li
            class="main-page-category-label q-pa-xs"
            :class="{ 'global-page-category-label': global }"
          >
            {{ category.label }}:
          </li>
          <li
            class="main-page-category-results"
            :class="{ 'global-page-category-results': global }"
          >
            <div
              v-for="(item, currentCategoryResultIndex) in category.results"
              :key="item.id"
              style="cursor:pointer;"
              class="q-pa-xs"
              :class="{
                'main-page-link-hover':
                  currentCategoryIndex === categoryIndex &&
                  currentCategoryResultIndex === categoryResultIndex
              }"
              @mouseover="
                onHover(currentCategoryIndex, currentCategoryResultIndex)
              "
              @mouseout="onHoverOut()"
              @mousedown="selectSearchResult(category, item)"
            >
              <a v-html="item.html"></a>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
<script>
import RequestService from "../../services/request.service";
const mappedSearchTypes = [
  { type: "all", label: "mainPage.inputSearch.all", apiParam: "global" },
  {
    type: "territory",
    label: "mainPage.inputSearch.territories",
    apiParam: "globalterritory"
  },
  {
    type: "project",
    label: "mainPage.inputSearch.projects",
    apiParam: "globalrequest"
  }
];

export default {
  props: ["global"],
  data() {
    return {
      mappedSearchTypes: this.global
        ? mappedSearchTypes.filter(search => search.type !== "all")
        : mappedSearchTypes,
      selectedSearchType: this.global
        ? this.getSearchTypeBasedOnRoute()
        : mappedSearchTypes[0],
      searchFocus: false,
      searchModel: null,
      searchResults: [],
      bestMatch: null,
      loading: false,
      categoryIndex: null,
      categoryResultIndex: null
    };
  },
  mounted() {
    const query = this.$route.query["query.values"];
    if (query) {
      this.searchModel = query;
    }
  },
  watch: {
    $route() {
      const query = this.$route.query["query.values"];
      if (query) {
        this.searchModel = query;
      } else {
        this.searchModel = null;
      }
      this.searchResults = [];
      this.bestMatch = null;
      this.selectedSearchType = this.getSearchTypeBasedOnRoute();
    }
  },
  methods: {
    changeSearchType(searchType) {
      this.selectedSearchType = searchType;
      // Check if the input has a value
      if (this.searchModel && this.searchModel.trim().length > 1) {
        this.autoCompleteSearch(this.searchModel);
      }
    },
    onFocus() {
      this.searchFocus = true;
      if (
        this.searchModel &&
        this.searchModel.length > 1 &&
        !this.searchResults.length
      ) {
        this.autoCompleteSearch(this.searchModel);
      }
    },
    onBlur() {
      this.searchFocus = false;
      this.categoryIndex = null;
      this.categoryResultIndex = null;
    },
    autoCompleteSearch(value) {
      this.categoryIndex = null;
      this.categoryResultIndex = null;
      this.loading = true;
      if (value.length < 2) {
        this.searchResults = [];
        this.loading = false;
        return;
      }
      RequestService.GetAutoComplete(
        value,
        this.selectedSearchType.apiParam
      ).then(res => {
        this.$emit(`getDataFromApi`, res);
        this.searchResults = res.autocomplete;
        this.bestMatch = res.bestMatch;
        this.loading = false;
        this.$refs.input.$el.focus();
      });
    },
    onEnter(clickedOnSearchIcon) {
      if (!clickedOnSearchIcon && this.categoryIndex != null) {
        this.selectSearchResult(
          this.searchResults[this.categoryIndex],
          this.searchResults[this.categoryIndex].results[
            this.categoryResultIndex
          ]
        );
        return;
      }
      const value = this.$refs.input.tempValue
        ? this.$refs.input.tempValue
        : this.$refs.input.value;
      const query = {
        filter: "query",
        values: [value]
      };
      if (this.bestMatch) {
        query.filter = this.bestMatch.filter;
        query.values[0] = this.bestMatch.results[0].value;
      }
      this.addFiltersOrRedirect(query);
    },
    selectSearchResult(category, territory) {
      const query = {
        filter: category.filter,
        values: [territory.value]
      };
      this.addFiltersOrRedirect(query);
    },
    addFiltersOrRedirect(query) {
      const userInputNotEmpty = query.values[0] && query.values[0].length > 0;
      const { path } = this.$router.history.current;
      const searchOnSameType =
        (path.includes("territory-results") &&
          this.selectedSearchType.type === "territory") ||
        (path.includes("project-results") &&
          this.selectedSearchType.type === "project");
      if (searchOnSameType) {
        if (userInputNotEmpty) {
          const options = { skipUrlParams: true };
          this.$store.commit("search/CLEAR_QUERY", options);
          query.resetQueryParams = true;
          this.$store.commit("search/ADD_FILTER", query);
        } else {
          const options = { pushEmptyParams: true };
          this.$store.commit("search/CLEAR_QUERY", options);
        }
        this.$root.$emit("UPDATE_REQUIRED");
      } else {
        const queryParams = userInputNotEmpty
          ? `?${query.filter}.values=${query.values[0]}`
          : "";
        if (this.selectedSearchType.type === "all") {
          if (query.filter === "query") {
            this.$router.push({
              path: `/project-results${queryParams}`
            });
          } else {
            this.$router.push({
              path: `/territory-results${queryParams}`
            });
          }
        } else {
          if (this.selectedSearchType.type === "project") {
            this.$router.push({
              path: `/project-results${queryParams}`
            });
          } else {
            this.$router.push({
              path: `/territory-results${queryParams}`
            });
          }
        }
      }
      this.$refs.input.blur();
    },
    onArrowDown() {
      if (this.searchResults.length) {
        if (this.categoryIndex == null) {
          this.categoryIndex = 0;
          this.categoryResultIndex = 0;
        } else {
          const nextResultInTheSameCategoryExists = this.searchResults[
            this.categoryIndex
          ].results[this.categoryResultIndex + 1];
          const nextCategoryExists = this.searchResults[this.categoryIndex + 1];
          if (nextResultInTheSameCategoryExists) {
            this.categoryResultIndex += 1;
          } else if (nextCategoryExists) {
            this.categoryIndex += 1;
            this.categoryResultIndex = 0;
          } else {
            this.categoryIndex = 0;
            this.categoryResultIndex = 0;
          }
        }
      }
    },
    onArrowUp() {
      if (this.searchResults.length) {
        if (this.categoryIndex == null) {
          this.categoryIndex = this.searchResults.length - 1;
          this.categoryResultIndex =
            this.searchResults[this.categoryIndex].results.length - 1;
        } else {
          const previousResultInTheSameCategoryExists = this.searchResults[
            this.categoryIndex
          ].results[this.categoryResultIndex - 1];
          const previousCategoryExists = this.searchResults[
            this.categoryIndex - 1
          ];
          if (previousResultInTheSameCategoryExists) {
            this.categoryResultIndex -= 1;
          } else if (previousCategoryExists) {
            this.categoryIndex = this.categoryIndex - 1;
            this.categoryResultIndex =
              this.searchResults[this.categoryIndex].results.length - 1;
          } else {
            this.categoryIndex = this.searchResults.length - 1;
            this.categoryResultIndex =
              this.searchResults[this.categoryIndex].results.length - 1;
          }
        }
      }
    },
    onHover(categoryIndex, categoryResultIndex) {
      this.categoryIndex = categoryIndex;
      this.categoryResultIndex = categoryResultIndex;
    },
    onHoverOut() {
      this.categoryIndex = null;
      this.categoryResultIndex = null;
    },
    getSearchLabel() {
      if (this.selectedSearchType.type === "territory") {
        return this.$t("routes.searchTerritories");
      } else if (this.selectedSearchType.type === "project") {
        return this.$t("routes.searchProjects");
      } else {
        return this.$t("routes.searchAll");
      }
    },
    getSearchTypeBasedOnRoute() {
      const { path } = this.$router.history.current;
      let selectedSearchType;
      if (path.includes("territory") || path.includes("territoire")) {
        selectedSearchType = mappedSearchTypes.find(
          search => search.type === "territory"
        );
      } else {
        selectedSearchType = mappedSearchTypes.find(
          search => search.type === "project"
        );
      }
      return selectedSearchType;
    }
  }
};
</script>

<style>
/*Main Page*/
.main-page-button {
  min-height: 55px;
  min-width: 116px;
}
.main-page-search-input {
  width: 100%;
}
.main-page-search-input > div {
  padding-right: 0 !important;
}
.main-page-results {
  width: 100%;
  position: relative;
}

.main-page-results-section {
  position: absolute;
  width: 100%;
  background-color: #222222;
  color: white;
  border-radius: 0 0 6px 6px;
}
.main-page-search-item {
  list-style-type: none;
  margin-left: 0.6em;
  padding-left: 0;
}
.main-page-link-hover {
  background: #383949;
  color: white;
}
.main-page-category-label {
  min-width: 116px;
}
.main-page-category-results {
  flex: 1;
}

@media only screen and (max-width: 450px) {
  .main-page-category-label {
    font-weight: bold;
  }
  .main-page-category-results {
    margin-left: 15px;
  }
  .main-page-search-item {
    flex-direction: column;
  }
}
/*Global page*/
.global-page-button {
  min-height: 40px;
  border-radius: 0;
}
.global-page-category-label {
  color: #777;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}
.global-page-category-results {
  margin-left: 15px;
}
.global-page-search-input > .q-field__inner > div {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
.global-page-search-item {
  flex-direction: column;
}

@media only screen and (max-width: 450px) {
  .global-page-results-section {
    width: calc(100vw - 10px);
    position: absolute;
    right: -2px;
    border-radius: 0;
  }
}
</style>
