import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const ProductCard = ({ product, now }) => {
  const isNew =
    product?.createdAt &&
    now - new Date(product.createdAt).getTime() < ONE_WEEK_MS;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group card bg-base-300 transition-all duration-300
                 hover:bg-base-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* IMAGE */}
      <figure className="relative px-4 pt-4">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-40 w-full rounded-xl object-cover
                     transition-transform duration-300
                     group-hover:scale-[1.03]"
        />

        {isNew && (
          <span className="absolute top-6 left-6 badge badge-secondary badge-sm shadow">
            NEW
          </span>
        )}
      </figure>

      {/* CONTENT */}
      <div className="card-body p-4 gap-2">
        <h2 className="text-base font-semibold line-clamp-1">
          {product.title}
        </h2>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {product.description}
        </p>

        <div className="divider my-1" />

        {/* FOOTER */}
        <div className="flex items-center justify-between text-xs">
          {product.user ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="avatar">
                <div className="w-6 rounded-full ring-1 ring-primary ring-offset-1 ring-offset-base-300">
                  <img
                    src={product.user.imageUrl}
                    alt={product.user.name}
                  />
                </div>
              </div>
              <span className="truncate text-base-content/60">
                {product.user.name}
              </span>
            </div>
          ) : (
            <span className="text-base-content/40">Anonymous</span>
          )}

          {Array.isArray(product.comments) && (
            <div className="flex items-center gap-1 text-base-content/50">
              <MessageCircleIcon className="size-3" />
              <span>{product.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
