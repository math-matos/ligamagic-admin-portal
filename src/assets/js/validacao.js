function campoDe(controle) {
    return controle.closest('.campo');
}

function definirErroCampo(campo, mensagem) {
    if (!campo) return;
    campo.classList.add('invalido');
    let erro = campo.querySelector('.campo-erro');
    if (!erro) {
        erro = document.createElement('p');
        erro.className = 'campo-erro';
        erro.setAttribute('role', 'alert');
        campo.appendChild(erro);
    }
    erro.textContent = mensagem;
}

function limparErroCampo(campo) {
    if (!campo) return;
    campo.classList.remove('invalido');
    const erro = campo.querySelector('.campo-erro');
    if (erro) erro.remove();
}

function limparErrosDoForm(form) {
    form.querySelectorAll('.campo.invalido').forEach(limparErroCampo);
}

function mostrarErrosDeCampos(erros) {
    erros.forEach(({ controle, mensagem }) => definirErroCampo(campoDe(controle), mensagem));
}
