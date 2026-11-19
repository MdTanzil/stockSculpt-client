import { Box, Button, Chip, Container, Typography } from "@mui/material";
import { CreditCard, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: "100%", py: { xs: 5, lg: 20 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            bgcolor: "grey.100",
            borderRadius: 1,
            p: { xs: 2, lg: 7 },
            gap: 4,
            alignItems: "center",
          }}
        >
          <div>
            <Chip label="Get started" sx={{ fontSize: "0.875rem", px: 1 }} />
          </div>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontSize: { xs: "1.875rem", md: "3rem" },
                letterSpacing: "-0.05em",
                maxWidth: "36rem",
                fontWeight: 400,
              }}
            >
              Try our platform today!
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: "1.125rem",
                lineHeight: 1.625,
                letterSpacing: "-0.025em",
                maxWidth: "36rem",
              }}
            >
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/subscription")}
              endIcon={<CreditCard size={16} />}
              sx={{ gap: 2 }}
            >
              View plans
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              endIcon={<MoveRight size={16} />}
              sx={{ gap: 2 }}
            >
              Sign up here
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export { CTA };
