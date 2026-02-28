// Importa as configurações de cenas (a classe) para serem usadas as keys. 
import { SCENES } from "../gameConfig.js"; 

// Classe construtora da cena que ENVIA as informações para o Phaser 
export class endScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.END }); 
    // variáveis globais para a cena
    this.larguraJogo = 1000;
    this.alturaJogo = 730;
    this.playerName;
  }

  init(data) {
    // Pega o nome do pacote que a game scene enviou
    this.playerName = data.playerName; 
  }

  // Carrega a mídia do jogo.
  preload() {
    this.load.image("backgroundEnd", "assets/bgEnd.png");
    this.load.image("bunnyEnd", "assets/characters/endBunny.png");

  }

  // Cria os elementos do jogo.
  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0); // incia o fade in da trnasição 

    // cria as imagens finais
    this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, "backgroundEnd").setScale(0.5);
    this.add.image(this.larguraJogo / 2, this.alturaJogo / 1.68, "bunnyEnd").setScale(0.3);

    // adiciona um texto de agradecimento com o nome do player
    this.add.text(this.larguraJogo /2, 100, this.playerName + ' Obrigado!!', {
      fontSize: '50px',
      fill:'#000000', 
      fontStyle:"Bold" ,
      align: 'center',
      wordWrap: { width: 300 },
      backgroundColor: '#fcc7e8'

    }).setOrigin(0.5); // centralizada 

    


  }
  update() {

  };


}
