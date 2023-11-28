import { useForm } from "react-hook-form";
import imageUpload from "../../utility/imageUpload";
import useShop from "../../hooks/useShop";
import calculateSellingPrice from "../../utility/calculateSellingPrice";
import useAxiosSecure from './../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const axiosSecure = useAxiosSecure()
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
      const {data:shopInfo} = useShop()
    //   console.log(data);
    
      const navigate= useNavigate()
      const onSubmit= async(data) => {
        const {name,productImage,quantity,location,productCost,profitMargin,discount} = data
        // console.log(productImage[0]);
        const productImgUrl = await imageUpload(productImage[0])
        // console.log(Object.keys(data).join(','));\
        const sellingPrice = calculateSellingPrice(parseFloat(productCost),7.5,parseFloat(profitMargin))
        
        const product ={
            name ,
            productImage : productImgUrl,
            quantity: parseInt(quantity),
            location,
            productCost,
            profitMargin,
            discount,
            shopId : shopInfo?.shopId || '',
            shopName : shopInfo?.shopName || '',
            email :  shopInfo?.email || '',
            sellingPrice,
            sellCount : 0,
        }

        axiosSecure.post('/products',product)
        .then(res =>{
            const responseData = res.data
            if(responseData.insertedId){
                toast.success('Product added successfully')
                navigate('/dashboard/manage-product')
            }else{
                toast.error('something went wrong')

            }

        })

      }
    return (
        <div className="min-h-[0%]">
           <div className="">
          <h1 className="text-5xl font-bold text-center text-primary">Add Product</h1>
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
              />
              {errors.name && (
                <span className="text-red-500"> name is required</span>
              )}
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                {...register("productImage", { required: true })}
              />
              {errors.productImage && (
                <span className="text-red-500">Image is required</span>
              )}
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
                {...register("quantity", { required: true ,min: 1})}
              />
              {errors.quantity && (
                <span className="text-red-500">quantity is required</span>
              )}
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
              />
              {errors.quantity && (
                <span className="text-red-500">location is required</span>
              )}
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
                {...register("productCost", { required: true ,min: 1})}
              />
              {errors.productCost && (
                <span className="text-red-500">quantity is required</span>
              )}
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
              />
              {errors.productCost && (
                <span className="text-red-500">Profit Margin is required</span>
              )}
            </div>
            <div className="form-control flex-1 ">
              <label className="label">
                <span className="label-text">Discount  </span>
              </label>
              <input
                type="number"
                placeholder="Discount"
                className="input input-bordered"
                {...register("discount", { required: true })}
              />
              {errors.productCost && (
                <span className="text-red-500">discount is required</span>
              )}
            </div>

          </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">
                ADD
              </button>
            </div>
          </form>
          
        </div>
        </div>
    );
};

export default AddProduct;