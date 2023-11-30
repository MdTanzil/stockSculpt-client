import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ManageProduct = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate()
  const { data: products ,refetch} = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${user.email}`);
      return res.data;
    },
  });
  // console.log(products);
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/products/${id}`);
        if (res.data.deletedCount > 0) {
          refetch()
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          
        }
      }
    });
  };

  const handleCheckOut = async(id,sellingPrice,name)=>{
    let chekoutData = {
      productId : id,
      email: user.email,
      order: false,
      name : name,
      sellingPrice : sellingPrice
    }
    axiosSecure.post(`/sale`,chekoutData)
    .then(res=>{
      console.log(res);
      if(res.data.insertedId){
        toast.success(`successfully added on checkout`)
        navigate('/dashboard/checkout')
      }
    })

  }
  return (
    <div>
      <h2 className="text-center text-4xl text-primary">Manage Your Product</h2>
      <div className="mt-5">
        <div className="overflow-x-auto ">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Img</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Profit Margin</th>
                <th>Selling Price</th>
                <th>Action</th>
                <th>check out</th>
              </tr>
            </thead>
            <tbody className="">
              {/* row 1 */}
              {products?.map((product, idx) => (
                <tr key={product?._id} className="text-center text-lg ">
                  <td>{idx + 1}</td>
                  <td>
                    <div className="flex items-center justify-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={product?.productImage}
                            alt={product?.name}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{product?.name}</td>
                  <td>{product?.quantity}</td>
                  <td>{product?.profitMargin}</td>
                  <td className="">{product?.sellingPrice}</td>
                  <td className="flex gap-1 justify-center items-center ">
                    <Link to={`/dashboard/update-product/${product?._id}`}>
                      <button className="btn btn-xs bg-primary hover:bg-primary border-none">
                        <FaEdit className="text-white text-md" />
                      </button>
                    </Link>
                    <div className=" m-0 divider-horizontal">|</div>
                    <button
                      className="btn btn-xs border-none bg-red-500"
                      onClick={() => handleDelete(product?._id)}
                    >
                      {" "}
                      <FaTrash className="text-white text-md"></FaTrash>
                    </button>
                  </td>
                  <td> <button  className="btn btn-xs btn-primary text-white" onClick={()=> handleCheckOut(product?._id,product?.sellingPrice,product?.name)}>check out</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
