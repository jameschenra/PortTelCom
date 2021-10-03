-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2019 at 05:15 PM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `porttel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `ID` int(10) UNSIGNED NOT NULL,
  `name` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VAT` double(8,2) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`ID`, `name`, `VAT`, `active`, `created_at`, `updated_at`) VALUES
(1, 'UK', 8.50, 1, '2019-02-19 11:26:07', '2019-05-06 02:40:13'),
(2, 'US', 5.50, 1, '2019-02-19 11:29:39', '2019-02-19 11:30:14'),
(3, 'BULGARIA', 4.25, 1, '2019-02-19 11:29:39', '2019-02-19 11:30:14');

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `ID` int(10) UNSIGNED NOT NULL,
  `name` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `sign` varchar(1) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`ID`, `name`, `sign`, `created_at`, `updated_at`) VALUES
(1, 'USD', '$', '2019-04-15 21:34:48', '0000-00-00 00:00:00'),
(2, 'GBP', '£', '2019-04-15 21:35:09', '0000-00-00 00:00:00'),
(3, 'EUR', '€', '2019-04-15 21:35:26', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `email_verify_tokens`
--

CREATE TABLE `email_verify_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verificationCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verifyAttempt` tinyint(4) NOT NULL DEFAULT '0',
  `expiresIn` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_verify_tokens`
--

INSERT INTO `email_verify_tokens` (`id`, `email`, `verificationCode`, `verifyAttempt`, `expiresIn`, `created_at`, `updated_at`) VALUES
(19, 'test@test.com', '230232', 0, '2019-06-07 07:32:43', '2019-06-07 07:02:43', '2019-06-07 07:02:43');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(20, '2014_10_12_000000_create_users_table', 1),
(21, '2014_10_12_100000_create_password_resets_table', 1),
(22, '2019_01_28_102815_create_permission_tables', 1),
(23, '2019_01_28_180911_create_user_types_table', 1),
(24, '2019_01_28_181034_create_sessions_table', 1),
(25, '2019_01_29_201435_create_email_verify_tokens_table', 1),
(26, '2019_02_01_083814_create_servers_table', 1),
(27, '2019_02_01_100109_create_subscription_plans_table', 1),
(28, '2019_02_01_195237_create_subscriptions_table', 1),
(29, '2019_02_01_203828_create_countries_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verificationCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempt` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `expiresIn` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `verificationCode`, `attempt`, `expiresIn`) VALUES
(1, 'michael@gmail.com', '546658', 0, '2019-02-13 07:10:39');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `ID` int(10) UNSIGNED NOT NULL,
  `method` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`ID`, `method`, `created_at`, `updated_at`) VALUES
(1, 'Apple In-App Purchase', NULL, NULL),
(2, 'Google In-App Purchase', NULL, NULL),
(3, 'Credit/Debit Card', NULL, NULL),
(4, 'PayPal', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_statuses`
--

CREATE TABLE `payment_statuses` (
  `ID` int(10) UNSIGNED NOT NULL,
  `status` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `payment_statuses`
--

INSERT INTO `payment_statuses` (`ID`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Pending', NULL, NULL),
(2, 'Processing', NULL, NULL),
(3, 'Paid', NULL, NULL),
(4, 'Cancelled', NULL, NULL),
(5, 'Failed', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `ID` int(10) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `userEmail` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `userName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `paymentType` int(11) NOT NULL,
  `transaction_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `amount` float(8,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'USD',
  `subscriptionID` int(11) DEFAULT NULL,
  `paymentStatus` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `subscriptionStatus` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'access_token', NULL, NULL),
(2, 'Support', 'access_token', NULL, NULL),
(3, 'Regular', 'access_token', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE `servers` (
  `ID` int(10) UNSIGNED NOT NULL,
  `number` int(10) UNSIGNED NOT NULL,
  `countryID` int(10) UNSIGNED NOT NULL,
  `ip` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `port` int(10) UNSIGNED NOT NULL,
  `active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `servers`
--

INSERT INTO `servers` (`ID`, `number`, `countryID`, `ip`, `port`, `active`, `created_at`, `updated_at`) VALUES
(1, 5, 1, '127.0.0.5', 443, 1, '2019-05-05 10:38:50', '2019-05-05 10:58:51'),
(2, 111, 2, '192.168.1.1', 33, 1, '2019-05-05 10:39:16', '2019-05-05 10:59:08'),
(3, 222, 2, '0.0.0.0', 222, 1, '2019-05-05 10:52:42', '2019-05-05 10:58:57');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(10) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `sessionID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deviceID` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deviceName` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresIn` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `userID`, `sessionID`, `deviceID`, `deviceName`, `expiresIn`, `created_at`, `updated_at`) VALUES
(1, 1, 'becbaf31160f7a1d67c934b64622da09a837092c6502d6498d62cdb2fc7b9060e5b9786a26a486a7854f4b4432e05adc2cf8964fbd38853946db58943018f358', '424ddba7-e094-412d-ba6c-a7e6c27e638b', 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36', '2019-05-31 12:46:47', '2019-05-30 08:00:04', '2019-05-31 02:46:47'),
(17, 1, '11c1297f19366eb54d662bb8c77bd1ac033940d0c6a00032c7245c90699b3a8201b11496e2632cadfd51a11737153efe19d7cf1707afc5419e507c32c9998685', '9f77b7dc-7511-4fa2-b9ec-16757beaaf6f', 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36', '2019-06-01 18:35:02', '2019-06-01 08:34:52', '2019-06-01 08:35:02'),
(27, 1, 'c99e0e0af3cb7bb725a1e61ce21af8ea331ca588a8c29f339bb6eebe25f923597c9de4a46879161ac82564468afe2958c05f1a2b1bc61156e729988466c1908e', '013e4244-852d-48ff-ba61-88f29df3e1cc', 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36', '2019-06-06 20:06:01', '2019-06-06 10:05:57', '2019-06-06 10:06:01');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `ID` int(10) UNSIGNED NOT NULL,
  `planID` int(10) UNSIGNED NOT NULL,
  `userID` int(10) UNSIGNED NOT NULL,
  `paymentMethod` tinyint(1) UNSIGNED DEFAULT NULL,
  `paymentStatus` tinyint(1) UNSIGNED DEFAULT NULL,
  `appliedVAT` double(8,2) DEFAULT NULL,
  `startDate` timestamp NULL DEFAULT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `expireStatus` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `ID` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double(8,2) NOT NULL,
  `priceCurrency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `countryID` int(10) UNSIGNED DEFAULT NULL,
  `months` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `days` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`ID`, `name`, `description`, `price`, `priceCurrency`, `countryID`, `months`, `days`, `active`, `created_at`, `updated_at`) VALUES
(1, '1 Month Plan', 'Shortest Plan', 15.00, 'USD', NULL, 1, 0, 1, '2019-02-13 09:12:45', '2019-05-05 23:38:48'),
(2, '6 Month Plan', 'Most Popular Plan', 10.00, 'USD', NULL, 6, 0, 1, '2019-02-13 09:13:45', '2019-05-05 23:38:58'),
(3, '1 Year Plan', 'Best cheap Plan', 5.00, 'USD', NULL, 12, 0, 1, '2019-02-13 10:39:31', '2019-02-13 10:39:31'),
(4, '1 Month Plan', 'Shortest Plan', 15.00, 'GBP', 1, 1, 0, 1, NULL, NULL),
(5, '6 Month Plan', 'Most Popular Plan', 10.00, 'GBP', 1, 6, 0, 1, NULL, NULL),
(6, '1 Year Plan', 'Best cheap Plan', 8.25, 'GBP', 1, 12, 0, 1, NULL, NULL),
(7, '1 Month Plan', 'Best cheap Plan', 12.00, 'EUR', 3, 1, 0, 1, NULL, NULL),
(8, '6 Month Plan', 'Most Popular Plan', 8.25, 'EUR', 3, 6, 0, 1, NULL, NULL),
(9, '1 Year Plan', 'Best cheap Plan', 5.00, 'EUR', 3, 12, 0, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(10) UNSIGNED NOT NULL,
  `firstName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(10) UNSIGNED NOT NULL,
  `roleID` int(10) UNSIGNED NOT NULL,
  `countryID` int(10) UNSIGNED NOT NULL,
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `loginAttempt` tinyint(1) DEFAULT '0',
  `lockExpired` timestamp NULL DEFAULT NULL,
  `companyName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyAddress` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyRegistrationNumber` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyVATNumber` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactFirstName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactLastName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `firstName`, `lastName`, `email`, `emailVerified`, `password`, `type`, `roleID`, `countryID`, `locked`, `loginAttempt`, `lockExpired`, `companyName`, `companyAddress`, `companyRegistrationNumber`, `companyVATNumber`, `contactFirstName`, `contactLastName`, `created_at`, `updated_at`) VALUES
(1, 'Super', 'Admin', 'admin@admin.com', 1, '$2y$10$v5lI2VDv1KuQoFCzuZg0B.t/MkKm4KlU/mtLfqBUGPwZxCqO2M2yO', 1, 1, 2, 0, 0, '2019-05-04 13:54:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-05-05 00:00:59'),
(3, 'test', 'ttt', 'company@gmail.com', 1, '$2y$10$0X9OXpaYvHTqhvAQa0n/1OBGriDeDnN4iVS8J6EBC.f12UV3vqXkm', 2, 2, 1, 0, 0, NULL, 'intelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintelintel', 'california', 'intel 9941', 'vat-num1', 'Mike', 'james', '2019-02-11 14:16:28', '2019-02-13 12:54:15'),
(4, 'John(client)', 'Smith', 'michael@gmail.com', 1, '$2y$10$ypyJuyOtowApRWk60.0/zumzdHtPgpVUPKl3Z.NMBHuIUMhslhsgO', 1, 3, 1, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-02-13 06:40:39', '2019-02-13 07:15:08'),
(10, 'katy', 'perry', 'katy@gmail.com', 1, '$2y$10$VUc/Vt1uekrRHkpfpklvLuPE3NaXzF3.mSv9p5CPRsWv2uYALHFMC', 1, 3, 1, 0, 0, '2019-02-14 09:50:12', NULL, NULL, NULL, NULL, NULL, NULL, '2019-02-13 10:20:49', '2019-04-21 10:42:40'),
(29, NULL, NULL, 'company1@compnay.com', 1, '$2y$10$TJuyD6bF3qtpsq7WUeR2.O7eq1PUYIA1UA93v7jr3YPt3d1PcO2N.', 2, 3, 2, 0, 0, NULL, 'company11', 'las 1', '12', '22', 'John', 'Dica', '2019-06-06 09:35:11', '2019-06-06 09:35:11'),
(30, NULL, NULL, 'comp@gamil.com', 1, '$2y$10$kw.IYU3XYnkqq56PW6AVWOJj1gw2rUdTQqjWUqj8eeQN.HIvWejOC', 2, 3, 1, 0, 0, NULL, 'pp', 'pp', 'pp', 'pp', 'pp', 'pp', '2019-06-06 09:41:07', '2019-06-06 09:41:07'),
(31, 'admin', 'admin', 'aa@aa.com', 1, '$2y$10$xwF4hCjjo8JkXkmAaaB0gOA5RNjzmUS7QUD9sFmr9Mt3iHGLgkGuu', 1, 1, 1, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-06-06 09:47:05', '2019-06-06 09:47:05'),
(32, 'test', 'test', 'test@test.com', NULL, '$2y$10$fAUo2HWeX9jROYcynph7ZOwKrFgQjjdyqW5QM7xd87gLTr7xZ6.ya', 1, 3, 1, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-06-07 07:02:43', '2019-06-07 07:02:43');

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

CREATE TABLE `user_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_types`
--

INSERT INTO `user_types` (`id`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Individual', NULL, NULL),
(2, 'Company', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `email_verify_tokens`
--
ALTER TABLE `email_verify_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_verify_tokens_email_unique` (`email`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `password_resets_email_unique` (`email`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `payment_statuses`
--
ALTER TABLE `payment_statuses`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_userid_foreign` (`userID`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `subscriptions_userid_foreign` (`userID`),
  ADD KEY `subscriptions_planid_foreign` (`planID`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_verify_tokens`
--
ALTER TABLE `email_verify_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_statuses`
--
ALTER TABLE `payment_statuses`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `servers`
--
ALTER TABLE `servers`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `user_types`
--
ALTER TABLE `user_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_verify_tokens`
--
ALTER TABLE `email_verify_tokens`
  ADD CONSTRAINT `email_verify_tokens_email_foreign` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_email_foreign` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_planid_foreign` FOREIGN KEY (`planID`) REFERENCES `subscription_plans` (`id`),
  ADD CONSTRAINT `subscriptions_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
