<template>
  <div>
    <div class="q-pa-md row flex flex-center">
      <div class="col">
        <div class="text-h6">{{ $t("projectPage.extractedConcepts") }}</div>
      </div>
      <div class="col-auto">
        <q-btn dense flat icon="more_horiz" class="q-ma-sm" />
      </div>
      <div class="col-auto">
        <q-input
          dense
          :loading="loading"
          v-model="searchModel"
          debounce="500"
          filled
          v-bind:placeholder="$t('general.input')"
          class="search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- ENJEUX -->
    <div class="enjeux-card q-pa-md flex">
      <div class="flex justify-between full">
        <div class="flex column">
          <span class="text-h5"
            >{{ nodesCat.enjeux.length }} {{ $t("projectPage.issues") }}</span
          >
          <span>{{ $t("projectPage.foundInDocument") }}</span>
        </div>

        <div>
          <q-btn flat icon="menu" class="q-ma-sm" />
        </div>
      </div>

      <Draggable
        :list="nodesCat.enjeux"
        group="card"
        @change="change"
        handle=".handle"
        class="draggable"
      >
        <transition-group>
          <div
            class="card-list q-py-xs full"
            v-for="enjeux in nodesCat.enjeux"
            :key="enjeux.label"
          >
            <div class="card enjeux-bg rounded-borders q-pa-sm">
              <span>{{ enjeux.label }}</span>
              <div class="flex">
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="link" class="q-ma-xs" />
                  <span>0</span>
                </div>
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="settings" class="q-ma-xs" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </Draggable>
    </div>

    <!-- OBJECTIFS -->
    <div class="objectif-card q-pa-md flex">
      <div class="flex justify-between full">
        <div class="flex column">
          <span class="text-h5"
            >{{ nodesCat.objectifs.length }}
            {{ $t("projectPage.objectifs") }}</span
          >
          <span>{{ $t("projectPage.foundInDocument") }}</span>
        </div>

        <div>
          <q-btn flat icon="menu" class="q-ma-sm" />
        </div>
      </div>

      <Draggable
        :list="nodesCat.objectifs"
        group="card"
        @change="change"
        handle=".handle"
        class="draggable"
      >
        <transition-group>
          <div
            class="card-list q-py-xs full"
            v-for="objectif in nodesCat.objectifs"
            :key="objectif.label"
          >
            <div class="card objectif-bg rounded-borders q-pa-sm">
              <span>{{ objectif.label }}</span>
              <div class="flex">
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="link" class="q-ma-xs" />
                  <span>0</span>
                </div>
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="settings" class="q-ma-xs" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </Draggable>
    </div>

    <!-- MMO -->
    <div class="mmo-card q-pa-md flex">
      <div class="flex justify-between full">
        <div class="flex column">
          <span class="text-h5"
            >{{ nodesCat.mmo.length }}
            {{ $t("projectPage.meansOfImplementation") }}</span
          >
          <span>{{ $t("projectPage.foundInDocument") }}</span>
        </div>

        <div>
          <q-btn flat icon="menu" class="q-ma-sm" />
        </div>
      </div>

      <Draggable
        :list="nodesCat.mmo"
        group="card"
        @change="change"
        handle=".handle"
        class="draggable"
      >
        <transition-group>
          <div
            class="card-list q-py-xs full"
            v-for="mmo in nodesCat.mmo"
            :key="mmo.label"
          >
            <div class="card mmo-bg rounded-borders q-pa-sm">
              <span>{{ mmo.label }}</span>
              <div class="flex">
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="link" class="q-ma-xs" />
                  <span>0</span>
                </div>
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="settings" class="q-ma-xs" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </Draggable>
    </div>

    <!-- QEV -->
    <div class="qev-card q-pa-md flex">
      <div class="flex justify-between full">
        <div class="flex column">
          <span class="text-h5"
            >{{ nodesCat.qev.length }}
            {{ $t("projectPage.meansOfImplementation") }}</span
          >
          <span>{{ $t("projectPage.foundInDocument") }}</span>
        </div>

        <div>
          <q-btn flat icon="menu" class="q-ma-sm" />
        </div>
      </div>
      <Draggable
        :list="nodesCat.qev"
        group="card"
        @change="change"
        handle=".handle"
        class="draggable"
      >
        <transition-group>
          <div
            class="card-list q-py-xs full"
            v-for="qev in nodesCat.qev"
            :key="qev.label"
          >
            <div class="card handle qev-bg rounded-borders q-pa-sm">
              <span>{{ qev.label }}</span>
              <div class="flex">
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="link" class="q-ma-xs" />
                  <span>0</span>
                </div>
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="settings" class="q-ma-xs" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </Draggable>
    </div>

    <!-- ORPHELINS -->
    <div class="orphelins-card q-pa-md flex">
      <div class="flex justify-between full">
        <div class="flex column">
          <span class="text-h5"
            >{{ nodesCat.orphelins.length }}
            {{ $t("projectPage.concepts") }}</span
          >
          <span>{{ $t("projectPage.foundInDocument") }}</span>
        </div>

        <div>
          <q-btn flat icon="menu" class="q-ma-sm" />
        </div>
      </div>
      <Draggable
        :list="nodesCat.orphelins"
        group="card"
        @change="change"
        class="draggable"
        handle=".handle"
      >
        <transition-group>
          <div
            class="card-list q-py-xs full"
            v-for="orphelin in nodesCat.orphelins"
            :key="orphelin.label"
          >
            <div class="card handle orphelins-bg rounded-borders q-pa-sm">
              <span>{{ orphelin.label }}</span>
              <div class="flex">
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="link" class="q-ma-xs" />
                  <span>0</span>
                </div>
                <div class="flex flex-center q-px-sm opacity link">
                  <q-icon name="settings" class="q-ma-xs" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </Draggable>
    </div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  name: "graph",
  components: { Draggable },
  props: ["nodes"],
  data() {
    return {
      drawer: true,
      loading: false,
      searchModel: null,
      nodesCat: {
        enjeux: [],
        objectifs: [],
        mmo: [],
        qev: [],
        orphelins: this.nodes
      }
    };
  },
  computed: {},
  methods: {
    // change(value, value2, value3) {
    //   console.log("plip", value, value2, value3);
    // }
  },
  mounted: function() {
    this.nodesCat.orphelins = this.nodes;
  }
};
</script>

<style scoped>
.draggable {
  border-radius: 5px;
  padding: 30px;
  border: solid 1px black;
  width: 100%;
}

.search {
  max-width: 150px;
}

.opacity {
  opacity: 0.7;
}

.full {
  width: 100%;
}
.link {
  cursor: pointer;
}

.card {
  color: white;
  width: 100%;
}

.objectif-bg {
  background-color: #5b34e8;
}

.mmo-bg {
  background-color: #34b5e8;
}

.orphelins-bg {
  background-color: grey;
}

.qev-bg {
  background-color: #ed8842;
}

.enjeux-bg {
  background-color: #12d49e;
}

.objectif-card {
  color: #5b34e8;
}
.mmo-card {
  color: #34b5e8;
}
.orphelins-card {
  color: grey;
}
.enjeux-card {
  color: #12d49e;
}
.qev-card {
  color: #ed8842;
}

.objectif-data {
  border: 1px solid #5b34e8;
  color: #5b34e8;
}

.enjeux-data {
  border: 1px solid #12d49e;
  color: #12d49e;
}

.mmo-data {
  border: 1px solid #34b5e8;
  color: #34b5e8;
}

.qev-data {
  border: 1px solid #ed8842;
  color: #ed8842;
}
.orphelins-data {
  border: 1px solid grey;
  color: grey;
}
.header-graph {
  height: 15vh;
}
#mynetwork {
  width: 100%;
  height: 70vh;
  /* border: 1px solid rgba(0, 0, 0, 0.12); */
}
</style>
