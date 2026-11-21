import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin";
import useAuth from "../../hooks/useAuth";

// Public demo account for visitors who want to try the site without
// signing up. It owns a separate "Demo Shop" with sample products,
// orders, suppliers and purchase orders — visitors can explore every
// feature, but the demo data is shared, so anyone can change it.
const DEMO_EMAIL = "demo@stocksculpt.app";
const DEMO_PASSWORD = "Demo1234";

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
        // PrivateRouter sends interrupted visits here as
        // state { from: location } — go back to that page (with its
        // state, e.g. the plan being bought), not to the state object.
        navigate(location?.state?.from || "/");

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
        toast.error("Email or password incorrect ! ");
      });
  };

  // One click signs in with the public demo account.
  const handleDemoLogin = () =>
    onSubmit({ email: DEMO_EMAIL, password: DEMO_PASSWORD });

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
            <Divider sx={{ mb: 2 }}>or try the demo</Divider>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 1.5 }}
            >
              Explore stockSculpt with a sample shop — no sign-up needed.
            </Typography>
            <Box
              sx={{
                backgroundColor: "action.hover",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                mb: 2,
                fontFamily: "monospace",
                fontSize: "0.85rem",
                display: "grid",
                gap: 0.5,
              }}
            >
              <span>Email: {DEMO_EMAIL}</span>
              <span>Password: {DEMO_PASSWORD}</span>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleDemoLogin}
              sx={{ mb: 2 }}
            >
              Login as Demo User
            </Button>
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
