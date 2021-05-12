import { NetAction } from "../state";

const LivemapActions: NetAction[] = [
  {
    url: "/customer/industry",
    name: "getProfessionList",
    type: "post"
  },
  {
    url: "/tips/maplist",
    name: "getMapList",
    type: "post"
  },
  {
    url: "/tips/mapadd",
    name: "addMap",
    type: "post"
  },
  {
    url: "/tips/mapedit",
    name: "editMap",
    type: "post"
  },
  {
    url: "/tips/mapdetail",
    name: "mapDetail",
    type: "post"
  },
  {
    url: "/tips/maplistask",
    name: "maplistask",
    type: "post"
  },
  {
    url: "/tips/mapeditask",
    name: "mapeditask",
    type: "post"
  },
];

export default LivemapActions;
