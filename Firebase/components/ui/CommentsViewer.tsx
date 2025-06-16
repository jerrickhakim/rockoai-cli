"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentsViewer = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // const request = await fetch(`/api/comments`, {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        // const data = await request.json();

        const response = await axios.get(`/api/comments`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response.data;

        setData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Live Commentsfsdaf
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 min-h-[200px]">
          {loading && (
            <div className="text-center text-muted-foreground">Loading...</div>
          )}
          {error && (
            <div className="text-red-500 text-center">Error: {error}</div>
          )}
          {data && (
            <pre className="whitespace-pre-wrap break-all text-sm text-foreground">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentsViewer;
