import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
// import { ReactComponent as PdfIcon } from "../../assets/svg/pdf-icon.svg";
//import { ReactComponent as PptIcon } from "../../assets/svg/ppt-icon.svg";
import { ReactComponent as WishList } from "../../assets/svg/wishlist.svg";
import "svg2pdf.js";
// import { generatePpt } from "../../utils/ppt/PptGen";
// import { generatePdf } from "../../utils/pdf/PdfGen";
import ApiUrl from "../../enums/ApiUrl";
import ApiRequest from "../../utils/ApiRequest";
import Toaster from "../../utils/Toaster";
import { fetchuserCache, setUserCache } from "../../redux/actions/chartActions";
interface UserCacheProps {}

const UserCache: React.FC<UserCacheProps> = () => {
  const { chart } = useSelector((state: RootState) => state);
  const { filters } = useSelector((state: RootState) => state);
  const chartQuestionData = chart?.questionData;

  const userCachebody = {
    qText: chartQuestionData?.questionText,
    qId: chartQuestionData?.qId,
    type: chartQuestionData?.type,
    filter: filters?.appliedFilters,
    bannerQuestion:
      chart?.bannerQuestionData == null ? "" : chart?.bannerQuestionData?.qId,
    chartType: chart?.chartType,
    chartLabelType: chart?.chartLabelType,
    chartOrientation: chart?.chartOrientation,
    chartTranspose: chart?.chartTranspose,
    date: new Date(),
  };
  const dispatch = useDispatch();

  const userCacheSubmit = () => {
    ApiRequest.request(ApiUrl.SAVECHART, "POST", userCachebody)
      .then((res) => {
        if (res.success) {
          dispatch(fetchuserCache());
          Toaster.success(res.message);
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => console.log("finaly run"));
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "User Cache",
      renderChild: () => <WishList />,
      onClick: userCacheSubmit,
      active: chart?.userCache.length > 0 ? true : false,
      // disabled: t,
      disabled: chart.questionData === null,
    },
  ];

  return (
    <ButtonGroup
      // groupTitle="Export"
      groupTitle=""
      buttonConfig={buttonConfig}
      className="user-cache-group"
    />
  );
};

export default UserCache;
