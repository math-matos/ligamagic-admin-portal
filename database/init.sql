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
('admin', '$2y$10$4YH5is77VP7iYP7SLLj8NeSR44Vg94TpvOl3EL1iD5.Td8wcBWHky', 'Mr. Liga');

INSERT INTO cartas (nome_en, nome_pt, card_game, edicao_id, edicao_nome, raridade, imagem) VALUES
('Teferi, Hero of Dominaria', 'Teferi, Herói de Dominária', 'magic', 'dom', 'Dominaria', 'Mítica', 'https://cards.scryfall.io/normal/front/5/d/5d10b752-d9cb-419d-a5c4-d4ee1acb655e.jpg'),
('Nicol Bolas, Dragon-God', 'Nicol Bolas, Deus-Dragão', 'magic', 'war', 'War of the Spark', 'Mítica', 'https://cards.scryfall.io/normal/front/9/8/98b68dea-a7be-4f99-8a50-4c8cf0e0f7a9.jpg'),
('Charizard', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/4.png'),
('Umbreon', NULL, 'pokemon', 'swsh1', 'Sword & Shield', 'Comum', 'https://repositorio.sbrauble.com/arquivos/in/pokemon_bkp/cd/245/5592s_215.jpg'),
('Blue-Eyes White Dragon', 'Dragão Branco de Olhos Azuis', 'yugioh', 'lob', 'Legend of Blue Eyes White Dragon', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/89631139.jpg'),
('Black Lotus', 'Lótus Negro', 'magic', 'lea', 'Limited Edition Alpha', 'Rara', 'https://api.scryfall.com/cards/named?fuzzy=Black%20Lotus&format=image'),
('Lightning Bolt', 'Raio', 'magic', 'lea', 'Limited Edition Alpha', 'Comum', 'https://api.scryfall.com/cards/named?fuzzy=Lightning%20Bolt&format=image'),
('Sol Ring', 'Anel Solar', 'magic', 'c21', 'Commander 2021', 'Incomum', 'https://api.scryfall.com/cards/named?fuzzy=Sol%20Ring&format=image'),
('Counterspell', 'Contramágica', 'magic', 'mh2', 'Modern Horizons 2', 'Comum', 'https://api.scryfall.com/cards/named?fuzzy=Counterspell&format=image'),
('Llanowar Elves', 'Elfos de Llanowar', 'magic', 'm19', 'Core Set 2019', 'Comum', 'https://api.scryfall.com/cards/named?fuzzy=Llanowar%20Elves&format=image'),
('Serra Angel', 'Anjo de Serra', 'magic', 'm19', 'Core Set 2019', 'Incomum', 'https://api.scryfall.com/cards/named?fuzzy=Serra%20Angel&format=image'),
('Shivan Dragon', 'Dragão de Shiv', 'magic', 'm20', 'Core Set 2020', 'Rara', 'https://api.scryfall.com/cards/named?fuzzy=Shivan%20Dragon&format=image'),
('Birds of Paradise', 'Aves do Paraíso', 'magic', 'm12', 'Magic 2012', 'Rara', 'https://api.scryfall.com/cards/named?fuzzy=Birds%20of%20Paradise&format=image'),
('Wrath of God', 'Ira de Deus', 'magic', '10e', 'Tenth Edition', 'Rara', 'https://api.scryfall.com/cards/named?fuzzy=Wrath%20of%20God&format=image'),
('Tarmogoyf', 'Tarmogoyf', 'magic', 'mm3', 'Modern Masters 2017', 'Mítica', 'https://api.scryfall.com/cards/named?fuzzy=Tarmogoyf&format=image'),
('Snapcaster Mage', 'Mago Conjurador Ágil', 'magic', 'isd', 'Innistrad', 'Rara', 'https://api.scryfall.com/cards/named?fuzzy=Snapcaster%20Mage&format=image'),
('Liliana of the Veil', 'Liliana do Véu', 'magic', 'isd', 'Innistrad', 'Mítica', 'https://api.scryfall.com/cards/named?fuzzy=Liliana%20of%20the%20Veil&format=image'),
('Jace, the Mind Sculptor', 'Jace, o Escultor de Mentes', 'magic', 'wwk', 'Worldwake', 'Mítica', 'https://api.scryfall.com/cards/named?fuzzy=Jace%20the%20Mind%20Sculptor&format=image'),
('Thoughtseize', 'Apreender Pensamentos', 'magic', 'ths', 'Theros', 'Rara', 'https://api.scryfall.com/cards/named?fuzzy=Thoughtseize&format=image'),
('Path to Exile', 'Caminho ao Exílio', 'magic', 'con', 'Conflux', 'Incomum', 'https://api.scryfall.com/cards/named?fuzzy=Path%20to%20Exile&format=image'),
('Brainstorm', 'Tempestade Cerebral', 'magic', 'ema', 'Eternal Masters', 'Comum', 'https://api.scryfall.com/cards/named?fuzzy=Brainstorm&format=image'),
('Dark Ritual', 'Ritual Sombrio', 'magic', 'a25', 'Masters 25', 'Comum', 'https://api.scryfall.com/cards/named?fuzzy=Dark%20Ritual&format=image'),
('Doom Blade', 'Lâmina da Perdição', 'magic', 'm13', 'Magic 2013', 'Comum', 'https://api.scryfall.com/cards/named?fuzzy=Doom%20Blade&format=image'),
('Cryptic Command', 'Comando Enigmático', 'magic', 'lrw', 'Lorwyn', 'Rara', 'https://api.scryfall.com/cards/named?fuzzy=Cryptic%20Command&format=image'),
('Elspeth, Suns Champion', 'Elspeth, Campeã do Sol', 'magic', 'ths', 'Theros', 'Mítica', 'https://api.scryfall.com/cards/named?fuzzy=Elspeth%20Suns%20Champion&format=image'),
('Pikachu', NULL, 'pokemon', 'base1', 'Base Set', 'Comum', 'https://images.pokemontcg.io/base1/58.png'),
('Blastoise', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/2.png'),
('Venusaur', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/15.png'),
('Mewtwo', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/10.png'),
('Alakazam', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/1.png'),
('Machamp', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/8.png'),
('Gyarados', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/6.png'),
('Zapdos', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/16.png'),
('Chansey', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/3.png'),
('Ninetales', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/12.png'),
('Poliwrath', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/13.png'),
('Raichu', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/14.png'),
('Clefairy', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/5.png'),
('Nidoking', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/11.png'),
('Magneton', NULL, 'pokemon', 'base1', 'Base Set', 'Rara', 'https://images.pokemontcg.io/base1/9.png'),
('Dark Magician', 'Mago Negro', 'yugioh', 'lob', 'Legend of Blue Eyes White Dragon', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/46986414.jpg'),
('Red-Eyes Black Dragon', 'Dragão Negro de Olhos Vermelhos', 'yugioh', 'lob', 'Legend of Blue Eyes White Dragon', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/74677422.jpg'),
('Exodia the Forbidden One', 'Exodia, o Proibido', 'yugioh', 'lob', 'Legend of Blue Eyes White Dragon', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/33396948.jpg'),
('Summoned Skull', 'Caveira Invocada', 'yugioh', 'mrd', 'Metal Raiders', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/70781052.jpg'),
('Dark Magician Girl', 'Garota Maga Negra', 'yugioh', 'mfc', 'Magicians Force', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/38033121.jpg'),
('Mirror Force', 'Força do Espelho', 'yugioh', 'mrd', 'Metal Raiders', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/44095762.jpg'),
('Pot of Greed', 'Pote da Ganância', 'yugioh', 'lob', 'Legend of Blue Eyes White Dragon', 'Rara', 'https://images.ygoprodeck.com/images/cards/55144522.jpg'),
('Kuriboh', 'Kuriboh', 'yugioh', 'mrd', 'Metal Raiders', 'Rara', 'https://images.ygoprodeck.com/images/cards/40640057.jpg'),
('Jinzo', 'Jinzo', 'yugioh', 'psv', 'Pharaohs Servant', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/77585513.jpg'),
('Black Luster Soldier', 'Soldado do Brilho Negro', 'yugioh', 'lob', 'Legend of Blue Eyes White Dragon', 'Ultra Rara', 'https://images.ygoprodeck.com/images/cards/5405694.jpg');
