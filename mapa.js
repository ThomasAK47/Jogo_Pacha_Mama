/* ==========================================================================
   MAPA.JS — DESENHA O MAPA COM AS TRILHAS PARA IMPRIMIR
   ==========================================================================

   O mapa mostra um morro visto de cima, com curvas de nível, um rio
   embaixo e quatro trilhas coloridas (uma por equipe) que sobem do INÍCIO,
   na baixada, até a CHEGADA, na escola do topo do morro.

   Os pontos 1 a 5 são os que as perguntas citam (perguntas.js). Cada um
   tem um desenho, para a criança reconhecer o lugar sem ler o mapa:
     - Ponto 1: casa de madeira com deck no rio . perigo de ENCHENTE
     - Ponto 2: casa de palafitas na encosta .... perigo de DESLIZAMENTO
     - Ponto 3: linha de alta tensão e árvores .. perigo no VENDAVAL e nos raios
     - Ponto 4: açude quase seco e lavoura ...... ESTIAGEM
     - Ponto 5: escola no topo plano ............ ABRIGO e ponto de encontro
   Se mudar um ponto de lugar aqui, confira as perguntas de mapa.

   Os nomes, as cores e o número de casas das trilhas vêm do config.js.

   Partes deste arquivo:
     1. Ajustes do desenho (pontos, trilhas, cores)
     2. Ferramentas de desenho
     3. Terreno: morro, curvas de nível e rio
     4. Trilhas das equipes
     5. Enfeites: árvores, flores, pedras e bichinhos
     6. Pontos das perguntas, título e norte
     7. Papel A4 ou A3
     8. Início
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. AJUSTES DO DESENHO
   O desenho usa coordenadas de 0 a 1000 (largura) e de 0 a 640 (altura).
   -------------------------------------------------------------------------- */
var LARGURA = 1000, ALTURA = 640;

// Onde fica cada ponto das perguntas (x, y no desenho), qual desenho ele
// tem, quanto espaço livre o desenho precisa em volta (raio) e onde fica o
// número, em relação ao meio do desenho (numeroEm)
var PONTOS_DO_MAPA = [
  { numero: "1", x: 96,  y: 530, desenho: "casaDoRio", raio: 50, numeroEm: [-46, -30] },  // casa na beira do rio
  { numero: "2", x: 372, y: 74,  desenho: "casaDaEncosta", raio: 52, numeroEm: [-40, -24] },  // casa na encosta íngreme
  { numero: "3", x: 118, y: 178, desenho: "altaTensao", raio: 94, numeroEm: [-86, -44] },  // linha de alta tensão e raio
  { numero: "4", x: 880, y: 172, desenho: "acude",  raio: 80, numeroEm: [-96, -6] },  // açude quase seco e lavoura
  { numero: "5", x: 500, y: 170, desenho: "escola", raio: 56, numeroEm: [62, -32] }     // escola no topo (abrigo)
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

// Área de seca no canto de cima à direita (em volta do ponto 4): um quarto
// de elipse com o centro no canto do mapa. Ali não nascem árvores nem flores.
var ZONA_SECA = { cx: LARGURA, cy: 0, rx: 330, ry: 310 };


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

/* Diz se um lugar (com a folga dada) cai dentro da área de seca. */
function naZonaSeca(p, folga) {
  var dx = (p.x - ZONA_SECA.cx) / (ZONA_SECA.rx + folga), dy = (p.y - ZONA_SECA.cy) / (ZONA_SECA.ry + folga);
  return dx * dx + dy * dy < 1;
}

/* Chão seco e rachado da área de seca. Fica embaixo do morro. */
function desenharZonaSeca(svg) {
  var z = ZONA_SECA, partes = [];
  for (var i = 0; i <= 40; i++) {
    var a = Math.PI / 2 + (i / 40) * Math.PI / 2;       // do canto de baixo até o de cima
    var f = 1 + 0.04 * Math.sin(i * 1.7) + 0.03 * Math.sin(i * 3.1);
    partes.push((z.cx + z.rx * f * Math.cos(a)).toFixed(1) + " " + (z.cy + z.ry * f * Math.sin(a)).toFixed(1));
  }
  var d = "M" + LARGURA + " 0 L" + partes.join(" L") + " Z";
  criar("path", { d: d, fill: "#ead39c", stroke: "#c9a26b", "stroke-width": 3 }, svg);

  // Rachaduras: linhas em zigue-zague, sempre no mesmo lugar
  var g = criar("g", { fill: "none", stroke: "#b8925a", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
  var n = 7;
  function proximo() { n = (n * 9301 + 49297) % 233280; return n / 233280; }
  for (var r = 0; r < 70; r++) {
    var p = { x: LARGURA - proximo() * z.rx, y: proximo() * z.ry };
    if (!naZonaSeca(p, -18)) continue;
    var c = "M" + p.x.toFixed(1) + " " + p.y.toFixed(1);
    for (var k = 0; k < 3; k++) c += " l" + (proximo() * 22 - 11).toFixed(1) + " " + (proximo() * 22 - 11).toFixed(1);
    criar("path", { d: c }, g);
  }
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
    // direita. O lado de cima, onde as curvas ficam juntas demais, fica por
    // último, só se não houver lugar nos outros.
    for (var passo = 0; passo <= 100; passo++) {
      var a = passo <= 35 ? 0.6 + passo * 0.02 : passo <= 80 ? 0.4 - (passo - 36) * 0.02 : 1.32 + (passo - 81) * 0.02;
      var p = pontoDaCurva(n, a * Math.PI);
      var livre = true;
      for (var r = 0; r < rotulosDasCurvas.length && livre; r++) {
        if (distancia(p, rotulosDasCurvas[r]) < 70) livre = false;
      }
      for (var k = 0; k < PONTOS_DO_MAPA.length && livre; k++) {
        var ponto = PONTOS_DO_MAPA[k];
        if (distancia(p, ponto) < ponto.raio + 12) livre = false;
        if (distancia(p, { x: ponto.x + ponto.numeroEm[0], y: ponto.y + ponto.numeroEm[1] }) < 36) livre = false;
      }
      for (var i = 0; i < pontosDasTrilhas.length && livre; i++) {
        if (distancia(p, pontosDasTrilhas[i]) < 48) livre = false;
      }
      for (var j = 0; j < casasDesenhadas.length && livre; j++) {
        if (distancia(p, casasDesenhadas[j]) < 60) livre = false;
      }
      for (var b = 0; b < bandeirasDesenhadas.length && livre; b++) {
        if (distancia(p, bandeirasDesenhadas[b]) < 40) livre = false;
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
var bandeirasDesenhadas = [];   // bandeirinhas das chegadas (idem)

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
      if (n === total) bandeirasDesenhadas.push({ x: p.x + 12, y: p.y - 48 });
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
  if (naZonaSeca(p, raio)) return false;                                     // seca
  for (var i = 0; i < pontosDasTrilhas.length; i++) {
    if (distancia(p, pontosDasTrilhas[i]) < raio + 24) return false;
  }
  for (var j = 0; j < casasDesenhadas.length; j++) {
    if (distancia(p, casasDesenhadas[j]) < raio + 52) return false;
  }
  for (var b = 0; b < bandeirasDesenhadas.length; b++) {
    if (distancia(p, bandeirasDesenhadas[b]) < raio + 30) return false;
  }
  for (var k = 0; k < PONTOS_DO_MAPA.length; k++) {
    var ponto = PONTOS_DO_MAPA[k];
    if (distancia(p, ponto) < raio + ponto.raio) return false;
    if (distancia(p, { x: ponto.x + ponto.numeroEm[0], y: ponto.y + ponto.numeroEm[1] }) < raio + 22) return false;
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

/* Bichinhos fofos. Cada um cabe num círculo de raio ~16 em volta de (x, y). */
function coelho(pai, x, y) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ") scale(1.3)" }, pai);
  var pelo = { fill: "#f4f1ea", stroke: "#4d4d4d", "stroke-width": 1.3 };
  criar("ellipse", Object.assign({ cx: -6, cy: -12, rx: 2.6, ry: 7, transform: "rotate(-12 -6 -12)" }, pelo), g);
  criar("ellipse", Object.assign({ cx: 0, cy: -13, rx: 2.6, ry: 7, transform: "rotate(10 0 -13)" }, pelo), g);
  criar("ellipse", { cx: -6, cy: -12, rx: 1.1, ry: 4.5, fill: "#ffb3c7", transform: "rotate(-12 -6 -12)" }, g);
  criar("ellipse", { cx: 0, cy: -13, rx: 1.1, ry: 4.5, fill: "#ffb3c7", transform: "rotate(10 0 -13)" }, g);
  criar("ellipse", Object.assign({ cx: 4, cy: 4, rx: 9, ry: 7 }, pelo), g);
  criar("circle", Object.assign({ cx: 12, cy: 3, r: 3 }, pelo), g);
  criar("circle", Object.assign({ cx: -3, cy: -3, r: 6.5 }, pelo), g);
  criar("circle", { cx: -5, cy: -4, r: 1.2, fill: "#1a1a1a" }, g);
  criar("circle", { cx: -8.6, cy: -2, r: 1, fill: "#ff6b9a" }, g);
  criar("circle", { cx: -1, cy: -1, r: 1.4, fill: "#ffb3c7", opacity: 0.8 }, g);
}

function capivara(pai, x, y) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ") scale(1.3)" }, pai);
  criar("ellipse", { cx: 2, cy: 2, rx: 14, ry: 8.5, fill: "#a8774a", stroke: "#5a3a1c", "stroke-width": 1.4 }, g);
  criar("path", { d: "M-8 -2 q-4 -8 -14 -5 q-4 4 -2 9 q6 4 15 1 Z", fill: "#a8774a", stroke: "#5a3a1c", "stroke-width": 1.4 }, g);
  criar("circle", { cx: -10, cy: -7, r: 2, fill: "#8a5a2b", stroke: "#5a3a1c", "stroke-width": 1 }, g);
  criar("circle", { cx: -15, cy: -3, r: 1.2, fill: "#1a1a1a" }, g);
  criar("circle", { cx: -23, cy: 0, r: 1, fill: "#3b2a1a" }, g);
  criar("circle", { cx: -12, cy: 0, r: 1.5, fill: "#ffb3c7", opacity: 0.8 }, g);
  criar("rect", { x: -6, y: 8, width: 3, height: 4, fill: "#8a5a2b" }, g);
  criar("rect", { x: 8, y: 8, width: 3, height: 4, fill: "#8a5a2b" }, g);
}

function passarinho(pai, x, y, cor) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ") scale(1.3)" }, pai);
  criar("path", { d: "M7 0 l7 -4 l-1 7 Z", fill: cor, stroke: "#1a1a1a", "stroke-width": 1 }, g);
  criar("circle", { cx: 0, cy: 0, r: 7.5, fill: cor, stroke: "#1a1a1a", "stroke-width": 1.3 }, g);
  criar("path", { d: "M-1 1 q4 6 8 0", fill: "#ffffff", opacity: 0.6 }, g);
  criar("path", { d: "M-7 -1 l-5 1.5 l5 1.5 Z", fill: "#f08c00", stroke: "#1a1a1a", "stroke-width": 0.8 }, g);
  criar("circle", { cx: -3.5, cy: -2.5, r: 1.3, fill: "#1a1a1a" }, g);
  criar("path", { d: "M-1 7 l-1 4 M2 7 l1 4", stroke: "#f08c00", "stroke-width": 1.3 }, g);
}

function joaninha(pai, x, y) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ") scale(1.3)" }, pai);
  criar("circle", { cx: -7, cy: 0, r: 3.5, fill: "#1a1a1a" }, g);
  criar("circle", { cx: 0, cy: 0, r: 7, fill: "#e03131", stroke: "#1a1a1a", "stroke-width": 1.3 }, g);
  criar("line", { x1: -7, y1: 0, x2: 7, y2: 0, stroke: "#1a1a1a", "stroke-width": 1.1 }, g);
  [[-2, -3.5], [3, -3], [-2, 3.5], [3, 3]].forEach(function (b) {
    criar("circle", { cx: b[0], cy: b[1], r: 1.4, fill: "#1a1a1a" }, g);
  });
}

function tartaruga(pai, x, y) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ") scale(1.3)" }, pai);
  criar("circle", { cx: -11, cy: 0, r: 3.6, fill: "#8cc63f", stroke: "#2f5d1a", "stroke-width": 1.2 }, g);
  criar("circle", { cx: -12, cy: -1, r: 0.9, fill: "#1a1a1a" }, g);
  [[-6, 6], [6, 6]].forEach(function (p) {
    criar("ellipse", { cx: p[0], cy: p[1], rx: 2.2, ry: 2.6, fill: "#8cc63f", stroke: "#2f5d1a", "stroke-width": 1 }, g);
  });
  criar("path", { d: "M-9 3 q0 -12 9 -12 q9 0 9 12 Z", fill: "#3f8f3f", stroke: "#1f4d1f", "stroke-width": 1.4 }, g);
  criar("path", { d: "M-4 3 l1 -6 l6 0 l1 6 M-3 -3 l-3 -3 M3 -3 l3 -3", fill: "none", stroke: "#a3d977", "stroke-width": 1.2 }, g);
}

function caracol(pai, x, y) {
  var g = criar("g", { transform: "translate(" + x + " " + y + ") scale(1.3)" }, pai);
  criar("path", { d: "M-12 6 q10 2 22 0 q2 -2 0 -3 l-22 0 Z", fill: "#e9c46a", stroke: "#8a6a3d", "stroke-width": 1.1 }, g);
  criar("path", { d: "M-10 3 l-2 -7 M-8 3 l1 -7", stroke: "#8a6a3d", "stroke-width": 1.1 }, g);
  criar("circle", { cx: -12, cy: -4, r: 1.1, fill: "#1a1a1a" }, g);
  criar("circle", { cx: -7, cy: -4, r: 1.1, fill: "#1a1a1a" }, g);
  criar("circle", { cx: 3, cy: -3, r: 7, fill: "#d97a3a", stroke: "#7a3d12", "stroke-width": 1.3 }, g);
  criar("path", { d: "M3 -3 m0 -1 a1.5 1.5 0 1 1 -1.5 2 a3.5 3.5 0 1 1 4.5 -4", fill: "none", stroke: "#7a3d12", "stroke-width": 1.2 }, g);
}

/* Põe um bichinho perto do lugar desejado: procura em espiral o primeiro
   lugar livre. */
function soltarBicho(desenhar, alvo, ocupados, raio) {
  for (var r = 0; r <= 90; r += 6) {
    for (var v = 0; v < 12; v++) {
      var a = (v / 12) * 2 * Math.PI;
      var p = { x: alvo[0] + r * Math.cos(a), y: alvo[1] + r * Math.sin(a), raio: raio || 18 };
      if (lugarLivre(p, p.raio, ocupados)) {
        desenhar(p.x, p.y);
        ocupados.push(p);
        return;
      }
      if (r === 0) break;
    }
  }
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

  // Bichinhos fofos espalhados, antes das árvores para terem lugar
  var bichos = [
    [function (x, y) { coelho(g, x, y); }, [330, 470]],
    [function (x, y) { coelho(g, x, y); }, [880, 430]],
    [function (x, y) { capivara(g, x, y); }, [910, 545], 30],
    [function (x, y) { passarinho(g, x, y, "#ffd23f"); }, [60, 470]],
    [function (x, y) { passarinho(g, x, y, "#74c0fc"); }, [640, 40]],
    [function (x, y) { joaninha(g, x, y); }, [250, 520]],
    [function (x, y) { tartaruga(g, x, y); }, [770, 505]],
    [function (x, y) { caracol(g, x, y); }, [500, 470]]
  ];
  for (var b = 0; b < bichos.length; b++) soltarBicho(bichos[b][0], bichos[b][1], ocupados, bichos[b][2]);

  // Árvores: araucárias no alto do morro, árvores redondas embaixo
  for (var t = 0; t < 3000 && ocupados.length < 95; t++) {
    var p = { x: 15 + sortear() * (LARGURA - 30), y: 15 + sortear() * (ALTURA - 60), raio: 10 + sortear() * 6 };
    if (!lugarLivre(p, p.raio, ocupados)) continue;
    var altura = alturaDoLugar(p);
    if (altura === QUANTAS_CURVAS - 1) continue;   // topo livre para a escola
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
/* Casa vista de frente: parede, telhado, porta e janela. */
function desenhoCasa(g) {
  criar("ellipse", { cx: 3, cy: 26, rx: 34, ry: 7, fill: "#000000", opacity: 0.15 }, g);
  criar("rect", { x: -24, y: -6, width: 48, height: 32, fill: "#fff3d6", stroke: "#1a1a1a", "stroke-width": 2.5 }, g);
  criar("path", { d: "M-31 -4 L0 -30 L31 -4 Z", fill: "#d9480f", stroke: "#1a1a1a", "stroke-width": 2.5, "stroke-linejoin": "round" }, g);
  criar("rect", { x: -16, y: 6, width: 12, height: 20, fill: "#8a5a2b", stroke: "#1a1a1a", "stroke-width": 2 }, g);
  criar("rect", { x: 4, y: 3, width: 13, height: 12, fill: "#9ad0ff", stroke: "#1a1a1a", "stroke-width": 2 }, g);
}

/* Casa de encosta: pequena, em cima de palafitas (vigas da fundação à
   mostra), com o chão do morro descendo em diagonal embaixo dela. Não tem
   fundo pintado, para as curvas de nível continuarem aparecendo. */
function desenhoCasaDaEncosta(fora) {
  var g = criar("g", { transform: "scale(1.25)" }, fora);
  var borda = "#1a1a1a";
  function chao(x) { return 20 - 0.42 * x; }   // o morro desce para a esquerda
  // Chão inclinado
  criar("line", { x1: -34, y1: chao(-34), x2: 34, y2: chao(34), stroke: "#7a4b22", "stroke-width": 3.5, "stroke-linecap": "round" }, g);
  // Vigas da fundação: cada uma desce até o chão, umas mais compridas
  var vigas = [-17, -6, 6, 17];
  for (var i = 0; i < vigas.length; i++) {
    criar("rect", { x: vigas[i] - 2.2, y: 2, width: 4.4, height: chao(vigas[i]) - 2, fill: "#8d8d8d", stroke: borda, "stroke-width": 1.3 }, g);
  }
  // Travas em X entre as vigas
  var travas = criar("g", { stroke: "#5f5a52", "stroke-width": 1.6 }, g);
  for (var j = 0; j < vigas.length - 1; j++) {
    var a = vigas[j], b = vigas[j + 1];
    criar("line", { x1: a, y1: 4, x2: b, y2: chao(b) - 1 }, travas);
    criar("line", { x1: b, y1: 4, x2: a, y2: Math.min(chao(a), chao(b) + 6) }, travas);
  }
  // Laje e casa
  criar("rect", { x: -22, y: -1, width: 44, height: 5, fill: "#a7a29a", stroke: borda, "stroke-width": 1.8 }, g);
  criar("rect", { x: -19, y: -24, width: 38, height: 23, fill: "#fff3d6", stroke: borda, "stroke-width": 2.2 }, g);
  criar("path", { d: "M-24 -22 L0 -40 L24 -22 Z", fill: "#d9480f", stroke: borda, "stroke-width": 2.2, "stroke-linejoin": "round" }, g);
  criar("rect", { x: -13, y: -16, width: 10, height: 15, fill: "#8a5a2b", stroke: borda, "stroke-width": 1.6 }, g);
  criar("rect", { x: 3, y: -18, width: 11, height: 9, fill: "#9ad0ff", stroke: borda, "stroke-width": 1.6 }, g);
}

/* Casa de madeira na beira do rio, com um deck de madeira que avança
   sobre a água e uma canoa amarrada. */
function desenhoCasaDoRio(g) {
  var tabua = "#b77b42", borda = "#1a1a1a";
  // Deck: piso de tábuas na frente da casa, avançando sobre a água, com
  // estacas fincadas no rio e um corrimão
  [-40, -10, 22, 52].forEach(function (x) {
    criar("rect", { x: x - 2.5, y: 30, width: 5, height: 24, fill: "#6b4423", stroke: borda, "stroke-width": 1.2 }, g);
  });
  criar("path", { d: "M-46 22 L60 22 L64 34 L-42 34 Z", fill: "#c98d52", stroke: borda, "stroke-width": 2.2, "stroke-linejoin": "round" }, g);
  for (var t = -36; t < 62; t += 9) {
    criar("line", { x1: t, y1: 22, x2: t + 3, y2: 34, stroke: "#8a5a2b", "stroke-width": 1.3 }, g);
  }
  criar("path", { d: "M30 22 L30 8 L62 8 L62 22 M46 8 L46 22", fill: "none", stroke: "#6b4423", "stroke-width": 2.6, "stroke-linejoin": "round" }, g);
  // Casa de tábuas
  criar("rect", { x: -24, y: -10, width: 48, height: 34, fill: tabua, stroke: borda, "stroke-width": 2.5 }, g);
  for (var y = -2; y < 24; y += 7) {
    criar("line", { x1: -24, y1: y, x2: 24, y2: y, stroke: "#8a5a2b", "stroke-width": 1.3 }, g);
  }
  criar("path", { d: "M-31 -8 L0 -34 L31 -8 Z", fill: "#7a4b22", stroke: borda, "stroke-width": 2.5, "stroke-linejoin": "round" }, g);
  criar("rect", { x: -15, y: 4, width: 12, height: 20, fill: "#5a3a1c", stroke: borda, "stroke-width": 2 }, g);
  criar("rect", { x: 4, y: 0, width: 13, height: 11, fill: "#9ad0ff", stroke: borda, "stroke-width": 2 }, g);
  // Canoa amarrada no deck
  criar("path", { d: "M40 50 q16 10 34 0 l-4 -6 l-26 0 Z", fill: "#d9480f", stroke: borda, "stroke-width": 2 }, g);
  criar("path", { d: "M60 30 q4 10 2 14", fill: "none", stroke: "#3b2a1a", "stroke-width": 1.5 }, g);
}

/* Linha de alta tensão: duas torres de ferro com os cabos passando por
   cima de árvores, uma nuvem de tempestade e um raio caindo numa árvore. */
function desenhoAltaTensao(g) {
  var borda = "#1a1a1a";
  // Árvores embaixo da linha
  [[-34, 22, 17], [2, 30, 19], [38, 22, 16]].forEach(function (a) {
    criar("ellipse", { cx: a[0] + 3, cy: a[1] + a[2] + 4, rx: a[2], ry: 4, fill: "#000000", opacity: 0.15 }, g);
    criar("rect", { x: a[0] - 3, y: a[1] + 6, width: 6, height: a[2] - 2, fill: "#7a4b22", stroke: borda, "stroke-width": 1.5 }, g);
    criar("circle", { cx: a[0], cy: a[1], r: a[2], fill: "#2f7d3a", stroke: borda, "stroke-width": 2 }, g);
    criar("circle", { cx: a[0] - a[2] * 0.3, cy: a[1] - a[2] * 0.32, r: a[2] * 0.4, fill: "#5aa84f" }, g);
  });
  // Torres de ferro (treliça)
  function torre(x, y) {
    var t = criar("g", { transform: "translate(" + x + " " + y + ")", fill: "none", stroke: "#4d4d4d", "stroke-width": 2, "stroke-linejoin": "round" }, g);
    criar("path", { d: "M-11 44 L-3 -28 L3 -28 L11 44 M-9 26 L9 26 M-7 8 L7 8 M-5 -10 L5 -10 M-9 26 L7 8 M9 26 L-7 8 M-7 8 L5 -10 M7 8 L-5 -10" }, t);
    criar("path", { d: "M-16 -24 L16 -24 M-12 -16 L12 -16", "stroke-width": 2.6 }, t);
  }
  torre(-70, -2);
  torre(74, -8);
  // Cabos: saem da borda do mapa, passam pelas torres e por cima das árvores
  var cabos = criar("g", { fill: "none", stroke: "#1a1a1a", "stroke-width": 1.6 }, g);
  [[-26, -16], [-18, -8]].forEach(function (c, i) {
    var yA = c[0] + 0, yB = c[0] - 6, xA = -70 + (i ? 12 : -16), xB = 74 + (i ? 12 : -16);
    var xA2 = -70 + (i ? -12 : 16), xB2 = 74 + (i ? -12 : 16);
    criar("path", { d: "M-130 " + (yA + 6) + " Q-100 " + (yA + 14) + " " + xA + " " + yA }, cabos);
    criar("path", { d: "M" + xA2 + " " + (yA + (i ? 8 : 0)) + " Q2 " + (yA + 26) + " " + xB + " " + (yB + (i ? 8 : 0)) }, cabos);
  });
  // Nuvem de tempestade
  var nuvem = criar("g", { fill: "#8d96a6", stroke: borda, "stroke-width": 2 }, g);
  criar("path", { d: "M-34 -58 q-14 0 -14 -11 q0 -11 14 -11 q4 -13 20 -11 q8 -10 22 -4 q16 -3 18 11 q12 2 10 13 q-2 13 -16 13 Z" }, nuvem);
  // Raio caindo na árvore do meio
  criar("path", {
    d: "M-2 -58 L-14 -28 L-2 -28 L-6 12 L12 -34 L0 -34 L10 -58 Z",
    fill: "#ffd23f", stroke: borda, "stroke-width": 2, "stroke-linejoin": "round"
  }, g);
  var brilho = criar("g", { stroke: "#ffd23f", "stroke-width": 3, "stroke-linecap": "round" }, g);
  criar("path", { d: "M-16 8 l-8 -5 M-16 16 l-9 1 M4 8 l8 -5 M5 16 l9 1" }, brilho);
  // Vento
  var vento = criar("g", { fill: "none", stroke: "#1f6fa8", "stroke-width": 3, "stroke-linecap": "round" }, g);
  criar("path", { d: "M-118 34 h16 q8 0 8 -7" }, vento);
  criar("path", { d: "M-122 46 h22" }, vento);
  criar("path", { d: "M-118 58 h14 q8 0 8 7" }, vento);
}

/* Árvore grande e sozinha, um poste com fio e riscos de vento. */
function desenhoArvore(g) {
  criar("ellipse", { cx: -8, cy: 34, rx: 30, ry: 7, fill: "#000000", opacity: 0.15 }, g);
  criar("rect", { x: -13, y: 2, width: 10, height: 32, fill: "#7a4b22", stroke: "#1a1a1a", "stroke-width": 2 }, g);
  criar("circle", { cx: -8, cy: -12, r: 26, fill: "#2f7d3a", stroke: "#1a1a1a", "stroke-width": 2.5 }, g);
  criar("circle", { cx: -17, cy: -21, r: 10, fill: "#5aa84f" }, g);
  // Poste com o fio saindo para fora do mapa
  criar("rect", { x: 26, y: -24, width: 6, height: 58, fill: "#8d8d8d", stroke: "#1a1a1a", "stroke-width": 1.8 }, g);
  criar("rect", { x: 18, y: -24, width: 22, height: 5, fill: "#8d8d8d", stroke: "#1a1a1a", "stroke-width": 1.5 }, g);
  criar("path", { d: "M39 -20 q14 10 30 2", fill: "none", stroke: "#1a1a1a", "stroke-width": 2 }, g);
  // Vento
  var vento = criar("g", { fill: "none", stroke: "#1f6fa8", "stroke-width": 3, "stroke-linecap": "round" }, g);
  criar("path", { d: "M-62 -30 h18 q8 0 8 -7" }, vento);
  criar("path", { d: "M-66 -16 h22" }, vento);
  criar("path", { d: "M-62 -2 h16 q8 0 8 7" }, vento);
}

/* Estiagem: açude grande quase seco (fundo rachado e uma poça), ossada de
   boi, lavoura murcha e um arbusto seco. Tudo em volta do ponto 4. */
function desenhoAcude(g) {
  // Açude: margem de barro, fundo rachado e só uma poça no meio
  criar("path", {
    d: "M-78 -4 C-76 -44 -20 -58 18 -50 C58 -42 74 -8 62 20 C48 50 -10 56 -48 44 C-74 34 -80 16 -78 -4 Z",
    fill: "#c9a26b", stroke: "#7a4b22", "stroke-width": 3
  }, g);
  criar("path", {
    d: "M-62 -2 C-60 -32 -16 -44 14 -38 C46 -32 58 -6 48 14 C36 38 -10 42 -40 32 C-60 24 -64 12 -62 -2 Z",
    fill: "#d9b47c"
  }, g);
  var rachaduras = criar("g", { fill: "none", stroke: "#7a4b22", "stroke-width": 1.8, "stroke-linecap": "round" }, g);
  criar("path", { d: "M-54 -6 l14 8 l-6 14 M-40 2 l16 -6 M-20 -36 l6 14 l-12 10 M24 -30 l-8 16 l14 8 M-34 26 l12 -10 l14 6 M30 10 l14 -6 l6 12 M6 26 l-4 -10" }, rachaduras);
  criar("ellipse", { cx: 2, cy: -2, rx: 16, ry: 8, fill: "#4fa3e3", stroke: "#1f6fa8", "stroke-width": 2 }, g);

  // Ossada de boi: caveira com chifres e costelas, em cima do açude
  var boi = criar("g", { transform: "translate(-50 -96)" }, g);
  var osso = { fill: "#fbf7ec", stroke: "#1a1a1a", "stroke-width": 2, "stroke-linejoin": "round" };
  criar("path", Object.assign({ d: "M-10 -6 C-22 -10 -30 -20 -32 -30 C-24 -22 -16 -18 -8 -14 Z" }, osso), boi);
  criar("path", Object.assign({ d: "M10 -6 C22 -10 30 -20 32 -30 C24 -22 16 -18 8 -14 Z" }, osso), boi);
  criar("path", Object.assign({ d: "M-13 -14 C-13 -20 13 -20 13 -14 L10 6 C8 16 -8 16 -10 6 Z" }, osso), boi);
  criar("ellipse", { cx: -6, cy: -8, rx: 3.6, ry: 3, fill: "#1a1a1a" }, boi);
  criar("ellipse", { cx: 6, cy: -8, rx: 3.6, ry: 3, fill: "#1a1a1a" }, boi);
  criar("path", { d: "M-3 8 l0 3 M3 8 l0 3", stroke: "#1a1a1a", "stroke-width": 2, "stroke-linecap": "round" }, boi);
  var costelas = criar("g", { transform: "translate(36 4)" }, boi);
  criar("path", Object.assign({ d: "M-4 -2 L52 -2 L52 3 L-4 3 Z" }, osso), costelas);
  for (var c = 0; c < 5; c++) {
    var x = 4 + c * 11;
    criar("path", { d: "M" + x + " 3 q-8 10 -2 20 M" + x + " -2 q-8 -10 -2 -20", fill: "none", stroke: "#1a1a1a", "stroke-width": 5.5, "stroke-linecap": "round" }, costelas);
    criar("path", { d: "M" + x + " 3 q-8 10 -2 20 M" + x + " -2 q-8 -10 -2 -20", fill: "none", stroke: "#fbf7ec", "stroke-width": 3, "stroke-linecap": "round" }, costelas);
  }

  // Lavoura murcha: fileiras de pés de milho secos, embaixo à direita
  for (var linha = 0; linha < 3; linha++) {
    for (var col = 0; col < 5; col++) {
      var px = 36 + col * 16 - linha * 4, py = 66 + linha * 18;
      criar("path", {
        d: "M" + px + " " + (py + 8) + " l0 -14 M" + px + " " + (py + 1) + " q-7 -2 -9 4 M" + px + " " + (py - 3) + " q7 -2 8 5",
        fill: "none", stroke: "#a07a1a", "stroke-width": 2.4, "stroke-linecap": "round"
      }, g);
    }
  }

  // Arbusto seco, só galhos
  var arbusto = criar("g", { transform: "translate(92 -40)", fill: "none", stroke: "#6b4423", "stroke-width": 2.4, "stroke-linecap": "round" }, g);
  criar("path", { d: "M0 18 L0 0 M0 6 l-10 -10 M0 2 l9 -12 M-6 0 l-4 -8 M5 -4 l6 -2" }, arbusto);
}

/* Escola: prédio comprido com torre do sino, placa ESCOLA, fileira de
   janelas e bandeira do Brasil no mastro. É o abrigo no topo do morro. */
function desenhoEscola(g) {
  criar("ellipse", { cx: 3, cy: 28, rx: 58, ry: 7, fill: "#000000", opacity: 0.15 }, g);
  // Prédio de tijolos e telhado
  criar("rect", { x: -48, y: -12, width: 96, height: 40, fill: "#e8735a", stroke: "#1a1a1a", "stroke-width": 2.5 }, g);
  criar("path", { d: "M-54 -10 L-40 -26 L40 -26 L54 -10 Z", fill: "#8b3a2b", stroke: "#1a1a1a", "stroke-width": 2.5, "stroke-linejoin": "round" }, g);
  // Torre do sino
  criar("rect", { x: -11, y: -46, width: 22, height: 22, fill: "#fff3d6", stroke: "#1a1a1a", "stroke-width": 2.2 }, g);
  criar("path", { d: "M-15 -45 L0 -60 L15 -45 Z", fill: "#8b3a2b", stroke: "#1a1a1a", "stroke-width": 2.2, "stroke-linejoin": "round" }, g);
  criar("path", { d: "M-6 -28 q0 -12 6 -12 q6 0 6 12 Z", fill: "#ffd23f", stroke: "#1a1a1a", "stroke-width": 1.6 }, g);
  // Placa
  criar("rect", { x: -30, y: -8, width: 60, height: 14, rx: 3, fill: "#ffffff", stroke: "#1a1a1a", "stroke-width": 1.8 }, g);
  escrever(g, "ESCOLA", 0, 3.5, { "font-size": 11, "font-weight": "bold", fill: "#1d6b40", "letter-spacing": "1" });
  // Janelas e porta
  var janelas = [-42, -28, 16, 30];
  for (var i = 0; i < janelas.length; i++) {
    criar("rect", { x: janelas[i], y: 10, width: 11, height: 10, fill: "#9ad0ff", stroke: "#1a1a1a", "stroke-width": 1.6 }, g);
  }
  criar("rect", { x: -9, y: 10, width: 18, height: 18, fill: "#8a5a2b", stroke: "#1a1a1a", "stroke-width": 2 }, g);
  criar("line", { x1: 0, y1: 10, x2: 0, y2: 28, stroke: "#1a1a1a", "stroke-width": 1.4 }, g);
  // Mastro com a bandeira do Brasil
  criar("rect", { x: -66, y: -50, width: 3, height: 78, fill: "#3b2a1a" }, g);
  criar("rect", { x: -63, y: -50, width: 26, height: 18, fill: "#1f9e44", stroke: "#1a1a1a", "stroke-width": 1.4 }, g);
  criar("path", { d: "M-60 -41 L-50 -48 L-40 -41 L-50 -34 Z", fill: "#ffd23f" }, g);
  criar("circle", { cx: -50, cy: -41, r: 4, fill: "#1f4fa8" }, g);
}

var DESENHOS_DOS_PONTOS = { casa: desenhoCasa, altaTensao: desenhoAltaTensao, casaDaEncosta: desenhoCasaDaEncosta, casaDoRio: desenhoCasaDoRio, arvore: desenhoArvore, acude: desenhoAcude, escola: desenhoEscola };

function desenharPontos(svg) {
  for (var i = 0; i < PONTOS_DO_MAPA.length; i++) {
    var ponto = PONTOS_DO_MAPA[i];
    var g = criar("g", { transform: "translate(" + ponto.x + " " + ponto.y + ")" }, svg);
    DESENHOS_DOS_PONTOS[ponto.desenho](g);
    // Número do ponto
    var n = criar("g", { transform: "translate(" + ponto.numeroEm[0] + " " + ponto.numeroEm[1] + ")" }, g);
    criar("circle", { r: 20, fill: "#1a1a1a", opacity: 0.18, cx: 2, cy: 3 }, n);
    criar("circle", { r: 18, fill: "#ffe066", stroke: "#1a1a1a", "stroke-width": 4 }, n);
    escrever(n, ponto.numero, 0, 8.5, { "font-size": 24, "font-weight": "bold", fill: "#1a1a1a" });
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
  desenharZonaSeca(svg);
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
