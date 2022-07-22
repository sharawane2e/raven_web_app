import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as FavouriteIcon } from '../../assets/svg/wishlist.svg';
import ApiUrl from '../../enums/ApiUrl';
import ApiRequest from '../../utils/ApiRequest';
import Toaster from '../../utils/Toaster';
import { StaticText } from '../../constants/StaticText';
import { resetUserCache } from '../../redux/actions/userCacheActions';
import {
  handleDeleteChartCache,
  isChartInCache,
} from '../../services/userCacheService';
//import { handleDeleteChartCache, isChartInCache } from "../../services/userCacheService";

const FavouriteControl: React.FC = () => {
  const { chart } = useSelector((state: RootState) => state);
  const { filters } = useSelector((state: RootState) => state);
  const chartQuestionData = chart?.questionData;

  const dispatch = useDispatch();

  const handleAddChartCache = () => {
    console.log(
      'chart?.bannerQuestionData?.type',
      chart?.bannerQuestionData?.type,
    );
    const userCachebody = {
      qText: chartQuestionData?.questionText,
      qId: chartQuestionData?.qId,
      type: chartQuestionData?.type,
      bannerType: chart?.bannerQuestionData?.type,
      date: new Date(),
      filter: filters?.appliedFilters,
      bannerQuestion:
        chart?.bannerQuestionData == null ? '' : chart?.bannerQuestionData?.qId,
      chartType: chart?.chartType,
      chartLabelType: chart?.chartLabelType,
      chartOrientation: chart?.chartOrientation,
      chartTranspose: chart?.chartTranspose,
      significant: chart?.significant,
      showMean: chart?.showMean,
    };

    //console.log('userCachebody', userCachebody);
    // dispatch(resetUserCache([userCachebody]));

    ApiRequest.request(ApiUrl.SAVE_CHART, 'POST', userCachebody)
      .then((res) => {
        if (res.success) {
          dispatch(resetUserCache(res.data));
          Toaster.success(res.message);
        } else {
          Toaster.error(res.message); //add more things
        }
      })
      .catch((error) => console.log(error));
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: 'User Cache',
      renderChild: () => <FavouriteIcon />,
      //onClick: handleAddChartCache,
      onClick: handleAddChartCache,
      // onClick: isChartInCache().isChartDuplicate
      // ? () => handleDeleteChartCache([isChartInCache().duplicateCacheId])
      // : handleAddChartCache,
      active: isChartInCache().isChartDuplicate,
      disabled: chart.questionData === null,
      disableClick: () => Toaster.error(StaticText.USER_CACHE_NOT_AVAILABLE),
    },
  ];

  return (
    <ButtonGroup
      groupTitle=""
      buttonConfig={buttonConfig}
      className="favourite-icon "
    />
  );
};

export default FavouriteControl;
