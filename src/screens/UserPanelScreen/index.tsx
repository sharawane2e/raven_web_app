import clsx from "clsx";
import { useSelector } from "react-redux";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import SidebarContextProvider from "../../contexts/SidebarContext";
import { RootState } from "../../redux/store";
import IRoute from "../../types/IRoute";

export interface UserPanelScreenProps {
  routes: IRoute[];
}

const UserPanelScreen: React.FC<UserPanelScreenProps> = (props) => {
  const { open } = useSelector((state: RootState) => state.sidebar);
  const { routes } = props;
  return (
    <div className="user-panel">
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="User" />
        <main
          className={clsx("content-area user-panel__content", {
            "sidebar-open": open,
          })}
        >
          <AppRouting routes={routes} />
        </main>

        {/* <div>User Panel</div> */}
      </SidebarContextProvider>
    </div>
  );
};

export default UserPanelScreen;
