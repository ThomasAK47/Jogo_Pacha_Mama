/* ==========================================================================
   PLAQUINHAS.JS — MONTA AS PLAQUINHAS PARA IMPRIMIR
   ==========================================================================

   As equipes (nome e cor) e quantas opções cada nível tem vêm do config.js.
   Para mudar uma cor ou um nome de equipe, edite o config.js: as plaquinhas
   e o mapa acompanham.

   Partes deste arquivo:
     1. Escolhas do painel
     2. Montagem das folhas
     3. Botões do painel
     4. Início
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. ESCOLHAS DO PAINEL
   -------------------------------------------------------------------------- */
var LETRAS = ["A", "B", "C", "D"];

var escolha = {
  opcoes: 4,         // 2 = Infantil (A, B) · 3 = Intermediário (A a C) · 4 = Adulto (A a D)
  equipe: "todas",   // "todas" ou o número da equipe na lista do config.js (0, 1, 2...)
  porFolha: 1,       // 1 = uma plaquinha por folha A4 · 2 = duas (meia folha cada)
  economia: false    // true = forma só com contorno, para gastar menos tinta
};


/* --------------------------------------------------------------------------
   2. MONTAGEM DAS FOLHAS
   -------------------------------------------------------------------------- */

/* Cria a forma (▲ ● ■ ★) grande de uma letra. */
function criarFormaGrande(letra) {
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "forma-grande");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");
  var uso = document.createElementNS(ns, "use");
  uso.setAttribute("href", "#forma-" + letra);
  svg.appendChild(uso);
  return svg;
}

/* Cria uma plaquinha: borda na cor da equipe, forma e letra no meio. */
function criarPlaquinha(equipe, letra) {
  var plaquinha = document.createElement("div");
  plaquinha.className = "plaquinha";
  plaquinha.style.setProperty("--cor", equipe.cor);

  var nome = document.createElement("span");
  nome.className = "nome-equipe" + (equipe.textoClaro ? " texto-claro" : "");
  nome.textContent = "EQUIPE " + equipe.nome.toUpperCase();

  var marca = document.createElement("div");
  marca.className = "marca-plaquinha";
  var letraGrande = document.createElement("span");
  letraGrande.className = "letra-grande";
  letraGrande.textContent = letra;
  marca.appendChild(criarFormaGrande(letra));
  marca.appendChild(letraGrande);

  plaquinha.appendChild(nome);
  plaquinha.appendChild(marca);
  return plaquinha;
}

/* Lista as equipes escolhidas no painel. */
function equipesEscolhidas() {
  if (escolha.equipe === "todas") return CONFIG.equipes;
  return [CONFIG.equipes[escolha.equipe]];
}

/* Apaga as folhas e monta de novo, conforme as escolhas do painel. */
function montarFolhas() {
  var caixa = document.getElementById("folhas");
  caixa.innerHTML = "";
  caixa.classList.toggle("economia", escolha.economia);

  // Lista de todas as plaquinhas, equipe por equipe (A, B, C... de cada uma)
  var plaquinhas = [];
  var equipes = equipesEscolhidas();
  for (var e = 0; e < equipes.length; e++) {
    for (var l = 0; l < escolha.opcoes; l++) {
      plaquinhas.push(criarPlaquinha(equipes[e], LETRAS[l]));
    }
  }

  // Distribui nas folhas (1 ou 2 por folha)
  var folha = null;
  for (var p = 0; p < plaquinhas.length; p++) {
    if (p % escolha.porFolha === 0) {
      folha = document.createElement("div");
      folha.className = "folha retrato de-plaquinhas" + (escolha.porFolha === 2 ? " duas" : "");
      caixa.appendChild(folha);
    } else {
      var corte = document.createElement("div");
      corte.className = "linha-corte";
      corte.textContent = "✂ cortar aqui";
      folha.appendChild(corte);
    }
    folha.appendChild(plaquinhas[p]);
  }

  var folhas = caixa.children.length;
  document.getElementById("resumo").textContent =
    plaquinhas.length + (plaquinhas.length === 1 ? " plaquinha em " : " plaquinhas em ") +
    folhas + (folhas === 1 ? " folha A4" : " folhas A4");
}


/* --------------------------------------------------------------------------
   3. BOTÕES DO PAINEL
   Cada grupo é uma fileira de botões; só um fica marcado de cada vez.
   -------------------------------------------------------------------------- */

/* Cria um grupo de botões. "itens" é uma lista de { texto, valor }. */
function criarGrupo(idCaixa, campo, itens) {
  var caixa = document.getElementById(idCaixa);
  caixa.className = "grupo-opcoes";
  var botoes = [];
  for (var i = 0; i < itens.length; i++) {
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao-impressao";
    botao.textContent = itens[i].texto;
    botao.setAttribute("data-valor", String(itens[i].valor));
    botao.addEventListener("click", (function (valor) {
      return function () {
        escolha[campo] = valor;
        marcarGrupo(botoes, valor);
        montarFolhas();
      };
    })(itens[i].valor));
    botoes.push(botao);
    caixa.appendChild(botao);
  }
  marcarGrupo(botoes, escolha[campo]);
}

function marcarGrupo(botoes, valor) {
  for (var i = 0; i < botoes.length; i++) {
    var marcado = botoes[i].getAttribute("data-valor") === String(valor);
    botoes[i].setAttribute("aria-pressed", marcado ? "true" : "false");
  }
}

/* Monta os botões do painel a partir do config.js. */
function montarPainel() {
  // Um botão por nível, com as letras que ele usa (ex.: "Infantil · A e B")
  var conjuntos = [];
  for (var chave in CONFIG.niveis) {
    var nivel = CONFIG.niveis[chave];
    var letras = LETRAS.slice(0, nivel.opcoes);
    var ultima = letras.pop();
    conjuntos.push({
      texto: nivel.nome + " · " + letras.join(", ") + " e " + ultima,
      valor: nivel.opcoes
    });
  }
  criarGrupo("op-conjunto", "opcoes", conjuntos);

  var equipes = [{ texto: "Todas", valor: "todas" }];
  for (var e = 0; e < CONFIG.equipes.length; e++) {
    equipes.push({ texto: CONFIG.equipes[e].nome, valor: e });
  }
  criarGrupo("op-equipes", "equipe", equipes);

  criarGrupo("op-tamanho", "porFolha", [
    { texto: "1 por folha (grande)", valor: 1 },
    { texto: "2 por folha (menor)", valor: 2 }
  ]);

  criarGrupo("op-tinta", "economia", [
    { texto: "Forma pintada", valor: false },
    { texto: "Economizar tinta (só contorno)", valor: true }
  ]);

  document.getElementById("botao-imprimir").addEventListener("click", function () {
    window.print();
  });
}


/* --------------------------------------------------------------------------
   4. INÍCIO
   -------------------------------------------------------------------------- */
montarPainel();
montarFolhas();
