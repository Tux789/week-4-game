$(document).ready(function() {
//phase is variable indicating game state
	//0 = player selection
	//1 = enemy selection
	//2 = fight state
var phase = 0;
// predefined queries
var playerSelectionAreaDiv = $("#playerSelectionArea");
var playerAreaDiv = $("#playerArea");
var enemyAreaDiv = $("#enemyArea");
var playerFightAreaDiv = $("#playerFightArea");
var targetAreaDiv = $("#targetArea");
var instructionsDiv = $("#instructions");

//Character data model
function Character(name, imgSrc, maxHp, baseAttack,counterAttack, parentDiv){
	//character name
	this.name = name;
	//image sorce for the character image
	this.imgSrc = imgSrc;
	// initial hp value, used for game restart
	this.maxHp = maxHp;
	// current hp value
	this.hp = maxHp;
	// initial attack value, used for game restart
	this.baseAttack = baseAttack;
	// current attack value, used for player characters attack
	this.attack = baseAttack;
	// counter attack value, player = attack increment, defender = attack against player
	this.counterAttack = counterAttack;
	// div the character block is attached to, if null then blcok will not be rendered
	this.parentDiv = parentDiv;
	//unique identifier, index within CharacterArray.array
	this.index = 0;
	//render creates and populates the html elements for an individual character "block"

	this.render = function(inputDiv, index, addClasses = ""){
		//set parentDiv to inputDiv
		this.parentDiv = inputDiv;
		// create overall container div for character
		var newDiv = $("<div>");
		newDiv.addClass("characterDiv");
		if(addClasses !== ""){
		newDiv.addClass(addClasses);
			}
		// populate index
		this.index = index;
		//set attributes in html as they are in js data model
		newDiv.attr("data-index",index);
		newDiv.attr("data-attack", this.attack);
		newDiv.attr("data-baseAttack", this.baseAttack);
		newDiv.attr("data-hp", this.hp);
		newDiv.attr("data-counterAttack", this.counterAttack);
		newDiv.attr("data-maxHp",this.maxHp);
		//create name div
		var newNameSpan = $("<div>");
		 newNameSpan.text(this.name);
		 newNameSpan.addClass("characterName");
		 //create image 
		var newImgSpan = $("<img>");
		newImgSpan.attr("src",this.imgSrc);
		newImgSpan.addClass("characterImg");
		// create health bar container
		var newHealthSpan = $("<div>");
		newHealthSpan.addClass("characterHealth");
		newHealthSpan.attr("value",this.hp);
		// create health bar
		var newHealthBar = $("<div>");
		newHealthBar.addClass("characterHealthBar");
		var width = this.hp/this.maxHp*100;
		newHealthBar.css("width",width);
		//create text for character's health
		newHealthText = $("<div>");
		newHealthText.text(this.hp);
		newHealthSpan.append(newHealthBar);
		// append to container div
		newDiv.append(newNameSpan, newImgSpan, newHealthSpan, newHealthText);
		// add event
		$(newDiv).on("click",divPress);
		// append to parent div
		if (this.parentDiv !== null){
		this.parentDiv.append(newDiv);
			}
		
	};
} // end character

//Data Object for the array of characters and data related to the character collection
var CharacterArray = {
	//Array of character objects
		array: [],
		//index of character chosen by player
		playerIndex: 0,
		//index of defender
		enemyIndex: 0,
		//number of enemies, when 0 all enemies defeated
		numEnemies: 0,
		// render function renders ALL characters and populates them with index. IMPORTANT CharacterArray.render() MUST be ran initially to set the index within Character
		render: function(){
			//empty all divs
			emptyDivs();
			for(i=0;i<this.array.length;i++){
				// call render function for each character.
				this.array[i].render(this.array[i].parentDiv,i);
				
			}
		},

	}
 
CharacterArray.array.push(new Character("Space Cat", "assets/images/cat1.jpg",120,10,10,$("#playerSelectionArea")));
CharacterArray.array.push(new Character("Jeff","assets/images/myUglyMug.png",150,15,15,$("#playerSelectionArea")));
CharacterArray.array.push(new Character("The 10:15 to Utica","assets/images/train.png",180,20,20,$("#playerSelectionArea")));
CharacterArray.array.push(new Character("Uncomfy Headphones","assets/images/tech2.png",100,5,5,$("#playerSelectionArea")));
CharacterArray.numEnemies = CharacterArray.array.length -1;
instructionsDiv.text("Select your character");
CharacterArray.render();

function divPress() {
	var playerIndex = CharacterArray.playerIndex;
	var enemyIndex = CharacterArray.enemyIndex;
	console.log("click");
	if(phase === 1){ //if at enemy selection

	console.log("p1");
	if(parseInt($(this).attr("data-index")) !== playerIndex){ //make sure player isnt clicked, cannot fight self
		console.log(parseInt($(this).attr("data-index")));
	CharacterArray.enemyIndex = parseInt($(this).attr("data-index"));
	enemyIndex = CharacterArray.enemyIndex;
	$("#playerArea").empty();
	CharacterArray.array[playerIndex].render($("#playerFightArea"), playerIndex,"player");
	CharacterArray.array[enemyIndex].render($("#targetArea"), enemyIndex,"target");
	CharacterArray.render();
	instructionsDiv.text("Click the attack button to attack");
	phase = 2; // set phase to fight state
	}
} // end phase 1
	if(phase === 0){ //if in player selection
		
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
	phase = 1; //set phase to enemy selection
	}// end phase 0
console.log("out of div press");
}
// clear all divs
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
			//update health bar of enemy
			$("#targetArea > .characterDiv > .characterHealth .characterHealthBar").css("width", defender.hp/defender.maxHp * 100);
			console.log($("#targetArea > .characterDiv"));
			setTimeout(function(){enemyDiv.removeClass("hitAnimate")},100);
			//increment player's attack
			player.attack = player.attack + player.counterAttack;
			
			if (defender.hp > 0){
				player.hp = player.hp - defender.counterAttack;
				playerDiv.addClass("hitAnimate");
				$("#PlayerFightArea > .characterDiv > .characterHealth .characterHealthBar").css("width", player.hp/player.maxHp * 100);
				if(player.hp <=0){
					lose();
				}// end player loss check
			}// end inner defender hp check
		else{ //defender defeated
		enemyDiv.addClass("dead");
		// do not render dead enemies div any longer
		defender.parentDiv = null; 
		CharacterArray.numEnemies--
		console.log(CharacterArray.numEnemies);
		if(CharacterArray.numEnemies<=0){
			win();
		}else{
		player.parentDiv = playerAreaDiv;
		phase = 1; // go back to enemy selection
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
	
	}
		CharacterArray.playerIndex = 0;
		CharacterArray.enemyIndex = 0;
		CharacterArray.numEnemies = CharacterArray.array.length - 1;
		instructionsDiv.text("Select a character to be your player");
		phase = 0;
}
});