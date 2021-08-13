import Sidebar from "../../components/Sidebar";
import SidebarContextProvider from "../../contexts/SidebarContext";

export interface AdminPanelScreenProps {}

const AdminPanelScreen: React.FC<AdminPanelScreenProps> = (props) => {
  return (
    <div>
      <SidebarContextProvider>
        <Sidebar />
      </SidebarContextProvider>
    </div>
  );
};

export default AdminPanelScreen;
