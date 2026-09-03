# Portal Administrativo - Gestão de Cartas (LigaMagic)

## Como inicializar o projeto

Pré-requisito: ter o [Docker](https://www.docker.com/) instalado com o Docker Compose.

1. Clone o repositório:

```
git clone https://github.com/math-matos/ligamagic-admin-portal.git
cd ligamagic-admin-portal
```

2. Suba os containers:

```
docker-compose up -d
```

3. Acesse o Gerenciador de Cartas em: **http://localhost:8080**

## Credenciais de teste

- Usuário: admin
- Senha: admin123

============================================================================

## Decisões de UX/Produto

### 1. Layout minimalista e completo

Pensei em deixar o layout o mais limpo e direto possível, sem muita informação na tela pra nao perder o foco do objetivo principal: a tabela das cartas e o formulário de cadastro/edição. A ideia é que o usuário consiga realizar todas as operações sem precisar navegar por muitas telas pra conseguir preencher a carta dele.
Isso facilitando pra quem nao tem muito conhecimento técnico, agilizando o processo de cadastro e edição das cartas.

### 2. Organização das cartas

Resolvi organizar as cartas já separadas de acordo com seu tcg, aonde ele pode visualizar todas de uma vez mas o objetivo principal sendo ele selecionar o tcg primeiro e ai sim carregar as cartas daquele jogo, evitando que o usuário fique perdido com muitas cartas de jogos diferentes na tela.

### 3. Selects encadeados (Card Game → Edição → Raridade)

No filtro ao lado esquerdo (sidebar), deixei os selects para serem filtrados com base no jogo que escolher pra nao dar chance do usuario escolher uma edição ou raridade que nao existe para aquele jogo. Isso também se aplica no formulário de cadastro/edição, onde o usuário só consegue cadastrar uma carta com base no jogo que ele escolheu.

### 4. Feedback imediato e validação por campo

O formulário valida no cliente antes de enviar (nome, jogo, edição, raridade e imagem), mostra o erro
embaixo do campo específico pra não ter chance do usuario cadastrar errado ou tentar quebrar o layout.

============================================================================

# TODO

- [ ] Separar depois o backend para um service no docker-compose.yml, para que o backend possa ser escalado separadamente do frontend.

# POSSIVEIS MELHORIAS

- [ ] Transferir os filtros de hardcoded para o backend, para que seja possível adicionar novos filtros sem precisar alterar o frontend.
- [ ] Melhorar a experiência do usuário com feedback visual durante as operações.
- [ ] Animações para transições entre páginas e ao entrar em uma pagina.
- [ ] Implementar paginação para a lista de cartas.
- [ ] Cadastro multiplo de cartas.
