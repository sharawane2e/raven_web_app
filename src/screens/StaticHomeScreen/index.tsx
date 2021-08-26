import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import StaticDashboard from "../../components/StaticDashboard";
import dashboardImage from "../../assets/images/dashboard-chart.png";

const StaticHomeScreen: React.FC = () => {
  return (
    <div className="home-screen">
      <Appbar variant="fullWidth" />
      <main className="home-screen__content">
        <CustomScrollbar>
          {/* <img src={dashboardImage} alt="" /> */}
          <StaticDashboard />
        </CustomScrollbar>
      </main>
    </div>
  );
};

export default StaticHomeScreen;
