/*
 Navicat Premium Data Transfer

 Source Server         : 103.56.160.196
 Source Server Type    : MySQL
 Source Server Version : 80300 (8.3.0)
 Source Host           : 103.56.160.196:3307
 Source Schema         : quan_ly_quan_ao

 Target Server Type    : MySQL
 Target Server Version : 80300 (8.3.0)
 File Encoding         : 65001

 Date: 30/12/2024 09:20:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Categories
-- ----------------------------
DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `parent_id` int NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `parent_id`(`parent_id` ASC) USING BTREE,
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- ----------------------------
-- Records of Categories
-- ----------------------------
BEGIN;
INSERT INTO `Categories` (`id`, `name`, `parent_id`, `created_at`, `updated_at`) VALUES (8, 'quần body 123', NULL, '2024-11-24 19:19:20', '2024-11-24 19:19:26'), (9, 'quần đùi', 8, '2024-11-26 07:18:46', '2024-11-26 07:18:46'), (10, 'test', NULL, '2024-11-26 07:18:52', '2024-11-26 07:18:52');
COMMIT;

-- ----------------------------
-- Table structure for Colors
-- ----------------------------
DROP TABLE IF EXISTS `Colors`;
CREATE TABLE `Colors`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `hex_code` varchar(7) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `rgb_code` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NULL DEFAULT NULL,
  `topic_id` int NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL,
  `image_urls` json NULL,
  `status` enum('draft','published','scheduled') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'draft',
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  INDEX `topic_id`(`topic_id` ASC) USING BTREE,
  CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `contents_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `Topics` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `is_verify` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dob` date NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- ----------------------------
-- Records of Customers
-- ----------------------------
BEGIN;
INSERT INTO `Customers` (`id`, `name`, `phone`, `is_verify`, `created_at`, `updated_at`, `dob`) VALUES (1, 'asdvdf', '08838247234', 0, '2024-11-25 01:56:12', '2024-11-26 08:31:12', '2004-04-25');
COMMIT;

-- ----------------------------
-- Table structure for Inventory
-- ----------------------------
DROP TABLE IF EXISTS `Inventory`;
CREATE TABLE `Inventory`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `variant_id` int NOT NULL,
  `quantity` int NULL DEFAULT 0,
  `status` enum('available','unavailable') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `inventory_ibfk_1`(`variant_id` ASC) USING BTREE,
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `Variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- ----------------------------
-- Records of Inventory
-- ----------------------------
BEGIN;
INSERT INTO `Inventory` (`id`, `variant_id`, `quantity`, `status`, `created_at`, `updated_at`) VALUES (24, 28, 1, 'available', '2024-11-28 11:25:29', '2024-11-29 14:18:23'), (25, 29, 1, 'available', '2024-11-29 06:34:34', '2024-11-29 15:11:52'), (27, 31, 0, 'available', '2024-11-29 08:19:30', '2024-11-30 12:37:23'), (28, 32, 0, 'available', '2024-11-29 08:30:30', '2024-11-29 08:30:30');
COMMIT;

-- ----------------------------
-- Table structure for Library
-- ----------------------------
DROP TABLE IF EXISTS `Library`;
CREATE TABLE `Library`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- ----------------------------
-- Records of Library
-- ----------------------------
BEGIN;
INSERT INTO `Library` (`id`, `name`, `created_at`, `updated_at`) VALUES (1, '1231', '2024-11-24 18:15:09', '2024-11-24 18:15:09');
COMMIT;

-- ----------------------------
-- Table structure for OrderItems
-- ----------------------------
DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE `OrderItems`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit_price` decimal(10, 2) NULL DEFAULT NULL,
  `total_price` decimal(10, 2) NULL DEFAULT NULL,
  `quantity` int NULL DEFAULT 1,
  `order_id` int NULL DEFAULT NULL,
  `variant_id` int NULL DEFAULT NULL,
  `status` enum('pending','success','cancelled') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'pending',
  `selected_size` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `selected_color` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  INDEX `product_id`(`variant_id` ASC) USING BTREE,
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `Variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `total_price` decimal(10, 2) NULL DEFAULT NULL,
  `customer_id` int NULL DEFAULT NULL,
  `shipping_address` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `delivery_date` date NULL DEFAULT NULL,
  `payment_method` enum('cash','transfer') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'cash',
  `status` enum('pending','success','partial_cancelled','cancelled') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `customer_id`(`customer_id` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `Customer` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `otp` varchar(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `expired` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NULL DEFAULT NULL,
  `library_id` int NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  INDEX `library_id`(`library_id` ASC) USING BTREE,
  CONSTRAINT `productlibrary_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `productlibrary_ibfk_2` FOREIGN KEY (`library_id`) REFERENCES `Library` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- ----------------------------
-- Records of ProductLibrary
-- ----------------------------
BEGIN;
INSERT INTO `ProductLibrary` (`id`, `product_id`, `library_id`, `created_at`, `updated_at`) VALUES (15, 30, 1, '2024-11-29 07:25:29', '2024-11-29 07:25:29');
COMMIT;

-- ----------------------------
-- Table structure for Products
-- ----------------------------
DROP TABLE IF EXISTS `Products`;
CREATE TABLE `Products`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `images` json NULL,
  `import_price` decimal(10, 0) NULL DEFAULT NULL,
  `rental_price` decimal(10, 0) NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `status` enum('available','unavailable') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'available',
  `category_id` int NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `category_id`(`category_id` ASC) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- ----------------------------
-- Records of Products
-- ----------------------------
BEGIN;
INSERT INTO `Products` (`id`, `name`, `description`, `images`, `import_price`, `rental_price`, `notes`, `status`, `category_id`, `created_at`, `updated_at`) VALUES (5, 'Áo dài lông vũ buộc nơ cách điệu, áo dài cách tân gấm hoa tua rua kèm quần lụa( hàng có sẵn)', '1', '[\"http://localhost:5005/uploads/1732776290931_vn-11134207-7ras8-m1dprfb9sy704f@resize_w900_nl.webp\"]', 184, 10000, NULL, 'available', NULL, '2024-11-28 13:44:59', '2024-11-28 13:44:59'), (6, 'SET ÁO DÀI GẤM HOA ĐÍNH NƠ CÚC NGỌC BÁCH ĐIỀN KÈM QUẦN DÀI SIÊU XINH AD2', NULL, '[\"http://localhost:5005/uploads/1732784934384_vn-11134207-7ras8-m2jlvwrmquuqfe.webp\"]', 289000, 0, NULL, 'available', NULL, '2024-11-28 16:08:55', '2024-11-28 16:08:55'), (7, 'SET ÁO DÀI TƯỜNG VI XẺ TÀ SIÊU HOT HIT', NULL, '[\"http://localhost:5005/uploads/1732785002318_vn-11134207-7r98o-lqepbhff78l306@resize_w900_nl.webp\"]', 426700, 0, NULL, 'available', NULL, '2024-11-28 16:10:08', '2024-11-28 16:10:08'), (8, 'Đầm trễ Vai Bánh Bèo MELLYSTORE Váy Bánh Bèo Chất Liệu Tơ Nến Màu Trắng Cao Cấp Đẹp Quyến Rũ Sang Trọng Đầm Thiết Kế 01', NULL, '[\"http://localhost:5005/uploads/1732785050619_vn-11134207-7r98o-ltgorb13mj9paf.webp\"]', 299000, 0, NULL, 'available', NULL, '2024-11-28 16:10:53', '2024-11-28 16:10:53'), (9, 'ZONGYAN váy Đầm váy nữ body đầm Phong cách Thời trang Thể thao hàn quốc', NULL, '[\"http://localhost:5005/uploads/1732785344513_sg-11134201-7rd3t-luaaxu5snz8uca.webp\"]', 184000, 0, NULL, 'available', NULL, '2024-11-28 16:15:56', '2024-11-28 16:15:56'), (10, 'Weird Puss Weird Pus Đầm Hai Dây Lệch Tà Nhẹ Nhàng Thanh Lịch Màu Đen Mùa Đông Lộng Lẫy Sang Trọng Ngọt Ngào', NULL, '[\"http://localhost:5005/uploads/1732785392478_sg-11134201-7rbk9-lplp748tvt9ab6.webp\"]', 269241, 0, NULL, 'available', NULL, '2024-11-28 16:16:41', '2024-11-28 16:16:41'), (11, 'Đầm Xếp Li Eo Li Ngực Rớt Vai Xoè 4 Tầng Kèm Hoa Chocker Quý Phái, Đầm Váy Dự Tiệc Sang Chảnh, Đầm Váy Tôn Dáng', NULL, '[\"http://localhost:5005/uploads/1732785444920_vn-11134207-7r98o-lzpyzs0lbnm5f8.webp\"]', 234000, 0, NULL, 'available', NULL, '2024-11-28 16:17:33', '2024-11-28 16:17:33'), (12, 'SAILIWEI váy Đầm váy nữ body đầm Casual phổ biến Vintage Phong cách', NULL, '[\"http://localhost:5005/uploads/1732785479005_sg-11134201-7rdwy-lyp8acn5goavf7.webp\"]', 160550, 0, NULL, 'available', NULL, '2024-11-28 16:18:09', '2024-11-28 16:18:09'), (13, 'Váy body trễ vai len nhung dài tay đầm body đỏ trễ vai váy mặc tết co giãn tôn dáng slay, quyến rũ', NULL, '[\"http://localhost:5005/uploads/1732785530218_vn-11134207-7ras8-m10xzz4vcnx753.webp\"]', 148500, 0, NULL, 'available', NULL, '2024-11-28 16:18:52', '2024-11-28 16:18:52'), (14, 'VÁY TƠ TRỄ VAI ĐÍNH NƠ LAMY TIỂU THƯ SIÊU XINH', NULL, '[\"http://localhost:5005/uploads/1732785588637_vn-11134207-7r98o-lyukc9gfcax9ca.webp\"]', 153790, 0, NULL, 'available', NULL, '2024-11-28 16:19:50', '2024-11-28 16:19:50'), (15, 'Set hai món nữ: Áo sơ mi tay dài kèm chân váy đính hoa chất lụa tơ cao cấp màu đen sang trọng phù hợp đi dự tiệc', NULL, '[\"http://localhost:5005/uploads/1732785610234_vn-11134207-7r98o-lxc7ii83acwp4a.webp\"]', 224400, 0, NULL, 'available', NULL, '2024-11-28 16:20:46', '2024-11-28 16:20:46'), (16, 'Váy Trễ Vai Kẻ Sọc Nơ Nhỏ Dáng Babydoll Xinh Đẹp', NULL, '[\"http://localhost:5005/uploads/1732785682670_vn-11134207-7r98o-lu7zbra3k2739a.webp\"]', 93600, 0, NULL, 'available', NULL, '2024-11-28 16:21:24', '2024-11-28 16:21:24'), (17, 'Đầm đen trễ vai phối xếp ly trắng co giãn ôm body nữ, Phong cách tiểu thư', '', '[\"http://localhost:5005/uploads/1732785746615_vn-11134207-7r98o-ly0wwo260mvve7.webp\"]', 245700, 0, NULL, 'available', NULL, '2024-11-28 16:22:39', '2024-11-28 16:22:39'), (18, 'Đầm 2 dây tơ nhún có cúp ngực dáng xòe ngắn tiểu thư, váy trễ vai 2 dây nơ bánh bèo dúm thân kèm quần chất tơ xốp', NULL, '[\"http://localhost:5005/uploads/1732785802939_vn-11134207-7r98o-lxt66430skbfa3.webp\"]', 149400, 0, NULL, 'available', NULL, '2024-11-28 16:23:25', '2024-11-28 16:23:25'), (19, 'VÁY-ĐẦM KẺ SỌC CỔ VUÔNG THẮT NƠ TAY HẾN MAI PHƯƠNG BÙI form xoè siêu xinh', NULL, '[\"http://localhost:5005/uploads/1732785862064_vn-11134207-7r98o-ly38361ezqhl20.webp\"]', 211950, 0, NULL, 'available', NULL, '2024-11-28 16:24:23', '2024-11-28 16:24:23'), (20, 'Đầm đuôi cá phối bèo ngắn tay cổ vuông nữ chất voan 2 lớp', NULL, '[\"http://localhost:5005/uploads/1732785898739_vn-11134207-7r98o-lvlcklvkwo7l99.webp\"]', 177700, 0, NULL, 'available', NULL, '2024-11-28 16:25:00', '2024-11-28 16:25:00'), (21, 'Váy Xanh Phối Beog Ngực Nơ Cổ Sơ Mi Thiết Kế Tay Chiết Bèo Chất Đũi Gân Xinh Xắn', NULL, '[\"http://localhost:5005/uploads/1732785982344_vn-11134207-7r98o-lyz7f6bhsashb5.webp\"]', 234700, 0, NULL, 'available', NULL, '2024-11-28 16:26:36', '2024-11-28 16:26:36'), (22, 'Đầm ren pháp cổ vuông nhún bèo ngực tinh tế sang trọng', NULL, '[\"http://localhost:5005/uploads/1732786033549_vn-11134207-7r98o-lxuzugapn07v06.webp\"]', 358425, 0, NULL, 'available', NULL, '2024-11-28 16:27:14', '2024-11-28 16:27:14'), (23, 'Set Áo Trễ Vai Kèm Váy Ren Cổ Yếm Dáng Xoè TIBU Set Đồ Nữ Hai Món Quyến Rũ Sang Chảnh Đi Chơi Phố', NULL, '[\"http://localhost:5005/uploads/1732786087936_vn-11134207-7r98o-lzkloxb3z4wx95.webp\"]', 221200, 0, NULL, 'available', NULL, '2024-11-28 16:28:09', '2024-11-28 16:28:09'), (24, 'ĐẦM REN HOA THIẾT KẾ TAY LOE XẺ siêu Hot. Đầm ren hoa ôm body cực sexy kèm quần bảo hộ', NULL, '[\"http://localhost:5005/uploads/1732786127516_vn-11134207-7r98o-lyo9mdfkzu01a2.webp\"]', 182700, 0, NULL, 'available', NULL, '2024-11-28 16:28:49', '2024-11-28 16:28:49'), (25, 'Đầm voan hoa dây xoè tầng kèm áo khoác rời', NULL, '[\"http://localhost:5005/uploads/1732786182863_vn-11134207-7r98o-lr0dnerkg5nd7d.webp\"]', 197900, 0, NULL, 'available', NULL, '2024-11-28 16:29:44', '2024-11-28 16:29:44'), (26, 'Đầm xoè cổ vuông caro xanh đính nơ TABISHOP Váy babydoll màu xanh biển ngọt ngào mặc hè đi biển xinh xắn', NULL, '[\"http://localhost:5005/uploads/1732786244367_vn-11134207-7r98o-ltuw167k8vey5a.webp\"]', 149000, 0, NULL, 'available', NULL, '2024-11-28 16:30:47', '2024-11-28 16:30:47'), (27, 'Đầm body cúp ngực form dài đính bông hoa TABISHOP Váy maxi trắng thiết kế tôn dáng đi dự tiệc đi biển đi chơi', NULL, '[\"http://localhost:5005/uploads/1732786279802_vn-11134207-7r98o-lyc4hrh7f4ul8e.webp\"]', 169000, 0, NULL, 'available', NULL, '2024-11-28 16:31:22', '2024-11-28 16:31:22'), (28, 'Set váy body phối ren kèm áo trễ vai tay dài TABISHOP Set đồ nữ dễ thương mặc thu đông', NULL, '[\"http://localhost:5005/uploads/1732786307616_vn-11134207-7r98o-m031683iawod8d.webp\"]', 189000, 0, NULL, 'available', NULL, '2024-11-28 16:31:58', '2024-11-28 16:31:58'), (29, 'Đầm Body Len Rớt Tay Dài Dáng Ngắn Nơ Ruy Băng Ngực', NULL, '[\"http://localhost:5005/uploads/1732786363514_vn-11134207-7r98o-lq5zbvkhp0pe7d.webp\"]', 147700, 0, NULL, 'available', NULL, '2024-11-28 16:32:45', '2024-11-28 16:32:45'), (30, 'Váy Dự Tiệc Dáng Baby Doll NV592 Váy Thiết Kế Vải Ren Hoa Nổi Tay Ống Loe Tôn Dáng Thanh lịch', NULL, '[\"http://localhost:5005/uploads/1732786408819_vn-11134207-7r98o-lsoctybxrul544.webp\", \"http://localhost:5005/uploads/1732786408822_vn-11134207-7r98o-lsoctybxt95l31.webp\"]', 225200, 10000, NULL, 'available', 9, '2024-11-28 16:33:40', '2024-11-29 14:27:30'), (31, 'Đầm Body Dáng Ngắn Lệch Vai Tay Dài Đính Hoa Trẻ Trung', NULL, '[\"http://localhost:5005/uploads/1732786503955_vn-11134207-7r98o-luoympiwk26qf9.webp\"]', 251900, 0, NULL, 'available', NULL, '2024-11-28 16:35:13', '2024-11-28 16:35:13'), (32, 'Áo và chân váy dạ croptop tuyết nhi', NULL, '[\"http://localhost:5005/uploads/1732786571772_sg-11134201-23020-li6ov612z3mva5.webp\"]', 322700, 0, NULL, 'available', NULL, '2024-11-28 16:36:13', '2024-11-28 16:36:13');
COMMIT;

-- ----------------------------
-- Table structure for Rentals
-- ----------------------------
DROP TABLE IF EXISTS `Rentals`;
CREATE TABLE `Rentals`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `variant_id` int NULL DEFAULT NULL,
  `customer_id` int NULL DEFAULT NULL,
  `start_date` datetime NULL DEFAULT NULL,
  `end_date` datetime NULL DEFAULT NULL,
  `shiped_date` date NULL DEFAULT NULL,
  `return_date` date NULL DEFAULT NULL,
  `status` enum('rented','returned','late') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'rented',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `inventory_id`(`variant_id` ASC) USING BTREE,
  INDEX `customer_id`(`customer_id` ASC) USING BTREE,
  INDEX `fk_order_id`(`order_id` ASC) USING BTREE,
  CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_variant_id` FOREIGN KEY (`variant_id`) REFERENCES `Variants` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `amount` decimal(10, 2) NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NULL DEFAULT NULL,
  `size` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `color` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- ----------------------------
-- Records of Variants
-- ----------------------------
BEGIN;
INSERT INTO `Variants` (`id`, `product_id`, `size`, `color`, `created_at`, `updated_at`) VALUES (28, 30, 'S', 'Trắng', '2024-11-28 11:25:29', '2024-11-28 11:25:29'), (29, 29, 'M', 'Đen', '2024-11-29 06:34:34', '2024-11-29 06:34:34'), (31, 31, 'S', 'Đen', '2024-11-29 08:19:30', '2024-11-29 08:19:30'), (32, 32, 'M', 'đỏ', '2024-11-29 08:30:30', '2024-11-29 08:30:30');
COMMIT;

-- ----------------------------
-- Table structure for inventory_history
-- ----------------------------
DROP TABLE IF EXISTS `inventory_history`;
CREATE TABLE `inventory_history`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` int NOT NULL,
  `transaction_type` enum('import','export') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `amount` decimal(10, 0) NOT NULL,
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity_before` int NULL DEFAULT 0,
  `quantity_after` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `inventory_id`(`inventory_id` ASC) USING BTREE,
  CONSTRAINT `inventory_history_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `Inventory` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ----------------------------
-- Records of inventory_history
-- ----------------------------
BEGIN;
INSERT INTO `inventory_history` (`id`, `inventory_id`, `transaction_type`, `quantity`, `amount`, `source`, `note`, `created_at`, `quantity_before`, `quantity_after`) VALUES (6, 24, 'import', 3, 0, 'tiktok', '', '2024-11-29 10:32:43', 3, 6), (7, 24, 'export', 5, 200000, '', '5', '2024-11-29 10:34:00', 6, 1);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
