<template>
  <div>
    <div class="row">
      <div class="col parrent">
        <q-list separator v-if="results.length">
          <div
            v-for="result in results"
            :key="result.data._id"
            class="q-pl-sm-sm q-pt-sm q-pb-sm doc-container vertical-top"
          >
            <ProjectSearchCard :undo="undo" :result="result" />
          </div>
          <template>
            <div class="xs-hide sm-hide q-pa-md flex flex-center">
              <q-icon
                v-if="current !== 1"
                style="cursor: pointer"
                color="blue"
                name="first_page"
                @click="toFirstPage()"
                size="22px"
              />
              <q-pagination
                v-if="numberOfPages > 1"
                v-model="current"
                :max="numberOfPages"
                :maxPages="6"
                :boundary-numbers="false"
                color="blue"
                :direction-links="true"
              >
              </q-pagination>
            </div>
            <div class="text-center">
              <q-btn
                class="md-hide lg-hide xl-hide text-center"
                color="blue"
                v-if="results.length < total && !loading"
                @click="loadMore()"
                label="Load More"
              />
            </div>
          </template>
          <div class="row justify-center loading-dots">
            <q-spinner-dots v-if="loading" color="primary" size="40px" />
          </div>
          <div v-if="isScrollUpButtonActive" class="goTop" @click="scrollUp">
            <q-icon name="expand_less" class="icon" />
          </div>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectSearchCard from "../search-card/ProjectSearchCard";
import debounce from "lodash/debounce";
import UtilService from "../../../../services/util.service";

export default {
  name: "search",
  props: ["results", "update", "loading", "total", "undo"],
  components: {
    ProjectSearchCard
  },
  data() {
    return {
      isScrollUpButtonActive: false,
      scrollerY: null,
      current: 1,
      numberOfPages: this.total
        ? Math.ceil(
            this.total / this.$store.state.search.query.search_query.size
          )
        : 0
    };
  },
  watch: {
    current(newVal) {
      const { from, size } = this.$store.state.search.query.search_query;
      const lastQueryPage = from / size + 1;
      if (lastQueryPage !== newVal) {
        //Only load when user changed the page manually
        this.loadPage(newVal - 1);
      }
    },
    total(newVal) {
      //Reset current page and number of pages
      this.current = 1;
      this.numberOfPages = Math.ceil(newVal / 10);
    },
    "$store.state.search.query.search_query.from"(from) {
      if (!from) {
        this.current = 1;
      }
    }
  },
  methods: {
    toFirstPage() {
      this.current = 1;
    },
    loadPage(index) {
      this.update(index).then(() => {
        this.scrollUp();
      });
    },
    loadMore() {
      const pageSize = this.$store.state.search.query.search_query.size;
      const index = Math.ceil(this.results.length / pageSize);
      this.update(index, true);
    },
    onScroll() {
      this.isScrollUpButtonActive = this.scrollerY.scrollTop > 200;
    },
    scrollUp() {
      UtilService.scrollToTop();
      this.isScrollUpButtonActive = false;
    }
  },
  created() {
    this.scrollerY = document.getElementById("scrollerY");
    this.handleDebouncedScroll = debounce(this.onScroll, 30);
    this.scrollerY.addEventListener("scroll", this.handleDebouncedScroll);
  },

  beforeDestroy() {
    if (this.scrollerY) {
      this.scrollerY.removeEventListener("scroll", this.handleDebouncedScroll);
    }
  }
};
</script>

<style>
.parrent {
  position: relative;
}
.goTop {
  border-radius: 5px;
  background-color: rgb(1, 14, 27);
  background-color: rgba(1, 14, 27, 0.7);
  position: fixed;
  width: 45px;
  height: 45px;
  display: block;
  right: 50px;
  bottom: 50px;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: 0.5s ease;
}

.goTop:hover {
  transition: 0.5s ease;
  opacity: 1;
}

.goTop:active .icon {
  padding-top: 8px !important;
}

.goTop:focus .icon {
  padding-top: 8px !important;
}

.icon {
  padding-top: 11px;
  color: white;
  font-size: 32px;
  margin: 0 auto;
  display: flex;
}

.loading-dots {
  min-height: 40px;
}
@media only screen and (max-width: 600px) {
  .goTop {
    right: 15px;
    bottom: 5px;
  }
}
</style>
