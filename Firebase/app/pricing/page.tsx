import React from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Pricing Plans - Legacy of Dedication",
  description:
    "Choose the best plan that fits your needs and start your journey today.",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "$19",
      billingCycle: "month",
      features: [
        "Unlimited projects",
        "Basic support",
        "Access to core features",
      ],
      buttonText: "Get Started",
      link: "/signup",
    },
    {
      name: "Pro",
      price: "$49",
      billingCycle: "month",
      features: [
        "Unlimited projects",
        "Priority support",
        "Advanced analytics",
      ],
      buttonText: "Upgrade Now",
      link: "/signup",
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      billingCycle: "",
      features: ["Custom integrations", "Dedicated support", "Unlimited users"],
      buttonText: "Contact Sales",
      link: "/contact",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      {/* Header */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground mb-12 text-lg">
          Flexible pricing options designed to grow with your business.
        </p>
        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  {plan.name}
                </h2>
                <p className="text-4xl font-bold mb-4 text-primary">
                  {plan.price}
                  {plan.billingCycle && (
                    <span className="text-lg font-normal">
                      /{plan.billingCycle}
                    </span>
                  )}
                </p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-4 h-4 text-success mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={plan.link}
                className="mt-4 bg-primary text-background px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-background py-8 px-4 md:px-8 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Legacy of Dedication. All rights
            reserved.
          </div>
          <nav className="flex space-x-4">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
