<template>
  <div>
    Fichiers du projet:
  </div>
</template>

<script>
import RequestService from "../../services/request.service";
import UtilService from "../../services/util.service";

export default {
  name: "projectprofile",
  components: {},
  data() {
    return {
      loaded: false,
      mapBoxAPI: process.env.MAPBOX_API_KEY,
      profile: null,
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
    getProfile() {
      UtilService.scrollToTop();
      this.loaded = false;
      const id =
        this.$route.params && this.$route.params.id
          ? this.$route.params.id
          : "none";
      RequestService.GetProfile(id).then(res => {
        const { neighboring, similar, subterritories } = res.additionalInfo;
        this.profile = res.results[0];
        this.neighbouringTerritories = neighboring;
        this.similarTerritories = similar;
        this.subTerritories = subterritories;
        this.territoryList = res.otherResults;
        this.loaded = true;
      });
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

<style scoped></style>
