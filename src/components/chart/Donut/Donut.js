import { Doughnut, mixins } from "vue-chartjs";

export default {
  extends: Doughnut,
  mixins: [mixins.reactiveProp],

  props: ["charData", "options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
