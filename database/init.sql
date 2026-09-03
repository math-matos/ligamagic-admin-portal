SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS portal_cartas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portal_cartas;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(60) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cartas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome_en VARCHAR(150) NOT NULL,
    nome_pt VARCHAR(150) NULL,
    card_game ENUM('magic', 'pokemon', 'yugioh') NOT NULL,
    edicao_id VARCHAR(20) NOT NULL,
    edicao_nome VARCHAR(100) NOT NULL,
    raridade VARCHAR(50) NOT NULL,
    imagem VARCHAR(255) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO usuarios (usuario, senha, nome) VALUES
('admin', '$2y$10$4YH5is77VP7iYP7SLLj8NeSR44Vg94TpvOl3EL1iD5.Td8wcBWHky', 'Administrador');

INSERT INTO cartas (nome_en, nome_pt, card_game, edicao_id, edicao_nome, raridade) VALUES
('Teferi, Hero of Dominaria', 'Teferi, Herói de Dominária', 'magic', 'dom', 'Dominaria', 'Mítica'),
('Nicol Bolas, Dragon-God', 'Nicol Bolas, Deus-Dragão', 'magic', 'war', 'War of the Spark', 'Mítica'),
('Charizard', NULL, 'pokemon', 'base1', 'Base Set', 'Rara'),
('Pikachu', NULL, 'pokemon', 'swsh1', 'Sword & Shield', 'Comum'),
('Blue-Eyes White Dragon', 'Dragão Branco de Olhos Azuis', 'yugioh', 'lob', 'Legend of Blue Eyes White Dragon', 'Ultra Rara');
