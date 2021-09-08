import { IQuestion, IQuestionOption } from "./IQuestion";

export interface IFilterQuestion {
  _id: string;
  qId: string;
  order: number;
  question: IQuestion;
  value: IQuestionOption[];
}
