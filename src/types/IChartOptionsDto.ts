import { ChartLabelType } from "../enums/ChartLabelType";

export interface IchartOptionsDto {
  questionData: any;
  chartData: any;
  baseCount: any;
  bannerQuestionData: any;
  chartOptionsData: any;
  questionChartData: any;
  bannerChartData: any;
  transposed: boolean;
  chartLabelType: ChartLabelType;
  chartType: number;
  significant: boolean;
  showMean: boolean;
  chartOrientation: any;
}
