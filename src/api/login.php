<?php

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, ['erro' => 'Método não permitido']);
}

$dados = lerJson();
$usuario = trim($dados['usuario'] ?? '');
$senha = $dados['senha'] ?? ''; 

if ($usuario === '' || $senha === '') {
    responder(422, ['erro' => 'Informe usuário e senha']);
}

$stmt = conectar()->prepare('SELECT id, usuario, senha, nome FROM usuarios WHERE usuario = ?');
$stmt->execute([$usuario]);
$registro = $stmt->fetch();

if (!$registro || !password_verify($senha, $registro['senha'])) {
    responder(401, ['erro' => 'Usuário ou senha inválidos']);
}

session_regenerate_id(true);
$_SESSION['usuario_id'] = $registro['id'];
$_SESSION['usuario_nome'] = $registro['nome'];

responder(200, ['nome' => $registro['nome']]);
