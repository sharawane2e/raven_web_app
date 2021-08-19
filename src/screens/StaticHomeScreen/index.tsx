import Appbar from "../../components/Appbar";
import CustomScrollbar from "../../components/CustomScrollbar";
import StaticDashboard from "../../components/StaticDashboard";
import Sidebar from "../../components/Sidebar";
import AdminSidebarContent from "../../components/Sidebar/sidebar-content/AdminSidebarContent";
import SidebarContextProvider from "../../contexts/SidebarContext";

const StaticHomeScreen: React.FC = () => {
  return (
    <div className="home-screen">
      <Appbar removeToggleButton />
      <main className="home-screen__content">
        <CustomScrollbar>
          <StaticDashboard />
        </CustomScrollbar>
      </main>
    </div>
  );
};

export default StaticHomeScreen;
