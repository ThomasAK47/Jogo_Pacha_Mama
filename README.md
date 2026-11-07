# Quiz Pachamama – Desastres Naturais

Jogo de perguntas para turmas que visitam o **Espaço Pachamama (UFSM)**. Ensina
prevenção de desastres naturais comuns no Rio Grande do Sul com uma roleta na
tela, um mapa impresso com trilhas e plaquinhas de resposta.

- Funciona **sem internet**: basta abrir o arquivo `index.html`.
- Não precisa instalar nada.
- Um computador só, operado pela professora (de preferência ligado a um projetor).

> **Jogar online:** depois de ativar o GitHub Pages (veja
> [Publicar no GitHub Pages](#publicar-no-github-pages)), o endereço é
> **https://thomasak47.github.io/Jogo_Pacha_Mama/**

---

## Sumário

1. [Como o jogo funciona](#como-o-jogo-funciona)
2. [Abrir o jogo](#abrir-o-jogo)
3. [Material para imprimir](#material-para-imprimir)
4. [Durante a partida](#durante-a-partida)
5. [Configurações](#configurações)
6. [Como editar as perguntas](#como-editar-as-perguntas)
7. [Como mudar regras, textos e cores](#como-mudar-regras-textos-e-cores)
8. [Como testar depois de editar](#como-testar-depois-de-editar)
9. [Publicar no GitHub Pages](#publicar-no-github-pages)
10. [Arquivos do projeto](#arquivos-do-projeto)
11. [Problemas comuns](#problemas-comuns)

---

## Como o jogo funciona

- A turma é dividida em **quatro equipes**: Vermelha, Azul, Verde e Amarela.
- Cada equipe tem uma **trilha de 10 casas** no mapa impresso, da baixada até a
  escola no topo do morro. O mapa é o placar: a página do jogo não guarda a
  posição das equipes.
- Cada equipe tem **plaquinhas** com letra e forma: **A ▲, B ●, C ■, D ★**.
  As formas ajudam quem ainda não lê.
- **Níveis:** Infantil (2 opções), Intermediário (3) e Adulto (4).
- **Temas da roleta:** Inundações, Deslizamentos, Estiagem, Vendaval e Granizo,
  Mapas e Satélites, Mochila de Emergência.
- **Rodada de alerta:** de vez em quando, a roleta "se transforma" e aparece um
  alerta de desastre (inundação, temporal, deslizamento, tornado ou estiagem)
  com uma regra especial. O alerta nunca cai nas rodadas 1 e 2, nunca em duas
  rodadas seguidas e acontece pelo menos uma vez até a rodada 6.

---

## Abrir o jogo

**Sem internet (recomendado para a sala):**

1. No GitHub, clique no botão verde **Code** → **Download ZIP**.
2. Descompacte a pasta no computador (ou num pendrive).
3. Dê dois cliques em **`index.html`**. Ele abre no navegador (Chrome, Edge ou Firefox).

**Online:** abra o endereço do GitHub Pages (veja acima).

Dica: aperte **F** para tela cheia antes de começar.

---

## Material para imprimir

Na tela inicial do jogo, embaixo, há os links **Plaquinhas** e **Mapa com as trilhas**.

**Mapa** (`mapa.html`): escolha o papel e clique em **Imprimir**.

| Papel | Folha (cm) | Casa da trilha | Onde imprimir |
| --- | --- | --- | --- |
| A4 | 29,7 × 21 | 1,3 cm | Impressora comum |
| A3 | 42 × 29,7 | 1,9 cm | Impressora A3 |
| A2 | 59,4 × 42 | 2,6 cm | Gráfica (plotter) |
| A1 | 84,1 × 59,4 | 3,7 cm | Gráfica (plotter) |
| A0 | 118,9 × 84,1 | 5,3 cm | Gráfica (plotter) |

- **A2, A1 e A0:** na janela de impressão, escolha **"Salvar como PDF"** como
  destino e leve o arquivo a uma gráfica. Peça para imprimir em **tamanho real**,
  sem "ajustar à página".
- Use peças menores que a casa: botão ou feijão do A4 ao A2; tampinha de garrafa
  (cerca de 3 cm) no A1 e no A0.
- Os **pontos 1 a 5** do mapa aparecem nas perguntas com "OLHEM O MAPA":

| Ponto | Desenho | O que representa |
| --- | --- | --- |
| 1 | Casa na beira do rio | Risco de inundação |
| 2 | Casa na encosta íngreme | Risco de deslizamento |
| 3 | Linha de alta tensão sobre árvores | Perigo no vendaval e nos raios |
| 4 | Açude quase seco e lavoura | Estiagem |
| 5 | Escola no topo do morro | Abrigo e ponto de encontro |

**Plaquinhas** (`plaquinhas.html`): escolha o nível (quantas opções), as
equipes, quantas por folha A4 (1, 2 ou 4) e se quer a versão que gasta menos
tinta. Imprima colorido: a cor da borda mostra a equipe.

Em qualquer impressão, deixe a escala em **100%** (ou "Tamanho real").

---

## Durante a partida

1. Na tela inicial, escolha o **nível**.
2. Clique em **GIRAR**. A roleta sorteia o tema e a pergunta abre sozinha.
   - Se aparecer um **alerta**, leia a regra especial e clique em **GIRAR A ROLETA**.
3. Leia a pergunta e as opções em voz alta. Se aparecer **"OLHEM O MAPA"**, as
   equipes procuram os pontos no mapa.
   - Pergunta inadequada para a turma? Use **Trocar pergunta**, na barra do topo.
4. Dê tempo para as equipes conversarem (não há cronômetro).
5. Clique em **REVELAR RESPOSTA**. Na contagem **"3, 2, 1, LEVANTEM!"**, todas
   as equipes levantam a plaquinha juntas.
6. A certa fica verde e aparece o **"Por quê?"**. Leia e converse com a turma.
7. Mova as peças no mapa e clique em **PRÓXIMA**.

**Para outra turma:** botão **Início** → escolha o nível → confirme "nova
partida". Isso zera as perguntas usadas.

**Recarregou a página sem querer?** O botão **Continuar partida** volta
exatamente onde estava.

**Atalhos de teclado (opcionais):**

| Tecla | O que faz |
| --- | --- |
| ESPAÇO | Girar / próxima |
| ENTER | Revelar a resposta |
| M | Liga e desliga o som |
| F | Tela cheia |
| R | Reiniciar a partida (pede confirmação) |
| ESC | Volta à tela inicial (em tela cheia, o 1º ESC só sai da tela cheia) |

---

## Configurações

Botão **Configurações** na tela inicial. O que for escolhido fica salvo no navegador.

- **Alerta de desastre:** ligado ou desligado.
  - **Sorteio em cada rodada:** chance de 5% a 100% (padrão 20%).
  - **A cada N rodadas:** de 3 em 3 até de 6 em 6.
- **Contagem "3, 2, 1, LEVANTEM!"** antes de revelar: ligada ou desligada.
- **Som:** ligado ou desligado, com o botão **Testar som**.
- **Zerar perguntas usadas:** libera de novo as perguntas que já saíram.
- **Restaurar padrões:** volta tudo para os valores do arquivo `config.js`.

---

## Como editar as perguntas

As perguntas ficam no arquivo **`perguntas.js`**. Abra com um editor de texto
simples (Bloco de Notas, Notepad++, VS Code) **ou edite direto no GitHub**
(veja abaixo).

**Modelo de pergunta** (também está no topo do arquivo):

```js
{
  id: "INF-INU-99",
  nivel: "infantil",
  tema: "inundacoes",
  pergunta: "Texto da pergunta?",
  opcoes: ["Primeira opção", "Segunda opção"],
  correta: "A",
  explicacao: "Por que a resposta certa é a certa, em uma ou duas frases."
},
```

**O que é cada campo:**

| Campo | O que colocar |
| --- | --- |
| `id` | Um código **único** (não pode repetir). Sugestão: NÍVEL-TEMA-NÚMERO, como `"INT-DES-07"` |
| `nivel` | `"infantil"`, `"intermediario"` ou `"adulto"` |
| `tema` | `"inundacoes"`, `"deslizamentos"`, `"estiagem"`, `"vendaval"`, `"mapas"` ou `"mochila"` |
| `pergunta` | O enunciado que a professora lê em voz alta |
| `opcoes` | As opções entre colchetes `[ ]`: **2** no Infantil, **3** no Intermediário, **4** no Adulto |
| `correta` | A **letra** da opção certa: `"A"`, `"B"`, `"C"` ou `"D"` (a primeira opção é a A) |
| `explicacao` | Texto curto que aparece depois de revelar |
| `pontosMapa` | **Opcional.** Só para perguntas sobre o mapa impresso, por exemplo `["1", "5"]` |

**Cuidados que evitam erros:**

- Toda pergunta termina com `},` (chave e vírgula).
- Textos sempre entre aspas retas `"assim"`. Aspas dentro do texto: use as simples `'assim'`.
- Salve o arquivo em **UTF-8** (senão os acentos saem estranhos).
- Varie a posição da resposta certa.
- Textos curtos cabem melhor: pergunta até ~120 letras, opções até ~50,
  explicação até ~160.

**O jogo confere o arquivo sozinho.** Ao abrir, a tela inicial mostra:

- um **quadro amarelo** quando uma pergunta tem problema (por exemplo, "tem 3
  opções, mas o nível Adulto usa 4"). A pergunta com problema é pulada e o jogo
  continua;
- uma **caixa vermelha** quando há um erro de digitação que impede ler o arquivo
  (vírgula, aspas ou chave faltando). Aperte **F12**, abra a aba **Console** e
  veja o número da linha do erro.

**Editar direto no GitHub (sem baixar nada):**

1. No repositório, clique em **`perguntas.js`**.
2. Clique no **lápis** ("Edit this file"), no canto direito.
3. Faça a mudança.
4. Clique em **Commit changes…**, escreva uma frase dizendo o que mudou e
   confirme. Se o GitHub Pages estiver ligado, o site se atualiza em 1 a 3 minutos.

**Sobre o conteúdo:** as perguntas foram escritas como exemplo e estão marcadas
com `// REVISAR`. Depois de conferir uma pergunta, apague a marca dela.

---

## Como mudar regras, textos e cores

Tudo fica no arquivo **`config.js`**, com explicações em cada parte:

- **Regras da rodada de alerta** de cada nível (`evento.regras`).
- **Desastres do alerta**, com o título e a frase de cada um (`evento.tipos`).
  Para tirar um desastre do sorteio, apague a linha dele.
- **Nomes e cores dos temas** da roleta (`temas`).
- **Equipes** (nome e cor) e o número de casas da trilha (`equipes`, `casasNaTrilha`).
- **Valores padrão** das configurações (`padroes`).

Mude só o que está entre aspas ou os números, sem apagar vírgulas, chaves ou
colchetes. Depois de salvar, recarregue a página (F5). Se o navegador lembrar
de uma configuração antiga, use **Configurações → Restaurar padrões**.

---

## Como testar depois de editar

1. Salve o arquivo e abra (ou recarregue com F5) o `index.html`.
2. Veja se apareceu **quadro amarelo ou caixa vermelha** na tela inicial.
3. Abra **Configurações** e confira, em "Perguntas no banco", quantas perguntas
   cada nível tem.
4. Jogue algumas rodadas no nível que você mexeu.
5. Para ver o **alerta** logo: em Configurações, escolha **A cada N rodadas** =
   **3** e jogue até a rodada 3.

---

## Publicar no GitHub Pages

O repositório é público, então o GitHub Pages é gratuito.

1. Abra o repositório no GitHub e entre com a sua conta.
2. Clique em **Settings** (Configurações), na barra de abas do repositório.
3. No menu da esquerda, em **Code and automation**, clique em **Pages**.
4. Em **Build and deployment**:
   - **Source:** escolha **Deploy from a branch**;
   - **Branch:** escolha **main** e a pasta **/ (root)**;
   - clique em **Save**.
5. Espere de 1 a 3 minutos. O andamento aparece na aba **Actions**
   ("pages build and deployment"); verde = pronto.
6. Volte em **Settings → Pages**: aparece "Your site is live at…" com o endereço
   **https://thomasak47.github.io/Jogo_Pacha_Mama/**

**Depois disso:** cada mudança que entrar no ramo `main` atualiza o site sozinha
em 1 a 3 minutos. Se a página parecer antiga, recarregue com **Ctrl+F5**.

**Bom saber:**

- O endereço diferencia maiúsculas: é `Jogo_Pacha_Mama`.
- Qualquer pessoa com o link pode abrir o site.
- A versão online e a versão baixada guardam configurações e partida separadas
  no navegador.

---

## Arquivos do projeto

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | As telas do jogo |
| `estilo.css` | Cores, tamanhos e animações do jogo |
| `config.js` | Regras, textos, temas, equipes e valores padrão (para editar) |
| `perguntas.js` | O banco de perguntas (para editar) |
| `jogo.js` | O funcionamento do jogo e o verificador das perguntas |
| `roleta.js` | Desenho e giro da roleta, ícones e confete |
| `sons.js` | Sons criados pelo próprio navegador (sem arquivos de áudio) |
| `mapa.html`, `mapa.js`, `mapa.css` | Página para imprimir o mapa com as trilhas |
| `plaquinhas.html`, `plaquinhas.js`, `plaquinhas.css` | Página para imprimir as plaquinhas |
| `impressao.css` | Aparência comum às duas páginas de impressão |

O jogo usa só HTML, CSS e JavaScript, sem bibliotecas externas, e não envia
nenhum dado para a internet. As configurações e a partida em andamento ficam
salvas apenas no navegador do computador.

---

## Problemas comuns

| Problema | O que fazer |
| --- | --- |
| Tela inicial com caixa vermelha | Erro de digitação no `perguntas.js` ou no `config.js`. Aperte F12 → Console para ver a linha. |
| Acentos aparecem como símbolos estranhos | Salve o arquivo de novo em UTF-8. |
| Não sai som | Clique em qualquer lugar da página primeiro, confira se o som não está desligado (tecla M) e use Configurações → Testar som. |
| Uma pergunta nova não aparece | Veja se há quadro amarelo na tela inicial e se `nivel` e `tema` estão escritos como na tabela acima. |
| O mapa saiu menor ou cortado | Na janela de impressão, deixe a escala em 100% ("Tamanho real"). |
| O site mostra a versão antiga | Recarregue com Ctrl+F5 e espere alguns minutos depois de cada mudança. |

---

## Licença

Código sob a licença MIT (veja o arquivo `LICENSE`).
