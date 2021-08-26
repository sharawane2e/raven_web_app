import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import StaticDashboard from "../../components/StaticDashboard";
import dashboardImage from "../../assets/images/dashboard-chart.png";
import { Modal, Paper } from "@material-ui/core";

const StaticHomeScreen: React.FC = () => {
  return (
    <div className="home-screen">
      <Appbar variant="fullWidth" />
      <main className="home-screen__content">
        <CustomScrollbar>
          <img src={dashboardImage} alt="" />
          <Modal open={true} className="home-modal">
            <Paper elevation={4}>
              <StaticDashboard />
            </Paper>
          </Modal>
        </CustomScrollbar>
      </main>
    </div>
  );
};

export default StaticHomeScreen;
