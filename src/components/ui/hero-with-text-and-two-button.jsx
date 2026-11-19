import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { MoveRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Hero1() {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            gap: 4,
            py: { xs: 10, lg: 20 },
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography
              component={motion.h1}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              variant="h1"
              align="center"
              color="primary"
              fontWeight={600}
              sx={{
                fontSize: { xs: "2.25rem", sm: "3rem", md: "4.5rem" },
                maxWidth: "64rem",
                letterSpacing: "-0.05em",
                overflowWrap: "anywhere",
              }}
            >
              Run Your Shop From One Dashboard
            </Typography>
            <Typography
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              align="center"
              color="text.secondary"
              sx={{
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                lineHeight: 1.625,
                letterSpacing: "-0.025em",
                maxWidth: "64rem",
                overflowWrap: "anywhere",
              }}
            >
              stockSculpt helps small shop owners manage products, stock levels
              and orders in one place. Create your shop, add products, track
              every order — and start free with up to 3 products.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate("/services")}
              endIcon={<Store size={16} />}
              sx={{ gap: 2, width: { xs: "100%", sm: "auto" } }}
            >
              See our services
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/register")}
              endIcon={<MoveRight size={16} />}
              sx={{ gap: 2, width: { xs: "100%", sm: "auto" } }}
            >
              Create your shop — it&apos;s free
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export { Hero1 };
