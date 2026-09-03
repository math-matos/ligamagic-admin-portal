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

async function carregarContagens() {
    try {
        const resposta = await fetch('api/cartas.php');

        if (resposta.status === 401) {
            window.location.href = 'index.html';
            return;
        }

        const dados = await resposta.json();
        const cartas = dados.cartas || [];

        document.querySelectorAll('.hub-card-contagem').forEach((elemento) => {
            const alvo = elemento.dataset.contagem;
            const total = alvo === 'todas'
                ? cartas.length
                : cartas.filter((carta) => carta.card_game === alvo).length;
            elemento.textContent = total === 1 ? '1 carta' : `${total} cartas`;
        });
    } catch (erro) {
        console.error('Erro ao carregar contagens:', erro);
    }
}

document.querySelectorAll('.hub-card').forEach((card) => {
    card.addEventListener('click', () => {
        window.location.href = `cartas.html?jogo=${card.dataset.jogo}`;
    });
});

document.getElementById('botao-sair').addEventListener('click', async () => {
    await fetch('api/logout.php', { method: 'POST' });
    window.location.href = 'index.html';
});

verificarSessao();
carregarContagens();
