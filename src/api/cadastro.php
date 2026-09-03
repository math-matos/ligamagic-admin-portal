<?php

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, ['erro' => 'Método não permitido']);
}

$dados = lerJson();
$nome = trim($dados['nome'] ?? '');
$usuario = trim($dados['usuario'] ?? '');
$senha = $dados['senha'] ?? '';

if ($nome === '' || $usuario === '' || $senha === '') {
    responder(422, ['erro' => 'Informe nome, usuário e senha']);
}

if (mb_strlen($usuario) < 3 || mb_strlen($usuario) > 60) {
    responder(422, ['erro' => 'O usuário deve ter entre 3 e 60 caracteres']);
}

if (mb_strlen($nome) > 120) {
    responder(422, ['erro' => 'O nome deve ter no máximo 120 caracteres']);
}

if (mb_strlen($senha) < 6) {
    responder(422, ['erro' => 'A senha deve ter ao menos 6 caracteres']);
}

$hash = password_hash($senha, PASSWORD_DEFAULT);

try {
    $stmt = conectar()->prepare('INSERT INTO usuarios (usuario, senha, nome) VALUES (?, ?, ?)');
    $stmt->execute([$usuario, $hash, $nome]);
} catch (PDOException $erro) {
    if ($erro->getCode() === '23000') {
        responder(409, ['erro' => 'Este usuário já está em uso']);
    }
    responder(500, ['erro' => 'Não foi possível criar a conta']);
}

session_regenerate_id(true);
$_SESSION['usuario_id'] = (int) conectar()->lastInsertId();
$_SESSION['usuario_nome'] = $nome;

responder(201, ['nome' => $nome]);
