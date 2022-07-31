import { useState, useEffect } from "react";
import axios from "../axios";
import UserContext from "./userContext";
import { Types } from "mongoose";
import { useMutation } from "@tanstack/react-query";

const UserAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<{
    _id: Types.ObjectId | string;
    fullname: string;
    email: string;
    createdAt: Date;
  }>({
    _id: "",
    fullname: "",
    email: "",
    createdAt: new Date(),
  });

  const [userLogin, setUserLogin] = useState<boolean>(false);

  const handleAuth = useMutation(() => axios.get("/api/protected"), {
    onSuccess: (res) => {
      const { _id, fullname, email, createdAt } = res.data;
      setUser({
        _id,
        fullname,
        email,
        createdAt,
      });
    },
    onError: () => localStorage.removeItem("token"),
  });

  const userLogout = (): void => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  useEffect(() => {
    handleAuth.mutate();
    // eslint-disable-next-line
  }, [token, userLogin]);

  return (
    <UserContext.Provider value={{ user, setUserLogin, userLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserAuth;
