import { Box, Container, Typography } from "@mui/material";
import YouTube from "react-youtube";

const Watch = () => {
  const opts = {
    height: "500",
    width: "1000",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  return (
    <Container maxWidth="lg" sx={{ my: 5 }}>
      <Typography
        variant="h4"
        component="h2"
        fontWeight={600}
        color="primary"
        align="center"
        sx={{ my: 2 }}
      >
        Watch Tutorial
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          "& iframe": { maxWidth: "100%", height: "auto", aspectRatio: "2 / 1" },
        }}
      >
        <YouTube videoId="DZhHSR4_9B4" opts={opts} />
      </Box>
    </Container>
  );
};

export default Watch;
