import { ChartType } from "../enums/ChartType";
import { IBaseQuestion } from "./IBaseQuestion";

export interface IQuestion extends IBaseQuestion {
  order: number;
  chartType: ChartType[];
  split: boolean;
  active: boolean;
  netAllowed: boolean;
  labelText: string;
}
