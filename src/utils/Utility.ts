import _ from "lodash";
import { cumulativeStdNormalProbability } from "simple-statistics";
import { decimalPrecision } from "../constants/Variables";

export function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatTableData(value: number, divisor: number) {
  const percentageValue = round((value / divisor) * 100, decimalPrecision);
  return percentageValue + "%";
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getmatchedFind(
  collection: any,
  collectionKey: any,
  compareWith: any
) {
  if (_.isArray(compareWith)) {
    return collection.find(function (data: any) {
      // debugger;
      return +_.isEqual(data[collectionKey], compareWith);
    });
  } else {
    return collection.find((data: any) => data[collectionKey] === compareWith);
  }
}

export function getMatchedfilter(
  collection: any,
  collectionKey: any,
  compareWith: any
) {
  return _.filter(collection, function (o) {
    if (_.isArray(compareWith)) {
      return compareWith.indexOf(o[collectionKey]) != -1;
    } else {
      return compareWith === o[collectionKey];
    }
  });
}

export function getSum(collection: any, identity: any) {
  return _.sumBy(collection, function (o: any) {
    return o[identity];
  });
}

export function getMedian(values: any, weightArray: any) {
  const weightObject: any = [];
  const sortedValuesArr: any = [];
  const sortedWeights: any = [];
  const weightsSumArr: any = [];
  const weightSumRounded: any = [];
  values.forEach((value: any, index: any) => {
    weightObject.push({
      value: value,
      weight: weightArray[index],
    });
  });
  const weightObjectSorted = _.sortBy(weightObject, [
    function (o) {
      return o.value;
    },
  ]);

  weightObjectSorted.forEach((weightnewArr: any) => {
    sortedValuesArr.push(weightnewArr.value);
    sortedWeights.push(weightnewArr.weight);
  });

  for (let i = 0; i < sortedWeights.length; i++) {
    if (i == 0) {
    } else if (i == 1) {
      const sortValue = sortedWeights[1] + sortedWeights[0];
      weightsSumArr.push(sortValue);
    } else {
      const sortValue = sortedWeights[i] + weightsSumArr[i - 2];
      weightsSumArr.push(sortValue);
    }
  }

  weightsSumArr.forEach((weightsum: number) => {
    const weightsumFixed = Number(weightsum.toFixed(6));

    weightSumRounded.push(round(weightsumFixed, 0));
  });
  const sortsWeightBy2 = _.sum(weightArray) / 2;

  let roundSortSumBy2: number = round(sortsWeightBy2, 0);

  let sortedIndex = weightSumRounded.indexOf(roundSortSumBy2);

  if (sortedIndex == -1) {
    while (sortedIndex == -1) {
      roundSortSumBy2--;
      sortedIndex = weightSumRounded.indexOf(roundSortSumBy2);
    }
  }

  return sortedValuesArr[sortedIndex + 1];
}

/*This function retun Alphabates A-Z and after Z Value*/
export const indexToChar = (n: number) => {
  var ordA = "a".charCodeAt(0);
  var ordZ = "z".charCodeAt(0);
  var len = ordZ - ordA + 1;

  var s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s.toUpperCase();
};

interface SignificantObject {
  value: any;
  baseCount: any;
}

/*This function retun significant  true or false */
export const significantDifference = (
  SignificantObject1: SignificantObject,
  SignificantObject2: SignificantObject
) => {
  const B1 = SignificantObject1.value / 100;
  const B2 = SignificantObject1.baseCount;
  const B4 = SignificantObject2.value / 100;
  const B5 = SignificantObject2.baseCount;

  const poledSampleData = (B1 * B2 + B4 * B5) / (B2 + B5);
  const testStatistic =
    (B1 - B4) /
    Math.sqrt(poledSampleData * (1 - poledSampleData) * (1 / B2 + 1 / B5));

  const result = 2 * (1 - cumulativeStdNormalProbability(testStatistic));

  if (result < 0.05) {
    return true;
  }

  return false;
};
