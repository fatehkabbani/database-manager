<?php
require_once __DIR__ . '/../functions/response.php';
require_once __DIR__ . '/../configs/config.php';
require_once __DIR__ . '/../functions/passwordManagement.php';

$router->map('POST', '/connection', function () {
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);

    if (empty($data)) {
        response('error', 'No data provided.', null, 400);
        return;
    }

    if (json_last_error() !== JSON_ERROR_NONE) {
        response('error', 'Invalid JSON data.', null, 400);
        return;
    }

    $action = $data['action'] ?? '';
    $params = $data['params'] ?? [];

    switch ($action) {
        case 'save':
            handleSaveConnection($params);
            break;

        case 'list':
            handleListConnections();
            break;

        case 'delete':
            handleDeleteConnection($params);
            break;

        case 'test':
            handleTestConnection($params);
            break;

        case 'set_active':
            handleSetActiveConnection($params);
            break;

        default:
            response('error', 'Unknown action: ' . $action, null, 400);
    }
});

function handleSaveConnection($params)
{
    $required = ['server_ip', 'port', 'username', 'password'];
    foreach ($required as $field) {
        if (empty($params[$field])) {
            response('error', "Missing required field: {$field}", null, 400);
            return;
        }
    }

    $connectionId = generateConnectionId($params);

    $connectionData = [
        'id'         => $connectionId,
        'name'       => $params['name'] ?? ($params['username'] . '@' . $params['server_ip']),
        'server_ip'  => $params['server_ip'],
        'port'       => (int) $params['port'],
        'username'   => $params['username'],
        'password'   => encrypt_password($params['password']), // Encrypt the password
        'database'   => $params['database'] ?? null,
        'created_at' => date('Y-m-d H:i:s'),
        'last_used'  => null,
    ];

    if (file_exists(CONFIG_FILE) && filesize(CONFIG_FILE) > 0) {
        $existingContent = file_get_contents(CONFIG_FILE);
        $existingData    = json_decode($existingContent, true);

        if (! is_array($existingData)) {
            $existingData = ['connections' => [], 'active_connection' => null];
        }

        // Ensure connections key exists
        if (! isset($existingData['connections'])) {
            $existingData['connections'] = [];
        }

        // Check for duplicates
        $isDuplicate = false;
        foreach ($existingData['connections'] as $existing) {
            if (
                $existing['server_ip'] === $connectionData['server_ip'] &&
                $existing['port'] === $connectionData['port'] &&
                $existing['username'] === $connectionData['username']
            ) {
                $isDuplicate = true;
                break;
            }
        }

        if ($isDuplicate) {
            response('error', "Connection already exists!", null, 409);
            return;
        }

        $existingData['connections'][$connectionId] = $connectionData;

        // Set as active connection if it's the first one
        if ($existingData['active_connection'] === null) {
            $existingData['active_connection'] = $connectionId;
        }

    } else {
        $existingData = [
            'connections'       => [$connectionId => $connectionData],
            'active_connection' => $connectionId,
        ];
    }

    $saved = file_put_contents(CONFIG_FILE, json_encode($existingData, JSON_PRETTY_PRINT));

    if ($saved !== false) {
        response('success', "Connection saved successfully!", [
            'connection_id' => $connectionId,
            'connection'    => $connectionData,
        ]);
    } else {
        response('error', "Error saving connection!", null, 500);
    }
}

function handleListConnections()
{
    if (! file_exists(CONFIG_FILE)) {
        response('success', "No connections found.", [
            'connections'       => [],
            'active_connection' => null,
        ]);
        return;
    }

    $content = file_get_contents(CONFIG_FILE);
    $data    = json_decode($content, true);

    if (! is_array($data) || ! isset($data['connections'])) {
        response('success', "No connections found.", [
            'connections'       => [],
            'active_connection' => null,
        ]);
        return;
    }

    // Remove passwords from response for security
    $connections = [];
    $db = new Database();
    foreach ($data['connections'] as $id => $conn) {
        $connections[$id] = $conn;
        unset($connections[$id]['password']); // Don't send passwords to frontend
        if($data['active_connection'] === $id) {
            $connections[$id]['status'] = $db->isConnected() ? 'connected' : 'disconnected';
        } else {
            $connections[$id]['status'] = 'disconnected';
        }
    }
    // check connection if its connected or not
    response('success', "Connections retrieved successfully.", [
        'connections'       => $connections,
        'active_connection' => $data['active_connection'] ?? null,
    ]);
}

function handleDeleteConnection($params)
{
    if (empty($params['connection_id'])) {
        response('error', 'Connection ID is required.', null, 400);
        return;
    }

    if (! file_exists(CONFIG_FILE)) {
        response('error', 'No connections file found.', null, 404);
        return;
    }

    $content = file_get_contents(CONFIG_FILE);
    $data    = json_decode($content, true);

    if (! isset($data['connections'][$params['connection_id']])) {
        response('error', 'Connection not found.', null, 404);
        return;
    }

    unset($data['connections'][$params['connection_id']]);

    // If this was the active connection, clear it
    if ($data['active_connection'] === $params['connection_id']) {
        $data['active_connection'] = null;

        // Set first available connection as active
        if (! empty($data['connections'])) {
            $data['active_connection'] = array_key_first($data['connections']);
        }
    }

    $saved = file_put_contents(CONFIG_FILE, json_encode($data, JSON_PRETTY_PRINT));

    if ($saved !== false) {
        response('success', "Connection deleted successfully!", [
            'deleted_connection_id' => $params['connection_id'],
            'active_connection'     => $data['active_connection'],
        ]);
    } else {
        response('error', "Error deleting connection!", null, 500);
    }
}

function handleTestConnection($params)
{
    if (empty($params['connection_id'])) {
        response('error', 'Connection ID is required.', null, 400);
        return;
    }

    $connection = getConnectionById($params['connection_id']);
    if (! $connection) {
        response('error', 'Connection not found.', null, 404);
        return;
    }

    try {
        // Decrypt password
        $password = decrypt_password($connection['password']);

        $dsn = "mysql:host={$connection['server_ip']};port={$connection['port']}";
        if ($connection['database']) {
            $dsn .= ";dbname={$connection['database']}";
        }

        $pdo = new PDO($dsn, $connection['username'], $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5, // 5 second timeout
        ]);

        // Update last_used timestamp
        updateConnectionLastUsed($params['connection_id']);
        if ($pdo) {
            response('success', "Connection test successful!", [
                'connection_id' => $params['connection_id'],
                'status'        => 'connected',
            ]);
        } else {
            response('error', "error while testing!", [
                'connection_id' => $params['connection_id'],
                'status'        => 'connected',
            ]);
        }

    } catch (PDOException $e) {
        response('error', "Connection failed: " . $e->getMessage(), [
            'connection_id' => $params['connection_id'],
            'status'        => 'failed',
        ], 500);
    }
}

function handleSetActiveConnection($params)
{
    if (empty($params['connection_id'])) {
        response('error', 'Connection ID is required.', null, 400);
        return;
    }

    if (! file_exists(CONFIG_FILE)) {
        response('error', 'No connections file found.', null, 404);
        return;
    }

    $content = file_get_contents(CONFIG_FILE);
    $data    = json_decode($content, true);

    if (! isset($data['connections'][$params['connection_id']])) {
        response('error', 'Connection not found.', null, 404);
        return;
    }

    $data['active_connection'] = $params['connection_id'];

    // Update last_used timestamp
    $data['connections'][$params['connection_id']]['last_used'] = date('Y-m-d H:i:s');

    $saved = file_put_contents(CONFIG_FILE, json_encode($data, JSON_PRETTY_PRINT));

    if ($saved !== false) {
        response('success', "Active connection set successfully!", [
            'active_connection' => $params['connection_id'],
        ]);
    } else {
        response('error', "Error setting active connection!", null, 500);
    }
}

function generateConnectionId($params)
{
    return md5($params['server_ip'] . ':' . $params['port'] . ':' . $params['username'] . ':' . time());
}

function getConnectionById($connectionId)
{
    if (! file_exists(CONFIG_FILE)) {
        return null;
    }

    $content = file_get_contents(CONFIG_FILE);
    $data    = json_decode($content, true);

    return $data['connections'][$connectionId] ?? null;
}

function updateConnectionLastUsed($connectionId)
{
    if (! file_exists(CONFIG_FILE)) {
        return;
    }

    $content = file_get_contents(CONFIG_FILE);
    $data    = json_decode($content, true);

    if (isset($data['connections'][$connectionId])) {
        $data['connections'][$connectionId]['last_used'] = date('Y-m-d H:i:s');
        file_put_contents(CONFIG_FILE, json_encode($data, JSON_PRETTY_PRINT));
    }
}
