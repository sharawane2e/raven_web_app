import clsx from "clsx";
import { useState } from "react";
import AppRouting from "../../AppRouting";
import Appbar from "../../components/Appbar";
import Sidebar from "../../components/Sidebar";
import ChartSidebarContent from "../../components/Sidebar/sidebar-content/ChartSidebarContent";
import FilterContextProvider from "../../contexts/FilterContext";
import SidebarContextProvider, {
  SidebarContext,
} from "../../contexts/SidebarContext";
import IRoute from "../../types/IRoute";

interface ChartScreenProps {
  routes: IRoute[];
}

const ChartScreen: React.FC<ChartScreenProps> = (props) => {
  const { routes } = props;

  return (
    <div className="chart-screen">
      <SidebarContextProvider>
        <Appbar />
        <Sidebar title="Admin" content={ChartSidebarContent} />
        <FilterContextProvider>
          <SidebarContext.Consumer>
            {({ open }) => {
              return (
                <main
                  className={clsx("content-area admin-panel__content", {
                    "sidebar-open": open,
                  })}
                >
                  <AppRouting routes={routes} />
                </main>
              );
            }}
          </SidebarContext.Consumer>
        </FilterContextProvider>
      </SidebarContextProvider>
    </div>
  );
};

export default ChartScreen;
