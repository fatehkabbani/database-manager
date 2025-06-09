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
  header('Content-Type: application/json; charset=utf-8');

  $requestBody = file_get_contents('php://input');
  $data = json_decode($requestBody, true);

  $db = new Database();
  $conn = $db->pdo;

  try {
    $result = [];
    // so my idea is to get all the database table if database is not picked so yeah ig its working now
    if (!isset($data['database']) || empty($data['database'])) {
      $stmt = $conn->prepare(
        "SELECT table_schema, table_name
                 FROM information_schema.tables
                 WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')"
      );
      $stmt->execute();
      $rows = $stmt->fetchAll();
      foreach ($rows as $row) {
        $schema = $row['TABLE_SCHEMA'];
        $table = $row['TABLE_NAME'];
        if (!isset($result[$schema])) {
          $result[$schema] = [];
        }
        $result[$schema][] = $table;
      }

    } else {
      // TODO fix it make an endpoint to select a database
      $database = preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['database']);
      $db->setDatabase($database);

      $stmt = $conn->prepare('SHOW TABLES');
      $stmt->execute();
      $rows = $stmt->fetchAll(PDO::FETCH_NUM);

      foreach ($rows as $row) {
        $result[$database][] = $row[0];
      }
    }

    echo response('success', 'Tables fetched successfully', $result);

  } catch (Exception $e) {
    echo response('error', $e->getMessage(), null, 500);
  }
});



$router->map('POST', '/list_columns', function () {
  header('Content-Type: application/json; charset=utf-8');

  $requestBody = file_get_contents('php://input');
  $data = json_decode($requestBody, true);

  $db = new Database();
  $conn = $db->pdo;

  try {
    $result = [];
    if (!isset($data['table']) || empty($data['table'])) {
      $stmt = $conn->prepare(
        "SELECT *
                 FROM information_schema.COLUMNS
                 WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')"
      );
      $stmt->execute();
      $rows = $stmt->fetchAll();

      foreach ($rows as $row) {
        $schema = $row['TABLE_SCHEMA'];
        $table = $row['TABLE_NAME'];
        $column = $row['COLUMN_NAME'];

        // Initialize the schema key if not present
        if (!isset($result[$schema])) {
          $result[$schema] = [];
        }

        if (!isset($result[$schema][$table])) {
          $result[$schema][$table] = [];
        }

        $result[$schema][$table][] = $column;
      }


    } else {
      $table = preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['table']);
      $db->setDatabase($table);

      $stmt = $conn->prepare('SHOW TABLES');
      $stmt->execute();
      $rows = $stmt->fetchAll(PDO::FETCH_NUM);

      foreach ($rows as $row) {
        $result[$table][] = $row[0];
      }
    }

    echo response('success', 'Tables fetched successfully', $result);

  } catch (Exception $e) {
    echo response('error', $e->getMessage(), null, 500);
  }
});
// $router->map()
