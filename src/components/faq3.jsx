/* eslint-disable react/prop-types */
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { useState } from "react";

const demoData = {
  heading: "Frequently Asked Questions",
  description:
    "Find answers to common questions about managing your inventory. If you need further assistance, feel free to contact our support team.",
  items: [
    {
      id: "faq-1",
      question: "What is StockSculpt?",
      answer:
        "StockSculpt is a powerful inventory management system that helps businesses track stock, manage orders, and optimize sales in one place.",
    },
    {
      id: "faq-2",
      question: "How do I add products to my inventory?",
      answer:
        "To add products, navigate to the 'Products' section in your dashboard and click 'Add Product.' Fill in the details and save to update your inventory.",
    },
    {
      id: "faq-3",
      question: "Can I track low stock alerts?",
      answer:
        "Yes. Your dashboard highlights products that are running low, so you can restock before you run out.",
    },
    {
      id: "faq-4",
      question: "How many products can I add for free?",
      answer:
        "The free plan includes up to 3 products. If you need more, paid plans raise the limit to 200, 450 or 1,500 products.",
    },
    {
      id: "faq-5",
      question: "Is my inventory data secure?",
      answer:
        "Yes. You sign in with your own account, and every request to your shop data requires your login, so other shop owners can't see your products or orders.",
    },
  ],
};

const Faq3 = ({
  heading = demoData.heading,
  description = demoData.description,
  items = demoData.items,
}) => {
  // Single-open, collapsible — same behaviour as the shadcn accordion
  // (type="single" collapsible).
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box component="section" sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            mx: "auto",
            display: "flex",
            maxWidth: "48rem",
            flexDirection: "column",
            textAlign: { xs: "left", md: "center" },
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight={600}
            color="primary"
            sx={{ mb: { xs: 1.5, md: 2, lg: 3 }, fontSize: { lg: "2.25rem" } }}
          >
            {heading}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { lg: "1.125rem" } }}>
            {description}
          </Typography>
        </Box>
        <Box sx={{ mx: "auto", mt: 8, width: "100%", maxWidth: { lg: "48rem" } }}>
          {items.map((item) => (
            <Accordion
              key={item.id}
              expanded={expanded === item.id}
              onChange={handleChange(item.id)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  fontWeight={500}
                  sx={{ py: { xs: 0.5, lg: 1 }, fontSize: { lg: "1.125rem" } }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ mb: { xs: 0.5, lg: 1 } }}>
                <Typography color="text.secondary" sx={{ fontSize: { lg: "1.125rem" } }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export { Faq3 };
