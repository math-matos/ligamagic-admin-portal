const modalFormulario = document.getElementById('modal-formulario');
const tituloFormulario = document.getElementById('titulo-formulario');
const formCarta = document.getElementById('form-carta');
const campoCartaId = document.getElementById('carta-id');
const campoNomeEn = document.getElementById('nome-en');
const campoNomePt = document.getElementById('nome-pt');
const campoCardGame = document.getElementById('card-game');
const campoEdicao = document.getElementById('edicao');
const campoRaridade = document.getElementById('raridade');
const campoImagem = document.getElementById('imagem');
const previaImagem = document.getElementById('previa-imagem');
const erroFormulario = document.getElementById('erro-formulario');
const botaoSalvar = document.getElementById('botao-salvar');

let edicaoPendente = null;

function abrirFormulario(carta = null) {
    formCarta.reset();
    campoCartaId.value = '';
    erroFormulario.hidden = true;
    previaImagem.hidden = true;
    previaImagem.src = '';
    if (dropzoneTitulo) {
        dropzoneTitulo.textContent = dropzoneTituloPadrao;
    }
    resetarEdicoes();

    if (carta) {
        tituloFormulario.textContent = 'Editar Carta';
        campoCartaId.value = carta.id;
        campoNomeEn.value = carta.nome_en;
        campoNomePt.value = carta.nome_pt || '';
        campoCardGame.value = carta.card_game;
        campoRaridade.value = carta.raridade;

        if (carta.imagem) {
            previaImagem.src = carta.imagem;
            previaImagem.hidden = false;
        }

        edicaoPendente = carta.edicao_id;
        carregarEdicoes(carta.card_game);
    } else {
        tituloFormulario.textContent = 'Nova Carta';
    }

    modalFormulario.hidden = false;
    campoNomeEn.focus();
}

function fecharFormulario() {
    modalFormulario.hidden = true;
}

function resetarEdicoes() {
    campoEdicao.disabled = true;
    campoEdicao.innerHTML = '<option value="">Selecione um Card Game primeiro</option>';
}

async function carregarEdicoes(jogo) {
    campoEdicao.disabled = true;
    campoEdicao.innerHTML = '<option value="">Carregando edições...</option>';

    try {
        const resposta = await fetch(`api/edicoes.php?jogo=${encodeURIComponent(jogo)}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            campoEdicao.innerHTML = '<option value="">Erro ao carregar edições</option>';
            return;
        }

        campoEdicao.innerHTML = '<option value="">Selecione...</option>';

        dados.edicoes.forEach((edicao) => {
            const opcao = document.createElement('option');
            opcao.value = edicao.id;
            opcao.textContent = edicao.name;
            campoEdicao.appendChild(opcao);
        });

        campoEdicao.disabled = false;

        if (edicaoPendente) {
            campoEdicao.value = edicaoPendente;
            edicaoPendente = null;
        }
    } catch (erro) {
        campoEdicao.innerHTML = '<option value="">Erro ao carregar edições</option>';
    }
}

campoCardGame.addEventListener('change', () => {
    edicaoPendente = null;

    if (campoCardGame.value) {
        carregarEdicoes(campoCardGame.value);
    } else {
        resetarEdicoes();
    }
});

const dropzoneTitulo = document.querySelector('.dropzone-texto strong');
const dropzoneTituloPadrao = dropzoneTitulo ? dropzoneTitulo.textContent : '';

campoImagem.addEventListener('change', () => {
    const arquivo = campoImagem.files[0];

    if (arquivo) {
        previaImagem.src = URL.createObjectURL(arquivo);
        previaImagem.hidden = false;
        if (dropzoneTitulo) {
            dropzoneTitulo.textContent = arquivo.name;
        }
    } else if (dropzoneTitulo) {
        dropzoneTitulo.textContent = dropzoneTituloPadrao;
    }
});

function validarFormulario() {
    if (!campoNomeEn.value.trim()) {
        return 'Informe o nome da carta em inglês.';
    }
    if (!campoCardGame.value) {
        return 'Selecione o card game.';
    }
    if (!campoEdicao.value) {
        return 'Selecione a edição da carta.';
    }
    if (!campoRaridade.value) {
        return 'Selecione a raridade da carta.';
    }
    if (!campoCartaId.value && !campoImagem.files[0]) {
        return 'Selecione a imagem da carta.';
    }
    return null;
}

formCarta.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    erroFormulario.hidden = true;

    const mensagemValidacao = validarFormulario();

    if (mensagemValidacao) {
        erroFormulario.textContent = mensagemValidacao;
        erroFormulario.hidden = false;
        return;
    }

    const dados = new FormData();
    if (campoCartaId.value) {
        dados.append('id', campoCartaId.value);
    }
    dados.append('nome_en', campoNomeEn.value.trim());
    dados.append('nome_pt', campoNomePt.value.trim());
    dados.append('card_game', campoCardGame.value);
    dados.append('edicao_id', campoEdicao.value);
    dados.append('edicao_nome', campoEdicao.options[campoEdicao.selectedIndex].textContent);
    dados.append('raridade', campoRaridade.value);

    if (campoImagem.files[0]) {
        dados.append('imagem', campoImagem.files[0]);
    }

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'Salvando...';

    try {
        const resposta = await fetch('api/cartas.php', { method: 'POST', body: dados });
        const retorno = await resposta.json();

        if (!resposta.ok) {
            erroFormulario.textContent = retorno.erro || 'Não foi possível salvar a carta.';
            erroFormulario.hidden = false;
            return;
        }

        fecharFormulario();
        mostrarAviso(campoCartaId.value ? 'Carta atualizada com sucesso.' : 'Carta incluída com sucesso.');
        carregarCartas();
    } catch (erro) {
        erroFormulario.textContent = 'Falha de conexão com o servidor.';
        erroFormulario.hidden = false;
    } finally {
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = 'Salvar';
    }
});

document.getElementById('botao-nova-carta').addEventListener('click', () => abrirFormulario());
document.getElementById('botao-cancelar').addEventListener('click', fecharFormulario);

modalFormulario.addEventListener('click', (evento) => {
    if (evento.target === modalFormulario) {
        fecharFormulario();
    }
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !modalFormulario.hidden) {
        fecharFormulario();
    }
});
