<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/vendor/autoload.php';
include_once __DIR__ . "/functions/response.php";
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Max-Age: 86400');
  http_response_code(200);
  exit();
}
$router = new AltoRouter();
$router->setBasePath('');

include_once __DIR__ . '/routes/connection.php';
include_once __DIR__ . '/routes/database.php';
include_once __DIR__ . '/routes/table.php';
include_once __DIR__ . '/routes/test.php';

$match = $router->match();

if ($match) {
  if (is_callable($match['target'])) {
    call_user_func_array($match['target'], $match['params']);
  } elseif (is_array($match['target']) && class_exists($match['target'][0])) {
    if (!class_exists($match['target'][0])) {
      response('error', 'Controller class not found: ' . $match['target'][0], null, 404);
    }

    $controller = new $match['target'][0]();
    $method = $match['target'][1];

    if (!method_exists($controller, $method)) {
      response('error', 'Method not found: ' . $method, null, 404);
    }

    call_user_func_array([$controller, $method], $match['params']);
  }
} else {
  response('error', 'Route not found', null, 404);
}
