import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import imageUpload from "../../utility/imageUpload";
const CreateShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const axiosSecure = useAxiosSecure();
  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Creating shop...");

    setLoading(true);
    try {
      // Upload the image

      const imageUrl = await imageUpload(data?.photo[0]);

      // Prepare shop data
      const shop = {
        name: data.name,
        logo: imageUrl || "",
        location: data.address,
      };

      // Send shop creation request
      const res = await axiosSecure.post(`/shop`, shop);
      console.log(res.data);

      // Check for 201 Created status
      if (res.status === 201) {
        toast.success("Shop created successfully");

        navigate("/dashboard");
      } else {
        toast.error("Failed to create shop. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="container mx-auto mt-20 min-h-screen max-w-2xl ">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-primary font-semibold text-4xl tracking-wide">
            Create shop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 min-h-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <Label htmlFor="name">Shop Name</Label>

              <Input
                type="text"
                id="name"
                placeholder="Shop Name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 font-light text-sm px-1 mt-1">
                  Shop Name is required
                </p>
              )}
            </div>

            <div className="">
              <Label htmlFor="picture">Shop Logo</Label>
              <Input
                id="picture"
                type="file"
                {...register("photo", { required: true })}
              />
              {errors.photo && (
                <p className="text-red-500 font-light text-sm px-1 mt-1">
                  Shop Logo is required
                </p>
              )}
            </div>
            <div className="">
              <Label htmlFor="location">Shop Address</Label>

              <Textarea
                type="text"
                id="location"
                placeholder="Shop Address"
                {...register("address", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 font-light text-sm px-1 mt-1">
                  Shop Address is required
                </p>
              )}
            </div>

            <div className="form-control mt-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Shop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateShop;
