import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ["chartData", "customTooltipFunction", "tooltipMode", "intersect"],
  data: () => ({
    // chartdata: {
    //   labels: ["2010", "2019"],
    //   datasets: [
    //     {
    //       label: "Habitants",
    //       backgroundColor: "#4589ff",
    //       data: [40, 20, 15, 10, 30]
    //     }
    //   ]
    // }
  }),

  mounted() {
    let options = {};
    if (this.customTooltipFunction) {
      options.tooltips = {
        enabled: true,
        ...(this.tooltipMode && { mode: this.tooltipMode }),
        intersect: this.intersect,
        callbacks: {
          label: this.customTooltipFunction
        }
      };
    }

    this.renderChart(this.chartData, options);
  }
};
