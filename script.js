// Seleciona os elementos HTML pelo seu ID para interação no jogo
const menuScreen = document.getElementById('menu-screen');
const gameContainer = document.getElementById('game-container');
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score-display');

// Seleciona os botões de controle para dispositivos móveis
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// Variáveis de estado do jogo
let playerPosition = 0; // Posição inicial do jogador (esquerda)
let gameInterval; // Intervalo para spawnar obstáculos
let obstacles = []; // Array para armazenar os obstáculos criados
let speed = 2; // Velocidade inicial de movimento dos obstáculos
let obstacleSpawnInterval = 1000; // Intervalo de tempo entre a criação de obstáculos (em milissegundos)
let isGameOver = false; // Indica se o jogo terminou
let lastTime = 0; // Armazena o timestamp do último frame
let score = 0; // Pontuação inicial do jogador

// Função que aumenta a dificuldade do jogo ao longo do tempo
function increaseDifficulty() {
    speed += 0.1; // Aumenta a velocidade dos obstáculos
    obstacleSpawnInterval *= 0.98; // Diminui o intervalo de criação dos obstáculos
    clearInterval(gameInterval); // Limpa o intervalo atual
    gameInterval = setInterval(createObstacle, obstacleSpawnInterval); // Cria um novo intervalo com o tempo atualizado
}

// Evento de tecla pressionada para mover o jogador
document.addEventListener('keydown', (e) => {
    if (isGameOver) return; // Se o jogo acabou, não faz nada
    if (e.key === 'ArrowLeft' && playerPosition > 0) { // Move o jogador para a esquerda, se possível
        playerPosition--; // Decrementa a posição
        player.style.left = `${playerPosition * 50}px`; // Atualiza a posição do jogador no tabuleiro
    } else if (e.key === 'ArrowRight' && playerPosition < 2) { // Move o jogador para a direita, se possível
        playerPosition++; // Incrementa a posição
        player.style.left = `${playerPosition * 50}px`; // Atualiza a posição do jogador no tabuleiro
    }
});

// Adiciona a funcionalidade dos botões de controle para dispositivos móveis
leftBtn.addEventListener('click', () => {
    if (playerPosition > 0 && !isGameOver) { // Move o jogador para a esquerda, se possível
        playerPosition--;
        player.style.left = `${playerPosition * 50}px`; // Atualiza a posição do jogador no tabuleiro
    }
});

rightBtn.addEventListener('click', () => {
    if (playerPosition < 2 && !isGameOver) { // Move o jogador para a direita, se possível
        playerPosition++;
        player.style.left = `${playerPosition * 50}px`; // Atualiza a posição do jogador no tabuleiro
    }
});

// Função que cria um novo obstáculo
function createObstacle() {
    const obstacle = document.createElement('div'); // Cria um elemento div para representar o obstáculo
    obstacle.classList.add('obstacle'); // Adiciona a classe 'obstacle' ao elemento
    const obstaclePosition = Math.floor(Math.random() * 3); // Gera uma posição aleatória (0, 1 ou 2) para o obstáculo
    obstacle.style.left = `${obstaclePosition * 50}px`; // Define a posição horizontal do obstáculo
    obstacle.style.top = '0px'; // Define a posição inicial vertical do obstáculo
    gameBoard.appendChild(obstacle); // Adiciona o obstáculo ao tabuleiro do jogo
    obstacles.push({ element: obstacle, position: obstaclePosition, top: 0 }); // Armazena o obstáculo no array
}

// Função que move os obstáculos e verifica colisões
function moveObstacles(deltaTime) {
    obstacles.forEach((obstacle, index) => {
        obstacle.top += speed * (deltaTime / 16); // Move o obstáculo de acordo com a velocidade e o tempo decorrido
        obstacle.element.style.top = `${obstacle.top}px`; // Atualiza a posição vertical do obstáculo
        if (obstacle.top >= 350) { // Se o obstáculo saiu da tela
            obstacle.element.remove(); // Remove o obstáculo do tabuleiro
            obstacles.splice(index, 1); // Remove o obstáculo do array
            increaseScore(); // Aumenta a pontuação do jogador
        } else if (obstacle.top >= 260 && obstacle.position === playerPosition) { // Verifica se o obstáculo colidiu com o jogador
            endGame(); // Encerra o jogo se houve colisão
        }
    });
}

// Função que aumenta a pontuação do jogador
function increaseScore() {
    score++; // Incrementa a pontuação
    scoreDisplay.textContent = `Score: ${score}`; // Atualiza a exibição da pontuação
}

// Função que encerra o jogo
function endGame() {
    isGameOver = true; // Marca o jogo como finalizado
    clearInterval(gameInterval); // Para a criação de novos obstáculos
    clearInterval(difficultyInterval); // Para o aumento de dificuldade
    gameOverScreen.style.display = 'block'; // Exibe a tela de Game Over
}

// Função principal de loop do jogo, que controla o movimento dos obstáculos
function gameLoop(timestamp) {
    if (isGameOver) return; // Se o jogo acabou, não faz nada
    const deltaTime = timestamp - lastTime; // Calcula o tempo decorrido entre os frames
    lastTime = timestamp; // Atualiza o último timestamp
    moveObstacles(deltaTime); // Move os obstáculos
    requestAnimationFrame(gameLoop); // Chama o próximo frame
}

// Função que inicia o jogo
function startGame() {
    isGameOver = false; // Reinicia o estado do jogo
    obstacles = []; // Limpa os obstáculos
    score = 0; // Reseta a pontuação
    speed = 2; // Reseta a velocidade inicial
    obstacleSpawnInterval = 1000; // Reseta o intervalo inicial de criação dos obstáculos
    scoreDisplay.textContent = `Score: ${score}`; // Atualiza a pontuação na tela
    playerPosition = 0; // Coloca o jogador na posição inicial
    player.style.left = '0px'; // Atualiza a posição visual do jogador
    gameInterval = setInterval(createObstacle, obstacleSpawnInterval); // Começa a criar obstáculos em intervalos regulares
    difficultyInterval = setInterval(increaseDifficulty, 2000); // Aumenta a dificuldade a cada 2 segundos
    requestAnimationFrame(gameLoop); // Inicia o loop do jogo
}

// Função que reinicia o jogo recarregando a página
function restartGame() {
    location.reload(); // Recarrega a página para reiniciar o jogo
}

// Evento para iniciar o jogo ou reiniciar usando a tecla 'Enter'
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (menuScreen.style.display !== 'none') { // Se o menu inicial está visível
            startGame(); // Inicia o jogo
            menuScreen.style.display = 'none'; // Oculta o menu inicial
            gameContainer.style.display = 'flex'; // Exibe a tela do jogo
        } else if (gameOverScreen.style.display !== 'none') { // Se a tela de Game Over está visível
            restartGame(); // Reinicia o jogo
        }
    }
});

// Evento para iniciar o jogo ao clicar no botão 'Iniciar'
startButton.addEventListener('click', () => {
    menuScreen.style.display = 'none'; // Oculta o menu inicial
    gameContainer.style.display = 'flex'; // Exibe a tela do jogo
    startGame(); // Inicia o jogo
});

// Evento para reiniciar o jogo ao clicar no botão 'Reiniciar'
restartButton.addEventListener('click', restartGame); // Reinicia o jogo
