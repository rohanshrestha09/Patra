import React, { useContext, useEffect, useRef, useState } from "react";
import Inbox from "../components/Inbox";
import Preview from "../components/Preview";
import userContext from "../utils/userContext";
import axios from "../axios";
import { io } from "socket.io-client";

const Messenger: React.FC = () => {
  const socket = useRef() as any;

  const { user, userLogout } = useContext<any>(userContext);
  const [inboxToggle, setInboxToggle] = useState<boolean>(false);
  const [getId, setGetId] = useState<string>("");
  const [allMessage, setAllMessage] = useState<
    { self: boolean; message: string }[]
  >([]);

  const [loaded, setLoaded] = useState<boolean>(false);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [tempUsersData, setTempUsersData] = useState<any[]>([]);

  const [message, setMessage] = useState<string>("");

  const [messageSent, setMessageSent] = useState<boolean>(true);

  const sendMessage = async (event: React.SyntheticEvent): Promise<any> => {
    event.preventDefault();
    if (message) {
      setMessageSent(false);
      socket.current &&
        socket.current.emit("send-message", {
          from: user._id,
          to: getId,
          msg: message,
        });

      await axios.post("/api/addmsg", { from: user._id, to: getId, message });

      setAllMessage((el: any) => [{ self: true, message }, ...el]);
      setMessage("");
      setMessageSent(true);
    }
  };

  useEffect(() => {
    axios.get(`/api/users/${user._id}`).then(({ data }) => {
      setAllUsers([...data]);
      setTempUsersData([...data]);
    });
  }, [user, getId]);

  useEffect(() => {
    setLoaded(false);
    axios
      .post("/api/getmsg", { from: user._id, to: getId })
      .then(({ data }) => setAllMessage(data))
      .then(() => (socket.current = io("/")))
      .then(() => setLoaded(true));

    // eslint-disable-next-line
  }, [getId]);

  useEffect(() => {
    socket.current &&
      socket.current.on(
        "receive-message",
        ({ from, to, msg }: { from: string; to: string; msg: string }) => {
          if (from === getId && to === user._id)
            setAllMessage((el: any) => [{ self: false, message: msg }, ...el]);
        }
      );
    // eslint-disable-next-line
  }, [socket.current]);

  return (
    <div className="min-h-screen max-w-screen font-sans flex items-center justify-center bg-slate-100 text-black">
      <div className="md:w-[63rem] w-full md:h-[94vh] h-screen grid grid-rows-1 grid-cols-6 md:rounded-xl bg-white shadow-lg shadow-slate-400">
        <Preview
          user={user}
          userLogout={userLogout}
          inboxToggle={inboxToggle}
          setInboxToggle={setInboxToggle}
          setGetId={setGetId}
          allUsers={allUsers}
          tempUsersdata={tempUsersData}
          setTempUsersData={setTempUsersData}
        />

        <Inbox
          inboxToggle={inboxToggle}
          setInboxToggle={setInboxToggle}
          allUsers={allUsers}
          getId={getId}
          allMessage={allMessage}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          loaded={loaded}
          messageSent={messageSent}
        />
      </div>
    </div>
  );
};

export default Messenger;
