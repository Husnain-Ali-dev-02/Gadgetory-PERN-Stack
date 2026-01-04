import { Link, useNavigate } from "react-router";
import { useCreateProduct } from "../hooks/useProducts";
import { uploadProductImage } from "../lib/api";
import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  FileTextIcon,
  ImageIcon,
  SparklesIcon,
  TypeIcon,
  CheckCircleIcon,
} from "lucide-react";

function CreatePage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [localPreview, setLocalPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [imageError, setImageError] = useState(false);

  /** Handle input changes */
  const handleChange = (key) => (e) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    if (key === "imageUrl") setImageError(false);
  };

  /** Handle file selection and upload */
  const handleFileChange = async (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;
    // create local preview immediately
    const objectUrl = URL.createObjectURL(selected);
    setLocalPreview(objectUrl);
    setImageError(false);

    // upload to server
    try {
      setUploading(true);
      const res = await uploadProductImage(selected);
      if (res?.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setImageError(true);
    } finally {
      setUploading(false);
    }
  };

  /** Form validation */
  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.imageUrl.trim();

  // cleanup object URL when file changes/unmount
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  /** Handle form submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    createProduct.mutate(formData, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* BACK */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm mb-6 text-base-content/70 hover:text-primary transition"
        >
          <ArrowLeftIcon className="size-4" />
          Back to products
        </Link>

        {/* HERO */}
        <div className="relative mb-8 rounded-2xl p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border border-base-300 shadow-lg overflow-hidden">
          <span className="badge badge-primary badge-outline mb-2">
            New Product
          </span>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SparklesIcon className="size-6 text-primary" />
            Create Something Awesome
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Products with great visuals convert better 🚀
          </p>
        </div>

        {/* FORM CARD */}
        <div className="relative card bg-base-100/80 backdrop-blur-xl border border-base-300 shadow-2xl">
          <div className="absolute -top-4 left-6 badge badge-primary shadow">
       Product Details
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="card-body space-y-6">
            {/* TITLE */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Product Title
              </label>
              <label className="input input-bordered flex items-center gap-2 bg-base-200 focus-within:ring-2 focus-within:ring-primary transition">
                <TypeIcon className="size-4 opacity-50" />
                <input
                  type="text"
                  placeholder="Eg: Premium Headphones"
                  className="grow"
                  value={formData.title}
                  onChange={handleChange("title")}
                  required
                />
              </label>
              <p className="text-xs text-base-content/60 mt-1">
                Keep it short and catchy
              </p>
            </div>

            {/* IMAGE */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Product Image
              </label>
              <label className="input input-bordered flex items-center gap-2 bg-base-200 focus-within:ring-2 focus-within:ring-primary transition">
                <ImageIcon className="size-4 opacity-50" />
                <input
                  type="url"
                  placeholder="https://image-url.com"
                  className="grow"
                  value={formData.imageUrl}
                  onChange={handleChange("imageUrl")}
                  required
                />
              </label>

              <div className="mt-3">
                <label className="text-xs text-base-content/60 mb-1 block">
                  Or upload from your device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-sm"
                />
                {uploading && (
                  <p className="text-xs text-base-content/60 mt-1">Uploading...</p>
                )}
              </div>
              <p className="text-xs text-base-content/60 mt-1">
                High-quality images perform better
              </p>
            </div>

            {/* IMAGE PREVIEW */}
            {(formData.imageUrl || localPreview) && !imageError && (
              <div className="relative rounded-xl overflow-hidden shadow-xl group">
                <img
                  src={formData.imageUrl || localPreview}
                  alt="Product preview"
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 right-3 badge badge-success gap-1">
                  <CheckCircleIcon className="size-3" />
                  Preview Ready
                </span>
              </div>
            )}

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <div className="rounded-xl bg-base-200 border border-base-300 p-3 flex gap-2 focus-within:ring-2 focus-within:ring-primary transition">
                <FileTextIcon className="size-4 opacity-50 mt-1" />
                <textarea
                  placeholder="Describe your product benefits..."
                  className="grow bg-transparent resize-none focus:outline-none min-h-32"
                  value={formData.description}
                  onChange={handleChange("description")}
                  required
                />
              </div>
            </div>

            {/* ERROR */}
            {createProduct.isError && (
              <div className="alert alert-error alert-sm">
                Something went wrong. Please retry.
              </div>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={!isFormValid || createProduct.isPending}
              className="btn btn-primary w-full text-lg font-semibold relative overflow-hidden
                shadow-[0_0_30px_rgba(99,102,241,0.35)]
                hover:shadow-[0_0_45px_rgba(99,102,241,0.6)]
                transition-all"
            >
              {createProduct.isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Publish Product 🚀"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
