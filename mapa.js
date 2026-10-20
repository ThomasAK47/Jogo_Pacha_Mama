/* ==========================================================================
   MAPA.JS — DESENHA O MAPA E AS TRILHAS PARA IMPRIMIR
   ==========================================================================

   O mapa mostra um morro visto de cima, com curvas de nível, e um rio
   embaixo. Os pontos 1 a 4 são os que as perguntas citam (perguntas.js):
     - Ponto 1: beira do rio (o lugar mais baixo)
     - Ponto 2: baixada (terreno plano e baixo, perto do rio)
     - Ponto 3: topo do morro (alto e plano)
     - Ponto 4: encosta íngreme (curvas de nível bem juntas)
   Se mudar um ponto de lugar aqui, confira as perguntas de mapa.

   As trilhas (uma por equipe) usam os nomes, as cores e o número de casas
   do config.js.

   Partes deste arquivo:
     1. Desenho do morro, do rio e dos pontos
     2. Trilhas das equipes
     3. Papel A4 ou A3
     4. Início
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. DESENHO DO MORRO, DO RIO E DOS PONTOS
   O desenho usa coordenadas de 0 a 700 (largura) e de 0 a 620 (altura).
   -------------------------------------------------------------------------- */
var NS = "http://www.w3.org/2000/svg";

// Onde fica cada ponto das perguntas (x, y no desenho)
var PONTOS_DO_MAPA = [
  { numero: "1", x: 175, y: 533 },   // beira do rio
  { numero: "2", x: 520, y: 492 },   // baixada
  { numero: "3", x: 365, y: 205 },   // topo do morro
  { numero: "4", x: 365, y: 94 }     // encosta íngreme (lado de cima do morro)
];

// Cores do terreno, da parte mais baixa (fora do morro) até o topo
var COR_BAIXADA = "#edf3da";
var CORES_DO_MORRO = ["#e4ebc8", "#e0e2b8", "#dcd8a9", "#d8cd9a", "#d3c18b", "#cdb67e"];
var COR_CURVA = "#8b5a2b";
var QUANTAS_CURVAS = 6;   // cada curva = 10 metros a mais

/* Cria um elemento do desenho com os atributos dados. */
function criar(tipo, atributos, pai) {
  var elemento = document.createElementNS(NS, tipo);
  for (var nome in atributos) elemento.setAttribute(nome, atributos[nome]);
  if (pai) pai.appendChild(elemento);
  return elemento;
}

/* Medidas da curva de nível número k (0 = a de baixo, a maior).
   Do lado de cima (norte) as curvas ficam a 12 de distância: encosta
   íngreme. Do lado de baixo (sul, perto do rio) ficam a 40: encosta suave. */
function medidasDaCurva(k) {
  var oeste = 90 + 35 * k, leste = 640 - 35 * k;
  var norte = 70 + 12 * k, sul = 470 - 40 * k;
  return {
    cx: (oeste + leste) / 2, cy: (norte + sul) / 2,
    rx: (leste - oeste) / 2, ry: (sul - norte) / 2
  };
}

/* Um pouco de ondulação para o morro não ficar uma elipse perfeita.
   É a mesma para todas as curvas, então elas nunca se cruzam. */
function ondulacao(angulo) {
  return 1 + 0.035 * Math.sin(3 * angulo + 0.6) + 0.025 * Math.sin(5 * angulo + 1.9);
}

/* Ponto da curva k no ângulo dado (0 = leste, PI/2 = sul). */
function pontoDaCurva(k, angulo) {
  var m = medidasDaCurva(k), f = ondulacao(angulo);
  return {
    x: m.cx + m.rx * Math.cos(angulo) * f,
    y: m.cy + m.ry * Math.sin(angulo) * f
  };
}

/* Caminho fechado da curva k. */
function caminhoDaCurva(k) {
  var partes = [];
  var passos = 120;
  for (var i = 0; i < passos; i++) {
    var p = pontoDaCurva(k, (i / passos) * 2 * Math.PI);
    partes.push((i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1));
  }
  return partes.join(" ") + " Z";
}

/* Altura do meio do rio em cada x (o rio passa embaixo, fazendo curvas). */
function meioDoRio(x) {
  return 568 + 14 * Math.sin(x / 90) + 6 * Math.sin(x / 37 + 1);
}
var LARGURA_DO_RIO = 46;

function desenharRio(svg) {
  var cima = [], baixo = [];
  for (var x = -10; x <= 710; x += 10) {
    var meio = meioDoRio(x);
    // o rio fica um pouco mais largo para a direita
    var metade = LARGURA_DO_RIO / 2 + x * 0.01;
    cima.push(x + " " + (meio - metade).toFixed(1));
    baixo.unshift(x + " " + (meio + metade).toFixed(1));
  }
  criar("path", {
    d: "M" + cima.join(" L") + " L" + baixo.join(" L") + " Z",
    fill: "#5aa9e6", stroke: "#1f6fa8", "stroke-width": 2.5
  }, svg);
  // Ondinhas na água
  var ondas = criar("g", { fill: "none", stroke: "#ffffff", "stroke-width": 2, "stroke-linecap": "round", opacity: 0.8 }, svg);
  var lugares = [40, 150, 270, 400, 520, 640];
  for (var i = 0; i < lugares.length; i++) {
    var ox = lugares[i], oy = meioDoRio(ox) + (i % 2 ? 8 : -6);
    criar("path", { d: "M" + ox + " " + oy + " q8 -6 16 0 t16 0" }, ondas);
  }
  var nome = criar("text", {
    x: 600, y: meioDoRio(600) + 8, "font-size": 24, "font-style": "italic",
    "font-weight": "bold", fill: "#0e4a73", "text-anchor": "middle"
  }, svg);
  nome.textContent = "Rio";
}

/* Árvore pequena vista de cima (copa redonda). */
function desenharArvore(grupo, x, y, r) {
  criar("circle", { cx: x, cy: y, r: r, fill: "#4f9a4a", stroke: "#2f6b2c", "stroke-width": 1.5 }, grupo);
  criar("circle", { cx: x - r * 0.3, cy: y - r * 0.3, r: r * 0.35, fill: "#7cbf6e" }, grupo);
}

function desenharMata(svg) {
  var grupo = criar("g", {}, svg);
  // Mata na beira do rio (mata ciliar), longe do ponto 1
  var beira = [300, 335, 370, 405, 440, 600, 640, 680, 20, 55];
  for (var i = 0; i < beira.length; i++) {
    desenharArvore(grupo, beira[i], meioDoRio(beira[i]) - 40 + (i % 2) * 6, 10 + (i % 3) * 2);
  }
  // Mata na encosta suave
  var encosta = [[150, 330], [175, 360], [140, 390], [585, 345], [610, 380], [560, 395]];
  for (var j = 0; j < encosta.length; j++) {
    desenharArvore(grupo, encosta[j][0], encosta[j][1], 11 + (j % 2) * 2);
  }
}

function desenharMorro(svg) {
  // Cores do terreno (da curva de baixo para a de cima)
  for (var k = 0; k < QUANTAS_CURVAS; k++) {
    criar("path", { d: caminhoDaCurva(k), fill: CORES_DO_MORRO[k] }, svg);
  }
  // Linhas das curvas de nível
  for (var c = 0; c < QUANTAS_CURVAS; c++) {
    criar("path", {
      d: caminhoDaCurva(c), fill: "none", stroke: COR_CURVA,
      "stroke-width": c === QUANTAS_CURVAS - 1 ? 3 : 2
    }, svg);
  }
  // Altura de cada curva, escrita do lado da encosta suave
  for (var n = 0; n < QUANTAS_CURVAS; n++) {
    var p = pontoDaCurva(n, 0.62 * Math.PI);
    var rotulo = criar("text", {
      x: p.x.toFixed(1), y: (p.y + 5).toFixed(1), "font-size": 14, "font-weight": "bold",
      fill: COR_CURVA, "text-anchor": "middle",
      stroke: CORES_DO_MORRO[n], "stroke-width": 5, "paint-order": "stroke"
    }, svg);
    rotulo.textContent = (n + 1) * 10 + " m";
  }
}

/* Rosa dos ventos simples: só o norte. */
function desenharNorte(svg) {
  var g = criar("g", { transform: "translate(660 50)" }, svg);
  criar("polygon", { points: "0,-28 11,8 0,1 -11,8", fill: "#1a1a1a" }, g);
  var n = criar("text", { x: 0, y: 30, "font-size": 20, "font-weight": "bold", "text-anchor": "middle", fill: "#1a1a1a" }, g);
  n.textContent = "N";
}

function desenharPontos(svg) {
  for (var i = 0; i < PONTOS_DO_MAPA.length; i++) {
    var ponto = PONTOS_DO_MAPA[i];
    var g = criar("g", {}, svg);
    criar("circle", { cx: ponto.x, cy: ponto.y, r: 17, fill: "#ffffff", stroke: "#1a1a1a", "stroke-width": 4 }, g);
    var t = criar("text", {
      x: ponto.x, y: ponto.y + 8, "font-size": 23, "font-weight": "bold",
      "text-anchor": "middle", fill: "#1a1a1a"
    }, g);
    t.textContent = ponto.numero;
  }
}

function desenharMapa() {
  var svg = document.getElementById("desenho-mapa");
  criar("rect", { x: 0, y: 0, width: 700, height: 620, fill: COR_BAIXADA }, svg);
  desenharMorro(svg);
  desenharRio(svg);
  desenharMata(svg);
  desenharNorte(svg);
  desenharPontos(svg);
}


/* --------------------------------------------------------------------------
   2. TRILHAS DAS EQUIPES
   Cada equipe tem uma coluna: começa no INÍCIO (embaixo) e sobe até a
   CHEGADA (em cima). A peça da equipe anda pelas casas.
   -------------------------------------------------------------------------- */

/* Bandeirinha da chegada. */
function criarBandeira() {
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("aria-hidden", "true");
  criar("rect", { x: 3, y: 2, width: 2, height: 17, fill: "#1a1a1a" }, svg);
  criar("path", { d: "M5 2 L18 6 L5 10 Z", fill: "#1a1a1a" }, svg);
  return svg;
}

function montarTrilhas() {
  var caixa = document.getElementById("trilhas");
  var casas = CONFIG.casasNaTrilha;
  for (var e = 0; e < CONFIG.equipes.length; e++) {
    var equipe = CONFIG.equipes[e];
    var trilha = document.createElement("div");
    trilha.className = "trilha";
    trilha.style.setProperty("--cor", equipe.cor);

    var nome = document.createElement("div");
    nome.className = "nome-trilha" + (equipe.textoClaro ? " texto-claro" : "");
    nome.textContent = equipe.nome;
    trilha.appendChild(nome);

    // De cima para baixo: a chegada, as outras casas e o início
    for (var n = casas; n >= 1; n--) {
      var casa = document.createElement("div");
      casa.className = "casa" + (n === casas ? " chegada" : "");
      if (n === casas) casa.appendChild(criarBandeira());
      casa.appendChild(document.createTextNode(String(n)));
      trilha.appendChild(casa);
    }

    var inicio = document.createElement("div");
    inicio.className = "inicio";
    inicio.textContent = "INÍCIO";
    trilha.appendChild(inicio);

    caixa.appendChild(trilha);
  }
}


/* --------------------------------------------------------------------------
   3. PAPEL A4 OU A3
   O desenho é o mesmo; no A3 tudo fica 1,414 vez maior.
   -------------------------------------------------------------------------- */
function escolherPapel(papel) {
  document.getElementById("tamanho-papel").textContent =
    "@page { size: " + papel + " landscape; margin: 8mm; }";
  document.getElementById("folha-mapa").classList.toggle("a3", papel === "A3");
  document.getElementById("papel-a4").setAttribute("aria-pressed", papel === "A4" ? "true" : "false");
  document.getElementById("papel-a3").setAttribute("aria-pressed", papel === "A3" ? "true" : "false");
}


/* --------------------------------------------------------------------------
   4. INÍCIO
   -------------------------------------------------------------------------- */
desenharMapa();
montarTrilhas();
document.getElementById("papel-a4").addEventListener("click", function () { escolherPapel("A4"); });
document.getElementById("papel-a3").addEventListener("click", function () { escolherPapel("A3"); });
document.getElementById("botao-imprimir").addEventListener("click", function () { window.print(); });
