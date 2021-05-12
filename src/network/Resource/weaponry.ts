import { NetAction } from "../state";

const WeaponryActions: NetAction[] = [
  {
    url: "tips/storelist",
    name: "getStoreList",
    type: "post"
  },
  {
    url: "tips/storeadd",
    name: "addStore",
    type: "post"
  },
  {
    url: "tips/storeedit",
    name: "editStore",
    type: "post"
  },
  {
    url: "tips/storedetail",
    name: "storeDetail",
    type: "post"
  },
  {
    url: "tips/storeshuxinglist",
    name: "getStoreShuXingList",
    type: "post"
  },
];

export default WeaponryActions;
