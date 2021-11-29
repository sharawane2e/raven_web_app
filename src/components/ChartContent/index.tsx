import { useState, useContext, MouseEvent, useEffect } from "react";
import Breadcrum from "../widgets/Breadcrum";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { SidebarContext } from "../../contexts/SidebarContext";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchBannerQuestionList,
  fetchQuestionList,
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
  toggleBannerQuestionDisablity,
} from "../../redux/actions/questionAction";
import { setChartData } from "../../redux/actions/chartActions";
import { changeChartType, fetchChartData } from "../../services/ChartService";
import AppliedFilterList from "../AppliedFilterList";
import SingleSelect from "../widgets/SingleSelect";
import Chart from "../Chart";
import TableView from "../TableView";
import OrientationControl from "../OrientationControl";
import ChartTypeControl from "../ChartTypeControl";
import ExportChart from "../ExportChart";
import { QuestionType } from "../../enums/QuestionType";
import { ChartType } from "../../enums/ChartType";
import { StaticText } from "../../constants/StaticText";
import { Tooltip } from "@material-ui/core";
import Toaster from "../../utils/Toaster";
import { Menu, MenuItem, Chip } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChartOptionsControl from "../ChartOptionsControl";
// import Tooltip from "@material-ui/Tooltip";
import { showTourGuide } from "../../redux/actions/tourAction";
import TourPlayIcon from "@material-ui/icons/PlayArrow";
import {
  toggleSidebar,
  toggleSidebarMobile,
} from "../../redux/actions/sidebarAction";

interface ChartContentProps {
  variant?: "fullWidth" | "partialWidth";
}

const ChartContent: React.FC<ChartContentProps> = (props) => {
  const [showBannerException, setShowBannerException] = useState(true);

  const [anchorEl, setAnchorEl] = useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);
  const dispatch = useDispatch();

  const {
    questions,
    chart: { questionData, baseCount, chartType },
    sidebar: { open },
  } = useSelector((state: RootState) => state);
  //const dispatch: AppDispatch = useDispatch();
  const {
    questionList,
    selectedQuestionId,
    bannerQuestionList,
    selectedBannerQuestionId,
  } = questions;

  const toggleSidebarOpen = () => {
    dispatch(toggleSidebar());
  };
  const toggleMobileSidebar = () => {
    dispatch(toggleSidebarMobile());
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const opneMenu = (e: MouseEvent<Element>) => {
    setAnchorEl(e.currentTarget);
  };
  const tourStart = (e: MouseEvent<Element>) => {
    // alert("sss")
    if (!open) {
      dispatch(toggleSidebar(true));
    }
    setTimeout(() => {
      dispatch(showTourGuide());
    }, 300);
  };

  useEffect(() => {
    dispatch(fetchQuestionList());
    dispatch(fetchBannerQuestionList());
  }, []);

  useEffect(() => {
    if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI ||
      questionData?.type === QuestionType.RANK ||
      questionData?.type === undefined
    ) {
      dispatch(setSelectedBannerQuestionId(""));
      dispatch(toggleBannerQuestionDisablity(true));
    } else {
      dispatch(toggleBannerQuestionDisablity(false));
    }
  }, [questionData?.type]);

  const handleQuestionChange = (value: string) => {
    dispatch(setSelectedQuestionId(value));
    fetchChartData(value)
      .then((chartData) => {
        dispatch(setChartData(chartData));
        if (
          chartData.questionData?.type !== QuestionType.SINGLE &&
          chartType === ChartType.PIE
        ) {
          changeChartType(ChartType.COLUMN);
        }
      })
      .catch((error) => console.log(error));
  };

  const handelBannerQuestionChange = (value: string) => {
    dispatch(setSelectedBannerQuestionId(value));
    fetchChartData(undefined, value)
      .then((chartData) => {
        dispatch(setChartData(chartData));
        if (!!value && chartType === ChartType.PIE) {
          changeChartType(ChartType.COLUMN);
        }
      })
      .catch((error) => console.log(error));
  };

  const showBannerClickException = () => {
    if (showBannerException) {
      setShowBannerException(false);
      setTimeout(() => {
        setShowBannerException(true);
      }, 3000);
      Toaster.error(StaticText.BANNER_SELECTION_EXCEPTION);
    }
  };

  const bannerQuestion: JSX.Element = (
    <SingleSelect
      options={[{ qId: "", labelText: "None" }, ...bannerQuestionList]}
      value={selectedBannerQuestionId}
      onItemSelect={handelBannerQuestionChange}
      placeholder={StaticText.BANNER_LABEL}
      valueKey="qId"
      labelKey="labelText"
      className="Step-2"
      disabled={questions.disableBannerQuestion}
      disabledPredicate={(value) => value === selectedQuestionId}
      MenuProps={{
        classes: { paper: "testing" },
      }}
    />
  );

  return (
    <div className="chart-content">
      <Grid container spacing={0} justify="space-between" className="mr-button">
        <Grid item className="title__Block">
          <Breadcrum pageTitle="Reports" />
        </Grid>
        <Grid item className="chart-content__control-wrapper">
          {/* <ChartOptionsControl /> */}
          <OrientationControl />
          <ChartTypeControl />
          <ExportChart />
        </Grid>
        <Tooltip title="Chart Options" className="chart-option-tooltip">
          <MoreVertIcon
            className="chart-content__control-wrapper-mobile"
            onClick={opneMenu}
          />
        </Tooltip>
        {/* <Chip
          label="Chart Options"
          variant="outlined"
          className="applied-filters__info-chip chart-content__control-wrapper-mobile"
          onClick={opneMenu}
        /> */}

        {/* <span
          className="chart-content__control-wrapper-mobile"
          onClick={opneMenu}
        >
          open
        </span> */}
        <Menu
          anchorEl={anchorEl}
          id="menu"
          keepMounted
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          disableAutoFocusItem
          PaperProps={{
            elevation: 0,
            className: "chart-content__control-menu",
          }}
        >
          <MenuItem className="chart-content__menu-item">
            <OrientationControl />
          </MenuItem>
          <MenuItem className="chart-content__menu-item">
            <ChartTypeControl />
          </MenuItem>
          <MenuItem className="chart-content__menu-item">
            <ExportChart />
          </MenuItem>
        </Menu>
      </Grid>
      <AppliedFilterList />
      {/* <Button className="button--primary wave-button" disabled>
        <span>Select wave</span>
        <ExpandMoreIcon />
      </Button> */}

      <SingleSelect
        options={questionList}
        value={selectedQuestionId}
        onItemSelect={handleQuestionChange}
        placeholder={StaticText.QUESTION_LABEL}
        valueKey="qId"
        labelKey="labelText"
        className="single_select_area Step-1"
        disabledPredicate={(value) => value === selectedBannerQuestionId}
        MenuProps={{
          classes: { paper: "testing" },
        }}
      />
      {questions.disableBannerQuestion ? (
        <Tooltip
          title={StaticText.BANNER_SELECTION_EXCEPTION}
          placement="bottom"
          arrow
        >
          <div onClick={showBannerClickException}>{bannerQuestion}</div>
        </Tooltip>
      ) : (
        bannerQuestion
      )}
      <div className="chart-content__chart-wrapper">
        {chartType === ChartType.TABLE ? <TableView /> : <Chart />}
        <div className="chart-content__base-count">
          Sample set: {baseCount} executives across Global 2000 enterprises
          <br />
          {/* Source: HFS Pulse, H1 2021 */}
          Source: E2E Research, 2021
        </div>
      </div>
    </div>
  );
};

export default ChartContent;
