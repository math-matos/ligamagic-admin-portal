function normalizarTexto(texto) {
    return (texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

function classeRaridade(raridade) {
    const base = normalizarTexto(raridade).replace(/\s+/g, '-');
    return 'badge-' + base;
}

function criarEl(tag, classe = '', texto = '') {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
}

function criarChipJogo(carta) {
    return criarEl('span', 'chip chip-jogo-' + carta.card_game, NOMES_JOGOS[carta.card_game] || carta.card_game);
}

function criarBadgeRaridade(carta) {
    return criarEl('span', 'badge ' + classeRaridade(carta.raridade), carta.raridade);
}

function comBandeira(el, bandeira, texto) {
    el.innerHTML = bandeira;
    el.appendChild(document.createTextNode(texto));
    return el;
}

function criarIconeSemImagem(classe) {
    const vazia = criarEl('span', classe);
    vazia.setAttribute('aria-hidden', 'true');
    vazia.innerHTML = ICONES.IMAGEM_VAZIA;
    return vazia;
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
const botaoVazioNovaCarta = document.getElementById('botao-vazio-nova-carta');
const campoBusca = document.getElementById('campo-busca');

const sidebarFiltros = document.getElementById('filtros-sidebar');
const backdropFiltros = document.getElementById('filtros-backdrop');
const botaoAlternarFiltros = document.getElementById('botao-alternar-filtros');
const botaoLimparFiltros = document.getElementById('botao-limpar-filtros');
const badgeFiltrosAtivos = document.getElementById('badge-filtros-ativos');
const listaFiltroEdicao = document.getElementById('lista-filtro-edicao');
const listaFiltroJogo = document.getElementById('lista-filtro-jogo');
const vazioFiltroJogo = document.getElementById('vazio-filtro-jogo');
const buscaFiltroJogo = document.getElementById('busca-filtro-jogo');
const buscaFiltroEdicao = document.getElementById('busca-filtro-edicao');
const listaFiltroRaridade = document.getElementById('lista-filtro-raridade');
const vazioFiltroRaridade = document.getElementById('vazio-filtro-raridade');
const buscaFiltroRaridade = document.getElementById('busca-filtro-raridade');

const filtros = {
    jogos: new Set(),
    raridades: new Set(),
    edicoes: new Set()
};

const buscaOpcoes = {
    jogo: '',
    edicao: '',
    raridade: ''
};

function chaveEdicao(carta) {
    return `${carta.card_game}::${carta.edicao_id}`;
}

function definirContagem(checkbox, total) {
    const opcao = checkbox.closest('.filtro-opcao');
    const contagem = opcao.querySelector('.filtro-contagem');
    if (contagem) {
        contagem.textContent = String(total);
    }
    opcao.classList.toggle('sem-resultado', total === 0);
}

function renderizarContadoresEstaticos() {
    sidebarFiltros.querySelectorAll('.filtro-checkbox[data-grupo="jogo"]').forEach((checkbox) => {
        const total = cartas.filter((carta) => carta.card_game === checkbox.value).length;
        definirContagem(checkbox, total);
    });
    sidebarFiltros.querySelectorAll('.filtro-checkbox[data-grupo="raridade"]').forEach((checkbox) => {
        const total = cartas.filter((carta) => carta.raridade === checkbox.value).length;
        definirContagem(checkbox, total);
    });
}

function criarOpcaoFiltro(grupo, valor, texto) {
    const label = criarEl('label', 'filtro-opcao');

    const input = criarEl('input', 'filtro-checkbox');
    input.type = 'checkbox';
    input.dataset.grupo = grupo;
    input.value = valor;

    const caixa = criarEl('span', 'filtro-caixa');
    caixa.setAttribute('aria-hidden', 'true');

    label.append(input, caixa, criarEl('span', 'filtro-texto', texto), criarEl('span', 'filtro-contagem'));
    return label;
}

function montarOpcoesFixasDosFiltros() {
    Object.entries(NOMES_JOGOS).forEach(([valor, nome]) => {
        listaFiltroJogo.appendChild(criarOpcaoFiltro('jogo', valor, nome));
    });

    const jogosPorRaridade = new Map();
    Object.entries(RARIDADES_POR_JOGO).forEach(([jogo, raridades]) => {
        raridades.forEach((raridade) => {
            const jogos = jogosPorRaridade.get(raridade) || [];
            jogos.push(jogo);
            jogosPorRaridade.set(raridade, jogos);
        });
    });

    jogosPorRaridade.forEach((jogos, raridade) => {
        const opcao = criarOpcaoFiltro('raridade', raridade, raridade);
        opcao.dataset.jogos = jogos.join(' ');
        listaFiltroRaridade.appendChild(opcao);
    });
}

function filtrarOpcoesJogo() {
    const termo = buscaOpcoes.jogo;
    let visiveis = 0;

    listaFiltroJogo.querySelectorAll('.filtro-opcao').forEach((opcao) => {
        const texto = normalizarTexto(opcao.querySelector('.filtro-texto').textContent);
        const corresponde = !termo || texto.includes(termo);
        opcao.hidden = !corresponde;
        if (corresponde) {
            visiveis++;
        }
    });

    vazioFiltroJogo.hidden = visiveis > 0;
}

function raridadeCorrespondeJogo(opcao) {
    if (!filtros.jogos.size) {
        return true;
    }
    const jogos = (opcao.dataset.jogos || '').split(' ').filter(Boolean);
    return jogos.some((jogo) => filtros.jogos.has(jogo));
}

function filtrarOpcoesRaridade() {
    const termo = buscaOpcoes.raridade;
    let visiveis = 0;

    listaFiltroRaridade.querySelectorAll('.filtro-opcao').forEach((opcao) => {
        const texto = normalizarTexto(opcao.querySelector('.filtro-texto').textContent);
        const correspondeTexto = !termo || texto.includes(termo);
        const corresponde = correspondeTexto && raridadeCorrespondeJogo(opcao);
        opcao.hidden = !corresponde;
        if (corresponde) {
            visiveis++;
        }
    });

    vazioFiltroRaridade.hidden = visiveis > 0;
}

function sincronizarRaridadesComJogo() {
    listaFiltroRaridade.querySelectorAll('.filtro-opcao').forEach((opcao) => {
        if (raridadeCorrespondeJogo(opcao)) {
            return;
        }
        const checkbox = opcao.querySelector('.filtro-checkbox');
        if (checkbox && checkbox.checked) {
            checkbox.checked = false;
            filtros.raridades.delete(checkbox.value);
        }
    });
    filtrarOpcoesRaridade();
}

buscaFiltroJogo.addEventListener('input', () => {
    buscaOpcoes.jogo = normalizarTexto(buscaFiltroJogo.value.trim());
    filtrarOpcoesJogo();
});

buscaFiltroRaridade.addEventListener('input', () => {
    buscaOpcoes.raridade = normalizarTexto(buscaFiltroRaridade.value.trim());
    filtrarOpcoesRaridade();
});

buscaFiltroEdicao.addEventListener('input', () => {
    buscaOpcoes.edicao = normalizarTexto(buscaFiltroEdicao.value.trim());
    renderizarListaEdicao();
});

function renderizarListaEdicao() {
    const base = filtros.jogos.size
        ? cartas.filter((carta) => filtros.jogos.has(carta.card_game))
        : cartas;

    const mapa = new Map();
    base.forEach((carta) => {
        const chave = chaveEdicao(carta);
        if (!mapa.has(chave)) {
            mapa.set(chave, { nome: carta.edicao_nome, total: 0 });
        }
        mapa.get(chave).total += 1;
    });

    Array.from(filtros.edicoes).forEach((chave) => {
        if (!mapa.has(chave)) {
            filtros.edicoes.delete(chave);
        }
    });

    listaFiltroEdicao.innerHTML = '';

    const termoBusca = buscaOpcoes.edicao;
    const entradas = Array.from(mapa.entries())
        .filter(([, info]) => !termoBusca || normalizarTexto(info.nome).includes(termoBusca))
        .sort((a, b) => a[1].nome.localeCompare(b[1].nome, 'pt-BR'));

    if (!entradas.length) {
        const texto = mapa.size ? 'Nenhuma edição encontrada.' : 'Nenhuma edição disponível.';
        listaFiltroEdicao.appendChild(criarEl('p', 'filtro-vazio', texto));
        return;
    }

    entradas.forEach(([chave, info]) => {
        const opcao = criarOpcaoFiltro('edicao', chave, info.nome);
        opcao.querySelector('.filtro-checkbox').checked = filtros.edicoes.has(chave);
        opcao.querySelector('.filtro-contagem').textContent = String(info.total);
        listaFiltroEdicao.appendChild(opcao);
    });
}

function contarFiltrosAtivos() {
    return filtros.jogos.size + filtros.raridades.size + filtros.edicoes.size;
}

function atualizarEstadoFiltros() {
    const total = contarFiltrosAtivos();
    botaoLimparFiltros.hidden = total === 0;
    badgeFiltrosAtivos.hidden = total === 0;
    if (total > 0) {
        badgeFiltrosAtivos.textContent = String(total);
    }
}

sidebarFiltros.addEventListener('change', (evento) => {
    const alvo = evento.target;
    if (!alvo.classList.contains('filtro-checkbox')) {
        return;
    }

    const conjuntos = { jogo: filtros.jogos, raridade: filtros.raridades, edicao: filtros.edicoes };
    const conjunto = conjuntos[alvo.dataset.grupo];
    if (!conjunto) {
        return;
    }

    if (alvo.checked) {
        conjunto.add(alvo.value);
    } else {
        conjunto.delete(alvo.value);
    }

    if (alvo.dataset.grupo === 'jogo') {
        renderizarListaEdicao();
        sincronizarRaridadesComJogo();
    }

    atualizarEstadoFiltros();
    renderizarCartas();
});

botaoLimparFiltros.addEventListener('click', () => {
    filtros.jogos.clear();
    filtros.raridades.clear();
    filtros.edicoes.clear();
    sidebarFiltros.querySelectorAll('.filtro-checkbox').forEach((checkbox) => {
        checkbox.checked = false;
    });
    renderizarListaEdicao();
    filtrarOpcoesRaridade();
    atualizarEstadoFiltros();
    renderizarCartas();
});

function abrirFiltrosMobile() {
    sidebarFiltros.classList.add('aberta');
    backdropFiltros.hidden = false;
    requestAnimationFrame(() => backdropFiltros.classList.add('aberta'));
    botaoAlternarFiltros.setAttribute('aria-expanded', 'true');
    empilharModal(fecharFiltrosMobile);
}

function fecharFiltrosMobile() {
    sidebarFiltros.classList.remove('aberta');
    backdropFiltros.classList.remove('aberta');
    botaoAlternarFiltros.setAttribute('aria-expanded', 'false');
    desempilharModal(fecharFiltrosMobile);
    setTimeout(() => {
        if (!backdropFiltros.classList.contains('aberta')) {
            backdropFiltros.hidden = true;
        }
    }, 180);
}

botaoAlternarFiltros.addEventListener('click', () => {
    sidebarFiltros.classList.contains('aberta') ? fecharFiltrosMobile() : abrirFiltrosMobile();
});
backdropFiltros.addEventListener('click', fecharFiltrosMobile);

const CHAVE_VISUALIZACAO = 'cartas-visualizacao';
let modoVisualizacao = localStorage.getItem(CHAVE_VISUALIZACAO) === 'lista' ? 'lista' : 'grade';

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
        renderizarContadoresEstaticos();
        renderizarListaEdicao();
        sincronizarRaridadesComJogo();
        atualizarEstadoFiltros();
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
        botaoVazioNovaCarta.hidden = true;
        estadoVazio.hidden = false;
    }
}

function filtrarCartas() {
    const termo = campoBusca.value.trim().toLowerCase();

    return cartas.filter((carta) => {
        if (filtros.jogos.size && !filtros.jogos.has(carta.card_game)) {
            return false;
        }
        if (filtros.raridades.size && !filtros.raridades.has(carta.raridade)) {
            return false;
        }
        if (filtros.edicoes.size && !filtros.edicoes.has(chaveEdicao(carta))) {
            return false;
        }
        if (!termo) {
            return true;
        }

        const campos = [
            carta.nome_en,
            carta.nome_pt || '',
            NOMES_JOGOS[carta.card_game] || '',
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

    const temFiltroAtivo = Boolean(campoBusca.value.trim()) || contarFiltrosAtivos() > 0;
    estadoVazioTexto.textContent = temFiltroAtivo
        ? 'Nenhuma carta encontrada.'
        : 'Nenhuma carta cadastrada ainda.';
    if (estadoVazioDica) {
        estadoVazioDica.textContent = temFiltroAtivo
            ? 'Tente ajustar os filtros ou o termo de busca.'
            : 'Clique em “Nova Carta” para começar.';
    }

    estadoVazio.hidden = temResultados;
    botaoVazioNovaCarta.hidden = temResultados || temFiltroAtivo;
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
    botaoEditar.innerHTML = ICONES.EDITAR + '<span>Editar</span>';
    botaoEditar.setAttribute('aria-label', `Editar ${carta.nome_en}`);
    botaoEditar.addEventListener('click', () => abrirFormulario(carta));

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.className = 'botao botao-neutro botao-pequeno botao-excluir';
    botaoExcluir.innerHTML = ICONES.EXCLUIR + '<span>Excluir</span>';
    botaoExcluir.setAttribute('aria-label', `Excluir ${carta.nome_en}`);
    botaoExcluir.addEventListener('click', () => confirmarExclusao(carta));

    return { botaoEditar, botaoExcluir };
}

function criarLinhaCarta(carta) {
    const linha = document.createElement('tr');

    const celulaImagem = criarEl('td');
    if (carta.imagem) {
        const imagem = criarEl('img', 'miniatura ampliavel');
        imagem.src = carta.imagem;
        imagem.alt = carta.nome_en;
        imagem.loading = 'lazy';
        imagem.title = 'Clique para ampliar';
        imagem.addEventListener('click', () => abrirVisualizadorImagem(carta.imagem, carta.nome_en));
        celulaImagem.appendChild(imagem);
    } else {
        celulaImagem.appendChild(criarIconeSemImagem('miniatura-vazia'));
    }

    const celulaNomeEn = comBandeira(criarEl('td', 'celula-nome'), ICONES.BANDEIRA_EUA, carta.nome_en);

    const celulaNomePt = criarEl('td');
    if (carta.nome_pt) {
        comBandeira(celulaNomePt, ICONES.BANDEIRA_BRASIL, carta.nome_pt);
    } else {
        celulaNomePt.textContent = '—';
        celulaNomePt.style.color = 'var(--texto-suave)';
    }

    const celulaJogo = criarEl('td');
    celulaJogo.appendChild(criarChipJogo(carta));

    const celulaRaridade = criarEl('td');
    celulaRaridade.appendChild(criarBadgeRaridade(carta));

    const celulaAcoes = criarEl('td', 'celula-acoes');
    const { botaoEditar, botaoExcluir } = criarBotoesAcao(carta);
    celulaAcoes.append(botaoEditar, botaoExcluir);

    linha.append(
        celulaImagem,
        celulaNomeEn,
        celulaNomePt,
        celulaJogo,
        criarEl('td', '', carta.edicao_nome),
        celulaRaridade,
        celulaAcoes
    );

    return linha;
}

function criarCardCarta(carta) {
    const card = criarEl('div', 'carta-card');

    const areaImagem = criarEl('div', 'carta-card-imagem');
    if (carta.imagem) {
        const imagem = criarEl('img');
        imagem.src = carta.imagem;
        imagem.alt = carta.nome_en;
        imagem.loading = 'lazy';
        areaImagem.appendChild(imagem);
        areaImagem.classList.add('ampliavel');
        areaImagem.title = 'Clique para ampliar';
        areaImagem.addEventListener('click', () => abrirVisualizadorImagem(carta.imagem, carta.nome_en));
    } else {
        areaImagem.appendChild(criarIconeSemImagem('carta-sem-imagem'));
    }
    areaImagem.appendChild(criarChipJogo(carta));

    const corpo = criarEl('div', 'carta-card-corpo');
    corpo.appendChild(comBandeira(criarEl('span', 'carta-card-nome'), ICONES.BANDEIRA_EUA, carta.nome_en));

    if (carta.nome_pt) {
        corpo.appendChild(comBandeira(criarEl('span', 'carta-card-nome-pt'), ICONES.BANDEIRA_BRASIL, carta.nome_pt));
    }

    const meta = criarEl('div', 'carta-card-meta');
    meta.append(criarEl('span', 'carta-card-edicao', carta.edicao_nome), criarBadgeRaridade(carta));
    corpo.appendChild(meta);

    const acoes = criarEl('div', 'carta-card-acoes');
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

const botaoVoltarHub = document.getElementById('botao-voltar-hub');

function aplicarFiltroInicial() {
    const parametros = new URLSearchParams(window.location.search);
    const jogo = parametros.get('jogo');
    if (!jogo || jogo === 'todas' || !NOMES_JOGOS[jogo]) {
        return;
    }

    filtros.jogos.add(jogo);
    sidebarFiltros.querySelectorAll('.filtro-checkbox[data-grupo="jogo"]').forEach((checkbox) => {
        checkbox.checked = checkbox.value === jogo;
    });
}

botaoVoltarHub.addEventListener('click', () => {
    window.location.href = 'home.html';
});

montarOpcoesFixasDosFiltros();
aplicarFiltroInicial();
verificarSessao();
carregarCartas();
