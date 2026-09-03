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

document.getElementById('botao-sair').addEventListener('click', async () => {
    await fetch('api/logout.php', { method: 'POST' });
    window.location.href = 'index.html';
});

document.getElementById('botao-voltar-hub').addEventListener('click', () => {
    window.location.href = 'home.html';
});

montarOpcoesFixasDosFiltros();
aplicarFiltroInicial();
verificarSessao();
carregarCartas();
