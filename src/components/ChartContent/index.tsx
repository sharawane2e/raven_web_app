import { useEffect } from "react";
import Breadcrum from "../widgets/Breadcrum";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchBannerQuestionList,
  fetchQuestionList,
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
  const { questionList, selectedQuestionId, bannerQuestionList } = questions;

  useEffect(() => {
    dispatch(fetchQuestionList());
    dispatch(fetchBannerQuestionList());
  }, []);

  const handleQuestionChange = (value: string) => {
    dispatch(setSelectedQuestionId(value));
    fetchChartData(value)
      .then((chartData) => dispatch(setChartData(chartData)))
      .catch((error) => console.log(error));
  };

  return (
    <div className="chart-content">
      <Grid container spacing={0} justify="space-between">
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
        labelKey="questionText"
      />
      <SingleSelect
        options={bannerQuestionList}
        value={""}
        onItemSelect={() => {}}
        placeholder="Select banner question"
        valueKey="qId"
        labelKey="questionText"
      />
      <div className="chart-content__chart-wrapper">
        <Chart />
      </div>
    </div>
  );
};

export default ChartContent;
