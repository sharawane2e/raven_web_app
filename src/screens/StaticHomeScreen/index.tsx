import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import StaticDashboard from "../../components/StaticDashboard";
import dashboardImage from "../../assets/images/dashboard-chart.png";
import { Dialog, Modal, Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
const StaticHomeScreen: React.FC = () => {
  const [openPopup, setOpenPopup] = useState<boolean>(true);
  return (
    <div className="home-screen">
      <Appbar variant="fullWidth" />
      <main className="home-screen__content">
        <CustomScrollbar>
          <img src={dashboardImage} alt="" />
          <Dialog open={openPopup} className="home-modal">
            <CloseIcon
              className="home-modal__close-icon"
              onClick={() => setOpenPopup(false)}
            />
            <StaticDashboard />
            {/* <Paper elevation={4}>
            </Paper> */}
          </Dialog>
        </CustomScrollbar>
      </main>
    </div>
  );
};

export default StaticHomeScreen;
