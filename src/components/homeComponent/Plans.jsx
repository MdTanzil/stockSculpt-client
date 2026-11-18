import { Link } from "react-router-dom";

const Plans = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      limit: "Up to 3 products",
      text: "Try stockSculpt with your first products, no card needed.",
      buttonText: "Start free",
      to: "/register",
    },
    {
      name: "Starter",
      price: "$10",
      limit: "Up to 200 products",
      text: "For small shops getting organised.",
      buttonText: "Get started",
      to: "/subscription",
    },
    {
      name: "Company",
      price: "$20",
      limit: "Up to 450 products",
      text: "For growing shops with a bigger catalogue.",
      buttonText: "Get started",
      to: "/subscription",
    },
    {
      name: "Enterprise",
      price: "$50",
      limit: "Up to 1,500 products",
      text: "For large shops with a wide range.",
      buttonText: "Get started",
      to: "/subscription",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-primary lg:text-4xl">
            Simple plans that grow with your shop
          </h2>
          <p className="mt-4 text-muted-foreground lg:text-lg">
            Start free. Upgrade when you need room for more products.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col rounded-lg border bg-white p-6 text-center shadow-sm"
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-2 font-light text-gray-500">{plan.text}</p>
              <div className="my-8 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold">{plan.price}</span>
              </div>
              <ul className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>{plan.limit}</span>
                </li>
              </ul>
              <Link
                to={plan.to}
                className="mt-auto rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:opacity-90"
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
