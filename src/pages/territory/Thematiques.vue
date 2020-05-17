<template>
  <div>
    <div class="grid-square" v-if="themes">
      <p class="text-h5 q-pt-md">{{ $t("territoryPage.themesTerritory") }}</p>
      <div class="row-flex" v-for="i in getLength()" :key="i">
        <div class="box" :class="getClass(i, j)" v-for="j in columns" :key="j">
          <q-img
            :src="require(`../../assets/themes/${getIndex(i, j) + 4}.png`)"
            style="height:
            50px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Thematiques from "../../mock/thematiques";

export default {
  name: "territory",
  props: ["profile"],
  components: {},
  data() {
    return {
      themes: null,
      noopsis: null,
      columns: 5
    };
  },
  methods: {
    getIndex(i, j) {
      return j + (i - 1) * 5;
    },
    getLength() {
      return 5;
    },
    getClass(i, j) {
      const index = this.getIndex(i, j);
      const id = this.themes[index] ? this.themes[index].code_them : false;
      if (
        this.noopsis &&
        this.noopsis.find(n => {
          return n.id == id;
        })
      ) {
        return { grey: false };
      }
      return { grey: true };
    }
  },
  mounted() {
    this.themes = Thematiques;
    if (this.profile.data) {
      this.noopsis = this.profile.data.noopsis;
    }
  }
};
</script>

<style scoped>
.grey {
  opacity: 0.5;
}

.text-h5 {
  color: #3bb7f1;
}
.profil-elem {
  background-color: blue;
}
.profil-elem:after {
  content: "";
  display: block;
  padding-bottom: 50%;
}
.icon-big {
  font-size: 4em;
}

.grid-square {
  margin: 0 auto;
  width: 80%;
  height: 80%;
  font-size: 1rem;
}
.row-flex {
  display: flex;
}
.box {
  background: #4471c4;
  margin: 5px;
  color: white;
  font-weight: bold;
  flex: 1 0 auto;
  position: relative;
}
.box:after {
  content: "";
  float: left;
  display: block;
  padding-top: 100%;
}
.box .inner {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
