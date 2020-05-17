export default {
  unmappedNodes: [
    { id: 9, label: "Node 9", desc: "desc" },
    { id: 10, label: "Node 10", desc: "desc" }
  ],
  mappedNodes: [
    {
      id: 11,
      key: 11,
      label: "Node 1",
      level: 0,
      parent: [],
      group: "0",
      desc: "desc"
    },
    {
      id: 22,
      key: 22,
      label: "Node 2",
      level: 1,
      parent: [11],
      group: "1",
      desc: "desc"
    },
    {
      id: 33,
      key: 33,
      label: "Node 3",
      level: 2,
      parent: [11],
      group: "2",
      desc: "desc"
    },
    {
      id: 44,
      key: 44,
      label: "Node 4",
      level: 3,
      parent: [33],
      group: "3",
      desc: "desc"
    },
    {
      id: 55,
      key: 55,
      label: "Node 5",
      level: 3,
      parent: [33],
      group: "3",
      desc: "desc"
    },
    {
      id: 66,
      key: 66,
      label: "Node 6",
      level: 4,
      parent: [55],
      group: "4",
      desc: "desc"
    },
    {
      id: 77,
      key: 77,
      label: "Node 7",
      level: 4,
      parent: [55],
      group: "4",
      desc: "desc"
    },
    {
      id: 88,
      key: 88,
      label: "Node 8",
      level: 4,
      parent: [44],
      group: "4",
      desc: "desc"
    }
  ]
};
