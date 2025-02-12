import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin";
import useAuth from "../../hooks/useAuth";
const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, setUser } = useAuth();
  const onSubmit = (data) => {
    const { email, password } = data;
    signIn(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        setUser(user);

        toast.success(user?.email + " Log in success");
        navigate(location?.state ? location.state : "/");

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
        toast.error("Email or password incorrect ! ");
      });
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="container mx-auto max-w-md ">
        <Card className="shadow-2xl rounded-2xl py-8">
          <CardHeader>
            <CardTitle className="text-center text-primary font-semibold text-4xl tracking-wide">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email ">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500 font-light text-sm px-1 mt-1">
                    email is required
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="password"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <p className="text-red-500 font-light text-sm px-1 mt-1">
                    Password is required
                  </p>
                )}
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-center  items-center">
              <div>
                <label className="label mb-2">
                  Do not have account?{" "}
                  <Link to={"/register"} className="link link-primary">
                    {" "}
                    Register{" "}
                  </Link>
                </label>
                <SocialLogin></SocialLogin>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
