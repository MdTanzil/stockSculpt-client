/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        "Yes, you can set up low stock alerts in your settings. You'll receive notifications when a product reaches a predefined stock level.",
    },
    {
      id: "faq-4",
      question: "Does StockSculpt support multiple shops?",
      answer:
        "Yes! You can create and manage multiple shops under one account, allowing you to track sales and inventory separately for each shop.",
    },
    {
      id: "faq-5",
      question: "Is my inventory data secure?",
      answer:
        "Absolutely! We use encrypted connections and secure databases to ensure that your inventory data remains private and protected.",
    },
  ],
  supportHeading: "Still have questions?",
  supportDescription:
    "Can't find the answer you're looking for? Our support team is here to help with any technical questions or concerns.",
  supportButtonText: "Contact Support",
  supportButtonUrl: "https://yourinventorysystem.com/support",
};

const Faq3 = ({
  heading = demoData.heading,
  description = demoData.description,
  items = demoData.items,
}) => {
  return (
    <section className="py-20 container mx-auto ">
      <div className="container space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
          <h2 className="mb-3 text-3xl font-semibold text-primary md:mb-4 lg:mb-6 lg:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full lg:max-w-3xl"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2">
                <div className="text-muted-foreground lg:text-lg">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { Faq3 };
