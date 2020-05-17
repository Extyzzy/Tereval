<template>
  <div>
    <q-drawer v-model="drawer" :width="500" bordered
      ><drawerGraph :nodes="this.response.nodes"></drawerGraph>
    </q-drawer>

    <q-page>
      <div class="row q-px-xl q-py-md flex justify-between">
        <span class="text-h6">{{ $t("projectPage.project") }}</span>
        <!-- <div class="text-h6">type</div> -->
      </div>
      <div class="row header-graph q-px-md">
        <div
          class="col-1 enjeux-data rounded-borders flex flex-center column q-ma-md"
        >
          <span class="q-ma-xs">{{ $t("projectPage.issues") }}</span>
          <span class="q-ma-xs text-h6">80%</span>
          <span class="q-ma-xs">{{ $t("projectPage.treaty") }}</span>
        </div>
        <div
          class="col-1 objectif-data rounded-borders flex flex-center column q-ma-md"
        >
          <span class="q-ma-xs">{{ $t("projectPage.objectifs") }}</span>
          <span class="q-ma-xs text-h5">50%</span>
          <span class="q-ma-xs">{{ $t("projectPage.treaty") }}</span>
        </div>
        <div
          class="col-1 mmo-data rounded-borders flex flex-center column q-ma-md"
        >
          <span class="q-ma-xs">{{ $t("projectPage.mmo") }}</span>
          <span class="q-ma-xs text-h5">22%</span>
          <span class="q-ma-xs">{{ $t("projectPage.treaty") }}</span>
        </div>
        <div
          class="col-1 qev-data rounded-borders flex flex-center column q-ma-md"
        >
          <span class="q-ma-xs">{{ $t("projectPage.qev") }}</span>
          <span class="q-ma-xs text-h5">5%</span>
          <span class="q-ma-xs">{{ $t("projectPage.treaty") }}</span>
        </div>
        <div
          class="col-1 orphelins-data rounded-borders flex flex-center column q-ma-md"
        >
          <span class="q-ma-xs">{{ $t("projectPage.orphans") }}</span>
          <span class="q-ma-xs text-h5">10%</span>
          <span class="q-ma-xs">{{ $t("projectPage.treaty") }}</span>
        </div>
      </div>
      <div class="flex justify-between">
        <div id="mynetwork"></div>
      </div>
    </q-page>
  </div>
</template>

<script>
import vis from "vis";
import mockedNodes from "../../mock/nodes2";
import drawerGraph from "./Drawer";
var nodes = {};
var edges = {};
var container = {};
var data = {};
var options = {};
var network = {};

export default {
  name: "graph",
  components: { drawerGraph },
  data() {
    return {
      drawer: true,
      loading: false,
      searchModel: null,
      response: mockedNodes,
      mappedEdges: [],
      mappedNodes: [],
      nodesCat: {
        enjeux: [],
        objectifs: [],
        mmo: [],
        qev: [],
        orphelins: []
      }
    };
  },
  computed: {},
  methods: {
    updateNodeLevel: function(node) {
      this.mappedNodes = this.mappedNodes.map(elem => {
        elem.key = elem.key + 1;
        if (elem.id === node.id) {
          elem.level = node.level;
          elem.group = node.level;
          elem.parent = [];
        } else if (elem.parent.includes(node.id)) {
          elem.parent = elem.parent.filter(id => id !== node.id);
        }
        return elem;
      });
      this.updateGraph();
    },
    updateNodeParent: function() {
      this.updateGraph();
    },
    setMappedEdges: function() {
      this.mappedEdges = this.response.edges.map(edge => {
        return {
          from: edge.source,
          to: edge.target
        };
      });
    },
    updateGraph: function() {
      this.setMappedEdges();

      const finalNodes = this.response.nodes.map(node => {
        return {
          id: node.id,
          // level: node.level,
          group: 1,
          label: node.label
        };
      });

      nodes = new vis.DataSet(finalNodes);
      edges = new vis.DataSet(this.mappedEdges);
      container = document.getElementById("mynetwork");
      data = {
        nodes: nodes,
        edges: edges
      };
      options = {
        autoResize: true,
        physics: {
          enabled: false
        },
        layout: {
          hierarchical: {
            enabled: true,
            direction: "UD" // UD, DU, LR, RL
          }
        },
        groups: {
          0: { shape: "triangle" },
          1: { shape: "square" },
          2: { shape: "diamond" },
          3: { shape: "dot" },
          4: { shape: "star" }
        }
      };
      network = new vis.Network(container, data, options);
      network.on("click", function() {
        // console.log("clicked node " + properties.nodes);
      });
    },
    mapNodesByCat() {
      this.nodesCat.orphelins = this.response.nodes;
    }
  },
  mounted: function() {
    this.updateGraph();
    this.mapNodesByCat();
  }
};
</script>

<style scoped>
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

.objectif {
  background-color: #5b34e8;
}

.mmo {
  background-color: #34b5e8;
}

.orphelins {
  background-color: grey;
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
