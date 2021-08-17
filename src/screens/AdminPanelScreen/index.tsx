import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import AdminSidebarContent from "../../components/Sidebar/sidebar-content/AdminSidebarContent";
import SidebarContextProvider from "../../contexts/SidebarContext";
import IRoute from "../../types/IRoute";

export interface AdminPanelScreenProps {
  routes: IRoute[];
}

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = (props) => {
  const { routes } = props;
  return (
    <div className="admin-panel">
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="Admin" content={AdminSidebarContent} />
      </SidebarContextProvider>
      <main className="admin-panel__content">
        <AppRouting routes={routes} />
      </main>
    </div>
  );
};

export default AdminPanelScreen;
