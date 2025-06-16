import React from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import HeroAnimation from "@/components/ui/HeroAnimation";
import {
  LucideRocket,
  LucideShield,
  LucideDatabase,
  LucideUsers,
  LucideBarChart,
  LucideCreditCard,
} from "lucide-react";

export const metadata = {
  title: "About the Developer - Legacy of Dedication",
  description:
    "Learn about a developer who dedicated his life to advancing software and technology.",
};

export default function AboutPage() {
  const features = [
    {
      name: "Passion for Innovation",
      description:
        "A relentless pursuit of creating impactful software solutions that transform lives.",
      icon: LucideRocket,
    },
    {
      name: "Lifelong Dedication",
      description:
        "Devoted decades to mastering coding, mentoring others, and pushing technological boundaries.",
      icon: LucideShield,
    },
    {
      name: "Community Builder",
      description:
        "Built a community of developers, sharing knowledge and inspiring future generations.",
      icon: LucideUsers,
    },
    {
      name: "Innovative Spirit",
      description:
        "Always exploring new ideas, tools, and methods to improve software development.",
      icon: LucideBarChart,
    },
    {
      name: "Legacy of Impact",
      description:
        "His work continues to influence countless projects and developers worldwide.",
      icon: LucideDatabase,
    },
    {
      name: "Mentorship & Teaching",
      description:
        "Dedicated time to mentoring aspiring developers and sharing knowledge.",
      icon: LucideCreditCard,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden pt-32 md:pt-40 pb-24 px-4 md:px-8"
      >
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent" />
        {/* Decorative blurred blob */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-secondary opacity-20 blur-3xl" />

        <div className="container mx-auto max-w-6xl flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Copy */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground mb-6">
              Honoring a Developer Who Gave His Life to Software
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto md:mx-0 text-lg mb-10">
              A story of passion, dedication, and legacy. Discover the journey
              of a developer whose life was devoted to pushing the boundaries of
              technology and inspiring countless others.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                href="/contact"
                className="bg-primary text-background hover:bg-primary/90 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Reach Out
              </Link>
              <Link
                href="/"
                className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Illustration with Animation */}
          <div className="flex-1 w-full max-w-md md:max-w-none">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 md:px-8 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            His Impact & Contributions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">
                  <feature.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="contact"
        className="bg-primary text-white py-16 px-4 md:px-8"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Continue His Legacy
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join us in honoring his memory by building innovative software and
            inspiring future developers.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-full font-semibold"
            >
              Get in Touch
            </Link>
            <Link
              href="/"
              className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold"
            >
              Explore More
            </Link>
          </div>
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
