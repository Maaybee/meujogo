// Importa as configurações de cenas (a classe) para serem usadas as keys. 
import { SCENES } from "../gameConfig.js";

// Classe construtora da cena que ENVIA as informações para o Phaser 
export class introScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.INTRO });
    this.larguraJogo = 1000; // variavel de largura do jogo
    this.alturaJogo = 730; // variavel de altura do jogo
    this.playerName; // variavel que vai carregar o nome do player por todas as cenas
  }

  preload() {
    // Carregando as sprites para o phaser
    this.load.image("backgroundJogo", "assets/bgJogo.png");

    // -- Personagens -- 
    this.load.image('fazendeiraRuiva_default', 'assets/characters/fazendeiraRuiva_default.png');
    this.load.image('fazendeiraRuiva_Lola', 'assets/characters/fazendeiraRuiva_Lola.png');
    this.load.image('fazendeiraSad', 'assets/characters/fazendeiraSad.png');
    this.load.image('pedidoFazendeira', 'assets/characters/pedidoFazendeira.png');


    this.load.image('dialogBox', 'assets/boxDialog.png');

  }

  create() {

    this.cameras.main.fadeIn(500, 0, 0, 0); // Continua o fadeout de transição com um fadein para trazer fluidez 

    const backgroundJogo = this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, "backgroundJogo"); // Cria o fundo da cena 

    const blurEffect = backgroundJogo.preFX.addColorMatrix(); // Adciona um efeito de blur para deixar a personagem em destaque (escurece)
    blurEffect.brightness(0.8); // define o quanto que o fundo vai ser escurecido

    const defaultFazendeira = this.add.image(this.larguraJogo / 5.5, this.alturaJogo / 1.48, 'fazendeiraRuiva_default').setScale(0.24); // adiciona a persnagem
    const dialogBox = this.add.image(this.larguraJogo / 1.5, this.alturaJogo / 1.2, 'dialogBox').setScale(0.9); // adiciona a caixa de dialogo

    // define o texto de boas vindas e a estilização dele
    const welcomeTxt = this.add.text(dialogBox.x/1.5, dialogBox.y/1.12, 'Bem vindo(a) ao BunnyScape, qual o seu nome?', {
      fontSize: '30px',
      fill:'#ff1b83', 
      align: 'center',
      wordWrap: { width: 580 }

    }); 

    // utilizando o dom para criar elementos html dentro do game-container 
    const inputName = this.add.dom(dialogBox.x/1, dialogBox.y/0.95, 'input', // cria uma área para o player digitar o nome dele 
      'background-color: white; width: 300px; height: 35px; font-size: 20px; text-align: center; border-radius: 8px; border: 2px solid #ff1b83; outline: none;'
    );

    inputName.node.type = 'text'; // define o tipo de entrada esperada 
    inputName.node.placeholder = 'Digite aqui e pressione enter' // o texto do placeholder (texto que vem dentro do input antes de se digitar algo)

    // lógica do input 
    this.input.keyboard.on('keydown-ENTER', () => {  // quando o enter for pressionado 
      this.playerName = inputName.node.value;  // a váriavel playerName recebe o valor digitado dentro dele 

      if (this.playerName == '') { // se nada for digitado, o jogo força uma entrada para continuar 
        inputName.node.placeholder = 'Digite algo válido';

      }else { 
        inputName.destroy(); // destrou o input 
        welcomeTxt.setText(this.playerName + ', aqui começa a sua jornada no bunnyScape'); // atualiza o texto puxando a variavel playerName
        Phaser.Display.Align.In.Center(welcomeTxt, dialogBox); // alinha o texto no centro da caixa de dialogo

        // - lógica para a transição do dialogo
        // os seguintes blocos seguem essa mesma lógica: 
        // depois de um delay (tempo para leitura), a personagem é destruida e adicionada uma nova referente ao contexto 
        // o welcome texto é atualizdo para conscidir com o contexto. 
        this.time.delayedCall(3000, () => {
          defaultFazendeira.destroy();
          this.lolaFazendeira = this.add.image(this.larguraJogo / 5.5, this.alturaJogo / 1.48, 'fazendeiraRuiva_Lola').setScale(0.24);
          welcomeTxt.setText('Esse coelhinho fofo é a Lola, ela é minha melhor amiga e parceira a muitoooos anos.');
        }, [], this);

        this.time.delayedCall(7000, () => { 
          this.lolaFazendeira.destroy();
          this.sadFazendeira = this.add.image(this.larguraJogo / 5.5, this.alturaJogo / 1.48, 'fazendeiraSad').setScale(0.24);
          welcomeTxt.setText('Mas ela está longe de casa a muitos dias.');
        }, [], this);

        this.time.delayedCall(10000, () => { 
          this.sadFazendeira.destroy();
          this.pedidoFazendeira = this.add.image(this.larguraJogo / 5.5, this.alturaJogo / 1.48, 'pedidoFazendeira').setScale(0.24);
          welcomeTxt.setText('Então, ' + this.playerName + ' você pode ajudá-la a voltar para casa??');
        }, [], this);

        this.time.delayedCall(12000, () => { 
          // ultimo dialogo
          // adiciona uma transição para que os componentes sumam de forma gradual da tela 
          this.tweens.add({ 
            targets: [this.pedidoFazendeira, dialogBox, welcomeTxt, blurEffect],
            alpha: 0, 
            duration: 1000,
            onComplete: () => { // destroi tudo depois da transição de opacidade 
              this.pedidoFazendeira.destroy();
              dialogBox.destroy();
              welcomeTxt.destroy();

              // puxa a próxima cena e leva a variavel playername para ela 
              this.scene.start(SCENES.GAME, { playerName: this.playerName });
            }
          });
        }, [], this);

      };
    });

    

  };  

 

  update() {}
}
