import { NetAction } from '../state';

const Weaponry: NetAction[] = [
  {
    url: 'tips/storelistfront',
    name: 'getStorelistfront',
    type: 'post',
  },
  {
    url: 'tips/storedetailfront',
    name: 'getStoredetailfront',
    type: 'post',
  },
];

export default Weaponry;
