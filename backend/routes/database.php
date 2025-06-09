<?php
/*
thing to do
add a way to create table update table and delete table
add a way to create columns update columns and delete columns + create list columns with information

*/
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
  $data = getDataFromRequest();
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
  $data = getDataFromRequest();
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
      $db->setDatabase($data['database']);

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
$router->map('POST', '/select_database', function () {
  $data = getDataFromRequest();
  if (!isset($data['database']) || empty($data['database'])) {
    response('error', 'database must be provided', null, 400);
  }
  $db = new Database();
  if ($db->checkDatabase($data['database'])) {
    $db->setDatabase($data['database']);
    response('success', 'database has been selected successfully', array(
      'database_name' => $db->getCurrentDatabase()
    ));
  } else {
    response('error', 'database dose not exists', null, 404);
  }
});
$router->map('POST', '/run_query', function () {
  $data = getDataFromRequest();
  $db = new Database();
  $query = trim($data['query'] ?? '');

  // Check if query is empty
  if (!$query) {
    response('error', 'No query provided', null, 400);
  }

  try {

    // i feel cheap doing it like this but till i find another way to do it ill do it like this
    // ok i have to find another way to do it for now run query its working but i have to fix select database
    // to make a query work i have to specify the database using '.' ex: select * from database.table
    $stmt = $db->pdo->query($query);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    var_dump($stmt);
    response('success', 'Query executed', [
      'columns' => array_keys($rows[0] ?? []),
      'rows' => $rows
    ]);
  } catch (PDOException $e) {
    response('error', 'SQL error: ' . $e->getMessage(), null, 500);
  }
});
// $router->map()
function getDataFromRequest()
{
  $requestBody = file_get_contents('php://input');
  return json_decode($requestBody, true);
}
