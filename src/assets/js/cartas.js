const nomesJogos = {
    magic: 'Magic: The Gathering',
    pokemon: 'Pokémon',
    yugioh: 'Yu-Gi-Oh!'
};

let cartas = [];

const listaCartas = document.getElementById('lista-cartas');
const estadoVazio = document.getElementById('estado-vazio');
const estadoCarregando = document.getElementById('estado-carregando');
const campoBusca = document.getElementById('campo-busca');

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
    estadoCarregando.hidden = false;
    estadoVazio.hidden = true;

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
        estadoVazio.textContent = 'Erro ao carregar as cartas. Recarregue a página.';
        estadoVazio.hidden = false;
    } finally {
        estadoCarregando.hidden = true;
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

    listaCartas.innerHTML = '';
    estadoVazio.textContent = 'Nenhuma carta encontrada.';
    estadoVazio.hidden = visiveis.length > 0;

    visiveis.forEach((carta) => {
        const linha = document.createElement('tr');

        const celulaImagem = document.createElement('td');
        if (carta.imagem) {
            const imagem = document.createElement('img');
            imagem.src = carta.imagem;
            imagem.alt = carta.nome_en;
            imagem.className = 'miniatura';
            celulaImagem.appendChild(imagem);
        } else {
            celulaImagem.textContent = '—';
        }

        const celulaNomeEn = document.createElement('td');
        celulaNomeEn.textContent = carta.nome_en;

        const celulaNomePt = document.createElement('td');
        celulaNomePt.textContent = carta.nome_pt || '—';

        const celulaJogo = document.createElement('td');
        celulaJogo.textContent = nomesJogos[carta.card_game] || carta.card_game;

        const celulaEdicao = document.createElement('td');
        celulaEdicao.textContent = carta.edicao_nome;

        const celulaRaridade = document.createElement('td');
        celulaRaridade.textContent = carta.raridade;

        const celulaAcoes = document.createElement('td');
        celulaAcoes.className = 'celula-acoes';

        const botaoEditar = document.createElement('button');
        botaoEditar.type = 'button';
        botaoEditar.className = 'botao botao-neutro botao-pequeno';
        botaoEditar.textContent = 'Editar';
        botaoEditar.addEventListener('click', () => abrirFormulario(carta));

        const botaoExcluir = document.createElement('button');
        botaoExcluir.type = 'button';
        botaoExcluir.className = 'botao botao-perigo botao-pequeno';
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.addEventListener('click', () => confirmarExclusao(carta));

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

        listaCartas.appendChild(linha);
    });
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

campoBusca.addEventListener('input', renderizarCartas);

const modalExclusao = document.getElementById('modal-exclusao');
const textoExclusao = document.getElementById('texto-exclusao');
const botaoConfirmarExclusao = document.getElementById('botao-confirmar-exclusao');

let cartaParaExcluir = null;

function confirmarExclusao(carta) {
    cartaParaExcluir = carta;
    textoExclusao.textContent = `Tem certeza que deseja excluir a carta "${carta.nome_en}"?`;
    modalExclusao.hidden = false;
}

function fecharModalExclusao() {
    modalExclusao.hidden = true;
    cartaParaExcluir = null;
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
