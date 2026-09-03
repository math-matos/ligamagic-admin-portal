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

campoBusca.addEventListener('input', renderizarCartas);
