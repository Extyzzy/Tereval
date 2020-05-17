import { PolarArea, mixins } from "vue-chartjs";

export default {
  extends: PolarArea,
  mixins: [mixins.reactiveProp],
  props: ["chartData"],
  data: () => ({
    data: {
      labels: ["Artificialisation", "Communes"],
      datasets: [
        {
          label: "London",
          backgroundColor: "#383949",
          data: [20, 10]
        }
      ]
    }
  }),

  mounted() {
    this.renderChart(this.data, this.options);
  }
};
