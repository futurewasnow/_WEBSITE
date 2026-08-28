<?php
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Configuration
$recipient_email = 'info@yousee360.com';
$subject = 'New Lead from YouSee360 Website';

// Collect and sanitize input
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING) ?? 'N/A';
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$budget = filter_input(INPUT_POST, 'budget', FILTER_SANITIZE_STRING) ?? 'Not specified';
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING) ?? 'No message provided';

// Handle services (array)
$services = isset($_POST['services']) ? $_POST['services'] : [];
if (is_array($services)) {
    $services_list = implode(', ', array_map('htmlspecialchars', $services)); // Simple comma-separated list
} else {
    $services_list = 'None selected';
}

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Build email content
$email_content = "You have received a new message from your website contact form.\n\n";
$email_content .= "Name: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Services Interested In: $services_list\n";
$email_content .= "Project Budget: $budget\n\n";
$email_content .= "Message:\n$message\n";

// Build headers
$headers = "From: YouSee360 Website <no-reply@yousee360.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($recipient_email, $subject, $email_content, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?>
