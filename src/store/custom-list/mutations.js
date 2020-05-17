export function ADD_LIST(state, { listName, type }) {
  if (type === "territory") {
    state.territoryLists.push({
      name: listName,
      items: [],
      checked: false
    });
  } else {
    state.projectLists.push({
      name: listName,
      items: [],
      checked: false
    });
  }
}

export function ADD_ELEMENTS_TO_LIST(state, { listName, elements, type }) {
  if (type === "territory") {
    state.territoryLists.find(
      element => element.name === listName
    ).checked = true;
    state.territoryLists
      .find(element => element.name === listName)
      .items.push(...elements);
  } else {
    state.projectLists.find(
      element => element.name === listName
    ).checked = true;
    state.projectLists
      .find(element => element.name === listName)
      .items.push(...elements);
  }
}

export function REMOVE_ELEMENTS_FROM_LIST(state, { listName, elements, type }) {
  if (type === "territory") {
    let list = state.territoryLists.find(element => element.name === listName);
    list.checked = false;
    elements.forEach(element => {
      list.items.splice(
        list.items.findIndex(i => {
          return i.data._id === element.data._id;
        }),
        1
      );
    });
  } else {
    let list = state.projectLists.find(element => element.name === listName);
    list.checked = false;
    elements.forEach(element => {
      list.items.splice(
        list.items.findIndex(i => {
          return i.data._id === element.data._id;
        }),
        1
      );
    });
  }
}

export function REMOVE_ALL_ELEMENTS_FROM_LIST(state, { listName, type }) {
  if (type === "territory") {
    let list = state.territoryLists.find(element => element.name === listName);
    list.checked = false;
    list.items.splice(0, list.items.length);
  } else {
    let list = state.projectLists.find(element => element.name === listName);
    list.checked = false;
    list.items.splice(0, list.items.length);
  }
}
