import { NetAction } from "../state";

const QAAnswer: NetAction[] = [
  {
    url: "qa/answerlist",
    name: "qAAnswerList",
    type: "post"
  },
  {
    url: "qa/answerdetail",
    name: "qAAnswerDetail",
    type: "post"
  },
  {
    url: "qa/answeropert",
    name: "qAAnswerOpert",
    type: "post"
  },
];

export default QAAnswer;
