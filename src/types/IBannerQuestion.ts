import { IBaseQuestion } from "./IBaseQuestion";

export interface IBannerQuestion extends IBaseQuestion {
  order: number;
  active: boolean;
  labelText: string;
}
