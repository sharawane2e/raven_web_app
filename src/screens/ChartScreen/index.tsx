import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
import clsx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import Sidebar from "../../components/Sidebar";
import ChartSidebarContent from "../../components/Sidebar/sidebar-content/ChartSidebarContent";
import StaticDashboard from "../../components/StaticDashboard";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import ApiUrl from "../../enums/ApiUrl";
import { RootState } from "../../redux/store";
import IRoute from "../../types/IRoute";
import ApiRequest from "../../utils/ApiRequest";

interface ChartScreenProps {
  routes: IRoute[];
}

const ChartScreen: React.FC<ChartScreenProps> = (props) => {
  const { routes } = props;
  const [openPopup, setOpenPopup] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(true);
  const { profile } = useSelector((state: RootState) => state.user);

  const handlePopupClose = () => {
    if (!showContent) {
      const url = ApiUrl.SHOW_CONTENT_PAGE + "/" + profile?._id;
      ApiRequest.request(url, "PATCH", { showContentPageCheck: false })
        .then((res) => {
          if (res.success) {
            // profile?.showContentPage = false;
            // LocalStorageUtils.setUser(profile);
          }
        })
        .catch((error) => console.log(error));
    }
    setOpenPopup(false);
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
    </div>
  );
};

export default ChartScreen;
