"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentsViewer = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("/api/comments", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
      } catch (err) {
        setError(err.message || "Error fetching comments");
      }
    };

    fetchComments();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default CommentsViewer;
