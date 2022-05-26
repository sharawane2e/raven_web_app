import _ from 'lodash';
import { decimalPrecision } from '../constants/Variables';

export function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatTableData(value: number, divisor: number) {
  const percentageValue = round((value / divisor) * 100, decimalPrecision);
  return percentageValue + '%';
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getmatchedFind(
  collection: any,
  collectionKey: any,
  compareWith: any,
) {
  if (_.isArray(compareWith)) {
    return collection.find(
      (data: any) => +_.isEqual(data[collectionKey], compareWith),
    );
  } else {
    return collection.find((data: any) => data[collectionKey] === compareWith);
  }
}

export function getMatchedfilter(
  collection: any,
  collectionKey: any,
  compareWith: any,
) {
  return _.filter(collection, function (o) {
    if (_.isArray(compareWith)) {
      return compareWith.indexOf(o[collectionKey]) != -1;
    } else {
      return compareWith === o[collectionKey];
    }
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
  weightsSumArr.forEach((x: number) => {
    weightSumRounded.push(Math.round(x));
  });
  const sortsWeightBy2 = sortedWeights.length / 2;
  const sortedIndex = weightSumRounded.indexOf(sortsWeightBy2);
  return sortedValuesArr[sortedIndex + 1];
}
