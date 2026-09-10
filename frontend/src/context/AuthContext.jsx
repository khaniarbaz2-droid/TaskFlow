import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getSavedUser() {
  const savedUser = localStorage.getItem("taskflow_user");

  if (savedUser) {
    return JSON.parse(savedUser);
  }

  return {
    name: "Arbaz",
    email: "arbaz@example.com",
    role: "Manager",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const loginAs = (role) => {
    const users = {
      Admin: {
        name: "Admin User",
        email: "admin@example.com",
        role: "Admin",
      },

      Manager: {
        name: "Arbaz",
        email: "arbaz@example.com",
        role: "Manager",
      },

      "Team Member": {
        name: "Rahul",
        email: "rahul@example.com",
        role: "Team Member",
      },
    };

    const selectedUser = users[role];

    setUser(selectedUser);

    localStorage.setItem(
      "taskflow_user",
      JSON.stringify(selectedUser)
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taskflow_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}