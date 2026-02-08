<?php
require_once __DIR__ . '/config.php';

function db_connect(): mysqli {
  $mysqli = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  if ($mysqli->connect_errno) {
    throw new Exception("DB_CONNECT_ERROR: " . $mysqli->connect_error);
  }
  $mysqli->set_charset("utf8mb4");
  return $mysqli;
}
