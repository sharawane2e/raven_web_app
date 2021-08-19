import clsx from "clsx";
import { useContext } from "react";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import AdminSidebarContent from "../../components/Sidebar/sidebar-content/AdminSidebarContent";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import IRoute from "../../types/IRoute";

export interface AdminPanelScreenProps {
  routes: IRoute[];
}

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = (props) => {
  const { routes } = props;
  const { open: openSidebar } = useContext(SidebarContext);
  return (
    <div className="admin-panel">
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="Admin" content={AdminSidebarContent} />
        <SidebarContext.Consumer>
          {({ open }) => {
            return (
              <main
                className={clsx("admin-panel__content", {
                  "sidebar-open": open,
                })}
              >
                <AppRouting routes={routes} />
              </main>
            );
          }}
        </SidebarContext.Consumer>
      </SidebarContextProvider>
    </div>
  );
};

export default AdminPanelScreen;
