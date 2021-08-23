import { createContext, useState } from "react";

export interface UserDetailsContextProviderProps {}

export interface IUserDetailsContext {
  selectedUser: object | null;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  setSelectedUser: (user: any) => void;
}

export const UserDetailsContext = createContext<IUserDetailsContext>({
  selectedUserId: "",
  selectedUser: null,
  setSelectedUserId: (id: string) => {},
  setSelectedUser: (user: any) => {},
});

const UserDetailsContextProvider: React.FC<UserDetailsContextProviderProps> = (
  props
) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <UserDetailsContext.Provider
      value={{
        selectedUser,
        setSelectedUserId,
        selectedUserId,
        setSelectedUser,
      }}
    >
      {props.children}
    </UserDetailsContext.Provider>
  );
};

export default UserDetailsContextProvider;
