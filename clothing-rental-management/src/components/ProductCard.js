import { Badge, Card, Tag } from 'antd'
import { formatNumberToCurrency } from '../helpers/helpers'

function ProductCard({ product, setSelectedProduct, selectedProduct }) {
  const isSelected = selectedProduct && selectedProduct.id === product.id // Kiểm tra nếu sản phẩm đang được chọn

  return (
    <Badge.Ribbon text={`${formatNumberToCurrency(product.rental_price)} VND`}>
      <Card
        bodyStyle={{ padding: '0' }}
        className={`product-card 
                ${isSelected ? 'shadow-[0px_0px_15px_5px_rgba(197,34,34,0.4)]' : ''} 
                custom-card rounded-none overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-full cursor-pointer`}
        onClick={() => setSelectedProduct(product)} // Click vào card để xem chi tiết
        cover={
          <div>
            <div className="flex flex-wrap gap-2">
              {product.images.slice(0, 5).map((image, index) => (
                <img
                  key={index}
                  alt="product"
                  src={image}
                  className={`${
                    product.images.length === 1
                      ? 'w-full'
                      : product.images.length === 2
                        ? 'w-[calc(50%-0.3rem)]'
                        : 'w-[calc(33.33%-0.4rem)]'
                  } 
                                    ${product.images.length >= 4 ? 'h-32' : 'h-64'} 
                                    object-cover`}
                />
              ))}
              {product.images.length > 5 && (
                <div className="w-[calc(33.33%-0.5rem)] h-32 bg-gray-200 flex justify-center items-center text-gray-600 text-sm rounded-lg">
                  <span>+{product.images.length - 5} ảnh</span>
                </div>
              )}
            </div>
          </div>
        }
      >
        <div className="flex-grow min-h-[80px]">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            #KTS_{product.id} - {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description || 'Không có mô tả'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.variants.length
              ? product.variants
                  .map((variant) => `${variant.color}(${variant.size})`)
                  .map((variant) => (
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                      {variant}
                    </span>
                  ))
              : 'Chưa nhập hàng'}
          </p>
        </div>
      </Card>
    </Badge.Ribbon>
  )
}

export default ProductCard
