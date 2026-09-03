(function () {
    const instancias = [];

    function criarSelecao(select) {
        const wrapper = document.createElement('div');
        wrapper.className = 'selecao';

        const gatilho = document.createElement('button');
        gatilho.type = 'button';
        gatilho.className = 'selecao-gatilho';
        gatilho.setAttribute('aria-haspopup', 'listbox');
        gatilho.setAttribute('aria-expanded', 'false');

        const rotuloEl = select.id ? document.querySelector(`label[for="${select.id}"]`) : null;
        if (rotuloEl) {
            gatilho.setAttribute('aria-label', rotuloEl.textContent.trim());
        }

        const valor = document.createElement('span');
        valor.className = 'selecao-valor';

        const seta = document.createElement('span');
        seta.className = 'selecao-seta';
        seta.setAttribute('aria-hidden', 'true');
        seta.innerHTML = ICONES.CHEVRON;

        gatilho.append(valor, seta);

        const lista = document.createElement('ul');
        lista.className = 'selecao-lista';
        lista.setAttribute('role', 'listbox');
        lista.hidden = true;

        select.parentNode.insertBefore(wrapper, select);
        wrapper.append(gatilho, lista, select);

        select.tabIndex = -1;

        const inst = { select, wrapper, gatilho, valor, lista, aberta: false, destacado: -1 };
        instancias.push(inst);

        gatilho.addEventListener('click', () => {
            if (select.disabled) return;
            inst.aberta ? fechar(inst) : abrir(inst);
        });
        gatilho.addEventListener('keydown', (evento) => aoTeclarGatilho(inst, evento));

        const observador = new MutationObserver(() => reconstruir(inst));
        observador.observe(select, {
            childList: true,
            attributes: true,
            attributeFilter: ['disabled']
        });

        select.addEventListener('change', () => atualizarRotulo(inst));

        reconstruir(inst);
        return inst;
    }

    function reconstruir(inst) {
        const { select, lista } = inst;
        lista.innerHTML = '';

        Array.from(select.options).forEach((opcao, indice) => {
            const item = document.createElement('li');
            item.className = 'selecao-opcao';
            item.setAttribute('role', 'option');
            item.dataset.indice = String(indice);
            if (!opcao.value) {
                item.classList.add('placeholder');
            }

            const texto = document.createElement('span');
            texto.className = 'selecao-opcao-texto';
            texto.textContent = opcao.textContent;

            const marca = document.createElement('span');
            marca.className = 'selecao-opcao-marca';
            marca.setAttribute('aria-hidden', 'true');
            marca.innerHTML = ICONES.CHECK;

            item.append(texto, marca);
            item.addEventListener('click', () => escolher(inst, indice));
            item.addEventListener('mousemove', () => destacar(inst, indice));

            lista.appendChild(item);
        });

        inst.wrapper.classList.toggle('desabilitada', select.disabled);
        inst.gatilho.disabled = select.disabled;
        atualizarRotulo(inst);
    }

    function atualizarRotulo(inst) {
        const { select, valor, lista } = inst;
        const opcao = select.options[select.selectedIndex];
        valor.textContent = opcao ? opcao.textContent : '';
        valor.classList.toggle('placeholder', !opcao || !opcao.value);

        lista.querySelectorAll('.selecao-opcao').forEach((item) => {
            const selecionada = Number(item.dataset.indice) === select.selectedIndex && !!select.value;
            item.classList.toggle('selecionada', selecionada);
            item.setAttribute('aria-selected', selecionada ? 'true' : 'false');
        });
    }

    function abrir(inst) {
        instancias.forEach((outra) => {
            if (outra !== inst) fechar(outra);
        });
        inst.aberta = true;
        inst.wrapper.classList.add('aberta');
        document.body.appendChild(inst.lista);
        inst.lista.hidden = false;
        inst.gatilho.setAttribute('aria-expanded', 'true');
        posicionar(inst);
        destacar(inst, inst.select.selectedIndex >= 0 ? inst.select.selectedIndex : 0);
        const ativo = inst.lista.querySelector('.destacada');
        if (ativo) ativo.scrollIntoView({ block: 'nearest' });

        inst.reposicionar = (evento) => {
            if (evento && evento.type === 'scroll' && inst.lista.contains(evento.target)) return;
            posicionar(inst);
        };
        window.addEventListener('scroll', inst.reposicionar, true);
        window.addEventListener('resize', inst.reposicionar);
    }

    function posicionar(inst) {
        const lista = inst.lista;
        const r = inst.gatilho.getBoundingClientRect();
        const margem = 8;
        const espaco = 6;
        const maxLista = 240;

        const espacoAbaixo = window.innerHeight - r.bottom - margem;
        const espacoAcima = r.top - margem;

        lista.style.maxHeight = 'none';
        const alturaConteudo = lista.scrollHeight;
        const paraCima = espacoAbaixo < Math.min(maxLista, alturaConteudo) && espacoAcima > espacoAbaixo;
        const espacoDisponivel = paraCima ? espacoAcima : espacoAbaixo;
        const altura = Math.min(maxLista, espacoDisponivel, alturaConteudo);

        lista.style.left = r.left + 'px';
        lista.style.right = 'auto';
        lista.style.width = r.width + 'px';
        lista.style.maxHeight = altura + 'px';
        lista.style.top = (paraCima ? r.top - espaco - altura : r.bottom + espaco) + 'px';
    }

    function fechar(inst) {
        if (!inst.aberta) return;
        inst.aberta = false;
        inst.wrapper.classList.remove('aberta');
        inst.lista.hidden = true;
        inst.wrapper.insertBefore(inst.lista, inst.select);
        inst.gatilho.setAttribute('aria-expanded', 'false');
        inst.lista.querySelectorAll('.destacada').forEach((item) => item.classList.remove('destacada'));
        inst.destacado = -1;

        if (inst.reposicionar) {
            window.removeEventListener('scroll', inst.reposicionar, true);
            window.removeEventListener('resize', inst.reposicionar);
            inst.reposicionar = null;
        }
    }

    function escolher(inst, indice) {
        const { select } = inst;
        if (select.selectedIndex !== indice) {
            select.selectedIndex = indice;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            atualizarRotulo(inst);
        }
        fechar(inst);
        inst.gatilho.focus();
    }

    function destacar(inst, indice) {
        inst.destacado = indice;
        inst.lista.querySelectorAll('.selecao-opcao').forEach((item, i) => {
            item.classList.toggle('destacada', i === indice);
        });
    }

    function mover(inst, passo) {
        const total = inst.select.options.length;
        if (!total) return;
        const base = inst.destacado >= 0 ? inst.destacado : inst.select.selectedIndex;
        const proximo = (base + passo + total) % total;
        destacar(inst, proximo);
        const alvo = inst.lista.children[proximo];
        if (alvo) alvo.scrollIntoView({ block: 'nearest' });
    }

    function aoTeclarGatilho(inst, evento) {
        switch (evento.key) {
            case 'Enter':
            case ' ':
                evento.preventDefault();
                if (inst.aberta && inst.destacado >= 0) {
                    escolher(inst, inst.destacado);
                } else {
                    abrir(inst);
                }
                break;
            case 'ArrowDown':
                evento.preventDefault();
                inst.aberta ? mover(inst, 1) : abrir(inst);
                break;
            case 'ArrowUp':
                evento.preventDefault();
                inst.aberta ? mover(inst, -1) : abrir(inst);
                break;
            case 'Escape':
                if (inst.aberta) {
                    evento.preventDefault();
                    evento.stopPropagation();
                    fechar(inst);
                }
                break;
            case 'Tab':
                fechar(inst);
                break;
        }
    }

    document.addEventListener('click', (evento) => {
        instancias.forEach((inst) => {
            if (inst.aberta &&
                !inst.wrapper.contains(evento.target) &&
                !inst.lista.contains(evento.target)) {
                fechar(inst);
            }
        });
    });

    function sincronizarSelecoes() {
        instancias.forEach((inst) => {
            inst.wrapper.classList.toggle('desabilitada', inst.select.disabled);
            inst.gatilho.disabled = inst.select.disabled;
            atualizarRotulo(inst);
        });
    }
    window.sincronizarSelecoes = sincronizarSelecoes;

    function inicializar() {
        document.querySelectorAll('select').forEach((select) => {
            if (!select.closest('.selecao')) {
                criarSelecao(select);
            }
        });
        document.querySelectorAll('form').forEach((form) => {
            form.addEventListener('reset', () => setTimeout(sincronizarSelecoes, 0));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
})();
