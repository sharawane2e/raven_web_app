import {
  Box,
  Button,
  Drawer,
  Typography,
  Tooltip,
  MenuItem,
} from '@material-ui/core';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import React, { ComponentType, useState, useEffect } from 'react';
import store, { RootState } from '../../../../redux/store';
import CustomScrollbar from '../../../CustomScrollbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import { toggleSidebarUserCache } from '../../../../redux/actions/sidebarAction';
import { ReactComponent as ColumnChartIcon } from '../../../../assets/svg/column-chart-icon.svg';
import { ReactComponent as StackChartIcon } from '../../../../assets/svg/stack-chart-icon.svg';
import { ReactComponent as TableIcon } from '../../../../assets/svg/table-icon.svg';
import { ReactComponent as PieChartIcon } from '../../../../assets/svg/pie-chart.svg';
import { ReactComponent as LineChartIcon } from '../../../../assets/svg/line_chart.svg';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ReactComponent as NumberIcon } from '../../../../assets/svg/Number.svg';
import { ReactComponent as PercentageIcon } from '../../../../assets/svg/Percentage.svg';
import { ReactComponent as TransposeIcon } from '../../../../assets/svg/Transpose.svg';
import { ReactComponent as TransferdataIcon } from '../../../../assets/svg/transfer_data.svg';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import CustomSkeleton from '../../../../skeletons/CustomSkeleton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  resetUserCache,
  setDialog,
  setInCache,
  setUserCacheId,
} from '../../../../redux/actions/userCacheActions';
import _ from 'lodash';
import {
  handelUpdatedUserCache,
  handleDeleteChartCache,
  handleExportChartCache,
} from '../../../../services/userCacheService';
import {
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
  setSelectedQuestionText,
} from '../../../../redux/actions/questionAction';

import {
  setChartData,
  setChartLabel,
  setChartOrientation,
  setChartTranspose,
  setshowMean,
  updateSignificant,
} from '../../../../redux/actions/chartActions';

import {
  changeChartType,
  fetchChartData,
  transposeChart,
} from '../../../../services/ChartService';
import {
  setAppliedFilters,
  setFilters,
} from '../../../../redux/actions/filterActions';
import { ChartType } from '../../../../enums/ChartType';
import UserCacheSekeleton from '../../../../skeletons/UserCacheSekeleton';
import Loader from '../../../widgets/Loader/Index';
import clsx from 'clsx';
import {
  setSelectedBannerID,
  setSelectedChapterId,
  setSelectedQuestionID,
} from '../../../../redux/actions/chapterActions';
import { StaticText } from '../../../../constants/StaticText';
import CustomPopup from '../../../widgets/CutsomPopup';
import { ReactComponent as SignificantDiffIcon } from '../../../../assets/svg/signf-d.svg';
import { significantText } from '../../../../constants/Variables';
import { Divider, Menu } from '@mui/material';
import { ReactComponent as PdfIcon } from '../../../../assets/svg/pdf-icon.svg';
import { ReactComponent as PptIcon } from '../../../../assets/svg/ppt-icon.svg';

export interface UserCacheProps {
  loaderSkeleton?: ComponentType;
}

const UserCacheExport: React.FC<UserCacheProps> = (props) => {
  const { sidebar, chart, chapters, userCache, filters } = useSelector(
    (state: RootState) => state,
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectAllSelf, setSelectAllSelf] = useState<number>(0);
  const [butttonshow, setButtonShow] = useState(true);
  const [activeCacheId, setActiveCacheId] = useState<any>('');
  const { savedChart, cacheId } = userCache;
  const chartQuestionData = chart?.questionData;
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const opneMenu = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const closeSidebar = () => {
    dispatch(toggleSidebarUserCache(false));
    setSelectAll(false);
  };

  const chartIcons = (index: any) => {
    if (savedChart[index]?.chartType == ChartType.COLUMN) {
      return <ColumnChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.STACK) {
      return <StackChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.TABLE) {
      return <TableIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.PIE) {
      return <PieChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.LINE) {
      return <LineChartIcon className="chart-hover-filed" />;
    }
  };

  useEffect(() => {
    savedChart.map(function (chartElement) {
      if (chartElement.isSelected == false) {
        setSelectAll(false);
      }
    });
  });

  useEffect(() => {
    const updateCacheChart: any[] = [];
    savedChart.map(function (chartElement) {
      const updateSingleChartContent = { ...chartElement };
      updateSingleChartContent.isSelected = selectAll;
      updateCacheChart.push(updateSingleChartContent);
    });
    dispatch(resetUserCache(updateCacheChart));
  }, [selectAllSelf]);

  useEffect(() => {
    const savedChartLength = savedChart.length;
    let selectAll = false;
    let selectedCount = 0;
    const _savedChart = JSON.parse(JSON.stringify(savedChart));

    _savedChart.map(function (chartElement: any) {
      if (chartElement.isSelected) {
        selectedCount++;
      }
    });

    if (selectedCount === savedChartLength && selectedCount != 0) {
      setSelectAll(true);
      setButtonShow(false);
    } else if (selectedCount < savedChartLength && selectedCount != 0) {
      setSelectAll(false);
      setButtonShow(false);
    } else {
      setButtonShow(true);
    }
  }, [JSON.stringify(savedChart)]);

  const handleSelectAll = (selectAllValue: boolean, e: any) => {
    setSelectAll(selectAllValue);
    if (e != undefined) {
      setSelectAllSelf(selectAllSelf + 1);
    }
  };

  const handleSingleSelect = (savedChartId: string, selectValue: boolean) => {
    setActiveCacheId(savedChartId);
    const _savedChart = JSON.parse(JSON.stringify(savedChart));
    _savedChart.forEach(function (singleCacheChart: any) {
      if (singleCacheChart._id === savedChartId) {
        singleCacheChart.isSelected = selectValue;
      }
    });
    dispatch(resetUserCache(_savedChart));
  };

  const cacheShow = (
    cacheId: any,
    event: any,
    selectValue: boolean,
    qtext: any,
    qid: any,
  ) => {
    setActiveCacheId(selectValue);
    const questionTextId = qid + '-' + qtext;
    dispatch(setUserCacheId(cacheId));
    dispatch(setInCache(true));
    dispatch(setSelectedQuestionText(questionTextId));
    const _cacheQuestion: any = savedChart.filter((userCacheinfo: any) => {
      return userCacheinfo?._id === cacheId;
    });
    // console.log('_cacheQuestion[0]', _cacheQuestion[0]);

    dispatch(setSelectedQuestionID(_cacheQuestion[0]?.qId));
    dispatch(setSelectedBannerID(_cacheQuestion[0]?.bannerQuestion));
    dispatch(setAppliedFilters(_cacheQuestion[0]['filter']));
    dispatch(setSelectedQuestionId(_cacheQuestion[0]['qId']));
    dispatch(setSelectedQuestionText(_cacheQuestion[0]['qId']));
    fetchChartData()
      .then((chartData) => {
        userChapterShow(chartData);
        dispatch(setFilters(_cacheQuestion[0]['filter']));
        dispatch(updateSignificant(_cacheQuestion[0]['significant']));
        dispatch(setshowMean(_cacheQuestion[0]['showMean']));
        dispatch(setChartData(chartData));
        dispatch(setChartLabel(_cacheQuestion[0]['chartLabelType']));
        changeChartType(_cacheQuestion[0]['chartType']);
        dispatch(setChartOrientation(_cacheQuestion[0]['chartOrientation']));
        dispatch(setChartTranspose(false));
        if (_cacheQuestion[0]['chartTranspose']) {
          transposeChart();
        }
      })
      .catch((error) => console.log(error));
  };

  const userCacheDelete = () => {
    dispatch(toggleSidebarUserCache(true));
    const deleteSavedCharts = savedChart.filter(
      (chartElement) => chartElement.isSelected == true,
    );
    const deleteSavedChartsIds = deleteSavedCharts.map(
      (chartElement) => chartElement._id,
    );

    handleDeleteChartCache(deleteSavedChartsIds);
  };

  const userCacheExport = (getsavedChart: any, exportType: string) => {
    const exportSavedCharts = savedChart.filter(
      (chartElement: any) => chartElement.isSelected == true,
    );
    const exportSavedChartsIds: any = exportSavedCharts.map(
      (chartElement: any) => chartElement._id,
    );
    handleExportChartCache(exportSavedChartsIds, getsavedChart, exportType);
  };

  const userChapterShow = (chartData: any) => {
    const chapterQuestionid: any = chartData?.questionData?.qId;
    chapters.allChapters?.forEach((getchapter: any) => {
      const getSelectedQuestionID: boolean = getchapter.QuestionsQIds.some(
        (el: any) => {
          return el === chapterQuestionid;
        },
      );
      if (getSelectedQuestionID) {
        dispatch(setSelectedChapterId(getchapter?.chapterId));
      }
    });
  };

  const handleClickOpen = () => {
    dispatch(toggleSidebarUserCache(false));
    dispatch(setInCache(false));
    dispatch(setDialog(true));
  };

  const handleClose = () => {
    dispatch(setDialog(false));
    dispatch(toggleSidebarUserCache(true));
  };
  const handleCloseReplace = () => {
    dispatch(setDialog(false));
    dispatch(toggleSidebarUserCache(true));
  };

  const userCacheReplace = () => {
    dispatch(toggleSidebarUserCache(false));
    handelUpdatedUserCache(chart, chartQuestionData, filters, cacheId);
  };
  return (
    <div className="sidebar user-cache">
      <Drawer
        anchor="right"
        open={sidebar?.userCache}
        variant="persistent"
        className="drawer drawer--desktop"
      >
        <Box role="presentation">
          <Typography
            variant="body1"
            component="div"
            className="user-cache__select-all"
          >
            {savedChart.length === 0 ? (
              ''
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    className="default-checkbox-color"
                    icon={<CircleUnchecked />}
                    checkedIcon={
                      <CircleCheckedFilled className="checked-color" />
                    }
                    name="allSelect"
                    onChange={(e) => {
                      handleSelectAll(!selectAll, e);
                    }}
                    sx={{ color: '#fff' }}
                    checked={selectAll}
                  />
                }
                label="Select All"
              />
            )}

            <CloseIcon
              onClick={closeSidebar}
              sx={{ color: '#fff', cursor: 'pointer' }}
            />
          </Typography>
          <div className="user-cache__bottom-line"></div>
        </Box>

        <CustomScrollbar>
          <CustomSkeleton
            loading={userCache.cacheLoading}
            loaderSkeleton={UserCacheSekeleton}
            skeletonCount={8}
          >
            {savedChart.length === 0 ? (
              <>
                <div className="user-cache__no-data">
                  {StaticText.USER_CACHE_EMPTY}
                </div>
              </>
            ) : (
              savedChart.map((savedata: any, index: any) => {
                let cacheDate = new Date(savedata?.date);
                const curentDate = cacheDate.toLocaleString('en-us');
                return (
                  <div className="user-cache__sidebar" key={index}>
                    <div
                      className={`user-cache__cache-data ${
                        activeCacheId == savedata?._id || savedata?.isSelected
                          ? 'user-cache__cache-data--active-section'
                          : ''
                      }`}
                    >
                      <div
                        id={savedata?._id}
                        className={`user-cache__cache-data--cache-section ${
                          activeCacheId == savedata?._id || savedata?.isSelected
                            ? 'user-cache__cache-data--active-section'
                            : ''
                        }`}
                        onClick={(event) =>
                          cacheShow(
                            savedata?._id,
                            event,
                            savedata?.isSelected,
                            savedata?.qText,
                            savedata?.qId,
                          )
                        }
                      >
                        <div className="user-cache__chart-icon-sec">
                          <div className="user-cache__chart-icon">
                            {chartIcons(index)}
                          </div>
                        </div>

                        <div className="user-cache__chart-question">
                          <Tooltip
                            title={savedata?.qText}
                            arrow
                            placement="top"
                          >
                            <div className="user-cache__chart-headding">
                              {savedata?.qText}
                            </div>
                          </Tooltip>
                          <div className="user-cache__collectdata">
                            <Tooltip
                              title={curentDate.split(',')[0]}
                              arrow
                              placement="top"
                            >
                              <div className="user-cache__date">
                                {curentDate.split(',')[0]}
                              </div>
                            </Tooltip>
                            <div className="user-cache__colection-icon">
                              {savedChart[index]?.filter.length > 0 ? (
                                <Tooltip
                                  title={'Filters'}
                                  arrow
                                  placement="top"
                                >
                                  <FilterAltIcon
                                    id={savedata?.qId}
                                    className="filter-icons"
                                  />
                                </Tooltip>
                              ) : (
                                ''
                              )}
                              {savedChart[index]?.chartLabelType ===
                              'percentage' ? (
                                <Tooltip
                                  title={'Percentage'}
                                  arrow
                                  placement="top"
                                >
                                  <PercentageIcon />
                                </Tooltip>
                              ) : (
                                <Tooltip title={'Number'} arrow placement="top">
                                  <NumberIcon id={savedata?.qId} />
                                </Tooltip>
                              )}
                              {savedChart[index]?.chartTranspose ? (
                                <Tooltip
                                  title={'Transpose'}
                                  arrow
                                  placement="top"
                                >
                                  <TransposeIcon id={savedata?.qId} />
                                </Tooltip>
                              ) : (
                                ''
                              )}

                              {savedChart[index]?.qId !== '' &&
                              savedChart[index]?.bannerQuestion !== '' ? (
                                <Tooltip
                                  title={savedChart[index]?.bannerQuestion}
                                  arrow
                                  placement="top"
                                >
                                  <TransferdataIcon className="transferdata-icon" />
                                </Tooltip>
                              ) : (
                                ''
                              )}

                              {savedChart[index]?.significant ? (
                                <Tooltip
                                  title={significantText}
                                  arrow
                                  placement="top"
                                >
                                  <SignificantDiffIcon />
                                </Tooltip>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="multi-select-btn">
                        <Checkbox
                          icon={<CircleUnchecked />}
                          checkedIcon={
                            <CircleCheckedFilled className="checked-color" />
                          }
                          name={index}
                          value={savedata?._id}
                          className="user-cache-checkbox"
                          sx={{ p: 0, ml: '-4px' }}
                          checked={savedata?.isSelected}
                          onChange={() => {
                            handleSingleSelect(
                              savedata?._id,
                              !savedata?.isSelected,
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="user-cache__bottom-line"></div>
                  </div>
                );
              })
            )}
          </CustomSkeleton>
        </CustomScrollbar>
        <div className="user-cache__footer">
          <div className="user-cache__bottom-line"></div>
          <div className="user-cache__footer-inr">
            <Button
              disabled={butttonshow}
              className="button--secondary user-cache__delete-btn"
              //onClick={userCacheDelete}
              onClick={handleClickOpen}
            >
              Delete
            </Button>
            <Button
              disabled={butttonshow}
              className={clsx({
                'button--primary btn-line': true,
                butttondisable: butttonshow ? true : false,
              })}
              //  className=`${butttonshow} ""button--primary btn-line""`
              // onClick={() => {
              //   userCacheExport(savedChart);
              // }}
              onClick={opneMenu}
            >
              Export
              <KeyboardArrowDownIcon sx={{ fill: '#fff' }} />
            </Button>

            <Menu
              anchorEl={anchorEl}
              id="menu"
              keepMounted
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              //getContentAnchorEl={null}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              disableAutoFocusItem
              PaperProps={{
                elevation: 0,
                className: 'chart-content__control-menu',
              }}
            >
              <MenuItem
                className="chart-content__menu-item"
                onClick={() => {
                  userCacheExport(savedChart, 'pdfexport');
                }}
              >
                <PdfIcon className="mr-right" />
                Pdf export
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                className="chart-content__menu-item"
                onClick={() => {
                  userCacheExport(savedChart, 'pptexport');
                }}
              >
                <PptIcon className="mr-right" />
                Ppt export
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Drawer>

      {chart?.fullScreenLoading ? (
        <div className="multi-export-loadder">
          <Loader />
        </div>
      ) : null}

      {userCache?.inCache ? (
        <CustomPopup
          open={userCache.open}
          StaticText={StaticText.REPLACE_MESSAGE}
          handleClose={handleCloseReplace}
          questionText={savedChart}
          userCache={userCacheReplace}
          buttonText="Yes, Replace"
        />
      ) : (
        <CustomPopup
          open={userCache.open}
          StaticText={StaticText.DELETE_MESSAGE}
          handleClose={handleClose}
          questionText={savedChart}
          userCache={userCacheDelete}
          buttonText="Yes, delete"
        />
      )}
    </div>
  );
};

export default memo(UserCacheExport);
