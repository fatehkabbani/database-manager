<?php
require_once __DIR__ . '/../functions/response.php';
$router->map('POST', '/list_databases', function () {
  try {
    $db = new Database();
    $conn = $db->pdo;

    $stmt = $conn->prepare('SHOW DATABASES');
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_COLUMN));
  } catch (Exception $e) {
    response('error', $e->getMessage(), null, 500);
  }
});
$router->map('POST', '/list_tables', function () {
  $requestBody = file_get_contents('php://input');
  $data = json_decode($requestBody, true);
  if (!isset($data['database'])) {
    response('error', "error database name is required", null, 404);
  }
  $database = $data['database'];
  try {
    $db = new Database();
    $db->setDatabase($database);
    // echo json_encode($result);
    $conn = $db->pdo;

    $stmt = $conn->prepare('SHOW TABLES');
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_COLUMN));
  } catch (Exception $e) {
    response('error', $e->getMessage(), null, 500);
  }
});
// $router->map()
