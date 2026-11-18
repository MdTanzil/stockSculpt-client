import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import imageUpload from "@/utility/imageUpload";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Settings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { shop, setShop } = useShop();
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (shop?._id) {
      setValue("name", shop.name || "");
      setValue("location", shop.location || "");
      setImageUrl(shop.logo || "");
    }
  }, [shop, setValue]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = await imageUpload(file);
      if (url) {
        setImageUrl(url);
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error("Logo upload failed. Please try again.");
      }
    }
  };

  const onSubmit = async (data) => {
    if (!shop?._id) return;
    setIsSaving(true);
    try {
      const res = await axiosSecure.put(`/shop/${shop._id}`, {
        name: data.name,
        location: data.location,
        logo: imageUrl,
      });
      setShop(res.data);
      toast.success("Shop settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!shop?._id) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-lg text-muted-foreground">
          You do not have a shop yet. Create one to manage its settings.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-center text-4xl font-bold text-primary">
        Shop Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium">Subscription plan:</span>{" "}
            <span className="capitalize">
              {shop.subscriptionPlan || "free"}
            </span>
          </p>
          <p>
            <span className="font-medium">Shop created:</span>{" "}
            {shop.createdAt
              ? new Date(shop.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shop Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Shop Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Shop name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Shop Address</Label>
              <Textarea
                id="location"
                {...register("location", {
                  required: "Shop address is required",
                })}
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">Shop Logo</Label>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Current shop logo"
                  className="h-20 w-20 rounded-lg object-cover"
                />
              )}
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleImageUpload}
                className="rounded border p-2"
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
