import { createContext, useState } from "react";

export interface SidebarContextProviderProps {}

export interface ISidebarContext {
  open: boolean;
  toggleSidebarOpen: (openValue?: boolean) => void;
  openMobileDrawer: boolean;
  toggleMobileSidebar: (openValue?: boolean) => void;
}

export const SidebarContext = createContext<ISidebarContext>({
  open: true,
  openMobileDrawer: false,
  toggleSidebarOpen: (openValue?: boolean) => {},
  toggleMobileSidebar: (openValue?: boolean) => {},
});

const SidebarContextProvider: React.FC<SidebarContextProviderProps> = (
  props
) => {
  const [open, setOpen] = useState(true);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const toggleSidebarOpen = (openValue?: boolean) => {
    if (openValue !== undefined) {
      setOpen(openValue);
    } else {
      setOpen(!open);
    }
  };

  const toggleMobileSidebar = (openValue?: boolean) => {
    if (openValue !== undefined) {
      setOpenMobileDrawer(openValue);
    } else {
      setOpenMobileDrawer(!openMobileDrawer);
    }
  };

  return (
    <SidebarContext.Provider
      value={{ open, toggleSidebarOpen, openMobileDrawer, toggleMobileSidebar }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
