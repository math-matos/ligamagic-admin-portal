const nomesJogos = {
    magic: 'Magic: The Gathering',
    pokemon: 'Pokémon',
    yugioh: 'Yu-Gi-Oh!'
};

const ICONE_IMAGEM_VAZIA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
    '<circle cx="8.5" cy="8.5" r="1.5"></circle>' +
    '<polyline points="21 15 16 10 5 21"></polyline></svg>';

const ICONE_EDITAR =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 20h9"></path>' +
    '<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>';

const ICONE_EXCLUIR =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="3 6 5 6 21 6"></polyline>' +
    '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';

function classeRaridade(raridade) {
    const base = (raridade || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, '-');
    return 'badge-' + base;
}

let cartas = [];

const listaCartas = document.getElementById('lista-cartas');
const painelLista = document.getElementById('painel-lista');
const painelGrade = document.getElementById('painel-grade');
const botaoVerLista = document.getElementById('ver-lista');
const botaoVerGrade = document.getElementById('ver-grade');
const estadoVazio = document.getElementById('estado-vazio');
const estadoVazioTexto = document.getElementById('estado-vazio-texto');
const estadoVazioDica = document.querySelector('.estado-vazio-dica');
const campoBusca = document.getElementById('campo-busca');

const CHAVE_VISUALIZACAO = 'cartas-visualizacao';
let modoVisualizacao = localStorage.getItem(CHAVE_VISUALIZACAO) === 'lista' ? 'lista' : 'grade';

const pilhaModais = [];

function empilharModal(fecharFn) {
    pilhaModais.push(fecharFn);
}

function desempilharModal(fecharFn) {
    const indice = pilhaModais.lastIndexOf(fecharFn);
    if (indice !== -1) {
        pilhaModais.splice(indice, 1);
    }
}

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && pilhaModais.length > 0) {
        pilhaModais[pilhaModais.length - 1]();
    }
});

async function verificarSessao() {
    try {
        const resposta = await fetch('api/sessao.php');
        if (!resposta.ok) {
            window.location.href = 'index.html';
            return;
        }
        const dados = await resposta.json();
        document.getElementById('saudacao').textContent = `Olá, ${dados.nome}`;
    } catch (erro) {
        window.location.href = 'index.html';
    }
}

function mostrarSkeleton(quantidade = 8) {
    estadoVazio.hidden = true;

    const ehGrade = modoVisualizacao === 'grade';
    painelLista.hidden = ehGrade;
    painelGrade.hidden = !ehGrade;

    if (ehGrade) {
        painelGrade.innerHTML = '';
        for (let i = 0; i < quantidade; i++) {
            const card = document.createElement('div');
            card.className = 'carta-card';
            card.innerHTML =
                '<span class="skeleton carta-card-imagem-skeleton"></span>' +
                '<div class="carta-card-corpo">' +
                '<span class="skeleton skeleton-linha" style="width:80%"></span>' +
                '<span class="skeleton skeleton-linha" style="width:55%"></span>' +
                '<span class="skeleton skeleton-chip" style="margin-top:0.3rem"></span>' +
                '</div>';
            painelGrade.appendChild(card);
        }
        return;
    }

    listaCartas.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const linha = document.createElement('tr');
        linha.innerHTML =
            '<td><span class="skeleton skeleton-miniatura"></span></td>' +
            '<td><span class="skeleton skeleton-linha" style="width:70%"></span></td>' +
            '<td><span class="skeleton skeleton-linha" style="width:55%"></span></td>' +
            '<td><span class="skeleton skeleton-chip"></span></td>' +
            '<td><span class="skeleton skeleton-linha" style="width:60%"></span></td>' +
            '<td><span class="skeleton skeleton-chip" style="width:4.5rem"></span></td>' +
            '<td></td>';
        listaCartas.appendChild(linha);
    }
}

async function carregarCartas() {
    mostrarSkeleton();

    try {
        const resposta = await fetch('api/cartas.php');

        if (resposta.status === 401) {
            window.location.href = 'index.html';
            return;
        }

        const dados = await resposta.json();
        cartas = dados.cartas || [];
        renderizarCartas();
    } catch (erro) {
        listaCartas.innerHTML = '';
        painelGrade.innerHTML = '';
        painelLista.hidden = true;
        painelGrade.hidden = true;
        estadoVazioTexto.textContent = 'Erro ao carregar as cartas.';
        if (estadoVazioDica) {
            estadoVazioDica.textContent = 'Verifique a conexão e recarregue a página.';
        }
        estadoVazio.hidden = false;
    }
}

function filtrarCartas() {
    const termo = campoBusca.value.trim().toLowerCase();

    if (!termo) {
        return cartas;
    }

    return cartas.filter((carta) => {
        const campos = [
            carta.nome_en,
            carta.nome_pt || '',
            nomesJogos[carta.card_game] || '',
            carta.edicao_nome,
            carta.raridade
        ];
        return campos.some((campo) => campo.toLowerCase().includes(termo));
    });
}

function renderizarCartas() {
    const visiveis = filtrarCartas();
    const ehGrade = modoVisualizacao === 'grade';
    const temResultados = visiveis.length > 0;

    estadoVazioTexto.textContent = campoBusca.value.trim()
        ? 'Nenhuma carta encontrada.'
        : 'Nenhuma carta cadastrada ainda.';
    if (estadoVazioDica) {
        estadoVazioDica.textContent = campoBusca.value.trim()
            ? 'Tente outro termo ou cadastre uma nova carta.'
            : 'Clique em “Nova Carta” para começar.';
    }

    estadoVazio.hidden = temResultados;
    painelLista.hidden = ehGrade || !temResultados;
    painelGrade.hidden = !ehGrade || !temResultados;

    if (ehGrade) {
        painelGrade.innerHTML = '';
        visiveis.forEach((carta) => painelGrade.appendChild(criarCardCarta(carta)));
    } else {
        listaCartas.innerHTML = '';
        visiveis.forEach((carta) => listaCartas.appendChild(criarLinhaCarta(carta)));
    }
}

function criarBotoesAcao(carta) {
    const botaoEditar = document.createElement('button');
    botaoEditar.type = 'button';
    botaoEditar.className = 'botao botao-neutro botao-pequeno';
    botaoEditar.innerHTML = ICONE_EDITAR + '<span>Editar</span>';
    botaoEditar.setAttribute('aria-label', `Editar ${carta.nome_en}`);
    botaoEditar.addEventListener('click', () => abrirFormulario(carta));

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.className = 'botao botao-neutro botao-pequeno botao-excluir';
    botaoExcluir.innerHTML = ICONE_EXCLUIR + '<span>Excluir</span>';
    botaoExcluir.setAttribute('aria-label', `Excluir ${carta.nome_en}`);
    botaoExcluir.addEventListener('click', () => confirmarExclusao(carta));

    return { botaoEditar, botaoExcluir };
}

function criarLinhaCarta(carta) {
    const linha = document.createElement('tr');

    const celulaImagem = document.createElement('td');
    if (carta.imagem) {
        const imagem = document.createElement('img');
        imagem.src = carta.imagem;
        imagem.alt = carta.nome_en;
        imagem.className = 'miniatura ampliavel';
        imagem.loading = 'lazy';
        imagem.title = 'Clique para ampliar';
        imagem.addEventListener('click', () => abrirVisualizadorImagem(carta.imagem, carta.nome_en));
        celulaImagem.appendChild(imagem);
    } else {
        const vazia = document.createElement('span');
        vazia.className = 'miniatura-vazia';
        vazia.setAttribute('aria-hidden', 'true');
        vazia.innerHTML = ICONE_IMAGEM_VAZIA;
        celulaImagem.appendChild(vazia);
    }

    const celulaNomeEn = document.createElement('td');
    celulaNomeEn.className = 'celula-nome';
    celulaNomeEn.textContent = carta.nome_en;

    const celulaNomePt = document.createElement('td');
    celulaNomePt.textContent = carta.nome_pt || '—';
    if (!carta.nome_pt) {
        celulaNomePt.style.color = 'var(--texto-suave)';
    }

    const celulaJogo = document.createElement('td');
    const chipJogo = document.createElement('span');
    chipJogo.className = 'chip chip-jogo-' + carta.card_game;
    chipJogo.textContent = nomesJogos[carta.card_game] || carta.card_game;
    celulaJogo.appendChild(chipJogo);

    const celulaEdicao = document.createElement('td');
    celulaEdicao.textContent = carta.edicao_nome;

    const celulaRaridade = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'badge ' + classeRaridade(carta.raridade);
    badge.textContent = carta.raridade;
    celulaRaridade.appendChild(badge);

    const celulaAcoes = document.createElement('td');
    celulaAcoes.className = 'celula-acoes';
    const { botaoEditar, botaoExcluir } = criarBotoesAcao(carta);
    celulaAcoes.append(botaoEditar, botaoExcluir);

    linha.append(
        celulaImagem,
        celulaNomeEn,
        celulaNomePt,
        celulaJogo,
        celulaEdicao,
        celulaRaridade,
        celulaAcoes
    );

    return linha;
}

function criarCardCarta(carta) {
    const card = document.createElement('div');
    card.className = 'carta-card';

    const areaImagem = document.createElement('div');
    areaImagem.className = 'carta-card-imagem';
    if (carta.imagem) {
        const imagem = document.createElement('img');
        imagem.src = carta.imagem;
        imagem.alt = carta.nome_en;
        imagem.loading = 'lazy';
        areaImagem.appendChild(imagem);
        areaImagem.classList.add('ampliavel');
        areaImagem.title = 'Clique para ampliar';
        areaImagem.addEventListener('click', () => abrirVisualizadorImagem(carta.imagem, carta.nome_en));
    } else {
        const vazia = document.createElement('span');
        vazia.className = 'carta-sem-imagem';
        vazia.setAttribute('aria-hidden', 'true');
        vazia.innerHTML = ICONE_IMAGEM_VAZIA;
        areaImagem.appendChild(vazia);
    }

    const chipJogo = document.createElement('span');
    chipJogo.className = 'chip chip-jogo-' + carta.card_game;
    chipJogo.textContent = nomesJogos[carta.card_game] || carta.card_game;
    areaImagem.appendChild(chipJogo);

    const corpo = document.createElement('div');
    corpo.className = 'carta-card-corpo';

    const nomeEn = document.createElement('span');
    nomeEn.className = 'carta-card-nome';
    nomeEn.textContent = carta.nome_en;
    corpo.appendChild(nomeEn);

    if (carta.nome_pt) {
        const nomePt = document.createElement('span');
        nomePt.className = 'carta-card-nome-pt';
        nomePt.textContent = carta.nome_pt;
        corpo.appendChild(nomePt);
    }

    const meta = document.createElement('div');
    meta.className = 'carta-card-meta';

    const edicao = document.createElement('span');
    edicao.className = 'carta-card-edicao';
    edicao.textContent = carta.edicao_nome;

    const badge = document.createElement('span');
    badge.className = 'badge ' + classeRaridade(carta.raridade);
    badge.textContent = carta.raridade;

    meta.append(edicao, badge);
    corpo.appendChild(meta);

    const acoes = document.createElement('div');
    acoes.className = 'carta-card-acoes';
    const { botaoEditar, botaoExcluir } = criarBotoesAcao(carta);
    acoes.append(botaoEditar, botaoExcluir);
    corpo.appendChild(acoes);

    card.append(areaImagem, corpo);

    return card;
}

function definirVisualizacao(modo) {
    modoVisualizacao = modo;
    localStorage.setItem(CHAVE_VISUALIZACAO, modo);
    const ehGrade = modo === 'grade';
    botaoVerLista.setAttribute('aria-pressed', String(!ehGrade));
    botaoVerGrade.setAttribute('aria-pressed', String(ehGrade));
    renderizarCartas();
}

botaoVerLista.addEventListener('click', () => definirVisualizacao('lista'));
botaoVerGrade.addEventListener('click', () => definirVisualizacao('grade'));

botaoVerLista.setAttribute('aria-pressed', String(modoVisualizacao !== 'grade'));
botaoVerGrade.setAttribute('aria-pressed', String(modoVisualizacao === 'grade'));

let temporizadorAviso = null;

function mostrarAviso(mensagem) {
    const aviso = document.getElementById('aviso');
    aviso.textContent = mensagem;
    aviso.hidden = false;

    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
        aviso.hidden = true;
    }, 3000);
}

campoBusca.addEventListener('input', renderizarCartas);

const modalExclusao = document.getElementById('modal-exclusao');
const textoExclusao = document.getElementById('texto-exclusao');
const botaoConfirmarExclusao = document.getElementById('botao-confirmar-exclusao');

let cartaParaExcluir = null;

function confirmarExclusao(carta) {
    cartaParaExcluir = carta;
    textoExclusao.textContent = `Tem certeza que deseja excluir a carta "${carta.nome_en}"?`;
    modalExclusao.hidden = false;
    empilharModal(fecharModalExclusao);
}

function fecharModalExclusao() {
    modalExclusao.hidden = true;
    cartaParaExcluir = null;
    desempilharModal(fecharModalExclusao);
}

botaoConfirmarExclusao.addEventListener('click', async () => {
    if (!cartaParaExcluir) {
        return;
    }

    botaoConfirmarExclusao.disabled = true;
    botaoConfirmarExclusao.textContent = 'Excluindo...';

    try {
        const resposta = await fetch(`api/cartas.php?id=${cartaParaExcluir.id}`, { method: 'DELETE' });
        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarAviso(dados.erro || 'Não foi possível excluir a carta.');
        } else {
            mostrarAviso('Carta excluída com sucesso.');
        }

        fecharModalExclusao();
        carregarCartas();
    } catch (erro) {
        mostrarAviso('Falha de conexão com o servidor.');
    } finally {
        botaoConfirmarExclusao.disabled = false;
        botaoConfirmarExclusao.textContent = 'Excluir';
    }
});

document.getElementById('botao-cancelar-exclusao').addEventListener('click', fecharModalExclusao);

modalExclusao.addEventListener('click', (evento) => {
    if (evento.target === modalExclusao) {
        fecharModalExclusao();
    }
});

document.getElementById('botao-sair').addEventListener('click', async () => {
    await fetch('api/logout.php', { method: 'POST' });
    window.location.href = 'index.html';
});

verificarSessao();
carregarCartas();
