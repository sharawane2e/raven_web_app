import clsx from "clsx";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import IRoute from "../../types/IRoute";

export interface UserPanelScreenProps {
  routes: IRoute[];
}

const UserPanelScreen: React.FC<UserPanelScreenProps> = (props) => {
  const { routes } = props;
  return (
    <div className="user-panel">
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="User" />
        <SidebarContext.Consumer>
          {({ open }) => {
            return (
              <main
                className={clsx("content-area user-panel__content", {
                  "sidebar-open": open,
                })}
              >
                <AppRouting routes={routes} />
              </main>
            );
          }}
        </SidebarContext.Consumer>
        <div>User Panel</div>
      </SidebarContextProvider>
    </div>
  );
};

export default UserPanelScreen;
