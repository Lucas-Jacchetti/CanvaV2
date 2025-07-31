
# Jogo de parkour 2D

Um jogo 2d simples e funcional em que foi utilizado o protocolo websockets, a fim de um primeiro contato com a tecnoogia.


## Funcionalidades

- Nome personalizado para cada jogador
- Movimentação 2d com pulo
- Ranking após passar pela linha de chegada
- Tempo cronometrado
- Botões de restart na interface e teclado

## Controles

- Setas para movimentação lateral
- Barra de espaço ou seta para cima para o pulo
- Enter para reiniciar (ou botão da interface)

## Na prática:

![App Screenshot](https://i.postimg.cc/Hs1YRBFn/imagem-2025-07-29-102501504.png)

![App Screenshot](https://i.postimg.cc/DypCmMFy/imagem-2025-07-29-102917238.png)


## Documentação da API

#### Retorna o top 10 do ranking

```http
  GET /ranking/topten
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `limite` | `string` | Retorna o top 10 do banco em ordem de tempo |





## Stack utilizada

**Front-end:** React, Websockets, TailwindCSS

**Back-end:** Node, Express, NestJS, Typescript, SQLite, Websockets, Prisma


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/Lucas-Jacchetti/CanvaV2
```

Entre no diretório do projeto

```bash
  cd backend
```

Instale as dependências

```bash
  npm install
```

Inicie o banco e compile o projeto

```bash
  npm run build
```

Inicie o servidor

```bash
  npm run start
```
Após isso basta carregar o Frontend pelo link

```bash
  https://canva-v2-beta.vercel.app
```
