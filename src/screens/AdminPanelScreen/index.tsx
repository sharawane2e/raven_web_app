import clsx from "clsx";
import { useContext } from "react";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import AdminSidebarContent from "../../components/Sidebar/sidebar-content/AdminSidebarContent";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import UserDetailsContextProvider from "../../contexts/UserDetailsContext";
import IRoute from "../../types/IRoute";

export interface AdminPanelScreenProps {
  routes: IRoute[];
}

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = (props) => {
  const { routes } = props;

  return (
    <div className="admin-panel">
      <SidebarContextProvider>
        <UserDetailsContextProvider>
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
        </UserDetailsContextProvider>
      </SidebarContextProvider>
    </div>
  );
};

export default AdminPanelScreen;
