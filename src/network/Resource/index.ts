import { NetAction } from '../state';
import Brand from './brand';
import Supplier from './supplier';
import Livemap from './livemap'
import Weaponry from './weaponry'
import Goldhouse from './goldhouse'
import AuditQuestion from './auditQuestion';
import AuditAnswer from './auditAnswer'
import Solution from './solution'

const ResourceActions: NetAction[] = [
  ...Brand,
  ...Supplier,
  ...Livemap,
  ...Weaponry,
  ...Goldhouse,
  ...AuditQuestion,
  ...AuditAnswer,
  ...Solution,
];

export default ResourceActions;
