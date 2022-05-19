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

interface StandardDeviation {}

const StandardDeviation: React.FC<StandardDeviation> = () => {
  const dispatch = useDispatch();
  const {
    chart: { chartData, baseCount },
    standard: { isMean, standardDeviation, standardError },
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    getMeanStandardDeviation(chartData, baseCount);
  }, []);

  const getMeanStandardDeviation = (chartData: any, baseCount: number) => {
    let values: any = [];
    chartData.forEach((chart_el: any, chartIndex: Number) => {
      values = values.concat(chart_el.values);
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

    dispatch(setMean(round(meanValue, decimalPrecision3)));
    dispatch(
      setStandardDeviation(
        round(Number(getSampleDeviationValues), decimalPrecision3),
      ),
    );
    dispatch(setStandardError(round(getStandarderror, decimalPrecision3)));
  };

  return (
    <div className="standard-deviation">
      <div className="standard-deviation__mean">
        <span className="show-text">Mean</span>:
        <span className="show-value">{isMean}</span>
      </div>
      <div className="standard-deviation__standard-deviation">
        <span className="show-text">Standard Deviation</span>:
        <span className="show-value">{standardDeviation}</span>
      </div>
      <div className="standard-deviation__standard-error">
        <span className="show-text">Standard Error</span>:
        <span className="show-value">{standardError}</span>
      </div>
    </div>
  );
};

export default StandardDeviation;
