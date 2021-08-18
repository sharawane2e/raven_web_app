import { Link } from "react-router-dom";
import Appbar from "../../components/Appbar";
import StaticDashboard from "../../components/dashboard";
import Sidebar from "../../components/Sidebar";
import AdminSidebarContent from "../../components/Sidebar/sidebar-content/AdminSidebarContent";
import SidebarContextProvider from "../../contexts/SidebarContext";

const StaticHomeScreen: React.FC = () => {
  return (
    <div className="admin-panel">
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="Admin" content={AdminSidebarContent} />
      </SidebarContextProvider>
      <main className="admin-panel__content">
       <StaticDashboard />
        <Link to="/admin">Go to admin panel</Link>
      </main>
      
    </div>
  );
};

export default StaticHomeScreen;
