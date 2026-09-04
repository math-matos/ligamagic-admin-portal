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

function atualizarEstadoFiltros() {
    const total = contarFiltrosAtivos();
    botaoLimparFiltros.hidden = total === 0;
    badgeFiltrosAtivos.hidden = total === 0;
    if (total > 0) {
        badgeFiltrosAtivos.textContent = String(total);
    }
}

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
    resetarPaginaERenderizar();
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
    resetarPaginaERenderizar();
});

botaoAlternarFiltros.addEventListener('click', () => {
    sidebarFiltros.classList.contains('aberta') ? fecharFiltrosMobile() : abrirFiltrosMobile();
});
backdropFiltros.addEventListener('click', fecharFiltrosMobile);
