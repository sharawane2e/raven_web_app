import clsx from "clsx";
import { useSelector } from "react-redux";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import AdminSidebarContent from "../../components/Sidebar/sidebar-content/AdminSidebarContent";
import SidebarContextProvider from "../../contexts/SidebarContext";
import UserDetailsContextProvider from "../../contexts/UserDetailsContext";
import { RootState } from "../../redux/store";
import IRoute from "../../types/IRoute";

export interface AdminPanelScreenProps {
  routes: IRoute[];
}

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = (props) => {
  const { routes } = props;
  const { open } = useSelector((state: RootState) => state.sidebar);
  return (
    <div className="admin-panel">
      <SidebarContextProvider>
        <UserDetailsContextProvider>
          <Appbar />
          <Sidebar title="Admin" content={AdminSidebarContent} />

          <main
            className={clsx("content-area admin-panel__content", {
              "sidebar-open": open,
            })}
          >
            <AppRouting routes={routes} />
          </main>
        </UserDetailsContextProvider>
      </SidebarContextProvider>
    </div>
  );
};

export default AdminPanelScreen;
