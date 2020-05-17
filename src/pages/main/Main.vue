<template>
  <q-page class="q-pa-md">
    <div class="logo">
      <q-img :src="require(`../../assets/logo_tereval.png`)" />
    </div>

    <div class="q-pa-md-md search-container">
      <Autocomplete />
    </div>

    <div class="flex flex-center description">
      {{ $t("mainPage.description.firstParagraph") }} <br /><br />
      {{ $t("mainPage.description.secondParagraph") }} <br /><br />
      {{ $t("mainPage.description.thirdParagraph") }} <br /><br />
      <a class="link" href="#">{{ $t("mainPage.link") }}</a>
    </div>

    <div class="charts">
      <div v-if="doughnutChartData" class="chart">
        <Doughnut
          :chartData="doughnutChartData"
          :options="doughnutChartOptions"
        />
      </div>
      <div v-if="histoChartData" class="chart">
        <Histo :chartData="histoChartData" :options="histoChartOptions" />
      </div>
    </div>
  </q-page>
</template>

<script>
import Autocomplete from "../../components/autocomplete/Autocomplete.vue";
import Doughnut from "../../components/chart/Donut/Donut";
import Histo from "../../components/chart/Histo/Histo";
import mockGraphs from "../../mock/graphs";
import RequestService from "../../services/request.service";

export default {
  data() {
    return {
      doughnutChartData: null,
      histoChartData: null,
      availableColors: ["#f2f2f2", "#4589ff", "#383949"],
      doughnutChartOptions: {
        responsive: true,
        title: {
          display: true,
          text: this.$t("mainPage.nameGraph")
        }
      },
      histoChartOptions: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    };
  },
  components: { Autocomplete, Doughnut, Histo },
  name: "Main",
  methods: {
    getDataFromApi(response) {
      response
        ? (this.autocomplete = mockGraphs.autocomplete)
        : (this.autocomplete = null);
    }
  },
  mounted() {
    RequestService.GetGraphs().then(({ charts }) => {
      this.doughnutChartData = {
        datasets: charts.state_collect.datasets.map(s => {
          return {
            label: s.label,
            data: s.data,
            backgroundColor: ["#f2f2f2", "#4589ff"]
          };
        }),
        labels: charts.state_collect.labels.map(l => l)
      };

      this.histoChartData = {
        datasets: charts.yearly_state.datasets.map((s, index) => {
          return {
            label: s.label,
            data: s.data,
            backgroundColor: this.availableColors[index]
          };
        }),
        labels: charts.yearly_state.labels.map(l => l)
      };
    });
    document.getElementsByTagName("main")[0].style.minHeight = "0";
    document.getElementById("scrollerY").style.overflowY = "none";
    document.getElementById("scrollerY").style.height = "initial";
    document.getElementById("scrollerY").style.maxHeight = "initial";
  }
};
</script>

<style scoped>
.search-container {
  position: relative;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}
.logo {
  margin: 15px auto 25px;
  width: 400px;
}
.description {
  margin: 15px 20%;
  display: flex;
  justify-content: flex-start;
}
.link {
  margin: 15px 0;
}
.chart {
  width: 33vw;
  display: block;
}
.charts {
  margin-top: 100px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

@media only screen and (max-width: 950px) {
  .chart {
    width: 200px !important;
  }
  .logo {
    width: 100%;
  }
  .description {
    margin: 25px 5%;
  }
}
</style>
