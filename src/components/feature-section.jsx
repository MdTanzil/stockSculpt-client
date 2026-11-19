/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  autoPlayInterval = 3000,
  // Accepted for API compatibility; the image heights are fixed in the
  // layout below (as in the original implementation).
  // eslint-disable-next-line no-unused-vars
  imageHeight = "h-[400px]",
}) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  // Step-circle colors adapt to the theme: the active circle keeps the
  // brand navy (dark in light mode, lighter slate in dark mode via the
  // theme primary), the inactive ones use theme tokens instead of the
  // previous hardcoded light greys.
  const activeCircle = {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  };
  const inactiveCircle = {
    borderColor: theme.palette.text.disabled,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.secondary,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, features.length, autoPlayInterval]);

  return (
    <Box className={className} sx={{ p: { xs: 4, md: 6 } }}>
      <Box sx={{ mx: "auto", width: "100%", maxWidth: "80rem" }}>
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          align="center"
          color="primary"
          sx={{ mb: 5, fontSize: { xs: "1.875rem", md: "2.25rem", lg: "3rem" } }}
        >
          {title}
        </Typography>

        <div className="flex flex-col md:grid md:grid-cols-2  gap-6 md:gap-10">
          <div className="order-2 md:order-1 space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    borderWidth: 2,
                    borderStyle: "solid",
                    ...(index === currentFeature
                      ? activeCircle
                      : inactiveCircle),
                    transform:
                      index === currentFeature ? "scale(1.1)" : "none",
                  }}
                >
                  {index <= currentFeature ? (
                    <span className="text-lg font-bold">✓</span>
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1">
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight={600}
                    sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                  >
                    {feature.title || feature.step}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.875rem", md: "1.125rem" } }}
                  >
                    {feature.content}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>

          <Box
            sx={{
              order: { xs: 1, md: 2 },
              position: "relative",
              height: { xs: 200, md: 300, lg: 400 },
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.step}
                        className="w-full h-full object-cover transition-transform transform"
                        width={1000}
                        height={500}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "66.666667%",
                          // Fade the image into the page background —
                          // theme-aware so dark mode fades to dark
                          // instead of flashing a white block.
                          background: (theme) =>
                            `linear-gradient(to top, ${theme.palette.background.default} 0%, ${alpha(
                              theme.palette.background.default,
                              0.5
                            )} 50%, transparent 100%)`,
                        }}
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </Box>
        </div>
      </Box>
    </Box>
  );
}
