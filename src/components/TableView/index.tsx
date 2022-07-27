import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { memo, useEffect, useState } from 'react';
import { tableChartDataGen } from '../../utils/export-helper-utils/TableUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import clsx from 'clsx';
import { QuestionType } from '../../enums/QuestionType';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { getChartOptions } from '../../utils/ChartOptionFormatter';
import { singleTable } from '../../utils/table-option-util/singleTable';
import { IchartOptionsDto } from '../../types/IChartOptionsDto';
import { fillEmptyDateSeries } from '../../utils/chart-option-util/significanceDiff';

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
  };

  const getChartData = getChartOptions();
  // console.log('tableTransformedData', getChartData.sre);
  //console.log(getChartData);
  const filledSeries = fillEmptyDateSeries(
    chart.questionData.type,
    JSON.parse(JSON.stringify(getChartData.series)),
    chart.transposed,
    chart.questionData,
    chart.bannerQuestionData,
    chart.chartData,
  );
  const chartRows = singleTable(filledSeries, chart);
  //const tableTransformedData = chartRows;

  // console.log(getChartData)
  // console.log(tableTransformedData)
  // const [tableData, setTableData] = useState<any>([]);

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {chartRows?.map((row: any, rowIndex: number) => (
            <div className="Table-row">
              {row.map((col: any, colIndex: number) => (
                // <div className="Table-row-item">{col}</div>
                // <div className={clsx({
                //             'Table-row-item': true,
                //             minValue: minMaxArr[colIndex-1]?.['min']===col?true:false,
                //             maxValue: minMaxArr[colIndex-1]?.['max']===col?true:false,
                //           })}>{displayValue(col,rowIndex,colIndex)}</div>
                <div
                  className={clsx({
                    'Table-row-item': true,
                    minValue: col.minMax == 'min' ? true : false,
                    maxValue: col.minMax == 'max' ? true : false,
                  })}
                >
                  {col.text}{' '}
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
// export default memo(TableView);
export default TableView;
