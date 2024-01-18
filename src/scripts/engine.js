const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },

    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },

    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides:{
        player1:"player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer:"computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },

    actions:{
        button: document.getElementById("next-duel"),
    },
    
};




const pathImages = "./src/assets/icons/"

// enumerar é basicamente listar os elementos de forma que consiga resgatá-los facilmente, abaixo, há uma enumeração por colocar dentro de um array os elementos, que na verdade poderia m vir de um banco de dados dependendo do número de informações e personagens

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],   
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [0],
        LoseOf: [2],   
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],   
    },
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],   
    },
]

async function getRandomCardId(){
    // math floor faz com que arredonde, math random pega um numero aleatorio até certo comprimento, cardData[randomIndex] mostra o objeto em tal posição sorteada, .id vai retornar o id do objeto sorteado
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide){
    
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");


    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectedCard(idCard)
        });

        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"))
        });
    }

    

    return cardImage;
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);
        

    await hiddenCardDetails();

    await drawCardsInFields(cardId, computerCardId);
    

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function hiddenCardDetails(){
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = ""
}

async function showHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } 

    if (value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function drawCardsInFields(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function checkDuelResults(cardId, computerCardId){
    let duelResults = "It's a draw!"
    let duelAudio;
    let playerCard = cardData[cardId];

     switch (true){
         case playerCard.WinOf.includes(computerCardId):
             duelResults = "You won!";
             duelAudio = "win";
             state.score.playerScore++;
             break;
         case playerCard.LoseOf.includes(computerCardId):
            duelResults = "You lost."
            duelAudio = "lose"
            state.score.computerScore++;
            break;
     }

    await playAudio(duelAudio);
    return duelResults;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Wins: ${state.score.playerScore} Losses: ${state.score.computerScore}`;
}

async function removeAllCardsImages(){
    let {computerBox, player1Box} = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img)=>img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove())
}

async function drawCards(cardNumbers, fieldSide){

    // aqui fazemos a assinatura dos métodos/funções, depois, faremos a implementação das funções, apenas para ter um processo mais simples, com etapas claras
    for(let i = 0; i<cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try{audio.play();
    } catch {
        //caso quisesse poderia fazer um tratamento de erro aqui.
    }
    
}

async function resetDuel(){
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display ="none"
    state.fieldCards.computer.style.display ="none"
    
    init()
}

function init(){
    showHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init()