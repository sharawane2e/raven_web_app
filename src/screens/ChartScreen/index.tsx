import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  IconButton,
} from '@material-ui/core';
import Tour from 'reactour';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouting from '../../AppRouting';
import Appbar from '../../components/Appbar';
import CustomScrollbar from '../../components/CustomScrollbar';
import Sidebar from '../../components/Sidebar';
import ChartSidebarContent from '../../components/Sidebar/sidebar-content/ChartSidebarContent';
import StaticDashboard from '../../components/StaticDashboard';
import { chartTourSteps } from '../../config/TourConfig';
import SidebarContextProvider from '../../contexts/SidebarContext';
import ApiUrl from '../../enums/ApiUrl';
import { setUserProfile } from '../../redux/actions/userActions';
import store, { RootState } from '../../redux/store';
import IRoute from '../../types/IRoute';
import { IUserProfile } from '../../types/IUserProfile';
import ApiRequest from '../../utils/ApiRequest';
import { fetchFilterList } from '../../redux/actions/filterActions';
import { hideTourGuide } from '../../redux/actions/tourAction';
import { toggleSidebar } from '../../redux/actions/sidebarAction';
import Chart from '../../components/Chart';
import TableView from '../../components/TableView';
import { ChartType } from '../../enums/ChartType';
import CloseIcon from '@mui/icons-material/Close';
import { setChartFullScreen } from '../../redux/actions/chartActions';
import { significantText } from '../../constants/Variables';
import UserCacheSidebar from '../../components/Sidebar/sidebar-content/UserCacheSidebar';
// import {useHotkeys} from 'react-hotkeys-hook';

interface ChartScreenProps {
  routes: IRoute[];
}

const ChartScreen: React.FC<ChartScreenProps> = (props) => {
  const { routes } = props;
  const [openPopup, setOpenPopup] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(true);
  const {
    user: { profile },
    tour: { showTourGuide },
    sidebar: { open },
    chart: { significant },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const { chart } = store.getState();
  // const {dispatch} = store;

  // useHotkeys('f',()=>{dispatch(setChartFullScreen(false));})

  useEffect(() => {
    dispatch(fetchFilterList());
  }, []);

  const handlePopupClose = () => {
    if (!showContent) {
      const url = ApiUrl.SHOW_CONTENT_PAGE + '/' + profile?._id;
      ApiRequest.request(url, 'PATCH', { showContentPageCheck: false })
        .then((res) => {
          if (res.success) {
            const updatedProfileData: IUserProfile = JSON.parse(
              JSON.stringify(profile),
            );
            updatedProfileData.showContentPage = false;
            dispatch(setUserProfile(updatedProfileData));
          }
        })
        .catch((error) => console.log(error));
    }
    setOpenPopup(false);
    // if (showTourGuide) {
    //   setShowChartTour(true);
    // }
  };

  return (
    <div className="chart-screen">
      <UserCacheSidebar />
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="Filters" content={ChartSidebarContent} />
        <main
          className={clsx('content-area', {
            'sidebar-open': open,
          })}
        >
          <AppRouting routes={routes} />
        </main>
      </SidebarContextProvider>

      <Dialog open={openPopup} className="home-modal">
        <div className="home-modal__content">
          <CustomScrollbar>
            <StaticDashboard onActionClick={handlePopupClose} />
          </CustomScrollbar>
        </div>
        <Grid container className="home-modal__footer">
          {/* <FormControlLabel
            className=""
            label="Don't show this page again"
            control={
              <Checkbox
                checked={!showContent}
                onChange={() => setShowContent(!showContent)}
              />
            }
          /> */}
          <Button className="button--primary" onClick={handlePopupClose}>
            Go to dashboard
          </Button>
        </Grid>
      </Dialog>

      <Dialog
        fullScreen
        open={chart.chartfullScreen}
        className={clsx('fullscreen--dialog', {
          'chart-screen__chart-wrapper-table':
            chart.chartType === ChartType.TABLE,
        })}
      >
        {significant ? (
          <div className="significant-lagend significant-full-screen">
            <span className="significant-hedding"> {significantText}</span>
          </div>
        ) : (
          ''
        )}

        <IconButton
          className="cross--btn"
          onClick={() => {
            dispatch(setChartFullScreen(false));
          }}
        >
          <CloseIcon />
        </IconButton>

        {chart.chartType === ChartType.TABLE ? <TableView /> : <Chart />}
      </Dialog>
      {
        <Tour
          steps={chartTourSteps}
          isOpen={showTourGuide}
          onRequestClose={() => dispatch(hideTourGuide())}
          startAt={0}
        />
      }
    </div>
  );
};

export default ChartScreen;
