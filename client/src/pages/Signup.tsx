import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import { FaFacebook } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";
import axios from "../axios";
import userContext from "../utils/userContext";
import { useMutation } from "@tanstack/react-query";

const Signup: React.FC = () => {
  const { setUserLogin } = useContext<any>(userContext);

  const navigate = useNavigate();

  const [hideAlert, setHideAlert] = useState<boolean>(false);

  const [isLoginToggled, setIsLoginToggled] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  interface signup {
    fullname: string;
    email: string;
    password: string;
    confirmpassword: string;
  }

  interface login {
    email: string;
    password: string;
  }

  const [signupInfo, setSignupInfo] = useState<signup>({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [loginInfo, setLoginInfo] = useState<login>({
    email: "",
    password: "",
  });

  const redirection = (data: string) => {
    localStorage.setItem("token", data);
    setUserLogin && setUserLogin(true);
    navigate("/");
  };

  const handleLogin = useMutation(
    (data: login) => axios.post("/api/login", data),
    {
      onSuccess: (res) => {
        redirection(res.data);
      },
      onError: (err: any) => {
        setHideAlert(true);
        setErrorMessage(err.response.data);
      },
    }
  );

  const handleSignup = useMutation(
    (data: signup) => axios.post("/api/signup", data),
    {
      onSuccess: (res) => {
        redirection(res.data);
      },
      onError: (err: any) => {
        setHideAlert(true);
        setErrorMessage(err.response.data);
      },
    }
  );

  const onChange = (event: React.SyntheticEvent): void => {
    const { name, value } = event.target as HTMLButtonElement;
    isLoginToggled
      ? setLoginInfo({ ...loginInfo, [name]: value })
      : setSignupInfo({ ...signupInfo, [name]: value });
  };

  const formSubmission = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    isLoginToggled
      ? handleLogin.mutate(loginInfo)
      : handleSignup.mutate(signupInfo);
  };

  if (hideAlert)
    setTimeout(() => {
      setHideAlert(false);
    }, 3000);

  return (
    <div className="min-h-screen w-screen flex font-sans items-center justify-center text-black bg-white">
      <div
        className={`w-11/12 md:w-[60rem] ${
          hideAlert
            ? "opacity-1 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } absolute top-0 z-10 transition-all`}
      >
        <Alert
          color="failure"
          icon={HiInformationCircle}
          onDismiss={() => setHideAlert(false)}
        >
          <span className="font-medium">{errorMessage}</span>
        </Alert>
      </div>
      <div className="md:w-[60rem] w-full md:h-[35rem] h-screen flex flex-col md:flex-row justify-between rounded-lg drop-shadow-lg shadow-lg">
        <div className="md:w-5/12 w-full md:h-full h-46 md:flex items-center justify-center bg-[#1a2238] md:rounded-l-lg md:rounded-tr-none">
          <div className="md:h-40 h-32 flex flex-col justify-between items-center">
            <p className="font-dev text-[#FF6A3D] md:text-[14rem] text-9xl md:leading-3">
              kq
            </p>
            <p className="md:block hidden text-lg text-white text-center">
              A messaging app initiated from Nepal.
            </p>
          </div>
        </div>

        <div className="h-full md:w-[59.33%] w-full flex items-center justify-center bg-[white] md:rounded-r-lg md:rounded-bl-none">
          <form
            className="w-5/6 h-5/6 flex flex-col justify-between items-center"
            onSubmit={formSubmission}
          >
            <div className="self-start flex justify-between text-sm font-semibold">
              <p
                className={`${
                  isLoginToggled ? "text-gray-300" : "text-[#1A2238]"
                } cursor-pointer`}
                onClick={(): void => setIsLoginToggled(false)}
              >
                Sign up
              </p>
              <p className="px-1 text-gray-300">/</p>
              <p
                className={`${
                  isLoginToggled ? "text-[#1A2238]" : "text-gray-300"
                } cursor-pointer`}
                onClick={(): void => setIsLoginToggled(true)}
              >
                Login
              </p>
            </div>

            <div className="w-full h-2/3 flex justify-between">
              <div className="w-2/5 h-full flex flex-col justify-between">
                <p
                  className={`text-[#1A2238] font-semibold md:text-base text-sm ${
                    isLoginToggled && "absolute"
                  }`}
                >
                  {isLoginToggled ? "LogIn" : "Signup"}
                </p>
                <div
                  className={`w-full ${
                    isLoginToggled && "h-full flex flex-col justify-center"
                  }`}
                >
                  {isLoginToggled ? (
                    <LoginForm onChange={onChange} loginInfo={loginInfo} />
                  ) : (
                    <SignupForm onChange={onChange} signupInfo={signupInfo} />
                  )}
                </div>
              </div>

              <div className="divider divider-horizontal text-black">OR</div>

              <div className="w-2/5 h-full flex flex-col">
                <p className="text-[#1A2238] font-semibold absolute md:text-base text-sm">
                  Or do you prefer to...
                </p>
                <div className="flex flex-col h-full justify-center">
                  <div className="w-full h-10 bg-[#1A2238] my-2 rounded-lg text-white flex items-center justify-between md:px-4 px-1 text-sm drop-shadow-lg cursor-pointer">
                    <p>Login with</p>
                    <FaFacebook size={24} />
                  </div>
                </div>
              </div>
            </div>

            <input
              type="submit"
              value="Let's Go"
              className="rounded-md border border-[#1A2238] px-5 py-2 hover:bg-[#1A2238] hover:text-white trainsition-all duration-300 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
