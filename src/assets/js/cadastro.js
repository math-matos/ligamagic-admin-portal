const formCadastro = document.getElementById('form-cadastro');
const erroCadastro = document.getElementById('erro-cadastro');
const botaoCriar = document.getElementById('botao-criar');

formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    erroCadastro.hidden = true;

    if (!nome || !usuario || !senha) {
        erroCadastro.textContent = 'Preencha todos os campos.';
        erroCadastro.hidden = false;
        return;
    }

    if (senha.length < 6) {
        erroCadastro.textContent = 'A senha deve ter ao menos 6 caracteres.';
        erroCadastro.hidden = false;
        return;
    }

    if (senha !== confirmarSenha) {
        erroCadastro.textContent = 'As senhas não coincidem.';
        erroCadastro.hidden = false;
        return;
    }

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

        window.location.href = 'cartas.html';
    } catch (erro) {
        erroCadastro.textContent = 'Falha de conexão com o servidor.';
        erroCadastro.hidden = false;
    } finally {
        botaoCriar.disabled = false;
        botaoCriar.textContent = 'Criar conta';
    }
});
