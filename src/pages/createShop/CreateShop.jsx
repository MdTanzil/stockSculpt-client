import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
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

  // react-hook-form's ref must reach the underlying <input>, so it is
  // passed through MUI's inputRef instead of spreading register() onto
  // the TextField (which would attach the ref to the component root).
  const { ref: nameRef, ...nameProps } = register("name", { required: true });
  const { ref: photoRef, ...photoProps } = register("photo", {
    required: true,
  });
  const { ref: addressRef, ...addressProps } = register("address", {
    required: true,
  });

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
    <Container maxWidth="md" sx={{ mt: 10, minHeight: "100vh" }}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            color="primary"
            fontWeight={600}
            sx={{ letterSpacing: "0.025em", mb: 3 }}
          >
            Create shop
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "grid", gap: 2, minHeight: "100%" }}
          >
            <TextField
              type="text"
              id="name"
              label="Shop Name"
              placeholder="Shop Name"
              fullWidth
              inputRef={nameRef}
              {...nameProps}
              error={!!errors.name}
              helperText={errors.name && "Shop Name is required"}
            />

            <TextField
              id="picture"
              type="file"
              label="Shop Logo"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputRef={photoRef}
              {...photoProps}
              error={!!errors.photo}
              helperText={errors.photo && "Shop Logo is required"}
            />

            <TextField
              type="text"
              id="location"
              label="Shop Address"
              placeholder="Shop Address"
              multiline
              rows={3}
              fullWidth
              inputRef={addressRef}
              {...addressProps}
              // NOTE: preserved from the original — the address error
              // message is gated on errors.name, not errors.address.
              error={!!errors.name}
              helperText={errors.name && "Shop Address is required"}
            />

            <Box sx={{ mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Shop"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateShop;
