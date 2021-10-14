import { useEffect, useState } from "react";
import Breadcrum from "../widgets/Breadcrum";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchBannerQuestionList,
  fetchQuestionList,
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
  toggleBannerQuestionDisablity,
} from "../../redux/actions/questionAction";
import { setChartData } from "../../redux/actions/chartActions";
import { fetchChartData } from "../../services/ChartService";
import AppliedFilterList from "../AppliedFilterList";
import SingleSelect from "../widgets/SingleSelect";
import Chart from "../Chart";
import TableView from "../TableView";
import OrientationControl from "../OrientationControl";
import ChartTypeControl from "../ChartTypeControl";
import ExportChart from "../ExportChart";
import { QuestionType } from "../../enums/QuestionType";
import { ChartType } from "../../enums/ChartType";
import { StaticText } from "../../constants/StaticText";
import { Tooltip } from "@material-ui/core";
import Toaster from "../../utils/Toaster";

interface ChartContentProps {}

const ChartContent: React.FC<ChartContentProps> = (props) => {
  const [showBannerException, setShowBannerException] = useState(true);

  const {
    questions,
    chart: { questionData, baseCount, chartType },
  } = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const {
    questionList,
    selectedQuestionId,
    bannerQuestionList,
    selectedBannerQuestionId,
  } = questions;

  useEffect(() => {
    dispatch(fetchQuestionList());
    dispatch(fetchBannerQuestionList());
  }, []);

  useEffect(() => {
    if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI ||
      questionData?.type === QuestionType.RANK
    ) {
      dispatch(setSelectedBannerQuestionId(""));
      dispatch(toggleBannerQuestionDisablity(true));
    } else {
      dispatch(toggleBannerQuestionDisablity(false));
    }
  }, [questionData?.type]);

  const handleQuestionChange = (value: string) => {
    dispatch(setSelectedQuestionId(value));
    fetchChartData(value)
      .then((chartData) => dispatch(setChartData(chartData)))
      .catch((error) => console.log(error));
  };

  const handelBannerQuestionChange = (value: string) => {
    dispatch(setSelectedBannerQuestionId(value));
    fetchChartData(undefined, value)
      .then((chartData) => dispatch(setChartData(chartData)))
      .catch((error) => console.log(error));
  };

  const showBannerClickException = () => {
    if (showBannerException) {
      setShowBannerException(false);
      setTimeout(() => {
        setShowBannerException(true);
      }, 3000);
      Toaster.error(StaticText.BANNER_SELECTION_EXCEPTION);
    }
  };

  const bannerQuestion: JSX.Element = (
    <SingleSelect
      options={[{ qId: "", labelText: "None" }, ...bannerQuestionList]}
      value={selectedBannerQuestionId}
      onItemSelect={handelBannerQuestionChange}
      placeholder={StaticText.BANNER_LABEL}
      valueKey="qId"
      labelKey="labelText"
      className="Step-2"
      disabled={questions.disableBannerQuestion}
      disabledPredicate={(value) => value === selectedQuestionId}
    />
  );

  return (
    <div className="chart-content">
      <Grid container spacing={0} justify="space-between" className="mr-button">
        <Grid item>
          <Breadcrum pageTitle="Reports" />
        </Grid>
        <Grid item className="chart-content__control-wrapper">
          <OrientationControl />
          <ChartTypeControl />
          <ExportChart />
        </Grid>
      </Grid>
      <AppliedFilterList />
      {/* <Button className="button--primary wave-button" disabled>
        <span>Select wave</span>
        <ExpandMoreIcon />
      </Button> */}

      <SingleSelect
        options={questionList}
        value={selectedQuestionId}
        onItemSelect={handleQuestionChange}
        placeholder={StaticText.QUESTION_LABEL}
        valueKey="qId"
        labelKey="labelText"
        className="Step-1"
        disabledPredicate={(value) => value === selectedBannerQuestionId}
      />
      {questions.disableBannerQuestion ? (
        <Tooltip
          title={StaticText.BANNER_SELECTION_EXCEPTION}
          placement="bottom"
          arrow
        >
          <div onClick={showBannerClickException}>{bannerQuestion}</div>
        </Tooltip>
      ) : (
        bannerQuestion
      )}
      <div className="chart-content__chart-wrapper">
        {chartType === ChartType.TABLE ? <TableView /> : <Chart />}
        <div className="chart-content__base-count">n = {baseCount}</div>
      </div>
    </div>
  );
};

export default ChartContent;
