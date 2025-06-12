<?php
namespace App\Classes;

class Snitch
{
  private $path = __DIR__ . '/../Logs/';
  public function __construct()
  {
    if (!file_exists($this->path)) {
      mkdir($this->path, 0777, true);
    }
  }
  public function getPath()
  {
    return $this->path;
  }
  private function log($data, $color)
  {
    $file = $this->path . date('Y-m-d') . '.log';
    $data = date('H:i:s') . ' ' . $data . PHP_EOL;

    // $coloredData = $this->getColoredLog($data, $color);

    // echo $coloredData;

    file_put_contents($file, $data, FILE_APPEND);
  }

  public function LogInfo($data)
  {
    $this->log('[INFO] ' . $data, 'green');
  }

  public function LogError($data)
  {
    $this->log('[ERROR] ' . $data, 'red');
  }

  public function LogWarning($data)
  {
    $this->log('[WARNING] ' . $data, 'yellow');
  }

  public function LogDebug($data)
  {
    $this->log('[DEBUG] ' . $data, 'blue');
  }

  private function getColoredLog($data, $color)
  {
    $colors = [
      'green' => "\033[32m",
      'red' => "\033[31m",
      'yellow' => "\033[33m",
      'blue' => "\033[34m",
      'reset' => "\033[0m"
    ];

    return isset($colors[$color]) ? $colors[$color] . $data . $colors['reset'] : $data;
  }
}
