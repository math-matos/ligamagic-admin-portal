<?php

require_once __DIR__ . '/config.php';

exigirAutenticacao();

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    listarCartas();
} elseif ($metodo === 'POST') {
    $id = $_POST['id'] ?? null;
    if ($id) {
        atualizarCarta((int) $id);
    } else {
        criarCarta();
    }
} elseif ($metodo === 'DELETE') {
    excluirCarta();
} else {
    responder(405, ['erro' => 'Método não permitido']);
}

function listarCartas(): void
{
    $stmt = conectar()->query('SELECT * FROM cartas ORDER BY criado_em DESC');
    responder(200, ['cartas' => $stmt->fetchAll()]);
}

function validarCampos(): array
{
    $jogosValidos = ['magic', 'pokemon', 'yugioh'];

    $nomeEn = trim($_POST['nome_en'] ?? '');
    $nomePt = trim($_POST['nome_pt'] ?? '');
    $cardGame = $_POST['card_game'] ?? '';
    $edicaoId = trim($_POST['edicao_id'] ?? '');
    $edicaoNome = trim($_POST['edicao_nome'] ?? '');
    $raridade = trim($_POST['raridade'] ?? '');

    if ($nomeEn === '') {
        responder(422, ['erro' => 'O nome da carta em inglês é obrigatório']);
    }
    if (!in_array($cardGame, $jogosValidos, true)) {
        responder(422, ['erro' => 'Selecione um card game válido']);
    }
    if ($edicaoId === '' || $edicaoNome === '') {
        responder(422, ['erro' => 'Selecione a edição da carta']);
    }
    if ($raridade === '') {
        responder(422, ['erro' => 'Informe a raridade da carta']);
    }

    return [
        'nome_en' => $nomeEn,
        'nome_pt' => $nomePt !== '' ? $nomePt : null,
        'card_game' => $cardGame,
        'edicao_id' => $edicaoId,
        'edicao_nome' => $edicaoNome,
        'raridade' => $raridade,
    ];
}

function salvarImagem(): ?string
{
    if (empty($_FILES['imagem']) || $_FILES['imagem']['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    $arquivo = $_FILES['imagem'];

    if ($arquivo['error'] !== UPLOAD_ERR_OK) {
        responder(422, ['erro' => 'Falha no envio da imagem']);
    }

    if ($arquivo['size'] > 5 * 1024 * 1024) {
        responder(422, ['erro' => 'A imagem deve ter no máximo 5MB']);
    }

    $tiposPermitidos = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    $tipo = mime_content_type($arquivo['tmp_name']);

    if (!isset($tiposPermitidos[$tipo])) {
        responder(422, ['erro' => 'Formato de imagem inválido. Use JPG, PNG, WEBP']);
    }

    $nomeArquivo = uniqid('carta_', true) . '.' . $tiposPermitidos[$tipo];
    $destino = __DIR__ . '/../uploads/' . $nomeArquivo;

    if (!move_uploaded_file($arquivo['tmp_name'], $destino)) {
        responder(500, ['erro' => 'Não foi possível salvar a imagem']);
    }

    return 'uploads/' . $nomeArquivo;
}

function removerImagem(?string $caminho): void
{
    if ($caminho) {
        $arquivo = __DIR__ . '/../' . $caminho;
        if (is_file($arquivo)) {
            unlink($arquivo);
        }
    }
}

function criarCarta(): void
{
    $campos = validarCampos();
    $imagem = salvarImagem();

    if ($imagem === null) {
        responder(422, ['erro' => 'A imagem da carta é obrigatória']);
    }

    $stmt = conectar()->prepare(
        'INSERT INTO cartas (nome_en, nome_pt, card_game, edicao_id, edicao_nome, raridade, imagem)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $campos['nome_en'],
        $campos['nome_pt'],
        $campos['card_game'],
        $campos['edicao_id'],
        $campos['edicao_nome'],
        $campos['raridade'],
        $imagem,
    ]);

    responder(201, ['id' => (int) conectar()->lastInsertId()]);
}

function buscarCarta(int $id): array
{
    $stmt = conectar()->prepare('SELECT * FROM cartas WHERE id = ?');
    $stmt->execute([$id]);
    $carta = $stmt->fetch();

    if (!$carta) {
        responder(404, ['erro' => 'Carta não encontrada']);
    }

    return $carta;
}

function atualizarCarta(int $id): void
{
    $carta = buscarCarta($id);
    $campos = validarCampos();
    $novaImagem = salvarImagem();

    $imagem = $carta['imagem'];

    if ($novaImagem !== null) {
        removerImagem($carta['imagem']);
        $imagem = $novaImagem;
    }

    $stmt = conectar()->prepare(
        'UPDATE cartas SET nome_en = ?, nome_pt = ?, card_game = ?, edicao_id = ?, edicao_nome = ?, raridade = ?, imagem = ?
         WHERE id = ?'
    );
    $stmt->execute([
        $campos['nome_en'],
        $campos['nome_pt'],
        $campos['card_game'],
        $campos['edicao_id'],
        $campos['edicao_nome'],
        $campos['raridade'],
        $imagem,
        $id,
    ]);

    responder(200, ['ok' => true]);
}

function excluirCarta(): void
{
    parse_str($_SERVER['QUERY_STRING'] ?? '', $query);
    $id = (int) ($query['id'] ?? 0);

    if ($id <= 0) {
        responder(422, ['erro' => 'Informe o id da carta']);
    }

    $carta = buscarCarta($id);

    $stmt = conectar()->prepare('DELETE FROM cartas WHERE id = ?');
    $stmt->execute([$id]);

    removerImagem($carta['imagem']);

    responder(200, ['ok' => true]);
}
