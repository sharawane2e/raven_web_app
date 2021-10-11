import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
import { TourProvider } from "@reactour/tour";
import Tour from "reactour";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import Sidebar from "../../components/Sidebar";
import ChartSidebarContent from "../../components/Sidebar/sidebar-content/ChartSidebarContent";
import StaticDashboard from "../../components/StaticDashboard";
import { chartTourSteps } from "../../config/TourConfig";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import ApiUrl from "../../enums/ApiUrl";
import { setUserProfile } from "../../redux/actions/userActions";
import { RootState } from "../../redux/store";
import IRoute from "../../types/IRoute";
import { IUserProfile } from "../../types/IUserProfile";
import ApiRequest from "../../utils/ApiRequest";
import { skipPartiallyEmittedExpressions } from "typescript";

interface ChartScreenProps {
  routes: IRoute[];
}

const ChartScreen: React.FC<ChartScreenProps> = (props) => {
  const { routes } = props;
  const [openPopup, setOpenPopup] = useState<boolean>(true);
  const [showChartTour, setShowChartTour] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(true);
  const {
    user: { profile },
    tour: { showTourGuide },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profile?.showContentPage && showTourGuide) {
      setShowChartTour(true);
    }
  }, []);

  const handlePopupClose = () => {
    if (!showContent) {
      const url = ApiUrl.SHOW_CONTENT_PAGE + "/" + profile?._id;
      ApiRequest.request(url, "PATCH", { showContentPageCheck: false })
        .then((res) => {
          if (res.success) {
            const updatedProfileData: IUserProfile = JSON.parse(
              JSON.stringify(profile)
            );
            updatedProfileData.showContentPage = false;
            dispatch(setUserProfile(updatedProfileData));
          }
        })
        .catch((error) => console.log(error));
    }
    setOpenPopup(false);
    if (showTourGuide) {
      setShowChartTour(true);
    }
  };

  return (
    <div className="chart-screen">
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="Filters" content={ChartSidebarContent} />
        <SidebarContext.Consumer>
          {({ open }) => {
            return (
              <main
                className={clsx("content-area", {
                  "sidebar-open": open,
                })}
              >
                <AppRouting routes={routes} />
              </main>
            );
          }}
        </SidebarContext.Consumer>
      </SidebarContextProvider>
      <Dialog
        open={!!profile?.showContentPage && openPopup}
        className="home-modal"
      >
        <div className="home-modal__content">
          <CustomScrollbar>
            <StaticDashboard onActionClick={handlePopupClose} />
          </CustomScrollbar>
        </div>
        <Grid container className="home-modal__footer">
          <FormControlLabel
            className=""
            label="Don't show this page again"
            control={
              <Checkbox
                checked={!showContent}
                onChange={() => setShowContent(!showContent)}
              />
            }
          />
          <Button className="button--primary" onClick={handlePopupClose}>
            Go to dashboard
          </Button>
        </Grid>
      </Dialog>
      {
        <Tour
          steps={chartTourSteps}
          isOpen={showChartTour}
          onRequestClose={() => setShowChartTour(false)}
        />
      }
    </div>
  );
};

export default ChartScreen;
