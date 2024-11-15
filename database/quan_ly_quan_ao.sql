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

 Date: 15/11/2024 13:57:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO `categories` (`id`, `name`) VALUES (2, 'Đồ đi chơi');
INSERT INTO `categories` (`id`, `name`) VALUES (4, 'Dự tiệc sang chảnh');
COMMIT;

-- ----------------------------
-- Table structure for product_categories
-- ----------------------------
DROP TABLE IF EXISTS `product_categories`;
CREATE TABLE `product_categories` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of product_categories
-- ----------------------------
BEGIN;
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES (14, 2);
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES (15, 2);
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES (14, 4);
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES (15, 4);
COMMIT;

-- ----------------------------
-- Table structure for product_contents
-- ----------------------------
DROP TABLE IF EXISTS `product_contents`;
CREATE TABLE `product_contents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `image_urls` json DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `status` enum('draft','scheduled','published') DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_contents_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of product_contents
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `images` json DEFAULT NULL,
  `import_price` decimal(10,0) DEFAULT '0',
  `rental_price` decimal(10,0) DEFAULT '0',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of products
-- ----------------------------
BEGIN;
INSERT INTO `products` (`id`, `name`, `description`, `images`, `import_price`, `rental_price`, `note`, `created_at`, `updated_at`) VALUES (14, '123', '1231', '[\"http://localhost:5005/uploads/1731510317302_1292111594578382848.webp\"]', 23, 123000, NULL, '2024-11-14 09:15:16', '2024-11-14 10:38:27');
INSERT INTO `products` (`id`, `name`, `description`, `images`, `import_price`, `rental_price`, `note`, `created_at`, `updated_at`) VALUES (15, 'Áo bánh bèo', 'bánh bèo vị sao', '[\"http://localhost:5005/uploads/1731518314693_IMG_4254 2.jpg\", \"http://localhost:5005/uploads/1731518314694_IMG_4255 2.jpg\", \"http://localhost:5005/uploads/1731518314695_IMG_4256 2.jpg\", \"http://localhost:5005/uploads/1731518314696_IMG_4257 2.jpg\", \"http://localhost:5005/uploads/1731518314702_IMG_4258 2.jpg\", \"http://localhost:5005/uploads/1731518314684_IMG_4266 2.jpg\", \"http://localhost:5005/uploads/1731518314691_IMG_4268 2.jpg\", \"http://localhost:5005/uploads/1731518314707_IMG_4260 2.jpg\", \"http://localhost:5005/uploads/1731518314706_IMG_4259 2.jpg\", \"http://localhost:5005/uploads/1731518314728_IMG_4264 2.jpg\", \"http://localhost:5005/uploads/1731518314718_IMG_4261 2.jpg\", \"http://localhost:5005/uploads/1731518314727_IMG_4267 2.jpg\", \"http://localhost:5005/uploads/1731518314732_IMG_4273 2.jpg\", \"http://localhost:5005/uploads/1731518314728_IMG_4272 2.jpg\", \"http://localhost:5005/uploads/1731518314731_IMG_4265 2.jpg\", \"http://localhost:5005/uploads/1731518314739_IMG_4270 2.jpg\", \"http://localhost:5005/uploads/1731518314740_IMG_4271 2.jpg\", \"http://localhost:5005/uploads/1731518314744_IMG_4253 2.jpg\", \"http://localhost:5005/uploads/1731518314745_IMG_4250 2.jpg\"]', 23, 65000, 'áo này bị rách tay rùi', '2024-11-14 09:15:16', '2024-11-14 09:46:24');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
