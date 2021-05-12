import { NetAction } from '../state';

const ProfessionLine: NetAction[] = [
  {
    url: 'tips/maplistfront',
    name: 'getMaplistfront',
    type: 'post',
  },
  {
    url: 'tips/mapdetailfront',
    name: 'getMapdetailfront',
    type: 'post',
  },
  {
    url: 'tips/mapaddask',
    name: 'mapaddask',
    type: 'post',
  },
];

export default ProfessionLine;
