<?php
/*
thing to do
add a way to create table update table and delete table
add a way to create columns update columns and delete columns + create list columns with information

*/
require_once __DIR__ . '/../functions/response.php';
require_once __DIR__ . '/../functions/requestHelper.php';

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
  $result = [];

  try {
    $table = isset($data['table']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['table']) : null;
    $type = $data['type'] ?? null;
    $database = $db->getCurrentDatabase();

    // if table does not exist show every column in every table in the database
    if (!$table) {
      $stmt = $conn->prepare("
                SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
                FROM information_schema.COLUMNS
                WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
            ");
      $stmt->execute();

      foreach ($stmt->fetchAll() as $row) {
        $schema = $row['TABLE_SCHEMA'];
        $tableName = $row['TABLE_NAME'];
        $column = $row['COLUMN_NAME'];

        $result[$schema][$tableName][] = $column;
      }

      echo response('success', 'All tables and columns fetched successfully', $result);
      return;
    }

    // select the database
    if (!empty($database)) {
      if($conn->checkDatabase($database)){
        $conn->exec("USE `$database`");
      };

    }

    // if type information exist show table information
    // aimed when user need to modify column etc....
    // check if type exist without table name
    if ($type === 'information' && !$table) {
      echo response('error', 'Table name required for information type', null, 400);
      return;
    }
    // verify if table exist:
    if ($table && $database) {
      $checkStmt = $conn->prepare("
        SELECT COUNT(*)
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
    ");
      $checkStmt->execute([$database, $table]);

      if ($checkStmt->fetchColumn() == 0) {
        echo response('error', "Table '$table' not found in database '$database'", null, 404);
        return;
      }
    }
    if ($type === 'information') {
      $stmt = $conn->prepare("
                SELECT *
                FROM information_schema.COLUMNS
                WHERE table_schema = :schema AND table_name = :table
            ");
      $stmt->execute([
        'schema' => $database,
        'table' => $table
      ]);

      foreach ($stmt->fetchAll() as $row) {
        $schema = $row['TABLE_SCHEMA'];
        $tableName = $row['TABLE_NAME'];
        $column = $row['COLUMN_NAME'];

        $result[$schema][$tableName]['columns'][$column] = [
          "data_type" => $row['DATA_TYPE'],
          "column_type" => $row['COLUMN_TYPE'],
          "nullable" => $row['IS_NULLABLE'] === 'YES',
          "default" => $row['COLUMN_DEFAULT'],
          "is_primary" => $row['COLUMN_KEY'] === 'PRI',
          "is_unique" => $row['COLUMN_KEY'] === 'UNI',
          "is_auto_increment" => strpos($row['EXTRA'], 'auto_increment') !== false,
          "comment" => $row['COLUMN_COMMENT'],
          "char_max_length" => $row['CHARACTER_MAXIMUM_LENGTH'],
          "numeric_precision" => $row['NUMERIC_PRECISION'],
          "numeric_scale" => $row['NUMERIC_SCALE'],
          "ordinal_position" => $row['ORDINAL_POSITION']
        ];
      }

      echo response('success', "Detailed information for table `$table` fetched", $result);
    } else {
      $stmt = $conn->query('SHOW TABLES');
      $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
      echo response('success', 'Table list fetched', $tables);
    }

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

  if (!$query) {
    response('error', 'No query provided', null, 400);
  }

  try {
    $database = $db->getCurrentDatabase();
    
    if (!empty($database)) {
      if($db->checkDatabase($database)){
        $sql = 'USE ' . $database;
        $stmt = $db->pdo->query($sql);
      }

    }
    $parsedQuery = $db->parseSQLQuery($query);
    if ($parsedQuery['type'] === 'unknown') {
      response('error', 'Unsupported query type', null, 400);
    }
    
    $startTime = microtime(true);

    $stmt = $db->pdo->query($query);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $endTime = microtime(true);
    $executionTime = round(($endTime - $startTime) * 1000, 2);

    response('success', 'Query executed', [
      'columns' => array_keys($rows[0] ?? []),
      'rows' => $rows,
      'rowsAffected' => $stmt->rowCount(),
      'executionTime' => $executionTime . ' ms'
    ]);
  } catch (PDOException $e) {
    response('error', 'SQL error: ' . $e->getMessage(), null, 500);
  }
});
