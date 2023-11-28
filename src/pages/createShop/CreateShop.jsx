import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import imageUpload from "../../utility/imageUpload";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useShop from "../../hooks/useShop";

const CreateShop = () => {
  const navigate = useNavigate();
  const shop = useShop()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(shop);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const onSubmit = async (data) => {
    // data.preventDefault();
    const imageUrl = await imageUpload(data?.shopLogo[0]);
    const shop = {
      shopName: data.shopName,
      shopOwnerEmail: user?.email || "",
      shopOwnerName: user?.displayName || "",
      shopLogo: imageUrl || "",
      shopLocation: data.shopLocation,
      limit: 3,
      role:"shopAdmin"
    };


    const res = await axiosSecure.post(`/shops`, shop);
    console.log(res.data);
    if (res.data.updateUserResult.acknowledged) {

        toast.success('Shop create successfully')
        navigate('/dashboard')
    }
  };
  console.log(user);
  return (
    <div className="container mx-auto mt-10">
      <div>
        <h1 className="text-5xl font-bold text-center text-primary">
          Create Shop
        </h1>
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center gap-x-10">
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Shop name</span>
              </label>
              <input
                type="text"
                placeholder="Shop name"
                className="input input-bordered"
                {...register("shopName", { required: true })}
              />
              {errors.shopName && (
                <span className="text-red-500">shop name is required</span>
              )}
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Shop Logo</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                {...register("shopLogo", { required: true })}
              />
              {errors.shopLogo && (
                <span className="text-red-500">shopLogo is required</span>
              )}
            </div>
          </div>
          <div className="form-control flex-1 ">
            <label className="label">
              <span className="label-text">Shop info</span>
            </label>
            <textarea
              type="file"
              className="textarea border-black  w-3/4"
              placeholder="Write about your shop"
              rows={5}
              {...register("shopInfo", { required: true })}
            />
            {errors.shopInfo && (
              <span className="text-red-500">shopInfo is required</span>
            )}
          </div>

          {/* shop  owner  info section  */}
          <div className="flex justify-between items-center gap-x-10">
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Shop-Owner Email</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register("shopOwnerEmail")}
                disabled
                value={user?.email}
              />
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Shop-Owner Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                {...register("shopOwnerName")}
                disabled
                value={user?.displayName}
              />
            </div>
          </div>
          <div className="form-control flex-1 ">
            <label className="label">
              <span className="label-text">Shop location</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              {...register("shopLocation", { required: true })}
            />
            {errors.shopLocation && (
              <span className="text-red-500">
                shopLocation name is required
              </span>
            )}
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" type="submit">
              Create shop
            </button>
          </div>
        </form>
        <div className="flex justify-center "></div>
      </div>
    </div>
  );
};

export default CreateShop;
