/*
 Navicat Premium Data Transfer

 Source Server         : island
 Source Server Type    : MySQL
 Source Server Version : 50505
 Source Host           : localhost
 Source Database       : island

 Target Server Type    : MySQL
 Target Server Version : 50505
 File Encoding         : utf-8

 Date: 05/17/2019 16:48:01 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `hot_book`
-- ----------------------------
DROP TABLE IF EXISTS `hot_book`;
CREATE TABLE `hot_book` (
  `created_at` datetime DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `index` int(11) DEFAULT NULL,
  `image` varchar(64) DEFAULT NULL,
  `author` varchar(25) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=51665 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;

-- ----------------------------
--  Records of `hot_book`
-- ----------------------------
BEGIN;
INSERT INTO `hot_book` VALUES ('2019-07-20 12:12:12', '1', '7', '1', 'https://img3.doubanio.com/lpic/s4669554.jpg', '[美]保罗·格雷厄姆', '黑客与画家', null, null), ('2019-07-20 12:12:12', '1', '65', '2', 'https://img3.doubanio.com/lpic/s4059293.jpg', 'MarkPilgrim', 'Dive Into Python 3', null, null), ('2019-07-20 12:12:12', '1', '183', '3', 'https://img3.doubanio.com/lpic/s4387251.jpg', 'MagnusLieHetland', 'Python基础教程', null, null), ('2019-07-20 12:12:12', '1', '1002', '4', 'https://img3.doubanio.com/lpic/s6384944.jpg', '[哥伦比亚]加西亚·马尔克斯', '百年孤独', null, null), ('2019-07-20 12:12:12', '1', '1049', '5', 'https://img1.doubanio.com/view/subject/l/public/s29775868.jpg', '[日]岩井俊二', '情书', null, null), ('2019-07-20 12:12:12', '1', '1061', '6', 'https://img3.doubanio.com/lpic/s1358984.jpg', '[美]乔治·R·R·马丁', '冰与火之歌（卷一）', null, null), ('2019-07-20 12:12:12', '1', '1120', '7', 'https://img3.doubanio.com/lpic/s4610502.jpg', '[日]东野圭吾', '白夜行', null, null), ('2019-07-20 12:12:12', '1', '1166', '8', 'https://img1.doubanio.com/lpic/s23632058.jpg', '金庸', '天龙八部', null, null), ('2019-07-20 12:12:12', '1', '1308', '9', 'https://img3.doubanio.com/lpic/s3814606.jpg', '[日]东野圭吾', '恶意', null, null), ('2019-07-20 12:12:12', '1', '1339', '10', 'https://img3.doubanio.com/lpic/s1074376.jpg', '[英]J·K·罗琳', '哈利·波特与阿兹卡班的囚徒', null, null), ('2019-07-20 12:12:12', '1', '1383', '11', 'https://img1.doubanio.com/lpic/s3557848.jpg', '韩寒', '他的国', null, null), ('2019-07-20 12:12:12', '1', '1398', '12', 'https://img1.doubanio.com/lpic/s2752367.jpg', '[英]J·K·罗琳', '哈利·波特与死亡圣器', null, null), ('2019-07-20 12:12:12', '1', '1560', '13', 'https://img1.doubanio.com/lpic/s3463069.jpg', '王小波', '三十而立', null, null), ('2019-07-20 12:12:12', '1', '7821', '14', 'https://img3.doubanio.com/lpic/s6144591.jpg', '[伊朗]玛赞·莎塔碧', '我在伊朗长大', null, null), ('2019-07-20 12:12:12', '1', '8854', '15', 'https://img1.doubanio.com/lpic/s29494718.jpg', '[日]村上春树', '远方的鼓声', null, null), ('2019-07-20 12:12:12', '1', '8866', '16', 'https://img3.doubanio.com/lpic/s2393243.jpg', '三毛', '梦里花落知多少', null, null), ('2019-07-20 12:12:12', '1', '15198', '17', 'https://img1.doubanio.com/lpic/s1080179.jpg', '韩寒', '像少年啦飞驰', null, null), ('2019-07-20 12:12:12', '1', '15984', '18', 'https://img3.doubanio.com/lpic/s27970504.jpg', '鲁迅', '朝花夕拾', null, null), ('2019-07-20 12:12:12', '1', '21050', '19', 'https://img3.doubanio.com/lpic/s2853431.jpg', '[日]井上雄彦', '灌篮高手31', null, null), ('2019-07-20 12:12:12', '1', '51664', '20', 'https://img3.doubanio.com/lpic/s29034294.jpg', '[日]新井一二三', '东京时味记', null, null);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
