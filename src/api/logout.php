<?php

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, ['erro' => 'Método não permitido']);
}

$_SESSION = [];
session_destroy();

responder(200, ['ok' => true]);
