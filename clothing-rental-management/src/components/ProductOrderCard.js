import { Badge, Card, Tag } from 'antd'
import { formatNumberToCurrency } from '../helpers/helpers'

function ProductOrderCard({ product, onClick }) {
  return (
    <Badge.Ribbon text={`${formatNumberToCurrency(product.rental_price)} VND`}>
      <Card
        hoverable
        onClick={onClick}
        bodyStyle={{ padding: '0' }}
        className={`product-card custom-card overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-full cursor-pointer rounded-lg`}
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
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            #KTS_{product.id} - {product.name}
          </h3>
        </div>
      </Card>
    </Badge.Ribbon>
  )
}

export default ProductOrderCard
