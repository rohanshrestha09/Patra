import { Types } from "mongoose";
import { createContext } from "react";

interface context {
  user: {
    _id: Types.ObjectId | string;
    fullname: string;
    email: string;
    createdAt: Date;
  };
  setUserLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userLogout: () => void;
}

const userContext = createContext<context | null>(null);

export default userContext;
