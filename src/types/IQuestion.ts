import { QuestionType } from "../enums/QuestionType";

export interface IQuestion {
  _id: string;
  qId: string;
  scale: any[];
  subGroups: any[];
  options: IQuestionOption[];
  labelText: string;
  questionText: string;
  type: QuestionType;
}

export interface IQuestionOption {
  labelText: string;
  labelCode: string;
  order: number;
}
