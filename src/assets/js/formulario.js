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
let raridadePendente = null;

const TIPOS_IMAGEM_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAX_IMAGEM = 5 * 1024 * 1024;
const MAX_CARACTERES_NOME = 30;

Object.entries(NOMES_JOGOS).forEach(([valor, nome]) => {
    campoCardGame.add(new Option(nome, valor));
});

function limparTodosErros() {
    limparErrosDoForm(formCarta);
    erroFormulario.hidden = true;
}

function focarControle(controle) {
    if (controle === campoImagem) {
        const campo = campoDe(controle);
        if (campo) campo.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
    }
    if (controle.tagName === 'SELECT') {
        const gatilho = controle.parentNode.querySelector('.selecao-gatilho');
        if (gatilho) {
            gatilho.focus();
            return;
        }
    }
    controle.focus();
}

function validarImagem(arquivo) {
    if (!TIPOS_IMAGEM_ACEITOS.includes(arquivo.type)) {
        return 'Formato inválido. Envie PNG, JPG ou WEBP.';
    }
    if (arquivo.size > TAMANHO_MAX_IMAGEM) {
        return 'A imagem deve ter no máximo 5 MB.';
    }
    return null;
}

function abrirFormulario(carta = null) {
    formCarta.reset();
    campoCartaId.value = '';
    limparTodosErros();
    previaImagem.hidden = true;
    previaImagem.src = '';
    if (dropzoneTitulo) {
        dropzoneTitulo.textContent = dropzoneTituloPadrao;
    }
    resetarEdicoes();
    resetarRaridades();

    if (carta) {
        tituloFormulario.textContent = 'Editar Carta';
        campoCartaId.value = carta.id;
        campoNomeEn.value = carta.nome_en;
        campoNomePt.value = carta.nome_pt || '';
        campoCardGame.value = carta.card_game;

        if (typeof sincronizarSelecoes === 'function') {
            sincronizarSelecoes();
        }

        if (carta.imagem) {
            previaImagem.src = carta.imagem;
            previaImagem.hidden = false;
        }

        edicaoPendente = carta.edicao_id;
        raridadePendente = carta.raridade;
        carregarEdicoes(carta.card_game);
        carregarRaridades(carta.card_game);
    } else {
        tituloFormulario.textContent = 'Nova Carta';
    }

    modalFormulario.hidden = false;
    campoNomeEn.focus();
    empilharModal(fecharFormulario);
}

function fecharFormulario() {
    modalFormulario.hidden = true;
    desempilharModal(fecharFormulario);
}

function resetarEdicoes() {
    campoEdicao.disabled = true;
    campoEdicao.innerHTML = '<option value="">Selecione um Card Game primeiro</option>';
}

function resetarRaridades() {
    campoRaridade.disabled = true;
    campoRaridade.innerHTML = '<option value="">Selecione um Card Game primeiro</option>';
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
        dados.edicoes.forEach((edicao) => campoEdicao.add(new Option(edicao.name, edicao.id)));

        campoEdicao.disabled = false;

        if (edicaoPendente) {
            campoEdicao.value = edicaoPendente;
            edicaoPendente = null;
        }
    } catch (erro) {
        campoEdicao.innerHTML = '<option value="">Erro ao carregar edições</option>';
    }
}

async function carregarRaridades(jogo) {
    campoRaridade.disabled = true;
    campoRaridade.innerHTML = '<option value="">Carregando raridades...</option>';

    try {
        const resposta = await fetch(`api/raridades.php?jogo=${encodeURIComponent(jogo)}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            campoRaridade.innerHTML = '<option value="">Erro ao carregar raridades</option>';
            return;
        }

        campoRaridade.innerHTML = '<option value="">Selecione...</option>';
        dados.raridades.forEach((raridade) => campoRaridade.add(new Option(raridade, raridade)));

        campoRaridade.disabled = false;

        if (raridadePendente) {
            campoRaridade.value = raridadePendente;
            raridadePendente = null;
        }
    } catch (erro) {
        campoRaridade.innerHTML = '<option value="">Erro ao carregar raridades</option>';
    }
}

campoCardGame.addEventListener('change', () => {
    edicaoPendente = null;
    raridadePendente = null;

    limparErroCampo(campoDe(campoCardGame));
    limparErroCampo(campoDe(campoEdicao));
    limparErroCampo(campoDe(campoRaridade));

    if (campoCardGame.value) {
        carregarEdicoes(campoCardGame.value);
        carregarRaridades(campoCardGame.value);
    } else {
        resetarEdicoes();
        resetarRaridades();
    }
});

campoNomeEn.addEventListener('input', () => limparErroCampo(campoDe(campoNomeEn)));
campoNomePt.addEventListener('input', () => limparErroCampo(campoDe(campoNomePt)));
campoEdicao.addEventListener('change', () => limparErroCampo(campoDe(campoEdicao)));
campoRaridade.addEventListener('change', () => limparErroCampo(campoDe(campoRaridade)));

const dropzone = document.querySelector('.dropzone');
const dropzoneTitulo = document.querySelector('.dropzone-texto strong');
const dropzoneTituloPadrao = dropzoneTitulo ? dropzoneTitulo.textContent : '';

function mostrarPreviaImagem() {
    const arquivo = campoImagem.files[0];
    const campo = campoDe(campoImagem);

    if (arquivo) {
        const mensagem = validarImagem(arquivo);
        if (mensagem) {
            definirErroCampo(campo, mensagem);
            previaImagem.hidden = true;
            previaImagem.src = '';
            if (dropzoneTitulo) {
                dropzoneTitulo.textContent = dropzoneTituloPadrao;
            }
            return;
        }

        limparErroCampo(campo);
        previaImagem.src = URL.createObjectURL(arquivo);
        previaImagem.hidden = false;
        if (dropzoneTitulo) {
            dropzoneTitulo.textContent = arquivo.name;
        }
    } else if (dropzoneTitulo) {
        dropzoneTitulo.textContent = dropzoneTituloPadrao;
    }
}

campoImagem.addEventListener('change', mostrarPreviaImagem);

if (dropzone) {
    const impedirPadrao = (evento) => {
        evento.preventDefault();
        evento.stopPropagation();
    };

    ['dragenter', 'dragover'].forEach((tipo) => {
        dropzone.addEventListener(tipo, (evento) => {
            impedirPadrao(evento);
            dropzone.classList.add('arrastando');
        });
    });

    ['dragleave', 'dragend'].forEach((tipo) => {
        dropzone.addEventListener(tipo, (evento) => {
            impedirPadrao(evento);
            dropzone.classList.remove('arrastando');
        });
    });

    dropzone.addEventListener('drop', (evento) => {
        impedirPadrao(evento);
        dropzone.classList.remove('arrastando');

        const arquivo = evento.dataTransfer.files[0];
        if (!arquivo) return;

        const mensagem = validarImagem(arquivo);
        if (mensagem) {
            definirErroCampo(campoDe(campoImagem), mensagem);
            return;
        }

        const transferencia = new DataTransfer();
        transferencia.items.add(arquivo);
        campoImagem.files = transferencia.files;

        mostrarPreviaImagem();
    });
}

function validarFormulario() {
    const erros = [];

    if (!campoNomeEn.value.trim()) {
        erros.push({ controle: campoNomeEn, mensagem: 'Informe o nome da carta em inglês.' });
    } else if (campoNomeEn.value.trim().length > MAX_CARACTERES_NOME) {
        erros.push({ controle: campoNomeEn, mensagem: `O nome deve ter no máximo ${MAX_CARACTERES_NOME} caracteres.` });
    }
    if (campoNomePt.value.trim().length > MAX_CARACTERES_NOME) {
        erros.push({ controle: campoNomePt, mensagem: `O nome deve ter no máximo ${MAX_CARACTERES_NOME} caracteres.` });
    }
    if (!campoCardGame.value) {
        erros.push({ controle: campoCardGame, mensagem: 'Selecione o card game.' });
    }
    if (!campoEdicao.value) {
        erros.push({ controle: campoEdicao, mensagem: 'Selecione a edição da carta.' });
    }
    if (!campoRaridade.value) {
        erros.push({ controle: campoRaridade, mensagem: 'Selecione a raridade da carta.' });
    }

    const arquivo = campoImagem.files[0];
    if (arquivo) {
        const mensagem = validarImagem(arquivo);
        if (mensagem) {
            erros.push({ controle: campoImagem, mensagem });
        }
    } else if (!campoCartaId.value) {
        erros.push({ controle: campoImagem, mensagem: 'Selecione a imagem da carta.' });
    }

    return erros;
}

formCarta.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limparTodosErros();

    const erros = validarFormulario();

    if (erros.length) {
        erros.forEach(({ controle, mensagem }) => definirErroCampo(campoDe(controle), mensagem));
        focarControle(erros[0].controle);
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
document.getElementById('botao-vazio-nova-carta').addEventListener('click', () => abrirFormulario());
document.getElementById('botao-cancelar').addEventListener('click', fecharFormulario);

modalFormulario.addEventListener('click', (evento) => {
    if (evento.target === modalFormulario) {
        fecharFormulario();
    }
});
