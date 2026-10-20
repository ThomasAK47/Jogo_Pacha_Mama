/* ==========================================================================
   SONS.JS — SONS DO JOGO, CRIADOS NA HORA (SEM ARQUIVOS DE ÁUDIO)
   ==========================================================================

   Os sons são "sintetizados": o navegador gera notas musicais com a
   Web Audio API. Por isso o jogo funciona offline e não precisa de MP3.

   Regra dos navegadores: o som só pode começar depois que a pessoa clica ou
   aperta uma tecla. O jogo chama Sons.preparar() no primeiro clique.

   Para mudar o volume geral, altere VOLUME_GERAL (0 = mudo, 1 = máximo).
   ========================================================================== */

var VOLUME_GERAL = 0.6;

var Sons = {
  contexto: null,   // o "aparelho de som" do navegador
  saida: null,      // controle de volume geral (todos os sons passam por ele)
  ligado: true,

  /* Liga o aparelho de som. Precisa ser chamado depois de um clique. */
  preparar: function () {
    if (!this.contexto) {
      var Aparelho = window.AudioContext || window.webkitAudioContext;
      if (!Aparelho) return false; // navegador sem suporte: o jogo segue sem som
      this.contexto = new Aparelho();
      this.saida = this.contexto.createGain();
      this.saida.gain.value = this.ligado ? VOLUME_GERAL : 0;
      this.saida.connect(this.contexto.destination);
    }
    if (this.contexto.state === "suspended") this.contexto.resume();
    return true;
  },

  /* Liga ou desliga todos os sons (botão "Som" e tecla M). */
  definirLigado: function (ligado) {
    this.ligado = ligado;
    if (this.saida) this.saida.gain.value = ligado ? VOLUME_GERAL : 0;
  },

  /* Diz se dá para tocar agora (som ligado e aparelho pronto). */
  podeTocar: function () {
    return this.ligado && this.contexto && this.contexto.state === "running";
  },

  /* Toca UMA nota.
     frequencia: altura da nota em Hz (440 = lá)
     inicio: daqui a quantos segundos começa
     duracao: quantos segundos dura
     forma: "sine" (suave), "triangle" (flauta), "square" (videogame), "sawtooth" (áspero)
     volume: de 0 a 1 */
  nota: function (frequencia, inicio, duracao, forma, volume) {
    if (!this.podeTocar()) return;
    var agora = this.contexto.currentTime + inicio;
    var oscilador = this.contexto.createOscillator();
    var envelope = this.contexto.createGain();
    oscilador.type = forma;
    oscilador.frequency.setValueAtTime(frequencia, agora);
    // O volume sobe rápido e desce suave, para não estalar.
    envelope.gain.setValueAtTime(0.0001, agora);
    envelope.gain.exponentialRampToValueAtTime(volume, agora + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);
    oscilador.connect(envelope);
    envelope.connect(this.saida);
    oscilador.start(agora);
    oscilador.stop(agora + duracao + 0.05);
  },

  /* ---------------------------- SONS DO JOGO ---------------------------- */

  /* "Tique" curto a cada fatia que passa pelo ponteiro da roleta. */
  tique: function () {
    this.nota(1500 + Math.random() * 200, 0, 0.035, "square", 0.08);
  },

  /* Som alegre quando a roleta para (arpejo dó-mi-sol-dó). */
  parada: function () {
    var notas = [523, 659, 784, 1047];
    for (var i = 0; i < notas.length; i++) {
      var ultima = (i === notas.length - 1);
      this.nota(notas[i], i * 0.09, ultima ? 0.5 : 0.18, "triangle", 0.35);
    }
    // um brilho agudo no final
    this.nota(2093, 0.36, 0.3, "sine", 0.12);
  }
};
