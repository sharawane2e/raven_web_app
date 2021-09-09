import clsx from "clsx";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import ChartSidebarContent from "../../components/Sidebar/sidebar-content/ChartSidebarContent";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import IRoute from "../../types/IRoute";

interface ChartScreenProps {
  routes: IRoute[];
}

// export interface IChartContext {
//   questionData: any;
//   chartData: any[];
//   setQuestionData: (questionData: any) => void;
//   setChartData: (chartData: any[]) => void;
//   fetchChartData: (quesId?: string) => void;
//   selectedQuestion: string;
//   setSelectedQuestion: (selectedQuestion: string) => void;
//   questions: any[];
//   setQuestions: (questions: any[]) => void;
// }

// export const ChartContext = createContext({
//   questionData: null,
//   chartData: [],
//   setQuestionData: (questionData: string) => {},
//   setChartData: (chartData: string) => {},
//   fetchChartData: (quesId?: string) => {},
//   selectedQuestion: "",
//   setSelectedQuestion: (selectedQuestion: string) => {},
//   questions: [],
//   setQuestions: (questions: any[]) => [],
// });

const ChartScreen: React.FC<ChartScreenProps> = (props) => {
  const { routes } = props;

  return (
    <div className="chart-screen">
      <SidebarContextProvider>
        <Appbar />

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
      </SidebarContextProvider>
    </div>
  );
};

export default ChartScreen;
