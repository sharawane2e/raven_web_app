import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo } from "react";
import {
    singleChartDataGen,
    gridChartDataGen,
    tableChartDataGen,
  } from "../../utils/PptDataGenerator";
import { QuestionType } from "../../enums/QuestionType";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
    const {
    chart: { chartData, questionData, baseCount},
    } = useSelector((state: RootState) => state);
    
    let seriesData: any[] = [];

    if (
      questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.RANK ||
      questionData?.type === QuestionType.MULTI
    ) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI
    ) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    } else {
      //console.log("under development");
    }
  
    let row = (tableChartDataGen(seriesData));

    
    //console.log(row);

  return (
    <div className="tableGrid">
        {row.map(function(element, index){
            return(index <1 ? 
               `<div className="Table-row-item">${element}</div>` : '$10.00');
        })}
        <div className="TableView">
            <div className="Table-row Table-header">

            {row.map((element, index) => (  
              <div className="Table-row-item">{element[index]}</div>
            ))} 
            
            </div>
            <div className="row-collection">
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
                <div className="Table-row">
                <div className="Table-row-item" data-header="Name">90fe38ee46e87789</div>
                <div className="Table-row-item" data-header="Device">Nexus 5</div>
                <div className="Table-row-item" data-header="OS">5.1.1</div>
                <div className="Table-row-item" data-header="Country">Japan</div>
                <div className="Table-row-item" data-header="Uploaded on">July 21</div>
                </div>
            </div>
            </div>

    </div>
  );
};

export default memo(TableView);
