import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card.jsx";
import axios from "axios";
import Skeleton from "../../components/Card/Skeleton.jsx";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Products() {
  //ui management
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("Show All");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/products/products?category=${
            category === "Show All" ? "" : category
          }`
        );

        console.log("API Response:", response.data.products);
        if (typeof response.data === "object" && response.data.products) {
          setProducts(response.data.products);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    })();

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [category]);

  const handleFilter = (category) => {
    if (category === "Show All") {
      setCategory("");
    } else {
      setCategory(category);
    }
    setFilter(category);
    setLoading(true);
  };

  return (
    <div className="py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <form className="max-w-sm mx-auto my-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Search Products"
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5  focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-500 dark:hover:bg-red-300 "
            >
              Search
            </button>
          </div>
        </form>
        <div className="mb-6 flex flex-col items-center">
          <div className="flex flex-wrap justify-center space-x-2">
            {["Show All", "T-shirt", "Joggers", "Sports Shoes"].map(
              (category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-md ${
                    filter === category
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } transition-colors duration-200`}
                  onClick={() => handleFilter(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array(8)
                .fill(0)
                .map((_, index) => <Skeleton key={index} />)
            : products
                .filter(
                  (p) =>
                    p.product_name.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
                )
                .map((product) => (
                  <Link
                    to={`/products/${product.product_id}`}
                    key={product.product_id}
                  >
                    <Card product={product} />
                  </Link>
                ))}
        </div>
      </div>
    </div>
  );
}
