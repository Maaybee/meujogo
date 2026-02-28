// Importa as configurações de cenas (a classe) para serem usadas as keys. 
import { SCENES } from "../gameConfig.js";

// Classe construtora da cena que ENVIA as informações para o Phaser 
export class instructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.INSTRUCTIONS });
    // variáveis globais para a cena
    this.larguraJogo = 1000;
    this.alturaJogo = 730;
    this.player;
    this.teclado;
    this.pontuacao = 0;
    this.placar;
  }

  // Carrega a mídia do jogo.
  preload() {
    this.load.image("backgroundInicial", "assets/bg.jpg");
    this.load.image('botaoVoltar', 'assets/arrowBack.png');
    this.load.image('cardInstruction','assets/howToPlay.png')

  }

  // Cria os elementos do jogo.
  create() {
    // adiciona os elementos na tela
    this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, "backgroundInicial").setScale(1.5);
    this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, "cardInstruction"); // card com as intruções de como jogar

    // cria o botão voltar
    const botaoVoltar = this.add.image(this.larguraJogo / 6, this.alturaJogo / 5, 'botaoVoltar').setScale(0.15);

    botaoVoltar.setInteractive({ cursor: "pointer" }); // adiciona interação de ponteiro 

    // lógica para quando passar o mouse por cima, a scala aumentqr e diminuir respectivamente 
    botaoVoltar.on("pointerover", () => {
      botaoVoltar.setScale(0.18);
    });

    botaoVoltar.on("pointerout", () => {
      botaoVoltar.setScale(0.15);
    });
     
    // ao clicar no botão 
    botaoVoltar.on("pointerdown", () => {
        this.scene.start(SCENES.START); // volta para a cena de inicio

    });
  }

  update() {}
}
