<?php
require_once __DIR__ . '/../classes/database.php';

$router->map('POST', '/test', function () {
  try {
    $db = new Database();
    $result = $db->setDatabase('db_pc');
    // echo json_encode($result);
    $conn = $db->pdo;

    $stmt = $conn->prepare('SHOW TABLES');
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_COLUMN));
  } catch (Exception $e) {
    response('error', $e->getMessage(), null, 500);
  }



});
