import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
import clsx from "clsx";
import { useState } from "react";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import Sidebar from "../../components/Sidebar";
import ChartSidebarContent from "../../components/Sidebar/sidebar-content/ChartSidebarContent";
import StaticDashboard from "../../components/StaticDashboard";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import IRoute from "../../types/IRoute";
import LocalStorageUtils from "../../utils/LocalStorageUtils";

interface ChartScreenProps {
  routes: IRoute[];
}

const ChartScreen: React.FC<ChartScreenProps> = (props) => {
  const { routes } = props;
  const [openPopup, setOpenPopup] = useState<boolean>(true);
  // const user = LocalStorageUtils.getUser();

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

      <Dialog open={openPopup} className="home-modal">
        <div className="home-modal__content">
          <CustomScrollbar>
            <StaticDashboard onActionClick={() => setOpenPopup(false)} />
          </CustomScrollbar>
        </div>
        <Grid container className="home-modal__footer">
          <FormControlLabel
            className=""
            value="bottom"
            label="Don't show this page again"
            control={<Checkbox />}
          />
          <Button
            className="button--primary"
            onClick={() => setOpenPopup(false)}
          >
            Go to dashboard
          </Button>
        </Grid>
      </Dialog>
    </div>
  );
};

export default ChartScreen;
