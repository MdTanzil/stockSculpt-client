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
import imageUpload from "@/utility/imageUpload";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // TODO: when user chose a image  send to imagebb server and update it
  const onSubmit = (data) => {
    let { name, password, photo, email, dateOfBirth } = data;
    email = email.toLowerCase();
    createUser(email, password)
      .then(async () => {
        // Signed up
        // const user = userCredential.user;
        const photoUrl = await imageUpload(photo[0]);
        if (name && photoUrl) {
          updateUserProfile(name, name);
        } else if (name) {
          updateUserProfile(name, "");
        } else if (photoUrl) {
          updateUserProfile("", photoUrl);
        }
        console.log(photoUrl);

        // TOOD: Make a request in backend for
        axiosPublic
          .post("users", {
            name,
            email,
            dateOfBirth,
            avatar: photoUrl,
            password,
          })
          .then((res) => {
            console.log(res.data);
          });
        toast.success("Successfully register  !");
        navigate("/");

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.warn(errorMessage, errorCode);
        console.log(" register error ");
        toast.error(errorCode);

        // ..
      });
  };
  return (
    <div className="container mx-auto min-h-screen max-w-md  my-auto mt-11">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-primary font-semibold text-4xl tracking-wide">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="">
              <Label htmlFor="name">Name</Label>

              <Input
                type="text"
                id="name"
                placeholder="Enter your name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 font-light text-sm px-1 mt-1">
                  Name is required
                </p>
              )}
            </div>

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
              <Label htmlFor="dof">Date of Birth</Label>
              <Input
                id="dof"
                type="date"
                className=""
                name="dateOfBirth"
                {...register("dateOfBirth", { required: true })}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 font-light text-sm px-1 mt-1">
                  DateOfBirth is required
                </p>
              )}
            </div>
            <div className="">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                {...register("photo", { required: true })}
              />
              {errors.photo && (
                <p className="text-red-500 font-light text-sm px-1 mt-1">
                  Profile Picture is required
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

            <div className="form-control mt-2">
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <p className="  text-sm font-light pb-2">
              Already Have a account ?{" "}
              <Link to={"/login"} className="link link-primary">
                {" "}
                Login{" "}
              </Link>
            </p>
            <SocialLogin></SocialLogin>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
