import { Badge, Card, Divider, Select, Tag } from 'antd'
import { formatNumberToCurrency } from '../helpers/helpers'
import { Option } from 'antd/es/mentions'

function InventoryCard({
  inventory,
  handleShowDetail,
  handleStatusChange,
  itemType,
}) {
  return (
    <Badge.Ribbon
      text={inventory.status === 'available' ? 'Sẵn sàng' : 'Không sẵn sàng'}
      color={inventory.status === 'available' ? 'green' : 'red'}
    >
      <Card
        className={`product-card rounded-none overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-full cursor-pointer`}
        onClick={handleShowDetail} // Click vào card để xem chi tiết
        cover={
          <div>
            <div className="flex flex-wrap gap-2">
              {inventory.product_images.slice(0, 5).map((image, index) => (
                <img
                  key={index}
                  alt="inventory"
                  src={image}
                  className={`${
                    inventory.product_images.length === 1
                      ? 'w-full'
                      : inventory.product_images.length === 2
                        ? 'w-[calc(50%-0.3rem)]'
                        : 'w-[calc(33.33%-0.4rem)]'
                  } 
                                    ${inventory.product_images.length >= 4 ? 'h-32' : 'h-64'} 
                                    object-cover rounded-lg`}
                />
              ))}
              {inventory.product_images.length > 5 && (
                <div className="w-[calc(33.33%-0.5rem)] h-32 bg-gray-200 flex justify-center items-center text-gray-600 text-sm rounded-lg">
                  <span>+{inventory.product_images.length - 5} ảnh</span>
                </div>
              )}
            </div>
          </div>
        }
      >
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          #KTS_{inventory.product_id} {inventory.product_name}
        </h3>
        <Divider className="my-3" />
        <p className="text-sm text-gray-600 line-clamp-2">
          <span className="font-medium">Mã kho: </span>
          {`${inventory.id}`}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          <span className="font-medium">Mã sản phẩm: </span>
          {`${inventory.product_id}`}
        </p>
        {itemType === 'product' && (
          <>
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Kích thước: </span>
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ml-2">
                {inventory.variant_size}
              </span>
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Màu sắc: </span>
              {`${inventory.variant_color}`}
            </p>
          </>
        )}
        <Select
          defaultValue={inventory.status}
          onChange={(value) => handleStatusChange(value)}
          style={{ width: 150 }}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 !w-full"
        >
          <Option value="available">Sẵn sàng</Option>
          <Option value="unavailable">Không sẵn sàng</Option>
        </Select>
        <div className="product-price mt-4 py-3 border-t border-gray-200 text-center">
          <span className="block text-lg font-bold text-gray-700">
            Số lượng tồn:
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ml-2">
              {inventory.quantity}
            </span>
          </span>
        </div>
      </Card>
    </Badge.Ribbon>
  )
}

export default InventoryCard
