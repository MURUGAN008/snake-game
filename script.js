const gameBoard = document.getElementById("game-board");
const context = gameBoard.getContext('2d');
let scoreElement = document.getElementsByClassName("score-value")[0];
let highScoreElement = document.querySelector(".high-score-value")
const controlButtons = document.querySelectorAll(".btn")
let newHighScore = false;
let score = 0;
let active = true;
let started = false;
let WIDTH
let HEIGHT
let UNIT;
if(localStorage.getItem("highScore")===null){
    localStorage.setItem("highScore",0);
}
let highScore = localStorage.getItem("highScore");
let speed = 500; // game speed
let foodX;
let foodY;
setCanvasSize()
let snake = [
    {x:UNIT*3,y:0},
    {x:UNIT*2,y:0},
    {x:UNIT,y:0},
    {x:0,y:0}
]
let xVol = 25;
let yVol = 0;
startGame();
window.addEventListener('keydown', keyPress);
readyControlls();
function readyControlls(){

    readyButtons();
}
function keyPress(event){
    if(!started){
        started = true;
        nextTick();
    }

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    switch(true){
        case(event.keyCode==LEFT && xVol!=UNIT):
            xVol=(-UNIT);
            yVol = 0;
            break;
        case(event.keyCode==UP && yVol!=UNIT):
            xVol = 0;
            yVol = (-UNIT);
            break;
        case(event.keyCode==RIGHT && xVol!=(-UNIT)):
            xVol = UNIT;
            yVol = 0;
            break;
        case(event.keyCode==DOWN && yVol!=(-UNIT)):
            xVol = 0;
            yVol = UNIT;
            break;
    }
}
function readyButtons(){
    for (const btn of controlButtons) {
        btn.addEventListener("click",()=>{
            if(!started){
                started = true;
                nextTick();
            }
            if(btn.classList.contains("up-btn") && yVol!=UNIT){
                yVol = -UNIT;
                xVol = 0;
            }
            else if(btn.classList.contains("left-btn") && xVol!=UNIT){
                xVol = -UNIT;
                yVol = 0;
            }
            else if(btn.classList.contains("right-btn") && xVol!=(-UNIT)){
                xVol = UNIT;
                yVol = 0;
            }
            else if(btn.classList.contains("down-btn") && yVol!=(-UNIT)){
                yVol = UNIT;
                xVol = 0;
            }
        })
    }
}

function setCanvasSize(){
    WIDTH=500;
    HEIGHT=500;
    UNIT = 25;
}

function startGame(){
    context.fillStyle = '#212121';
    context.fillRect(0,0,WIDTH,HEIGHT);
    createFood()
    displayFood();
    checkHighScore();
    drawSnake();
}


function drawSnake(){
    context.fillStyle = 'green';
    context.strokeStyle = '#212121';
    for (const snakePart of snake) {
        context.fillRect(snakePart.x,snakePart.y,UNIT,UNIT);
        context.strokeRect(snakePart.x,snakePart.y,UNIT,UNIT);
    }
}




function createFood(){
    foodX = Math.floor(Math.random()*WIDTH/UNIT)*UNIT;
    foodY = Math.floor(Math.random()*HEIGHT/UNIT)*UNIT;
}
function displayFood(){
    context.fillStyle = 'red';
    context.fillRect(foodX,foodY,UNIT,UNIT)
    context.strokeStyle = '#212121'
    context.strokeRect(foodX,foodY,UNIT,UNIT);
}
function moveSnake(){
    let head = {x:snake[0].x+xVol,y:snake[0].y+yVol}
    snake.unshift(head)
    if(snake[0].x==foodX && snake[0].y==foodY){
        createFood();
        score+=1;
    }
        
    else
        snake.pop()
}

function clearBoard(){
    context.fillStyle = '#212121'
    context.fillRect(0,0,WIDTH,HEIGHT)
}

function nextTick(){
    if(active){
        setTimeout(()=>{
            clearBoard();
            displayFood();
            increaseSpeed();
            moveSnake();
            drawSnake();
            checkGameOver();
            displayScore();
            checkHighScore();
            nextTick();
        },speed)
    }
    else{
        clearBoard();
        context.font = "bold 50px serif";
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText("Game Over!!",WIDTH/2,HEIGHT/2);
        if(newHighScore){
            context.font = 'bold 25px serif';
            context.fillStyle = 'blue';
            context.textAlign = 'center';
            context.fillText(`New High Score: ${highScore}`,WIDTH/2, (HEIGHT/2)+50)
        }
    }
}


function increaseSpeed(){
    if(5<score && score < 10)
        speed = 400;
    else if(score<15)
        speed = 300;
    else if(score<20)
        speed = 200;
    else if(score<25)
        speed = 100;
    // else if(score<30)
    //     speed = 50;
    // else if(score<35)
    //     speed = 25;
}







function checkGameOver(){
    switch(true){
        case(0 > snake[0].x || snake[0].x >= WIDTH):
        case(0 > snake[0].y || snake[0].y >= HEIGHT):
            active = false;
            break;
    }
}
function displayScore(){
    scoreElement.textContent = score;
}

function checkHighScore(){
    if(score>highScore){
        highScore=score;
        localStorage.setItem("highScore",highScore);
        newHighScore = true;
    }
    displayHighScore();
}
function displayHighScore(){
    highScoreElement.textContent = highScore;
}