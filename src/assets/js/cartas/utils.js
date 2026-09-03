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
