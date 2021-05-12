import { NetAction } from '../state';
import ProfessionLine from './professionLine'
import Weaponry from './weaponry'
import Goldhouse from './goldhouse'
import QA from './qA'

const ResourceActions: NetAction[] = [
  ...ProfessionLine,
  ...Weaponry,
  ...Goldhouse,
  ...QA,
];

export default ResourceActions;
