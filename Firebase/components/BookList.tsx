"use client";

import React from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
}

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {books.map((book) => (
        <div key={book.id} className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          <p className="text-gray-500">Published in {book.publishedYear}</p>
        </div>
      ))}
    </div>
  );
};

export default BookList;
