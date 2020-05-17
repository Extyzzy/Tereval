<template>
  <q-dialog
    maximized
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialog"
    @hide="onDialogHide"
    @keydown.esc="onOKClick()"
  >
    <q-card class="text-white no-scroll" style="background-color: #eeeeee">
      <q-bar class="dialog-bar">
        <span v-if="response && response.metas">
          {{ response.metas.label }} - {{ response.metas.sub_type }} -
          {{ response.metas.filename }}</span
        >
        <q-space />
        <q-btn dense flat icon="close" @click="onOKClick()" />
      </q-bar>
      <q-card-section class="dialog-content">
        <div>
          <div class="row" v-if="response">
            <q-btn
              v-if="navigationHidden"
              class="menu-minimized"
              text-color="white"
              @click="navigationHidden = false"
              dense
              flat
              icon="menu"
              style="margin-top: -5px;"
            />
            <div
              v-if="!navigationHidden"
              class="col-xs-12 col-md-3 col-lg-2 text-white navigation"
            >
              <q-btn
                @click="navigationHidden = true"
                class="menu-minimized"
                text-color="white"
                dense
                flat
                icon="menu"
              />
              <div style="background: rgb(45, 46, 58);">
                <q-pagination
                  class="pagination"
                  @input="onPageChange()"
                  v-model="currentPage"
                  :max="nbPages"
                  :input="true"
                  color="white"
                  input-class="text-white custom-input"
                  :input-style="{ fontWeight: 'bold' }"
                />
              </div>
              <q-input
                dense
                dark
                filled
                color="black"
                bg-color="primary"
                v-model="query"
                @keyup.enter.native="onEnter()"
              >
                <template v-if="!loadingIframe" v-slot:append>
                  <q-icon
                    style="cursor: pointer"
                    name="search"
                    @click="onEnter()"
                  />
                </template>
              </q-input>
              <q-expansion-item
                v-if="highlightPages.length"
                style="background: rgb(45, 46, 58);"
                v-model="menuOpen"
                expand-separator
                label="Highlights"
              >
                <q-list class="custom-nav" bordered separator dense>
                  <q-item
                    v-for="page in highlightPages"
                    :key="page"
                    @click="moveToPage(page)"
                    clickable
                    v-ripple
                    :focused="page === currentPage"
                  >
                    <q-item-section>Page {{ page }}</q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </div>
            <div
              class="col-xs-12 q-py-md"
              :class="{
                'col-md-9': !navigationHidden,
                'col-lg-10': !navigationHidden
              }"
            >
              <div
                v-bind:style="{
                  visibility: loadingIframe ? 'initial' : 'hidden'
                }"
                class="col-12 row justify-center loading"
              >
                <q-spinner-dots color="info" size="40px" />
              </div>
              <div class="text-center iframe-container">
                <div class="text-center" v-if="response">
                  <iframe
                    @load="onIframeLoad"
                    :style="cssVars"
                    ref="iframe"
                    id="iframe"
                    :src="initialUrl"
                    class="iframe-viewer"
                  ></iframe>
                </div>
                <div :style="cssVars" class="row custom-overlay">
                  <div
                    @click="onPreviousPageClick()"
                    class="left-container text-center"
                  >
                    <q-icon
                      name="keyboard_arrow_left"
                      color="black"
                      class="icon"
                      size="60px"
                    />
                  </div>
                  <div
                    @click="onNextPageClick()"
                    class="right-container float-right text-center"
                  >
                    <q-icon
                      name="keyboard_arrow_right"
                      color="black"
                      class="icon"
                      size="60px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import RequestService from "../../../../services/request.service";

export default {
  props: ["currentDocId", "undo"],
  data() {
    const currentFilters = this.$store.state.search.query.search_query.filters;
    const queryFilter = currentFilters.find(el => el.filter === "query");
    const query = queryFilter
      ? queryFilter.values[0].replace(/['"]+/g, "")
      : "";

    return {
      response: null,
      query,
      loadingIframe: false,
      highlightPages: [],
      currentPage: null,
      nbPages: 0,
      menuOpen: window.innerWidth > 1024,
      initialUrl: null,
      navigationHidden: window.innerWidth <= 1024,
      cssVars: {}
    };
  },
  watch: {
    currentPage(currentPage) {
      const iframeUrl = this.getHLHref(this.currentDocId, currentPage);
      const ifr = document.getElementById("iframe");
      this.loadingIframe = true;
      if (!this.initialUrl) {
        this.initialUrl = iframeUrl;
        return;
      }
      if (ifr) {
        ifr.contentWindow.location.replace(iframeUrl);
      }
    },
    menuOpen() {
      this.updateCssVars();
    },
    navigationHidden() {
      this.updateCssVars();
    },
    "$refs.iframe"() {
      this.updateCssVars();
    }
  },
  methods: {
    onEnter() {
      const query = {
        query: this.query,
        id: this.currentDocId
      };
      RequestService.GetHLFile(query).then(res => {
        this.response = res;
        this.currentPage = res.first_page;
        this.highlightPages = res.hl_pages.slice();
        this.nbPages = res.nb_page;
      });
    },
    updateCssVars() {
      let iframeHeight = window.innerHeight - 55;
      let iframeWidth = "";
      if (this.$refs.iframe) {
        iframeWidth = this.$refs.iframe.clientWidth;
      }
      if (window.innerWidth <= 1024 && !this.navigationHidden) {
        if (!this.menuOpen) {
          const offset = this.highlightPages.length ? 100 : 50;
          iframeHeight = iframeHeight - offset;
        } else {
          iframeHeight = iframeHeight - 100 - 32 * this.highlightPages.length;
        }
      }
      this.cssVars = {
        "--iframeHeight": iframeHeight + "px",
        "--iframeWidth": iframeWidth + "px",
        "--leftMarginTop": -(window.innerHeight - 49) + "px",
        "--rightMarginTop": -(window.innerHeight - 55) + "px"
      };
    },
    onPreviousPageClick() {
      if (this.currentPage > 1) {
        this.moveToPage(this.currentPage - 1);
      }
    },
    onNextPageClick() {
      if (this.currentPage < this.nbPages) {
        this.moveToPage(this.currentPage + 1);
      }
    },
    onIframeLoad() {
      this.loadingIframe = false;
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      this.$emit("ok");
      this.hide();
    },
    moveToPage(page) {
      this.currentPage = page;
    },
    onPageChange() {
      this.moveToPage(this.currentPage);
    },
    getHLHref(id, page) {
      this.currentPage = page;
      const prefix = process.env.DEV_API.concat("highlightContent?query=");
      const url = prefix + this.query + "&id=" + id + "&from=" + page;
      return url;
    },
    handleResize() {
      this.menuOpen = window.innerWidth > 1024;
      this.navigationHidden = window.innerWidth <= 1024;
      this.updateCssVars();
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    const initialPath = this.$router.history.current.fullPath;
    window.onpopstate = () => {
      if (this.$refs.dialog) {
        this.$router.push({ path: initialPath });
        this.onOKClick();
      } else {
        this.undo();
      }
    };
    this.onEnter();
  }
};
</script>

<style>
.zcftrekeyword {
  color: black;
  background-color: #ffd869;
}
.loading {
  z-index: 1;
  position: relative;
  margin-top: -20px;
}

.iframe-container {
  z-index: 0;
  position: relative;
  margin-top: -43px;
}

.iframe-viewer {
  width: calc(100% + 15px) !important;
  height: var(--iframeHeight);
  z-index: 2000 !important;
  border: 0;
  scroll-behavior: auto;
  background-color: white;
  /*-ms-zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.75);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.75);
  -webkit-transform-origin: 0 0;*/
}
</style>
<style scoped>
.navigation {
  margin-top: -5px;
  z-index: 1;
}
.menu-minimized {
  position: absolute;
  background: rgb(45, 46, 58);
  z-index: 1;
  padding: 8px;
}
.pagination {
  margin: auto;
  width: max-content;
  padding-bottom: 2%;
  background: rgb(45, 46, 58);
}

.dialog-bar {
  position: fixed;
  width: 100%;
  height: 30px;
  background: rgb(45, 46, 58);
  z-index: 1;
}

.dialog-content {
  margin-top: 30px;
}

.custom-nav {
  background: rgb(45, 46, 58);
  max-height: 250px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
.custom-overlay {
  width: var(--iframeWidth);
  display: block;
  margin: 0 auto;
}
.left-container {
  width: 200px;
  height: var(--iframeHeight);
  background: transparent;
  position: relative;
  margin-top: var(--leftMarginTop);
  cursor: pointer;
}
.left-container:hover {
  background: rgba(0, 0, 0, 0.2);
}

.left-container:hover i {
  visibility: initial;
  top: 45%;
}
.left-container i {
  visibility: hidden;
}
.right-container {
  width: 200px;
  height: var(--iframeHeight);
  background: transparent;
  position: relative;
  margin-top: var(--rightMarginTop);
  cursor: pointer;
}
.right-container:hover {
  background: rgba(0, 0, 0, 0.2);
}
.right-container:hover i {
  visibility: initial;
  top: 45%;
}
.right-container i {
  visibility: hidden;
}
.q-card__section {
  padding-left: 0 !important;
}
@media only screen and (max-width: 1024px) {
  .custom-overlay {
    display: none;
  }
}
</style>
