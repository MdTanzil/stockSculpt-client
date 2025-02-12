import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";

import { Button } from "@/components/ui/button";
const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const handleClick = () => {
    signInWithGoogle()
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        console.log(result);

        const userInfo = {
          email: result.user?.email,
          name: result.user?.displayName,
          avatar: result.user?.photoURL,
          provider: "google",
        };
        axiosPublic.post("/users", userInfo).then((res) => {
          console.log(res.data);
        });
        toast.success(result.user?.displayName + " Log in successfully");
        navigate(location?.state ? location.state : "/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        toast.error(errorCode, errorMessage);
      });
  };
  return (
    <Button variant="outline" className="btn w-full" onClick={handleClick}>
      <FcGoogle className="text-2xl" />
      Sign in with Google
    </Button>
  );
};

export default SocialLogin;
