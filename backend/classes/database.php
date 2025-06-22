<?php

require_once __DIR__ . '/../configs/config.php';
require_once __DIR__ . '/../functions/passwordManagement.php';
// start session securely (don't know if we need it but for now i'm leaving this comment)
session_start();
class Database
{
    private string $server_ip;
    private int $port;
    private string $username;
    private string $encryptedPassword;
    private ?string $currentDatabase = null;
    public ?PDO $pdo                 = null;
    private ?string $connectionId;

    /**
     * @throws Exception
     */
    public function __construct(?string $connectionId = null)
    {
        try {
            $connectionData = $this->loadConnectionData($connectionId);
            $this->initializeConnection($connectionData);
        } catch (Exception $e) {
            throw new Exception("Database initialization failed: " . $e->getMessage());
        }
    }
    private function updateDatabaseInConfig(string $connectionId, string $newDatabase): void
    {
        if (! file_exists(CONFIG_FILE)) {
            throw new Exception("Configuration file not found");
        }

        $content = file_get_contents(CONFIG_FILE);
        if ($content === false) {
            throw new Exception("Unable to read configuration file");
        }

        $data = json_decode($content, true); // Use associative array
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON in configuration file: " . json_last_error_msg());
        }

        $found = false;
        foreach ($data['connections'] as &$connection) {
            if ($connection['id'] === $connectionId) {
                $connection['database'] = $newDatabase;
                $found                  = true;
                break;
            }
        }

        if (! $found) {
            throw new Exception("Connection with ID '{$connectionId}' not found");
        }

        // Re-encode and write back to file
        $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents(CONFIG_FILE, $newJson) === false) {
            throw new Exception("Failed to write updated configuration to file");
        }
    }
    /**
     * Load connection data from config file
     * @throws Exception
     */
    private function loadConnectionData(?string $connectionId): object
    {
        if (! file_exists(CONFIG_FILE)) {
            throw new Exception("Configuration file not found");
        }

        $content = file_get_contents(CONFIG_FILE);
        if ($content === false) {
            throw new Exception("Unable to read configuration file");
        }

        $data = json_decode($content);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON in configuration file: " . json_last_error_msg());
        }

        if (! isset($data->connections) || empty($data->connections)) {
            throw new Exception("No connections found in configuration");
        }

        // Use provided connection ID or fall back to active connection
        $targetConnectionId = $connectionId ?? $data->active_connection ?? null;

        if (! $targetConnectionId) {
            throw new Exception("No active connection specified");
        }
        $this->connectionId = $targetConnectionId;
        // Find the connection
        foreach ($data->connections as $connection) {
            if ($connection->id === $targetConnectionId) {
                return $connection;
            }
        }

        throw new Exception("Connection with ID '{$targetConnectionId}' not found");
    }

    /**
     * Initialize database connection
     * @throws Exception
     */
    private function initializeConnection(object $connectionData): void
    {
        $this->server_ip         = $connectionData->server_ip ?? throw new Exception("Missing server_ip");
        $this->port              = (int) ($connectionData->port ?? 3306);
        $this->username          = $connectionData->username ?? throw new Exception("Missing username");
        $this->encryptedPassword = $connectionData->password ?? "";
        $this->establishConnection();
    }
    /**
     * get specified information
     * @param array keys
     * @return ?array value []
     */
    public function getSpecifiedInfo(array $keys = [])
    {
        $data = getConnectionById($this->connectionId);
        if (empty($keys)) {
            return [];
        }

        return array_intersect_key($data, array_flip($keys));
    }

    /**
     * Establish PDO connection
     * @throws Exception
     */
    private function establishConnection(): void
    {
        try {
            $password = decrypt_password($this->encryptedPassword);
            $dsn      = "mysql:host={$this->server_ip};port={$this->port};charset=utf8mb4";

            $this->pdo = new PDO($dsn, $this->username, $password, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
                PDO::ATTR_TIMEOUT            => 30,
            ]);

        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    /**
     * Set/switch to a specific database
     * @throws Exception
     */
    public function setDatabase(string $dbName): array
    {
        if (! $this->pdo) {
            throw new Exception('No database connection available');
        }

        if (empty(trim($dbName))) {
            throw new Exception('Database name cannot be empty');
        }

        try {
            // Use prepared statement to prevent SQL injection
            $sql    = "USE `" . str_replace('`', '``', $dbName) . "`";
            $result = $this->pdo->exec($sql);

            if ($result !== false) {
                $this->currentDatabase = $dbName;
                $this->updateDatabaseInConfig($this->connectionId, $dbName);
                $this->getConnectionInfo();
                return [
                    'success' => true,
                    'message' => 'Database selected successfully',
                    'data'    => ['database_name' => $dbName],
                ];
            } else {
                throw new Exception('Failed to select database');
            }

        } catch (PDOException $e) {
            throw new Exception("Failed to select database '{$dbName}': " . $e->getMessage());
        }
    }
    public function getConnectionId()
    {
        return $this->connectionId;
    }
    /**
     * Get current database name
     */
    public function getCurrentDatabase(): ?string
    {
        // return $_SESSION['current_database'];
        $database = $this->getSpecifiedInfo(['database'])['database'];
        return $database;
    }
    public function checkDatabase(string $dbname): bool
    {
        $stmt = $this->pdo->prepare(' SELECT
  IF(EXISTS (
    SELECT SCHEMA_NAME
    FROM INFORMATION_SCHEMA.SCHEMATA
    WHERE SCHEMA_NAME = "' . $dbname . '"
  ), "true", "false") AS db_exists');
        $stmt->execute();
        $response = $stmt->fetch();

        return $response['db_exists'] === 'true' ? true : false;
    }
    /*
    check if table exist
  */
    public function checkTable(string $tableName): bool
    {
        try {
            $stmt = $this->pdo->prepare(' SELECT
        IF(1 <= (
          SELECT count(*) FROM information_schema.TABLES
          WHERE TABLE_NAME = "' . $tableName . '" AND TABLE_SCHEMA = "' . $this->getCurrentDatabase() . '"
        ), "true", "false") AS table_exists');
            $stmt->execute();
            $response = $stmt->fetch();
            return $response['table_exists'] === "true" ? true : false;
        } catch (PDOException $e) {
            // TODO take the logger and implement it here
            // var_dump($e);
            return false;
        }
    }
    /**
     * Test if connection is alive
     */
    public function isConnected(): bool
    {
        try {
            return $this->pdo && $this->pdo->query('SELECT 1') !== false;
        } catch (PDOException $e) {
            return false;
        }
    }
    /**
     * Get connection info
     */
    public function getConnectionInfo(): array
    {
        return [
            'server_ip'        => $this->server_ip,
            'port'             => $this->port,
            'username'         => $this->username,
            'current_database' => $this->currentDatabase,
            'is_connected'     => $this->isConnected(),
        ];
    }

    /**
     * Close connection
     */
    public function disconnect(): void
    {
        $this->pdo             = null;
        $this->currentDatabase = null;
    }
    public function parseSQLQuery(string $query): array
    {
        $query = trim(preg_replace('/\s+/', ' ', $query));
        $type  = strtoupper(strtok($query, " "));

        $result = [
            'type'    => $type,
            'tables'  => [],
            'columns' => [],
            'values'  => [],
            'set'     => [],
            'where'   => null,
            'raw'     => $query,
        ];

        switch ($type) {
            case 'SELECT':
                if (preg_match('/SELECT (.+?) FROM ([\w`]+)/i', $query, $matches)) {
                    $result['columns']  = array_map('trim', explode(',', $matches[1]));
                    $result['tables'][] = trim($matches[2], '`');
                }
                if (preg_match('/WHERE (.+)$/i', $query, $matches)) {
                    $result['where'] = $matches[1];
                }
                break;

            case 'INSERT':
                if (preg_match('/INSERT INTO ([\w`]+) \((.+?)\) VALUES \((.+?)\)/i', $query, $matches)) {
                    $result['tables'][] = trim($matches[1], '`');
                    $result['columns']  = array_map('trim', explode(',', $matches[2]));
                    $result['values']   = array_map('trim', explode(',', $matches[3]));
                }
                break;

            case 'UPDATE':
                if (preg_match('/UPDATE ([\w`]+) SET (.+?)( WHERE (.+))?$/i', $query, $matches)) {
                    $result['tables'][] = trim($matches[1], '`');
                    $sets               = explode(',', $matches[2]);
                    foreach ($sets as $set) {
                        [$col, $val]         = array_map('trim', explode('=', $set));
                        $result['set'][$col] = $val;
                    }
                    if (isset($matches[4])) {
                        $result['where'] = $matches[4];
                    }
                }
                break;

            case 'DELETE':
                if (preg_match('/DELETE FROM ([\w`]+)( WHERE (.+))?/i', $query, $matches)) {
                    $result['tables'][] = trim($matches[1], '`');
                    if (isset($matches[3])) {
                        $result['where'] = $matches[3];
                    }
                }
                break;

            default:
                $result['error'] = 'Unknown or unsupported query type.';
        }

        return $result;
    }

    /**
     * Destructor - cleanup
     */
    public function __destruct()
    {
        $this->disconnect();
    }

}
