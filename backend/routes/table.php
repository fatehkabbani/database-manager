<?php
/*
POST /table/create
POST /table/drop
POST /table/rename
POST /table/truncate
GET  /table/{name}/info
 */
require_once __DIR__ . '/../functions/response.php';
require_once __DIR__ . '/../functions/requestHelper.php';
/*
TODO : later implement FK
*/
$router->map('POST', '/table/create', function () {
  $data = getDataFromRequest();

  // Validation
  if (!isset($data['table']) || empty($data['table'])) {
    response('error', 'Table name is required', null, 400);
    return;
  }

  if (!validateTableName($data['table'])) {
    response('error', 'Invalid table name format', null, 400);
    return;
  }

  if (!isset($data['columns']) || empty($data['columns'])) {
    response('error', 'At least one column is required', null, 400);
    return;
  }

  $db = new Database();
  $db->pdo->query('USE ' . $db->getCurrentDatabase());
  if ($db->checkTable($data['table'])) {
    response('error', 'Table already exists', null, 400);
    return;
  }

  try {
    $sql = "CREATE TABLE `{$data['table']}` (";
    $columnDefinitions = [];
    $primaryKeys = [];

    foreach ($data['columns'] as $column) {
      $colDef = "`{$column['name']}` {$column['type']}";

      if (!empty($column['length'])) {
        $colDef .= "({$column['length']})";
      }

      if (!$column['nullable']) {
        $colDef .= " NOT NULL";
      }

      // NOTE : This is a simplified version, change it to handle more complex defaults
      // TODO LATER check if its numeric or number or boolean etc... do it later not rly important rn
      if ($column['default'] !== null) {
        if ($column['default'] === 'CURRENT_TIMESTAMP') {
          $colDef .= " DEFAULT NOW()";
        } else {
          $colDef .= " DEFAULT '{$column['default']}'";
        }
      }
      if ($column['auto_increment']) {
        $colDef .= " AUTO_INCREMENT";
      }

      $columnDefinitions[] = $colDef;

      if ($column['primary']) {
        $primaryKeys[] = "`{$column['name']}`";
      }
    }

    $sql .= implode(', ', $columnDefinitions);

    if (!empty($primaryKeys)) {
      $sql .= ", PRIMARY KEY (" . implode(', ', $primaryKeys) . ")";
    }

    $sql .= ")";

    $db->pdo->exec($sql);

    response('success', 'Table created successfully', [
      'table_name' => $data['table'],
      'sql' => $sql
    ]);

  } catch (PDOException $e) {
    response('error', 'Failed to create table: ' . $e->getMessage(), null, 500);
  }
});
$router->map('POST', '/table/drop', function () {
  $data = getDataFromRequest();
  if (!isset($data['table']) || empty($data['table'])) {
    response('error', 'Table name is required', null, 400);
    return;
  }
  $db = new Database();
  $db->pdo->query('USE ' . $db->getCurrentDatabase());
  if (!$db->checkTable($data['table'])) {
    response('error', 'table does not exists in this database', null, 400);
  }
  try {
    $db->pdo->exec("DROP TABLE " . $data['table']);
    response('success', 'table deleted successfully', [
      "table_name" => $data['table']
    ]);

  } catch (PDOException $e) {
    response('error', 'Failed to delete table: ' . $e->getMessage(), null, 500);
  }

});
$router->map('POST', '/table/rename', function () {
  $data = getDataFromRequest();
  if (!isset($data['table']) || empty($data['table'])) {
    response('error', 'Table name is required', null, 400);
    return;
  }
  $db = new Database();
  $db->pdo->query('USE ' . $db->getCurrentDatabase());
  if (!$db->checkTable($data['old_table'])) {
    response('error', 'table does not exists in this database', null, 400);
  }
  try {
    $db->pdo->exec("RENAME TABLE " . $data['old_table'] . " TO " . $data['table']);
    response('success', 'table deleted successfully', [
      "table_name" => $data['table']
    ]);

  } catch (PDOException $e) {
    response('error', 'Failed to delete table: ' . $e->getMessage(), null, 500);
  }
});
$router->map('POST', '/table/truncate', function () {
  $data = getDataFromRequest();
  if (!isset($data['table']) || empty($data['table'])) {
    response('error', 'Table name is required', null, 400);
    return;
  }
  $db = new Database();
  $db->pdo->query('USE ' . $db->getCurrentDatabase());
  if (!$db->checkTable($data['table'])) {
    response('error', 'table does not exists in this database', null, 400);
  }
  $stmt = $db->pdo->prepare('truncate table ' . $data['table']);
  if ($stmt->execute()) {
    response('success', 'data truncated successfully', [
      "table" => $data['table'],
    ]);
  };
});
$router->map('GET', '/table/[a:name]/info', function ($name) {
  // todo retrieve relevant information about the table for now idk what to add so yh
  response('success', 'Table info retrieved', ['table' => $name]);
});
function validateTableName($name): bool
{
  return preg_match('/^[a-zA-Z][a-zA-Z0-9_]*$/', $name) && strlen($name) <= 64;
}
