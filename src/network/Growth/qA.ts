import { NetAction } from '../state';

const QA: NetAction[] = [
  {
    url: 'qa/questionadd',
    name: 'qAQuestionAdd',
    type: 'post',
  },
  {
    url: 'qa/questionedit',
    name: 'qAQuestionEdit',
    type: 'post',
  },
  {
    url: 'qa/answeradd',
    name: 'qAanswerAdd',
    type: 'post',
  },
  {
    url: 'qa/answeredit',
    name: 'qAanswerEdit',
    type: 'post',
  },
  {
    url: 'qa/solutionadd',
    name: 'qASolutionAdd',
    type: 'post',
  },
  {
    url: 'qa/solutionedit',
    name: 'qASolutionEdit',
    type: 'post',
  },

];

export default QA;
