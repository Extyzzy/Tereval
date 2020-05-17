<template>
  <div
    class="text-h6 q-pt-md blue"
    v-if="territoriesList && territoriesList.results.length"
  >
    {{ mainLabel }}
    <q-card>
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        inline-label
      >
        <q-tab icon="map" name="map" label="Map"></q-tab>
        <q-tab icon="list" name="list" label="List"></q-tab>
      </q-tabs>

      <q-separator></q-separator>

      <q-tab-panels v-model="activeTab" animated keep-alive>
        <q-tab-panel name="map">
          <Mapbox
            :style="cssVars"
            :access-token="mapBoxAPI"
            :map-options="{
              style: 'mapbox://styles/mapbox/light-v9',
              center: territoriesList.mapInfo.geo_center,
              zoom: 3,
              container: mainLabel
            }"
            :nav-control="{ show: false, position: 'top-right' }"
            @map-load="mapLoaded"
            :fullscreen-control="{
              show: true,
              position: 'top-left'
            }"
          >
          </Mapbox>
        </q-tab-panel>

        <q-tab-panel name="list" keep-alive>
          <q-input
            debounce="0"
            filled
            v-bind:placeholder="searchPlaceholder"
            v-model="searchModel"
            class="searchInput"
          >
            <template v-slot:append>
              <q-icon class="searchIcon" name="search" />
            </template>
          </q-input>
          <div class="tab-panel">
            <q-list
              v-for="(result, index) in listOfTerritories"
              :key="index"
              bordered
              separator
              dense
            >
              <q-item
                class="item"
                clickable
                @click="goToProfile(result.data._id)"
              >
                <q-item-section>{{ result.data.label }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="link-similar">
            <a href="#" class="text-grey-10 text-body2 text-weight-light">
              {{ viewAllLabel }}
            </a>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

export default {
  name: "MapWithList",
  components: { Mapbox },
  props: [
    "territoriesList",
    "profile",
    "border",
    "height",
    "circleRadius",
    "circleColor",
    "fillColor",
    "fillOpacity",
    "mainLabel",
    "searchPlaceholder",
    "viewAllLabel"
  ],
  data() {
    return {
      loaded: false,
      mapBoxAPI: process.env.MAPBOX_API_KEY,
      activeTab: "map",
      searchModel: ""
    };
  },
  methods: {
    async goToProfile(id) {
      this.activeTab = "map";
      await this.$router.push({ path: `/territory/${id}` });
    },
    mapLoaded(map) {
      map.addLayer({
        id: "points",
        type: "fill",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: this.territoriesList.mapInfo.geo_locations
          }
        },
        paint: {
          "fill-color": "#F00",
          "fill-opacity": this.fillOpacity ? this.fillOpacity : 0.5
        }
      });
      map.addLayer({
        id: "maine",
        type: "fill",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: this.profile.data.location_coord.type,
              coordinates: this.profile.data.location_coord.coordinates
            }
          }
        },
        layout: {},
        paint: {
          "fill-color": this.fillColor ? this.fillColor : "#0F0",
          "fill-opacity": this.fillOpacity ? this.fillOpacity : 1
        }
      });

      map.fitBounds(this.territoriesList.mapInfo.geo_bbox, { padding: 10 });
    },
    getList(searchModel, initialList) {
      if (searchModel === null || searchModel.trim() === "") {
        return initialList.results;
      }

      const inputValue = searchModel.toLowerCase().trim();

      return initialList.results.filter(territory => {
        return (
          territory.data.label
            .toLowerCase()
            .trim()
            .indexOf(inputValue) === 0
        );
      });
    }
  },
  computed: {
    listOfTerritories() {
      return this.getList(this.searchModel, this.territoriesList);
    },
    cssVars() {
      return {
        "--height": this.height
      };
    }
  }
};
</script>

<style>
.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right {
  display: none;
}
.searchInput {
  height: 35px;
}
.searchInput > div > div {
  height: 35px;
}
.searchIcon {
  margin-top: -20px;
}
</style>

<style scoped>
.blue {
  color: #3bb7f1;
}

.item {
  font-size: 12px;
  line-height: 1.25em;
}

.q-tab-panel {
  min-height: 268px;
  padding: 0 !important;
}

.link-similar {
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.tab-panel {
  max-height: 202px;
  height: 202px;
  overflow-y: scroll;
  margin: 0;
  padding: 0;
}
.mapboxgl-map {
  width: 100%;
  height: var(--height);
}
</style>
