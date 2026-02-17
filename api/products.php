<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

try {
  $db = db_connect();
  $res = $db->query("SELECT id, nombre, imagen, rating, num_reviews, precios_json FROM productos ORDER BY id ASC");

  $productos = [];
  while ($row = $res->fetch_assoc()) {
    $precios = json_decode($row["precios_json"], true);
    if (!is_array($precios)) $precios = [];

    $productos[] = [
      "id" => (int)$row["id"],
      "nombre" => $row["nombre"],
      "imagen" => $row["imagen"],
      "rating" => (float)$row["rating"],
      "num_reviews" => (int)$row["num_reviews"],
      "precios" => $precios
    ];
  }

  echo json_encode(["ok"=>true, "productos"=>$productos], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["ok"=>false, "error"=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
}
