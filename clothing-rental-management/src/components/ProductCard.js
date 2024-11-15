import { Card, Tag } from 'antd';
import { formatNumberToCurrency } from '../helpers/helpers';

function ProductCard({ product, setSelectedProduct, selectedProduct }) {
    const isSelected = selectedProduct && selectedProduct.id === product.id; // Kiểm tra nếu sản phẩm đang được chọn

    return (
        <Card
            className={`product-card 
                ${isSelected ? 'shadow-[0px_0px_15px_5px_rgba(197,34,34,0.4)] border-none' : 'shadow-md border-gray-200'} 
                rounded-lg transition-all duration-300 ease-in-out flex flex-col h-full`} 
            onClick={() => setSelectedProduct(product)} // Click vào card để xem chi tiết
            cover={
                <div>
                    <div className="flex flex-wrap gap-2 p-2">
                        {product.images.slice(0, 5).map((image, index) => (
                            <img
                                key={index}
                                alt="product"
                                src={image}
                                className={`${product.images.length === 1 ? 'w-full' :
                                    product.images.length === 2 ? 'w-[calc(50%-0.3rem)]' :
                                        'w-[calc(33.33%-0.4rem)]'} 
                                    ${product.images.length >= 4 ? 'h-32' : 'h-64'} 
                                    object-cover rounded-lg`}
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
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description.length > 30 ? `${product.description.slice(0, 30)}...` : product.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {product.categories && product.categories.map((category) => (
                    <Tag key={category.id} color="blue" className="text-xs">
                        {category.name}
                    </Tag>
                ))}
            </div>

            <div className="product-price p-4 mt-4 bg-gray-50 border-t border-gray-200">
                <span className="block text-sm font-medium text-gray-700">Giá nhập: {formatNumberToCurrency(product.import_price)} VND</span>
                <span className="block text-sm font-medium text-gray-700">Giá thuê: {formatNumberToCurrency(product.rental_price)} VND</span>
            </div>
        </Card>
    );
}

export default ProductCard;
