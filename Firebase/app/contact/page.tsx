import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Contact Us - Legacy of Dedication",
  description: "Get in touch with the developer or team behind this platform.",
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState"";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    // Here you can handle form submission, e.g., send data to an API
    // For now, simulate success
    setTimeout(() => {
      setStatus("Message sent! Thank you for reaching out.");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground">
          Contact Us
        </h1>
        <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Have questions or want to collaborate? Fill out the form below and we will get back to you shortly.
        </p>
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-md space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-foreground">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-foreground">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 font-semibold text-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-background px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
          >
            Send Message
          </button>
          {status && <p className="mt-4 text-center text-foreground font-semibold">{status}</p>}
        </form>
      </section>
    </div>
  );
}
