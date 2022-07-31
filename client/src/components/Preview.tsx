import axios from "axios";
import { Avatar, Button, Dropdown, Modal } from "flowbite-react";
import { Types } from "mongoose";
import React, { useEffect, useRef, useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { Buffer } from "buffer";
import AvatarModal from "./AvatarModal";

interface Props {
  user: {
    _id: Types.ObjectId | string;
    fullname: string;
    email: string;
    createdAt: Date;
  };
  userLogout?: () => void;
  inboxToggle: boolean;
  setInboxToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setGetId: React.Dispatch<React.SetStateAction<string>>;
  allUsers: any[];
  tempUsersdata: any[];
  setTempUsersData: React.Dispatch<React.SetStateAction<any>>;
}

const Preview: React.FC<Props> = ({
  user,
  userLogout,
  inboxToggle,
  setInboxToggle,
  setGetId,
  allUsers,
  tempUsersdata,
  setTempUsersData,
}) => {
  const searchRef = useRef() as any;

  const [avatarModalToggle, setAvatarModalToggle] = useState<boolean>(false);

  const [avatarImage, setAvatarImage] = useState<string[]>([]);

  const onChange = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLButtonElement;
    if (value === "") setTempUsersData([...allUsers]);
    else
      setTempUsersData(
        allUsers.filter((element: any) =>
          element.fullname.toLowerCase().includes(value)
        )
      );
  };

  const onClick = (): void => setAvatarModalToggle(true);
  const onClose = (): void => setAvatarModalToggle(false);

  const [avatarSelectIndex, setAvatarSelectIndex] = useState<number>(NaN);

  const [loading, setLoading] = useState<boolean>(true);

  const [modalToggleDeleteUser, setModalToggleDeleteUser] =
    useState<boolean>(false);

  const onClickModalToggle = (): void => setModalToggleDeleteUser(true);
  const onCloseModalToggle = (): void => setModalToggleDeleteUser(false);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const imageData = [];
        for (let i = 0; i < 6; i++) {
          const { data } = await axios.get(
            `https://api.multiavatar.com/4645646/${Math.round(
              Math.random() * 1000
            )}?apikey=nQluaHjWZ83G95`
          );
          const buffer = new Buffer(data);
          imageData.push(buffer.toString("base64"));
        }
        setAvatarImage(imageData);
        setLoading(false);
      } catch (err: any) {
        console.log(err.response.data);
      }
    })();
  }, []);

  const avatarSet = async (): Promise<void> => {
    try {
      await axios.put(`/api/setavatar/${user._id}`, {
        imgUrl: avatarImage[avatarSelectIndex],
      });
    } catch (err: any) {
      console.log(err.response.data);
    }
  };

  const deleteUser = async (): Promise<void> => {
    try {
      await axios.delete(`/api/delete/${user._id}`);
      userLogout && userLogout();
    } catch (err: any) {
      console.log(err.response.massage);
    }
  };

  return (
    <div
      className={`${
        inboxToggle ? "hidden" : "flex"
      } h-full md:col-span-2 col-span-full md:flex flex-col justify-between drop-shadow-lg z-10`}
    >
      <div className="w-full basis-20 flex justify-between items-center rounded-tl-lg px-4 shadow-lg">
        <p className="font-dev text-[#FF6A3D] text-7xl">kq</p>
        <div className="flex items-center justify-end w-full z-10">
          <BiMenuAltRight
            className="absolute -z-10 text-[#ff6a3d] pointer-events-none"
            size={40}
          />
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn bg-transparent outline-none border-0 hover:bg-transparent"
            ></label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow rounded-box w-52 bg-white"
            >
              <Dropdown.Header>
                <span className="block text-sm">{user?.fullname}</span>
                <span className="block truncate text-sm font-medium">
                  {user?.email}
                </span>
              </Dropdown.Header>

              <Dropdown.Item onClick={() => searchRef.current.focus()}>
                New Message
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onClick}>Pick an Avatar</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onClickModalToggle}>
                Delete Account
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={userLogout}>Sign out</Dropdown.Item>
            </ul>
          </div>
        </div>
      </div>

      <AvatarModal
        avatarModalToggle={avatarModalToggle}
        onClose={onClose}
        loading={loading}
        avatarImage={avatarImage}
        avatarSelectIndex={avatarSelectIndex}
        setAvatarSelectIndex={setAvatarSelectIndex}
        avatarSet={avatarSet}
        setAvatarModalToggle={setAvatarModalToggle}
      />

      <React.Fragment>
        <Modal show={modalToggleDeleteUser} onClose={onCloseModalToggle}>
          <Modal.Header>Are you sure?</Modal.Header>
          <Modal.Body>
            <div className="text-black">
              Once performed the action is irreversible.
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                deleteUser();
                setModalToggleDeleteUser(false);
              }}
              color="failure"
            >
              Delete Account
            </Button>
            <Button color="gray" onClick={onCloseModalToggle}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>

      <div className="px-4">
        <input
          type="search"
          placeholder="Search"
          ref={searchRef}
          className="w-full rounded-xl focus:outline-none focus:border-0 border-0"
          onChange={onChange}
        />
      </div>

      <div className="basis-[80%] flex flex-col overflow-scroll overflow-x-hidden px-3">
        {tempUsersdata?.map((element: any, index: number) => (
          <div
            className="w-full flex justify-between items-start px-3 my-1 py-3 cursor-pointer rounded-lg hover:bg-gray-50"
            key={index}
            onClick={(): void => {
              setInboxToggle(true);
              setGetId(element._id);
            }}
          >
            <Avatar
              img={
                element.imgUrl && `data:image/svg+xml;base64,${element.imgUrl}`
              }
              rounded={true}
              status="online"
              statusPosition="bottom-right"
            >
              <div className="space-y-1 font-medium w-40">
                <div className="truncate">{element.fullname}</div>
                <div className="text-sm text-gray-500 truncate">
                  {element.email}
                </div>
              </div>
            </Avatar>
            <div className="text-gray-500 text-xs py-1">
              {element.creation?.slice(0, 7)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preview;
