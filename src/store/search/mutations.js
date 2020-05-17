export function ADD_FILTER(state, filterObject) {
  //Reset query params without saving this action to browser history
  const resetQueryParams = filterObject.resetQueryParams;
  const skipUrlParams = filterObject.skipUrlParams;
  if (resetQueryParams) {
    delete filterObject.skipUrlParams;
  }
  if (skipUrlParams) {
    delete filterObject.skipQueryParams;
  }
  const index = state.query.search_query.filters
    .map(e => e.filter)
    .indexOf(filterObject.filter);
  if (index >= 0) {
    state.query.search_query.filters.splice(index, 1);
  }
  state.query.search_query.filters.push(filterObject);
  let newParams = {};
  if (!resetQueryParams) {
    newParams = Object.assign({}, this.$router.app._route.query);
  }
  let values = filterObject.values;
  if (values && values.length && typeof values[0] !== "string") {
    newParams[`${filterObject.filter}.value`] = `${values[0].min},${
      values[0].max
    }`;
  } else {
    newParams[`${filterObject.filter}.values`] = `${values.join(",")}`;
  }
  if (!skipUrlParams) {
    this.$router.push({
      query: newParams
    });
  }
}

export function REMOVE_FILTER(state, name) {
  const index = state.query.search_query.filters
    .map(e => e.filter)
    .indexOf(name);

  if (index >= 0) {
    state.query.search_query.filters.splice(index, 1);
  }
  //Remove query params
  let currentQueryParams = Object.assign({}, this.$router.app._route.query);
  Object.keys(currentQueryParams).forEach(key => {
    if (key.indexOf(name) !== -1) {
      delete currentQueryParams[key];
    }
  });
  this.$router.push({
    query: currentQueryParams
  });
}

export function SELECT_RESULTS(state, territories) {
  state.selectedResults.push(...territories);
}

export function DESELECT_RESULTS(state, territories) {
  const itemsToRemove = [];
  territories.forEach(territory => {
    const index = state.selectedResults
      .map(r => r.data._id)
      .indexOf(territory.data._id);
    if (index >= 0) {
      itemsToRemove.push(territory.data._id);
    }
  });
  state.selectedResults = state.selectedResults.filter(
    t => itemsToRemove.indexOf(t.data._id) === -1
  );
}

export function DESELECT_ALL_RESULTS(state) {
  state.selectedResults.splice(0, state.selectedResults.length);
}

export function SAVE_SEARCH_RESPONSE(state, data) {
  if (data) {
    state.apiFilters = data.aggrs;
  }
}

export function CLEAR_QUERY(state, options) {
  if (!options) {
    this.$router.replace({
      query: {}
    });
  } else if (options.pushEmptyParams) {
    this.$router.push({
      query: {}
    });
  }

  state.query = {
    search_query: {
      filters: [],
      from: 0,
      size: 10
    }
  };
}

export function SET_SORT(state, value) {
  state.query.search_query.sort = value;
}

export function SET_PAGE(state, index) {
  state.query.search_query.from = state.query.search_query.size * index;
}
