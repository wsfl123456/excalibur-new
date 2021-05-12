import { NetAction } from "../state";

const Solution: NetAction[] = [
  {
    url: "qa/solutionlist",
    name: "qASolutionList",
    type: "post"
  },
  {
    url: "qa/solutionopert",
    name: "qASolutionOpert",
    type: "post"
  },
  {
    url: "qa/solutiondetail",
    name: "qASolutionDetail",
    type: "post"
  },

];

export default Solution;
