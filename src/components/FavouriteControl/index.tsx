import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as FavouriteIcon } from '../../assets/svg/wishlist.svg';
// import ApiUrl from '../../enums/ApiUrl';
// import ApiRequest from '../../utils/ApiRequest';
import Toaster from '../../utils/Toaster';
import { StaticText } from '../../constants/StaticText';
import {
  resetUserCache,
  setDialog,
  setuserCacheActive,
} from '../../redux/actions/userCacheActions';
import {
  handelAddInUserCache,
  // isChartInCache,
} from '../../services/userCacheService';
// import { QuestionType } from '../../enums/QuestionType';

const FavouriteControl: React.FC = () => {
  const { filters, chart, userCache } = useSelector(
    (state: RootState) => state,
  );
  const chartQuestionData = chart?.questionData;

  const dispatch = useDispatch();

  const handleAddChartCache = () => {
    dispatch(setuserCacheActive(true));
    if (userCache.inCache) {
      dispatch(setDialog(true));
      dispatch(setuserCacheActive(false));
    } else {
      handelAddInUserCache(chart, chartQuestionData, filters);
    }
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
      active: userCache?.inCache || userCache?.active,
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
