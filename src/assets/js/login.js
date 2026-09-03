const formLogin = document.getElementById('form-login');
const erroLogin = document.getElementById('erro-login');
const botaoEntrar = document.getElementById('botao-entrar');

formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;

    erroLogin.hidden = true;

    if (!usuario || !senha) {
        erroLogin.textContent = 'Preencha usuário e senha.';
        erroLogin.hidden = false;
        return;
    }

    botaoEntrar.disabled = true;
    botaoEntrar.textContent = 'Entrando...';

    try {
        const resposta = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            erroLogin.textContent = dados.erro || 'Não foi possível entrar.';
            erroLogin.hidden = false;
            return;
        }

        window.location.href = 'home.html';
    } catch (erro) {
        erroLogin.textContent = 'Falha de conexão com o servidor.';
        erroLogin.hidden = false;
    } finally {
        botaoEntrar.disabled = false;
        botaoEntrar.textContent = 'Entrar';
    }
});
