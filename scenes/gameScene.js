// Importa as configurações de cenas (a classe) para serem usadas as keys. 
import { SCENES } from "../gameConfig.js";

// Classe construtora da cena que ENVIA as informações para o Phaser 
export class gameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME });
    this.larguraJogo = 1000; // largura do jogo
    this.alturaJogo = 730;// altura do jogo 

    // variaveis globais do jogo
    this.player;
    this.teclado;
    this.pontuacao = 0;
    this.scoreText;
    this.placar;
    this.skyElements = ['cloundOne', 'cloundTwo', 'cloundThree'];
    this.collectibles = ['carrotPoints','carrotBoost','carrotTrap'];
    this.fullLife;
    this.middLife;
    this.criticalLife;
    this.life = 3;
    this.gameOver;
    this.boost;
    this.isBoosting = false;
    this.endHouse;
    this.playerName;

  }
  
  init(data) {
    // Pega o nome do pacote que a cena Intro enviou
    this.playerName = data.playerName; 
  }

  preload() {
    this.load.image("backgroundJogo", "assets/bgJogo.png");
    this.load.image('sky', 'assets/sky.png');
    this.load.image('endHouse','assets/skyElements/endHouse.png');

    this.load.image('player','assets/characters/player.png');
    this.load.image('score','assets/score.png');

    this.load.image('plataforma','assets/skyElements/plataform.png')

    // -- Vida ---
    this.load.image('oneHeart','assets/oneHeart.png');
    this.load.image('twoHeart','assets/twohearts.png');
    this.load.image('threeHeart','assets/threeHearts.png');

    // -- Nuvens --
    this.load.image('cloundOne','assets/skyElements/cloundOne.png');
    this.load.image('cloundTwo','assets/skyElements/cloundTwo.png');
    this.load.image('cloundThree','assets/skyElements/cloundThree.png');

    // -- Cenouras --
    this.load.image('carrotPoints','assets/collectibles/carrotScore.png');
    this.load.image('carrotBoost','assets/collectibles/carrotBoost.png');
    this.load.image('carrotTrap','assets/collectibles/carrotTrap.png');

    this.load.image('gameOver', 'assets/gameOver.png');

    this.load.spritesheet('boost', 'assets/effects/boost.png', {
      frameWidth: 32,  // Largura de cada frame
      frameHeight: 32  // Altura de cada frame
    });

  }


  create() {
    this.add.tileSprite(this.larguraJogo / 2, (-3000 + this.alturaJogo) / 2, this.larguraJogo ,3730 ,'sky'); // repete a imagem até a altura desejada para criar o céu.
    this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, "backgroundJogo"); // cria o background do jogo (a parte antes do céu)

    this.boost = this.add.sprite(this.larguraJogo/2, 485, 'boost').setScale(2);// adiciona e configura a spritesheet do boost com a animação 

    // Criação da animação
    this.anims.create({
      key: 'boost', // chave da animação
      frames: this.anims.generateFrameNumbers('boost', { start: 0, end: 14 }), // Pega os 15 frames da spritesheet
      frameRate: 10, // Velocidade da animação (FPS)
      repeat: -1     // faz a animação repetir em loop infinito
    });
    
    this.boost.setVisible(false); // define o boost como não visível
  

    const floor = this.add.zone(500, 690, 1000, 100); // adiciona um quadrado não visivel para atribuir a fisica do chão 
    this.physics.add.existing(floor, true); // adiciona fisica ao quadrado criado

    // cria o grupo de cenouras
    // funciona como o POO, criando objetos com as mesmas caracteristicas
    this.carrotPointsGroup = this.physics.add.group();
    this.carrotBoostGroup = this.physics.add.group();
    this.carrotTrapGroup = this.physics.add.group();


    // lógica para gerar as nuvens 
    let contador = 0
    while (contador <= 15) { // adiciona 15 * 3 nuvens = 45 nuvens
      for (let i = 0; this.skyElements.length > i; i++){ // para caminhar na lista que elas estão guardadas
        let positionYRandon = Phaser.Math.RND.between(-3000, 0); // posição y aleatoria entre -3000 e 0 para pegar só o ceu
        let positionXRandon = Phaser.Math.RND.between(30, 970); // posição x aleatoria entre 30 e 970
        this.add.image(positionXRandon, positionYRandon, this.skyElements[i]).setScale(0.1); // adiciona as nuvens.
      }
      contador += 1
    };

    // lógica para criar as cenouras
    // todas os 3 whiles seguintes funcionam da mesma forma:
    let positionY = 0; // posição da primeira cenoura
    let quantidadePontos = 15;  // quantidade de cenouras
    while ( quantidadePontos > 0){ ;
      let positionXRandon = Phaser.Math.RND.between(30, 970); // posiçõa x aleatória
      let carrotPoints = this.carrotPointsGroup.create(positionXRandon, positionY, this.collectibles[0]).setScale(0.04); // cria a cenoura puxando o grupo dela
      carrotPoints.body.setAllowGravity(false); // desabilita a gravidade da cenoura
      quantidadePontos -= 1; 
      positionY -= 200 // vai criando a cenoura cada vez mais alta
    }

    positionY = 0; // reseta a variável 
    let quantidadeBoost = 1;
    while ( quantidadeBoost > 0){ 
      positionY -= 732;
      let positionXRandon = Phaser.Math.RND.between(30, 970);
      let carrotBoost = this.carrotBoostGroup.create(positionXRandon, positionY, this.collectibles[1]).setScale(0.04);
      carrotBoost.body.setAllowGravity(false);
      quantidadeBoost -= 1; 
    }

    positionY = 0;
    let quantidadeTrap = 5;
    while ( quantidadeTrap > 0){ 
      positionY -= 586;
      let positionXRandon = Phaser.Math.RND.between(30, 970);
      let carrotTrap = this.carrotTrapGroup.create(positionXRandon, positionY, this.collectibles[2]).setScale(0.04);
      carrotTrap.body.setAllowGravity(false);
      quantidadeTrap -= 1; 
    }


    // cria a casa (objetivo do jogo)
    this.endHouse = this.physics.add.image(this.larguraJogo/2, -2700, 'endHouse').setScale(0.3);

    // cria as 3 plataformas do jogo para servirem de apoio e barreira
    const plataforma1 = this.add.image(300, -1000,'plataforma').setScale(0.15);
    const plataforma2 = this.add.image(500, -1500,'plataforma').setScale(0.15);
    const plataforma3 = this.add.image(700, -2000,'plataforma').setScale(0.15);

    // cria o player, ou seja, personagem controlável
    this.player = this.physics.add.sprite(this.larguraJogo/2, 485, 'player').setScale(0.15);
    this.player.setCollideWorldBounds(true); // adiciona a fisica de sobreposição de objetos
    this.player.setBodySize(1350,2000); // define o tamanho da hitbox (area de fisica do corpo do objeto)

    //configurações da casa
    this.physics.add.overlap(this.player, this.endHouse, this.win, null, this); // quando o player e a casa se sobreporem, chama a função win
    this.endHouse.body.setAllowGravity(false); // desativa a gravidade
    this.endHouse.setBodySize(500,500); // define o tamanho da hitbox (area de fisica do corpo do objeto)


    // adicionando a lógica de sobreposição para cada tipo de cenoura e chamando sua respectiva função 
    this.physics.add.overlap(this.player, this.carrotPointsGroup, this.collectCarrotPoints, null, this);
    this.physics.add.overlap(this.player, this.carrotBoostGroup, this.collectCarrotBoost, null, this);
    this.physics.add.overlap(this.player, this.carrotTrapGroup, this.collectCarrotTrap, null, this);
  

    // adicionando colisão entre as 3 plataformas e o player
    this.physics.add.collider(this.player, plataforma1);
    this.physics.add.existing(plataforma1, true);

    this.physics.add.collider(this.player, plataforma2);
    this.physics.add.existing(plataforma2, true);

    this.physics.add.collider(this.player, plataforma3);
    this.physics.add.existing(plataforma3, true);

    // adicionando a colisão do player com o chão
    this.physics.add.collider(this.player, floor);

    // adiciona o fundo do placar do jogo 
    this.placar = this.add.image(this.larguraJogo/1.1, 80, 'score').setScale(0.1).setScrollFactor(0);

    // cria o texto para a pontuação e a estilização e usa o texto sendo a variavel this.pontuação que é atualizada a cada ponto novo
    this.scoreText = this.add.text(this.placar.x + 3,this.placar.y - 13, this.pontuacao ,{
      fontSize: '30px',
      fill:'#000000', 
      align: 'center',
      wordWrap: { width: 150 },
    }).setScrollFactor(0); // acompanha a camera durante a rolagem (fica fixo na tela)

    // adicionando a simbologia de vida
    this.fullLife = this.add.image(this.larguraJogo/7, 80, 'threeHeart').setScale(0.08).setScrollFactor(0); // tres corações fixos na tela
    this.middLife = this.add.image(this.larguraJogo/7, 80, 'twoHeart').setScale(0.08).setScrollFactor(0);// dois corações fixos na tela
    this.criticalLife = this.add.image(this.larguraJogo/7, 80, 'oneHeart').setScale(0.08).setScrollFactor(0); // um corações fixos na tela

    // inicia com a vida cheia, escondendo (deixando invisivel) os outros estágios
    this.middLife.setVisible(false);
    this.criticalLife.setVisible(false);

    // váriavel para receber a entrada de teclad/ações do teclado
    this.teclado = this.input.keyboard.createCursorKeys();

    //configurações de camera
    this.cameras.main.startFollow(this.player); // faz com que a camera siga o personagem pelo ceu (quando y vira negativo)
    this.physics.world.setBounds(0, -3000, this.larguraJogo, 3730); // define o tamanho fisico do mundo
    this.cameras.main.setBounds(0, -3000, this.larguraJogo, 3730); //adiciona fisica na camera para percorrer todo o tamanho fisico do jogo

    // tela de game over
    this.gameOver = this.add.image(this.larguraJogo / 2, this.alturaJogo / 2, 'gameOver').setScrollFactor(0);
    this.gameOver.setVisible(false); // incia de forma não visivel
  };  

  update() {

    // -- Movimentação do player em relação as teclas do teclado.
    if (this.teclado.left.isDown) { // Se for apertada a seta para a esquerda 
      this.player.setVelocityX(-150); // Define a velocidade do eixo X para -150.

    } else if (this.teclado.right.isDown){  // Se for apertada a seta para a direita 
      this.player.setVelocityX(150); // Define a velocidade do eixo X para 150.
      

    } else { // se nenhuma das duas teclas forem pressionadas 
      this.player.setVelocityX(0); // a velocidade de x é definida para 0

    }

    if (this.teclado.up.isDown){ // Se for apertada a seta para a cima 
      this.player.setVelocityY(-150);// A velocidade de Y é definida como -150.

    } else{};

    if (this.isBoosting == true){ // se o estado do player for de boost
      this.player.setVelocityY(-300); // a velocidade de y é duplicada
    }

    // faz com que a sprite dp boost sempre acompanhe o player
    this.boost.setPosition(this.player.x, this.player.y + this.player.displayHeight / 2 );

  };

  // -- Funções das cenouras

  collectCarrotPoints(player, carrot) { // cenoura que atribui pontos
    carrot.disableBody(true, true); // ao passar/pegar a cenoura, ela some
    this.pontuacao += 1; // incrementa a variavel de pontuação 
    this.scoreText.setText(this.pontuacao); // atualiza o texto do placar 
  }

  collectCarrotBoost(player, carrot) { // cenoura que atribui pontos
    this.isBoosting = true; // atribui o estado de boost para "ativo"
    this.boost.setVisible(true); // torna o boost visivel 
    this.boost.play('boost', true); // dá play na animação do boost 
    this.player.setVelocityX(300); // aumenta a velocidade para a direita
    this.time.delayedCall(3000, () => { // define o tempo de duração do boost 
      // após passar o tempo, entra nessa função que:
      this.boost.setVisible(false);  // some com o boost
      this.isBoosting = false; // muda o estado do boost para "desativado"
    });
    
    carrot.disableBody(true, true);// some com o objeto pegado

  }

  collectCarrotTrap(player, carrot) { // cenoura que tira vida 
    carrot.disableBody(true, true); // some com o objeto pegado
    this.life -= 1; // decrementa a vida (que começa em 3)

    if (this.life == 2){  
      this.fullLife.setVisible(false); // some com a imagem de vida cheia 
      this.middLife.setVisible(true); // aparece com a imagem de duas vdas

    } else if (this.life == 1){ 
      this.middLife.setVisible(false); // some com a imagem de duas vidas
      this.criticalLife.setVisible(true); // aparece com a imagem de uma vida

    } else { // quando as vidas acabam
      this.criticalLife.setVisible(false); // some com as vidas
      this.gameOver.setVisible(true); // mostra a mensagem de game over 
      this.physics.pause(); // pausa o jogo, a fisica dele 

      // dá um tempo para a leitura da mensagem de game over 
      this.time.delayedCall(3000, () => { 
        this.scene.restart(); // reinicia a cena 
        this.pontuacao = 0; // reseta a pontuação 
        this.life = 3; // reseta a vida 
      }, [], this);
      
    }

  }

  // lógica de vitória 
  // quando o player chega na casa 
  win(player, house){
    this.physics.pause(); // pausa a fisica do jogo 
    this.cameras.main.fadeOut(500, 0, 0, 0); // Inicia um fadeOut para a transição de cena.
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { // se o fadeOut foi completado na cena.
        
      // puxa a próxima cena e leva a variavel playername para ela 
      this.scene.start(SCENES.END, { playerName: this.playerName });      
    });
    
  }
    
}

