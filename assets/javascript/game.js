$(document).ready(function() {
var phase = 0;
// var playerIndex = 0;
// var enemyIndex = 0
var playerSelectionAreaDiv = $("#playerSelectionArea");
var playerAreaDiv = $("#playerArea");
var enemyAreaDiv = $("#enemyArea");
var playerFightAreaDiv = $("#playerFightArea");
var targetAreaDiv = $("#targetArea");
var instructionsDiv = $("#instructions");

function Character(name, imgSrc, maxHp, baseAttack,counterAttack,isPlayer,isRendered, parentDiv){
	this.name = name;
	this.imgSrc = imgSrc;
	this.maxHp = maxHp;
	this.hp = maxHp;
	this.baseAttack = baseAttack;
	this.attack = baseAttack;
	this.counterAttack = counterAttack;
	this.isPlayer = isPlayer;
	this.isRendered = isRendered;
	this.parentDiv = parentDiv;
	this.index = 0;
	this.render = function(inputDiv, index, addClasses = ""){
		this.parentDiv = inputDiv;
		var newDiv = $("<div>");
		newDiv.addClass("characterDiv");
		if(addClasses !== ""){
		newDiv.addClass(addClasses);
			}
		this.index = index;
		newDiv.attr("data-index",index);
		newDiv.attr("data-attack", this.attack);
		newDiv.attr("data-baseAttack", this.baseAttack);
		newDiv.attr("data-hp", this.hp);
		newDiv.attr("data-counterAttack", this.counterAttack);
		newDiv.attr("data-maxHp",this.maxHp);
		var newNameSpan = $("<div>");
		 newNameSpan.text(this.name);
		 newNameSpan.addClass("characterName");
		var newImgSpan = $("<img>");
		newImgSpan.attr("src",this.imgSrc);
		newImgSpan.addClass("characterImg");
		var newHealthSpan = $("<div>");
		newHealthSpan.addClass("characterHealth");
		newHealthSpan.attr("value",this.hp);
		var newHealthBar = $("<div>");
		newHealthBar.addClass("characterHealthBar");
		var width = this.hp/this.maxHp*100;
		newHealthBar.css("width",width);
		newHealthText = $("<div>");
		newHealthText.text(this.hp);
		newHealthSpan.append(newHealthBar);
		//newHealthBar.text(this.hp);
		newDiv.append(newNameSpan, newImgSpan, newHealthSpan, newHealthText);
		$(newDiv).on("click",divPress);
		if (this.parentDiv !== null){
		this.parentDiv.append(newDiv);
			}
		
	};
}
var CharacterArray = {
		array: [],
		
		// render: function(parentDiv){
		// 	parentDiv.empty();
		// 	for(i=0;i<this.array.length;i++){
		// 		this.array[i].render(parentDiv,i);
		// 	}
		// },
		playerIndex: 0,
		enemyIndex: 0,
		numEnemies: 0,
		render: function(){
			emptyDivs();
			for(i=0;i<this.array.length;i++){
				//console.log(this.array[i]);
				// console.log($("#enemyArea"));
				this.array[i].render(this.array[i].parentDiv,i);
				
			}
		},

	}
 
CharacterArray.array.push(new Character("Space Cat", "assets/images/cat1.jpg",100,5,5,false,true,$("#playerSelectionArea")));
CharacterArray.array.push(new Character("Jeff","assets/images/myUglyMug.png",120,10,5,false,true,$("#playerSelectionArea")));
CharacterArray.array.push(new Character("The 10:15 to Utica","assets/images/train.png",180,20,5,false,true,$("#playerSelectionArea")));
CharacterArray.array.push(new Character("Uncomfy Headphones","assets/images/tech2.png",150,15,5,false,true,$("#playerSelectionArea")));
// CharacterArray.render($("#playerSelectionArea"));
CharacterArray.numEnemies = CharacterArray.array.length -1;
instructionsDiv.text("Select your character");
CharacterArray.render();

function divPress() {
	var playerIndex = CharacterArray.playerIndex;
	var enemyIndex = CharacterArray.enemyIndex;
	console.log("click");
	if(phase === 1){

	console.log("p1");
	if(parseInt($(this).attr("data-index")) !== playerIndex){
		console.log(parseInt($(this).attr("data-index")));
	CharacterArray.enemyIndex = parseInt($(this).attr("data-index"));
	enemyIndex = CharacterArray.enemyIndex;
	$("#playerArea").empty();
	CharacterArray.array[playerIndex].render($("#playerFightArea"), playerIndex,"player");
	CharacterArray.array[enemyIndex].render($("#targetArea"), enemyIndex,"target");
	CharacterArray.render();
	instructionsDiv.text("Click the attack button to attack");
	phase = 2;
	}
} // end phase 1
	if(phase === 0){
		
		console.log("p0");
		CharacterArray.playerIndex = parseInt($(this).attr("data-index"));
		playerIndex = CharacterArray.playerIndex;
			console.log(playerIndex);
	for(i=0;i<CharacterArray.array.length;i++){
		if(i === playerIndex){
			CharacterArray.array[playerIndex].render($("#playerArea"), playerIndex);
		}else{
			CharacterArray.array[i].render($("#enemyArea"), i,"enemyClass");
		}
	}
	$("#playerSelectionArea").empty();
	instructionsDiv.text("Select an enemy to fight");
	phase = 1;
	}// end phase 0
console.log("out of div press");
}

function emptyDivs(){
	$("#playerSelectionArea").empty();
	$("#playerArea").empty();
	$("#enemyArea").empty();
	$("#playerFightArea").empty();
	$("#targetArea").empty();
}
$("#fightButton").on("click", function(){
	attackButton();
});
function attackButton(){
	console.log("in button");
	if(phase === 2){
		console.log(CharacterArray.playerIndex);
		console.log(CharacterArray.enemyIndex);
		var playerIndex = CharacterArray.playerIndex;
		var enemyIndex = CharacterArray.enemyIndex;
		var player = CharacterArray.array[playerIndex];
		var defender = CharacterArray.array[enemyIndex];
		var playerDiv = $("#playerFightArea > .characterDiv");
		var enemyDiv = $("#targetArea > .characterDiv")
		if (defender.hp > 0){
			defender.hp = defender.hp - player.attack;
			console.log($("#playerFightArea > .characterDiv"));
			playerDiv.animate({top: "+=2000px"},"normal");
			enemyDiv.addClass("hitAnimate");
			$("#targetArea > .characterDiv > .characterHealth .characterHealthBar").css("width", defender.hp/defender.maxHp * 100);
			console.log($("#targetArea > .characterDiv"));
			setTimeout(function(){enemyDiv.removeClass("hitAnimate")},100);
			player.attack = player.attack + player.counterAttack;
			//CharacterArray.render();
			if (defender.hp > 0){
				player.hp = player.hp - defender.counterAttack;
				playerDiv.addClass("hitAnimate");
				$("#PlayerFightArea > .characterDiv > .characterHealth .characterHealthBar").css("width", player.hp/player.maxHp * 100);
				if(player.hp <=0){
					lose();
				}// end player loss check
			}// end inner defender hp check
		else{
		enemyDiv.addClass("dead");
		defender.parentDiv = null;
		CharacterArray.numEnemies--
		console.log(CharacterArray.numEnemies);
		if(CharacterArray.numEnemies<=0){
			win();
		}else{
		player.parentDiv = playerAreaDiv;
		phase = 1;
	}
	}
}// end first defender hp check
		setTimeout(function(){CharacterArray.render()},300);
	}//end if phase 2
}
function lose(){
	resetGame();
}
function win(){
	resetGame();
}
function resetGame(){
	for(i=0;i<CharacterArray.array.length;i++){
		var char = CharacterArray.array[i];
		char.hp = char.maxHp;
		char.attack = char.baseAttack;
		char.render(playerSelectionAreaDiv,i);
		CharacterArray.playerIndex = 0;
		CharacterArray.enemyIndex = 0;
		CharacterArray.numEnemies = CharacterArray.array.length - 1;
		instructionsDiv.text("Select a character to be your player");
		phase = 0;
	}
}
function attack(player,defender){
	defender.hp = defender.hp - player.attack;
	if(defender.hp > 0){
		player.hp = player.hp - defender.counterAttack;
	}
}
// Attack(playerIndex, enemyIndex){

// }
});