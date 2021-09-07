import clsx from "clsx";
import { createContext, useState } from "react";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import ChartSidebarContent from "../../components/Sidebar/sidebar-content/ChartSidebarContent";
import FilterContextProvider, {
  FilterContext,
} from "../../contexts/FilterContext";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import ApiUrl from "../../enums/ApiUrl";
import IRoute from "../../types/IRoute";
import ApiRequest from "../../utils/ApiRequest";

interface ChartScreenProps {
  routes: IRoute[];
}

export interface IChartContext {
  questionData: any;
  chartData: any[];
  setQuestionData: (questionData: any) => void;
  setChartData: (chartData: any[]) => void;
  fetchChartData: (quesId?: string) => void;
  selectedQuestion: string;
  setSelectedQuestion: (selectedQuestion: string) => void;
  questions: any[];
  setQuestions: (questions: any[]) => void;
}

export const ChartContext = createContext({
  questionData: null,
  chartData: [],
  setQuestionData: (questionData: string) => {},
  setChartData: (chartData: string) => {},
  fetchChartData: (quesId?: string) => {},
  selectedQuestion: "",
  setSelectedQuestion: (selectedQuestion: string) => {},
  questions: [],
  setQuestions: (questions: any[]) => [],
});

const ChartScreen: React.FC<ChartScreenProps> = (props) => {
  const { routes } = props;
  const [questionData, setQuestionData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [questions, setQuestions] = useState([]);

  return (
    <div className="chart-screen">
      <SidebarContextProvider>
        <Appbar />
        <FilterContextProvider>
          <FilterContext.Consumer>
            {({ filters }) => {
              const fetchChartData = (quesId?: any) => {
                const chartFilters: any[] = [];
                if (filters.length) {
                  filters.forEach((filter) => {
                    const chartFilter = chartFilters.find(
                      (chartFilter) => chartFilter.qId === filter.qId
                    );
                    if (chartFilter) {
                      chartFilter.value.push(filter.code);
                    } else {
                      chartFilters.push({
                        qId: filter.qId,
                        value: [filter.code],
                      });
                    }
                  });
                }
                // console.log("chart filters", chartFilters);
                const qId = quesId ? quesId : selectedQuestion;
                setSelectedQuestion(qId);
                const body = {
                  qId,
                  type:
                    //   @ts-ignore
                    questions.find((ques: any) => ques.qId === quesId)?.type,
                  filters: chartFilters,
                };
                ApiRequest.request(ApiUrl.CHART, "POST", body)
                  .then((res) => {
                    if (res.success) {
                      const { chartData, questionData } = res.data;
                      setQuestionData(questionData);
                      setChartData(chartData);
                    }
                  })
                  .catch((error) => console.log(error));
              };
              return (
                <ChartContext.Provider
                  // @ts-ignore
                  value={{
                    questionData,
                    // @ts-ignore
                    setQuestionData,
                    chartData,
                    // @ts-ignore
                    setChartData,
                    fetchChartData,
                    selectedQuestion,
                    setSelectedQuestion,
                    questions,
                    // @ts-ignore
                    setQuestions,
                  }}
                >
                  <Sidebar title="Filters" content={ChartSidebarContent} />
                  <SidebarContext.Consumer>
                    {({ open }) => {
                      return (
                        <main
                          className={clsx("content-area admin-panel__content", {
                            "sidebar-open": open,
                          })}
                        >
                          <AppRouting routes={routes} />
                        </main>
                      );
                    }}
                  </SidebarContext.Consumer>
                </ChartContext.Provider>
              );
            }}
          </FilterContext.Consumer>
        </FilterContextProvider>
      </SidebarContextProvider>
    </div>
  );
};

export default ChartScreen;
