<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$id = intval($_GET["id"] ?? 0);
if ($id <= 0) {
  http_response_code(400);
  echo json_encode(["ok"=>false, "error"=>"ID inválido"], JSON_UNESCAPED_UNICODE);
  exit;
}

try {
  $db = db_connect();
  $stmt = $db->prepare("SELECT * FROM productos WHERE id=?");
  $stmt->bind_param("i", $id);
  $stmt->execute();
  $res = $stmt->get_result();

  if (!$row = $res->fetch_assoc()) {
    http_response_code(404);
    echo json_encode(["ok"=>false, "error"=>"No encontrado"], JSON_UNESCAPED_UNICODE);
    exit;
  }

  $precios = json_decode($row["precios_json"], true); if (!is_array($precios)) $precios = [];
  $detalles = json_decode($row["detalles_json"], true); if (!is_array($detalles)) $detalles = [];
  $opiniones = json_decode($row["opiniones_json"], true); if (!is_array($opiniones)) $opiniones = [];

  echo json_encode([
    "ok"=>true,
    "producto"=>[
      "id" => (int)$row["id"],
      "nombre" => $row["nombre"],
      "imagen" => $row["imagen"],
      "descripcion_corta" => $row["descripcion_corta"],
      "descripcion_larga" => $row["descripcion_larga"],
      "rating" => (float)$row["rating"],
      "num_reviews" => (int)$row["num_reviews"],
      "precios" => $precios,
      "detalles" => $detalles,
      "opiniones" => $opiniones
    ]
  ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["ok"=>false, "error"=>$e->getMessage()], JSON_UNESCAPED_UNICODE);
}
