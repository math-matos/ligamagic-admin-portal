<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/dados-jogos.php';

exigirAutenticacao();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responder(405, ['erro' => 'Método não permitido']);
}

$jogo = $_GET['jogo'] ?? '';

if (!isset(EDICOES_POR_JOGO[$jogo])) {
    responder(422, ['erro' => 'Card game inválido']);
}

// Latência simulada pra mostrar os carregamentos do front.
usleep(600000);

responder(200, ['edicoes' => EDICOES_POR_JOGO[$jogo]]);
