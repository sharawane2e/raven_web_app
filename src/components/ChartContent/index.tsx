import { useEffect } from "react";
import Breadcrum from "../widgets/Breadcrum";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchBannerQuestionList,
  fetchQuestionList,
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
} from "../../redux/actions/questionAction";
import { setChartData } from "../../redux/actions/chartActions";
import { fetchChartData } from "../../services/ChartService";
import AppliedFilterList from "../AppliedFilterList";
import SingleSelect from "../widgets/SingleSelect";
import Chart from "../Chart";
import OrientationControl from "../OrientationControl";
import ChartTypeControl from "../ChartTypeControl";
import ExportChart from "../ExportChart";
import { Button } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface ChartContentProps {}

const ChartContent: React.FC<ChartContentProps> = (props) => {
  const { questions } = useSelector((state: RootState) => state);
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
    if (questionList.length) {
      dispatch(setSelectedQuestionId(questionList[0].qId));
      fetchChartData(questionList[0].qId)
        .then((chartData) => dispatch(setChartData(chartData)))
        .catch((error) => console.log(error));
    }
  }, [questionList]);

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
      <Button className="button--primary wave-button" disabled>
        <span>Select wave</span>
        <ExpandMoreIcon />
      </Button>
      <SingleSelect
        options={questionList}
        value={selectedQuestionId}
        onItemSelect={handleQuestionChange}
        placeholder="Please select a question"
        valueKey="qId"
        labelKey="labelText"
        disabledPredicate={(value) => value === selectedBannerQuestionId}
      />
      <SingleSelect
        options={[{ qId: "", labelText: "None" }, ...bannerQuestionList]}
        value={selectedBannerQuestionId}
        onItemSelect={handelBannerQuestionChange}
        placeholder="Select banner question"
        valueKey="qId"
        labelKey="labelText"
        disabledPredicate={(value) => value === selectedQuestionId}
      />
      <div className="chart-content__chart-wrapper">
        <Chart />
      </div>
    </div>
  );
};

export default ChartContent;
