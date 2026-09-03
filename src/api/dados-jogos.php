<?php

/**
 * Fonte única das edições e raridades de cada card game.
 * IDEAL SER TROCADA PARA USO DIRETO DO BACKEND AO INVES DE HARDCODED
 */

const EDICOES_POR_JOGO = [
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

const RARIDADES_POR_JOGO = [
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
