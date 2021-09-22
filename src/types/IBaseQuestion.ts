import { QuestionType } from "../enums/QuestionType";

export interface IBaseQuestion {
  _id: string;
  qId: string;
  scale: IQuestionOption[];
  subGroups: any[];
  options: IQuestionOption[];
  // labelText: string;
  questionText: string;
  type: QuestionType;
}

export interface IQuestionOption {
  labelText: string;
  labelCode: string;
  order: number;
}
