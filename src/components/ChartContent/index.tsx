import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../../contexts/FilterContext";
import ApiUrl from "../../enums/ApiUrl";
import { ChartContext } from "../../screens/ChartScreen";
import ApiRequest from "../../utils/ApiRequest";
import Breadcrum from "../widgets/Breadcrum";
import Grid from '@material-ui/core/Grid';
import CloseIcon from "@material-ui/icons/Close";

interface ChartContentProps {}

const ChartContent: React.FC<ChartContentProps> = (props) => {
  const { filters } = useContext(FilterContext);
  const {
    questionData,
    chartData,
    fetchChartData,
    selectedQuestion,
    questions,
    setQuestions,
  } = useContext(ChartContext);
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

  useEffect(() => {
    ApiRequest.request(ApiUrl.QUESTION, "GET")
      .then((res) => {
        if (res.success) {
          setQuestions(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    let total = 0;
    chartData.forEach((optionData: any) => {
      total += optionData?.count;
    });

    const seriesData =
      // @ts-ignore
      questionData?.options.map((option: any) => {
        const optionData = chartData.find(
          (opt: any) => opt._id === option.labelCode
        );
        return {
          name: option.labelText,
          // @ts-ignore
          y: (optionData?.count / total) * 100,
          drilldown: option.labelText,
        };
      }) || null;
    console.log(total, seriesData);
    //   @ts-ignore
    setChartOptinos((prevValue) => ({
      ...prevValue,
      series: [
        {
          data: seriesData,
        },
      ],
    }));
  }, [chartData]);

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
        {filters.map((filter, index) => (
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
          value={selectedQuestion}
          onChange={(e) => {
            // @ts-ignore
            fetchChartData(e.target.value);
          }}
          //   label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {questions.map((ques: any, index: number) => (
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
