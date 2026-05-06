import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ProductRecommendation {
  category: string;
  productName: string;
  brand: string;
  description: string;
  purchaseUrl: string;
}

interface SuggestedProductsProps {
  products: ProductRecommendation[];
}

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors"
      aria-label="Next product"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  );
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md hover:bg-gray-50 flex items-center justify-center transition-colors"
      aria-label="Previous product"
    >
      <ChevronLeft className="w-5 h-5 text-gray-700" />
    </button>
  );
}

export function SuggestedProducts({ products }: SuggestedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: products.length > 1,
    adaptiveHeight: true
  };

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-purple-600" />
        <h3>Suggested Products</h3>
      </div>
      <div className="relative pb-8">
        <div className={products.length > 1 ? 'px-10' : ''}>
          <Slider {...settings}>
            {products.map((product, index) => (
              <div key={index} className="outline-none px-1">
                <a
                  href={product.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                      {product.category}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <h4 className="mb-1 group-hover:text-purple-600 transition-colors">{product.productName}</h4>
                  <p className="text-xs text-gray-500 mb-3">{product.brand}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-600 font-medium group-hover:gap-3 transition-all">
                    <span>Shop Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          💡 These are general suggestions. Consult with a dermatologist for personalized advice.
        </p>
      </div>
    </div>
  );
}
