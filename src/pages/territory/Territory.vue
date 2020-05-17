<template>
  <div>
    <div class="q-pa-xs-xs q-pa-lg-md" v-if="profile">
      <div class="container">
        <div class="row justify-center main-container">
          <div
            class="col-xs-11 col-sm-11 col-md-4 col-lg-3 col-xl-3 left-container row"
          >
            <div class="col-xs-12 col-sm-6 col-md-12 text-h6 q-pt-md blue">
              {{ profile.data.label }}
              <Mapbox
                :access-token="mapBoxAPI"
                v-if="loaded"
                :map-options="{
                  style: 'mapbox://styles/mapbox/light-v9',
                  center: [2.213749, 46.227638],
                  zoom: 3,
                  container: 'map'
                }"
                :nav-control="{ show: false, position: 'top-right' }"
                @map-load="mapLoaded"
                :fullscreen-control="{
                  show: true,
                  position: 'top-left'
                }"
              >
              </Mapbox>
              <div v-else class="row justify-center q-pt-xs">
                <q-spinner color="blue" size="2em" :thickness="2" />
              </div>
            </div>
            <div
              style="margin-top: 20px"
              class="col-xs-11 col-sm-6 col-md-12 q-pl-sm-md q-pl-md-none territory-details"
            >
              <p class="text-weight-light">
                {{ $t("searchPage.card.communes") }}:
                {{ profile.calculated.nb_towns }}
              </p>
              <p class="text-weight-light">
                {{ $t("searchPage.card.epci") }}:
                {{ profile.calculated.nb_ecpi }}
              </p>
              <p class="text-weight-light">
                {{ $t("searchPage.card.department") }}:
                {{ profile.data.nom_dep }}
              </p>
              <p class="text-weight-light">
                {{ $t("searchPage.card.region") }}: {{ profile.data.nom_reg }}
              </p>
              <p class="text-weight-light">
                {{ $t("searchPage.card.people") }}:
                {{
                  profile.calculated.nb_people_formated
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
              </p>
              <p class="text-weight-light">
                {{ $t("searchPage.card.area") }}:
                {{
                  Math.round(
                    parseInt(profile.calculated.areal_size_formated),
                    10
                  )
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
                    " " +
                    profile.calculated.areal_size_formated.split(" ")[1]
                }}
              </p>
              <p class="text-weight-light">
                {{ $t("searchPage.card.density") }}:
                {{ profile.calculated.density_formated }}
              </p>
              <p class="text-weight-light">
                {{ $t("searchPage.card.artificialization") }}:
                {{ profile.calculated.artificialisation_formated }}
              </p>
            </div>

            <MapWithList
              v-if="loaded"
              class="col-xs-12 col-sm-6 col-md-12 text-h6 q-pt-md blue"
              :territoriesList="subTerritories"
              :profile="profile"
              :border="true"
              height="268px"
              :circleRadius="6"
              circleColor="#23ff00"
              fillColor="#AAA"
              :fillOpacity="0.5"
              :mainLabel="$t('territoryPage.subterritories')"
              :searchPlaceholder="$t('territoryPage.searchSubterritoresList')"
              :viewAllLabel="$t('territoryPage.viewAllSubterritories')"
            />

            <MapWithList
              v-if="loaded"
              class="col-xs-12 col-sm-6 col-md-12 text-h6 q-pt-md blue"
              :class="
                subTerritories && subTerritories.results.length
                  ? 'q-pl-sm-md q-pl-md-none'
                  : ''
              "
              :territoriesList="neighbouringTerritories"
              :profile="profile"
              height="268px"
              :circleRadius="6"
              circleColor="#19a800"
              :mainLabel="$t('territoryPage.neighbouring')"
              :searchPlaceholder="$t('territoryPage.searchNeighbouringList')"
              :viewAllLabel="$t('territoryPage.viewAllNeighbouringTerritories')"
            />

            <MapWithList
              v-if="loaded"
              class="col-xs-12 col-sm-6 col-md-12 text-h6 q-pt-md blue"
              :class="
                subTerritories && subTerritories.results.length
                  ? ''
                  : 'q-pl-sm-md q-pl-md-none'
              "
              :territoriesList="similarTerritories"
              :profile="profile"
              height="268px"
              :circleRadius="6"
              circleColor="#19a800"
              :mainLabel="$t('territoryPage.similar')"
              :searchPlaceholder="$t('territoryPage.searchSimilarList')"
              :viewAllLabel="$t('territoryPage.viewAllSimilarTerritories')"
            />
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-5 q-pa-xs-xs q-pa-md-md q-pa-lg-md right-container"
          >
            <Profil
              :selectedIndicator="selectedIndicator"
              @selectIndicator="selectIndicator"
              :profile="profile"
            ></Profil>
            <div v-if="selectedIndicator === 1">
              <LineChart
                v-if="chartsData"
                :chartData="chartsData.demo_evol"
                :customTooltipFunction="lineChartCustomTooltipFunction"
                tooltipMode="index"
                :intersect="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Profil from "./Profil";
import LineChart from "../../components/chart/Linear/Linear";
import RequestService from "../../services/request.service";
import Mapbox from "mapbox-gl-vue";
import UtilService from "../../services/util.service";
import MapWithList from "../../components/map-with-list/MapWithList";

export default {
  name: "territory",
  components: { Profil, LineChart, Mapbox, MapWithList },
  data() {
    return {
      loaded: false,
      mapBoxAPI: process.env.MAPBOX_API_KEY,
      profile: null,
      selectedIndicator: 0,
      chartsData: null,
      territoryList: null,
      similarTerritories: null,
      subTerritories: null,
      neighbouringTerritories: null
    };
  },
  watch: {
    $route() {
      this.getProfile();
    }
  },
  methods: {
    selectIndicator(indicatorId) {
      if (this.selectedIndicator !== indicatorId) {
        this.selectedIndicator = indicatorId;
      } else {
        this.selectedIndicator = 0;
      }
    },
    getProfile() {
      UtilService.scrollToTop();
      this.loaded = false;
      const id =
        this.$route.params && this.$route.params.id
          ? this.$route.params.id
          : "none";
      RequestService.GetProfile(id).then(res => {
        const {
          neighboring,
          similar,
          subterritories,
          indicators
        } = res.additionalInfo;
        if (indicators) {
          this.prepareChartsData(indicators);
        }
        this.profile = res.results[0];
        this.neighbouringTerritories = neighboring;
        this.similarTerritories = similar;
        this.subTerritories = subterritories;
        this.territoryList = res.otherResults;
        this.loaded = true;
      });
    },
    prepareChartsData(indicators) {
      this.chartsData = indicators.charts;
      if (this.chartsData.demo_evol) {
        const lineChartColors = ["#4589ff", "#383949"];
        this.chartsData.demo_evol.datasets.forEach((dataset, index) => {
          dataset.borderColor = lineChartColors[index];
          dataset.pointBackgroundColor = lineChartColors[index];
          dataset.backgroundColor = "transparent";
        });
      }
    },
    lineChartCustomTooltipFunction(tooltipItem, data) {
      const label = data.datasets[tooltipItem.datasetIndex].label;
      const value =
        data.datasets[tooltipItem.datasetIndex].values[tooltipItem.index];
      return ` ${label}: ${value}`;
    },
    mapLoaded(map) {
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
          "fill-color": "#AAA",
          "fill-opacity": 0.5
        }
      });

      map.fitBounds(this.profile.data.geo_bbox, { padding: 10 });
    }
  },
  mounted() {
    this.getProfile();
  }
};
</script>

<style scoped>
.territory-details > p {
  margin: 0 0 3px !important;
}
.mapboxgl-map {
  width: 100%;
  height: 200px;
}
.left-container {
  padding-bottom: 30px;
}
@media only screen and (max-width: 1023px) {
  .territory-details {
    margin-top: 58px !important;
  }
  .main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .left-container {
    order: 2;
  }
  .right-container {
    order: 1;
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
}

.right-container {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  padding-left: 50px;
  margin-left: 50px;
}

.blue {
  color: #3bb7f1;
}
</style>
