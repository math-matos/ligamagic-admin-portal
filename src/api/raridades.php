<?php

require_once __DIR__ . '/config.php';

exigirAutenticacao();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responder(405, ['erro' => 'Método não permitido']);
}

$raridades = [
    'magic' => [
        'Comum',
        'Incomum',
        'Rara',
        'Mítica',
        'Especial',
        'Bônus',
    ],
    'pokemon' => [
        'Comum',
        'Incomum',
        'Rara',
        'Rara Holo',
        'Dupla Rara',
        'Ultra Rara',
        'Rara Ilustração',
        'Rara Ilustração Especial',
        'Hiper Rara',
        'Rara Secreta',
        'Shiny Rara',
        'Promocional',
    ],
    'yugioh' => [
        'Comum',
        'Rara',
        'Super Rara',
        'Ultra Rara',
        'Secreta',
        'Suprema',
        'Fantasma',
        'Platina',
        'Ouro',
        'Colecionador',
        'Secreta Prismática',
        'Starlight',
    ],
];

$jogo = $_GET['jogo'] ?? '';

if (!isset($raridades[$jogo])) {
    responder(422, ['erro' => 'Card game inválido']);
}

usleep(600000);

responder(200, ['raridades' => $raridades[$jogo]]);
