export interface IChartData {}

export interface IMultiGridSubGrpData {
  _id: string;
  options: Array<ISubGrpOptions>;
  baseCount?: number;
}

export interface ISubGrpOptions {
  option: string;
  count: number;
  baseCount: number;
}
