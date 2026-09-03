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

# TODO
- [ ] Separar depois o backend para um service no docker-compose.yml, para que o backend possa ser escalado separadamente do frontend.

# POSSIVEIS MELHORIAS
- [ ] Transferir os filtros de hardcoded para o backend, para que seja possível adicionar novos filtros sem precisar alterar o frontend.
- [ ] Melhorar a experiência do usuário com feedback visual durante as operações.
- [ ] Animações para transições entre páginas e ao entrar em uma pagina.
- [ ] Implementar paginação para a lista de cartas.
- [ ] Cadastro multiplo de cartas.
