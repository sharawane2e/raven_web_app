import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import StaticDashboard from "../../components/StaticDashboard";
import dashboardImage from "../../assets/images/dashboard-chart.png";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
import { useState } from "react";

const StaticHomeScreen: React.FC = () => {
  const [openPopup, setOpenPopup] = useState<boolean>(true);
  return (
    <div className="home-screen">
      <Appbar variant="fullWidth" />
      <main className="home-screen__content">
        {/* <CustomScrollbar> */}
        <img src={dashboardImage} alt="" />
        <Dialog open={openPopup} className="home-modal">
          <div className="home-modal__content">
            {/* <CustomScrollbar> */}
            <StaticDashboard onActionClick={() => setOpenPopup(false)} />
            {/* </CustomScrollbar> */}
          </div>
          <Grid container className="home-modal__footer">
            <FormControlLabel
              className=""
              value="bottom"
              label="Don't show thisd page again"
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
        {/* </CustomScrollbar> */}
      </main>
    </div>
  );
};

export default StaticHomeScreen;
