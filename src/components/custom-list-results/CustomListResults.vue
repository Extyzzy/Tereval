<template>
  <div>
    <div class="row">
      <div class="col">
        <q-list separator v-if="SelectedList && SelectedList.items.length">
          <div
            v-for="result in SelectedList.items"
            :key="result.data._id"
            class="q-pl-sm-sm q-pt-sm q-pb-sm doc-container vertical-top"
          >
            <ProjectSearchCard
              v-if="type === 'project'"
              :result="result"
              :customList="SelectedList"
            ></ProjectSearchCard>
            <TerritorySearchCard
              v-if="type === 'territory'"
              :result="result"
              :customList="SelectedList"
            />
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
import TerritorySearchCard from "../../pages/results/territory/search-card/TerritorySearchCard";
import debounce from "lodash/debounce";
import UtilService from "../../services/util.service";
import ProjectSearchCard from "../../pages/results/project/search-card/ProjectSearchCard";

export default {
  props: ["currentlySelectedList", "type"],
  components: {
    TerritorySearchCard,
    ProjectSearchCard
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
  data() {
    return {
      isScrollUpButtonActive: false,
      scrollerY: null
    };
  },
  methods: {
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

@media only screen and (max-width: 600px) {
  .goTop {
    right: 15px;
    bottom: 5px;
  }
}
</style>
