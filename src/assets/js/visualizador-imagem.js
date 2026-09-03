const modalImagem = document.getElementById('modal-imagem');
const areaVisualizador = document.getElementById('visualizador-imagem-area');
const imagemAmpliada = document.getElementById('visualizador-imagem');
const zoomPercentual = document.getElementById('zoom-percentual');

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_PASSO = 0.5;

let escalaAtual = 1;
let deslocamentoX = 0;
let deslocamentoY = 0;
let arrastandoImagem = false;
let inicioPonteiroX = 0;
let inicioPonteiroY = 0;
let inicioDeslocamentoX = 0;
let inicioDeslocamentoY = 0;

function aplicarTransformacaoImagem() {
    imagemAmpliada.style.transform = `translate(${deslocamentoX}px, ${deslocamentoY}px) scale(${escalaAtual})`;
    zoomPercentual.textContent = Math.round(escalaAtual * 100) + '%';
    areaVisualizador.classList.toggle('zoom-ativo', escalaAtual > ZOOM_MIN);
}

function definirZoomImagem(novaEscala) {
    escalaAtual = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, novaEscala));
    if (escalaAtual === ZOOM_MIN) {
        deslocamentoX = 0;
        deslocamentoY = 0;
    }
    aplicarTransformacaoImagem();
}

function abrirVisualizadorImagem(src, alt) {
    imagemAmpliada.src = src;
    imagemAmpliada.alt = alt || '';
    escalaAtual = 1;
    deslocamentoX = 0;
    deslocamentoY = 0;
    aplicarTransformacaoImagem();
    modalImagem.hidden = false;
    empilharModal(fecharVisualizadorImagem);
}

function fecharVisualizadorImagem() {
    modalImagem.hidden = true;
    imagemAmpliada.src = '';
    desempilharModal(fecharVisualizadorImagem);
}

document.getElementById('botao-fechar-imagem').addEventListener('click', fecharVisualizadorImagem);
document.getElementById('zoom-aumentar').addEventListener('click', () => definirZoomImagem(escalaAtual + ZOOM_PASSO));
document.getElementById('zoom-diminuir').addEventListener('click', () => definirZoomImagem(escalaAtual - ZOOM_PASSO));
document.getElementById('zoom-resetar').addEventListener('click', () => definirZoomImagem(1));

modalImagem.addEventListener('click', (evento) => {
    if (evento.target === modalImagem) {
        fecharVisualizadorImagem();
    }
});

areaVisualizador.addEventListener('wheel', (evento) => {
    evento.preventDefault();
    const direcao = evento.deltaY > 0 ? -1 : 1;
    definirZoomImagem(escalaAtual + direcao * (ZOOM_PASSO / 2));
}, { passive: false });

areaVisualizador.addEventListener('dblclick', () => {
    definirZoomImagem(escalaAtual > ZOOM_MIN ? 1 : 2.5);
});

areaVisualizador.addEventListener('pointerdown', (evento) => {
    if (escalaAtual <= ZOOM_MIN) {
        return;
    }
    arrastandoImagem = true;
    areaVisualizador.classList.add('arrastando');
    inicioPonteiroX = evento.clientX;
    inicioPonteiroY = evento.clientY;
    inicioDeslocamentoX = deslocamentoX;
    inicioDeslocamentoY = deslocamentoY;
    areaVisualizador.setPointerCapture(evento.pointerId);
});

areaVisualizador.addEventListener('pointermove', (evento) => {
    if (!arrastandoImagem) {
        return;
    }
    deslocamentoX = inicioDeslocamentoX + (evento.clientX - inicioPonteiroX);
    deslocamentoY = inicioDeslocamentoY + (evento.clientY - inicioPonteiroY);
    aplicarTransformacaoImagem();
});

function pararArrasteImagem() {
    arrastandoImagem = false;
    areaVisualizador.classList.remove('arrastando');
}

areaVisualizador.addEventListener('pointerup', pararArrasteImagem);
areaVisualizador.addEventListener('pointercancel', pararArrasteImagem);
areaVisualizador.addEventListener('pointerleave', pararArrasteImagem);
