import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import SocialLogin from "../../components/SocialLogin";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic()
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { name, password, photoUrl, email } = data;
    createUser(email, password)
      .then((userCredential) => {
        // Signed up
        // const user = userCredential.user;
        if (name && photoUrl) {
          updateUserProfile(name, name);
        } else if (name) {
          updateUserProfile(name, "");
        } else if (photoUrl) {
          updateUserProfile("", photoUrl);
        }
        axiosPublic.post('/users', {name,email})
        .then(res =>{
            console.log(res.data);
            
    
        })
        toast.success('Successfully register  !');
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
    <div className="container mx-auto min-h-screen max-w-md  mt-11">
      <div>
        <h1 className="text-5xl font-bold text-center text-primary">
          Register now!
        </h1>
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="  justify-between gap-x-5 items-center">
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input input-bordered"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500">name is required</span>
              )}
            </div>
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Photo Url</span>
              </label>
              <input
                type="text"
                placeholder="Photo Url"
                className="input input-bordered"
                {...register("photoUrl", { required: false })}
              />
              {/* {errors.photoUrl && (
                <span className="text-red-500">
                  profile picture is required
                </span>
              )} */}
            </div>
          </div>

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
                {...register("password", {
                  minLength: 6,
                  maxLength: 20,
                  pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                })}
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500">Password must be 6 characters</p>
              )}
              {errors.password?.type === "maxLength" && (
                <p className="text-red-500">
                  Password must be less than 20 characters
                </p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500">
                  Password must have one Uppercase one lower case, one number
                  and one special character.
                </p>
              )}
            </div>
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
          </div>
        </form>
        <div className="flex justify-center ">
          <label className="label">
            <span className="label-text ">
              Already Have a account ?{" "}
              <Link to={"/login"} className="link link-primary">
                {" "}
                Login{" "}
              </Link>
            </span>
          </label>
        </div>
        <div className="divider divider-primary">or</div>
          <div className="mb-5">
          <SocialLogin></SocialLogin>
          </div>
      </div>
    </div>
  );
};

export default Register;
