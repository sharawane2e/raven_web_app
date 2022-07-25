import React, { useEffect } from 'react';
import { RootState } from '../../redux/store';
import {
  getmean,
  getsampleStandardDeviation,
  getStandarderrorFunction,
} from '../../utils/simplestatistics';
import {
  decimalPrecision2,
  decimalPrecision3,
} from '../../constants/Variables';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMean,
  setStandardDeviation,
  setStandardError,
} from '../../redux/actions/standardDeviationAction';
import { round } from '../../utils/Utility';
import StandardText from '../../enums/StandardType';

interface StandardDeviation {}

const StandardDeviation: React.FC<StandardDeviation> = () => {
  const dispatch = useDispatch();
  const {
    chart: { chartData, baseCount, bannerQuestionData },
    standard: { isMean, standardDeviation, standardError },
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    if (bannerQuestionData) {
      let optionData = chartData[0];
      let chartOptionsData: any = [];

      Object.keys(optionData).forEach(function (key) {
        chartOptionsData.push(optionData[key]);
      });

      //console.log('chartOptionsData', chartOptionsData);
      getMeanStandardDeviation(chartOptionsData, baseCount);
    } else {
      getMeanStandardDeviation(chartData, baseCount);
    }
  }, [bannerQuestionData]);

  const getMeanStandardDeviation = (chartData: any, baseCount: number) => {
    let values: any = [];

    chartData.forEach((chart_el: any, chartIndex: Number) => {
      if (Array.isArray(chart_el)) {
        chart_el.forEach((curentVlaues: any) => {
          values = values.concat(curentVlaues.values);
        });
      } else {
        values = values.concat(chart_el.values);
      }
    });

    const meanValue = getmean(values);
    const getSampleDeviationValues = getsampleStandardDeviation(
      values,
      decimalPrecision2,
    );

    const getStandarderror = getStandarderrorFunction(
      Number(getSampleDeviationValues),
      baseCount,
      decimalPrecision2,
    );

    //meanStandardDeviation(mean)

    const meanStandarad = setMean(round(meanValue, decimalPrecision3));
    const standardDeviation = setStandardDeviation(
      round(Number(getSampleDeviationValues), decimalPrecision3),
    );
    const standardError = setStandardError(
      round(getStandarderror, decimalPrecision3),
    );

    dispatch(meanStandarad);
    dispatch(standardDeviation);
    dispatch(standardError);
  };

  return (
    <div className="standard-deviation">
      <div className="standard-deviation__mean">
        <span className="show-text">{StandardText.MEAN}</span>:
        <span className="show-value">{isMean}</span>
      </div>
      <div className="standard-deviation__standard-deviation">
        <span className="show-text">{StandardText.SD}</span>:
        <span className="show-value">{standardDeviation}</span>
      </div>
      <div className="standard-deviation__standard-error">
        <span className="show-text">{StandardText.SE}</span>:
        <span className="show-value">{standardError}</span>
      </div>
    </div>
  );
};

export default StandardDeviation;
