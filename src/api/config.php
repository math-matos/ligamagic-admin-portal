<?php

session_start();

function conectar(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $host = getenv('DB_HOST') ?: 'db';
        $nome = getenv('DB_NAME') ?: 'portal_cartas';
        $usuario = getenv('DB_USER') ?: 'portal';
        $senha = getenv('DB_PASS') ?: 'portal123';

        $pdo = new PDO(
            "mysql:host={$host};dbname={$nome};charset=utf8mb4",
            $usuario,
            $senha,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }

    return $pdo;
}

function responder(int $status, array $dados): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function exigirAutenticacao(): void
{
    if (empty($_SESSION['usuario_id'])) {
        responder(401, ['erro' => 'Não autenticado']);
    }
}

function lerJson(): array
{
    $corpo = file_get_contents('php://input');
    $dados = json_decode($corpo, true);

    return is_array($dados) ? $dados : [];
}
