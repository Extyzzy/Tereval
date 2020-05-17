import { Pie, mixins } from "vue-chartjs";

export default {
  props: ["chartData"],
  extends: Pie,
  mixins: [mixins.reactiveProp],
  data: () => ({
    data: {
      labels: ["Densité", "Population"],
      datasets: [
        {
          label: "Paris",
          backgroundColor: "#383949",
          data: [40, 20]
        }
      ]
    }
  }),

  mounted() {
    this.renderChart(this.data, this.options);
  }
};
