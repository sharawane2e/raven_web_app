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

export function getSum(collection: any, identity: any) {
  return _.sumBy(collection, function (o: any) {
    return o[identity];
  });
}
