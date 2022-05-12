import { mean, median, min, max,sampleStandardDeviation,standardDeviation ,errorFunction} from 'simple-statistics';

export const getmean = (meanArr) => {
        return mean(meanArr);
  };
  
export const getmedian = (medianArr) => {
        return median(medianArr);
  };
  
export const getmin = (minArr) => {
        return min(minArr);
  };
  
export const getsampleStandardDeviation = (standardDeviationArr,precision) => {
        return standardDeviation(standardDeviationArr).toFixed(precision);
  };
  
  
export const getStandarderrorFunction = (getSampleDeviationValue,precision) => {
        return (((getSampleDeviationValue * Math.sqrt(2)) / 100).toFixed(precision));
};


