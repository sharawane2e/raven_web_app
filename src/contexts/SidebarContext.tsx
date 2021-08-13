import { createContext, useState } from "react";

export interface SidebarContextProviderProps {}

export interface ISidebarContext {
  open: boolean;
  toggleSidebarOpen: (openValue: boolean) => void;
}

export const SidebarContext = createContext<ISidebarContext>({
  open: true,
  toggleSidebarOpen: (openValue?: boolean) => {},
});

const SidebarContextProvider: React.FC<SidebarContextProviderProps> = (
  props
) => {
  const [open, setOpen] = useState(true);

  const toggleSidebarOpen = (openValue?: boolean) => {
    if (openValue !== undefined) {
      setOpen(openValue);
    } else {
      setOpen(!open);
    }
  };

  return (
    <SidebarContext.Provider value={{ open, toggleSidebarOpen }}>
      {props.children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
