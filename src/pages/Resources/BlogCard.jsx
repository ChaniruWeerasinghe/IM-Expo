import React from "react";

const BlogCard = ({ title, description, category, link }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="p-6">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600 text-sm">{description}</p>
        {link && (
          <a
            href={link}
            className="mt-4 inline-block text-blue-600 font-medium hover:underline"
          >
            Read More
          </a>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
