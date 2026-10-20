/* ==========================================================================
   JOGO.JS — FLUXO DO JOGO
   ==========================================================================

   Partes deste arquivo:
     1. Guardar dados no navegador (com segurança)
     2. Estado do jogo (configurações e partida)
     3. Troca de telas
     4. Tela inicial
     5. Configurações
     6. Roleta
     7. Som e tela cheia
     8. Janela de confirmação
     9. Teclado
    10. Início (liga tudo quando a página abre)
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. GUARDAR DADOS NO NAVEGADOR
   Usa o localStorage. Se o navegador não deixar (modo anônimo, arquivo
   aberto direto do disco em alguns navegadores...), o jogo funciona igual,
   só não lembra das coisas depois de recarregar a página.
   -------------------------------------------------------------------------- */
var CHAVE_AJUSTES = "pachamama_ajustes_v1";
var CHAVE_PARTIDA = "pachamama_partida_v1";

function lerSalvo(chave) {
  try {
    var texto = window.localStorage.getItem(chave);
    return texto ? JSON.parse(texto) : null;
  } catch (erro) {
    return null;
  }
}

function salvar(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    // Sem localStorage: segue sem salvar.
  }
}


/* --------------------------------------------------------------------------
   2. ESTADO DO JOGO
   -------------------------------------------------------------------------- */

// Configurações escolhidas pela professora (começam com os padrões do config.js)
var ajustes = carregarAjustes();

// Partida em andamento (nível, rodada...). null = nenhuma partida.
var partida = carregarPartida();

var telaAtual = "inicial";

function carregarAjustes() {
  var salvos = lerSalvo(CHAVE_AJUSTES) || {};
  var resultado = {};
  for (var nome in CONFIG.padroes) {
    resultado[nome] = (nome in salvos) ? salvos[nome] : CONFIG.padroes[nome];
  }
  return resultado;
}

function salvarAjustes() {
  salvar(CHAVE_AJUSTES, ajustes);
}

function carregarPartida() {
  var salva = lerSalvo(CHAVE_PARTIDA);
  if (!salva || !CONFIG.niveis[salva.nivel]) return null;
  return salva;
}

function salvarPartida() {
  salvar(CHAVE_PARTIDA, partida);
}

/* Começa uma partida nova no nível escolhido.
   Partida nova = outra turma: a rodada volta para 1 e as perguntas usadas
   são zeradas. */
function novaPartida(nivel) {
  partida = {
    nivel: nivel,
    rodada: 1,            // número da rodada atual
    rodadaJogada: false,  // a roleta já girou nesta rodada?
    usadas: []            // perguntas já usadas nesta partida
  };
  salvarPartida();
  mostrarTela("roleta");
}

/* A partida já começou de verdade (a roleta já girou alguma vez)? */
function partidaComecou() {
  return partida !== null && (partida.rodada > 1 || partida.rodadaJogada);
}

function nomeDoNivel(nivel) {
  return CONFIG.niveis[nivel].nome;
}


/* --------------------------------------------------------------------------
   3. TROCA DE TELAS
   Cada tela é uma <section class="tela"> no index.html. Só uma aparece.
   -------------------------------------------------------------------------- */
function mostrarTela(nome) {
  var telas = document.querySelectorAll(".tela");
  for (var i = 0; i < telas.length; i++) telas[i].classList.remove("ativa");
  document.getElementById("tela-" + nome).classList.add("ativa");
  telaAtual = nome;

  // A barra do topo só aparece durante o jogo
  var emJogo = (nome === "roleta");
  document.getElementById("barra-jogo").hidden = !emJogo;
  document.body.classList.toggle("em-jogo", emJogo);
  document.body.classList.toggle("na-config", nome === "config");

  if (nome === "inicial") atualizarTelaInicial();
  if (nome === "config") atualizarTelaConfig();
  if (nome === "roleta") prepararTelaRoleta();
}

/* Volta para a tela inicial. A partida NÃO é apagada: aparece o botão
   "Continuar partida". */
function irParaInicio() {
  if (Roleta.girando) return;
  mostrarTela("inicial");
}


/* --------------------------------------------------------------------------
   4. TELA INICIAL
   -------------------------------------------------------------------------- */

/* Cria uma forma (▲ ● ■ ★) para a letra A, B, C ou D. */
function criarForma(letra) {
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "forma");
  svg.setAttribute("aria-hidden", "true");
  var uso = document.createElementNS(ns, "use");
  uso.setAttribute("href", "#forma-" + letra);
  svg.appendChild(uso);
  return svg;
}

/* Monta os botões dos níveis e os ícones dos temas (uma vez só). */
function montarTelaInicial() {
  var caixaIcones = document.getElementById("icones-temas");
  for (var t = 0; t < CONFIG.temas.length; t++) {
    var bolinha = document.createElement("span");
    bolinha.style.background = CONFIG.temas[t].cor;
    bolinha.title = CONFIG.temas[t].nome;
    bolinha.appendChild(criarIconeSVG(CONFIG.temas[t].chave));
    caixaIcones.appendChild(bolinha);
  }

  var caixaNiveis = document.getElementById("botoes-nivel");
  var letras = ["A", "B", "C", "D"];
  for (var chave in CONFIG.niveis) {
    var nivel = CONFIG.niveis[chave];
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-nivel";
    botao.setAttribute("data-nivel", chave);

    var nome = document.createElement("span");
    nome.className = "nome-nivel";
    nome.textContent = nivel.nome;
    var publico = document.createElement("span");
    publico.className = "publico-nivel";
    publico.textContent = nivel.publico;
    botao.title = nivel.opcoes + " opções de resposta";
    var formas = document.createElement("span");
    formas.className = "formas";
    for (var f = 0; f < nivel.opcoes; f++) formas.appendChild(criarForma(letras[f]));

    botao.appendChild(nome);
    botao.appendChild(publico);
    botao.appendChild(formas);
    botao.addEventListener("click", aoEscolherNivel);
    caixaNiveis.appendChild(botao);
  }
}

function aoEscolherNivel(evento) {
  var nivel = evento.currentTarget.getAttribute("data-nivel");
  if (partidaComecou()) {
    confirmar(
      "Começar nova partida?",
      "A partida atual (" + nomeDoNivel(partida.nivel) + ", rodada " + partida.rodada +
        ") será encerrada e as perguntas usadas serão zeradas.",
      "Sim, nova partida",
      "Não, voltar",
      function () { novaPartida(nivel); }
    );
  } else {
    novaPartida(nivel);
  }
}

function atualizarTelaInicial() {
  var botaoContinuar = document.getElementById("botao-continuar");
  if (partidaComecou()) {
    botaoContinuar.textContent = "Continuar partida (" + nomeDoNivel(partida.nivel) +
      ", rodada " + partida.rodada + ")";
    botaoContinuar.hidden = false;
  } else {
    botaoContinuar.hidden = true;
  }
}


/* --------------------------------------------------------------------------
   5. CONFIGURAÇÕES
   -------------------------------------------------------------------------- */

// Limites dos contadores da tela de configurações
var CHANCE_MINIMA = 5, CHANCE_MAXIMA = 100, PASSO_CHANCE = 5;
var INTERVALO_MINIMO = CONFIG.evento.nuncaAntesDaRodada;   // não pode cair nas rodadas proibidas
var INTERVALO_MAXIMO = CONFIG.evento.garantidoNaRodada;    // garante pelo menos 1 alerta

/* Mostra um botão LIGADO/DESLIGADO de acordo com o valor. */
function marcarAlternar(id, ligado) {
  var botao = document.getElementById(id);
  botao.setAttribute("aria-pressed", ligado ? "true" : "false");
  botao.textContent = ligado ? "LIGADO" : "DESLIGADO";
}

function atualizarTelaConfig() {
  marcarAlternar("aj-evento", ajustes.eventoLigado);
  marcarAlternar("aj-contagem", ajustes.contagemLigada);
  marcarAlternar("aj-som", ajustes.somLigado);

  document.getElementById("bloco-frequencia").hidden = !ajustes.eventoLigado;
  var modoChance = (ajustes.eventoModo === "chance");
  document.getElementById("aj-modo-chance").setAttribute("aria-pressed", modoChance ? "true" : "false");
  document.getElementById("aj-modo-intervalo").setAttribute("aria-pressed", modoChance ? "false" : "true");
  document.getElementById("linha-chance").hidden = !modoChance;
  document.getElementById("linha-intervalo").hidden = modoChance;
  document.getElementById("aj-chance-valor").textContent = ajustes.eventoChance + "%";
  document.getElementById("aj-intervalo-valor").textContent = ajustes.eventoIntervalo + " rodadas";

  // Explicação em português do que vai acontecer
  var explica;
  if (modoChance) {
    explica = "Em cada rodada há " + ajustes.eventoChance + "% de chance de alerta. " +
      "Nunca acontece antes da rodada " + CONFIG.evento.nuncaAntesDaRodada +
      " nem em duas rodadas seguidas. Se não acontecer até a rodada " +
      CONFIG.evento.garantidoNaRodada + ", a rodada " + CONFIG.evento.garantidoNaRodada +
      " será de alerta.";
  } else {
    var n = ajustes.eventoIntervalo;
    explica = "O alerta acontece nas rodadas " + n + ", " + (2 * n) + ", " + (3 * n) + " e assim por diante.";
  }
  document.getElementById("explica-frequencia").textContent = explica;

  // Regras de cada nível (somente leitura; mudam no config.js)
  var lista = document.getElementById("lista-regras");
  lista.innerHTML = "";
  for (var chave in CONFIG.niveis) {
    var dt = document.createElement("dt");
    dt.textContent = nomeDoNivel(chave);
    var dd = document.createElement("dd");
    dd.textContent = CONFIG.evento.regras[chave] || "(sem regra no config.js)";
    lista.appendChild(dt);
    lista.appendChild(dd);
  }
}

/* Muda um ajuste, salva e redesenha a tela de configurações. */
function mudarAjuste(nome, valor) {
  ajustes[nome] = valor;
  salvarAjustes();
  if (nome === "somLigado") aplicarSom();
  atualizarTelaConfig();
}

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

function ligarTelaConfig() {
  document.getElementById("aj-evento").addEventListener("click", function () {
    mudarAjuste("eventoLigado", !ajustes.eventoLigado);
  });
  document.getElementById("aj-modo-chance").addEventListener("click", function () {
    mudarAjuste("eventoModo", "chance");
  });
  document.getElementById("aj-modo-intervalo").addEventListener("click", function () {
    mudarAjuste("eventoModo", "intervalo");
  });
  document.getElementById("aj-chance-menos").addEventListener("click", function () {
    mudarAjuste("eventoChance", limitar(ajustes.eventoChance - PASSO_CHANCE, CHANCE_MINIMA, CHANCE_MAXIMA));
  });
  document.getElementById("aj-chance-mais").addEventListener("click", function () {
    mudarAjuste("eventoChance", limitar(ajustes.eventoChance + PASSO_CHANCE, CHANCE_MINIMA, CHANCE_MAXIMA));
  });
  document.getElementById("aj-intervalo-menos").addEventListener("click", function () {
    mudarAjuste("eventoIntervalo", limitar(ajustes.eventoIntervalo - 1, INTERVALO_MINIMO, INTERVALO_MAXIMO));
  });
  document.getElementById("aj-intervalo-mais").addEventListener("click", function () {
    mudarAjuste("eventoIntervalo", limitar(ajustes.eventoIntervalo + 1, INTERVALO_MINIMO, INTERVALO_MAXIMO));
  });
  document.getElementById("aj-contagem").addEventListener("click", function () {
    mudarAjuste("contagemLigada", !ajustes.contagemLigada);
  });
  document.getElementById("aj-som").addEventListener("click", function () {
    mudarAjuste("somLigado", !ajustes.somLigado);
  });
  document.getElementById("aj-testar-som").addEventListener("click", function () {
    Sons.preparar();
    Sons.parada();
  });
  document.getElementById("aj-restaurar").addEventListener("click", function () {
    confirmar(
      "Restaurar padrões?",
      "Todas as configurações voltam para os valores do arquivo config.js.",
      "Sim, restaurar",
      "Não",
      function () {
        for (var nome in CONFIG.padroes) ajustes[nome] = CONFIG.padroes[nome];
        salvarAjustes();
        aplicarSom();
        atualizarTelaConfig();
      }
    );
  });
  document.getElementById("aj-voltar").addEventListener("click", function () {
    mostrarTela("inicial");
  });
}


/* --------------------------------------------------------------------------
   6. ROLETA
   -------------------------------------------------------------------------- */

function prepararTelaRoleta() {
  atualizarBarra();
  Roleta.desenhar(); // só dá para desenhar com a tela visível
}

function atualizarBarra() {
  if (!partida) return;
  document.getElementById("barra-nivel").textContent = nomeDoNivel(partida.nivel);
  document.getElementById("barra-rodada").textContent = "Rodada " + partida.rodada;
}

/* Botão GIRAR (ou tecla ESPAÇO, ou clique na roleta). */
function girar() {
  if (telaAtual !== "roleta" || Roleta.girando || !partida) return;
  Sons.preparar();

  // Se a roleta já girou nesta rodada, começa a próxima rodada.
  if (partida.rodadaJogada) partida.rodada++;
  partida.rodadaJogada = true;
  salvarPartida();
  atualizarBarra();

  // Sorteia o tema ANTES de girar; a animação só mostra o resultado.
  var indice = Math.floor(Math.random() * CONFIG.temas.length);

  var botao = document.getElementById("botao-girar");
  botao.disabled = true;
  botao.textContent = "GIRANDO...";
  document.getElementById("resultado").hidden = true;
  document.getElementById("dica-roleta").hidden = true;

  Roleta.girar(indice, aoPararRoleta);
}

function aoPararRoleta(indice) {
  var tema = CONFIG.temas[indice];
  Sons.parada();

  // Confete saindo do centro da roleta
  var caixa = document.getElementById("caixa-roleta").getBoundingClientRect();
  Confete.soltar(caixa.left + caixa.width / 2, caixa.top + caixa.height / 2);

  mostrarResultado(tema);

  var botao = document.getElementById("botao-girar");
  botao.disabled = false;
  botao.textContent = "GIRAR";
}

/* Mostra o cartão grande com o tema sorteado. */
function mostrarResultado(tema) {
  var cartao = document.getElementById("resultado");
  var nome = document.getElementById("resultado-tema");
  nome.innerHTML = "";
  nome.appendChild(criarIconeSVG(tema.chave));
  var texto = document.createElement("span");
  texto.textContent = tema.nome;
  nome.appendChild(texto);
  cartao.style.background = tema.cor;
  cartao.hidden = false;
}

function ligarTelaRoleta() {
  document.getElementById("botao-girar").addEventListener("click", girar);
  document.getElementById("caixa-roleta").addEventListener("click", girar);
}


/* --------------------------------------------------------------------------
   7. SOM E TELA CHEIA
   -------------------------------------------------------------------------- */

/* Aplica o ajuste de som e atualiza o botão da barra. */
function aplicarSom() {
  Sons.definirLigado(ajustes.somLigado);
  var botao = document.getElementById("botao-som");
  botao.textContent = ajustes.somLigado ? "Som: ligado" : "Som: desligado";
  botao.classList.toggle("desligado", !ajustes.somLigado);
}

function alternarSom() {
  ajustes.somLigado = !ajustes.somLigado;
  salvarAjustes();
  aplicarSom();
  if (telaAtual === "config") atualizarTelaConfig();
}

function estaEmTelaCheia() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function alternarTelaCheia() {
  try {
    var pedido;
    if (!estaEmTelaCheia()) {
      var pagina = document.documentElement;
      pedido = pagina.requestFullscreen ? pagina.requestFullscreen() :
               pagina.webkitRequestFullscreen ? pagina.webkitRequestFullscreen() : null;
    } else {
      pedido = document.exitFullscreen ? document.exitFullscreen() :
               document.webkitExitFullscreen ? document.webkitExitFullscreen() : null;
    }
    if (pedido && pedido.catch) pedido.catch(function () {});
  } catch (erro) {
    // Navegador sem tela cheia: ignora.
  }
}

function atualizarBotoesTelaCheia() {
  var texto = estaEmTelaCheia() ? "Sair da tela cheia" : "Tela cheia";
  document.getElementById("botao-tela-cheia").textContent = texto;
  document.getElementById("botao-tela-cheia-inicio").textContent = texto;
  // A roleta muda de tamanho: redesenha
  if (telaAtual === "roleta") setTimeout(function () { Roleta.desenhar(); }, 100);
}


/* --------------------------------------------------------------------------
   8. JANELA DE CONFIRMAÇÃO
   Usada antes de ações que apagam algo (nova partida, reiniciar...).
   -------------------------------------------------------------------------- */
var acaoAoConfirmar = null;

function confirmar(titulo, texto, textoSim, textoNao, acao) {
  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal-texto").textContent = texto;
  document.getElementById("modal-sim").textContent = textoSim;
  document.getElementById("modal-nao").textContent = textoNao;
  acaoAoConfirmar = acao;
  document.getElementById("modal").hidden = false;
}

function fecharModal() {
  document.getElementById("modal").hidden = true;
  acaoAoConfirmar = null;
}

function modalAberto() {
  return !document.getElementById("modal").hidden;
}

function ligarModal() {
  document.getElementById("modal-sim").addEventListener("click", function () {
    var acao = acaoAoConfirmar;
    fecharModal();
    if (acao) acao();
  });
  document.getElementById("modal-nao").addEventListener("click", fecharModal);
}

/* Tecla R: reiniciar a partida (mesmo nível, rodada 1, perguntas zeradas). */
function pedirReinicio() {
  if (!partida || telaAtual === "inicial" || telaAtual === "config" || Roleta.girando) return;
  confirmar(
    "Reiniciar a partida?",
    "Volta para a rodada 1 e zera as perguntas usadas. O nível continua " +
      nomeDoNivel(partida.nivel) + ".",
    "Sim, reiniciar",
    "Não",
    function () { novaPartida(partida.nivel); }
  );
}


/* --------------------------------------------------------------------------
   9. TECLADO (atalhos opcionais)
   ESPAÇO girar/próxima · ENTER revelar · M som · F tela cheia
   R reiniciar · ESC tela inicial
   -------------------------------------------------------------------------- */
function aoApertarTecla(evento) {
  // Não atrapalha os atalhos do próprio navegador (Ctrl+R, Ctrl+P...)
  if (evento.ctrlKey || evento.altKey || evento.metaKey) return;

  var tecla = evento.key;
  var ehEspaco = (tecla === " " || tecla === "Spacebar");

  // ESPAÇO e ENTER nunca "clicam" no botão que estiver selecionado,
  // senão a ação aconteceria duas vezes.
  if (ehEspaco || tecla === "Enter") evento.preventDefault();
  if (evento.repeat) return; // tecla segurada: ignora as repetições

  // Com a janela de confirmação aberta, só o ESC funciona (= "Não").
  if (modalAberto()) {
    if (tecla === "Escape") fecharModal();
    return;
  }

  if (ehEspaco) {
    if (telaAtual === "roleta") girar();
  } else if (tecla === "Enter") {
    // Revelar a resposta: entra na fase 2.
  } else if (tecla === "m" || tecla === "M") {
    alternarSom();
  } else if (tecla === "f" || tecla === "F") {
    alternarTelaCheia();
  } else if (tecla === "r" || tecla === "R") {
    pedirReinicio();
  } else if (tecla === "Escape") {
    // Em tela cheia, o ESC é do navegador (sai da tela cheia).
    // O próximo ESC volta para a tela inicial.
    if (!estaEmTelaCheia() && telaAtual !== "inicial") irParaInicio();
  }
}

/* Ao soltar o ESPAÇO num botão, o navegador também "clicaria" nele. */
function aoSoltarTecla(evento) {
  if (evento.key === " " || evento.key === "Spacebar") evento.preventDefault();
}


/* --------------------------------------------------------------------------
   10. INÍCIO — liga tudo quando a página abre
   -------------------------------------------------------------------------- */
function iniciarJogo() {
  montarTelaInicial();
  ligarTelaConfig();
  ligarTelaRoleta();
  ligarModal();

  Roleta.iniciar(document.getElementById("roleta"), document.getElementById("ponteiro"), CONFIG.temas);
  Confete.iniciar(document.getElementById("confete"));
  aplicarSom();

  document.getElementById("botao-config").addEventListener("click", function () { mostrarTela("config"); });
  document.getElementById("botao-continuar").addEventListener("click", function () { mostrarTela("roleta"); });
  document.getElementById("botao-som").addEventListener("click", alternarSom);
  document.getElementById("botao-tela-cheia").addEventListener("click", alternarTelaCheia);
  document.getElementById("botao-tela-cheia-inicio").addEventListener("click", alternarTelaCheia);
  document.getElementById("botao-inicio").addEventListener("click", irParaInicio);

  document.addEventListener("keydown", aoApertarTecla);
  document.addEventListener("keyup", aoSoltarTecla);
  document.addEventListener("fullscreenchange", atualizarBotoesTelaCheia);
  document.addEventListener("webkitfullscreenchange", atualizarBotoesTelaCheia);

  // O som só pode ser ligado depois do primeiro clique ou tecla
  document.addEventListener("pointerdown", function () { Sons.preparar(); });
  document.addEventListener("keydown", function () { Sons.preparar(); });

  // Depois de clicar num botão com o mouse, tira a seleção dele,
  // para o ESPAÇO e o ENTER não acionarem o botão de novo.
  document.addEventListener("click", function (evento) {
    var botao = evento.target.closest ? evento.target.closest("button") : null;
    if (botao && evento.detail > 0) botao.blur();
  });

  // Se a janela mudar de tamanho, redesenha a roleta
  var esperaRedesenho = null;
  window.addEventListener("resize", function () {
    clearTimeout(esperaRedesenho);
    esperaRedesenho = setTimeout(function () {
      if (telaAtual === "roleta") Roleta.desenhar();
    }, 150);
  });

  mostrarTela("inicial");
}

iniciarJogo();
