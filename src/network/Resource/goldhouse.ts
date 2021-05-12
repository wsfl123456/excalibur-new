import { NetAction } from "../state";

const WeaponryActions: NetAction[] = [
  {
    url: "tips/houseadd",
    name: "houseadd",
    type: "post"
  },
  {
    url: "tips/houseedit",
    name: "houseedit",
    type: "post"
  },
  {
    url: "tips/houselist",
    name: "gethouselist",
    type: "post"
  },
  {
    url: "tips/housedetail",
    name: "gethousedetail",
    type: "post"
  },
];

export default WeaponryActions;
