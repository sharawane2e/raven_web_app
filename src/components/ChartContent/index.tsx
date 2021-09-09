import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ChangeEvent, useEffect, useState } from "react";
import Breadcrum from "../widgets/Breadcrum";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchQuestionList,
  setSelectedQuestionId,
} from "../../redux/actions/questionAction";
import { setChartData } from "../../redux/actions/chartActions";
import { fetchChartData } from "../../services/ChartService";

interface ChartContentProps {}

const ChartContent: React.FC<ChartContentProps> = (props) => {
  const {
    filters: { appliedFilters },
    questions,
  } = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const [chartOptions, setChartOptinos] = useState<Highcharts.Options>({
    title: {
      text: "",
    },
    chart: {
      type: "column",
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: "category",
    },
    // plotOptions: {
    //   series: {
    //     // @ts-ignore
    //     dataLabels: {
    //       formatter: (value: number) => "fff" + value,
    //     },
    //   },
    // },
    yAxis: {
      min: 0,
      max: 100,
    },
    series: [
      // @ts-ignore
      {
        color: "#f47c3c",
        data: [],
      },
    ],
  });

  const { questionList, selectedQuestionId } = questions;

  useEffect(() => {
    dispatch(fetchQuestionList());
  }, []);

  const handleQuestionChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const value: string = (event.target.value as string) || "";
    dispatch(setSelectedQuestionId(value));
    fetchChartData(value)
      .then((chartData) => dispatch(setChartData(chartData)))
      .catch((error) => console.log(error));
  };

  const removeFilter = (filter: any) => {};

  return (
    <div className="chart-content">
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <Breadcrum pageTitle="Reports" />
        </Grid>
        <Grid item xs={6}>
          <div>asdasd</div>
        </Grid>
      </Grid>
      <div>
        {appliedFilters.map((filter, index) => (
          <Chip
            key={index}
            variant="outlined"
            onDelete={() => removeFilter(filter)}
            label={filter.label}
            deleteIcon={<CloseIcon />}
          />
        ))}
      </div>
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">
          Questions
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={selectedQuestionId}
          onChange={handleQuestionChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {questionList.map((ques: any, index: number) => (
            <MenuItem key={index} value={ques.qId}>
              {ques.questionText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartContent;
