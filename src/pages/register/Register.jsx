import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import imageUpload from "@/utility/imageUpload";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const axiosPublic = useAxiosPublic();
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // TODO: when user chose a image  send to imagebb server and update it
  const onSubmit = (data) => {
    let { name, password, photo, email, dateOfBirth } = data;
    email = email.toLowerCase();
    createUser(email, password)
      .then(async () => {
        // Signed up
        // const user = userCredential.user;
        const photoUrl = await imageUpload(photo[0]);
        if (name && photoUrl) {
          updateUserProfile(name, name);
        } else if (name) {
          updateUserProfile(name, "");
        } else if (photoUrl) {
          updateUserProfile("", photoUrl);
        }
        console.log(photoUrl);

        // TOOD: Make a request in backend for
        axiosPublic
          .post("users", {
            name,
            email,
            dateOfBirth,
            avatar: photoUrl,
            password,
          })
          .then((res) => {
            console.log(res.data);
          });
        toast.success("Successfully register  !");
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

  // react-hook-form's ref must target the underlying <input>, so it is
  // passed via MUI's inputRef instead of being spread onto TextField.
  const { ref: nameRef, ...nameProps } = register("name", { required: true });
  const { ref: emailRef, ...emailProps } = register("email", {
    required: true,
  });
  const { ref: dobRef, ...dobProps } = register("dateOfBirth", {
    required: true,
  });
  const { ref: photoRef, ...photoProps } = register("photo", {
    required: true,
  });
  const { ref: passwordRef, ...passwordProps } = register("password", {
    required: true,
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 448,
        mx: "auto",
        minHeight: "100vh",
        my: "auto",
        mt: 5.5,
        px: 2,
      }}
    >
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            color="primary"
            sx={{ fontWeight: 600, letterSpacing: "0.02em", mb: 3 }}
          >
            Register
          </Typography>
          <Box
            component="form"
            sx={{ display: "grid", gap: 2 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              type="text"
              id="name"
              label="Name"
              placeholder="Enter your name"
              fullWidth
              inputRef={nameRef}
              {...nameProps}
              error={!!errors.name}
              helperText={errors.name ? "Name is required" : ""}
            />

            <TextField
              type="email"
              id="email"
              label="Email"
              placeholder="Email"
              fullWidth
              inputRef={emailRef}
              {...emailProps}
              error={!!errors.email}
              helperText={errors.email ? "email is required" : ""}
            />

            <TextField
              id="dof"
              type="date"
              label="Date of Birth"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputRef={dobRef}
              {...dobProps}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth ? "DateOfBirth is required" : ""}
            />

            <TextField
              id="picture"
              type="file"
              label="Picture"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputRef={photoRef}
              {...photoProps}
              error={!!errors.photo}
              helperText={errors.photo ? "Profile Picture is required" : ""}
            />

            <TextField
              type="password"
              id="password"
              label="Password"
              placeholder="password"
              fullWidth
              inputRef={passwordRef}
              {...passwordProps}
              error={!!errors.password}
              helperText={errors.password ? "Password is required" : ""}
            />

            <Box sx={{ mt: 1 }}>
              <Button type="submit" variant="contained" fullWidth>
                Register
              </Button>
            </Box>
          </Box>
        </CardContent>
        <CardContent>
          <Box sx={{ width: "100%" }}>
            <Typography variant="body2" sx={{ fontWeight: 300, pb: 1 }}>
              Already Have a account ?{" "}
              <Link component={RouterLink} to="/login" underline="hover">
                Login
              </Link>
            </Typography>
            <SocialLogin />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
