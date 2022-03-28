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
  setChartData,
  setChartTranspose,
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
import { ReactComponent as No_Data_Found } from '../../assets/svg/No_data_found.svg';
import { ReactComponent as RavenBrandLogo } from '../../assets/svg/raven-brand-logo.svg';
import Chapter from '../Chapter';
import _ from 'lodash';

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
    chart: { chartLoading, questionData, baseCount, chartType },
    chapters: { allChapters, selectedChapterId },
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
  }, []);

  let updateQuestionList: any[] = [];
  let updateBannerList: any[] = [];
  if (selectedChapterId && allChapters) {
    const selectchapterObject = _.find(allChapters, function (o) {
      return o.chapterId === selectedChapterId;
    });
    const sortedChapterOrder = _.sortBy(allChapters, ['order']);
    sortedChapterOrder.forEach((chapterData: any, index) => {
      // console.log('chapterData', chapterData);
      if (chapterData['chapterId'] === selectchapterObject?.chapterId) {
        // console.log('sortedChapterOrder', chapterData?.QuestionsQIds);
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
    }
  }, [questionData?.type]);

  const handleQuestionChange = (value: string) => {
    dispatch(setChartTranspose(false));
    dispatch(setSelectedQuestionId(value));
    fetchChartData(value)
      .then((chartData) => {
        dispatch(setChartData(chartData));
        // dispatch(setChartOperations(defaultChartOperations))
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
    dispatch(setChartTranspose(false));
    dispatch(setSelectedBannerQuestionId(value));
    fetchChartData(undefined, value)
      .then((chartData) => {
        dispatch(setChartData(chartData));
        // dispatch(setChartOperations(defaultChartOperations))
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
          {/* <Breadcrum pageTitle="Reports" /> */}
          {/* <div className="chart-content__control-item"> */}
          <Chapter />
          {/* </div> */}
        </Grid>
        <Grid item className="chart-content__control-wrapper">
          {/* <ChartOptionsControl /> */}

          <div className="chart-content__control-item">
            <ChartTypeControl />
          </div>
          <div className="chart-content__control-item">
            <OrientationControl />
          </div>
          <div className="chart-content__control-item">
            <ChartTransposeControl />
          </div>
          <div className="chart-content__control-item">
            <ChartFullScreen />
          </div>
          <div className="chart-content__control-item">
            <LabelTypeControl />
          </div>
          <div className="chart-content__control-item">
            <ExportChart />
          </div>
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
          <MenuItem className="chart-content__menu-item">
            <ChartTransposeControl />
          </MenuItem>
          <MenuItem className="chart-content__menu-item">
            <LabelTypeControl />
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
          <Grid xs={4}>
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
          </Grid>
        </Grid>
      </div>

      <div
        className={clsx('chart-content__chart-wrapper', {
          'chart-content__chart-wrapper-table': chartType === ChartType.TABLE,
          'chart-wrapper--loading': chartLoading == true,
        })}
      >
        {/* <ChartTransposeControl /> */}
        {chart?.questionData === null ? (
          <div className="noQuestion--selected">
            <No_Question_Selected
              className="cursor-pointer"
              onClick={handleQSelectionOpen}
            />
          </div>
        ) : (
          ''
        )}
        {chart?.chartData == [] ? (
          <div className="noQuestion--selected">
            <No_Data_Found />
          </div>
        ) : (
          ''
        )}

        {chartLoading ? (
          <Loader />
        ) : chartType === ChartType.TABLE ? (
          <TableView />
        ) : (
          <Chart />
        )}
        <div className="chart-content-footer">
          <div className="chart-content-footer--inr">
            <div className="chart-content__base-count">
              Sample Size: {baseCount}
            </div>
            <div className="chart-content__info">
              Note: Sample size reflects selections from filter and cross-tab
              menus, not in-legend selections.
            </div>
          </div>
          <div className="appbar__logo-wrapper">
            <RavenBrandLogo />
            {/* <BrandLogo
              className="appbar__brand-logo"
              // onClick={() => history.push('/home')}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartContent;
