<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <q-layout view="hHh lpR fFf">
    <q-header v-if="mainPage" bordered class="bg-primary text-white header">
      <q-toolbar>
        <q-toolbar-title
          shrink
          class="cursor-pointer logo xs-hide sm-hide"
          v-go-back="'/'"
        >
          <q-img :src="require(`../assets/logo_tereval.png`)" />
        </q-toolbar-title>

        <q-tabs class="gt-sm">
          <div v-for="(route, index) in routes" :key="index">
            <q-route-tab :label="route.label" :to="route.to" exact />
          </div>
        </q-tabs>

        <q-tabs class="lt-md">
          <q-icon name="menu" class="menu" @click="drawer = !drawer" />
        </q-tabs>

        <q-toolbar-title
          shrink
          class="cursor-pointer logo-mobile xl-hide lg-hide md-hide"
          v-go-back="'/'"
        >
          <q-img :src="require(`../assets/logo_tereval_mobile.png`)" />
        </q-toolbar-title>

        <q-space></q-space>
        <Autocomplete :global="true" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" bordered content-class="bg-grey-3">
      <q-scroll-area class="fit">
        <q-list v-for="(route, index) in routes" :key="index">
          <q-item
            class="item"
            clickable
            :active="route.label === 'Outbox'"
            v-ripple
          >
            <q-item-section
              class="paragraph--item"
              @click.native="$router.push({ path: route.to })"
              >{{ route.label }}</q-item-section
            >
          </q-item>

          <q-separator />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div id="scrollerY">
        <div id="scrollerX">
          <router-view />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import Autocomplete from "../components/autocomplete/Autocomplete";
export default {
  name: "MyLayout",
  components: { Autocomplete },
  data() {
    return {
      mainPage: this.$route.path !== "/",
      drawer: false,
      title: "Tereval",
      routes: [
        {
          label: this.$t("routes.territory"),
          to: "/territory/none"
        },
        {
          label: this.$t("routes.project"),
          to: "/graph"
        },
        {
          label: this.$t("routes.community"),
          to: "/communaute"
        },
        {
          label: this.$t("routes.indicators"),
          to: "/indicatheque"
        }
      ]
    };
  },
  meta() {
    return {
      // this accesses the "title" property in your Vue "data";
      // whenever "title" prop changes, your meta will automatically update
      title: this.title
    };
  },
  methods: {
    openURL,
    handleResize() {
      if (window.innerWidth >= 1023) {
        this.drawer = false;
      }
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  updated() {
    const currentPath = this.$route.path.replace("/", "");
    this.title = currentPath ? `Tereval - ${currentPath}` : `Tereval`;
    this.mainPage = this.$route.path !== "/";
  }
};
</script>

<style scoped>
.item {
  padding: 0 !important;
}
.paragraph--item {
  margin-left: 16px;
}
.header {
  background-color: #222222 !important;
}
.logo {
  width: 120px;
}
.logo-mobile {
  height: 100%;
  width: 50px;
}
.menu {
  font-size: 1.5rem;
  cursor: pointer;
}

@media only screen and (max-width: 700px) {
  #scrollerX {
    min-width: auto !important;
  }
}
@media only screen and (min-width: 1440px) {
  #scrollerX {
    width: 100%;
  }
}
#scrollerX {
  margin: 0 auto;
}
</style>
