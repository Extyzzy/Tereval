<template>
  <div>
    <div class="q-pa-md containerSecondBox">
      <p class="text-h5 q-pt-md text-uppercase md-hide lg-hide xl-hide">
        {{ profile.data.label }}
      </p>
      <p class="text-h5 q-pt-md">{{ $t("territoryPage.profil") }}</p>
      <div class="row-flex">
        <div
          class="box"
          :class="getClass(elem.key, elem.id)"
          v-for="elem in liste"
          :key="elem.id"
          @click="$emit(`selectIndicator`, elem.id)"
        >
          <q-img :src="require(`../../assets/themes/P${elem.id}.png`)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "territory",
  props: ["profile", "selectedIndicator"],
  components: {},
  data() {
    return {
      liste: [
        {
          id: 1,
          name: "demographie",
          key: "demog_indicator"
        },
        {
          id: 2,
          name: "economie",
          key: "eco_indicator"
        },
        {
          id: 3,
          name: "foncier",
          key: "foncier_indicator"
        },
        {
          id: 4,
          name: "environnement",
          key: "env_indicator"
        }
      ]
    };
  },
  methods: {
    getClass(indicatorKey, indicatorId) {
      const value = this.profile.calculated[indicatorKey];
      switch (value) {
        case 1: {
          return {
            green: true,
            "indicator-selected": this.selectedIndicator === indicatorId
          };
        }
        case 0: {
          return {
            orange: true,
            "indicator-selected": this.selectedIndicator === indicatorId
          };
        }
        case -1: {
          return {
            red: true,
            "indicator-selected": this.selectedIndicator === indicatorId
          };
        }
        default: {
          return {
            grey: true,
            "indicator-selected": this.selectedIndicator === indicatorId
          };
        }
      }
    }
  }
};
</script>

<style scoped>
.orange {
  background: orange;
}

.green {
  background: #70ad47;
}

.red {
  background: #f44336;
}
.grey {
  background: gray;
}

.containerSecondBox {
  padding-top: 4px;
}

.text-h5 {
  color: #3bb7f1;
  padding-top: 0;
}
.profil-elem {
  background-color: blue;
}
.profil-elem:after {
  content: "";
  display: block;
  padding-bottom: 50%;
}
.icon-big {
  font-size: 4em;
}

.grid-square {
  margin: 0 auto;
  width: 80%;
  height: 80%;
  font-size: 1rem;
}

.row-flex {
  display: flex;
}
.box {
  margin: 5px;
  color: white;
  font-weight: bold;
  flex: 1 0 auto;
  position: relative;
  cursor: pointer;
}
.indicator-selected {
  border: 2px solid black;
}
.box:after {
  content: "";
  float: left;
  display: block;
  padding-top: 100%;
}
.box .inner {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
