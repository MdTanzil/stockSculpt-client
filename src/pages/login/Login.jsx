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

        //TODO : make a request to backend for token
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
    <div>
      <div className="container mx-auto min-h-screen max-w-md  mt-11">
        <div>
          <h1 className="text-5xl font-bold text-center text-primary">Login</h1>
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="  justify-between gap-x-5">
              <div className="form-control flex-1 ">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-red-500">email is required</span>
                )}
              </div>
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                  {...register("password", { required: true })}
                />
              </div>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
          <div className="flex justify-center ">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
