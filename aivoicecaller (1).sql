-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2025 at 11:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aivoicecaller`
--

-- --------------------------------------------------------

--
-- Table structure for table `calls`
--

CREATE TABLE `calls` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer` varchar(191) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `started_at` datetime NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `status` enum('queued','initiated','ringing','in-progress','completed','busy','failed','no-answer','Speaking','Listening','Answered','No Answer') DEFAULT NULL,
  `campaign` varchar(191) DEFAULT NULL,
  `ai_message` text DEFAULT NULL,
  `transcript` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`transcript`)),
  `twilio_sid` varchar(64) DEFAULT NULL,
  `ended_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `calls`
--

INSERT INTO `calls` (`id`, `customer`, `phone`, `started_at`, `duration`, `status`, `campaign`, `ai_message`, `transcript`, `twilio_sid`, `ended_at`) VALUES
(1, 'Samantha Rose', '+1 555-111-2233', '2025-08-13 11:54:49', NULL, 'Speaking', 'Q3 Renewal Campaign', 'Hi Samantha, this is Royal Aire AI calling about your plan renewal.', '[]', NULL, NULL),
(2, 'Marcus Lin', '+1 555-444-8899', '2025-08-13 11:51:49', NULL, 'Listening', 'Customer Feedback', 'Hello Marcus, I\'d like to check in on your recent service experience.', '[]', NULL, NULL),
(3, 'Alice Johnson', '+1 555-123-4567', '2025-08-05 10:15:00', 154, 'Answered', NULL, NULL, '[{\"from\": \"AI\", \"text\": \"Hi Alice, this is an automated call about your service.\"}, {\"from\": \"Alice\", \"text\": \"Okay, I\'m listening.\"}, {\"from\": \"AI\", \"text\": \"Would you like to renew your plan today?\"}]', NULL, NULL),
(4, 'Bob Smith', '+1 555-987-6543', '2025-08-05 10:22:00', 0, 'No Answer', NULL, NULL, '[]', NULL, NULL),
(5, 'Carol White', '+1 555-456-7890', '2025-08-05 10:30:00', 252, 'Answered', NULL, NULL, '[{\"from\": \"AI\", \"text\": \"Hello Carol, I\'m calling regarding your recent inquiry.\"}, {\"from\": \"Carol\", \"text\": \"Yes, I\'m interested in learning more.\"}]', NULL, NULL),
(6, 'David Green', '+1 555-222-3344', '2025-08-12 09:10:15', 180, 'Answered', 'Summer Promo', 'Hello David, checking in on your subscription.', '[{\"from\": \"AI\", \"text\": \"Hello David, checking in on your subscription.\"}]', NULL, NULL),
(7, 'Emma Brown', '+1 555-333-5566', '2025-08-12 14:25:42', 0, 'No Answer', 'Summer Promo', 'Hi Emma, this is an automated call.', '[]', NULL, NULL),
(8, 'Frank Harris', '+1 555-444-6677', '2025-08-11 11:45:30', 210, 'Answered', 'Q3 Renewal Campaign', 'Hi Frank, this is Royal Aire AI.', '[{\"from\": \"AI\", \"text\": \"Hi Frank, this is Royal Aire AI.\"}]', NULL, NULL),
(9, 'Grace Lee', '+1 555-555-7788', '2025-08-11 16:50:10', 0, 'No Answer', 'Customer Feedback', 'Hello Grace, checking your recent service.', '[]', NULL, NULL),
(10, 'Henry Adams', '+1 555-666-8899', '2025-08-10 10:05:22', 95, 'Answered', 'Customer Feedback', 'Hi Henry, this is AI calling regarding your feedback.', '[{\"from\": \"AI\", \"text\": \"Hi Henry, this is AI calling regarding your feedback.\"}]', NULL, NULL),
(11, 'Ivy Wilson', '+1 555-777-9900', '2025-08-10 13:35:55', NULL, 'Speaking', 'Q3 Renewal Campaign', 'Hello Ivy, we are calling about your renewal.', '[]', NULL, NULL),
(12, 'Jack Miller', '+1 555-888-1122', '2025-08-09 09:45:12', NULL, 'Listening', 'Customer Feedback', 'Hi Jack, automated check-in.', '[]', NULL, NULL),
(13, 'Karen Scott', '+1 555-999-2233', '2025-08-09 15:20:33', 200, 'Answered', 'Summer Promo', 'Hello Karen, this is AI regarding your subscription.', '[{\"from\": \"AI\", \"text\": \"Hello Karen, this is AI regarding your subscription.\"}]', NULL, NULL),
(14, 'Leo Turner', '+1 555-101-3344', '2025-08-08 11:15:47', 0, 'No Answer', 'Customer Feedback', 'Hi Leo, this is an automated call.', '[]', NULL, NULL),
(15, 'Mia Carter', '+1 555-202-4455', '2025-08-07 10:50:05', 180, 'Answered', 'Q3 Renewal Campaign', 'Hello Mia, checking in on your renewal.', '[{\"from\": \"AI\", \"text\": \"Hello Mia, checking in on your renewal.\"}]', NULL, NULL),
(16, 'Test Lead 1', '919016143088', '2025-08-14 11:56:58', NULL, 'Answered', '6', '[Phone rings]\r\n\r\nCaller: Hello, this is [Your Name] calling from [Company Name]. Am I speaking to [Recipient\'s Name]?\r\n\r\nRecipient: Yes, this is [Recipient\'s Name].\r\n\r\nCaller: Great! I\'m calling to gather feedback on our recent services. We truly value your opinion and would love to hear about your experience with us. Can you spare a few minutes to provide some feedback?\r\n\r\nRecipient: Sure, I can give some feedback.\r\n\r\nCaller: Fantastic! On a scale of 1 to 10, how satisfied were you with our services?\r\n\r\nRecipient: I would say an 8.\r\n\r\nCaller: That\'s great to hear! What did you enjoy most about our services?\r\n\r\nRecipient: I really appreciated the quick response time and the professionalism of your team.\r\n\r\nCaller: Thank you for sharing that. Is there anything we could have done better to improve your experience?\r\n\r\nRecipient: Maybe a clearer communication on the pricing would have been helpful.\r\n\r\nCaller: Thank you for that feedback. We will definitely take that into consideration for future improvements. Is there anything else you would like to add?\r\n\r\nRecipient: No, that\'s all.\r\n\r\nCaller: Thank you so much for taking the time to provide your feedback. We really appreciate it. Have a great day!\r\n\r\nRecipient: You\'re welcome. Goodbye.\r\n\r\nCaller: Goodbye.', NULL, NULL, NULL),
(17, 'Test Lead 1', '919016143088', '2025-08-14 16:12:59', NULL, 'failed', '7', '[Sound of phone ringing]\r\n\r\nAgent: Hello, this is [Agent\'s Name] from [Company Name]. Am I speaking with [Customer\'s Name]?\r\n\r\nCustomer: Yes, this is [Customer\'s Name].\r\n\r\nAgent: Great! I\'m calling to welcome you to our company and guide you through the onboarding process. Are you ready to get started?\r\n\r\nCustomer: Yes, I\'m ready.\r\n\r\nAgent: Perfect! During this call, I\'ll walk you through setting up your account, familiarizing you with our services, and answering any questions you may have. I want to make sure you have a smooth transition and feel comfortable using our platform.\r\n\r\nCustomer: That sounds great. I appreciate the help.\r\n\r\nAgent: Of course! Let\'s begin by creating your account. I\'ll need some basic information from you to get started. Can you please provide me with your full name, email address, and any other contact information?\r\n\r\nCustomer: Sure, my full name is [Customer\'s Full Name], and my email address is [Customer\'s Email Address].\r\n\r\nAgent: Thank you. Now, let\'s move on to setting up your preferences and customizing your account. Is there anything specific you\'re looking for or any features you\'re particularly interested in?\r\n\r\nCustomer: I\'m interested in learning more about [specific feature].\r\n\r\nAgent: Great choice! I\'ll make sure to provide you with all the information you need about that feature. Lastly, do you have any questions or concerns that you would like to address before we wrap up?\r\n\r\nCustomer: Not at the moment, but I\'ll definitely reach out if I have any questions.\r\n\r\nAgent: Sounds good. Thank you for your time today, [Customer\'s Name]. We\'re excited to have you on board and look forward to working with you. If you need any assistance in the future, don\'t hesitate to reach out to our customer support team. Have a great day!\r\n\r\nCustomer: Thank you, [Agent\'s Name]. Have a great day too.', NULL, NULL, NULL),
(18, 'Test Lead 1', '919016143088', '2025-08-14 16:15:10', NULL, 'failed', '7', '[Sound of phone ringing]\r\n\r\nAgent: Hello, this is [Agent\'s Name] from [Company Name]. Am I speaking with [Customer\'s Name]?\r\n\r\nCustomer: Yes, this is [Customer\'s Name].\r\n\r\nAgent: Great! I\'m calling to welcome you to our company and guide you through the onboarding process. Are you ready to get started?\r\n\r\nCustomer: Yes, I\'m ready.\r\n\r\nAgent: Perfect! During this call, I\'ll walk you through setting up your account, familiarizing you with our services, and answering any questions you may have. I want to make sure you have a smooth transition and feel comfortable using our platform.\r\n\r\nCustomer: That sounds great. I appreciate the help.\r\n\r\nAgent: Of course! Let\'s begin by creating your account. I\'ll need some basic information from you to get started. Can you please provide me with your full name, email address, and any other contact information?\r\n\r\nCustomer: Sure, my full name is [Customer\'s Full Name], and my email address is [Customer\'s Email Address].\r\n\r\nAgent: Thank you. Now, let\'s move on to setting up your preferences and customizing your account. Is there anything specific you\'re looking for or any features you\'re particularly interested in?\r\n\r\nCustomer: I\'m interested in learning more about [specific feature].\r\n\r\nAgent: Great choice! I\'ll make sure to provide you with all the information you need about that feature. Lastly, do you have any questions or concerns that you would like to address before we wrap up?\r\n\r\nCustomer: Not at the moment, but I\'ll definitely reach out if I have any questions.\r\n\r\nAgent: Sounds good. Thank you for your time today, [Customer\'s Name]. We\'re excited to have you on board and look forward to working with you. If you need any assistance in the future, don\'t hesitate to reach out to our customer support team. Have a great day!\r\n\r\nCustomer: Thank you, [Agent\'s Name]. Have a great day too.', NULL, NULL, NULL),
(19, 'Test Lead 1', '919016143088', '2025-08-14 16:15:34', NULL, 'failed', '7', '[Sound of phone ringing]\r\n\r\nAgent: Hello, this is [Agent\'s Name] from [Company Name]. Am I speaking with [Customer\'s Name]?\r\n\r\nCustomer: Yes, this is [Customer\'s Name].\r\n\r\nAgent: Great! I\'m calling to welcome you to our company and guide you through the onboarding process. Are you ready to get started?\r\n\r\nCustomer: Yes, I\'m ready.\r\n\r\nAgent: Perfect! During this call, I\'ll walk you through setting up your account, familiarizing you with our services, and answering any questions you may have. I want to make sure you have a smooth transition and feel comfortable using our platform.\r\n\r\nCustomer: That sounds great. I appreciate the help.\r\n\r\nAgent: Of course! Let\'s begin by creating your account. I\'ll need some basic information from you to get started. Can you please provide me with your full name, email address, and any other contact information?\r\n\r\nCustomer: Sure, my full name is [Customer\'s Full Name], and my email address is [Customer\'s Email Address].\r\n\r\nAgent: Thank you. Now, let\'s move on to setting up your preferences and customizing your account. Is there anything specific you\'re looking for or any features you\'re particularly interested in?\r\n\r\nCustomer: I\'m interested in learning more about [specific feature].\r\n\r\nAgent: Great choice! I\'ll make sure to provide you with all the information you need about that feature. Lastly, do you have any questions or concerns that you would like to address before we wrap up?\r\n\r\nCustomer: Not at the moment, but I\'ll definitely reach out if I have any questions.\r\n\r\nAgent: Sounds good. Thank you for your time today, [Customer\'s Name]. We\'re excited to have you on board and look forward to working with you. If you need any assistance in the future, don\'t hesitate to reach out to our customer support team. Have a great day!\r\n\r\nCustomer: Thank you, [Agent\'s Name]. Have a great day too.', NULL, NULL, NULL),
(20, 'Test Lead 1', '919016143088', '2025-08-19 12:24:52', NULL, 'failed', '8', 'Script:\r\n\r\nAgent: Good morning/afternoon/evening, (Client\'s Name)! This is (Agent\'s Name) calling from (Company Name). I\'m just reaching out to ask how your recent experience with our service was. We value your feedback and want to ensure we are meeting your needs. Can you please share your thoughts with us?\r\n\r\nClient: (Response)\r\n\r\nAgent: I\'m glad to hear that you had a positive experience with us! Is there anything specific that stood out to you or any team member you would like to commend for their exceptional service?\r\n\r\nClient: (Response)\r\n\r\nAgent: That\'s great to hear! We always strive to provide top-notch service to our clients. If there is anything we can do to further improve your experience, please don\'t hesitate to let us know. Your satisfaction is our priority. Thank you for taking the time to share your feedback with us, (Client\'s Name)! Have a wonderful day!\r\n\r\nEnd of call.', NULL, NULL, NULL),
(21, 'Test Lead 1', '919016143088', '2025-08-19 12:43:06', NULL, 'failed', '8', 'Script:\r\n\r\nAgent: Good morning/afternoon/evening, (Client\'s Name)! This is (Agent\'s Name) calling from (Company Name). I\'m just reaching out to ask how your recent experience with our service was. We value your feedback and want to ensure we are meeting your needs. Can you please share your thoughts with us?\r\n\r\nClient: (Response)\r\n\r\nAgent: I\'m glad to hear that you had a positive experience with us! Is there anything specific that stood out to you or any team member you would like to commend for their exceptional service?\r\n\r\nClient: (Response)\r\n\r\nAgent: That\'s great to hear! We always strive to provide top-notch service to our clients. If there is anything we can do to further improve your experience, please don\'t hesitate to let us know. Your satisfaction is our priority. Thank you for taking the time to share your feedback with us, (Client\'s Name)! Have a wonderful day!\r\n\r\nEnd of call.', NULL, NULL, NULL),
(22, 'Test Lead 1', '919016143088', '2025-08-19 12:43:35', NULL, 'failed', '8', 'Script:\n\nAgent: Good morning/afternoon/evening, (Client\'s Name)! This is (Agent\'s Name) calling from (Company Name). I\'m just reaching out to ask how your recent experience with our service was. We value your feedback and want to ensure we are meeting your needs. Can you please share your thoughts with us?\n\nClient: (Response)\n\nAgent: I\'m glad to hear that you had a positive experience with us! Is there anything specific that stood out to you or any team member you would like to commend for their exceptional service?\n\nClient: (Response)\n\nAgent: That\'s great to hear! We always strive to provide top-notch service to our clients. If there is anything we can do to further improve your experience, please don\'t hesitate to let us know. Your satisfaction is our priority. Thank you for taking the time to share your feedback with us, (Client\'s Name)! Have a wonderful day!\n\nEnd of call.', NULL, NULL, NULL),
(23, 'Test Lead 1', '919016143088', '2025-08-19 13:02:13', NULL, 'failed', '8', 'Script:\r\n\r\nAgent: Good morning/afternoon/evening, (Client\'s Name)! This is (Agent\'s Name) calling from (Company Name). I\'m just reaching out to ask how your recent experience with our service was. We value your feedback and want to ensure we are meeting your needs. Can you please share your thoughts with us?\r\n\r\nClient: (Response)\r\n\r\nAgent: I\'m glad to hear that you had a positive experience with us! Is there anything specific that stood out to you or any team member you would like to commend for their exceptional service?\r\n\r\nClient: (Response)\r\n\r\nAgent: That\'s great to hear! We always strive to provide top-notch service to our clients. If there is anything we can do to further improve your experience, please don\'t hesitate to let us know. Your satisfaction is our priority. Thank you for taking the time to share your feedback with us, (Client\'s Name)! Have a wonderful day!\r\n\r\nEnd of call.', NULL, NULL, NULL),
(24, 'Test Lead 1', '919313826383', '2025-08-19 13:05:02', NULL, 'failed', '10', 'Hello, this is EVA calling regarding your outstanding balance. Could you please confirm if you have paid your EMI? If not, may I know when you are planning to make the payment?', NULL, NULL, NULL),
(25, 'Test Lead 1', '919016143088', '2025-08-19 13:07:21', NULL, 'failed', '11', 'Certainly, please arrange payment to avoid any service disruption. Have you made your EMI payment yet? If not, may I ask on which date you plan to make the payment?', NULL, NULL, NULL),
(26, 'Paras', '+919016143088', '2025-08-19 16:31:12', NULL, 'failed', NULL, 'Hello, this is Eva. How are you?', '[]', 'CAeff244dc21c118640b6d833d8048d498', NULL),
(27, 'Paras', '+919016143088', '2025-08-19 16:43:13', NULL, 'Answered', NULL, 'Hello, this is Eva. How are you?', '[]', 'CA80bd27c4994445f2485a5845c6246c7f', NULL),
(28, 'Paras', '+919016143088', '2025-08-19 16:46:35', NULL, 'Answered', NULL, 'Hello, this is Eva. How are you?', '[]', 'CAbf33c52e9d826b78c38731ceb6dae20d', NULL),
(29, 'paras', '+919016143088', '2025-08-19 16:48:36', NULL, 'Answered', NULL, 'Hello, this is Eva. How are you?', '[]', 'CAea2b1d273735d83edaaead44c5420f0f', NULL),
(30, 'Test Lead 1', '919016143088', '2025-08-19 17:22:03', NULL, 'Answered', '12', 'Hello, just a reminder about your upcoming appointment tomorrow. If you have any questions or need to reschedule, feel free to let me know. Thank you.', NULL, 'CA8eb3e984d6cf2f24c9d35854f3dcdfd6', NULL),
(31, 'Test Lead 1', '919016143088', '2025-08-19 17:28:46', NULL, 'Answered', '12', 'Hello, just a reminder about your upcoming appointment tomorrow. If you have any questions or need to reschedule, feel free to let me know. Thank you.', NULL, 'CAf332ca61fe091429f1bf7386de3bb64f', NULL),
(32, 'Test Lead 1', '919016143088', '2025-08-19 17:42:46', NULL, 'Answered', '13', 'Sure, I can assist you in setting up a payment plan. Let\'s start by gathering some information to help you get started.', NULL, 'CA226b5af16c4f9b8d661816bb4fd8d96d', NULL),
(33, 'Test Lead 1', '919016143088', '2025-08-19 18:06:43', NULL, 'Answered', '14', 'Hello! I\'m excited to inform you that we are offering a special discount on our new products. Be sure to take advantage of this limited-time offer.', NULL, 'CA4a2499da1ea51668dac421b8bf12e620', NULL),
(34, 'Test Lead 1', '919016143088', '2025-08-19 18:20:24', NULL, 'failed', '15', NULL, NULL, NULL, NULL),
(35, 'Test Lead 1', '919016143088', '2025-08-19 18:24:02', NULL, 'failed', '15', NULL, NULL, NULL, NULL),
(36, 'Test Lead 1', '919016143088', '2025-08-19 18:30:51', NULL, 'failed', '16', NULL, NULL, NULL, NULL),
(37, 'Test Lead 1', '919016143088', '2025-08-19 18:36:07', NULL, 'failed', '16', NULL, NULL, NULL, NULL),
(38, 'Test Lead 1', '919016143088', '2025-08-19 18:41:08', NULL, 'queued', '16', NULL, NULL, 'CAc59786716ab48198e93143cb1b328737', NULL),
(39, 'Test Lead 1', '919016143088', '2025-08-19 18:46:41', NULL, 'queued', '16', NULL, NULL, 'CAea8f17d9275e5f5c3b849130d974af4c', NULL),
(40, 'Test Lead 1', '919016143088', '2025-08-20 12:13:18', NULL, 'Answered', '17', NULL, NULL, 'CA7b41288bbfe70f9913e7b65243c86007', NULL),
(41, 'Test Lead 1', '919016143088', '2025-08-20 12:19:14', NULL, 'initiated', '17', NULL, NULL, 'CA62bedb353044224d7f78583f8087912d', NULL),
(42, 'Test Lead 1', '919016143088', '2025-08-20 12:24:38', NULL, 'completed', '17', NULL, NULL, 'CA787ff41166a4704c4f9f37a52f6f36ac', '2025-08-20 12:24:57'),
(43, 'Test Lead 1', '919016143088', '2025-08-20 12:58:28', NULL, 'initiated', '17', NULL, NULL, 'CA8b2b62067858d24ccc6bcbc1e0f96d2b', NULL),
(44, 'Test Lead 1', '919016143088', '2025-08-20 12:58:57', NULL, 'initiated', '17', NULL, NULL, 'CA0bff09b2c00e3e9f88ff1d6d91b15884', NULL),
(45, 'Test Lead 1', '919016143088', '2025-08-20 13:01:16', NULL, 'completed', '17', NULL, NULL, 'CAdd9c4f7deeb76c7f47dc0da45f97ecee', '2025-08-20 13:01:40'),
(46, 'Test Lead 1', '919016143088', '2025-08-20 13:01:46', NULL, 'ringing', '17', NULL, NULL, 'CAfe2334f0ba16a24683f9868f1d75f886', '2025-08-20 13:22:37'),
(47, 'Test Lead 1', '919016143088', '2025-08-20 13:19:07', NULL, 'completed', '17', NULL, NULL, 'CA3969eb30abc22ef199d7f84ea2329971', '2025-08-20 13:19:34'),
(48, 'Test Lead 1', '919016143088', '2025-08-20 13:28:20', NULL, 'no-answer', '16', NULL, NULL, 'CA86bd50e2349c8ad4e9abc040b767bb8e', '2025-08-20 13:29:11'),
(49, 'Test Lead 1', '919016143088', '2025-08-20 15:01:34', NULL, 'no-answer', '17', NULL, NULL, 'CA4392d261f202b4a7e2b94bfc53cca85f', '2025-08-20 15:02:25'),
(50, 'John', '+919016143088', '2025-08-25 11:18:59', NULL, 'No Answer', '21', NULL, NULL, 'CA5ffc98e8c4760b4cd5d0ece2ca9d9b2b', NULL),
(51, 'John', '+919313826383', '2025-08-25 12:21:36', NULL, 'Answered', '19', NULL, '[{\"from\":\"User\",\"text\":\"Fine fine.\"},{\"from\":\"AI\",\"text\":\"Hi there! How can I assist you today?\"},{\"from\":\"User\",\"text\":\"Nothing.\"},{\"from\":\"AI\",\"text\":\"Okay! If you have any questions or need assistance later, feel free to ask.\"}]', 'CAff196535c9832c7f84b75de78a02f48d', '2025-08-25 12:22:21'),
(52, 'John', '+919313826383', '2025-08-25 12:25:41', NULL, 'Answered', '22', NULL, '[{\"from\":\"User\",\"text\":\"Very well.\"},{\"from\":\"AI\",\"text\":\"Hi there! How can I assist you today?\"},{\"from\":\"User\",\"text\":\"Nothing.\"},{\"from\":\"AI\",\"text\":\"No problem! If you have any questions or need assistance later, just let me know!\"},{\"from\":\"User\",\"text\":\"Okay, thank you.\"},{\"from\":\"AI\",\"text\":\"Okay, thank you for your time. Have a great day!\"}]', 'CAa6eb6645296ab768f4409de59934eb85', '2025-08-25 12:26:51'),
(53, 'John', '+919313826383', '2025-08-25 12:54:16', NULL, 'completed', '22', NULL, NULL, 'CAa8b12947c89feec5737c6d85393be496', '2025-08-25 12:54:40'),
(54, 'John', '+919313826383', '2025-08-25 12:55:37', NULL, 'completed', '23', NULL, NULL, 'CA1bd19fb0fc579cf1bdc433307abe487a', '2025-08-25 12:56:01'),
(55, 'John', '+919313826383', '2025-08-25 13:10:11', NULL, 'completed', '24', NULL, NULL, 'CA63bd4577457a3f0b823f8bcf92ab7c3c', '2025-08-25 13:10:32'),
(56, 'John', '+919313826383', '2025-08-25 13:28:59', NULL, 'completed', '25', NULL, NULL, 'CA80c0dd41fecca127ad6959403358e077', '2025-08-25 13:29:16'),
(57, 'John', '+919313826383', '2025-08-25 13:35:35', NULL, 'completed', '26', NULL, NULL, 'CA034dabb48295f08b38c373d46b7abdc9', '2025-08-25 13:36:06'),
(58, 'John', '+919313826383', '2025-08-25 14:48:59', NULL, 'completed', '26', NULL, '[{\"from\":\"User\",\"text\":\"Nothing, thank you.\",\"type\":\"topic\"},{\"from\":\"AI\",\"text\":\"Okay, thank you for your time. Have a great day!\"}]', 'CA6ac7dd64a6c6c39fcce42940e225683f', '2025-08-25 14:49:45');

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `voice` varchar(255) DEFAULT NULL,
  `script` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `custom_service` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `campaigns`
--

INSERT INTO `campaigns` (`id`, `user_id`, `name`, `description`, `voice`, `script`, `file_path`, `service`, `custom_service`, `start_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'asdsdsd', 'asd', 'male-1', 'Hello {username}, I am EVA calling from {company}. asd', NULL, 'feedback-calls', '', '2025-08-12 16:07:00', 'Completed', '2025-08-12 10:37:13', '2025-08-25 09:11:50'),
(2, 3, 'asd', 'asd', 'male-1', 'Hello {username}, I am EVA calling from {company}. asd', NULL, 'debt-collection', '', '2025-08-12 16:11:00', 'Completed', '2025-08-12 10:41:27', '2025-08-25 09:11:50'),
(3, 3, 'asd', 'asd', 'male-1', 'Hello {username}, I am EVA calling from {company}. asd new', NULL, 'feedback-calls', '', '2025-08-12 16:41:00', 'Completed', '2025-08-12 11:11:06', '2025-08-25 09:11:50'),
(4, 4, 'Eva Call', 'Remind user they have an appointment on the eva', 'female-1', 'Hello {username}, I am EVA calling from {company}. Hello, this is a friendly reminder that you have an appointment scheduled on the evening of [date] with [provider name]. Please remember to mark your calendar and make any necessary arrangements to attend. If you have any questions or need to reschedule, please don\'t hesitate to contact us at [phone number]. Thank you for choosing us for your healthcare needs. We look forward to seeing you soon. Have a great day!', '9bf118657a239aee845cfea5a33d5704', 'automated-reminder', '', '2025-08-14 08:32:00', 'Completed', '2025-08-14 03:02:30', '2025-08-25 09:11:50'),
(5, 4, 'Testing ', 'Write an call script to reminder the client they have meating at today at 3:00 today is thursday 14/aug/2025', 'ai-neural', 'Hello {username}, I am EVA calling from {company}. [Ring, ring]\r\n\r\nClient: Hello?\r\n\r\nAgent: Hi there, this is [Agent Name] calling from [Company Name]. I\'m just calling to remind you that you have a meeting scheduled for today at 3:00 PM. Today is Thursday, August 14th, 2025.\r\n\r\nClient: Oh, thank you for the reminder. I almost forgot about that!\r\n\r\nAgent: No problem at all! Is there anything else you need to prepare for the meeting?\r\n\r\nClient: I think I\'m all set, but thanks for checking in. I\'ll make sure to be there on time.\r\n\r\nAgent: Great to hear! If you have any questions or need anything else before the meeting, feel free to reach out to us. We look forward to seeing you at 3:00 PM.\r\n\r\nClient: Sounds good. Thanks for calling!\r\n\r\nAgent: Have a great day. Goodbye!\r\n\r\nClient: Goodbye!', '32769810ccd7b620523b7940d17c6ebb', 'automated-reminder', '', '2025-08-14 09:11:00', 'Completed', '2025-08-14 03:39:30', '2025-08-25 09:11:50'),
(6, 4, 'TestParas', 'Feedback call script only for testing', 'male-1', 'Hello {username}, I am EVA calling from {company}. [Phone rings]\r\n\r\nCaller: Hello, this is [Your Name] calling from [Company Name]. Am I speaking to [Recipient\'s Name]?\r\n\r\nRecipient: Yes, this is [Recipient\'s Name].\r\n\r\nCaller: Great! I\'m calling to gather feedback on our recent services. We truly value your opinion and would love to hear about your experience with us. Can you spare a few minutes to provide some feedback?\r\n\r\nRecipient: Sure, I can give some feedback.\r\n\r\nCaller: Fantastic! On a scale of 1 to 10, how satisfied were you with our services?\r\n\r\nRecipient: I would say an 8.\r\n\r\nCaller: That\'s great to hear! What did you enjoy most about our services?\r\n\r\nRecipient: I really appreciated the quick response time and the professionalism of your team.\r\n\r\nCaller: Thank you for sharing that. Is there anything we could have done better to improve your experience?\r\n\r\nRecipient: Maybe a clearer communication on the pricing would have been helpful.\r\n\r\nCaller: Thank you for that feedback. We will definitely take that into consideration for future improvements. Is there anything else you would like to add?\r\n\r\nRecipient: No, that\'s all.\r\n\r\nCaller: Thank you so much for taking the time to provide your feedback. We really appreciate it. Have a great day!\r\n\r\nRecipient: You\'re welcome. Goodbye.\r\n\r\nCaller: Goodbye.', '8b08f81cdfdca42f76a51538ebf3bced', 'feedback-calls', '', '2025-08-14 09:19:00', 'Completed', '2025-08-14 03:47:53', '2025-08-25 09:11:50'),
(7, 5, 'Eva Onboarding Call', 'this is onboarding call', 'female-1', 'Hello {username}, I am EVA calling from {company}. [Sound of phone ringing]\r\n\r\nAgent: Hello, this is [Agent\'s Name] from [Company Name]. Am I speaking with [Customer\'s Name]?\r\n\r\nCustomer: Yes, this is [Customer\'s Name].\r\n\r\nAgent: Great! I\'m calling to welcome you to our company and guide you through the onboarding process. Are you ready to get started?\r\n\r\nCustomer: Yes, I\'m ready.\r\n\r\nAgent: Perfect! During this call, I\'ll walk you through setting up your account, familiarizing you with our services, and answering any questions you may have. I want to make sure you have a smooth transition and feel comfortable using our platform.\r\n\r\nCustomer: That sounds great. I appreciate the help.\r\n\r\nAgent: Of course! Let\'s begin by creating your account. I\'ll need some basic information from you to get started. Can you please provide me with your full name, email address, and any other contact information?\r\n\r\nCustomer: Sure, my full name is [Customer\'s Full Name], and my email address is [Customer\'s Email Address].\r\n\r\nAgent: Thank you. Now, let\'s move on to setting up your preferences and customizing your account. Is there anything specific you\'re looking for or any features you\'re particularly interested in?\r\n\r\nCustomer: I\'m interested in learning more about [specific feature].\r\n\r\nAgent: Great choice! I\'ll make sure to provide you with all the information you need about that feature. Lastly, do you have any questions or concerns that you would like to address before we wrap up?\r\n\r\nCustomer: Not at the moment, but I\'ll definitely reach out if I have any questions.\r\n\r\nAgent: Sounds good. Thank you for your time today, [Customer\'s Name]. We\'re excited to have you on board and look forward to working with you. If you need any assistance in the future, don\'t hesitate to reach out to our customer support team. Have a great day!\r\n\r\nCustomer: Thank you, [Agent\'s Name]. Have a great day too.', 'd99442e4dd0cd46fc7d20db032eea193', 'feedback-calls', '', '2025-08-14 16:12:00', 'Scheduled', '2025-08-14 10:42:46', '2025-08-25 09:11:50'),
(8, 6, 'Paras Hirani', 'How was your recent experience with our service?\r\n\r\nask to the client and take responce', 'female-1', 'Hello {username}, I am EVA calling from {company}. Script:\r\n\r\nAgent: Good morning/afternoon/evening, (Client\'s Name)! This is (Agent\'s Name) calling from (Company Name). I\'m just reaching out to ask how your recent experience with our service was. We value your feedback and want to ensure we are meeting your needs. Can you please share your thoughts with us?\r\n\r\nClient: (Response)\r\n\r\nAgent: I\'m glad to hear that you had a positive experience with us! Is there anything specific that stood out to you or any team member you would like to commend for their exceptional service?\r\n\r\nClient: (Response)\r\n\r\nAgent: That\'s great to hear! We always strive to provide top-notch service to our clients. If there is anything we can do to further improve your experience, please don\'t hesitate to let us know. Your satisfaction is our priority. Thank you for taking the time to share your feedback with us, (Client\'s Name)! Have a wonderful day!\r\n\r\nEnd of call.', '2dd696223aeaaeb44bf54b9802e7229b', 'feedback-calls', '', '2025-08-19 12:24:00', 'Scheduled', '2025-08-19 06:54:46', '2025-08-25 09:11:50'),
(9, 6, 'Paras Hirani', 'We’d love your feedback on your last purchase.\r\n\r\n', 'male-1', 'Hello {username}, I am EVA calling from {company}. Hello, this is EVA calling from the customer service team. We\'d love your feedback on your last purchase. How was your experience with our product?\r\n\r\nCustomer: Hi, thank you for reaching out. I actually had a great experience with my last purchase. The product exceeded my expectations, and the delivery was on time.\r\n\r\nThat\'s wonderful to hear! We really appreciate your positive feedback. Is there anything specific you\'d like to share about your experience that we can use to improve our services?\r\n\r\nCustomer: I can\'t think of anything at the moment, but I\'ll be sure to let you know if something comes to mind.\r\n\r\nGreat, thank you so much for your time and valuable feedback. If you ever have any suggestions or encounter any issues in the future, please don\'t hesitate to reach out to us. We\'re here to help.\r\n\r\nCustomer: Will do, thanks for checking in. Have a great day.\r\n\r\nYou\'re welcome! You too, have a great day. Goodbye!', '79b74cdf19ad21f85c719748777d451a', 'feedback-calls', '', '2025-08-19 12:43:00', 'Scheduled', '2025-08-19 07:12:59', '2025-08-25 09:11:50'),
(10, 6, 'Clickup', 'We are calling regarding your outstanding balance.\r\nAre you paid your emi or not if not when you are paying', 'ai-neural', 'Hello {username}, I am EVA calling from {company}. Hello, this is EVA calling regarding your outstanding balance. Could you please confirm if you have paid your EMI? If not, may I know when you are planning to make the payment?', '2e5648b62686f29c5be41d0c725eb501', 'debt-collection', '', '2025-08-19 02:02:00', 'Scheduled', '2025-08-19 07:32:05', '2025-08-25 09:11:50'),
(11, 6, 'Debt Collection', 'Are you Please arrange payment to avoid service disruption.\r\n\r\nAre you paid your emi or not \r\nif not then ask which date you are paying', 'male-1', 'Hello {username}, I am EVA calling from {company}. Certainly, please arrange payment to avoid any service disruption. Have you made your EMI payment yet? If not, may I ask on which date you plan to make the payment?', '3b6e0115f5e49386f79dc3048f42e339', 'debt-collection', '', '2025-08-19 13:07:00', 'Scheduled', '2025-08-19 07:37:14', '2025-08-25 09:11:50'),
(12, 6, 'paras', 'Don\'t forget your upcoming appointment tomorrow.\r\n\r\n\r\nReview', 'male-1', 'Hello {username}, I am EVA calling from {company}. Hello, just a reminder about your upcoming appointment tomorrow. If you have any questions or need to reschedule, feel free to let me know. Thank you.', 'ca976d66c8efe118da011da524b509bd', 'automated-reminder', '', '2025-08-19 17:21:00', 'Scheduled', '2025-08-19 11:51:59', '2025-08-25 09:11:50'),
(13, 6, 'New Campaign', 'Can we assist you in setting up a payment plan?', 'female-1', 'Hello {username}, I am EVA calling from {company}. Sure, I can assist you in setting up a payment plan. Let\'s start by gathering some information to help you get started.', '5d2fba901546852df1e2ed1c1f58fb71', 'debt-collection', '', '2025-08-19 17:42:00', 'Scheduled', '2025-08-19 12:12:41', '2025-08-25 09:11:50'),
(14, 6, 'make.com', 'Enjoy a special discount on our new products.', 'female-1', 'Hello {username}, I am EVA calling from {company}. Hello! I\'m excited to inform you that we are offering a special discount on our new products. Be sure to take advantage of this limited-time offer.', 'ff7d70641a5eb49a96a777dfd5dae748', 'promo-outreach', '', '2025-08-19 18:06:00', 'Scheduled', '2025-08-19 12:36:38', '2025-08-25 09:11:50'),
(15, 6, 'chai wala', 'How is our chai  We’d love your feedback on your last purchase.', 'female-1', 'Hello {username}, I am EVA calling from {company}. Sure, I can help collect feedback on your recent chai purchase. Let me know how you would like to proceed with gathering the feedback.', '207b64a86e723d7fe04cb251c4f0e4f6', 'feedback-calls', '', '2025-08-19 18:20:00', 'Scheduled', '2025-08-19 12:50:20', '2025-08-25 09:11:50'),
(16, 6, 'New Campag', 'Please confirm if you will be attending your appointment. Don\'t forget your upcoming appointment tomorrow. Don\'t forget your upcoming appointment tomorrow.    comming or not ????', 'female-1', 'Hello {username}, I am EVA calling from {company}. Certainly! I will confirm your attendance for the upcoming appointment tomorrow. Thank you for the reminder.', 'fc2b679a1d6fc74c98661a1357740049', 'automated-reminder', NULL, '2025-08-19 18:30:00', 'Scheduled', '2025-08-19 13:00:47', '2025-08-25 09:11:50'),
(17, 6, 'Campaign Test', 'Exclusive offer just for you this week!\r\n\r\nare you intreseted to buy our products <<<<the product info is (handwash,facewah,and skin care products. )', 'male-1', 'Hello {username}, I am EVA calling from {company}. Hello! We have an exclusive offer just for you this week on handwash, facewash, and skin care products. Let me know if you\'re interested in purchasing any of these items.', 'cd9113720529a313b01634168aca17c3', 'promo-outreach', NULL, '2025-08-20 11:39:00', 'Scheduled', '2025-08-20 06:07:34', '2025-08-25 09:11:50'),
(18, 7, 'Samsung Galaxy S21', 'Reminder ', 'female-1', 'Hello {username}, I am EVA calling from {company}. Hello, this is EVA. I\'m here to remind you about our upcoming campaign. Please let me know if you need any assistance or information regarding the event.', 'f471ca3b02079ac5e24c9f062462d63e', 'automated-reminder', NULL, '2025-08-25 11:05:00', 'Scheduled', '2025-08-25 05:35:02', '2025-08-25 09:11:50'),
(19, 7, 'Samsung Galaxy S21', 'Reminder script with good morning msg', 'female-1', 'Hello {username}, I am EVA calling from {company}. Good morning! This is a friendly reminder to start your day on a positive note. Remember to seize the day and make the most of every opportunity. Have a wonderful day ahead!', 'ccaf22b9965b6af70f63cdd51f989937', 'automated-reminder', NULL, '2025-08-25 11:13:00', 'Scheduled', '2025-08-25 05:43:40', '2025-08-25 09:11:50'),
(20, 7, 'Denver', 'Automatic Conversation which Denver Perfume use you ?', 'ai-neural', 'Hello {username}, I am EVA calling from {company}. Hello! How can I assist you with your Denver Perfume selection today?', NULL, 'automated-reminder', NULL, '2025-08-25 11:17:00', 'Scheduled', '2025-08-25 05:47:50', '2025-08-25 09:11:50'),
(21, 7, 'Nike Air Max', 'Denver PErfume Review call', 'male-1', 'Hello {username}, I am EVA calling from {company}. Hello, thank you for joining the Denver Perfume Review call. Today we will be discussing the latest fragrances and sharing our thoughts. Let\'s start with the first fragrance on our list.', '150b06431d8e554eb3aa12de480b5bba', 'promo-outreach', NULL, '2025-08-25 11:18:00', 'Scheduled', '2025-08-25 05:48:55', '2025-08-25 09:11:50'),
(22, 7, 'New Campaign', 'Give us feed back for our event management ,  Would you recommend us to a friend?', 'female-1', 'Hello {username}, I am EVA calling from {company}. Thank you for attending our event. Your feedback is important to us. Would you recommend our event management services to a friend?', '50b9a2304c29191f4d1616fb583c4bf0', 'feedback-calls', NULL, '2025-08-25 12:25:00', 'Scheduled', '2025-08-25 06:55:11', '2025-08-25 09:11:50'),
(23, 7, 'User Greet', 'How was your recent experience with our service? ,,,,,, Give as genune answer', 'male-1', 'Hello {username}, I am EVA calling from {company}. I\'m here to assist you with providing feedback on your recent experience with our service. Your genuine answer is valuable to us.', 'f9415bcc8f2275b440c84ab857b2bab0', 'feedback-calls', NULL, '2025-08-25 12:55:00', 'Scheduled', '2025-08-25 07:25:31', '2025-08-25 09:11:50'),
(24, 7, 'Lenovo Ideapad slim 3', 'Collecting the debts overdue to the date its just an friendly reminder when you arre paying the debt collect the data', 'female-1', 'Hello {username}, I am EVA calling from {company}. Hello, this is EVA. I\'m here to remind you about the overdue debts. When you make the payment, please remember to collect the necessary data. Thank you.', 'e0d5f48fb8fb89fb71c0f755c165819a', 'debt-collection', NULL, '2025-08-25 13:10:00', 'Scheduled', '2025-08-25 07:40:04', '2025-08-25 09:11:50'),
(25, 7, 'Denver', 'Automated appointment  Don\'t forget your upcoming appointment tomorrow. ,, (ask user if it is avalible or not)', 'female-1', 'Hello {username}, I am EVA calling from {company}. Hello, reminding you of your upcoming appointment tomorrow. Is the time still available for you?', 'b249af18c2b3b3d413102a19c0419014', 'automated-reminder', NULL, '2025-08-25 13:28:00', 'Scheduled', '2025-08-25 07:58:54', '2025-08-25 09:11:50'),
(26, 7, 'Testing', 'How was your recent experience with our service? We’d love your feedback on your last purchase. Would you recommend us to a friend?', 'male-1', 'Hello {username}, I am EVA calling from {company}. Hello! I\'m here to gather your feedback on your recent experience with our service. Your opinion on your last purchase is valuable to us. Would you recommend us to a friend?', '0e676f6833f05f031b356fe4720263fe', 'feedback-calls', NULL, '2025-08-25 13:39:00', 'Scheduled', '2025-08-25 08:05:31', '2025-08-25 09:11:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `company` varchar(255) DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `company`, `refresh_token`, `created_at`) VALUES
(1, 'Paras Hirani', 'paras@example.com', '$2b$10$qzQMzX3AWXX3t.h93MVSG.93qBnVIPrlog2Wv/PpbihvV8ZTUoldK', 'admin', 'Paras ', NULL, '2025-08-13 06:04:19'),
(3, 'test test', 'test@gmail.com', '$2b$10$hJVHNY2SP2ZZIFyz2c9BMO5Y3dj8SgcACahCPTCliqDZbKO7DZsdW', 'user', 'testing', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InRlc3QgdGVzdCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImNvbXBhbnkiOiJ0ZXN0aW5nIiwiaWF0IjoxNzU1MTU2MDQ1LCJleHAiOjE3NTU3NjA4NDV9.bIdKZB9yZ8MWC2YarNoIPl9WFe1OTt-4l27amkijTkU', '2025-08-13 06:14:59'),
(4, 'Paras Hirani', 'parashirani55@gmail.com', '$2b$10$FGl/FGuyOCnGAtbrAVnSn.lNxvNZqlmlzWqddjq4Due9lbF7wFlfq', 'user', 'Eva', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IlBhcmFzIEhpcmFuaSIsImVtYWlsIjoicGFyYXNoaXJhbmk1NUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImNvbXBhbnkiOiJFdmEiLCJpYXQiOjE3NTUxNDAyNDcsImV4cCI6MTc1NTc0NTA0N30.Uxe5wCjlmiQRCEmiaQMpOq1TruQHRzlJModOR8lwRuM', '2025-08-14 02:57:02'),
(5, 'Brandon Crusha', 'brndoncrusha@gmail.com', '$2b$10$Esdd8B.dP0Xhu8FxkPzc1eLbYVTH4PypxQlx789N9mUMm5lOJA4Y.', 'user', 'Eva', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6IkJyYW5kb24gQ3J1c2hhIiwiZW1haWwiOiJicm5kb25jcnVzaGFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJjb21wYW55IjoiRXZhIiwiaWF0IjoxNzU1MTY4MDU5LCJleHAiOjE3NTU3NzI4NTl9.nDxWDUVKZDXnVxmfeI14QrIOwk6Dq0g3SSiQ4FIwiNQ', '2025-08-14 10:40:33'),
(6, 'Test User', 'test1@gmail.com', '$2b$10$/vzQbFe7SFiJI.Cvq/W9q.Soit9nuRYvk4h7eLc3r09iFay4.CwWa', 'user', 'Testing', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJjb21wYW55IjoiVGVzdGluZyIsImlhdCI6MTc1NTYwODc1NywiZXhwIjoxNzU2MjEzNTU3fQ.YlnXVlHghK9YFJAAW30tkVMNuD30hUGNHZwJPzjYugs', '2025-08-19 06:13:08'),
(7, 'John Doe', 'john@gmail.com', '$2b$10$XuECZYynPnCE9ccxhsNpQOTOpg4WTKkt38AQSyf8InqWt0LCs6qqa', 'user', 'John Company', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiY29tcGFueSI6IkpvaG4gQ29tcGFueSIsImlhdCI6MTc1NjEwNTYzMCwiZXhwIjoxNzU2NzEwNDMwfQ.5V4peCBwIPrJ6NTNgPJOBYe2YgsZ6qXKyshorm2Kytw', '2025-08-25 05:29:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calls`
--
ALTER TABLE `calls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status_started` (`status`,`started_at`);

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calls`
--
ALTER TABLE `calls`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
