<template>
  <q-dialog
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialog"
    @hide="onDialogHide"
    @keydown.esc="onOKClick()"
  >
    <q-card style="background-color: #eeeeee">
      <q-bar class="dialog-bar">
        <q-space />
        <q-btn dense flat icon="close" @click="onOKClick()" />
      </q-bar>
      <q-card-section class="dialog-content">
        <div class="row">
          <q-input
            outlined
            v-model="newListName"
            @keyup.enter.native="addNewList"
            label="Name of new list"
          />
          <q-btn
            dense
            @click="addNewList"
            color="primary"
            label="Add new list"
          />
        </div>
        <ul class="checkbox-list">
          <li v-for="(list, index) in listsArray" v-bind:key="index">
            <label>
              <q-checkbox
                type="checkbox"
                :value="list.checked"
                @input="addToList($event, list.name)"
              />
              <span> {{ list.name }}</span>
            </label>
          </li>
        </ul>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["type"],
  data: function() {
    return {
      newListName: ""
    };
  },
  computed: {
    listsArray() {
      let listsArray;
      if (this.type === "territory") {
        listsArray = JSON.parse(
          JSON.stringify(this.$store.state.customList.territoryLists)
        );
      } else {
        listsArray = JSON.parse(
          JSON.stringify(this.$store.state.customList.projectLists)
        );
      }

      let notAllElementsInTheList = false;
      listsArray.forEach(list => {
        const currentSelectedElements = this.$store.state.search.selectedResults.slice();
        currentSelectedElements.forEach(selectedElement => {
          const foundSelectedElement = list.items.find(
            listElement => listElement.data._id === selectedElement.data._id
          );
          if (!foundSelectedElement) {
            notAllElementsInTheList = true;
          }
        });
        list.checked = !notAllElementsInTheList;
        if (!list.items.length) {
          list.checked = false;
        }
      });
      return listsArray;
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      this.$emit("ok");
      this.hide();
    },

    addNewList: function() {
      let listNameExistsAlready = !!this.listsArray.find(
        li => li.name === this.newListName
      );
      if (!this.newListName || listNameExistsAlready) {
        this.newListName = "";
        return;
      }
      this.$store.commit("customList/ADD_LIST", {
        listName: this.newListName,
        type: this.type
      });
      this.newListName = "";
    },

    addToList: function(checked, listName) {
      if (checked) {
        let currentSelectedElements = this.$store.state.search.selectedResults.slice();
        const currentListElements = this.listsArray.find(
          li => li.name === listName
        );
        //Remove duplicates
        if (currentListElements) {
          currentListElements.items.forEach(curElement => {
            currentSelectedElements = currentSelectedElements.filter(
              selElement => selElement.data._id !== curElement.data._id
            );
          });
        }
        if (currentSelectedElements.length) {
          this.$store.commit("customList/ADD_ELEMENTS_TO_LIST", {
            elements: currentSelectedElements,
            listName,
            type: this.type
          });
        }
      } else {
        const currentSelectedElements = this.$store.state.search
          .selectedResults;
        this.$store.commit("customList/REMOVE_ELEMENTS_FROM_LIST", {
          elements: currentSelectedElements,
          listName,
          type: this.type
        });
      }
    }
  }
};
</script>

<style scoped>
.checkbox-list {
  list-style-type: none;
  padding: 0;
}
</style>
