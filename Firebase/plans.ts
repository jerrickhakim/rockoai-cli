export const plans = {
  plans: {
    Free: {
      name: "Free",
      description: "Get started with the basics",
      price: 0,
      features: [
        "Basic access to the platform",
        "1 project or workspace",
        "Up to 10 actions or tasks per month",
        "Community support",
      ],
      limits: {
        projects: 1,
        teamMembers: 1,
        monthlyUsage: 10,
      },
      available: true,
    },
    Pro: {
      name: "Pro",
      description: "For individuals who need more flexibility",
      priceMonthly: 9.99,
      priceYearly: 99.99,
      features: [
        "Up to 5 projects",
        "100 actions or tasks per month",
        "Add up to 3 team members",
        "Priority support",
      ],
      limits: {
        projects: 5,
        teamMembers: 3,
        monthlyUsage: 100,
      },
      intervals: {
        monthly: {
          price: 9.99,
          suffix: "per month",
        },
        yearly: {
          price: 99.99,
          suffix: "per year",
        },
      },
      available: true,
    },
    Team: {
      name: "Team",
      description: "Collaborate and scale with your team",
      priceMonthly: 29.99,
      priceYearly: 299.99,
      features: [
        "Unlimited projects",
        "Up to 500 actions per month",
        "Up to 10 team members",
        "Advanced collaboration tools",
        "Priority email support",
      ],
      limits: {
        projects: "unlimited",
        teamMembers: 10,
        monthlyUsage: 500,
      },
      intervals: {
        monthly: {
          price: 29.99,
          suffix: "per month",
        },
        yearly: {
          price: 299.99,
          suffix: "per year",
        },
      },
      available: true,
    },
  },
};
