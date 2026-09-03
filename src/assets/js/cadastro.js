const formCadastro = document.getElementById('form-cadastro');
const erroCadastro = document.getElementById('erro-cadastro');
const botaoCriar = document.getElementById('botao-criar');

const campoNome = document.getElementById('nome');
const campoUsuario = document.getElementById('usuario');
const campoSenha = document.getElementById('senha');
const campoConfirmarSenha = document.getElementById('confirmar-senha');

function validarCadastro() {
    const erros = [];

    if (!campoNome.value.trim()) {
        erros.push({ controle: campoNome, mensagem: 'Informe seu nome.' });
    }
    if (!campoUsuario.value.trim()) {
        erros.push({ controle: campoUsuario, mensagem: 'Informe um usuário.' });
    }
    if (!campoSenha.value) {
        erros.push({ controle: campoSenha, mensagem: 'Crie uma senha.' });
    } else if (campoSenha.value.length < 6) {
        erros.push({ controle: campoSenha, mensagem: 'A senha deve ter ao menos 6 caracteres.' });
    }
    if (!campoConfirmarSenha.value) {
        erros.push({ controle: campoConfirmarSenha, mensagem: 'Confirme a senha.' });
    } else if (campoSenha.value && campoSenha.value !== campoConfirmarSenha.value) {
        erros.push({ controle: campoConfirmarSenha, mensagem: 'As senhas não coincidem.' });
    }

    return erros;
}

[campoNome, campoUsuario, campoSenha, campoConfirmarSenha].forEach((controle) => {
    controle.addEventListener('input', () => limparErroCampo(campoDe(controle)));
});

formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limparErrosDoForm(formCadastro);
    erroCadastro.hidden = true;

    const erros = validarCadastro();

    if (erros.length) {
        mostrarErrosDeCampos(erros);
        erros[0].controle.focus();
        return;
    }

    const nome = campoNome.value.trim();
    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value;

    botaoCriar.disabled = true;
    botaoCriar.textContent = 'Criando...';

    try {
        const resposta = await fetch('api/cadastro.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, usuario, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            erroCadastro.textContent = dados.erro || 'Não foi possível criar a conta.';
            erroCadastro.hidden = false;
            return;
        }

        window.location.href = 'home.html';
    } catch (erro) {
        erroCadastro.textContent = 'Falha de conexão com o servidor.';
        erroCadastro.hidden = false;
    } finally {
        botaoCriar.disabled = false;
        botaoCriar.textContent = 'Criar conta';
    }
});
