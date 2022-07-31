import React, { useState } from "react";
import { Avatar, Dropdown, Spinner } from "flowbite-react";
import { IoIosArrowBack, IoIosCall, IoMdSend } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import emojiArr from "./emoji";
import { Types } from "mongoose";

interface Props {
  user?: {
    _id: Types.ObjectId | string;
    fullname: string;
    email: string;
    createdAt: Date;
    inbox: { _id: string; mesg: { message: string; postedAt: Date }[] }[];
  };
  inboxToggle: boolean;
  setInboxToggle: React.Dispatch<React.SetStateAction<boolean>>;
  getId: string;
  allMessage: { self: boolean; message: string }[];
  allUsers: any[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.SyntheticEvent) => void;
  loaded: boolean;
  messageSent: boolean;
}

const Inbox: React.FC<Props> = ({
  inboxToggle,
  setInboxToggle,
  getId,
  allMessage,
  allUsers,
  message,
  setMessage,
  sendMessage,
  loaded,
  messageSent,
}) => {
  const [hideEmoji, setHideEmoji] = useState<boolean>(true);

  const onChange = (e: React.SyntheticEvent): void => {
    const { value } = e.target as HTMLButtonElement;
    setMessage(value);
  };

  return (
    <div
      className={`${
        inboxToggle ? "flex" : "hidden"
      } h-full md:col-span-4 col-span-full md:flex flex-col justify-between drop-shadow-lg rounded-lg shadow-lg shadow-slate-400`}
    >
      <div className="w-full basis-20 flex justify-between items-center rounded-tl-lg px-6 shadow-lg">
        <IoIosArrowBack
          size={25}
          className="text-slate-700 cursor-pointer"
          onClick={(): void => setInboxToggle(false)}
        />
        <div className="basis-3/4">
          <Avatar
            img={
              allUsers?.find((element: any) => element._id === getId)?.imgUrl &&
              `data:image/svg+xml;base64,${
                allUsers?.find((element: any) => element._id === getId)?.imgUrl
              }`
            }
            rounded={true}
            status="online"
            statusPosition="bottom-right"
          >
            <div className="space-y-1 font-medium">
              <div className="truncate">
                {allUsers?.map(
                  (element: any) => element._id === getId && element.fullname
                )}
              </div>
              <div className="text-sm text-gray-500 truncate">Active Now</div>
            </div>
          </Avatar>
        </div>
        <IoIosCall size={25} className="text-slate-700 mx-3" />
        <div className="flex items-center justify-center">
          <BiDotsVerticalRounded
            size={25}
            className="text-slate-700 absolute -z-10 pointer-events-none"
          />
          <div className="dropdown dropdown-end text-white">
            <label
              tabIndex={0}
              className="btn bg-transparent outline-none border-0 hover:bg-transparent"
            ></label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow rounded-box w-52 bg-white"
            >
              <Dropdown.Item>Delete Conversation</Dropdown.Item>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full basis-3/4 flex flex-col-reverse px-6 overflow-scroll overflow-x-hidden">
        {loaded ? (
          allMessage?.map((element: any, index: number) => (
            <div className="w-full flex flex-col" key={index}>
              <div
                className={`items-end mt-3 ${
                  !element.self ? "flex" : "hidden"
                }`}
              >
                <div className="mr-2">
                  <Avatar
                    img={
                      allUsers?.find((element: any) => element._id === getId)
                        ?.imgUrl &&
                      `data:image/svg+xml;base64,${
                        allUsers?.find((element: any) => element._id === getId)
                          ?.imgUrl
                      }`
                    }
                    rounded={true}
                    size="xs"
                  ></Avatar>
                </div>
                <div className="min-h-fit md:max-w-[45%] max-w-[65%] border bg-slate-50 py-[14px] px-[18px] rounded-3xl rounded-bl-none md:text-sm text-xs break-words">
                  {element.message}
                </div>
              </div>
              <div
                className={`${
                  element.self ? "block" : "hidden"
                } min-h-fit md:max-w-[45%] max-w-[65%] mt-3 bg-[#1a2238] text-white py-[14px] px-[18px] rounded-3xl rounded-br-none md:text-sm text-xs self-end break-words block`}
              >
                {element.message}
              </div>
            </div>
          ))
        ) : (
          <Spinner color="pink" aria-label="Pink spinner example" size={"xl"} />
        )}
      </div>
      <div className="w-full basis-24 flex items-center justify-center px-6">
        <div className="w-full h-12 flex items-center justify-between px-4 rounded-full border border-slate-400">
          <div
            className={`absolute max-h-72 overflow-scroll overflow-x-hidden bottom-20 ${
              hideEmoji ? "hidden" : "grid"
            } grid-rows-auto grid-cols-6 p-1 rounded-2xl rounded-bl-none bg-slate-50 list-none`}
          >
            {emojiArr.map((element, index) => (
              <li
                className="text-3xl cursor-pointer"
                key={index}
                onClick={(): void => setMessage(message.concat(element))}
              >
                {element}
              </li>
            ))}
          </div>

          <BsEmojiHeartEyesFill
            size={28}
            className="text-slate-500 cursor-pointer"
            onClick={(): void => setHideEmoji(!hideEmoji)}
          />

          <textarea
            placeholder="Message"
            value={message}
            className="w-full h-full border-0 bg-inherit focus:border-0 focus:outline-none mx-3 resize-none mt-1"
            onChange={onChange}
          ></textarea>

          <IoMdSend
            size={28}
            className="cursor-pointer text-[#1a2238]"
            onClick={(e) => messageSent && sendMessage(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default Inbox;
