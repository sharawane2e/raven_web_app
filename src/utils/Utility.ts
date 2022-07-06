import _ from "lodash";
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
  // console.log(weightObjectSorted);
  weightObjectSorted.forEach((weightnewArr: any) => {
    sortedValuesArr.push(weightnewArr.value);
    sortedWeights.push(weightnewArr.weight);
  });
  // console.log(weightObjectSorted);

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
  // console.log(weightsSumArr);
  weightsSumArr.forEach((weightsum: number) => {
    const weightsumFixed = Number(weightsum.toFixed(6));
    //console.log(Math.round(weightsumFixed));
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

    //console.log(roundSortSumBy2);
  }
  // console.log(sortedIndex);
  return sortedValuesArr[sortedIndex + 1];
}

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
