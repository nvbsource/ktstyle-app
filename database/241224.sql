/*
 Navicat Premium Data Transfer

 Source Server         : Mysql Local
 Source Server Type    : MySQL
 Source Server Version : 50739 (5.7.39)
 Source Host           : localhost:3306
 Source Schema         : quan_ly_quan_ao

 Target Server Type    : MySQL
 Target Server Version : 50739 (5.7.39)
 File Encoding         : 65001

 Date: 24/12/2024 11:28:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Categories
-- ----------------------------
DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `parent_id`(`parent_id`) USING BTREE,
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Categories
-- ----------------------------
BEGIN;
INSERT INTO `Categories` (`id`, `name`, `parent_id`, `created_at`, `updated_at`) VALUES (8, 'Bikini', NULL, '2024-11-24 19:19:20', '2024-12-15 11:14:30'), (10, 'Giáng sinh', NULL, '2024-11-26 07:18:52', '2024-12-15 01:43:17'), (11, 'Đầm', NULL, '2024-12-15 01:43:38', '2024-12-15 11:14:40'), (12, 'Áo dài', NULL, '2024-12-15 01:43:50', '2024-12-15 01:43:50'), (13, 'Set bộ', NULL, '2024-12-15 01:43:59', '2024-12-15 11:15:11'), (14, 'Maxi', NULL, '2024-12-15 11:14:48', '2024-12-15 11:14:48'), (15, 'Áo', NULL, '2024-12-15 11:15:19', '2024-12-15 11:15:19'), (16, 'Quần', NULL, '2024-12-15 11:15:39', '2024-12-15 11:15:39'), (17, 'Chân váy', NULL, '2024-12-15 11:15:43', '2024-12-15 11:15:43');
COMMIT;

-- ----------------------------
-- Table structure for Colors
-- ----------------------------
DROP TABLE IF EXISTS `Colors`;
CREATE TABLE `Colors`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `hex_code` varchar(7) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rgb_code` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Colors
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for Contents
-- ----------------------------
DROP TABLE IF EXISTS `Contents`;
CREATE TABLE `Contents`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NULL DEFAULT NULL,
  `topic_id` int(11) NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL,
  `image_urls` json NULL,
  `status` enum('draft','published','scheduled') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'draft',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  INDEX `topic_id`(`topic_id`) USING BTREE,
  CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `contents_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `Topics` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Contents
-- ----------------------------
BEGIN;
INSERT INTO `Contents` (`id`, `product_id`, `topic_id`, `content`, `image_urls`, `status`, `scheduled_at`, `created_at`, `updated_at`) VALUES (2, 31, NULL, '😘😜😜dfbdfbdfb', '[\"http://localhost:5005/uploads/1732786503955_vn-11134207-7r98o-luoympiwk26qf9.webp\"]', 'draft', NULL, '2024-11-30 05:36:13', '2024-11-30 05:36:13');
COMMIT;

-- ----------------------------
-- Table structure for Customers
-- ----------------------------
DROP TABLE IF EXISTS `Customers`;
CREATE TABLE `Customers`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `is_verify` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dob` date NULL DEFAULT NULL,
  `facebook` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `zalo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `instagram` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `more_social` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_facebook` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Customers
-- ----------------------------
BEGIN;
INSERT INTO `Customers` (`id`, `name`, `phone`, `is_verify`, `created_at`, `updated_at`, `dob`, `facebook`, `zalo`, `instagram`, `more_social`, `note`, `id_facebook`, `avatar`, `email`) VALUES (1, 'asdvdf', '08838247234', 0, '2024-11-25 01:56:12', '2024-12-13 14:28:10', '2004-04-25', '123', '123', '123', 'okok', '123', NULL, NULL, NULL), (2, 'Thuê Đồ Phan Rang', NULL, 0, '2024-12-20 00:29:11', '2024-12-20 00:29:11', NULL, NULL, NULL, NULL, NULL, NULL, '1031341768711674', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1031341768711674&height=200&width=200&ext=1737221351&hash=AbZ_MlNsFniEFplIF3lhoOal', 'ktstyle.24@gmail.com');
COMMIT;

-- ----------------------------
-- Table structure for Inventory
-- ----------------------------
DROP TABLE IF EXISTS `Inventory`;
CREATE TABLE `Inventory`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NULL DEFAULT 0,
  `status` enum('available','unavailable') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `item_type` enum('product','accessory') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'product',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `inventory_ibfk_1`(`item_id`) USING BTREE,
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `Variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Inventory
-- ----------------------------
BEGIN;
INSERT INTO `Inventory` (`id`, `item_id`, `quantity`, `status`, `created_at`, `updated_at`, `item_type`) VALUES (24, 28, 1, 'available', '2024-11-28 11:25:29', '2024-12-15 21:11:49', 'product'), (25, 29, 1, 'available', '2024-11-29 06:34:34', '2024-12-15 19:38:39', 'product'), (27, 31, 1, 'available', '2024-11-29 08:19:30', '2024-12-15 19:38:39', 'product'), (28, 32, 1, 'available', '2024-11-29 08:30:30', '2024-12-15 19:38:39', 'product'), (29, 33, 1, 'available', '2024-12-14 23:52:49', '2024-12-15 19:38:39', 'product'), (30, 34, 1, 'available', '2024-12-14 23:53:20', '2024-12-15 19:38:39', 'product'), (31, 35, 1, 'available', '2024-12-14 23:56:14', '2024-12-15 19:38:39', 'product'), (32, 36, 1, 'available', '2024-12-14 23:56:44', '2024-12-15 19:38:39', 'product'), (33, 37, 1, 'available', '2024-12-14 23:57:07', '2024-12-15 19:38:39', 'product'), (34, 38, 1, 'available', '2024-12-14 23:57:21', '2024-12-15 19:38:39', 'product'), (35, 39, 1, 'available', '2024-12-14 23:58:44', '2024-12-15 19:38:39', 'product'), (36, 40, 1, 'available', '2024-12-14 23:59:04', '2024-12-15 19:38:39', 'product'), (37, 41, 1, 'available', '2024-12-14 23:59:40', '2024-12-15 19:38:39', 'product'), (38, 42, 1, 'available', '2024-12-14 23:59:54', '2024-12-15 19:38:39', 'product'), (39, 43, 1, 'available', '2024-12-15 00:00:54', '2024-12-15 19:38:39', 'product'), (40, 44, 1, 'available', '2024-12-15 00:02:39', '2024-12-15 19:38:39', 'product'), (41, 45, 1, 'available', '2024-12-15 00:03:05', '2024-12-15 19:38:39', 'product'), (42, 46, 1, 'available', '2024-12-15 00:03:36', '2024-12-15 19:38:39', 'product'), (43, 47, 1, 'available', '2024-12-15 00:04:42', '2024-12-15 19:38:39', 'product'), (44, 48, 1, 'available', '2024-12-15 00:05:19', '2024-12-15 19:38:39', 'product'), (45, 49, 1, 'available', '2024-12-15 00:05:55', '2024-12-15 19:38:39', 'product'), (46, 50, 1, 'available', '2024-12-15 00:06:20', '2024-12-15 19:38:39', 'product'), (47, 51, 1, 'available', '2024-12-15 00:06:41', '2024-12-15 19:38:39', 'product'), (48, 52, 1, 'available', '2024-12-15 00:07:44', '2024-12-15 19:38:39', 'product'), (49, 53, 1, 'available', '2024-12-15 00:09:12', '2024-12-15 19:38:39', 'product'), (50, 54, 1, 'available', '2024-12-15 00:10:08', '2024-12-15 19:38:39', 'product'), (51, 55, 1, 'available', '2024-12-15 00:11:43', '2024-12-15 19:38:39', 'product'), (52, 43, 2, 'available', '2024-12-15 20:10:27', '2024-12-15 21:13:18', 'accessory'), (53, 56, 1, 'available', '2024-12-19 16:19:58', '2024-12-19 16:22:31', 'product'), (54, 57, 1, 'available', '2024-12-19 16:20:15', '2024-12-19 16:22:08', 'product'), (55, 58, 1, 'available', '2024-12-19 16:21:26', '2024-12-19 16:21:54', 'product'), (56, 45, 0, 'available', '2024-12-21 01:18:02', '2024-12-21 01:18:02', 'accessory'), (57, 46, 0, 'available', '2024-12-21 01:18:58', '2024-12-21 01:18:58', 'accessory'), (58, 47, 0, 'available', '2024-12-21 11:14:52', '2024-12-21 11:14:52', 'accessory');
COMMIT;

-- ----------------------------
-- Table structure for Library
-- ----------------------------
DROP TABLE IF EXISTS `Library`;
CREATE TABLE `Library`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Library
-- ----------------------------
BEGIN;
INSERT INTO `Library` (`id`, `name`, `created_at`, `updated_at`) VALUES (3, 'Checkin', '2024-12-15 01:44:48', '2024-12-15 01:46:44'), (4, 'Sinh nhật', '2024-12-15 01:45:26', '2024-12-15 01:45:26'), (5, 'Đám cưới', '2024-12-15 01:45:36', '2024-12-15 01:45:36'), (6, 'Dạ hội', '2024-12-15 01:45:42', '2024-12-15 01:45:42'), (7, 'Chụp ảnh noel', '2024-12-15 01:46:52', '2024-12-15 01:46:52'), (8, 'Chụp ảnh tết', '2024-12-15 01:46:58', '2024-12-15 01:46:58'), (9, 'Hẹn hò', '2024-12-15 01:47:07', '2024-12-15 01:47:07'), (10, 'Cháy phố', '2024-12-15 01:47:40', '2024-12-15 01:47:40');
COMMIT;

-- ----------------------------
-- Table structure for OrderItems
-- ----------------------------
DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE `OrderItems`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit_price` decimal(10, 2) NULL DEFAULT NULL,
  `total_price` decimal(10, 2) NULL DEFAULT NULL,
  `quantity` int(11) NULL DEFAULT 1,
  `order_id` int(11) NULL DEFAULT NULL,
  `variant_id` int(11) NULL DEFAULT NULL,
  `status` enum('pending','success','cancelled') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'pending',
  `selected_size` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `selected_color` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `product_id`(`variant_id`) USING BTREE,
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `Variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of OrderItems
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for Orders
-- ----------------------------
DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `total_price` decimal(10, 2) NULL DEFAULT NULL,
  `customer_id` int(11) NULL DEFAULT NULL,
  `shipping_address` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `delivery_date` date NULL DEFAULT NULL,
  `payment_method` enum('cash','transfer') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'cash',
  `status` enum('pending','success','partial_cancelled','cancelled') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `customer_id`(`customer_id`) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Orders
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for OtpExpires
-- ----------------------------
DROP TABLE IF EXISTS `OtpExpires`;
CREATE TABLE `OtpExpires`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `otp` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `expired` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of OtpExpires
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for ProductLibrary
-- ----------------------------
DROP TABLE IF EXISTS `ProductLibrary`;
CREATE TABLE `ProductLibrary`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NULL DEFAULT NULL,
  `library_id` int(11) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  INDEX `library_id`(`library_id`) USING BTREE,
  CONSTRAINT `productlibrary_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `productlibrary_ibfk_2` FOREIGN KEY (`library_id`) REFERENCES `Library` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of ProductLibrary
-- ----------------------------
BEGIN;
INSERT INTO `ProductLibrary` (`id`, `product_id`, `library_id`, `created_at`, `updated_at`) VALUES (9, 44, 8, '2024-12-23 23:13:47', '2024-12-23 23:13:47'), (10, 39, 8, '2024-12-23 23:13:53', '2024-12-23 23:13:53');
COMMIT;

-- ----------------------------
-- Table structure for Products
-- ----------------------------
DROP TABLE IF EXISTS `Products`;
CREATE TABLE `Products`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `images` json NULL,
  `import_price` decimal(10, 0) NULL DEFAULT NULL,
  `rental_price` decimal(10, 0) NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `status` enum('available','unavailable') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'available',
  `category_id` int(11) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `item_type` enum('product','accessory') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'product',
  `slug` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `thumbnail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `category_id`(`category_id`) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Products
-- ----------------------------
BEGIN;
INSERT INTO `Products` (`id`, `name`, `description`, `images`, `import_price`, `rental_price`, `notes`, `status`, `category_id`, `created_at`, `updated_at`, `item_type`, `slug`, `thumbnail`) VALUES (5, 'Áo dài lông vũ buộc nơ cách điệu, áo dài cách tân gấm hoa tua rua kèm quần lụa( hàng có sẵn)', '1', '[\"http://localhost:5005/uploads/1734233543471_469182820_1085083306432014_4667607577892372089_n.jpg\", \"http://localhost:5005/uploads/1734233543474_467744592_1113973500118561_6563435071209560683_n.jpg\", \"http://localhost:5005/uploads/1734233543473_468704183_599759709178273_4669143613987979107_n.jpg\"]', 184000, 65000, NULL, 'available', NULL, '2024-11-28 13:44:59', '2024-12-23 23:15:51', 'product', 'ao-dai-long-vu-buoc-no-cach-ieu-ao-dai-cach-tan-gam-hoa-tua-rua-kem-quan-lua-hang-co-san', NULL), (6, 'SET ÁO DÀI GẤM HOA ĐÍNH NƠ CÚC NGỌC BÁCH ĐIỀN KÈM QUẦN DÀI SIÊU XINH AD2', NULL, '[\"http://localhost:5005/uploads/1734233277157_465105820_3856609584554761_694050046694222578_n.jpg\", \"http://localhost:5005/uploads/1734233277154_465105820_3856609637888089_5211354994980019199_n.jpg\", \"http://localhost:5005/uploads/1734233277158_465267708_3856609601221426_5164832313921856342_n.jpg\", \"http://localhost:5005/uploads/1734233277159_465219325_3856609607888092_1550451772201786638_n.jpg\", \"http://localhost:5005/uploads/1734233277160_465124894_3856609574554762_6725095680851755538_n.jpg\"]', 289000, 65000, NULL, 'available', NULL, '2024-11-28 16:08:55', '2024-12-23 23:15:49', 'product', 'set-ao-dai-gam-hoa-inh-no-cuc-ngoc-bach-ien-kem-quan-dai-sieu-xinh-ad2', NULL), (8, 'Đầm trễ Vai Bánh Bèo MELLYSTORE Váy Bánh Bèo Chất Liệu Tơ Nến Màu Trắng Cao Cấp Đẹp Quyến Rũ Sang Trọng Đầm Thiết Kế 01', NULL, '[\"http://localhost:5005/uploads/1734234487625_432450727_1570183653715685_8970882825845740705_n.jpg\", \"http://localhost:5005/uploads/1734234487627_432447960_847400237208145_6200780487573485677_n.jpg\", \"http://localhost:5005/uploads/1734234487628_432500112_375815791885700_2204911066229108948_n.jpg\", \"http://localhost:5005/uploads/1734234487630_432458819_950397636570992_5640476814098815597_n.jpg\"]', 299000, 70000, NULL, 'available', NULL, '2024-11-28 16:10:53', '2024-12-23 23:15:44', 'product', 'am-tre-vai-banh-beo-mellystore-vay-banh-beo-chat-lieu-to-nen-mau-trang-cao-cap-ep-quyen-ru-sang-trong-am-thiet-ke-01', NULL), (9, 'ZONGYAN váy Đầm váy nữ body đầm Phong cách Thời trang Thể thao hàn quốc', NULL, '[\"http://localhost:5005/uploads/1732785344513_sg-11134201-7rd3t-luaaxu5snz8uca.webp\", \"http://localhost:5005/uploads/1734234576957_450447792_1512956669643747_1444867716537817457_n.jpg\", \"http://localhost:5005/uploads/1734234576956_450445272_983284860255944_2698567045596581072_n.jpg\", \"http://localhost:5005/uploads/1734234576958_450277549_1002441111411423_7068910942447251567_n.jpg\", \"http://localhost:5005/uploads/1734234576959_450445251_392750849938511_1981603468568941973_n.jpg\", \"http://localhost:5005/uploads/1734234576959_450283661_1004067444569056_4119933787879464007_n.jpg\"]', 184000, 60000, NULL, 'available', NULL, '2024-11-28 16:15:56', '2024-12-23 23:15:41', 'product', 'zongyan-vay-am-vay-nu-body-am-phong-cach-thoi-trang-the-thao-han-quoc', NULL), (10, 'Weird Puss Weird Pus Đầm Hai Dây Lệch Tà Nhẹ Nhàng Thanh Lịch Màu Đen Mùa Đông Lộng Lẫy Sang Trọng Ngọt Ngào', NULL, '[\"http://localhost:5005/uploads/1732785392478_sg-11134201-7rbk9-lplp748tvt9ab6.webp\", \"http://localhost:5005/uploads/1734234852529_femboy-wear-sexy-black-asymmetrical-tube-dress-with-gloves-for-femboy.jpg\", \"http://localhost:5005/uploads/1734234852531_femboy-wear-black-asymmetrical-tube-dress-with-gloves-for-femboy.jpg\", \"http://localhost:5005/uploads/1734234852531_femboy-wear-cute-black-asymmetrical-tube-dress-with-gloves.jpg\"]', 269241, 70000, NULL, 'available', NULL, '2024-11-28 16:16:41', '2024-12-23 23:15:38', 'product', 'weird-puss-weird-pus-am-hai-day-lech-ta-nhe-nhang-thanh-lich-mau-en-mua-ong-long-lay-sang-trong-ngot-ngao', NULL), (11, 'Đầm Xếp Li Eo Li Ngực Rớt Vai Xoè 4 Tầng Kèm Hoa Chocker Quý Phái, Đầm Váy Dự Tiệc Sang Chảnh, Đầm Váy Tôn Dáng', NULL, '[\"http://localhost:5005/uploads/1734234941319_466735093_542073025422353_1248347595709075891_n.jpg\", \"http://localhost:5005/uploads/1734234941320_466569225_573494191761350_5654605014046351862_n.jpg\", \"http://localhost:5005/uploads/1734234941317_461841345_1058852126251288_7083311182857564402_n.jpg\", \"http://localhost:5005/uploads/1734234941321_466801092_1227598651627411_3769003183481984076_n.jpg\", \"http://localhost:5005/uploads/1734234941322_461783906_1058852129584621_1600232321488314309_n.jpg\", \"http://localhost:5005/uploads/1734234941323_461777095_1058852122917955_3955565875861572287_n.jpg\"]', 234000, 70000, NULL, 'available', NULL, '2024-11-28 16:17:33', '2024-12-23 23:15:34', 'product', 'am-xep-li-eo-li-nguc-rot-vai-xoe-4-tang-kem-hoa-chocker-quy-phai-am-vay-du-tiec-sang-chanh-am-vay-ton-dang', NULL), (12, 'SAILIWEI váy Đầm váy nữ body đầm Casual phổ biến Vintage Phong cách', NULL, '[\"http://localhost:5005/uploads/1734235068652_465717767_932568342051951_3528579445199090636_n.jpg\", \"http://localhost:5005/uploads/1734235068651_465363775_1197116604684212_8480317830467079035_n.jpg\"]', 160550, 65000, NULL, 'available', NULL, '2024-11-28 16:18:09', '2024-12-23 23:15:31', 'product', 'sailiwei-vay-am-vay-nu-body-am-casual-pho-bien-vintage-phong-cach', NULL), (13, 'Váy body trễ vai len nhung dài tay đầm body đỏ trễ vai váy mặc tết co giãn tôn dáng slay, quyến rũ', NULL, '[\"http://localhost:5005/uploads/1732785530218_vn-11134207-7ras8-m10xzz4vcnx753.webp\", \"http://localhost:5005/uploads/1734235206486_401097069_692733076120846_3284720035019411437_n.jpg\", \"http://localhost:5005/uploads/1734235206487_400188785_306295458883213_5933568174202043680_n.jpg\", \"http://localhost:5005/uploads/1734235206488_400139983_2065175537179388_1913559896093614580_n.jpg\", \"http://localhost:5005/uploads/1734235206489_449363692_328064850353909_8601012995492959953_n.jpg\"]', 148500, 65000, NULL, 'available', NULL, '2024-11-28 16:18:52', '2024-12-23 23:15:29', 'product', 'vay-body-tre-vai-len-nhung-dai-tay-am-body-o-tre-vai-vay-mac-tet-co-gian-ton-dang-slay-quyen-ru', NULL), (14, 'VÁY TƠ TRỄ VAI ĐÍNH NƠ LAMY TIỂU THƯ SIÊU XINH', NULL, '[\"http://localhost:5005/uploads/1732785588637_vn-11134207-7r98o-lyukc9gfcax9ca.webp\", \"http://localhost:5005/uploads/1734235302737_463296688_3727734754147957_3323917202189874937_n.jpg\", \"http://localhost:5005/uploads/1734235302736_463952456_521892550469965_6440564927070282508_n.jpg\", \"http://localhost:5005/uploads/1734235302737_463800848_1062476825572879_1971605253504580162_n.jpg\", \"http://localhost:5005/uploads/1734235302738_long-5_4fa762aff9d1441cbd2b8aba83b6b1aa_master.jpg\"]', 153790, 65000, NULL, 'available', NULL, '2024-11-28 16:19:50', '2024-12-23 23:15:26', 'product', 'vay-to-tre-vai-inh-no-lamy-tieu-thu-sieu-xinh', NULL), (15, 'Set hai món nữ: Áo sơ mi tay dài kèm chân váy đính hoa chất lụa tơ cao cấp màu đen sang trọng phù hợp đi dự tiệc', NULL, '[\"http://localhost:5005/uploads/1734235445352_449338533_18189714439294689_8998220342500827454_n.jpg\", \"http://localhost:5005/uploads/1734235445354_449701037_18189714430294689_8552030278026025673_n.jpg\", \"http://localhost:5005/uploads/1734235445355_449337848_18189714451294689_3599878760691196681_n.jpg\", \"http://localhost:5005/uploads/1734235445357_449437917_18189714460294689_7216259963832657574_n.jpg\"]', 224400, 65000, NULL, 'available', NULL, '2024-11-28 16:20:46', '2024-12-23 23:15:24', 'product', 'set-hai-mon-nu-ao-so-mi-tay-dai-kem-chan-vay-inh-hoa-chat-lua-to-cao-cap-mau-en-sang-trong-phu-hop-i-du-tiec', NULL), (16, 'Váy Trễ Vai Kẻ Sọc Nơ Nhỏ Dáng Babydoll Xinh Đẹp', NULL, '[\"http://localhost:5005/uploads/1732785682670_vn-11134207-7r98o-lu7zbra3k2739a.webp\", \"http://localhost:5005/uploads/1734235550213_464420930_2069165950153223_142671167392467598_n.jpg\"]', 93600, 65000, NULL, 'available', NULL, '2024-11-28 16:21:24', '2024-12-23 23:15:21', 'product', 'vay-tre-vai-ke-soc-no-nho-dang-babydoll-xinh-ep', NULL), (17, 'Đầm đen trễ vai phối xếp ly trắng co giãn ôm body nữ, Phong cách tiểu thư', '', '[\"http://localhost:5005/uploads/1734235615022_459034075_508045851946676_3813602348626983452_n.jpg\", \"http://localhost:5005/uploads/1734235615020_459226206_1034917417942873_2230405367905283744_n.jpg\", \"http://localhost:5005/uploads/1734235615023_459025767_481726581359004_3686615033253424159_n.jpg\", \"http://localhost:5005/uploads/1734235615031_459032859_3652427365007916_7329842868826384959_n.jpg\", \"http://localhost:5005/uploads/1734235615025_459227213_1063806562001936_1528877354851178240_n.jpg\", \"http://localhost:5005/uploads/1734235615034_459160517_1086312642964371_8065241157539774894_n.jpg\"]', 245700, 65000, NULL, 'available', NULL, '2024-11-28 16:22:39', '2024-12-23 23:15:17', 'product', 'am-en-tre-vai-phoi-xep-ly-trang-co-gian-om-body-nu-phong-cach-tieu-thu', NULL), (18, 'Đầm 2 dây tơ nhún có cúp ngực dáng xòe ngắn tiểu thư, váy trễ vai 2 dây nơ bánh bèo dúm thân kèm quần chất tơ xốp', NULL, '[\"http://localhost:5005/uploads/1734235712442_439336776_403783225743965_7403362371104432179_n.jpg\", \"http://localhost:5005/uploads/1734235712446_439411744_403783192410635_354754357372255079_n.jpg\", \"http://localhost:5005/uploads/1734235712454_vn-11134207-7r98o-lw082qu4zbvde5.jpeg\"]', 149400, 50000, NULL, 'available', NULL, '2024-11-28 16:23:25', '2024-12-23 23:15:14', 'product', 'am-2-day-to-nhun-co-cup-nguc-dang-xoe-ngan-tieu-thu-vay-tre-vai-2-day-no-banh-beo-dum-than-kem-quan-chat-to-xop', NULL), (19, 'VÁY-ĐẦM KẺ SỌC CỔ VUÔNG THẮT NƠ TAY HẾN MAI PHƯƠNG BÙI form xoè siêu xinh', NULL, '[\"http://localhost:5005/uploads/1734199437266_449692280_997914228659201_6176184194409542006_n.jpg\", \"http://localhost:5005/uploads/1734199437269_449669867_1019946240136303_5668926872186778703_n.jpg\", \"http://localhost:5005/uploads/1734199437271_450139339_994099992438159_447352396946544091_n.jpg\", \"http://localhost:5005/uploads/1734199437277_450135644_842920567237541_963898585881723806_n.jpg\", \"http://localhost:5005/uploads/1734199550124_451082621_1016956683766549_8419502637835307763_n.jpg\", \"http://localhost:5005/uploads/1734199550123_451272179_1016956697099881_3680886383645213114_n.jpg\"]', 211950, 60000, NULL, 'available', NULL, '2024-11-28 16:24:23', '2024-12-23 23:15:11', 'product', 'vay-am-ke-soc-co-vuong-that-no-tay-hen-mai-phuong-bui-form-xoe-sieu-xinh', NULL), (20, 'Đầm đuôi cá phối bèo ngắn tay cổ vuông nữ chất voan 2 lớp', NULL, '[\"http://localhost:5005/uploads/1734235848304_vn-11134103-7r98o-lwis87w6384bcb.webp\", \"http://localhost:5005/uploads/1734235848306_vn-11134103-7ras8-m2jgeba2cur69c.webp\", \"http://localhost:5005/uploads/1734235848305_vn-11134103-7ras8-m0rjv8qmv9wt67.webp\", \"http://localhost:5005/uploads/1734235848307_vn-11134207-7r98o-lvlcklvkwo7l99 (1).webp\", \"http://localhost:5005/uploads/1734235848310_vn-11134207-7r98o-lvlcklvkh7ypd6.webp\", \"http://localhost:5005/uploads/1734235848311_vn-11134207-7r98o-lvlcklvlc464ef.webp\", \"http://localhost:5005/uploads/1734235848310_vn-11134207-7r98o-lvlcklvkh7oc07 (1).webp\"]', 177700, 65000, NULL, 'available', NULL, '2024-11-28 16:25:00', '2024-12-23 23:15:08', 'product', 'am-uoi-ca-phoi-beo-ngan-tay-co-vuong-nu-chat-voan-2-lop', NULL), (21, 'Váy Xanh Phối Beog Ngực Nơ Cổ Sơ Mi Thiết Kế Tay Chiết Bèo Chất Đũi Gân Xinh Xắn', NULL, '[\"http://localhost:5005/uploads/1732785982344_vn-11134207-7r98o-lyz7f6bhsashb5.webp\"]', 234700, 60000, NULL, 'available', NULL, '2024-11-28 16:26:36', '2024-12-23 23:15:06', 'product', 'vay-xanh-phoi-beog-nguc-no-co-so-mi-thiet-ke-tay-chiet-beo-chat-ui-gan-xinh-xan', NULL), (22, 'Đầm ren pháp cổ vuông nhún bèo ngực tinh tế sang trọng', NULL, '[\"http://localhost:5005/uploads/1732786033549_vn-11134207-7r98o-lxuzugapn07v06.webp\", \"http://localhost:5005/uploads/1734252431702_1734201614383_th-11134207-7r98o-ltqxo7g1yog85b.webp\", \"http://localhost:5005/uploads/1734252431704_1734201614382_th-11134207-7r98v-ltqxo7g1ugqw6d (1).webp\"]', 358425, 65000, NULL, 'available', NULL, '2024-11-28 16:27:14', '2024-12-23 23:15:02', 'product', 'am-ren-phap-co-vuong-nhun-beo-nguc-tinh-te-sang-trong', NULL), (23, 'Set Áo Trễ Vai Kèm Váy Ren Cổ Yếm Dáng Xoè TIBU Set Đồ Nữ Hai Món Quyến Rũ Sang Chảnh Đi Chơi Phố', NULL, '[\"http://localhost:5005/uploads/1732786087936_vn-11134207-7r98o-lzkloxb3z4wx95.webp\", \"http://localhost:5005/uploads/1734201130700_vn-11134207-7ras8-m0snanv1j2st3a.jpeg\", \"http://localhost:5005/uploads/1734201130703_vn-11134207-7ras8-m0snanv1khd987.jpeg\", \"http://localhost:5005/uploads/1734201130708_vn-11134207-7ras8-m0snanv1lw9b03.jpeg\", \"http://localhost:5005/uploads/1734201130707_vn-11134207-7ras8-m0snanv1natr1d.jpeg\", \"http://localhost:5005/uploads/1734201130710_vn-11134207-7ras8-m0snanv1j34f90.jpeg\", \"http://localhost:5005/uploads/1734201130725_458291542_1173599170540465_4263214759811680541_n.jpg\", \"http://localhost:5005/uploads/1734201130715_vn-11134207-7ras8-m0sn16ip1l2l9b.jpeg\", \"http://localhost:5005/uploads/1734201130727_458470270_1039743474170603_6018510000572683812_n.jpg\", \"http://localhost:5005/uploads/1734201130724_458462983_412092964829191_1515037124303086162_n.jpg\"]', 221200, 65000, NULL, 'available', NULL, '2024-11-28 16:28:09', '2024-12-23 23:14:58', 'product', 'set-ao-tre-vai-kem-vay-ren-co-yem-dang-xoe-tibu-set-o-nu-hai-mon-quyen-ru-sang-chanh-i-choi-pho', NULL), (24, 'ĐẦM REN HOA THIẾT KẾ TAY LOE XẺ siêu Hot. Đầm ren hoa ôm body cực sexy kèm quần bảo hộ', NULL, '[\"http://localhost:5005/uploads/1732786127516_vn-11134207-7r98o-lyo9mdfkzu01a2.webp\", \"http://localhost:5005/uploads/1734200990397_468832392_18172899955311818_6473938049732865476_n.jpg\", \"http://localhost:5005/uploads/1734200990393_468713511_18172900129311818_1283508111532926791_n.jpg\", \"http://localhost:5005/uploads/1734200990398_468641859_18172900024311818_5353553487447477285_n.jpg\"]', 182700, 50000, NULL, 'available', NULL, '2024-11-28 16:28:49', '2024-12-23 23:14:55', 'product', 'am-ren-hoa-thiet-ke-tay-loe-xe-sieu-hot-am-ren-hoa-om-body-cuc-sexy-kem-quan-bao-ho', NULL), (25, 'Đầm voan hoa dây xoè tầng kèm áo khoác rời', NULL, '[\"http://localhost:5005/uploads/1732786182863_vn-11134207-7r98o-lr0dnerkg5nd7d.webp\", \"http://localhost:5005/uploads/1734199753529_448207175_379837595094367_1851826811332001862_n.jpeg\", \"http://localhost:5005/uploads/1734199753533_447993764_430329093175940_8466338901127132113_n.jpeg\", \"http://localhost:5005/uploads/1734199753532_448169919_1157025168779435_5291167744260822675_n.jpeg\", \"http://localhost:5005/uploads/1734199753534_448207362_426025266928208_2172903460111612554_n.jpeg\"]', 197900, 65000, NULL, 'available', NULL, '2024-11-28 16:29:44', '2024-12-23 23:14:52', 'product', 'am-voan-hoa-day-xoe-tang-kem-ao-khoac-roi', NULL), (26, 'Đầm xoè cổ vuông caro xanh đính nơ TABISHOP Váy babydoll màu xanh biển ngọt ngào mặc hè đi biển xinh xắn', NULL, '[\"http://localhost:5005/uploads/1732786244367_vn-11134207-7r98o-ltuw167k8vey5a.webp\", \"http://localhost:5005/uploads/1734200812037_vn-11134207-7r98o-ltuw167kmx3eb6.webp\", \"http://localhost:5005/uploads/1734200812039_vn-11134207-7r98o-ltuw167kobnuc3.webp\", \"http://localhost:5005/uploads/1734200812040_vn-11134207-7r98o-ltuw168e4umlc3.webp\", \"http://localhost:5005/uploads/1734200812041_vn-11134207-7r98o-ltuw167k7gui9f.webp\", \"http://localhost:5005/uploads/1734200812042_z55465893250637096ff032bf7e3ab4d577cabaffd05461719128027.jpg\"]', 149000, 65000, NULL, 'available', NULL, '2024-11-28 16:30:47', '2024-12-23 23:14:50', 'product', 'am-xoe-co-vuong-caro-xanh-inh-no-tabishop-vay-babydoll-mau-xanh-bien-ngot-ngao-mac-he-i-bien-xinh-xan', NULL), (27, 'Đầm body cúp ngực form dài đính bông hoa TABISHOP Váy maxi trắng thiết kế tôn dáng đi dự tiệc đi biển đi chơi', NULL, '[\"http://localhost:5005/uploads/1732786279802_vn-11134207-7r98o-lyc4hrh7f4ul8e.webp\", \"http://localhost:5005/uploads/1734201326009_vn-11134207-7r98o-lyc4hri1dwzx5a.webp\", \"http://localhost:5005/uploads/1734201326012_461418963_3096753947131217_8564926679057909241_n.jpg\", \"http://localhost:5005/uploads/1734201326013_vn-11134207-7r98o-lyc4hri1td8t15.webp\", \"http://localhost:5005/uploads/1734201326016_vn-11134207-7r98o-lzfzdn471wo1c2@resize_w900_nl.webp\", \"http://localhost:5005/uploads/1734201326018_447870019_796539759284060_2207641380004905545_n.jpg\", \"http://localhost:5005/uploads/1734201326017_vn-11134207-7r98o-lydmwwjup8i594@resize_w900_nl.webp\"]', 169000, 70000, NULL, 'available', NULL, '2024-11-28 16:31:22', '2024-12-23 23:14:48', 'product', 'am-body-cup-nguc-form-dai-inh-bong-hoa-tabishop-vay-maxi-trang-thiet-ke-ton-dang-i-du-tiec-i-bien-i-choi', NULL), (28, 'Set váy body phối ren kèm áo trễ vai tay dài TABISHOP Set đồ nữ dễ thương mặc thu đông', NULL, '[\"http://localhost:5005/uploads/1732786307616_vn-11134207-7r98o-m031683iawod8d.webp\", \"http://localhost:5005/uploads/1734200649405_vn-11134207-7r98o-m07nlxp74m1b0c.webp\", \"http://localhost:5005/uploads/1734200649402_vn-11134207-7r98o-m07nlxrz0jjh97.webp\", \"http://localhost:5005/uploads/1734200649422_vn-11134207-7r98o-m07nlxodla4v40.webp\", \"http://localhost:5005/uploads/1734200649425_vn-11134207-7r98o-m07nlxod5tvz4b.webp\", \"http://localhost:5005/uploads/1734200649431_468242093_1107051554235718_107489935805201006_n.jpg\", \"http://localhost:5005/uploads/1734200649430_468298469_1040816144728486_1679035861570924125_n.jpg\", \"http://localhost:5005/uploads/1734200649428_468191443_1347511629563099_4593673682428963256_n.jpg\", \"http://localhost:5005/uploads/1734200649427_468219578_556462867016648_1138020127455652521_n.jpg\", \"http://localhost:5005/uploads/1734200649432_468205544_578164961331833_547089421421413271_n.jpg\"]', 189000, 70000, NULL, 'available', NULL, '2024-11-28 16:31:58', '2024-12-23 23:14:45', 'product', 'set-vay-body-phoi-ren-kem-ao-tre-vai-tay-dai-tabishop-set-o-nu-de-thuong-mac-thu-ong', NULL), (29, 'Đầm Body Len Rớt Tay Dài Dáng Ngắn Nơ Ruy Băng Ngực', NULL, '[\"http://localhost:5005/uploads/1732786363514_vn-11134207-7r98o-lq5zbvkhp0pe7d.webp\"]', 147700, 60000, NULL, 'available', NULL, '2024-11-28 16:32:45', '2024-12-23 23:14:40', 'product', 'am-body-len-rot-tay-dai-dang-ngan-no-ruy-bang-nguc', NULL), (30, 'Váy Dự Tiệc Dáng Baby Doll NV592 Váy Thiết Kế Vải Ren Hoa Nổi Tay Ống Loe Tôn Dáng Thanh lịch', NULL, '[\"http://localhost:5005/uploads/1732786408819_vn-11134207-7r98o-lsoctybxrul544.webp\", \"http://localhost:5005/uploads/1732786408822_vn-11134207-7r98o-lsoctybxt95l31.webp\"]', 225200, 65000, NULL, 'available', NULL, '2024-11-28 16:33:40', '2024-12-23 23:14:37', 'product', 'vay-du-tiec-dang-baby-doll-nv592-vay-thiet-ke-vai-ren-hoa-noi-tay-ong-loe-ton-dang-thanh-lich', NULL), (31, 'Đầm Body Dáng Ngắn Lệch Vai Tay Dài Đính Hoa Trẻ Trung', NULL, '[\"http://localhost:5005/uploads/1732786503955_vn-11134207-7r98o-luoympiwk26qf9.webp\", \"http://localhost:5005/uploads/1734200167262_vn-11134207-7r98o-lmrhlvtnxejj87.jpeg\", \"http://localhost:5005/uploads/1734200167251_vn-11134207-7r98o-lmrhlvto07hb8e.jpeg\", \"http://localhost:5005/uploads/1734200167302_vn-11134207-7r98o-luoympiwh91u7a.webp\", \"http://localhost:5005/uploads/1734200167278_vn-11134207-7r98o-lnoae6qkmc4td4.jpeg\", \"http://localhost:5005/uploads/1734200167294_vn-11134207-7r98o-lnoae6qv1drhff.jpeg\", \"http://localhost:5005/uploads/1734200167295_vn-11134207-7r98o-lmohtrumiacf22.jpeg\"]', 251900, 70000, NULL, 'available', NULL, '2024-11-28 16:35:13', '2024-12-23 23:14:34', 'product', 'am-body-dang-ngan-lech-vai-tay-dai-inh-hoa-tre-trung', NULL), (32, 'Áo và chân váy dạ croptop tuyết nhi', NULL, '[\"http://localhost:5005/uploads/1732786571772_sg-11134201-23020-li6ov612z3mva5.webp\", \"http://localhost:5005/uploads/1734197337677_tw-11134201-7r98r-lyp6sb2sk9h0e0.jpeg\"]', 322700, 60000, NULL, 'available', NULL, '2024-11-28 16:36:13', '2024-12-23 23:14:31', 'product', 'ao-va-chan-vay-da-croptop-tuyet-nhi', NULL), (33, 'ÁO KIỂU RÚT DÂY TAY LOE XINH XINH CHẤT GÂN TRUNG NP999', NULL, '[\"http://localhost:5005/uploads/1734236370629_vn-11134207-7r98o-lzvc5lhiy1ltbc@resize_w900_nl.webp\"]', 53000, 30000, NULL, 'available', NULL, '2024-12-15 11:19:33', '2024-12-23 23:14:25', 'product', 'ao-kieu-rut-day-tay-loe-xinh-xinh-chat-gan-trung-np999', NULL), (34, 'Áo trễ vai croptop áo thun nữ ngắn tay dáng ngắn ôm body chất vải thun cao cấp A250 PANOSI', NULL, '[\"http://localhost:5005/uploads/1734236407254_vn-11134207-7r98o-lu7abkh6d4pr33.webp\"]', 63000, 40000, NULL, 'available', NULL, '2024-12-15 11:20:09', '2024-12-23 23:14:15', 'product', 'ao-tre-vai-croptop-ao-thun-nu-ngan-tay-dang-ngan-om-body-chat-vai-thun-cao-cap-a250-panosi', NULL), (35, '#Áo tiểu thư phối ren cổ phong cách Tặng dây chuyền cao cấp khi mua 2Sp của shop', NULL, '[\"http://localhost:5005/uploads/1734236438675_vn-11134207-7r98o-lnwi6rwfqj8t0e.webp\"]', 158000, 50000, NULL, 'available', NULL, '2024-12-15 11:20:51', '2024-12-23 23:14:09', 'product', 'ao-tieu-thu-phoi-ren-co-phong-cach-tang-day-chuyen-cao-cap-khi-mua-2sp-cua-shop', NULL), (36, 'Đầm Xòe Tầng Cúp Phối Nhung Đỏ Trễ Vai Tay Phồng Đính Nơ Dây Đá - Nữ - Women, Xmas', NULL, '[\"http://localhost:5005/uploads/1734236520616_d0a068cd8135421695ac39d97789b705~tplv-o3syd03w52-resize-jpeg_800_800.jpeg\", \"http://localhost:5005/uploads/1734236520619_00299229893d43b0933ec70cf5cc2cde~tplv-o3syd03w52-resize-jpeg_800_800.jpeg\", \"http://localhost:5005/uploads/1734236520626_5f2d814d3121421ca88588e12af1b631~tplv-o3syd03w52-resize-jpeg_800_800.jpeg\", \"http://localhost:5005/uploads/1734236520632_78e2126a180c4eab8ffed25460df82b0~tplv-o3syd03w52-resize-jpeg_800_800 (1).jpeg\"]', 169000, 65000, NULL, 'available', NULL, '2024-12-15 11:22:12', '2024-12-23 23:25:58', 'product', 'am-xoe-tang-cup-phoi-nhung-o-tre-vai-tay-phong-inh-no-day-a-nu-women-xmas', NULL), (37, 'Set yếm xẻ Đùi Kèm Áo Bo Tăm Chất Liệu Co Giãn Có Quần Trong, Set Xinh 2 Món', NULL, '[\"http://localhost:5005/uploads/1734236602083_vn-11134207-7r98o-lkn9c2ujqaa8e6.webp\", \"http://localhost:5005/uploads/1734236602085_vn-11134207-7r98o-lkn9c2ujm2kw6d.webp\", \"http://localhost:5005/uploads/1734236602086_vn-11134207-7r98o-lkn9c2ujhuvk96.webp\", \"http://localhost:5005/uploads/1734236602087_vn-11134207-7r98o-lkn9c2ujj9g0a3.webp\", \"http://localhost:5005/uploads/1734236602087_vn-11134207-7r98o-lkn9c2ujt3f4a3.webp\"]', 85000, 40000, NULL, 'available', NULL, '2024-12-15 11:23:33', '2024-12-23 23:14:01', 'product', 'set-yem-xe-ui-kem-ao-bo-tam-chat-lieu-co-gian-co-quan-trong-set-xinh-2-mon', NULL), (38, 'Áo kiểu Hàn Quốc Croptop tay dài vải voan mềm dáng tiểu thư sang chảnh A112', NULL, '[\"http://localhost:5005/uploads/1734236692840_vn-11134207-7qukw-ljtro7ze8wxgb0.webp\", \"http://localhost:5005/uploads/1734236692841_vn-11134207-7qukw-ljtro7zeabcy28.webp\"]', 59250, 40000, NULL, 'available', NULL, '2024-12-15 11:24:56', '2024-12-23 23:13:24', 'product', 'ao-kieu-han-quoc-croptop-tay-dai-vai-voan-mem-dang-tieu-thu-sang-chanh-a112', NULL), (39, 'Áo dài truyền thống kèm phụ kiện Kiềng, Khăn choàng', NULL, '[\"http://localhost:5005/uploads/1734601798140_ktstyle02.jpeg\", \"http://localhost:5005/uploads/1734601798144_ktstyle03.jpeg\", \"http://localhost:5005/uploads/1734601798153_ktstyle04.jpeg\", \"http://localhost:5005/uploads/1734601798160_ktstyle05.jpeg\", \"http://localhost:5005/uploads/1734601798163_ktstyle07.jpeg\", \"http://localhost:5005/uploads/1734601798165_ktstyle06.jpeg\", \"http://localhost:5005/uploads/1734601798168_ktstyle08.jpeg\", \"http://localhost:5005/uploads/1734601798172_ktstyle09.jpeg\", \"http://localhost:5005/uploads/1734601798180_ktstyle10.jpeg\", \"http://localhost:5005/uploads/1734601798183_ktstyle12.jpeg\", \"http://localhost:5005/uploads/1734601798183_ktstyle11.jpeg\", \"http://localhost:5005/uploads/1734601798186_ktstyle13.jpeg\", \"http://localhost:5005/uploads/1734601798188_ktstyle14.jpeg\", \"http://localhost:5005/uploads/1734601798192_ktstyle15.jpeg\", \"http://localhost:5005/uploads/1734601798203_ktstyle16.jpeg\"]', 275000, 65000, NULL, 'available', 12, '2024-12-15 18:49:19', '2024-12-23 23:13:53', 'product', 'ao-dai-truyen-thong-kem-phu-kien-kieng-khan-choang', NULL), (44, 'Áo dài tết', NULL, '[\"http://localhost:5005/uploads/1734602518703_468698485_623228973572463_3969258217498765938_n.jpg\", \"http://localhost:5005/uploads/1734602518708_468456377_1088738472901403_789358451132757375_n.jpg\", \"http://localhost:5005/uploads/1734602520803_468457443_455340513888967_428030685693729745_n.jpg\"]', 290000, 75000, NULL, 'available', 12, '2024-12-19 16:59:29', '2024-12-23 23:13:48', 'product', 'ao-dai-tet', NULL), (45, 'Kiềng', NULL, '[\"http://localhost:5005/uploads/1734718680571_IMG_5539.JPG\", \"http://localhost:5005/uploads/1734718680572_IMG_5538.JPG\"]', 131000, 20000, NULL, 'available', NULL, '2024-12-21 01:18:02', '2024-12-23 23:16:05', 'accessory', 'kieng', NULL), (46, 'Khăn choàng cổ chụp áo dài', NULL, '[\"http://localhost:5005/uploads/1734718732769_ktstyle04.jpeg\", \"http://localhost:5005/uploads/1734718737761_ktstyle05.jpeg\"]', 160000, 30000, NULL, 'available', NULL, '2024-12-21 01:18:59', '2024-12-23 23:21:02', 'accessory', 'khan-choang-co-chup-ao-dai', NULL), (47, 'Quạt gỗ', NULL, '[\"http://localhost:5005/uploads/1734754490026_41605ef27b8403d5146397d97b17eb19.webp\", \"http://localhost:5005/uploads/1734754490029_cba09c0d-5500-482f-aaa5-ecd66c82b2a6.jpeg\"]', 20000, 10000, NULL, 'available', NULL, '2024-12-21 11:14:52', '2024-12-23 23:15:59', 'accessory', 'quat-go', NULL);
COMMIT;

-- ----------------------------
-- Table structure for Rentals
-- ----------------------------
DROP TABLE IF EXISTS `Rentals`;
CREATE TABLE `Rentals`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `variant_id` int(11) NULL DEFAULT NULL,
  `customer_id` int(11) NULL DEFAULT NULL,
  `start_date` datetime NULL DEFAULT NULL,
  `end_date` datetime NULL DEFAULT NULL,
  `shiped_date` date NULL DEFAULT NULL,
  `return_date` date NULL DEFAULT NULL,
  `status` enum('rented','returned','late') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'rented',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `inventory_id`(`variant_id`) USING BTREE,
  INDEX `customer_id`(`customer_id`) USING BTREE,
  INDEX `fk_order_id`(`order_id`) USING BTREE,
  CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_variant_id` FOREIGN KEY (`variant_id`) REFERENCES `Variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Rentals
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for Topics
-- ----------------------------
DROP TABLE IF EXISTS `Topics`;
CREATE TABLE `Topics`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Topics
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for Transactions
-- ----------------------------
DROP TABLE IF EXISTS `Transactions`;
CREATE TABLE `Transactions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `amount` decimal(10, 2) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Transactions
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for Variants
-- ----------------------------
DROP TABLE IF EXISTS `Variants`;
CREATE TABLE `Variants`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NULL DEFAULT NULL,
  `size` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `color` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8 COLLATE = utf8_general_ci;

-- ----------------------------
-- Records of Variants
-- ----------------------------
BEGIN;
INSERT INTO `Variants` (`id`, `product_id`, `size`, `color`, `created_at`, `updated_at`) VALUES (28, 30, 'M', 'kem', '2024-11-28 11:25:29', '2024-12-15 00:12:55'), (29, 29, 'Freesize', 'Đen', '2024-11-29 06:34:34', '2024-12-15 00:12:13'), (31, 31, 'S', 'Đen', '2024-11-29 08:19:30', '2024-11-29 08:19:30'), (32, 32, 'S', 'trắng', '2024-11-29 08:30:30', '2024-12-15 00:14:37'), (33, 5, 'M', 'trắng', '2024-12-14 23:52:49', '2024-12-14 23:52:49'), (34, 6, 'S', 'Đỏ', '2024-12-14 23:53:20', '2024-12-14 23:53:20'), (35, 8, 'S', 'Trắng', '2024-12-14 23:56:14', '2024-12-14 23:56:14'), (36, 9, 'M', 'nâu', '2024-12-14 23:56:44', '2024-12-14 23:56:44'), (37, 10, 'M', 'Đen', '2024-12-14 23:57:07', '2024-12-14 23:57:07'), (38, 11, 'S', 'trắng', '2024-12-14 23:57:21', '2024-12-14 23:57:21'), (39, 12, 'L', 'trắng', '2024-12-14 23:58:44', '2024-12-14 23:58:44'), (40, 13, 'S', 'đỏ', '2024-12-14 23:59:04', '2024-12-14 23:59:04'), (41, 14, 'S', 'be', '2024-12-14 23:59:40', '2024-12-14 23:59:40'), (42, 15, 'M', 'đen', '2024-12-14 23:59:54', '2024-12-14 23:59:54'), (43, 16, 'Freesize', 'xanh', '2024-12-15 00:00:54', '2024-12-15 00:00:54'), (44, 17, 'S', 'trắng đen', '2024-12-15 00:02:39', '2024-12-15 00:02:39'), (45, 18, 'S', 'hồng', '2024-12-15 00:03:05', '2024-12-15 00:03:05'), (46, 19, 'S', 'xanh than', '2024-12-15 00:03:36', '2024-12-15 00:03:36'), (47, 20, 'S', 'trắng', '2024-12-15 00:04:42', '2024-12-15 00:04:42'), (48, 21, 'S', 'xanh', '2024-12-15 00:05:19', '2024-12-15 00:05:19'), (49, 22, 'S', 'trắng', '2024-12-15 00:05:55', '2024-12-15 00:05:55'), (50, 23, 'Freesize', 'xám tro', '2024-12-15 00:06:20', '2024-12-15 00:06:20'), (51, 24, 'S', 'đen', '2024-12-15 00:06:41', '2024-12-15 00:06:41'), (52, 25, 'M', 'trắng', '2024-12-15 00:07:44', '2024-12-15 00:07:44'), (53, 26, 'S', 'xanh', '2024-12-15 00:09:12', '2024-12-15 00:09:12'), (54, 27, 'S', 'trắng', '2024-12-15 00:10:08', '2024-12-15 00:10:08'), (55, 28, 'S', 'xám', '2024-12-15 00:11:43', '2024-12-15 00:11:43'), (56, 35, 'S', 'Hồng', '2024-12-19 16:19:58', '2024-12-19 16:19:58'), (57, 36, 'S', 'Đỏ', '2024-12-19 16:20:15', '2024-12-19 16:20:15'), (58, 39, 'S', 'Đen', '2024-12-19 16:21:26', '2024-12-19 16:21:26');
COMMIT;

-- ----------------------------
-- Table structure for inventory_history
-- ----------------------------
DROP TABLE IF EXISTS `inventory_history`;
CREATE TABLE `inventory_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inventory_id` int(11) NOT NULL,
  `transaction_type` enum('import','export') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `amount` decimal(10, 0) NOT NULL,
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity_before` int(11) NULL DEFAULT 0,
  `quantity_after` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `inventory_id`(`inventory_id`) USING BTREE,
  CONSTRAINT `inventory_history_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `Inventory` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 40 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ----------------------------
-- Records of inventory_history
-- ----------------------------
BEGIN;
INSERT INTO `inventory_history` (`id`, `inventory_id`, `transaction_type`, `quantity`, `amount`, `source`, `note`, `created_at`, `quantity_before`, `quantity_after`) VALUES (8, 24, 'import', 1, 225200, 'shopee', '', '2024-12-15 00:16:21', 0, 1), (9, 25, 'import', 1, 147700, 'shopee', '', '2024-12-15 00:16:40', 0, 1), (10, 27, 'import', 1, 251900, 'shopee', '', '2024-12-15 00:16:54', 0, 1), (11, 28, 'import', 1, 322700, 'shopee', '', '2024-12-15 00:17:12', 0, 1), (12, 29, 'import', 1, 184000, 'shopee', '', '2024-12-15 00:17:27', 0, 1), (13, 30, 'import', 1, 289000, 'shopee', '', '2024-12-15 00:17:41', 0, 1), (14, 31, 'import', 1, 299000, 'shopee', '', '2024-12-15 00:17:57', 0, 1), (15, 32, 'import', 1, 184000, 'shopee', '', '2024-12-15 00:18:11', 0, 1), (16, 33, 'import', 1, 269241, 'shopee', '', '2024-12-15 00:18:38', 0, 1), (17, 34, 'import', 1, 234000, 'shopee', '', '2024-12-15 00:18:51', 0, 1), (18, 35, 'import', 1, 160550, 'shopee', '', '2024-12-15 00:19:10', 0, 1), (19, 36, 'import', 1, 148500, 'shopee', '', '2024-12-15 00:19:19', 0, 1), (20, 37, 'import', 1, 153790, 'shopee', '', '2024-12-15 00:19:34', 0, 1), (21, 38, 'import', 1, 224400, 'shopee', '', '2024-12-15 00:19:42', 0, 1), (22, 39, 'import', 1, 93600, 'shopee', '', '2024-12-15 00:20:02', 0, 1), (23, 40, 'import', 1, 245700, 'shopee', '', '2024-12-15 00:20:23', 0, 1), (24, 41, 'import', 1, 149400, 'shopee', '', '2024-12-15 00:20:35', 0, 1), (25, 42, 'import', 1, 211950, 'shopee', '', '2024-12-15 00:20:57', 0, 1), (26, 43, 'import', 1, 177700, 'shopee', '', '2024-12-15 00:21:56', 0, 1), (27, 44, 'import', 1, 234700, 'shopee', '', '2024-12-15 00:22:06', 0, 1), (28, 45, 'import', 1, 358425, 'shopee', '', '2024-12-15 00:22:19', 0, 1), (29, 46, 'import', 1, 221200, 'shopee', '', '2024-12-15 00:22:41', 0, 1), (30, 47, 'import', 1, 182700, 'shopee', '', '2024-12-15 00:22:51', 0, 1), (31, 48, 'import', 1, 197900, 'shopee', '', '2024-12-15 00:23:05', 0, 1), (32, 49, 'import', 1, 149000, 'shopee', '', '2024-12-15 00:23:14', 0, 1), (33, 50, 'import', 1, 169000, 'shopee', '', '2024-12-15 00:23:22', 0, 1), (34, 51, 'import', 1, 189000, 'shopee', '', '2024-12-15 00:23:31', 0, 1), (35, 52, 'import', 1, 20000, 'shopee', '', '2024-12-15 20:51:58', 0, 1), (36, 52, 'import', 1, 2222, 'shopee', '', '2024-12-15 21:13:19', 1, 2), (37, 55, 'import', 1, 275000, 'shopee', '', '2024-12-19 16:21:55', 0, 1), (38, 54, 'import', 1, 169000, 'shopee', '', '2024-12-19 16:22:09', 0, 1), (39, 53, 'import', 1, 158000, 'shopee', '', '2024-12-19 16:22:31', 0, 1);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
