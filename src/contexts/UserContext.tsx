import { useState } from "react";
import { createContext } from "react";

const defaultValues = {
  selectedUser: "",
  setSelectedUser: (selectedUser: string) => {},
};

export const UserContext = createContext(defaultValues);

export interface UserContextProviderProps {}

const UserContextProvider: React.FC<UserContextProviderProps> = (props) => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
