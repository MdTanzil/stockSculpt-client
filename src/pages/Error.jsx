/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import errorjson from '../assets/error.json'

const Error = ({errorCode = 404, errorMassage = 'Page Not Found'}) => {
    return (
<Box className="w-full mt-4 h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0">
    <Box className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center">
        <Typography
          color="primary"
          fontWeight="bold"
          sx={{ fontSize: { xs: "4.5rem", md: "6rem", lg: "8rem" }, letterSpacing: "0.05em", lineHeight: 1 }}
        >
          {errorCode}
        </Typography>
        <Typography
          color="text.primary"
          fontWeight="bold"
          sx={{ fontSize: { xs: "2.25rem", md: "3rem", lg: "3.75rem" }, letterSpacing: "0.05em", mt: 1 }}
        >
          {errorMassage}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: { xs: "1.125rem", md: "1.25rem", lg: "1.5rem" }, my: 6 }}>
          Sorry, the page you are looking for could not be found.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          title="Return Home"
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
            </svg>
          }
        >
          Return Home
        </Button>
    </Box>
    <Box className="w-1/2 lg:h-full flex lg:items-end justify-center p-4">
        <Lottie animationData={errorjson} loop={true}></Lottie>
    </Box>
</Box>
    );
};

export default Error;
