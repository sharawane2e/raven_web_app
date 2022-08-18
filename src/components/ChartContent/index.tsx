import { useState, MouseEvent, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  fetchBannerQuestionList,
  fetchQuestionList,
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
  toggleBannerQuestionDisablity,
} from '../../redux/actions/questionAction';
import {
  resetChart,
  setChartData,
  setChartLabel,
  setChartTranspose,
  setshowMean,
} from '../../redux/actions/chartActions';
import { changeChartType, fetchChartData } from '../../services/ChartService';
import AppliedFilterList from '../AppliedFilterList';
import SingleSelect from '../widgets/SingleSelect';
import Chart from '../Chart';
import TableView from '../TableView';
import OrientationControl from '../OrientationControl';
import ChartTypeControl from '../ChartTypeControl';
import ExportChart from '../ExportChart';
import { QuestionType } from '../../enums/QuestionType';
import { ChartType } from '../../enums/ChartType';
import { StaticText } from '../../constants/StaticText';
import { Tooltip } from '@material-ui/core';
import Toaster from '../../utils/Toaster';
import { Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import store from '../../redux/store';
import ChartTransposeControl from '../ChartTransposeControl';
import clsx from 'clsx';
import LabelTypeControl from '../LabelTypeControl';
import ChartFullScreen from '../ChartFullScreen';
import Loader from '../widgets/Loader/Index';
import { ReactComponent as No_Question_Selected } from '../../assets/svg/No_Question_Selected.svg';
// import { ReactComponent as No_Data_Found } from '../../assets/svg/No_data_found.svg';
import Chapter from '../Chapter';
import _ from 'lodash';
import IsMeanControl from '../IsMeanControl';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { setSelectedQuestion } from '../../redux/actions/chapterActions';
import StandardDeviation from '../StandardDeviation';
import SignificantDiff from '../SignificantDiff';
import { showhidefeature, significantText } from '../../constants/Variables';
import FavouriteControl from '../FavouriteControl';
import { ReactComponent as No_Data_Found } from '../../assets/svg/No_data_found.svg';
import { noDataFound } from '../../redux/actions/sidebarAction';

interface ChartContentProps {
  variant?: 'fullWidth' | 'partialWidth';
}

const ChartContent: React.FC<ChartContentProps> = (props) => {
  const [showBannerException, setShowBannerException] = useState(true);
  const [openQSelection, setOpenQSelection] = useState(false);
  const [OpenQuestionCross, setOpenQuestionCross] = useState(false);

  const [anchorEl, setAnchorEl] = useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);
  const dispatch = useDispatch();

  const {
    questions,
    chart: { chartLoading, questionData, baseCount, chartType, significant },
    chapters: { allChapters, selectedChapterId },
    sidebar,
  } = useSelector((state: RootState) => state);
  const { chart } = store.getState();
  //const dispatch: AppDispatch = useDispatch();
  const {
    questionList,
    selectedQuestionId,
    bannerQuestionList,
    selectedBannerQuestionId,
  } = questions;

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const opneMenu = (e: MouseEvent<Element>) => {
    setAnchorEl(e.currentTarget);
  };

  useEffect(() => {
    dispatch(fetchQuestionList());
    dispatch(fetchBannerQuestionList());
    if (chart?.chartType === ChartType.TABLE && chart?.chartData.length === 0) {
      dispatch(resetChart(['']));
      dispatch(noDataFound(true));
    } else {
      dispatch(noDataFound(false));
    }
  }, []);

  let updateQuestionList: any[] = [];
  let updateBannerList: any[] = [];
  if (selectedChapterId && allChapters) {
    const selectchapterObject = _.find(allChapters, function (o) {
      return o.chapterId === selectedChapterId;
    });
    const sortedChapterOrder = _.sortBy(allChapters, ['order']);
    sortedChapterOrder.forEach((chapterData: any, index) => {
      if (chapterData['chapterId'] === selectchapterObject?.chapterId) {
        for (let i = 0; i < chapterData?.QuestionsQIds.length; i++) {
          for (let j = 0; j < questions?.questionList.length; j++) {
            if (chapterData?.QuestionsQIds[i] == questions?.questionList[j].qId)
              updateQuestionList.push(questions?.questionList[j]);
          }
        }
      }
    });
  }

  useEffect(() => {
    if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI ||
      questionData?.type === QuestionType.RANK ||
      questionData?.type === undefined
    ) {
      dispatch(setSelectedBannerQuestionId(''));
      dispatch(toggleBannerQuestionDisablity(true));
    } else {
      dispatch(toggleBannerQuestionDisablity(false));
      if (chart?.questionData?.type === QuestionType?.NUMBER) {
        dispatch(setChartLabel(ChartLabelType?.NUMBER));
      } else {
        dispatch(setChartLabel(ChartLabelType?.PERCENTAGE));
      }
    }
    var el = document.getElementById('Group_4227');
    if (el) {
      el.addEventListener('click', selectQuestion, false);
    }
    //@ts-ignore
    function selectQuestion() {
      setOpenQSelection(true);
    }
  }, [questionData?.type]);

  const handleQuestionChange = (value: string) => {
    dispatch(setshowMean(false));
    dispatch(setChartTranspose(false));
    dispatch(setSelectedQuestionId(value));
    fetchChartData(value)
      .then((chartData) => {
        // console.log("chartData", chartData);
        dispatch(setChartData(chartData));
        if (chartData.chartData.length == 0) {
          dispatch(resetChart(['']));
          dispatch(noDataFound(true));
        } else {
          dispatch(noDataFound(false));
        }
        dispatch(setSelectedQuestion(chartData?.questionData?.labelText));
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
    dispatch(setshowMean(false));
    dispatch(setChartTranspose(false));
    dispatch(setSelectedBannerQuestionId(value));
    fetchChartData(undefined, value)
      .then((chartData) => {
        dispatch(setChartData(chartData));
        if (!!value && chartType === ChartType.PIE) {
          changeChartType(ChartType.COLUMN);
        } else if (
          chartData.questionData?.type === QuestionType.SINGLE &&
          chartData.bannerQuestionData == null
        ) {
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

  const handleQSelectionOpen = () => {
    setOpenQSelection(true);
  };

  const handleQSelectionClose = () => {
    setOpenQSelection(false);
  };

  const bannerQuestion: JSX.Element = (
    <SingleSelect
      options={[{ qId: '', labelText: 'None' }, ...bannerQuestionList]}
      value={selectedBannerQuestionId}
      open={questions.disableBannerQuestion ? false : OpenQuestionCross}
      onItemSelect={handelBannerQuestionChange}
      placeholder={StaticText.BANNER_LABEL}
      valueKey="qId"
      labelKey="labelText"
      className="Step-2"
      disabled={questions.disableBannerQuestion}
      disabledPredicate={(value) => value === selectedQuestionId}
      MenuProps={{
        classes: { paper: 'testing' },
      }}
      handleClose={() => setOpenQuestionCross(false)}
      handleOpen={() => setOpenQuestionCross(true)}
    />
  );

  return (
    <div className="chart-content">
      <Grid container spacing={0} justify="space-between" className="mr-button">
        <Grid item className="title__Block chapter--drop-dwon">
          <Chapter />
        </Grid>
        <Grid item className="chart-content__control-wrapper">
          <div className="chart-content__control-item">
            <ChartTypeControl />
          </div>
          <div className="chart-content__control-item">
            <OrientationControl />
          </div>
          <div className="chart-content__control-item chart-items">
            {showhidefeature.significant ? <SignificantDiff /> : ''}

            <ChartTransposeControl />
          </div>
          <div className="chart-content__control-item">
            <ChartFullScreen />
          </div>
          <div className="chart-content__control-item">
            <LabelTypeControl />
          </div>
          <div className="chart-content__control-item chart-items">
            {showhidefeature.userCacheIcon ? <FavouriteControl /> : ''}

            <ExportChart />
          </div>
        </Grid>
        <Tooltip title="Chart Options" className="chart-option-tooltip">
          <MoreVertIcon
            className="chart-content__control-wrapper-mobile"
            onClick={opneMenu}
          />
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          id="menu"
          keepMounted
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          disableAutoFocusItem
          PaperProps={{
            elevation: 0,
            className: 'chart-content__control-menu',
          }}
        >
          <MenuItem className="chart-content__menu-item">
            <ChartTypeControl />
          </MenuItem>
          <MenuItem className="chart-content__menu-item">
            <OrientationControl />
          </MenuItem>
          <MenuItem className="chart-content__menu-item icon-width">
            {/* <SignificantDiff /> */}
            <ChartTransposeControl />
          </MenuItem>
          <MenuItem className="chart-content__menu-item">
            <ChartFullScreen />
          </MenuItem>
          <MenuItem className="chart-content__menu-item">
            <LabelTypeControl />
          </MenuItem>
          <MenuItem className="chart-content__menu-item icon-width">
            {/* <FavouriteControl /> */}
            <ExportChart />
          </MenuItem>
        </Menu>
      </Grid>
      <AppliedFilterList />

      <div className="questioSelection">
        <Grid container spacing={0}>
          <Grid xs={8} className="md-space-4">
            <SingleSelect
              options={updateQuestionList}
              value={selectedQuestionId}
              onItemSelect={handleQuestionChange}
              placeholder={StaticText.QUESTION_LABEL}
              valueKey="qId"
              labelKey="labelText"
              className="single_select_area Step-1"
              disabledPredicate={(value) => value === selectedBannerQuestionId}
              MenuProps={{
                classes: { paper: 'testing' },
              }}
              open={openQSelection}
              handleClose={handleQSelectionClose}
              handleOpen={handleQSelectionOpen}
            />
          </Grid>
          <Grid
            xs={4}
            className={`${questionData?.isMean ? 'mean-switch ' : ''}`}
          >
            {questionData?.isMean && questionData.type === QuestionType.GRID ? (
              <IsMeanControl />
            ) : questions.disableBannerQuestion ? (
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
          </Grid>
        </Grid>
      </div>

      <div
        className={clsx('chart-content__chart-wrapper', {
          'chart-content__chart-wrapper-table': chartType === ChartType.TABLE,
          'chart-wrapper--loading': chartLoading == true,
        })}
      >
        {significant ? (
          <div className="significant-lagend">
            <span className="significant-hedding"> {significantText}</span>
          </div>
        ) : (
          ''
        )}

        {/* <ChartTransposeControl /> */}
        {chart?.questionData === null && !sidebar?.nodata ? (
          <div className="noQuestion--selected">
            <No_Question_Selected
            // className="cursor-pointer"
            // onClick={handleQSelectionOpen}
            />
          </div>
        ) : (
          ''
        )}
        {chart?.chartData.length === 0 &&
        sidebar?.nodata &&
        chart?.chartType != ChartType.TABLE ? (
          <div className="noQuestion--selected">
            <No_Data_Found />
          </div>
        ) : (
          ''
        )}

        {chartLoading ? (
          <Loader />
        ) : chartType === ChartType.TABLE ? (
          <>
            {chart?.questionData?.isMean &&
            chart?.questionData?.type === QuestionType.SINGLE ? (
              <StandardDeviation />
            ) : (
              ''
            )}
            {chart?.chartData.length !== 0 && !sidebar?.nodata ? (
              <TableView />
            ) : (
              <div className="noQuestion--selected">
                <No_Data_Found />
              </div>
            )}
            {/* <TableView /> */}
          </>
        ) : (
          <>
            {chart?.questionData?.isMean &&
            chart?.questionData?.type === QuestionType.SINGLE ? (
              <StandardDeviation />
            ) : (
              ''
            )}
            <Chart />
          </>
        )}
        {/* {chart?.questionData !== null ? ( */}
        <div className="chart-content-footer">
          <div className="chart-content-footer--inr">
            <div className="chart-content__base-count">
              Sample Size: {baseCount} executives across Global 2000 enterprises
            </div>
            <div className="chart-content__info">
              Source: HFS Pulse, H3 2022
            </div>
          </div>
        </div>
        {/* ) : (
          ''
        )} */}
      </div>
    </div>
  );
};

export default ChartContent;
