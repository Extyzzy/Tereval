function scrollToTop() {
  const el = document.getElementById("scrollerY");
  el.scrollTo({ top: 0 });
}

const strip = html => {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const getFiltersFromQueryParams = (currentQueryParams, store) => {
  let filtersAsObject = {};
  Object.keys(currentQueryParams).forEach(key => {
    let filter = key.substring(0, key.lastIndexOf("."));
    let filterProperty = key.substring(key.lastIndexOf(".") + 1);
    if (!filtersAsObject[filter]) {
      filtersAsObject[filter] = {};
    }
    if (filterProperty === "value") {
      const values = currentQueryParams[key].split(",");
      filtersAsObject[filter].values = [
        {
          min: parseInt(values[0]),
          max: parseInt(values[1])
        }
      ];
    }
    if (filterProperty === "values") {
      let values;
      if (currentQueryParams[key].indexOf(",") !== -1) {
        values = currentQueryParams[key].split(",");
        filtersAsObject[filter].values = [].concat(values);
      } else {
        values = currentQueryParams[key];
        filtersAsObject[filter].values = [values];
      }
    }
  });
  store.commit("search/CLEAR_QUERY", { skipUrlParams: true });
  Object.keys(filtersAsObject).forEach(key => {
    const newFilter = {
      filter: key,
      values: filtersAsObject[key].values,
      ...(filtersAsObject[key].label && {
        label: filtersAsObject[key].label
      }),
      skipUrlParams: true
    };
    store.commit("search/ADD_FILTER", newFilter);
  });
};

const generateQueryParams = store => {
  const filters = store.state.search.query.search_query.filters;
  let newParams = "?";
  filters.forEach((item, index) => {
    const values = item.values;
    if (index) {
      newParams = newParams.concat("&");
    }
    if (values[0].min) {
      newParams = newParams.concat(
        `${item.filter}.value=${values[0].min},${values[0].max}`
      );
    } else {
      newParams = newParams.concat(`${item.filter}.values=${values.join(",")}`);
    }
  });
  return newParams;
};

export default {
  strip,
  scrollToTop,
  getFiltersFromQueryParams,
  generateQueryParams
};
