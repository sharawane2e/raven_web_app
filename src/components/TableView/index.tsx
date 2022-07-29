import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";
import { getChartOptions } from "../../utils/ChartOptionFormatter";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { fillEmptyDateSeries } from "../../utils/chart-option-util/significanceDiff";
import { getChartRows } from "../../utils/table-option-util";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const {
    chartLabelType,
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    questionChartData,
    bannerChartData,
    chartTranspose,
    chartType,
    significant,
    showMean,
  } = useSelector((state: RootState) => state?.chart);

  const chart: IchartOptionsDto = {
    chartLabelType,
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData: undefined,
    questionChartData,
    bannerChartData,
    transposed: chartTranspose,
    chartType,
    significant,
    showMean,
  };

  const getChartData = getChartOptions();
  const filledSeries = fillEmptyDateSeries(
    chart.questionData.type,
    JSON.parse(JSON.stringify(getChartData.series)),
    chart.transposed,
    chart.questionData,
    chart.bannerQuestionData,
    chart.chartData
  );
  const chartRows: any[] = getChartRows(filledSeries, chart)[0];

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {chartRows?.map((row: any, rowIndex: number) => (
            <div className="Table-row">
              {row.map((col: any, colIndex: number) => (
                <div
                  className={clsx({
                    "Table-row-item": true,
                    minValue: col.minMax == "min" ? true : false,
                    maxValue: col.minMax == "max" ? true : false,
                  })}
                >
                  {col.text}{" "}
                  {col.significantDiffernce ? (
                    <span className="significante-color table-significante">
                      - {col.significantDiffernce}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Scrollbars>
  );
};
export default TableView;
