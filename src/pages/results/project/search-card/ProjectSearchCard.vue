<template>
  <q-item
    v-ripple
    class="item q-pa-xs-none q-pa-sm-none q-pa-md-md vertical-top"
  >
    <q-item-section class="col-auto vertical-top img-section">
      <q-img
        :src="imageApi + result.data._id + '?type=' + result.data.projet_type"
        class="img "
        @click="$router.push({ path: `/project-profile/${result.data._id}` })"
      />
    </q-item-section>

    <q-item-section top class="col-xs-8" style="flex-wrap: unset">
      <div class="row info-value">
        <div class="col-7">
          <div class="text-weight-light highlight">
            <a
              @click="
                $router.push({ path: `/project-profile/${result.data._id}` })
              "
              >{{ result.data.nom_scot }}</a
            >
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.projectCard.status") }}:
            <span>{{ result.data.status }}</span>
          </div>
          <div class="text-weight-light">
            {{ $t("searchPage.projectCard.approvalDate") }}:
            <span>{{ result.data.approbation_date }}</span>
          </div>
        </div>

        <div class="col-5">
          <div>
            <div>
              <div
                v-for="(values, index) in result.data.response_files"
                :key="index"
                class="docs"
              >
                <div v-if="showFiles || index < maxFilesToDisplay">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    v-if="values.matched_fragments"
                  >
                    <div
                      v-for="(hl, indexd) in values.matched_fragments"
                      :key="indexd"
                      v-html="hl"
                    />
                  </q-tooltip>
                  <q-icon
                    name="account_tree"
                    @click="$router.push({ path: `/graph/${result.data._id}` })"
                  />
                  <a
                    target="_blank"
                    @click="openDocument(values.parent_path_id)"
                    :class="values.matched_fragments ? 'hlfile' : 'normalfile'"
                  >
                    <q-icon name="picture_as_pdf" />
                    <span>{{ values.sub_doc_type }}</span>
                    <span class="xs-hide">({{ values.nb_pages }} pages)</span>
                    <span class="xs">{{ values.nb_pages }}p</span>
                  </a>
                </div>
              </div>
            </div>
            <div style="max-width: 150px">
              <q-list>
                <q-expansion-item
                  v-if="result.data.response_files.length > maxFilesToDisplay"
                  expand-icon-class="expand-icon"
                  dense
                  @click="toggle()"
                  expand-separator
                  :label="
                    !showFiles
                      ? $t('searchPage.projectCard.showMore')
                      : $t('searchPage.projectCard.showLess')
                  "
                />
              </q-list>
            </div>
          </div>
        </div>
      </div>
    </q-item-section>
    <q-item-section>
      <q-checkbox
        @input="selectCard($event)"
        color="blue"
        class="justify-end"
        v-model="isSelected"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import PdfModal from "../pdf-modal/PdfModal";

export default {
  name: "search",
  props: ["result", "undo", "customList"],
  components: {},

  data() {
    return {
      colors: {
        "1": "green",
        "0": "orange",
        "-1": "red"
      },
      imageApi: process.env.DEV_API.concat("pimages/"),
      showFiles: false,
      maxFilesToDisplay: 4,
      isSelected: !!this.customList
    };
  },
  watch: {
    "$store.state.search.selectedResults"() {
      this.checkForSelectionChanges(this.result);
    },
    isSelected() {
      if (this.customList) {
        this.isSelected = true;
      }
    }
  },
  methods: {
    checkForSelectionChanges(newResult) {
      const selectedResults = this.$store.state.search.selectedResults;
      const isSelected = selectedResults.find(
        selected => selected.data._id === newResult.data._id
      );
      if (this.isSelected !== !!isSelected) {
        this.isSelected = !!isSelected;
      }
    },
    selectCard(value) {
      if (this.customList) {
        this.$store.commit("customList/REMOVE_ELEMENTS_FROM_LIST", {
          listName: this.customList.name,
          elements: [this.result],
          type: "project"
        });
      } else {
        if (value) {
          this.$store.commit("search/SELECT_RESULTS", [this.result]);
        } else {
          this.$store.commit("search/DESELECT_RESULTS", [this.result]);
        }
      }
    },
    toggle() {
      this.showFiles = !this.showFiles;
    },

    getClassColor(value) {
      const name = `text-${this.colors[value]}`;
      return { [name]: true };
    },
    openDocument(currentDocId) {
      this.$q.dialog({
        component: PdfModal,
        parent: this,
        currentDocId,
        undo: this.undo
      });
    }
  },
  beforeMount() {
    this.checkForSelectionChanges(this.result);
  }
};
</script>

<style>
.expand-icon {
  padding-left: 0 !important;
}
em {
  color: #4ccef1;
}
</style>

<style scoped>
.highlight {
  color: #3bb7f1;
  font-weight: bold;
  cursor: pointer;
}

.info-value span {
  font-weight: 400;
}

a {
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}

.hlfile {
  color: red;
  font-weight: bold;
}

.img-section {
  justify-content: start;
  margin-top: 5px;
}

.img {
  width: 120px;
  cursor: pointer;
}
@media only screen and (max-width: 650px) {
  .img {
    width: 74px;
  }
}
@media only screen and (max-width: 460px) {
  .img {
    width: 54px;
  }
}
</style>
