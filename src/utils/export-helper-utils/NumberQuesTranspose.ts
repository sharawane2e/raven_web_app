import _ from 'lodash';
import { find, round } from 'lodash';
import { mean, median, min, max } from 'simple-statistics';
import { decimalPrecision } from '../../constants/Variables';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { QuestionType } from '../../enums/QuestionType';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';

export function numberChartDataGen(
  questionData: any,
  chartData: any,
  // baseCount: any,
  bannerQuestionData: any,
) {}
