import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
  const { shop, setShop, shopRole, isShopOwner } = useShop();
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // react-hook-form's register ref must target the underlying <input>, so
  // split it off and pass it as inputRef (MUI forwards `ref` to the root).
  const { ref: nameRef, ...nameProps } = register("name", {
    required: "Shop name is required",
  });
  const { ref: locationRef, ...locationProps } = register("location", {
    required: "Shop address is required",
  });

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
      // PUT /shop/:id returns the plain shop document — keep the role
      // from GET /api/shop/user so role-gated UI stays correct.
      setShop({ ...res.data, role: shop.role });
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
        <Typography variant="h6" align="center" color="text.secondary">
          You do not have a shop yet. Create one to manage its settings.
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main">
        Shop Settings
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">Account</Typography>
          <Box sx={{ mt: 1, display: "grid", gap: 1 }}>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 500 }}>
                Email:
              </Box>{" "}
              {user?.email}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 500 }}>
                Subscription plan:
              </Box>{" "}
              <Box component="span" sx={{ textTransform: "capitalize" }}>
                {shop.subscriptionPlan || "free"}
              </Box>
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 500 }}>
                Shop created:
              </Box>{" "}
              {shop.createdAt
                ? new Date(shop.createdAt).toLocaleDateString()
                : "—"}
            </Typography>
            {shopRole ? (
              <Typography variant="body2">
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Your role:
                </Box>{" "}
                <Box component="span" sx={{ textTransform: "capitalize" }}>
                  {shopRole}
                </Box>
              </Typography>
            ) : null}
          </Box>
        </CardContent>
      </Card>

      {!isShopOwner ? (
        <Card>
          <CardContent>
            <Typography variant="h6">Shop Details</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Only the shop owner can change shop settings. Your role is{" "}
              <Box component="span" sx={{ textTransform: "capitalize" }}>
                {shopRole || "viewer"}
              </Box>
              .
            </Typography>
            <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
              <Typography variant="body2">
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Shop name:
                </Box>{" "}
                {shop.name}
              </Typography>
              <Typography variant="body2">
                <Box component="span" sx={{ fontWeight: 500 }}>
                  Address:
                </Box>{" "}
                {shop.location}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6">Shop Details</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
            <TextField
              id="name"
              label="Shop Name"
              fullWidth
              inputRef={nameRef}
              {...nameProps}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              id="location"
              label="Shop Address"
              fullWidth
              multiline
              rows={3}
              inputRef={locationRef}
              {...locationProps}
              error={!!errors.location}
              helperText={errors.location?.message}
            />
            <div className="grid gap-2">
              <Typography variant="body2" fontWeight={500}>
                Shop Logo
              </Typography>
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
              <Button type="submit" variant="contained" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
