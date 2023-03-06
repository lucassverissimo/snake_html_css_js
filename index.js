const playBoard = document.querySelector(".play-board");
const idPlay = document.getElementById("play");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const difficultySelect = document.getElementById("selectDificulty");
const difficulty = document.querySelector(".difficulty");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY= 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let pause = false;
let isFacil = true;


// Obter a maior pontuação do local storage

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Melhor pontuação: ${highScore}`;

// Atualizar a posição da comida randomicamente
const updateFoodPosition = () => {
    let newfoodX = Math.floor(Math.random() * 30) + 1;
    let newfoodY = Math.floor(Math.random() * 30) + 1;    

    // fazer lógica para que a comida não apareça no mesmo lugar da cobra.

    foodX = newfoodX;
    foodY = newfoodY;
}

const handleGameOver = () => {    
    clearInterval(setIntervalId);
    alert("Você perdeu! Pressione OK para reiniciar...");
    gameOver = false;
    snakeX = 5, snakeY= 5;
    velocityX = 0, velocityY = 0;
    snakeBody = [];
    score = 0;
    updateFoodPosition();
    setIntervalId = setInterval(initGame, 100);
}

// Alterar direção da cobra 
const changeDirection = e =>{
    //console.log("facil",isFacil); 
    pause = false;
    if (e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }else if (e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }else if (e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }else if (e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }else if(e.key === "p" && isFacil){                
        velocityX = 0;
        velocityY = 0;
        pause = true;        
    }
}

// mudar direção quando clicar 

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () =>{
    if (gameOver) return handleGameOver();        
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`    
    let localStorageDificulty = localStorage.getItem("dificulty");
    if (localStorageDificulty == "dificil" && difficultySelect.selectedIndex == 0){        
        difficultySelect.selectedIndex = 1;
    }
    if (localStorageDificulty == "facil" && difficultySelect.selectedIndex == 1){
        difficultySelect.selectedIndex = 0;
    }
    isFacil = difficultySelect.options[difficultySelect.selectedIndex].id == "facil";
    // quando a cobra comer a comida
    if (snakeX === foodX && snakeY === foodY){
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Pontuação: ${score}`;
        highScoreElement.innerText = `Melhor Pontuação: ${highScore}`;
    }
    
    // atualizar tamanho da cobra
    snakeX += velocityX;
    snakeY += velocityY;
    
    for (let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1];       
    }
    
    snakeBody[0] = [snakeX,snakeY];
    // verificando se a cobra bateu nas bordas
    
    if (isFacil){
        playBoard.style.border = "none" ;
        if (snakeX <= 0){
            snakeX = 30;
        }
        if (snakeX > 30){
            snakeX = 0;
        }
        if (snakeY <= 0){
            snakeY = 30;
        }
        if (snakeY > 30){
            snakeY = 0;
        }
    }else {
        playBoard.style.border = "solid 1px #ffffff" ;
        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30 ){
            return gameOver = true;
        }
    }
    
    if (!pause){
        for (let i = 0; i< snakeBody.length; i++){
            if (i != 0)
                html += `<div class="bodySnake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
            else 
                html += `<div class="headSnake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
                
            // verifica se a cobra bateu nela mesma
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && 
                snakeBody[0][0] === snakeBody[i][0] && !pause && !isFacil){
                    gameOver = true;
                    
                }
            }
            playBoard.innerHTML = html;
            
        }
    }
    
    updateFoodPosition()
    setIntervalId = setInterval(initGame, 100);
    document.addEventListener("keyup", changeDirection);
    
    const changeDificult = () => {
        localStorage.setItem("dificulty",difficultySelect.options[difficultySelect.selectedIndex].id);
        difficultySelect.blur();
    }