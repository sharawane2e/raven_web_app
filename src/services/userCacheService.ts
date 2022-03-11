
import _ from "lodash";
import store from "../redux/store";
import ApiRequest from "../utils/ApiRequest";
import { resetUserCache } from "../redux/actions/userCacheActions";
import ApiUrl from "../enums/ApiUrl";
import Toaster from "../utils/Toaster";

export const isChartInCache = ()=>{

    let isChartDuplicate = false;
    let duplicateCacheIndex = -1;

    const {userCache:{savedChart},chart,filters} = store.getState();

    const _savedChart = JSON.parse(JSON.stringify(savedChart));
    const _chart = {
        qText: chart.questionData?.questionText,
        qId: chart.questionData?.qId,
        type: chart.questionData?.type,
        filter: filters.filters,
        bannerQuestion:chart?.bannerQuestionData == null ? '' : chart?.bannerQuestionData?.qId,
        chartType: chart.chartType,
        chartLabelType: chart.chartLabelType,
        chartOrientation: chart.chartOrientation,
        chartTranspose: chart.chartTranspose,
    }

    _savedChart.forEach(function(element:any){delete element.date;delete element._id;})

    _savedChart.forEach(function(element:any,index:number){
        const checkEquality = _.isEqual(element,_chart);
        if(checkEquality==true){
          isChartDuplicate = true;
          duplicateCacheIndex = index;
        }
    })
    return {isChartDuplicate,duplicateCacheId:isChartDuplicate?savedChart[duplicateCacheIndex]._id:null}

}

export const handleDeleteChartCache = (cacheIdsArr:any) =>{

    const body={
        _ids:[...cacheIdsArr]
    }
    ApiRequest.request(ApiUrl.DELETE_CHART, "DELETE", body)
    .then((res) => {
      if (res.success) {
          store.dispatch(resetUserCache(res.data))
        Toaster.success(res.message);
      } else {
        Toaster.error(res.message);
      }
    })
    .catch((error) => console.log(error))
};
