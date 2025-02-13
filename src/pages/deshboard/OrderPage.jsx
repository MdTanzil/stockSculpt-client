import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const OrderPage = () => {
  const axiosSecure = useAxiosSecure();
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();
  // const { data: shopInfo } = useShop();
  //   console.log(data);

  const navigate = useNavigate();

  return (
    <div className="min-h-[0%]">
      <p className="text-center font-bold text-4xl text-primary">
        Manage Your Order
      </p>
    </div>
  );
};

export default OrderPage;
