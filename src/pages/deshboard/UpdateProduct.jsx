import { useForm } from "react-hook-form";
import imageUpload from "../../utility/imageUpload";
import useShop from "../../hooks/useShop";
import calculateSellingPrice from "../../utility/calculateSellingPrice";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()
  const { user } = useAuth();
  const { id } = useParams();
  // console.log(id);
  const { data: singleData } = useQuery({
    queryKey: ["single product data "],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${user.email}?id=${id}`);
      return res.data;
    },
  });
// const [singleData, setSingleData] = useState();
// useEffect(() => {
//      axiosSecure.get(`/products/${user.email}?id=${id}`)
//      .then(response =>{
//         setSingleData(response.data)
//      })
// //       return res.data;
// }, [axiosSecure, id, user.email]);

//   console.log(singleData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data: shopInfo,refetch} = useShop();
  //   console.log(data);

  const onSubmit = async (data) => {
    const {
      name,
      productImage,
      quantity,
      location,
      productCost,
      profitMargin,
      discount,
    } = data;
    // console.log(productImage[0]);
    console.log(productImage.length >= 0);
    let productImgUrl
    if (!productImage.length >= 0) {
        productImgUrl = singleData?.productImage 
    }else{

        productImgUrl = await imageUpload(productImage[0]);
    }
    console.log(productImgUrl);
    // console.log(Object.keys(data).join(','));\
    const sellingPrice = calculateSellingPrice(
      parseFloat(productCost),
      7.5,
      parseFloat(profitMargin)
    );

    const product = {
      name,
      productImage: productImgUrl,
      quantity: parseInt(quantity),
      location,
      productCost,
      profitMargin,
      discount,
      shopId: shopInfo?.shopId || "",
      shopName: shopInfo?.shopName || "",
      email: shopInfo?.email || "",
      sellingPrice,
    };
    // console.log(product);

    axiosSecure.put(`/products/${id}`, product).then((res) => {
      const responseData = res.data;
      console.log(responseData);
      if (responseData.modifiedCount > 0) {
        toast.success("Product Update successfully");
        refetch()
        navigate('/dashboard/manage-product')
        
      } else {
        toast.error("something went wrong");
      }
    });
  };
  return (
    <div className="min-h-[0%]">
      <div className="">
        <h1 className="text-5xl font-bold text-center text-primary">
          Update Product
        </h1>
        <form className="card-body " onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center gap-x-10 ">
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Product name"
                className="input input-bordered"
                {...register("name", { required: true })}
                defaultValue={singleData?.name}
              />
              
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                {...register("productImage")}
                // defaultValue={singleData?.productImage}
                
              />
              
            </div>
          </div>

          <div className="flex justify-between items-center gap-x-10">
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <input
                type="number"
                placeholder="Quantity"
                className="input input-bordered"
                {...register("quantity", { required: true, min: 1 })}
                defaultValue={singleData?.quantity
                }

              />
              
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Product Location</span>
              </label>
              <input
                type="text"
                placeholder="Product Location"
                className="input input-bordered"
                {...register("location", { required: true })}
                defaultValue={singleData?.location
                }

              />
              
            </div>
          </div>

          <div className="flex justify-between items-center gap-x-10">
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Product cost</span>
              </label>
              <input
                type="number"
                placeholder="product cost"
                className="input input-bordered"
                {...register("productCost", { required: true, min: 1 })}
                defaultValue={singleData?.productCost
                }

              />
              
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Profit Margin </span>
              </label>
              <input
                type="number"
                placeholder="Profit Margin"
                className="input input-bordered"
                {...register("profitMargin", { required: true })}
                defaultValue={singleData?.profitMargin}

              />
             
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Discount </span>
              </label>
              <input
                type="number"
                placeholder="Discount"
                className="input input-bordered"
                {...register("discount", { required: true })}
                defaultValue={singleData?.discount
                }

              />
              
            </div>
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" type="submit">
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
