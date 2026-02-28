// -- Importando cada cena para a configuração de cenas do jogo.
import { startScene } from './scenes/startScene.js'; // nome da classe que constrói a cena + caminho do arquivo.
import { gameScene } from './scenes/gameScene.js';
import { instructionsScene } from './scenes/instructionsScene.js';
import { introScene } from './scenes/introScene.js';
import { endScene } from './scenes/endScene.js';

// Dimensões para o framework Phaser e toda a base do jogo.
var larguraJogo = 1000; 
var alturaJogo = 730;

// Configurações para inciar o Phaser.
var config = { 
  type: Phaser.AUTO, 
  width: larguraJogo, 
  height: alturaJogo,
  parent: 'game-container', // Para poder usar o html (o input) definimos onde o Phaser insere.

  // Definindo a configuração de física do jogo.
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 }, // Velocidade/Força da gravidade.
      debug: true
    },
  },

  // Configuração para poder usar o html sendo criado em javaScript
  dom: { 
    createContainer: true // Permite a criação de um elemento container dentro do Phaser para administrar as tags em HTML
  },

  scene: [startScene, introScene, instructionsScene, gameScene, endScene], // Chama as cenas importadas na ordem em que devem aparecer no jogo.
};

const game = new Phaser.Game(config); //inicia o Phaser
