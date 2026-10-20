/* ==========================================================================
   ROLETA.JS — DESENHO E GIRO DA ROLETA, ÍCONES DOS TEMAS E CONFETE
   ==========================================================================

   Partes deste arquivo:
     1. ICONES   — desenhos simples de cada tema (gota, morro, sol...)
     2. Roleta   — desenha a roleta e faz ela girar, com "tique" a cada fatia
     3. Confete  — chuva de papeizinhos quando a roleta para

   Normalmente não é preciso mexer aqui. Nomes e cores dos temas ficam em
   config.js.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. ÍCONES DOS TEMAS
   Cada ícone é um desenho num quadrado de 24 x 24 (formato "caminho SVG").
   "regra" diz como pintar desenhos com furo ("evenodd" = o furo fica vazio).
   -------------------------------------------------------------------------- */
var ICONES = {
  // gota de água
  enchentes: {
    regra: "nonzero",
    caminho: "M12 1.5 C12 1.5 4.5 10 4.5 15 A7.5 7.5 0 0 0 19.5 15 C19.5 10 12 1.5 12 1.5 Z"
  },
  // morro com pedras rolando
  deslizamentos: {
    regra: "nonzero",
    caminho: "M1 22 L9 8 L13 14 L15.5 11 L23 22 Z " +
             "M17.4 12.5 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0 Z " +
             "M20.2 16 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0 Z " +
             "M15.8 8.8 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 Z"
  },
  // sol forte
  estiagem: {
    regra: "nonzero",
    caminho: "M7 12 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0 Z " +
             "M19.0 13.7 L23.2 12.0 L19.0 10.3 Z M15.7 18.2 L19.9 19.9 L18.2 15.7 Z " +
             "M10.3 19.0 L12.0 23.2 L13.7 19.0 Z M5.8 15.7 L4.1 19.9 L8.3 18.2 Z " +
             "M5.0 10.3 L0.8 12.0 L5.0 13.7 Z M8.3 5.8 L4.1 4.1 L5.8 8.3 Z " +
             "M13.7 5.0 L12.0 0.8 L10.3 5.0 Z M18.2 8.3 L19.9 4.1 L15.7 5.8 Z"
  },
  // nuvem com pedras de granizo
  vendaval: {
    regra: "nonzero",
    caminho: "M4 10.5 a4 4 0 1 1 8 0 a4 4 0 1 1 -8 0 Z " +
             "M8 7.5 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0 Z " +
             "M14 10.5 a3.5 3.5 0 1 1 7 0 a3.5 3.5 0 1 1 -7 0 Z " +
             "M8 10 H17.5 V14.5 H8 Z " +
             "M6.3 18.5 a1.7 1.7 0 1 1 3.4 0 a1.7 1.7 0 1 1 -3.4 0 Z " +
             "M10.8 21 a1.7 1.7 0 1 1 3.4 0 a1.7 1.7 0 1 1 -3.4 0 Z " +
             "M15.3 18.5 a1.7 1.7 0 1 1 3.4 0 a1.7 1.7 0 1 1 -3.4 0 Z"
  },
  // marcador de mapa (com furo no meio)
  mapas: {
    regra: "evenodd",
    caminho: "M12 1.5 A7.5 7.5 0 0 0 4.5 9 C4.5 14.5 12 22.5 12 22.5 C12 22.5 19.5 14.5 19.5 9 A7.5 7.5 0 0 0 12 1.5 Z " +
             "M8.8 9 a3.2 3.2 0 1 0 6.4 0 a3.2 3.2 0 1 0 -6.4 0 Z"
  },
  // mochila (alça, corpo e bolso)
  mochila: {
    regra: "evenodd",
    caminho: "M9.2 7 V5.2 a2.8 2.8 0 0 1 5.6 0 V7 H13.2 V5.2 a1.2 1.2 0 0 0 -2.4 0 V7 Z " +
             "M8 7 H16 a3 3 0 0 1 3 3 V19 a3 3 0 0 1 -3 3 H8 a3 3 0 0 1 -3 -3 V10 a3 3 0 0 1 3 -3 Z " +
             "M8 13.5 H16 V19.5 H8 Z " +
             "M9.3 14.8 H14.7 V18.2 H9.3 Z"
  }
};

/* Cria o ícone de um tema para usar dentro da página (fora da roleta). */
function criarIconeSVG(chaveTema) {
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "icone-tema");
  var icone = ICONES[chaveTema];
  if (icone) {
    var desenho = document.createElementNS(ns, "path");
    desenho.setAttribute("d", icone.caminho);
    desenho.setAttribute("fill-rule", icone.regra);
    desenho.setAttribute("fill", "currentColor");
    svg.appendChild(desenho);
  }
  return svg;
}


/* --------------------------------------------------------------------------
   2. ROLETA
   A roleta é desenhada uma vez num <canvas>. Para girar, o canvas inteiro é
   rodado (transform: rotate). O ponteiro fica parado no topo.
   -------------------------------------------------------------------------- */
var Roleta = {
  canvas: null,
  ponteiro: null,
  temas: [],        // lista de temas (de CONFIG.temas)
  angulo: 0,        // quanto a roleta está girada, em graus (sentido horário)
  girando: false,

  /* Prepara a roleta. Chamado uma vez quando a página abre. */
  iniciar: function (canvas, ponteiro, temas) {
    this.canvas = canvas;
    this.ponteiro = ponteiro;
    this.temas = temas;
    // Começa com o ponteiro no meio da primeira fatia (e não numa divisa).
    this.angulo = 360 - this.tamanhoFatia() / 2;
    this.aplicarAngulo();
  },

  /* Tamanho de cada fatia, em graus. */
  tamanhoFatia: function () {
    return 360 / this.temas.length;
  },

  /* Gira o canvas na tela até o ângulo atual. */
  aplicarAngulo: function () {
    this.canvas.style.transform = "rotate(" + this.angulo + "deg)";
  },

  /* Qual fatia está embaixo do ponteiro quando a roleta está no ângulo dado.
     A roleta gira no sentido horário; o ponteiro fica no topo. */
  fatiaNoPonteiro: function (angulo) {
    var pontoDaRoda = (((360 - angulo) % 360) + 360) % 360;
    return Math.floor(pontoDaRoda / this.tamanhoFatia()) % this.temas.length;
  },

  /* Desenha a roleta inteira. Chamado ao mostrar a tela e ao mudar o tamanho
     da janela. */
  desenhar: function () {
    var canvas = this.canvas;
    var tamanho = canvas.clientWidth;
    if (!tamanho) return; // roleta escondida: desenha depois
    var nitidez = window.devicePixelRatio || 1;
    canvas.width = Math.round(tamanho * nitidez);
    canvas.height = Math.round(tamanho * nitidez);

    var ctx = canvas.getContext("2d");
    ctx.setTransform(nitidez, 0, 0, nitidez, 0, 0);
    ctx.clearRect(0, 0, tamanho, tamanho);

    var centro = tamanho / 2;
    var raioTotal = tamanho / 2;
    var raio = raioTotal * 0.92;          // raio das fatias (dentro do aro)
    var fatia = (Math.PI * 2) / this.temas.length;
    var fonte = getComputedStyle(document.body).fontFamily;

    // Aro escuro com bolinhas (parece roleta de programa de auditório)
    ctx.beginPath();
    ctx.arc(centro, centro, raioTotal, 0, Math.PI * 2);
    ctx.fillStyle = "#2b2b2b";
    ctx.fill();
    var bolinhas = this.temas.length * 4;
    for (var b = 0; b < bolinhas; b++) {
      var ab = (b / bolinhas) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(centro + Math.cos(ab) * raioTotal * 0.96, centro + Math.sin(ab) * raioTotal * 0.96,
              raioTotal * 0.018, 0, Math.PI * 2);
      ctx.fillStyle = (b % 2 === 0) ? "#ffd166" : "#ffffff";
      ctx.fill();
    }

    // Tamanho de letra que cabe em TODAS as fatias (fica igual em todas)
    var tamanhoLetra = this.letraQueCabe(ctx, raio, fatia, fonte);

    // Fatias
    for (var i = 0; i < this.temas.length; i++) {
      var tema = this.temas[i];
      // A fatia 0 começa no topo (-90°) e as próximas seguem no sentido horário.
      var inicio = -Math.PI / 2 + i * fatia;

      ctx.beginPath();
      ctx.moveTo(centro, centro);
      ctx.arc(centro, centro, raio, inicio, inicio + fatia);
      ctx.closePath();
      ctx.fillStyle = tema.cor;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Gira o "papel" para que o meio da fatia aponte para cima.
      ctx.save();
      ctx.translate(centro, centro);
      ctx.rotate(inicio + fatia / 2 + Math.PI / 2);

      // Ícone (mais perto do centro)
      var icone = ICONES[tema.chave];
      if (icone) {
        var lado = raio * 0.24;
        ctx.save();
        ctx.translate(-lado / 2, -raio * 0.40 - lado / 2);
        ctx.scale(lado / 24, lado / 24);
        ctx.fillStyle = "#ffffff";
        ctx.fill(new Path2D(icone.caminho), icone.regra);
        ctx.restore();
      }

      // Nome do tema (mais perto da borda), em até 2 linhas
      var linhas = this.quebrarLinhas(ctx, tema.nome, tamanhoLetra, raio, fatia, fonte);
      ctx.font = "bold " + tamanhoLetra + "px " + fonte;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      for (var l = 0; l < linhas.length; l++) {
        var y = -this.raioDaLinha(raio, tamanhoLetra, l);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
        ctx.strokeText(linhas[l], 0, y);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(linhas[l], 0, y);
      }
      ctx.restore();
    }

    // Miolo da roleta
    ctx.beginPath();
    ctx.arc(centro, centro, raio * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = raio * 0.03;
    ctx.strokeStyle = "#2b2b2b";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centro, centro, raio * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd166";
    ctx.fill();
  },

  /* Distância do centro até a linha de texto número "l" (0 = mais perto da borda). */
  raioDaLinha: function (raio, tamanhoLetra, l) {
    return raio * 0.80 - l * tamanhoLetra * 1.15;
  },

  /* Largura disponível para uma linha de texto, dentro da fatia. */
  larguraDisponivel: function (raio, tamanhoLetra, fatia, l) {
    var r = this.raioDaLinha(raio, tamanhoLetra, l) - tamanhoLetra / 2;
    return 2 * r * Math.tan(fatia / 2) * 0.88;
  },

  /* Quebra o nome em linhas que cabem na fatia. Devolve null se não couber. */
  quebrarLinhas: function (ctx, nome, tamanhoLetra, raio, fatia, fonte) {
    ctx.font = "bold " + tamanhoLetra + "px " + fonte;
    var palavras = nome.split(" ");
    var linhas = [];
    var atual = "";
    for (var p = 0; p < palavras.length; p++) {
      var tentativa = atual ? atual + " " + palavras[p] : palavras[p];
      var limite = this.larguraDisponivel(raio, tamanhoLetra, fatia, linhas.length);
      if (ctx.measureText(tentativa).width <= limite) {
        atual = tentativa;
      } else {
        if (!atual) return null; // uma palavra sozinha já não cabe
        linhas.push(atual);
        atual = palavras[p];
        limite = this.larguraDisponivel(raio, tamanhoLetra, fatia, linhas.length);
        if (ctx.measureText(atual).width > limite) return null;
      }
    }
    if (atual) linhas.push(atual);
    return linhas.length <= 2 ? linhas : null;
  },

  /* Procura o maior tamanho de letra em que todos os nomes cabem. */
  letraQueCabe: function (ctx, raio, fatia, fonte) {
    for (var t = Math.round(raio * 0.11); t > 10; t--) {
      var cabeTudo = true;
      for (var i = 0; i < this.temas.length; i++) {
        if (!this.quebrarLinhas(ctx, this.temas[i].nome, t, raio, fatia, fonte)) {
          cabeTudo = false;
          break;
        }
      }
      if (cabeTudo) return t;
    }
    return 10;
  },

  /* Faz a roleta girar e parar na fatia "indice".
     O tema já foi sorteado antes; a animação só mostra o resultado.
     aoParar: função chamada quando a roleta para. */
  girar: function (indice, aoParar) {
    if (this.girando) return;
    this.girando = true;

    var fatia = this.tamanhoFatia();
    // Ponto da fatia sorteada onde o ponteiro vai parar: longe das divisas
    // (entre 20% e 80% da fatia), para não haver dúvida.
    var alvoNaRoda = indice * fatia + fatia * (0.2 + Math.random() * 0.6);
    var atual = ((this.angulo % 360) + 360) % 360;
    var falta = ((360 - alvoNaRoda) - atual + 720) % 360;
    var voltas = 4 + Math.floor(Math.random() * 2);   // 4 ou 5 voltas inteiras
    var anguloInicial = this.angulo;
    var giroTotal = falta + voltas * 360;
    var duracao = 3000 + Math.random() * 1000;        // entre 3 e 4 segundos

    var roleta = this;
    var comeco = null;
    var fatiaAnterior = this.fatiaNoPonteiro(this.angulo);

    function quadro(agora) {
      if (comeco === null) comeco = agora;
      var progresso = Math.min((agora - comeco) / duracao, 1);
      // Começa rápido e vai freando devagar até parar.
      var freio = 1 - Math.pow(1 - progresso, 4);
      roleta.angulo = anguloInicial + giroTotal * freio;
      roleta.aplicarAngulo();

      // "Tique" cada vez que uma divisa passa pelo ponteiro
      var fatiaAgora = roleta.fatiaNoPonteiro(roleta.angulo);
      if (fatiaAgora !== fatiaAnterior) {
        fatiaAnterior = fatiaAgora;
        Sons.tique();
        roleta.baterPonteiro();
      }

      if (progresso < 1) {
        requestAnimationFrame(quadro);
      } else {
        roleta.angulo = roleta.angulo % 360; // evita números enormes
        roleta.aplicarAngulo();
        roleta.girando = false;
        if (aoParar) aoParar(indice);
      }
    }
    requestAnimationFrame(quadro);
  },

  /* Faz o ponteiro "bater" (animação definida em estilo.css). */
  baterPonteiro: function () {
    var p = this.ponteiro;
    p.classList.remove("bate");
    void p.offsetWidth; // reinicia a animação
    p.classList.add("bate");
  }
};


/* --------------------------------------------------------------------------
   3. CONFETE
   Papeizinhos coloridos que saltam de um ponto e caem com "gravidade".
   -------------------------------------------------------------------------- */
var Confete = {
  canvas: null,
  pedacos: [],
  animando: false,
  cores: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c", "#ffffff"],

  iniciar: function (canvas) {
    this.canvas = canvas;
  },

  /* Solta confete a partir do ponto (x, y) da tela. */
  soltar: function (x, y) {
    var nitidez = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(window.innerWidth * nitidez);
    this.canvas.height = Math.round(window.innerHeight * nitidez);

    for (var i = 0; i < 160; i++) {
      var direcao = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1; // para cima, em leque
      var forca = 500 + Math.random() * 700;
      this.pedacos.push({
        x: x, y: y,
        vx: Math.cos(direcao) * forca,
        vy: Math.sin(direcao) * forca,
        largura: 8 + Math.random() * 8,
        altura: 5 + Math.random() * 5,
        cor: this.cores[Math.floor(Math.random() * this.cores.length)],
        giro: Math.random() * Math.PI * 2,
        velocidadeGiro: (Math.random() - 0.5) * 12,
        vida: 0
      });
    }
    if (!this.animando) {
      this.animando = true;
      this.ultimoQuadro = null;
      requestAnimationFrame(this.quadro.bind(this));
    }
  },

  quadro: function (agora) {
    var dt = this.ultimoQuadro === null ? 0.016 : Math.min((agora - this.ultimoQuadro) / 1000, 0.05);
    this.ultimoQuadro = agora;

    var nitidez = window.devicePixelRatio || 1;
    var ctx = this.canvas.getContext("2d");
    ctx.setTransform(nitidez, 0, 0, nitidez, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var vivos = [];
    for (var i = 0; i < this.pedacos.length; i++) {
      var p = this.pedacos[i];
      p.vida += dt;
      p.vy += 1400 * dt;            // gravidade
      p.vx *= (1 - 1.2 * dt);       // resistência do ar
      p.vy *= (1 - 0.6 * dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.giro += p.velocidadeGiro * dt;
      if (p.y < window.innerHeight + 40 && p.vida < 4) {
        vivos.push(p);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.giro);
        ctx.scale(1, Math.cos(p.giro * 1.7)); // efeito de papel virando
        ctx.fillStyle = p.cor;
        ctx.fillRect(-p.largura / 2, -p.altura / 2, p.largura, p.altura);
        ctx.restore();
      }
    }
    this.pedacos = vivos;

    if (vivos.length > 0) {
      requestAnimationFrame(this.quadro.bind(this));
    } else {
      this.animando = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
};
