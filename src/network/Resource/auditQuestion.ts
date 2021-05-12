import { NetAction } from "../state";

const QAAudit: NetAction[] = [
  {
    url: "qa/questionlist",
    name: "qAQuestionList",
    type: "post"
  },
  {
    url: "qa/questiondetail",
    name: "qAQuestionDetail",
    type: "post"
  },
  {
    url: "qa/questionopert",
    name: "qAQuestionOpert",
    type: "post"
  },

];

export default QAAudit;
