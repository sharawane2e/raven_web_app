import { IBaseQuestion, IQuestionOption } from "./IBaseQuestion";

export interface IFilterQuestion extends IBaseQuestion {
  order: number;
  active: boolean;
  value: IQuestionOption[];
  labelText: string;
}
