import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, setUser } = useAuth();
  const onSubmit = (data) => {
    const { email, password } = data;
    signIn(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        setUser(user);

        toast.success(user?.email + " Log in success");
        navigate(location?.state ? location.state : "/");

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
        toast.error("Email or password incorrect ! ");
      });
  };

  // react-hook-form's ref must target the underlying <input>, so it is
  // passed via MUI's inputRef instead of being spread onto TextField.
  const { ref: emailRef, ...emailProps } = register("email", {
    required: true,
  });
  const { ref: passwordRef, ...passwordProps } = register("password", {
    required: true,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 448, mx: "auto" }}>
        <Card sx={{ boxShadow: 12, borderRadius: 4, py: 4 }}>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              color="primary"
              sx={{ fontWeight: 600, letterSpacing: "0.02em", mb: 3 }}
            >
              Login
            </Typography>
            <Box
              component="form"
              sx={{ display: "grid", gap: 2 }}
              onSubmit={handleSubmit(onSubmit)}
            >
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

              <Button type="submit" variant="contained" fullWidth>
                Login
              </Button>
            </Box>
          </CardContent>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Do not have account?{" "}
                  <Link component={RouterLink} to="/register" underline="hover">
                    Register
                  </Link>
                </Typography>
                <SocialLogin />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
