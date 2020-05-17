<template>
  <q-list padding bordered class="rounded-borders">
    <div v-for="(facet, key) in data" :key="key">
      <FacetContainer
        :label="facet.label"
        v-if="facet.type === 'range' && facet.min < facet.max"
        :opened="!mobile && facet.expanded"
      >
        <Range
          :label="facet.label"
          :fieldname="facet.filter"
          :options="facet"
          :sortedIntervals="
            facet.interval_values &&
              facet.interval_values.slice().sort((a, b) => a - b)
          "
          @update="update"
        ></Range>
      </FacetContainer>

      <FacetContainer
        :label="facet.label"
        v-else-if="facet.type === 'checkbox' && facet.values.length"
        :opened="!mobile && facet.expanded"
        :icons="checkBoxIcons"
      >
        <CheckboxGroup
          :label="facet.label"
          :fieldname="facet.filter"
          :showCount="facet.show_count"
          :options="facet.values"
          :loading="loading"
          @update="update"
        ></CheckboxGroup>
      </FacetContainer>

      <FacetContainer
        tagCloud
        :label="facet.label"
        v-else-if="facet.type === 'tagcloud' && facet.values.length"
        :opened="!mobile && facet.expanded"
      >
        <vue-word-cloud
          :words="wordCloud[facet.filter].words"
          :color="
            ([text, weight, color]) =>
              wordCloud[facet.filter].activeWords.some(v => v.label === text)
                ? '#e55039'
                : color
          "
        >
          <template slot-scope="{ text, weight, word }">
            <div
              :title="weight"
              class="word"
              @click="searchByCloud(word, facet.filter)"
            >
              {{ text }}
            </div>
          </template>
        </vue-word-cloud>
      </FacetContainer>
      <FacetContainer
        :label="facet.label"
        v-else-if="facet.type === 'radio' && facet.values.length"
        :opened="!mobile && facet.expanded"
      >
        <RadioGroup
          :label="facet.label"
          :fieldname="facet.filter"
          :options="facet.values"
          @update="update"
        ></RadioGroup>
      </FacetContainer>

      <FacetContainer
        :label="facet.label"
        v-else-if="facet.type === 'color_selector' && facet.values.length"
        :opened="!mobile && facet.expanded"
      >
        <EvolutionType
          :facet="facet"
          :options="facet.values"
          @update="update"
        ></EvolutionType>
      </FacetContainer>
    </div>
  </q-list>
</template>

<script>
import Range from "../form/Range";
import CheckboxGroup from "../form/CheckboxGroup";
import RadioGroup from "../form/RadioGroup";
import FacetContainer from "../facet-containers/FacetContainer";
import VueWordCloud from "vuewordcloud";
import EvolutionType from "../facet-containers/EvolutionType";

export default {
  components: {
    EvolutionType,
    FacetContainer,
    CheckboxGroup,
    RadioGroup,
    Range,
    [VueWordCloud.name]: VueWordCloud
  },
  props: ["data", "loading"],
  data() {
    return {
      form: {},
      wordCloud: {},
      activeCloudWords: [],
      mobile: window.innerWidth < 1024,
      checkBoxIcons: ["account_tree", "network_check"]
    };
  },
  methods: {
    searchByCloud(word, filterCode) {
      const filter = this.data.find(data => data.filter === filterCode);
      const tagObject = filter.values.find(data => data.label === word[0]);
      let currentCloudFilter = this.$store.state.search.query.search_query.filters.find(
        f => f.filter === filter.filter
      );
      let values = [];
      if (currentCloudFilter) {
        const wordSelected =
          currentCloudFilter.values.filter(v => v === tagObject.value).length >
          0;
        if (wordSelected) {
          values = currentCloudFilter.values.filter(v => v !== tagObject.value);
        } else {
          values.push(...currentCloudFilter.values);
          values.push(tagObject.value);
        }
      } else {
        values.push(tagObject.value);
      }

      const requestFilter = {
        field: filter.filter,
        value: values,
        label: tagObject.label
      };

      this.update(requestFilter);
    },
    addFilter(args) {
      const filter = {
        filter: args.field,
        values: Array.isArray(args.value) ? args.value : [args.value]
      };
      this.$store.commit("search/ADD_FILTER", filter);
    },
    update(args) {
      if (!this.form[args.field]) {
        this.form[args.field] = {};
      }
      this.form[args.field].model = args.value;

      if (!!args.value && args.value.length <= 0) {
        this.$store.commit("search/REMOVE_FILTER", args.field);
      } else {
        this.addFilter(args);
      }

      this.$emit("update");
    },
    getOptions(options) {
      const tmp = options.values.map(v => {
        return {
          ...v,
          min: options.min,
          max: options.max
        };
      });
      return tmp;
    },
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    generateWordCloudArray(array) {
      let result = [];

      array.forEach(el => {
        const newArr = [el, this.getRandomNumber(12, 16), "#2196f3"];
        result.push(newArr);
      });
      return result;
    },
    checkForSelectedCloudWords() {
      this.data.forEach(filter => {
        if (filter.type === "tagcloud") {
          const { search } = this.$store.state;

          const wordCloudOptions = search.apiFilters.find(
            f => f.filter === filter.filter
          );
          const activeTagCloudFilterCode = search.apiFilters.find(
            f => f.filter === filter.filter
          ).filter;
          const activeTagCloudFilters = search.query.search_query.filters.find(
            f => f.filter === activeTagCloudFilterCode
          );
          this.wordCloud[filter.filter].activeWords = [];
          if (activeTagCloudFilters) {
            activeTagCloudFilters.values.forEach(activeWordCode => {
              const wordInfo = wordCloudOptions.values.find(
                el => el.value === activeWordCode
              );
              if (wordInfo) {
                this.wordCloud[filter.filter].activeWords.push(wordInfo);
              }
            });
          }
        }
      });
    },
    prepareWordCloud() {
      this.data.forEach(filter => {
        if (filter.type === "tagcloud") {
          const apiFilters = this.$store.state.search.apiFilters.find(el => {
            return el.filter === filter.filter;
          });
          const options = apiFilters.values.map(data => data.label);

          this.wordCloud[filter.filter] = {
            words: this.generateWordCloudArray(options),
            activeWords: []
          };
        }
      });
      this.checkForSelectedCloudWords();
    }
  },
  beforeUpdate() {
    this.prepareWordCloud();
  },
  beforeMount() {
    this.prepareWordCloud();
  }
};
</script>

<style scoped>
.word:hover {
  cursor: pointer;
  color: #383949;
}
</style>
