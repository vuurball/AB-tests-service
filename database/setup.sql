CREATE DATABASE IF NOT EXISTS `abt`
USE `abt`;


CREATE TABLE IF NOT EXISTS `events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci;


CREATE TABLE IF NOT EXISTS `experiments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL DEFAULT '' COMMENT 'experiment unique identifier / name',
  `desc` varchar(200) NOT NULL DEFAULT '',
  `default_variant_name` varchar(50) NOT NULL DEFAULT 'control' COMMENT 'the variant that will be used when the experiment isnt running',
  `is_active` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `start_at` int(11) NOT NULL,
  `end_at` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci;


CREATE TABLE IF NOT EXISTS `experiments_events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `experiment_id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `experiment_id_event_id` (`experiment_id`,`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci;


CREATE TABLE IF NOT EXISTS `test_objects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `experiment_id` int(11) NOT NULL,
  `tested_entity_type` varchar(50) NOT NULL,
  `tested_entity_id` varchar(255) NOT NULL,
  `variant_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `experiment_id_tested_entity_type_tested_entity_id` (`experiment_id`,`tested_entity_type`,`tested_entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci;


CREATE TABLE IF NOT EXISTS `test_objects_events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `test_obj_id` int(10) unsigned NOT NULL,
  `event_id` int(10) unsigned NOT NULL,
  `event_data` text COMMENT 'optional additional information for tracking/analizing results',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci;


CREATE TABLE IF NOT EXISTS `variants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `experiment_id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT 'control',
  `allocation` int(10) unsigned NOT NULL COMMENT 'allocation of traffic for a variant in percent (0-100)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `experiment_id_key` (`experiment_id`,`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8_general_ci;



