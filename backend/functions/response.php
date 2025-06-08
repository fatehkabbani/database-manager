<?php
function response($status, $message, $data = null, $httpCode = 200): void
{
  header('Content-Type: application/json');
  http_response_code($httpCode);
  $response = [
    'status' => $status,
    'message' => $message
  ];
  if ($data !== null) {
    $response['data'] = $data;
  }
  echo json_encode($response);
  exit();
}
