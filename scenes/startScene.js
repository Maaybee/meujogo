// Importa as configurações de cenas (a classe) para serem usadas as keys. 
import { SCENES } from "../gameConfig.js"; 

// Classe construtora da cena que ENVIA as informações para o Phaser 
export class startScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.START }); 
    // variáveis globais para a cena
    this.larguraJogo = 1000;
    this.alturaJogo = 730;
  }

  // Carrega a mídia do jogo.
  preload() {

    // Carrega as imagens e sprites usadas no jogo.
    this.load.image("backgroundInicial", "assets/bg.jpg");
    this.load.image("logo", "assets/logo.png");
    this.load.image("botaoIniciar", "assets/botaoJogar.png");
    this.load.image("botaoCmJogar", "assets/botaoCmJogar.png");

    // Carrega a música tema do jogo e efeitos sonoros.
    this.load.audio("musicaTema", "assets/audios/musicaTema.wav");
    this.load.audio("clickBotao", "assets/audios/clickBotao.wav");
  }

  // Cria os elementos do jogo.
  create() {

    // Adiciona o background no centro da tela.
    this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, "backgroundInicial").setScale(1.5);

    // Cria a logo no centro horizontal da tela e no 4 quadrante da vertical da tela.
    this.add.image(this.larguraJogo / 2, this.alturaJogo / 4, "logo").setScale(0.4);

    // Adiciona a musica tema e define o volume.
    const musicaTema = this.sound.add("musicaTema"); 
    musicaTema.play({ volume: 0.3 }); // Inicia a música com o volume de 0.3 definido. 

    // Cria um objeto que recebe o efeito sonoro do clique dos botões. 
    const clickBotao = this.sound.add("clickBotao");

    // cria os botões e define o tamanho deles.
    const botaoIniciar = this.add.image(this.larguraJogo / 2, this.alturaJogo / 1.4, "botaoIniciar").setScale(0.4);

    const botaoCmJogar = this.add.image(this.larguraJogo / 2, this.alturaJogo / 1.23, "botaoCmJogar").setScale(0.43);
  
    // Adiciona interatividade aos botões (quando o cursor passa por cima ele entende que é um item clicável).
    botaoIniciar.setInteractive({ cursor: "pointer" });
    botaoCmJogar.setInteractive({ cursor: "pointer" });

    // Adiciona uma animação de escala nos botões.
    botaoIniciar.on("pointerover", () => { // Ao passar o mouse por cima
      botaoIniciar.setScale(0.45);  // Aumenta a escala do botão (deixa ele maior).
    });

    botaoIniciar.on("pointerout", () => { // Quando para de passar (tira o mouse da área do botão).
      botaoIniciar.setScale(0.4); // A escala volta para a de origem.
    });

    // Mesma lógica do botão iniciar.
    botaoCmJogar.on("pointerover", () => { 
      botaoCmJogar.setScale(0.48);
    });

    botaoCmJogar.on("pointerout", () => {
      botaoCmJogar.setScale(0.43);
    });

    // Adiona uma ação ao clicar no botão.
    botaoIniciar.on("pointerdown", () => { // Ao clicar no botão 
      clickBotao.play({ volume: 0.8 }); // Dá play no efeito sonoro em um volume determinado.
      this.cameras.main.fadeOut(500, 0, 0, 0); // Inicia um fadeOut para a transição de cena.
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { // se o fadeOut foi completado na cena.
        this.scene.start(SCENES.INTRO); // Inicia a próxima cena indicando a classe (aquela do gameConfig) e a Key definida nela.
      });
      
    });

    // Adiona uma ação ao clicar no botão.
    botaoCmJogar.on("pointerdown", () => { // Ao clicar no botão
        clickBotao.play({ volume: 0.8 }); // Dá play no efeito sonoro em um volume determinado.
        this.scene.start(SCENES.INSTRUCTIONS); // Inicia a próxima cena indicando a classe (aquela do gameConfig) e a Key definida nela.

    });
  }

  update() {}
}
