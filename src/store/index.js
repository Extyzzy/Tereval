import Vue from "vue";
import Vuex from "vuex";

import search from "./search";
import graph from "./graph";
import customList from "./custom-list";
Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      search,
      graph,
      customList
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
