import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import ApiUrl from "../../enums/ApiUrl";
import ApiRequest from "../../utils/ApiRequest";

interface ChartContentProps {}

const ChartContent: React.FC<ChartContentProps> = (props) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [chartOptions, setChartOptinos] = useState<Highcharts.Options>({
    title: {
      text: "My chart",
    },
    chart: {
      type: "column",
    },
    xAxis: {
      type: "category",
    },

    yAxis: {
      //   range: 10,
      //   minRange: 0,
      //   maxRange: 100,
      min: 0,
      max: 100,
    },
    series: [
      // @ts-ignore
      {
        // name: "Browsers",
        // colorByPoint: true,
        data: [],
        // data: [
        //   {
        //     name: "Chrome",
        //     y: 62.74,
        //     drilldown: "Chrome",
        //   },
        //   {
        //     name: "Firefox",
        //     y: 10.57,
        //     drilldown: "Firefox",
        //   },
        //   {
        //     name: "Internet Explorer",
        //     y: 7.23,
        //     drilldown: "Internet Explorer",
        //   },
        //   {
        //     name: "Safari",
        //     y: 5.58,
        //     drilldown: "Safari",
        //   },
        //   {
        //     name: "Edge",
        //     y: 4.02,
        //     drilldown: "Edge",
        //   },
        //   {
        //     name: "Opera",
        //     y: 1.92,
        //     drilldown: "Opera",
        //   },
        // ],
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

  const fetchChartData = (quesId: any) => {
    const body = {
      qId: quesId,
      //   @ts-ignore
      type: questions.find((ques: any) => ques.qId === quesId)?.type,
      filters: [],
    };
    ApiRequest.request(ApiUrl.CHART, "POST", body)
      .then((res) => {
        if (res.success) {
          console.log(res.data);

          const { chartData, questionData } = res.data;
          let total = 0;
          chartData.forEach((optionData: any) => {
            total += optionData?.count;
          });
          const seriesData = questionData.options.map((option: any) => {
            const optionData = chartData.find(
              (opt: any) => opt._id === option.labelCode
            );
            return {
              name: option.labelText,
              y: (optionData?.count / total) * 100,
              drilldown: option.labelText,
            };
          });
          console.log(total, seriesData);
          //   @ts-ignore
          setChartOptinos((prevValue) => ({
            ...prevValue,
            series: [{ data: seriesData }],
          }));
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="chart-content">
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">
          Questions
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={selectedQuestion}
          onChange={(e) => {
            setSelectedQuestion(e.target.value);
            fetchChartData(e.target.value);
          }}
          label="Age"
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
