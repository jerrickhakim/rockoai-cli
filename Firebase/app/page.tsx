import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import HeroAnimation from "@/components/ui/HeroAnimation";
import BlogSection from "@/components/ui/BlogSection";
import CommentsViewer from "@/components/ui/CommentsViewer";
import { LucideRocket, LucideShield, LucideDatabase, LucideUsers, LucideBarChart, LucideCreditCard } from "lucide-react";

export const metadata = {
  title: "ACME - Multi-Tenant SaaS Platform",
  description: "Powerful SaaS solution for modern businesses",
};

// TODO: Remove this
export default function Home() {
  return <CommentsViewer />;
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-32 md:pt-40 pb-24 px-4 md:px-8">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent" />
        {/* Decorative blurred blob */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-secondary opacity-20 blur-3xl" />

        <div className="container mx-auto max-w-6xl flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Copy */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground mb-6">
              Empower Your Business with
              <span className="text-primary"> Scalable SaaS Solutions</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto md:mx-0 text-lg mb-10">
              A comprehensive multi-tenant platform designed to streamline your operations, enhance collaboration, and drive growth with
              cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                href="/auth/sign-up"
                className="bg-primary text-background hover:bg-primary/90 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                View Dashboard
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Powerful Features for Modern Businesses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-background border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <div className="flex justify-center mb-4">
                  <feature.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.name}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BlogSection />
      <CommentsViewer />

      {/* Call to Action */}
      <section id="pricing" className="bg-primary text-white py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses leveraging our multi-tenant SaaS platform to streamline operations and drive growth.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/sign-up" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-full font-semibold">
              Start Free Trial
            </Link>
            <Link href="/contact" className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-background py-8 px-4 md:px-8 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground mb-4 md:mb-0">© {new Date().getFullYear()} ACME SaaS. All rights reserved.</div>
          <nav className="flex space-x-4">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    name: "Multi-Tenant Architecture",
    description: "Securely manage multiple organizations with isolated data and permissions.",
    icon: LucideUsers,
  },
  {
    name: "Scalable Infrastructure",
    description: "Robust and flexible platform that grows with your business needs.",
    icon: LucideRocket,
  },
  {
    name: "Advanced Security",
    description: "Enterprise-grade security with comprehensive authentication and access controls.",
    icon: LucideShield,
  },
  {
    name: "Data Management",
    description: "Powerful database integration with real-time synchronization.",
    icon: LucideDatabase,
  },
  {
    name: "Analytics Dashboard",
    description: "Gain insights with comprehensive reporting and visualization tools.",
    icon: LucideBarChart,
  },
  {
    name: "Billing Management",
    description: "Integrated subscription and payment processing solutions.",
    icon: LucideCreditCard,
  },
];
