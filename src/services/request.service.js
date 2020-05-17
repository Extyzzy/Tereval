import axios from "axios";

const search = (type, query, store) => {
  if (store) {
    store.commit("search/SAVE_SEARCH_RESPONSE", null);
  }
  return axios
    .post(`/api/search/${type}`, query)
    .then(response => {
      if (response.data) {
        if (store) {
          store.commit("search/SAVE_SEARCH_RESPONSE", response.data);
        }
        return response.data;
      }
      return false;
    })
    .catch(() => {
      // console.log(err);
      return false;
    });
};

const GetProfile = id => {
  return axios
    .post(`/api/territoryprofile/${id}`)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(() => {
      // console.log(err);
      return false;
    });
};

const GetGraphs = () => {
  return axios
    .get(`/api/chart/yearly_state,state_collect`)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(() => {
      // console.log(err);
      return false;
    });
};

const GetTerrImage = id => {
  return axios
    .post(`/api/images/${id}`)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(() => {
      // console.log(err);
      return false;
    });
};

const GetAutoComplete = (value, type) => {
  return axios
    .post("/api/autocomplete", {
      query: value,
      types: [type]
    })
    .then(res => {
      return res.data;
    });
};

const GetHLFile = query => {
  return axios
    .post(`/api/highlight`, query)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return false;
    })
    .catch(() => {
      // console.log(err);
      return false;
    });
};

export default {
  search,
  GetAutoComplete,
  GetProfile,
  GetTerrImage,
  GetHLFile,
  GetGraphs
};
