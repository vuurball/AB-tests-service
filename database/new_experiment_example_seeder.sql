INSERT INTO `experiments` (`id`, `name`, `desc`, `default_variant_name`, `is_active`, `start_at`, `end_at`) VALUES
	(1, 'btn_color', 'checking if orange/green buttons are better than blue', 'control', 1, 1636508887, 1637513687);


INSERT INTO `variants` ( `experiment_id`, `name`, `allocation`) VALUES
	(1, 'control', 40),
	(1, 'orange_btn', 30),
	(1, 'green_btn', 30);

    
INSERT INTO `events` (`id`, `name`) VALUES
	(1, 'sign up'),
	(2, 'login'),
	(3, 'item added to shopping cart'),
	(4, 'purchase'),
	(5, 'contact us submitted');


INSERT INTO `experiments_events` ( `experiment_id`, `event_id`) VALUES
	(1, 1),
	(1, 2);


