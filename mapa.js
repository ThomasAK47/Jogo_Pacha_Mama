/* ==========================================================================
   MAPA.JS — DESENHA O MAPA COM AS TRILHAS PARA IMPRIMIR
   ==========================================================================

   O mapa mostra um morro visto de cima, com curvas de nível, um rio
   embaixo e quatro trilhas coloridas (uma por equipe) que sobem do INÍCIO,
   na baixada, até a CHEGADA, no topo do morro.

   Os pontos 1 a 4 são os que as perguntas citam (perguntas.js):
     - Ponto 1: beira do rio (o lugar mais baixo)
     - Ponto 2: baixada (terreno plano e baixo, perto do rio)
     - Ponto 3: topo do morro (alto e plano)
     - Ponto 4: encosta íngreme (curvas de nível bem juntas)
   Se mudar um ponto de lugar aqui, confira as perguntas de mapa.

   Os nomes, as cores e o número de casas das trilhas vêm do config.js.

   Partes deste arquivo:
     1. Ajustes do desenho (pontos, trilhas, cores)
     2. Ferramentas de desenho
     3. Terreno: morro, curvas de nível e rio
     4. Trilhas das equipes
     5. Enfeites: árvores, flores, pedras, bichos
     6. Pontos das perguntas, título e norte
     7. Papel A4 ou A3
     8. Início
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. AJUSTES DO DESENHO
   O desenho usa coordenadas de 0 a 1000 (largura) e de 0 a 640 (altura).
   -------------------------------------------------------------------------- */
var LARGURA = 1000, ALTURA = 640;

// Onde fica cada ponto das perguntas (x, y no desenho)
var PONTOS_DO_MAPA = [
  { numero: "1", x: 95,  y: 545 },   // beira do rio
  { numero: "2", x: 928, y: 532 },   // baixada
  { numero: "3", x: 500, y: 178 },   // topo do morro
  { numero: "4", x: 500, y: 70 }     // encosta íngreme (lado de cima do morro)
];

// Caminho de cada trilha: do INÍCIO (primeiro par) até a CHEGADA (último).
// Uma trilha para cada equipe do config.js, na mesma ordem.
var CAMINHOS_DAS_TRILHAS = [
  [[220, 550], [110, 455], [140, 330], [255, 250], [405, 180]],
  [[325, 555], [460, 530], [445, 458], [310, 425], [350, 335], [450, 255]],
  [[675, 555], [540, 530], [555, 458], [690, 425], [650, 335], [550, 255]],
  [[780, 550], [890, 455], [860, 330], [745, 250], [595, 180]]
];

// Cores do terreno, da baixada (fora do morro) até o topo
var COR_BAIXADA = "#e3f0c4";
var CORES_DO_MORRO = ["#d5e8ad", "#c9df9a", "#d9d98f", "#e2cf86", "#dcbd77", "#d3ab69"];
var COR_CURVA = "#7a4b22";
var QUANTAS_CURVAS = 6;   // cada curva = 10 metros a mais


/* --------------------------------------------------------------------------
   2. FERRAMENTAS DE DESENHO
   -------------------------------------------------------------------------- */
var NS = "http://www.w3.org/2000/svg";

/* Cria um elemento do desenho com os atributos dados. */
function criar(tipo, atributos, pai) {
  var elemento = document.createElementNS(NS, tipo);
  for (var nome in atributos) elemento.setAttribute(nome, atributos[nome]);
  if (pai) pai.appendChild(elemento);
  return elemento;
}

/* Escreve um texto no desenho. */
function escrever(pai, texto, x, y, atributos) {
  var t = criar("text", { x: x, y: y, "text-anchor": "middle" }, pai);
  for (var nome in atributos) t.setAttribute(nome, atributos[nome]);
  t.textContent = texto;
  return t;
}

/* Sorteio que dá sempre o mesmo resultado: o mapa sai igual toda vez. */
var semente = 20241020;
function sortear() {
  semente = (semente + 0x6D2B79F5) | 0;
  var t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function distancia(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

/* Linha suave que passa por todos os pontos dados (curva de Catmull-Rom). */
function caminhoSuave(pontos) {
  var d = "M" + pontos[0][0] + " " + pontos[0][1];
  for (var i = 0; i < pontos.length - 1; i++) {
    var p0 = pontos[Math.max(i - 1, 0)], p1 = pontos[i];
    var p2 = pontos[i + 1], p3 = pontos[Math.min(i + 2, pontos.length - 1)];
    d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
         " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
         " " + p2[0] + " " + p2[1];
  }
  return d;
}


/* --------------------------------------------------------------------------
   3. TERRENO: MORRO, CURVAS DE NÍVEL E RIO
   -------------------------------------------------------------------------- */

/* Medidas da curva de nível número k (0 = a de baixo, a maior).
   Do lado de cima (norte) as curvas ficam a 11 de distância: encosta
   íngreme. Nos outros lados ficam bem mais longe: encosta suave. */
function medidasDaCurva(k) {
  var oeste = 110 + 55 * k, leste = 890 - 55 * k;
  var norte = 50 + 11 * k, sul = 520 - 48 * k;
  return {
    cx: (oeste + leste) / 2, cy: (norte + sul) / 2,
    rx: (leste - oeste) / 2, ry: (sul - norte) / 2
  };
}

/* Um pouco de ondulação para o morro não ficar uma elipse perfeita.
   É a mesma para todas as curvas, então elas nunca se cruzam. */
function ondulacao(angulo) {
  return 1 + 0.03 * Math.sin(3 * angulo + 0.6) + 0.02 * Math.sin(5 * angulo + 1.9);
}

/* Ponto da curva k no ângulo dado (0 = leste, PI/2 = sul). */
function pontoDaCurva(k, angulo) {
  var m = medidasDaCurva(k), f = ondulacao(angulo);
  return { x: m.cx + m.rx * Math.cos(angulo) * f, y: m.cy + m.ry * Math.sin(angulo) * f };
}

/* Caminho fechado da curva k. */
function caminhoDaCurva(k) {
  var partes = [];
  for (var i = 0; i < 160; i++) {
    var p = pontoDaCurva(k, (i / 160) * 2 * Math.PI);
    partes.push((i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1));
  }
  return partes.join(" ") + " Z";
}

/* Altura do meio do rio em cada x (o rio passa embaixo, fazendo curvas). */
function meioDoRio(x) {
  return 600 + 12 * Math.sin(x / 110) + 6 * Math.sin(x / 45 + 1);
}
function metadeDoRio(x) {
  return 24 + x * 0.01;   // o rio fica um pouco mais largo para a direita
}

function desenharMorro(svg) {
  // Cores do terreno, uma faixa para cada altura
  for (var k = 0; k < QUANTAS_CURVAS; k++) {
    criar("path", { d: caminhoDaCurva(k), fill: CORES_DO_MORRO[k] }, svg);
  }
  // Brilho suave no topo, para dar volume
  var brilho = criar("radialGradient", { id: "brilho-topo", cx: "0.45", cy: "0.4", r: "0.6" }, criar("defs", {}, svg));
  criar("stop", { offset: "0", "stop-color": "#fff8dc", "stop-opacity": "0.75" }, brilho);
  criar("stop", { offset: "1", "stop-color": "#fff8dc", "stop-opacity": "0" }, brilho);
  criar("path", { d: caminhoDaCurva(QUANTAS_CURVAS - 1), fill: "url(#brilho-topo)" }, svg);

  // Linhas das curvas de nível
  for (var c = 0; c < QUANTAS_CURVAS; c++) {
    criar("path", {
      d: caminhoDaCurva(c), fill: "none", stroke: COR_CURVA,
      "stroke-width": c === QUANTAS_CURVAS - 1 ? 3.2 : 2.2
    }, svg);
  }
}

/* Altura de cada curva ("10 m", "20 m"...), escrita num lugar da curva
   que não fique embaixo de uma trilha. Roda depois de desenhar as trilhas. */
var rotulosDasCurvas = [];
function escreverAlturas(pai) {
  for (var n = 0; n < QUANTAS_CURVAS; n++) {
    // procura pela encosta da esquerda, começando de baixo; depois pela da
    // direita. Pula o lado de cima, onde as curvas ficam juntas demais.
    for (var passo = 0; passo <= 80; passo++) {
      var a = passo <= 35 ? 0.6 + passo * 0.02 : 0.4 - (passo - 36) * 0.02;
      var p = pontoDaCurva(n, a * Math.PI);
      var livre = true;
      for (var r = 0; r < rotulosDasCurvas.length && livre; r++) {
        if (distancia(p, rotulosDasCurvas[r]) < 70) livre = false;
      }
      for (var k = 0; k < PONTOS_DO_MAPA.length && livre; k++) {
        if (distancia(p, PONTOS_DO_MAPA[k]) < 50) livre = false;
      }
      for (var i = 0; i < pontosDasTrilhas.length && livre; i++) {
        if (distancia(p, pontosDasTrilhas[i]) < 48) livre = false;
      }
      for (var j = 0; j < casasDesenhadas.length && livre; j++) {
        if (distancia(p, casasDesenhadas[j]) < 60) livre = false;
      }
      if (!livre) continue;
      escrever(pai, (n + 1) * 10 + " m", p.x.toFixed(1), (p.y + 5).toFixed(1), {
        "font-size": 15, "font-weight": "bold", fill: COR_CURVA,
        stroke: CORES_DO_MORRO[n], "stroke-width": 5, "paint-order": "stroke"
      });
      rotulosDasCurvas.push({ x: p.x, y: p.y, raio: 22 });
      break;
    }
  }
}

function desenharRio(svg) {
  var cima = [], baixo = [];
  for (var x = -10; x <= LARGURA + 10; x += 10) {
    cima.push(x + " " + (meioDoRio(x) - metadeDoRio(x)).toFixed(1));
    baixo.unshift(x + " " + (meioDoRio(x) + metadeDoRio(x)).toFixed(1));
  }
  var contorno = "M" + cima.join(" L") + " L" + baixo.join(" L") + " Z";
  // Areia da margem e água
  criar("path", { d: contorno, fill: "none", stroke: "#f2e1b0", "stroke-width": 16, "stroke-linejoin": "round" }, svg);
  criar("path", { d: contorno, fill: "#4fa3e3", stroke: "#1f6fa8", "stroke-width": 3 }, svg);
  // Faixa mais clara no meio
  var meio = [];
  for (var m = -10; m <= LARGURA + 10; m += 10) meio.push(m + " " + (meioDoRio(m) - 4).toFixed(1));
  criar("path", { d: "M" + meio.join(" L"), fill: "none", stroke: "#8cc8f2", "stroke-width": 12, "stroke-linecap": "round" }, svg);

  // Ondinhas
  var ondas = criar("g", { fill: "none", stroke: "#ffffff", "stroke-width": 2.5, "stroke-linecap": "round" }, svg);
  var lugares = [40, 170, 300, 450, 560, 700, 830, 960];
  for (var i = 0; i < lugares.length; i++) {
    var ox = lugares[i], oy = meioDoRio(ox) + (i % 2 ? 10 : -8);
    criar("path", { d: "M" + ox + " " + oy.toFixed(1) + " q9 -7 18 0 t18 0" }, ondas);
  }
  escrever(svg, "Rio", 640, (meioDoRio(640) + 9).toFixed(1), {
    "font-size": 26, "font-style": "italic", "font-weight": "bold", fill: "#0e4a73",
    stroke: "#8cc8f2", "stroke-width": 4, "paint-order": "stroke"
  });
}


/* --------------------------------------------------------------------------
   4. TRILHAS DAS EQUIPES
   Cada equipe tem uma trilha de terra na sua cor, com as casas numeradas.
   A peça da equipe anda pelas casas, do INÍCIO até a CHEGADA (bandeira).
   -------------------------------------------------------------------------- */
var casasDesenhadas = [];    // centro de cada casa (para os enfeites não ficarem em cima)
var pontosDasTrilhas = [];   // pontos ao longo das trilhas (idem)

function desenharTrilhas(svg) {
  var chao = criar("g", {}, svg);    // a terra das trilhas fica embaixo das casas
  var casas = criar("g", {}, svg);
  var total = CONFIG.casasNaTrilha;

  for (var e = 0; e < CONFIG.equipes.length && e < CAMINHOS_DAS_TRILHAS.length; e++) {
    var equipe = CONFIG.equipes[e];
    var d = caminhoSuave(CAMINHOS_DAS_TRILHAS[e]);

    // Terra da trilha: borda marrom, terra clara e pontilhado na cor da equipe
    criar("path", { d: d, fill: "none", stroke: "#8a6a3d", "stroke-width": 40, "stroke-linecap": "round" }, chao);
    var guia = criar("path", { d: d, fill: "none", stroke: "#f3dfae", "stroke-width": 34, "stroke-linecap": "round" }, chao);
    criar("path", {
      d: d, fill: "none", stroke: equipe.cor, "stroke-width": 5,
      "stroke-dasharray": "2 12", "stroke-linecap": "round"
    }, chao);

    // Guarda os pontos da trilha
    var comprimento = guia.getTotalLength();
    for (var s = 0; s <= comprimento; s += 12) {
      var q = guia.getPointAtLength(s);
      pontosDasTrilhas.push({ x: q.x, y: q.y });
    }

    // Casas: 1, 2, 3... até a CHEGADA, espalhadas por igual depois do INÍCIO
    var folgaDoInicio = 48;
    for (var n = 1; n <= total; n++) {
      var p = guia.getPointAtLength(folgaDoInicio + (comprimento - folgaDoInicio) * n / total);
      desenharCasa(casas, p.x, p.y, n, equipe, n === total);
      casasDesenhadas.push({ x: p.x, y: p.y });
    }
    var inicio = guia.getPointAtLength(0);
    desenharInicio(casas, inicio.x, inicio.y, equipe);
    casasDesenhadas.push({ x: inicio.x, y: inicio.y });
  }
}

function desenharCasa(pai, x, y, numero, equipe, chegada) {
  var g = criar("g", { transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")" }, pai);
  var r = chegada ? 24 : 20;
  if (chegada) {
    // Bandeirinha na cor da equipe
    criar("rect", { x: -2, y: -r - 34, width: 4, height: 34, fill: "#3b2a1a" }, g);
    criar("path", { d: "M2 " + (-r - 34) + " l30 9 l-30 10 Z", fill: equipe.cor, stroke: "#1a1a1a", "stroke-width": 1.5 }, g);
  }
  criar("circle", { r: r + 3.5, fill: "#1a1a1a" }, g);
  criar("circle", { r: r, fill: "#ffffff", stroke: equipe.cor, "stroke-width": chegada ? 8 : 6.5 }, g);
  escrever(g, String(numero), 0, 7.5, { "font-size": chegada ? 22 : 21, "font-weight": "bold", fill: "#1a1a1a" });
}

function desenharInicio(pai, x, y, equipe) {
  var g = criar("g", { transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")" }, pai);
  criar("rect", { x: -48, y: -20, width: 96, height: 40, rx: 10, fill: equipe.cor, stroke: "#1a1a1a", "stroke-width": 3 }, g);
  var cor = equipe.textoClaro ? "#ffffff" : "#1a1a1a";
  escrever(g, "INÍCIO", 0, -3, { "font-size": 14, "font-weight": "bold", fill: cor });
  escrever(g, equipe.nome.toUpperCase(), 0, 13, { "font-size": 12, "font-weight": "bold", fill: cor });
}


/* --------------------------------------------------------------------------
   5. ENFEITES: ÁRVORES, FLORES, PEDRAS E BICHOS
   Ficam espalhados, mas nunca em cima das trilhas, dos pontos ou do rio.
   -------------------------------------------------------------------------- */

/* Diz se um lugar está livre para um enfeite de tamanho "raio". */
function lugarLivre(p, raio, ocupados) {
  if (p.y > meioDoRio(p.x) - metadeDoRio(p.x) - raio - 8) return false;     // rio
  if (p.x < 290 && p.y < 82) return false;                                   // título
  if (p.x > 920 && p.y < 110) return false;                                  // norte
  for (var i = 0; i < pontosDasTrilhas.length; i++) {
    if (distancia(p, pontosDasTrilhas[i]) < raio + 24) return false;
  }
  for (var j = 0; j < casasDesenhadas.length; j++) {
    if (distancia(p, casasDesenhadas[j]) < raio + 52) return false;
  }
  for (var k = 0; k < PONTOS_DO_MAPA.length; k++) {
    if (distancia(p, PONTOS_DO_MAPA[k]) < raio + 40) return false;
  }
  for (var o = 0; o < ocupados.length; o++) {
    if (distancia(p, ocupados[o]) < raio + ocupados[o].raio + 4) return false;
  }
  return true;
}

/* Em que faixa de altura um lugar está (-1 = baixada, 0 a 5 = no morro). */
function alturaDoLugar(p) {
  var faixa = -1;
  for (var k = 0; k < QUANTAS_CURVAS; k++) {
    var m = medidasDaCurva(k);
    var dx = (p.x - m.cx) / m.rx, dy = (p.y - m.cy) / m.ry;
    if (dx * dx + dy * dy < 0.97 * ondulacao(Math.atan2(dy, dx)) * ondulacao(Math.atan2(dy, dx))) faixa = k;
  }
  return faixa;
}

function arvoreRedonda(pai, x, y, r) {
  var tons = [["#3f9142", "#6dbb5e"], ["#2f7d3a", "#5aa84f"], ["#4c9b3a", "#86c96b"]];
  var tom = tons[Math.floor(sortear() * tons.length)];
  criar("ellipse", { cx: x + 3, cy: y + 4, rx: r, ry: r * 0.85, fill: "#000000", opacity: 0.15 }, pai);
  criar("circle", { cx: x, cy: y, r: r, fill: tom[0], stroke: "#245c27", "stroke-width": 1.6 }, pai);
  criar("circle", { cx: x - r * 0.3, cy: y - r * 0.32, r: r * 0.42, fill: tom[1] }, pai);
}

/* Araucária vista de cima: uma estrela verde-escura (árvore típica do RS). */
function araucaria(pai, x, y, r) {
  var pontas = [];
  for (var i = 0; i < 16; i++) {
    var a = (i / 16) * 2 * Math.PI, raio = i % 2 ? r * 0.45 : r;
    pontas.push((x + raio * Math.cos(a)).toFixed(1) + "," + (y + raio * Math.sin(a)).toFixed(1));
  }
  criar("polygon", { points: pontas.join(" "), fill: "#1f5e33", stroke: "#123d20", "stroke-width": 1.2 }, pai);
  criar("circle", { cx: x, cy: y, r: r * 0.25, fill: "#6b4423" }, pai);
}

function flor(pai, x, y) {
  var cores = ["#ff6b9a", "#ffd23f", "#ffffff", "#b388ff"];
  var cor = cores[Math.floor(sortear() * cores.length)];
  for (var i = 0; i < 5; i++) {
    var a = (i / 5) * 2 * Math.PI;
    criar("circle", { cx: (x + 4 * Math.cos(a)).toFixed(1), cy: (y + 4 * Math.sin(a)).toFixed(1), r: 3.2, fill: cor, stroke: "#7a4b22", "stroke-width": 0.6 }, pai);
  }
  criar("circle", { cx: x, cy: y, r: 2.4, fill: "#f08c00" }, pai);
}

function pedra(pai, x, y, r) {
  criar("ellipse", { cx: x, cy: y, rx: r, ry: r * 0.7, fill: "#a7a29a", stroke: "#5f5a52", "stroke-width": 1.5 }, pai);
  criar("ellipse", { cx: x - r * 0.3, cy: y - r * 0.25, rx: r * 0.35, ry: r * 0.2, fill: "#d1ccc4" }, pai);
}

function peixe(pai, x, y, virado) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ") scale(" + (virado ? -1 : 1) + " 1)" }, pai);
  criar("ellipse", { cx: 0, cy: 0, rx: 13, ry: 6.5, fill: "#ff9f1c", stroke: "#a85d00", "stroke-width": 1.4 }, g);
  criar("path", { d: "M-11 0 l-10 -7 l0 14 Z", fill: "#ff9f1c", stroke: "#a85d00", "stroke-width": 1.4 }, g);
  criar("circle", { cx: 6, cy: -1.5, r: 1.6, fill: "#1a1a1a" }, g);
}

function pato(pai, x, y) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ")" }, pai);
  criar("ellipse", { cx: 0, cy: 0, rx: 14, ry: 9, fill: "#ffffff", stroke: "#555555", "stroke-width": 1.4 }, g);
  criar("circle", { cx: 12, cy: -6, r: 6.5, fill: "#3c8d5a", stroke: "#555555", "stroke-width": 1.2 }, g);
  criar("path", { d: "M17 -6 l7 2 l-7 2 Z", fill: "#f4a300" }, g);
}

function borboleta(pai, x, y, cor) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ")" }, pai);
  criar("ellipse", { cx: -5, cy: -3, rx: 6, ry: 4.5, fill: cor, stroke: "#1a1a1a", "stroke-width": 1, transform: "rotate(-25)" }, g);
  criar("ellipse", { cx: 5, cy: -3, rx: 6, ry: 4.5, fill: cor, stroke: "#1a1a1a", "stroke-width": 1, transform: "rotate(25)" }, g);
  criar("ellipse", { cx: 0, cy: 0, rx: 1.4, ry: 5, fill: "#1a1a1a" }, g);
}

function desenharEnfeites(svg) {
  var g = criar("g", {}, svg);
  var ocupados = rotulosDasCurvas.slice();   // não cobrir as alturas das curvas

  // Pedras na encosta íngreme (lado de cima do morro)
  for (var tentativa = 0; tentativa < 400 && ocupados.length < rotulosDasCurvas.length + 9; tentativa++) {
    var pp = { x: 230 + sortear() * 540, y: 50 + sortear() * 50, raio: 6 + sortear() * 4 };
    if (alturaDoLugar(pp) >= 0 && lugarLivre(pp, pp.raio, ocupados)) {
      pedra(g, pp.x, pp.y, pp.raio);
      ocupados.push(pp);
    }
  }

  // Árvores: araucárias no alto do morro, árvores redondas embaixo
  for (var t = 0; t < 3000 && ocupados.length < 95; t++) {
    var p = { x: 15 + sortear() * (LARGURA - 30), y: 15 + sortear() * (ALTURA - 60), raio: 10 + sortear() * 6 };
    if (!lugarLivre(p, p.raio, ocupados)) continue;
    var altura = alturaDoLugar(p);
    if (altura === QUANTAS_CURVAS - 1 && sortear() < 0.6) continue;   // topo mais aberto
    if (altura >= 2) araucaria(g, p.x, p.y, p.raio + 2);
    else arvoreRedonda(g, p.x, p.y, p.raio);
    ocupados.push(p);
  }

  // Flores na baixada e nas partes baixas
  for (var f = 0; f < 3000 && ocupados.length < 150; f++) {
    var pf = { x: 15 + sortear() * (LARGURA - 30), y: 300 + sortear() * 300, raio: 7 };
    if (alturaDoLugar(pf) <= 1 && lugarLivre(pf, pf.raio, ocupados)) {
      flor(g, pf.x, pf.y);
      ocupados.push(pf);
    }
  }

  // Bichos no rio e no céu do mapa
  peixe(g, 250, meioDoRio(250) + 4, false);
  peixe(g, 780, meioDoRio(780) - 2, true);
  pato(g, 520, meioDoRio(520) + 2);
  borboleta(g, 330, 470, "#ffb3c7");
  borboleta(g, 690, 300, "#9ad0ff");
}


/* --------------------------------------------------------------------------
   6. PONTOS DAS PERGUNTAS, TÍTULO E NORTE
   -------------------------------------------------------------------------- */
function desenharPontos(svg) {
  for (var i = 0; i < PONTOS_DO_MAPA.length; i++) {
    var ponto = PONTOS_DO_MAPA[i];
    var g = criar("g", { transform: "translate(" + ponto.x + " " + ponto.y + ")" }, svg);
    criar("circle", { r: 25, fill: "#1a1a1a", opacity: 0.18, cx: 3, cy: 4 }, g);
    criar("circle", { r: 22, fill: "#ffe066", stroke: "#1a1a1a", "stroke-width": 4.5 }, g);
    escrever(g, ponto.numero, 0, 10, { "font-size": 28, "font-weight": "bold", fill: "#1a1a1a" });
  }
}

function desenharTitulo(svg) {
  var g = criar("g", { transform: "translate(18 16)" }, svg);
  criar("rect", { x: 0, y: 0, width: 262, height: 58, rx: 14, fill: "#ffffff", stroke: "#1a1a1a", "stroke-width": 3.5, opacity: 0.95 }, g);
  escrever(g, "TRILHA DO MORRO", 131, 30, { "font-size": 26, "font-weight": "bold", fill: "#1d6b40", "letter-spacing": "1" });
  escrever(g, "Espaço Pachamama · UFSM", 131, 49, { "font-size": 14, fill: "#4d4d4d" });
}

/* Rosa dos ventos com o norte em destaque. */
function desenharNorte(svg) {
  var g = criar("g", { transform: "translate(955 62)" }, svg);
  criar("circle", { r: 34, fill: "#ffffff", stroke: "#1a1a1a", "stroke-width": 2.5, opacity: 0.9 }, g);
  criar("polygon", { points: "0,-30 7,0 0,6 -7,0", fill: "#d62828", stroke: "#1a1a1a", "stroke-width": 1.2 }, g);
  criar("polygon", { points: "0,30 7,0 0,-6 -7,0", fill: "#ffffff", stroke: "#1a1a1a", "stroke-width": 1.2 }, g);
  criar("polygon", { points: "-24,0 0,5 0,-5", fill: "#cccccc", stroke: "#1a1a1a", "stroke-width": 1 }, g);
  criar("polygon", { points: "24,0 0,5 0,-5", fill: "#cccccc", stroke: "#1a1a1a", "stroke-width": 1 }, g);
  escrever(g, "N", 18, -14, { "font-size": 17, "font-weight": "bold", fill: "#1a1a1a" });
}

function desenharMapa() {
  var svg = document.getElementById("desenho-mapa");
  criar("rect", { x: 0, y: 0, width: LARGURA, height: ALTURA, fill: COR_BAIXADA }, svg);
  desenharMorro(svg);
  desenharRio(svg);
  var camadaAlturas = criar("g", {}, svg);    // as alturas e os enfeites ficam
  var camadaEnfeites = criar("g", {}, svg);   // embaixo das trilhas
  desenharTrilhas(svg);
  escreverAlturas(camadaAlturas);
  desenharEnfeites(camadaEnfeites);
  desenharPontos(svg);
  desenharTitulo(svg);
  desenharNorte(svg);
}


/* --------------------------------------------------------------------------
   7. PAPEL A4 OU A3
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
   8. INÍCIO
   -------------------------------------------------------------------------- */
desenharMapa();
document.getElementById("papel-a4").addEventListener("click", function () { escolherPapel("A4"); });
document.getElementById("papel-a3").addEventListener("click", function () { escolherPapel("A3"); });
document.getElementById("botao-imprimir").addEventListener("click", function () { window.print(); });
