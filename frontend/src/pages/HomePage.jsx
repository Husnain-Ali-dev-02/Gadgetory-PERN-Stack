"use client";

import { useProducts } from "../hooks/useProducts";
import { PackageIcon, SparklesIcon } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { SignInButton } from "@clerk/clerk-react";

import { Link } from "react-router";

function HomePage() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div
        role="alert"
        className="alert alert-error mx-auto max-w-md mt-20 text-center"
      >
        <span>Something went wrong. Please refresh the page.</span>
      </div>
    );

  const hasProducts = products && products.length > 0;

  return (
    <div className="space-y-16 px-4 md:px-8 lg:px-16">
      {/* HERO SECTION */}
      <section className="hero bg-gradient-to-br from-base-300 via-base-200 to-base-300 rounded-2xl overflow-hidden relative">
        <div className="hero-content flex flex-col lg:flex-row-reverse gap-10 py-10 items-center">
          {/* Hero Image */}
          <div className="relative w-full lg:w-1/2">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 animate-pulse" />
            <img
              src="/gadgetory.png"
              alt="Creator sharing products"
              width={400}
              height={288}
              className="relative w-full h-64 lg:h-72 rounded-2xl shadow-2xl object-cover"
            />
          </div>

          {/* Hero Text */}
          <div className="text-center lg:text-left space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Share Your <span className="text-primary">Products</span>
            </h1>
            <p className="text-base-content/70">
              Upload, discover, and connect with creators worldwide.
            </p>
            <SignInButton mode="modal">
              <button
                className="btn btn-primary flex items-center gap-2 transition-transform duration-300 hover:scale-105"
                aria-label="Start selling your products"
              >
                <SparklesIcon className="w-5 h-5" />
                Start Selling
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <PackageIcon className="w-6 h-6 text-primary" />
          All Products
        </h2>

        {!hasProducts ? (
          <div className="card bg-base-300 mx-auto max-w-md">
            <div className="card-body items-center text-center py-16">
              <PackageIcon className="w-16 h-16 text-base-content/20 mb-4" />
              <h3 className="card-title text-base-content/50">No products yet</h3>
              <p className="text-base-content/40 text-sm">
                Be the first to share something amazing!
              </p>
              <Link
                to="/create"
                className="btn btn-primary btn-sm mt-4 transition-transform duration-300 hover:scale-105"
              >
                Create Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
