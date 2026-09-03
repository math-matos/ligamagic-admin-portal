<?php

require_once __DIR__ . '/config.php';

exigirAutenticacao();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responder(405, ['erro' => 'Método não permitido']);
}

$edicoes = [
    'magic' => [
        ['id' => 'dom', 'name' => 'Dominaria'],
        ['id' => 'war', 'name' => 'War of the Spark'],
        ['id' => 'eld', 'name' => 'Throne of Eldraine'],
        ['id' => 'hob', 'name' => 'The Hobbit'],
        ['id' => 'msh', 'name' => 'Marvel Super Heroes'],
    ],
    'pokemon' => [
        ['id' => 'base1', 'name' => 'Base Set'],
        ['id' => 'swsh1', 'name' => 'Sword & Shield'],
        ['id' => 'sv1', 'name' => 'Scarlet & Violet'],
        ['id' => '30c', 'name' => '30th Celebration'],
        ['id' => 'cri', 'name' => 'Chaos Rising'],
    ],
    'yugioh' => [
        ['id' => 'lob', 'name' => 'Legend of Blue Eyes White Dragon'],
        ['id' => 'mrd', 'name' => 'Metal Raiders'],
        ['id' => 'sdy', 'name' => 'Starter Deck: Yugi'],
        ['id' => 'rotd', 'name' => 'Rise of the Duelist'],
        ['id' => 'blzd', 'name' => 'Blazing Dominion'],
    ],
];

$jogo = $_GET['jogo'] ?? '';

if (!isset($edicoes[$jogo])) {
    responder(422, ['erro' => 'Card game inválido']);
}

usleep(600000);

responder(200, ['edicoes' => $edicoes[$jogo]]);
