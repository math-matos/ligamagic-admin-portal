const pilhaModais = [];

function empilharModal(fecharFn) {
    pilhaModais.push(fecharFn);
}

function desempilharModal(fecharFn) {
    const indice = pilhaModais.lastIndexOf(fecharFn);
    if (indice !== -1) {
        pilhaModais.splice(indice, 1);
    }
}

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && pilhaModais.length > 0) {
        pilhaModais[pilhaModais.length - 1]();
    }
});
