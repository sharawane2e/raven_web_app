import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as TableIcon } from "../../assets/svg/table-icon.svg";
import { changeChartType, transposeChart } from "../../services/ChartService";
import React, { ReactElement } from 'react';
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";

interface TransposeControlProps {
    
}

const  TransposeControl:React.FC<TransposeControlProps> = ()=> {
    const {
        chart,
        questions: { selectedBannerQuestionId },
      } = useSelector((state: RootState) => state);
      const { chartType } = chart;
    const buttonConfig: ButtonGroupConfig[] = [
        {
          tooltip: "Transpose",
          renderChild: () => <TableIcon />,
          onClick: () => transposeChart(),
          active: true,
          disabled:
            chart.questionData === null ||
            chart.questionData.type === "MG" ||
            chart.questionData.type === "G",
          disableClick: () => Toaster.error(StaticText.DISABLED_CHART),
        }
      ];
    return (
       <ButtonGroup
       groupTitle=""
      buttonConfig={buttonConfig}
      className=" Step-6 chartTyle__option"
      />
    )
}

export default TransposeControl
