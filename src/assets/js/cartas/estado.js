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

const CHAVE_VISUALIZACAO = 'cartas-visualizacao';
let modoVisualizacao = localStorage.getItem(CHAVE_VISUALIZACAO) === 'lista' ? 'lista' : 'grade';

function chaveEdicao(carta) {
    return `${carta.card_game}::${carta.edicao_id}`;
}

function contarFiltrosAtivos() {
    return filtros.jogos.size + filtros.raridades.size + filtros.edicoes.size;
}
