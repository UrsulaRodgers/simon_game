var chosenCol = []; //array to store colours randomly chosen by the computer
var userCol = []; //array to store user's choices
var colours = ["RED","BLUE","GREEN","YELLOW"];//array of colours available
var counter = 0;//increments with each turn
var i = 0; //used to regulate clearInterval 
var wait; //wait time for interval 
var off; //time before lit up colour is switched off
var delay; //refers to the setInterval function
var strict; //set when the user selects to play the 'hard' level
var repeat; //switched to true or false depending on whether or not a sequence needs to be played back if playing the easy level


//functions to flash a light and play a corresponding sound when a particular button is clicked or a specific colour is present
//in the chosenCol array during playback
var light = {
		redLight: function(){
			//intervals shorten as the count increases
			if (counter <= 10){
				off=600;
			} else {
				off=400;
			}
			$("#red").css("background-color","#F93708");
			setTimeout(function(){$("#red").css("background-color","#B2130C"); $("#audio1")[0].play();}, off);
		},
		blueLight: function(){
			if (counter <= 10){
				off=600;
			} else {
				off=400;
			}
			$("#blue").css("background-color","#0F20F9");
			setTimeout(function(){ $("#blue").css("background-color","#0A158A"); $("#audio2")[0].play();},off);
		},
		greenLight: function(){
			if (counter <= 10){
				off=600;
			} else {
				off=400;
			}
			$("#green").css("background-color","#12EA39");
			setTimeout(function(){ $("#green").css("background-color","#16980E"); $("#audio3")[0].play();},off);
		},
		yellowLight:function(){
			if (counter <= 10){
				off=600;
			} else {
				off=400;
			}
			$("#yellow").css("background-color","#F7FA0F");
			setTimeout(function(){ $("#yellow").css("background-color","#D2CC13"); $("#audio4")[0].play();},off);
		},
};

var game = {
		init: function(){
			if (chosenCol.length < 1){
				counter++; //marks first round only
				$("#display > p").html(counter);
			}
			game.colourSelector();
		},
		//computer randomly selects a colour and pushes it to the chosenCol array
		colourSelector: function(){
			var randomColours = colours[Math.floor(Math.random()*colours.length)];
			chosenCol.push(randomColours);
			console.log(chosenCol);
			setTimeout(function() {game.colourChanger();},1000);
		},
		//changes the colour of the most newly selected random colour in each round
		colourChanger: function(){ 
			if (chosenCol[chosenCol.length-1] === "RED"){
				light.redLight();
			} else if (chosenCol[chosenCol.length-1] === "BLUE"){
				light.blueLight();
			} else if (chosenCol[chosenCol.length-1] === "GREEN"){
				light.greenLight();
			} else {
				light.yellowLight();
				}	
		},
		//after a random colour is selected, the user repeats the sequence of colours played back by from the 
		//chosenCol array
		//user selections are pushed to a userCol array and the two arrays compared
		checkMatch: function(){
			repeat = false; //sequence won't be repeated unless set to true
			if (userCol[userCol.length-1] === chosenCol[userCol.length-1]) { //if all items match
				if (userCol.length === chosenCol.length && counter>=1 && counter<20){ 
					counter++;
					userCol = [];
					setTimeout(function(){game.playBack();},1500);
				} else {
					if (counter === 20 && userCol.length === chosenCol.length){ //max of 20 rounds
						setTimeout(function(){$("#display > p").html("Win!");},500);
						setTimeout(function(){game.reset();},2000);
					}
				}
			} else {
				if (strict) {
					setTimeout(function(){$("#wrong")[0].play();},500);
					game.reset();
				} else {
					userCol=[];
					repeat = true; //computer can now repeat the same sequence until the user gets it right
					setTimeout(function(){$("#wrong")[0].play();},500);
					setTimeout(function(){game.playBack();},1500);
				}
				
			}
		},
		//
		playBack: function () {
			$("#display > p").html(counter); //displays the counter value at the beginning of each turn 
			if (counter <= 10){
				wait=1000;
			} else {
				wait=600;
			}
			delay = setInterval(function(){
				if (chosenCol[i] === "RED"){
					light.redLight();
				} else if (chosenCol[i] === "BLUE"){
					light.blueLight();
				} else if (chosenCol[i] === "GREEN"){
					light.greenLight();
				} else {
					light.yellowLight();
				}
			i++;
			if (i >= chosenCol.length) {
				i = 0;
				clearInterval(delay);
				if (!repeat){
				game.colourSelector(); //if not in repeat mode, move on to choose a new colour
				}
			}
			},wait);
		},
		//reset linked to the reset button, or in hard (strict) mode
		reset:function(){
			chosenCol = [];
			userCol = [];
			counter = 0;
			$("#display > p").html(counter);
			$("#easy").attr("disabled", false);
			$("#hard").attr("disabled", false);
		}
};

$(document).ready(function(){
	$("#red").attr("disabled",true);
	$("#blue").attr("disabled",true);
	$("#green").attr("disabled",true);
	$("#yellow").attr("disabled",true);
	$("#reset").attr("disabled",true);
	
	$("#easy").click(function(){
		game.init();
		$(this).attr("disabled", true);
		$("#hard").attr("disabled", true);
		$("#reset").attr("disabled",false);
		$("#red").attr("disabled",false);
		$("#blue").attr("disabled",false);
		$("#green").attr("disabled",false);
		$("#yellow").attr("disabled",false);
	});
	$("#hard").click(function(){
		strict = true;
		game.init();
		$(this).attr("disabled", true);
		$("#easy").attr("disabled", true);
		$("#reset").attr("disabled",false);
		$("#red").attr("disabled",false);
		$("#blue").attr("disabled",false);
		$("#green").attr("disabled",false);
		$("#yellow").attr("disabled",false);
	});
	$("#reset").click(function(){
		game.reset();
		$("#hard").attr("disabled", false);
		$("#easy").attr("disabled", false);
	});
	$("#red").click(function(){
		light.redLight();
		userCol.push("RED");
		game.checkMatch();
	});
	$("#blue").click(function(){
		light.blueLight();
		userCol.push("BLUE");
		game.checkMatch();
	});
	$("#green").click(function(){
		light.greenLight();
		userCol.push("GREEN");
		game.checkMatch();
	});
	$("#yellow").click(function(){
		light.yellowLight();
		userCol.push("YELLOW");
		game.checkMatch();
	});
});

