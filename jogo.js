/* ==========================================================================
   JOGO.JS — FLUXO DO JOGO
   ==========================================================================

   Partes deste arquivo:
     1. Guardar dados no navegador (com segurança)
     2. Banco de perguntas (conferência do perguntas.js)
     3. Estado do jogo (configurações e partida)
     4. Troca de telas
     5. Tela inicial
     6. Configurações
     7. Roleta
     8. Pergunta, contagem e resposta
     9. Som e tela cheia
    10. Janela de confirmação
    11. Teclado
    12. Início (liga tudo quando a página abre)
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
   2. BANCO DE PERGUNTAS
   Confere cada pergunta do perguntas.js. Perguntas com problema são puladas
   e aparecem num aviso amarelo na tela inicial, para quem editou corrigir.
   -------------------------------------------------------------------------- */
var LETRAS = ["A", "B", "C", "D"];

// Acima destes tamanhos (em letras), o verificador avisa que pode não caber
var LIMITE_PERGUNTA = 130;
var LIMITE_OPCAO = 60;
var LIMITE_EXPLICACAO = 180;

var banco = [];            // perguntas conferidas e prontas para o jogo
var avisosBanco = [];      // problemas encontrados no perguntas.js
var bancoIlegivel = false; // true = o arquivo nem pôde ser lido

/* Deixa um texto em minúsculas e sem acentos, para comparar com folga
   ("Intermediário" = "intermediario"). */
function semAcento(texto) {
  if (texto === undefined || texto === null) return "";
  return String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function temTexto(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function acharNivel(valor) {
  var procurado = semAcento(valor);
  for (var chave in CONFIG.niveis) {
    if (procurado === chave || procurado === semAcento(CONFIG.niveis[chave].nome)) return chave;
  }
  return null;
}

function acharTema(valor) {
  var procurado = semAcento(valor);
  for (var i = 0; i < CONFIG.temas.length; i++) {
    var tema = CONFIG.temas[i];
    if (procurado === tema.chave || procurado === semAcento(tema.nome)) return tema.chave;
  }
  return null;
}

function temaPorChave(chave) {
  for (var i = 0; i < CONFIG.temas.length; i++) {
    if (CONFIG.temas[i].chave === chave) return CONFIG.temas[i];
  }
  return null;
}

function verificarBanco() {
  if (typeof PERGUNTAS === "undefined" || !Array.isArray(PERGUNTAS)) {
    bancoIlegivel = true;
    return;
  }

  var idsUsados = {};
  for (var i = 0; i < PERGUNTAS.length; i++) {
    var p = PERGUNTAS[i];
    var nome = (p && temTexto(p.id)) ? p.id : "Pergunta nº " + (i + 1) + " do arquivo";
    if (!p || typeof p !== "object") {
      avisosBanco.push(nome + ": não está no formato de pergunta. (Pulada.)");
      continue;
    }

    // Problemas graves: a pergunta é pulada
    var problemas = [];
    var nivel = acharNivel(p.nivel);
    var tema = acharTema(p.tema);
    var correta = LETRAS.indexOf(semAcento(p.correta).toUpperCase());

    if (!temTexto(p.id)) problemas.push("está sem id");
    else if (idsUsados[p.id]) problemas.push("usa um id que outra pergunta já usa");
    if (!nivel) problemas.push('o nível "' + p.nivel + '" não existe (use infantil, intermediario ou adulto)');
    if (!tema) problemas.push('o tema "' + p.tema + '" não existe');
    if (!temTexto(p.pergunta)) problemas.push("está sem o texto da pergunta");
    if (!Array.isArray(p.opcoes)) {
      problemas.push("está sem a lista de opções");
    } else {
      if (nivel && p.opcoes.length !== CONFIG.niveis[nivel].opcoes) {
        problemas.push("tem " + p.opcoes.length + " opções, mas o nível " + nomeDoNivel(nivel) +
          " usa " + CONFIG.niveis[nivel].opcoes);
      }
      for (var o = 0; o < p.opcoes.length; o++) {
        var opcao = p.opcoes[o];
        if (opcao === undefined || opcao === null || String(opcao).trim() === "") {
          problemas.push("tem uma opção vazia");
          break;
        }
      }
      if (correta < 0 || correta >= p.opcoes.length) {
        problemas.push('a resposta correta "' + p.correta + '" não é a letra de uma das opções (use "A", "B", "C" ou "D")');
      }
    }
    if (problemas.length > 0) {
      avisosBanco.push(nome + ": " + problemas.join("; ") + ". (Pergunta pulada.)");
      continue;
    }
    idsUsados[p.id] = true;

    // Avisos leves: a pergunta continua no jogo
    var opcoes = p.opcoes.map(function (texto) { return String(texto).trim(); });
    if (!temTexto(p.explicacao)) avisosBanco.push(nome + ": está sem explicação.");
    if (p.pergunta.length > LIMITE_PERGUNTA) avisosBanco.push(nome + ": a pergunta é longa e pode ficar com letra menor.");
    if (opcoes.some(function (texto) { return texto.length > LIMITE_OPCAO; })) {
      avisosBanco.push(nome + ": uma das opções é longa e pode ficar com letra menor.");
    }
    if (temTexto(p.explicacao) && p.explicacao.length > LIMITE_EXPLICACAO) {
      avisosBanco.push(nome + ": a explicação é longa e pode ficar com letra menor.");
    }

    var pontos = null;
    if (p.pontosMapa !== undefined && p.pontosMapa !== null) {
      pontos = (Array.isArray(p.pontosMapa) ? p.pontosMapa : [p.pontosMapa])
        .map(function (ponto) { return String(ponto).trim(); })
        .filter(function (ponto) { return ponto !== ""; });
      if (pontos.length === 0) pontos = null;
    }

    banco.push({
      id: p.id,
      nivel: nivel,
      tema: tema,
      pergunta: p.pergunta.trim(),
      opcoes: opcoes,
      correta: correta,                       // número: 0 = A, 1 = B...
      explicacao: temTexto(p.explicacao) ? p.explicacao.trim() : "",
      pontosMapa: pontos
    });
  }

  // Temas sem nenhuma pergunta em algum nível
  for (var chaveNivel in CONFIG.niveis) {
    for (var t = 0; t < CONFIG.temas.length; t++) {
      if (contarPerguntas(chaveNivel, CONFIG.temas[t].chave) === 0) {
        avisosBanco.push("O nível " + nomeDoNivel(chaveNivel) + " não tem nenhuma pergunta do tema " +
          CONFIG.temas[t].nome + ".");
      }
    }
  }
}

/* Quantas perguntas existem no banco para um nível (e, se quiser, um tema). */
function contarPerguntas(nivel, tema) {
  var total = 0;
  for (var i = 0; i < banco.length; i++) {
    if (banco[i].nivel === nivel && (!tema || banco[i].tema === tema)) total++;
  }
  return total;
}

function acharPergunta(id) {
  for (var i = 0; i < banco.length; i++) {
    if (banco[i].id === id) return banco[i];
  }
  return null;
}

/* Perguntas do tema que ainda não saíram nesta partida. */
function perguntasLivres(tema) {
  var livres = [];
  for (var i = 0; i < banco.length; i++) {
    var p = banco[i];
    if (p.nivel === partida.nivel && p.tema === tema && partida.usadas.indexOf(p.id) < 0) livres.push(p);
  }
  return livres;
}

function marcarUsada(id) {
  if (partida.usadas.indexOf(id) < 0) partida.usadas.push(id);
}

function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

/* "a, b e c" */
function juntarComE(lista) {
  if (lista.length <= 1) return lista.join("");
  return lista.slice(0, -1).join(", ") + " e " + lista[lista.length - 1];
}


/* --------------------------------------------------------------------------
   3. ESTADO DO JOGO
   -------------------------------------------------------------------------- */

var ajustes = null;      // configurações escolhidas pela professora
var partida = null;      // partida em andamento (nível, rodada...) ou null
var telaAtual = "inicial";
var esperaPergunta = null;  // temporizador entre a roleta parar e a pergunta abrir
var contando = false;       // contagem "3, 2, 1" acontecendo
var avisoRoleta = "";       // recado temporário embaixo do botão GIRAR

// Tempo que o tema sorteado fica na tela antes de abrir a pergunta (milissegundos)
var ESPERA_ATE_PERGUNTA = 2200;

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
  if (!Array.isArray(salva.usadas)) salva.usadas = [];
  // Se o perguntas.js mudou e a pergunta da tela sumiu, volta para a roleta
  if (salva.perguntaAtual && !acharPergunta(salva.perguntaAtual)) {
    salva.perguntaAtual = null;
    salva.temaAtual = null;
    salva.revelada = false;
  }
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
    usadas: [],           // ids das perguntas que já saíram nesta partida
    temaAtual: null,      // tema sorteado na rodada
    perguntaAtual: null,  // id da pergunta da rodada
    revelada: false       // a resposta da rodada já foi revelada?
  };
  avisoRoleta = "";
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
   4. TROCA DE TELAS
   Cada tela é uma <section class="tela"> no index.html. Só uma aparece.
   -------------------------------------------------------------------------- */
function mostrarTela(nome) {
  clearTimeout(esperaPergunta);

  var telas = document.querySelectorAll(".tela");
  for (var i = 0; i < telas.length; i++) telas[i].classList.remove("ativa");
  document.getElementById("tela-" + nome).classList.add("ativa");
  telaAtual = nome;

  // A barra do topo só aparece durante o jogo
  var emJogo = (nome === "roleta" || nome === "pergunta");
  document.getElementById("barra-jogo").hidden = !emJogo;
  document.body.classList.toggle("em-jogo", emJogo);
  document.body.classList.toggle("na-config", nome === "config");

  if (nome === "inicial") atualizarTelaInicial();
  if (nome === "config") atualizarTelaConfig();
  if (nome === "roleta") prepararTelaRoleta();
  if (nome === "pergunta") prepararTelaPergunta();
}

/* Volta para a tela inicial. A partida NÃO é apagada: aparece o botão
   "Continuar partida". */
function irParaInicio() {
  if (Roleta.girando || contando) return;
  mostrarTela("inicial");
}

function continuarPartida() {
  mostrarTela(partida.perguntaAtual ? "pergunta" : "roleta");
}

function atualizarBarra() {
  if (!partida) return;
  document.getElementById("barra-nivel").textContent = nomeDoNivel(partida.nivel);
  document.getElementById("barra-rodada").textContent = "Rodada " + partida.rodada;
}


/* --------------------------------------------------------------------------
   5. TELA INICIAL
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
  for (var chave in CONFIG.niveis) {
    var nivel = CONFIG.niveis[chave];
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-nivel";
    botao.title = nivel.opcoes + " opções de resposta";
    botao.setAttribute("data-nivel", chave);

    var nome = document.createElement("span");
    nome.className = "nome-nivel";
    nome.textContent = nivel.nome;
    var publico = document.createElement("span");
    publico.className = "publico-nivel";
    publico.textContent = nivel.publico;
    var formas = document.createElement("span");
    formas.className = "formas";
    for (var f = 0; f < nivel.opcoes; f++) formas.appendChild(criarForma(LETRAS[f]));

    botao.appendChild(nome);
    botao.appendChild(publico);
    botao.appendChild(formas);
    botao.addEventListener("click", aoEscolherNivel);
    caixaNiveis.appendChild(botao);
  }

  mostrarSituacaoDoBanco();
}

/* Mostra o erro (arquivo ilegível) ou os avisos do perguntas.js. */
function mostrarSituacaoDoBanco() {
  if (bancoIlegivel) {
    var caixa = document.getElementById("erro-banco");
    var titulo = document.createElement("strong");
    titulo.textContent = "Não foi possível ler o arquivo perguntas.js.";
    var dica = document.createElement("p");
    dica.textContent = "Provavelmente há um erro de digitação: uma vírgula, aspas, chave { } ou colchete [ ] faltando ou sobrando.";
    var comoAchar = document.createElement("p");
    comoAchar.textContent = "Para achar o erro: aperte F12 e abra a aba “Console”; ela mostra o número da linha." +
      linhaDoErro("perguntas.js");
    caixa.appendChild(titulo);
    caixa.appendChild(dica);
    caixa.appendChild(comoAchar);
    caixa.hidden = false;
    document.getElementById("botoes-nivel").hidden = true;
    document.getElementById("chamada-nivel").hidden = true;
    return;
  }

  if (avisosBanco.length > 0) {
    document.getElementById("avisos-resumo").textContent = "Atenção: o arquivo perguntas.js tem " +
      avisosBanco.length + (avisosBanco.length === 1 ? " aviso" : " avisos") + " (clique para ver).";
    var lista = document.getElementById("avisos-lista");
    for (var i = 0; i < avisosBanco.length; i++) {
      var item = document.createElement("li");
      item.textContent = avisosBanco[i];
      lista.appendChild(item);
    }
    document.getElementById("avisos-banco").hidden = false;
  }
}

/* Se o navegador informou a linha do erro de um arquivo, devolve o texto
   " (O navegador indica a linha N.)". Abrindo direto do disco, o navegador
   costuma esconder esse detalhe; no GitHub Pages ele aparece. */
function linhaDoErro(arquivo) {
  var erros = window.ERROS_DE_CARGA || [];
  for (var i = 0; i < erros.length; i++) {
    if (erros[i].filename && erros[i].filename.indexOf(arquivo) >= 0 && erros[i].lineno) {
      return " (O navegador indica a linha " + erros[i].lineno + ".)";
    }
  }
  return "";
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
  if (partidaComecou() && !bancoIlegivel) {
    botaoContinuar.textContent = "Continuar partida (" + nomeDoNivel(partida.nivel) +
      ", rodada " + partida.rodada + ")";
    botaoContinuar.hidden = false;
  } else {
    botaoContinuar.hidden = true;
  }
}


/* --------------------------------------------------------------------------
   6. CONFIGURAÇÕES
   -------------------------------------------------------------------------- */

// Limites dos contadores da tela de configurações
var CHANCE_MINIMA = 5, CHANCE_MAXIMA = 100, PASSO_CHANCE = 5;

/* O intervalo do alerta vai de "nuncaAntesDaRodada" (não cai nas rodadas
   proibidas) até "garantidoNaRodada" (garante pelo menos 1 alerta). */
function intervaloMinimo() { return CONFIG.evento.nuncaAntesDaRodada; }
function intervaloMaximo() { return CONFIG.evento.garantidoNaRodada; }

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

  // Perguntas no banco e perguntas usadas
  var partes = [];
  for (var nivel in CONFIG.niveis) partes.push(nomeDoNivel(nivel) + ": " + contarPerguntas(nivel));
  document.getElementById("resumo-banco").textContent = "Perguntas no banco — " + partes.join(" · ");
  var resumoUsadas = document.getElementById("resumo-usadas");
  var botaoZerar = document.getElementById("aj-zerar-usadas");
  if (partida) {
    var jaSairam = partida.usadas.filter(acharPergunta).length; // ignora ids que saíram do arquivo
    resumoUsadas.textContent = "Já saíram nesta partida (" + nomeDoNivel(partida.nivel) + "): " +
      jaSairam + " de " + contarPerguntas(partida.nivel);
    botaoZerar.disabled = jaSairam === 0;
  } else {
    resumoUsadas.textContent = "Nenhuma partida em andamento.";
    botaoZerar.disabled = true;
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

/* Libera de novo as perguntas que já saíram (a da tela atual continua marcada). */
function zerarUsadas() {
  partida.usadas = partida.perguntaAtual ? [partida.perguntaAtual] : [];
  avisoRoleta = "";
  salvarPartida();
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
    mudarAjuste("eventoIntervalo", limitar(ajustes.eventoIntervalo - 1, intervaloMinimo(), intervaloMaximo()));
  });
  document.getElementById("aj-intervalo-mais").addEventListener("click", function () {
    mudarAjuste("eventoIntervalo", limitar(ajustes.eventoIntervalo + 1, intervaloMinimo(), intervaloMaximo()));
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
  document.getElementById("aj-zerar-usadas").addEventListener("click", function () {
    confirmar(
      "Zerar perguntas usadas?",
      "As perguntas que já saíram nesta partida poderão aparecer de novo.",
      "Sim, zerar",
      "Não",
      function () {
        zerarUsadas();
        atualizarTelaConfig();
      }
    );
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
   7. ROLETA
   -------------------------------------------------------------------------- */

/* Temas que a roleta não pode sortear (fatias cinza):
   { chave: "esgotado" } ou { chave: "sem perguntas" } */
function temasInativos() {
  var inativos = {};
  for (var i = 0; i < CONFIG.temas.length; i++) {
    var chave = CONFIG.temas[i].chave;
    if (contarPerguntas(partida.nivel, chave) === 0) inativos[chave] = "sem perguntas";
    else if (perguntasLivres(chave).length === 0) inativos[chave] = "esgotado";
  }
  return inativos;
}

/* Posições (na roleta) dos temas que ainda podem sair. */
function temasDisponiveis(inativos) {
  var lista = [];
  for (var i = 0; i < CONFIG.temas.length; i++) {
    if (!inativos[CONFIG.temas[i].chave]) lista.push(i);
  }
  return lista;
}

/* Pinta de cinza as fatias sem perguntas e escreve o aviso embaixo do GIRAR. */
function atualizarRoletaEAviso() {
  var inativos = temasInativos();
  Roleta.inativos = inativos;
  Roleta.desenhar();

  var esgotados = [];
  for (var i = 0; i < CONFIG.temas.length; i++) {
    if (inativos[CONFIG.temas[i].chave] === "esgotado") esgotados.push(CONFIG.temas[i].nome);
  }
  var texto = avisoRoleta;
  if (!texto && esgotados.length > 0) {
    texto = "Acabaram as perguntas de " + juntarComE(esgotados) + " neste nível. A roleta não para mais " +
      (esgotados.length === 1 ? "nessa fatia." : "nessas fatias.");
  }
  var aviso = document.getElementById("aviso-roleta");
  aviso.textContent = texto;
  aviso.hidden = !texto;
}

function prepararTelaRoleta() {
  atualizarBarra();
  var botao = document.getElementById("botao-girar");
  botao.disabled = false;
  if (partida.perguntaAtual) {
    // A roleta já parou nesta rodada: falta só abrir a pergunta
    mostrarResultado(temaPorChave(partida.temaAtual));
    document.getElementById("dica-roleta").hidden = true;
    botao.textContent = "VER PERGUNTA";
  } else {
    document.getElementById("resultado").hidden = true;
    document.getElementById("dica-roleta").hidden = false;
    botao.textContent = "GIRAR";
  }
  atualizarRoletaEAviso();
}

/* Botão GIRAR (ou tecla ESPAÇO, ou clique na roleta). Depois que a roleta
   para, o mesmo botão vira "VER PERGUNTA". */
function aoClicarGirar() {
  if (telaAtual !== "roleta" || Roleta.girando || !partida) return;
  if (partida.perguntaAtual) {
    abrirPergunta();
  } else {
    girar();
  }
}

function girar() {
  Sons.preparar();
  avisoRoleta = "";

  var disponiveis = temasDisponiveis(temasInativos());
  if (disponiveis.length === 0 && partida.usadas.length > 0) {
    // Todas as perguntas do nível já saíram nesta partida: libera todas de novo.
    partida.usadas = [];
    avisoRoleta = "Todas as perguntas do nível " + nomeDoNivel(partida.nivel) +
      " já tinham saído. Elas foram liberadas de novo.";
    disponiveis = temasDisponiveis(temasInativos());
  }
  atualizarRoletaEAviso();

  if (disponiveis.length === 0) {
    avisar("Sem perguntas", "Não há nenhuma pergunta para o nível " + nomeDoNivel(partida.nivel) +
      ". Confira o arquivo perguntas.js.");
    return;
  }

  partida.rodadaJogada = true;
  salvarPartida();

  // Sorteia o tema ANTES de girar; a animação só mostra o resultado.
  var indice = sortear(disponiveis);

  var botao = document.getElementById("botao-girar");
  botao.disabled = true;
  botao.textContent = "GIRANDO...";
  document.getElementById("resultado").hidden = true;
  document.getElementById("dica-roleta").hidden = true;

  Roleta.girar(indice, aoPararRoleta);
}

function aoPararRoleta(indice) {
  var tema = CONFIG.temas[indice];

  // Sorteia a pergunta do tema e já marca como usada
  var pergunta = sortear(perguntasLivres(tema.chave));
  partida.temaAtual = tema.chave;
  partida.perguntaAtual = pergunta.id;
  partida.revelada = false;
  marcarUsada(pergunta.id);
  salvarPartida();

  Sons.parada();
  var caixa = document.getElementById("caixa-roleta").getBoundingClientRect();
  Confete.soltar(caixa.left + caixa.width / 2, caixa.top + caixa.height / 2);
  mostrarResultado(tema);

  var botao = document.getElementById("botao-girar");
  botao.disabled = false;
  botao.textContent = "VER PERGUNTA";

  // Depois de um instante, a pergunta abre sozinha
  esperaPergunta = setTimeout(abrirPergunta, ESPERA_ATE_PERGUNTA);
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

function abrirPergunta() {
  if (partida && partida.perguntaAtual && telaAtual === "roleta") mostrarTela("pergunta");
}

function ligarTelaRoleta() {
  document.getElementById("botao-girar").addEventListener("click", aoClicarGirar);
  document.getElementById("caixa-roleta").addEventListener("click", aoClicarGirar);
}


/* --------------------------------------------------------------------------
   8. PERGUNTA, CONTAGEM E RESPOSTA
   -------------------------------------------------------------------------- */

// Contagem antes de revelar. Cada número fica TEMPO_DE_CADA_NUMERO na tela.
var PASSOS_CONTAGEM = ["3", "2", "1", "LEVANTEM!"];
var TEMPO_DE_CADA_NUMERO = 850;   // milissegundos
var TEMPO_DO_LEVANTEM = 1100;     // milissegundos

function prepararTelaPergunta() {
  var pergunta = acharPergunta(partida.perguntaAtual);
  if (!pergunta) {
    // A pergunta não existe mais (o perguntas.js mudou): volta para a roleta
    partida.perguntaAtual = null;
    partida.temaAtual = null;
    partida.revelada = false;
    salvarPartida();
    mostrarTela("roleta");
    return;
  }
  atualizarBarra();
  var tema = temaPorChave(pergunta.tema);

  // Tema da pergunta
  var chip = document.getElementById("chip-tema");
  chip.innerHTML = "";
  chip.style.background = tema.cor;
  chip.appendChild(criarIconeSVG(tema.chave));
  chip.appendChild(document.createTextNode(tema.nome));

  // Aviso "OLHEM O MAPA" (só nas perguntas com pontosMapa)
  var avisoMapa = document.getElementById("aviso-mapa");
  avisoMapa.innerHTML = "";
  if (pergunta.pontosMapa) {
    avisoMapa.appendChild(criarIconeSVG("mapas"));
    avisoMapa.appendChild(document.createTextNode("OLHEM O MAPA!"));
    var pontos = document.createElement("span");
    pontos.className = "pontos";
    pontos.textContent = (pergunta.pontosMapa.length === 1 ? "Ponto " : "Pontos ") +
      juntarComE(pergunta.pontosMapa);
    avisoMapa.appendChild(pontos);
    avisoMapa.hidden = false;
  } else {
    avisoMapa.hidden = true;
  }

  document.getElementById("texto-pergunta").textContent = pergunta.pergunta;

  // Opções: letra + forma, fundo neutro (igual às plaquinhas)
  var caixaOpcoes = document.getElementById("opcoes");
  caixaOpcoes.innerHTML = "";
  caixaOpcoes.className = "opcoes quantas-" + pergunta.opcoes.length;
  for (var i = 0; i < pergunta.opcoes.length; i++) {
    var opcao = document.createElement("div");
    opcao.className = "opcao";
    var marcador = document.createElement("span");
    marcador.className = "marcador";
    marcador.appendChild(criarForma(LETRAS[i]));
    var letra = document.createElement("span");
    letra.className = "letra";
    letra.textContent = LETRAS[i];
    marcador.appendChild(letra);
    var texto = document.createElement("span");
    texto.className = "texto-opcao";
    texto.textContent = pergunta.opcoes[i];
    opcao.appendChild(marcador);
    opcao.appendChild(texto);
    caixaOpcoes.appendChild(opcao);
  }

  if (partida.revelada) {
    mostrarResposta(false); // voltando para uma pergunta já revelada
  } else {
    document.getElementById("botao-revelar").hidden = false;
    document.getElementById("explicacao").hidden = true;
    document.getElementById("botao-proxima").hidden = true;
    var botaoTrocar = document.getElementById("botao-trocar");
    botaoTrocar.hidden = false;
    var temOutra = perguntasLivres(pergunta.tema).length > 0;
    botaoTrocar.disabled = !temOutra;
    botaoTrocar.title = temOutra ? "Sortear outra pergunta do mesmo tema" : "Não há outra pergunta deste tema";
    ajustarTamanhoDaPergunta();
  }
}

/* Se o texto não couber na tela, diminui as letras aos poucos.
   A pergunta nunca fica menor que 40px (ver estilo.css). */
function ajustarTamanhoDaPergunta() {
  var tela = document.getElementById("tela-pergunta");
  var escala = 1;
  tela.style.setProperty("--escala", "1");
  while (tela.scrollHeight > tela.clientHeight + 1 && escala > 0.7) {
    escala -= 0.05;
    tela.style.setProperty("--escala", escala.toFixed(2));
  }
}

/* Botão REVELAR RESPOSTA (ou tecla ENTER). */
function revelar() {
  if (telaAtual !== "pergunta" || !partida || partida.revelada || contando) return;
  Sons.preparar();
  if (ajustes.contagemLigada) {
    fazerContagem();
  } else {
    mostrarResposta(true);
  }
}

/* Contagem "3, 2, 1, LEVANTEM!" em tela cheia, para todas as equipes
   levantarem as plaquinhas juntas. Depois mostra a resposta. */
function fazerContagem() {
  contando = true;
  var camada = document.getElementById("contagem");
  var texto = document.getElementById("contagem-texto");
  camada.hidden = false;
  var passo = 0;

  function mostrarPasso() {
    if (passo < PASSOS_CONTAGEM.length) {
      var ehUltimo = (passo === PASSOS_CONTAGEM.length - 1);
      texto.textContent = PASSOS_CONTAGEM[passo];
      texto.className = "contagem-texto" + (ehUltimo ? " palavra" : "");
      void texto.offsetWidth; // reinicia a animação
      texto.classList.add("anima");
      if (ehUltimo) Sons.levantem(); else Sons.bipeContagem();
      passo++;
      setTimeout(mostrarPasso, ehUltimo ? TEMPO_DO_LEVANTEM : TEMPO_DE_CADA_NUMERO);
    } else {
      camada.hidden = true;
      contando = false;
      if (telaAtual === "pergunta") mostrarResposta(true);
    }
  }
  mostrarPasso();
}

/* Destaca a opção certa, apaga as outras e mostra a explicação.
   comFesta = false quando a professora volta para uma pergunta já revelada. */
function mostrarResposta(comFesta) {
  var pergunta = acharPergunta(partida.perguntaAtual);
  partida.revelada = true;
  salvarPartida();

  document.getElementById("tela-pergunta").classList.toggle("sem-animacao", !comFesta);
  var opcoes = document.querySelectorAll("#opcoes .opcao");
  for (var i = 0; i < opcoes.length; i++) {
    if (i === pergunta.correta) {
      opcoes[i].classList.add("certa");
      var selo = document.createElement("span");
      selo.className = "selo-certa";
      selo.textContent = "CERTA!";
      opcoes[i].appendChild(selo);
    } else {
      opcoes[i].classList.add("errada");
    }
  }

  var explicacao = document.getElementById("explicacao");
  explicacao.innerHTML = "";
  if (pergunta.explicacao) {
    var titulo = document.createElement("span");
    titulo.className = "titulo-explicacao";
    titulo.textContent = "Por quê?";
    explicacao.appendChild(titulo);
    explicacao.appendChild(document.createTextNode(pergunta.explicacao));
    explicacao.hidden = false;
  } else {
    explicacao.hidden = true;
  }

  document.getElementById("botao-revelar").hidden = true;
  document.getElementById("botao-trocar").hidden = true;
  document.getElementById("botao-proxima").hidden = false;
  if (comFesta) Sons.acerto();
  ajustarTamanhoDaPergunta();
}

/* Botão PRÓXIMA (ou tecla ESPAÇO depois de revelar): nova rodada. */
function proxima() {
  if (telaAtual !== "pergunta" || !partida || !partida.revelada || contando) return;
  partida.rodada++;
  partida.rodadaJogada = false;
  partida.temaAtual = null;
  partida.perguntaAtual = null;
  partida.revelada = false;
  salvarPartida();
  mostrarTela("roleta");
}

/* Botão "Trocar pergunta": outra pergunta do mesmo tema, para quando a
   sorteada não serve para a turma. As duas ficam marcadas como usadas. */
function trocarPergunta() {
  if (telaAtual !== "pergunta" || !partida || partida.revelada || contando) return;
  var livres = perguntasLivres(partida.temaAtual);
  if (livres.length === 0) return;
  var nova = sortear(livres);
  marcarUsada(nova.id);
  partida.perguntaAtual = nova.id;
  salvarPartida();
  prepararTelaPergunta();
}

function ligarTelaPergunta() {
  document.getElementById("botao-revelar").addEventListener("click", revelar);
  document.getElementById("botao-proxima").addEventListener("click", proxima);
  document.getElementById("botao-trocar").addEventListener("click", trocarPergunta);
}


/* --------------------------------------------------------------------------
   9. SOM E TELA CHEIA
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
  // O tamanho da tela mudou: redesenha o que depende dele
  setTimeout(aoMudarTamanho, 100);
}

function aoMudarTamanho() {
  if (telaAtual === "roleta") Roleta.desenhar();
  if (telaAtual === "pergunta") ajustarTamanhoDaPergunta();
}


/* --------------------------------------------------------------------------
   10. JANELA DE CONFIRMAÇÃO
   Usada antes de ações que apagam algo (nova partida, reiniciar...) e para
   avisos. Se textoNao for null, aparece só o botão de "sim".
   -------------------------------------------------------------------------- */
var acaoAoConfirmar = null;

function confirmar(titulo, texto, textoSim, textoNao, acao) {
  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal-texto").textContent = texto;
  document.getElementById("modal-sim").textContent = textoSim;
  var botaoNao = document.getElementById("modal-nao");
  botaoNao.textContent = textoNao || "";
  botaoNao.hidden = !textoNao;
  acaoAoConfirmar = acao;
  document.getElementById("modal").hidden = false;
}

function avisar(titulo, texto) {
  confirmar(titulo, texto, "Entendi", null, null);
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
  if (!partida || (telaAtual !== "roleta" && telaAtual !== "pergunta") || Roleta.girando || contando) return;
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
   11. TECLADO (atalhos opcionais)
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
  if (contando) return;      // durante a contagem, nada de atalhos

  // Com a janela de confirmação aberta, só o ESC funciona (= fechar).
  if (modalAberto()) {
    if (tecla === "Escape") fecharModal();
    return;
  }

  if (ehEspaco) {
    if (telaAtual === "roleta") aoClicarGirar();
    else if (telaAtual === "pergunta") proxima();
  } else if (tecla === "Enter") {
    revelar();
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
   12. INÍCIO — liga tudo quando a página abre
   -------------------------------------------------------------------------- */

/* Se o config.js tiver erro de digitação, o jogo não tem como abrir. */
function mostrarErroDoConfig() {
  document.body.innerHTML = "";
  var caixa = document.createElement("div");
  caixa.className = "caixa-erro erro-fatal";
  var titulo = document.createElement("strong");
  titulo.textContent = "Não foi possível ler o arquivo config.js.";
  var dica = document.createElement("p");
  dica.textContent = "Provavelmente há um erro de digitação: uma vírgula, aspas ou chave { } faltando ou sobrando. " +
    "Para achar a linha: aperte F12 e abra a aba “Console”." + linhaDoErro("config.js");
  caixa.appendChild(titulo);
  caixa.appendChild(dica);
  document.body.appendChild(caixa);
}

function iniciarJogo() {
  if (typeof CONFIG === "undefined") {
    mostrarErroDoConfig();
    return;
  }

  ajustes = carregarAjustes();
  verificarBanco();
  partida = carregarPartida();

  montarTelaInicial();
  ligarTelaConfig();
  ligarTelaRoleta();
  ligarTelaPergunta();
  ligarModal();

  Roleta.iniciar(document.getElementById("roleta"), document.getElementById("ponteiro"), CONFIG.temas);
  Confete.iniciar(document.getElementById("confete"));
  aplicarSom();

  document.getElementById("botao-config").addEventListener("click", function () { mostrarTela("config"); });
  document.getElementById("botao-continuar").addEventListener("click", continuarPartida);
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

  // Se a janela mudar de tamanho, redesenha a roleta / reajusta as letras
  var esperaRedesenho = null;
  window.addEventListener("resize", function () {
    clearTimeout(esperaRedesenho);
    esperaRedesenho = setTimeout(aoMudarTamanho, 150);
  });

  mostrarTela("inicial");
}

iniciarJogo();
