
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
