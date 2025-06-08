<?php

require_once __DIR__ . '/../configs/config.php';
require_once __DIR__ . '/../functions/passwordManagement.php';

class Database
{
  private string $server_ip;
  private int $port;
  private string $username;
  private string $encryptedPassword;
  private ?string $currentDatabase = null;
  public ?PDO $pdo = null;

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

  /**
   * Load connection data from config file
   * @throws Exception
   */
  private function loadConnectionData(?string $connectionId): object
  {
    if (!file_exists(CONFIG_FILE)) {
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

    if (!isset($data->connections) || empty($data->connections)) {
      throw new Exception("No connections found in configuration");
    }

    // Use provided connection ID or fall back to active connection
    $targetConnectionId = $connectionId ?? $data->active_connection ?? null;

    if (!$targetConnectionId) {
      throw new Exception("No active connection specified");
    }

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
    $this->server_ip = $connectionData->server_ip ?? throw new Exception("Missing server_ip");
    $this->port = (int) ($connectionData->port ?? 3306);
    $this->username = $connectionData->username ?? throw new Exception("Missing username");
    $this->encryptedPassword = $connectionData->password ?? throw new Exception("Missing password");

    $this->establishConnection();
  }

  /**
   * Establish PDO connection
   * @throws Exception
   */
  private function establishConnection(): void
  {
    try {
      $password = decrypt_password($this->encryptedPassword);
      $dsn = "mysql:host={$this->server_ip};port={$this->port};charset=utf8mb4";

      $this->pdo = new PDO($dsn, $this->username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
        PDO::ATTR_TIMEOUT => 30
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
    if (!$this->pdo) {
      throw new Exception('No database connection available');
    }

    if (empty(trim($dbName))) {
      throw new Exception('Database name cannot be empty');
    }

    try {
      // Use prepared statement to prevent SQL injection
      $sql = "USE `" . str_replace('`', '``', $dbName) . "`";
      $result = $this->pdo->exec($sql);

      if ($result !== false) {
        $this->currentDatabase = $dbName;
        return [
          'success' => true,
          'message' => 'Database selected successfully',
          'data' => ['database_name' => $dbName]
        ];
      } else {
        throw new Exception('Failed to select database');
      }

    } catch (PDOException $e) {
      throw new Exception("Failed to select database '{$dbName}': " . $e->getMessage());
    }
  }

  /**
   * Get current database name
   */
  public function getCurrentDatabase(): ?string
  {
    return $this->currentDatabase;
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
      'server_ip' => $this->server_ip,
      'port' => $this->port,
      'username' => $this->username,
      'current_database' => $this->currentDatabase,
      'is_connected' => $this->isConnected()
    ];
  }

  /**
   * Close connection
   */
  public function disconnect(): void
  {
    $this->pdo = null;
    $this->currentDatabase = null;
  }

  /**
   * Destructor - cleanup
   */
  public function __destruct()
  {
    $this->disconnect();
  }
}
