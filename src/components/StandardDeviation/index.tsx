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
import { getMeanStandardDeviation, round } from '../../utils/Utility';
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
     const{meanStandarad,standardDeviation,standardError}= getMeanStandardDeviation(chartOptionsData, baseCount);
     dispatch(setMean(meanStandarad));
     dispatch(setStandardDeviation(standardDeviation));
     dispatch(setStandardError(standardError));
    } else {
      const{meanStandarad,standardDeviation,standardError}=getMeanStandardDeviation(chartData, baseCount);
      dispatch(setMean(meanStandarad));
      dispatch(setStandardDeviation(standardDeviation));
      dispatch(setStandardError(standardError));
    }


  }, [bannerQuestionData]);

 

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
