window.addEventListener('load', eventWindowLoaded, false);	

function eventWindowLoaded() {
	//creates assets
	var selectSound = new Audio();
	var passedGameSound = new Audio();
	var gameOverSound = new Audio();
	var imageElement = new Image();
	var userPhoto = new Image();
	selectSound.src = 'https://cdn.rawgit.com/moczka/puzzle-game/master/assets/sounds/mp3/select.mp3';
	passedGameSound.src = 'https://cdn.rawgit.com/moczka/puzzle-game/master/assets/sounds/mp3/passedGame.mp3';
	gameOverSound.src = 'https://cdn.rawgit.com/moczka/puzzle-game/master/assets/sounds/mp3/gameOver.mp3';
	imageElement.src = 'assets/defaultImage/defaultImage4.jpeg';
	
	//adds load event listeners
	selectSound.addEventListener('load', onAssetsLoad, false);
	passedGameSound.addEventListener('load', onAssetsLoad, false);
	gameOverSound.addEventListener('load', onAssetsLoad,false);
	imageElement.addEventListener('load', onAssetsLoad, false);

	
	
	var FRAME_RATE = 45;
	var theCanvas = $('#canvasOne');
	var context = theCanvas.getContext('2d');
	var gameOver = false;
	var drawFunction;

	var minWidth = 650;
	var minHeight = 450;
	
	//image information and level difficulty
	var italyPictures = [];
	var newyorkPictures = [];
	var landscapesPictures = [];
	
	var newyorkCount = 18;
	var italyCount = 45;
	var landscapesCount = 30;
	
	var puzzleDiff = {selected: false, value:undefined};
	var puzzleTheme = {selected: false, value:undefined};
	
	
	
	
	function onAssetsLoad(e){
	
	if(passedGameSound.canPlayType('audio/mp3') == ""){
	   		passedGameSound.src = 'https://cdn.rawgit.com/moczka/puzzle-game/master/assets/sounds/wav/passedGame.wav';
			selectSound.src = 'https://cdn.rawgit.com/moczka/puzzle-game/master/assets/sounds/wav/select.wav';
			gameOverSound.src = 'https://cdn.rawgit.com/moczka/puzzle-game/master/assets/sounds/wav/gameOver.wav';
			passedGameSound.addEventListener('load', onAssetsLoad, false);
			selectSound.addEventListener('load', onAssetsLoad, false);
			gameOverSound.addEventListener('load', onAssetsLoad, false);
		
	   }else{
		startScreen();
	   }
	}
	
	
function startScreen(){
	
	window.addEventListener('click', function(){selectSound.play()}, false);
	
	
	
	var initForm = $('#initForm');
	var videoPhoto;
	
	var takePhoto = $('#takePhoto');
	var cameraHolder = $('#cameraHolder');
	var myWebcam = new Webcam(false);
	var difficultyControl = $('#difficulty');
	difficulty.addEventListener('change', onDifficultyChange, false);
	var puzzleThemeControl = $('#puzzleTheme');
	puzzleThemeControl.addEventListener('change', onThemeChange, false);
	var beginButton = $('#beginButton');
	beginButton.addEventListener('click', onBeginGame, false);
	
	//starts Animation
	var particles =[];
	var numParticles = 70;
	var startX = theCanvas.width;
	var startY = theCanvas.height;
	
		for(var i =0; i<numParticles; i++){
			var particle = {x:0,y:0, velX:0, velY:0, speed:3, angle:0, color:"", radius:6, elasticity:0.50};
			var red = Math.round(Math.random()*255);
			var green = Math.round(Math.random()*255);
			var blue = Math.round(Math.random()*255);
			particle.elasticity += Math.random()*0.25;
			particle.color = "rgba("+red+","+green+","+blue+",0.8"+")";
			particle.x = startX * Math.random();
			particle.y = startY * Math.random();
			particle.angle = Math.random()* (2*Math.PI);
			particle.radius = particle.radius*Math.random() + 5;
			particle.speed *= Math.random();
			particle.velX = Math.cos(particle.angle)*particle.speed;
			particle.velY = Math.sin(particle.angle)*particle.speed;
			particles.push(particle);	
		}
	
	
	
	
	//sets the draw function
	drawFunction = welcomeDraw;
	
	//starts the loop
	gameLoop();
	

	
	var textAlpha = 1;
	var alphaSpeed = -0.02;
	
	function welcomeDraw(){

		console.log("Game Loop Running");
		//clears canvas
		
	context.drawImage(imageElement, 0, 0, theCanvas.width, theCanvas.height);
	context.strokeStyle = 'rgba(0,0,150,0.5)';
	context.lineWidth = 10;
	context.strokeRect(0, 0, theCanvas.width, theCanvas.height);
		
	
	context.fillStyle = 'rgba(255,0,0,'+textAlpha+')';
	context.font = "bold 50px Comic Sans MS";
	context.textAlign = "center";
	context.fillText("LOGIC PUZZLE GAME!", theCanvas.width/2, 100);	
	
		
	textAlpha += alphaSpeed;			
	alphaSpeed = (textAlpha<= 0)? 0.02: (textAlpha>=1)? -0.02: alphaSpeed;	
		
		
			for(var j = 0; j<particles.length; j++){
				var currentParticle = particles[j];
				
			currentParticle.x += currentParticle.velX;
			currentParticle.y += currentParticle.velY;
				
			checkBoundary(currentParticle);
				
			context.fillStyle = currentParticle.color;
			context.beginPath();
			context.arc(currentParticle.x, currentParticle.y, currentParticle.radius, 0, Math.PI*2, true);
			context.closePath();
			context.fill();		
			
			}
		
		

		
		
	}
	
	function onDifficultyChange(e){
		var target = e.target;
		switch(target.value){
			case "hard":
			puzzleDiff.selected = true;
			puzzleDiff.value = target.value;
				break;
			case "medium":
			puzzleDiff.selected = true;
			puzzleDiff.value = target.value;
				break;
			case "easy":
			puzzleDiff.selected = true;
			puzzleDiff.value = target.value;
				break;
			case "select":
			puzzleDiff.selected = false;
			puzzleDiff.value = undefined;
				break;	
		}
		
	}
	function onThemeChange(e){
		var target = e.target;
		switch(target.value){
			case "userphoto":
				if(!myWebcam.running && myWebcam.support){
				videoPhoto = myWebcam.begin();
				videoPhoto.width = 350;
				videoPhoto.height = 280;
				cameraHolder.insertBefore(videoPhoto, takePhoto);
				takePhoto.addEventListener('click', onTakePhoto, false);
				puzzleTheme.selected = true;
				puzzleTheme.value = target.value;
				initForm.setAttribute('style', 'top:20px;');
				cameraHolder.setAttribute('style', 'display: block; visibility: visible;');
				
				
				}else{
					videoPhoto = myWebcam.begin();
					takePhoto = cameraHolder.replaceChild(videoPhoto, takePhoto);
					//takePhoto.setAttribute('style', 'display: none; visibility: hidden;');
					cameraHolder.setAttribute('style', 'display: block; visibility: visible;');
				}
				break;
				
			case "italy":
				if(myWebcam.running || !myWebcam.support){
					myWebcam.stop();
					cameraHolder.setAttribute('style', '');
					initForm.setAttribute('style', '');
				}
				
				for(var a=0; a<italyCount; a++){
					italyPictures.push({url:"https://cdn.rawgit.com/moczka/puzzle-game/master/assets/italy/italy"+a+".jpeg"});
				}
				puzzleTheme.selected = true;
				puzzleTheme.value = target.value;
				break;
				
			case "newyork":
				if(myWebcam.running || !myWebcam.support){
					myWebcam.stop();
					cameraHolder.setAttribute('style', '');
					initForm.setAttribute('style', '');
				}
				for(var i=0; i<newyorkCount; i++){
					newyorkPictures.push({url:"https://cdn.rawgit.com/moczka/puzzle-game/master/assets/newyork/newyork"+i+".jpeg"});
				}
				puzzleTheme.selected = true;
				puzzleTheme.value = target.value;
				break;
				
			case "landscapes":
				puzzleTheme.selected = true;
				puzzleTheme.value = target.value;
				if(myWebcam.running  || !myWebcam.support){
					myWebcam.stop();
					cameraHolder.setAttribute('style', '');
					initForm.setAttribute('style', '');
				}
				
				for(var j=0; j<landscapesCount; j++){
		landscapesPictures.push({url:"https://cdn.rawgit.com/moczka/puzzle-game/master/assets/landscapes/landscape"+j+".jpeg"});
				}
				//puzzleTheme.selected = true;
				//puzzleTheme.value = target.value;
				break;
				
			case "select":
				if(myWebcam.running  || !myWebcam.support){
					myWebcam.stop();
					cameraHolder.setAttribute('style', '');
					initForm.setAttribute('style', '');
				}
				puzzleTheme.selected = false;
				puzzleTheme.value = undefined;
				break;
		}
	}
	function onBeginGame(e){
		if(puzzleDiff.selected && puzzleTheme.selected){
			//removes everything from the start game screen.
			//particle = numParticles = startX = startY = textAlpha = alphaSpeed = undefined;
			//difficultyControl.removeEventListener('click', onDifficultyChange, false);
			//puzzleThemeControl.removeEventListener('click', onThemeChange, false);
			beginButton.removeEventListener('click', onBeginGame, false);
			beginButton.setAttribute('style', 'display: none; visibility: hidden;');
			initForm.setAttribute('style', 'display: none; visibility: hidden;');
			gameOver = true;
			gameLoop();
			//difficultyControl = puzzleThemeControl = beginButton = undefined;
			
			if(myWebcam.running && myWebcam.support){
				myWebcam.stop();
				cameraHolder.removeChild(videoPhoto);
				cameraHolder.removeChild(takePhoto);
			}
			
			$('#puzzleMenu').setAttribute('style', 'display:block; visibility: visible;');
			console.log(puzzleTheme);
			console.log(landscapesPictures);
			//takePhoto.onblur = function(e){};
			beginGame();
		}else{
			//
		}
	}
	function onTakePhoto(e){
		e.target.value = "GOT IT!";
		var photoCanvas = document.createElement('canvas');
		var photoContext = photoCanvas.getContext('2d');
		photoCanvas.width = 650;
		photoCanvas.height = 450;
		photoContext.drawImage(videoPhoto, 0, 0);
		userPhoto.src = photoCanvas.toDataURL('image/jpeg');
		window.setTimeout(function(){e.target.value = "Take Photo";}, 300);
		
		
	}
	function checkBoundary(object){
			if(object.x >= theCanvas.width - object.radius){
				object.x = theCanvas.width - object.radius;
				object.velX = -object.velX;
				//object.velX *= object.elasticity;
				//updateAngle(object);


			}else if(object.x <= object.radius){
				object.x = object.radius;
				object.velX = -object.velX;
				//object.velX *= object.elasticity;
				//updateAngle(object);
				

			}else if(object.y <= object.radius){
				object.y = object.radius;
				object.velY = -object.velY;
				//object.velY *= object.elasticity;
				//updateAngle(object);
				
 
			}else if(object.y >= theCanvas.height - object.radius){
				object.y = theCanvas.height - object.radius;
				object.velY = -object.velY;
				//object.velY *= object.elasticity;
				//updateAngle(object);
			}
		}	

	
	
	
}








	

	




function beginGame() {
	
	//Puzzle Settings
	var rows;
	var cols;
	var xPad;
	var yPad;
	
	//piece width and height
	var startXOffset = 20;
	var startYOffset = 40;
	var partWidth = minWidth/cols;
	var partHeight = minHeight/rows;
	var currentLevel = 0;
	var numHints = 5;
	
	setDifficulty(puzzleDiff.value);
	imageElement = setLevelImage(imageElement, puzzleTheme, currentLevel);
	
	
	//Initialize Board
	var board = [];
	
	board = resetBoard(board);
	
	var puzzleSorted = false;
	var userGaveUp = false;
	var giveUserHint = false;
	var cursorHoldingHint = false;
	
	
	
	//need a functiont that will set up the array for the images to be used by the puzzle. 
	//set up the timer so it returns back the fastest time it took the user to solve the puzzle. 
	//add a timer for the hint
	
	theCanvas.addEventListener("mouseup",eventMouseUp, false);	
	var sortButton = document.getElementById("sortButton");
	sortButton.addEventListener("click", onSort, false);
	sortButton.removeAttribute('disabled');
	var giveUp = document.getElementById("giveupButton");
	giveUp.addEventListener('click', onGiveUp, false);
	giveUp.removeAttribute('disabled');
	var mainMenu = $('#mainMenu');
	mainMenu.addEventListener('click', function(){window.location.reload();}, false);
	var hintButton = $('#hintButton');
	hintButton.addEventListener('mousedown', onHintDown, false);
	hintButton.addEventListener('mouseup', onHintUp, false);
	
	
	var puzzleTimer = new Timer();
	
	FRAME_RATE = 1000;
	
	
	imageElement.addEventListener('load', function(){ drawFunction = drawScreen; gameOver = false; gameLoop();}, false);
	
	

function  drawScreen () {

		//Background
		context.fillStyle = '#000';
		context.fillRect(0, 0, theCanvas.width, theCanvas.height);
		//Box
		context.strokeStyle = 'rgba(0,0,150,0.5)';
		context.lineWidth = 10;
		context.strokeRect(0, 0, theCanvas.width, theCanvas.height);
		//Level Counter
		context.fillStyle = '#ffffff';
	  	context.textAlign = 'center';
	  	context.font = "bold 20px helvetica";
		context.fillText("Level: "+(currentLevel+1), theCanvas.width/4, 30);
	  	//Timer
	  	context.fillText(puzzleTimer.displayTime, 2*theCanvas.width/4, 30);
		//Hints
		context.fillText("Hints: "+numHints, 3*theCanvas.width/4, 30);
	 
		for (var c = 0; c < cols; c++) {
			for (var r = 0; r < rows; r++) {
				
				var tempPiece  = board[c][r];
				var imageX = tempPiece.finalCol*partWidth ;
				var imageY = tempPiece.finalRow*partHeight ;
				var placeX = c*partWidth+c*xPad+startXOffset;
				var placeY = r*partHeight+r*yPad+startYOffset;
				//context.drawImage(videoElement , imageX, imageY, partWidth, partHeight);
				context.drawImage(imageElement, imageX, imageY, partWidth, partHeight, placeX, placeY, partWidth, partHeight);
				if (tempPiece.selected) {
					
					context.strokeStyle = '#FFFF00'; 
					context.lineWidth = 5;
					context.strokeRect( placeX,  placeY, partWidth, partHeight);
					
				}
			}
		}
	
		if(giveUserHint){
			context.drawImage(imageElement, startXOffset, startYOffset, minWidth+(xPad), minHeight+(yPad));
		}
		
		
	  	  if(puzzleSorted){
		var resultBoard = [];  
		for(var a = 0; a<board.length; a++){
			for(var b = 0; b<board[0].length; b++){
				if((board[a][b].finalRow == b) && (board[a][b].finalCol == a)){
					resultBoard.push(true);
				}else{
					resultBoard.push(false);
				}
			}
		}
		  if(resultBoard.indexOf(false) == -1 && puzzleSorted && userGaveUp == false){
			  puzzleTimer.stop();
			  gameOver = true;
		  context.fillStyle = "#ff0000";
		  context.font = "bold 50px helvetica";
		  context.textAlign = "center";
		  context.fillText("Good Job!", theCanvas.width/2, theCanvas.height/2);
			passedGameSound.play();
			passedGameSound.addEventListener('ended', setNextLevel, false);  
			  
		  }else if(resultBoard.indexOf(false) == -1 && userGaveUp){
		  context.fillStyle = "#ff0000";
		  context.font = "bold 50px helvetica";
		  context.textAlign = "center";
		  context.fillText("Game Over!", theCanvas.width/2, theCanvas.height/2);
		gameOverSound.addEventListener('ended', function(){location.reload();}, false);
			gameOverSound.play();
			  puzzleTimer.stop();
			  gameOver = true;
		  }else{
			  gameOver = false;
		  }
	  }
	}
	
	
function randomizeBoard(board) {
		var newBoard = [];
		var cols = board.length;
		var rows = board[0].length
		for (var i = 0; i < cols; i++) {
			newBoard[i] = [];
			for (var j =0; j < rows; j++) {
				var found = false;
				var rndCol = 0;
				var rndRow = 0;
				while (!found) {
					rndCol = Math.floor(Math.random() * cols);
					rndRow = Math.floor(Math.random() * rows);

					if (board[rndCol][rndRow] != false) {
						found = true;
					}
				}
				
				newBoard[i][j] = board[rndCol][rndRow];
				board[rndCol][rndRow] = false;
			}
			
		}
		return newBoard;
	
	}
	
function eventMouseUp(event) {
		
		var mouseX;
		var mouseY;
		var pieceX;
		var pieceY;
		if ( event.layerX ||  event.layerX == 0) { // Firefox
   			mouseX = event.layerX ;
    		mouseY = event.layerY;
  		} else if (event.offsetX || event.offsetX == 0) { // Opera
    		mouseX = event.offsetX;
    		mouseY = event.offsetY;
  		}
		var selectedList= [];
		for (var c = 0; c < cols; c++) {
			
			for (var r =0; r < rows; r++) {
			   pieceX = c*partWidth+c*xPad+startXOffset;
			   pieceY = r*partHeight+r*yPad+startYOffset;
			   if ( (mouseY >= pieceY) && (mouseY <= pieceY+partHeight) && (mouseX >= pieceX) && (mouseX <= pieceX+partWidth) ) {
				   
				   if ( board[c][r].selected) {
				   		board[c][r].selected = false;
						
				   } else {
				   		board[c][r].selected = true;
						
				   }
			   }
			   if (board[c][r].selected) {
			   		selectedList.push({col:c,row:r})
			   }
			
			}				
		}
		if (selectedList.length == 2) {
			var selected1 = selectedList[0];
			var selected2 = selectedList[1];
			var tempPiece1 = board[selected1.col][selected1.row];
			board[selected1.col][selected1.row] =  board[selected2.col][selected2.row];
			board[selected2.col][selected2.row] = tempPiece1;
			board[selected1.col][selected1.row].selected = false;
			board[selected2.col][selected2.row].selected = false;
		}
		
		drawScreen();
	}
	
function onHintDown(e){
	cursorHoldingHint = true;
	if(cursorHoldingHint && numHints != 0){
		giveUserHint = true;
		drawScreen();
	}else{
		e.target.disabled = true;
	}
}
	
function onHintUp(e){
	numHints--;
	numHints = (numHints<0)? 0: numHints;
	cursorHoldingHint = false;
	giveUserHint = false;
	drawScreen();
}
	
function setDifficulty(difficulty){
		switch(difficulty){
			case "easy":
				rows = 3;
				cols = 3;
				xPad = 5;
				yPad = 5;
				partWidth = minWidth/cols;
				partHeight = minHeight/rows;
				break;
				
			case "medium":
				rows = 5;
				cols = 5;
				xPad = 3;
				yPad = 3;
				partWidth = minWidth/cols;
				partHeight = minHeight/rows;
				break;
				
			case "hard":
				rows = 10;
				cols = 10;
				xPad = 1;
				yPad = 1;
				partWidth = minWidth/cols;
				partHeight = minHeight/rows;
				break;	
		}
	}
	
function setLevelImage(puzzleImage, puzzleTheme, level){
	
	switch(puzzleTheme.value){
		case 'userphoto':
		puzzleImage.src = userPhoto.src;
			break;
		case 'italy':
		puzzleImage.src = italyPictures[level].url;	
			break;
		case 'newyork':
		puzzleImage.src = newyorkPictures[level].url;	
			break;
		case 'landscapes':
		puzzleImage.src = landscapesPictures[level].url;
			break;
	}
	return puzzleImage;
	
}
	
function setNextLevel(e){
	passedGameSound.removeEventListener('ended', setNextLevel, false);
	currentLevel++;
	numHints = 5;
	userGaveUp = false;
	puzzleSorted = false;
	sortButton.value = "Start";
	sortButton.disabled = false;
	puzzleTimer.displayTime = "Time: 0:0";
	imageElement = setLevelImage(imageElement, puzzleTheme, currentLevel);
	imageElement.addEventListener('load', function(){
		gameOver = false;
		gameLoop();
	}, false);
	board = resetBoard(board);
	hintButton.disabled = false;
	
}	
	
function onSort(e){
	puzzleTimer.start();
	var target = e.target;
	target.value = "Sorted";
	target.disabled = true;
	board = randomizeBoard(board);
	puzzleSorted = true;
	drawScreen();
	
	}
function onGiveUp(e){
	board = resetBoard(board);
	sortButton.disabled = false;
	sortButton.value = "Start";
	userGaveUp = true;
	drawScreen();
}
function resetBoard(board){
	for (var i = 0; i < cols; i++) {
			board[i] = [];
			for (var j =0; j < rows; j++) {
				board[i][j] = { finalCol:i,finalRow:j,selected:false };
			}
	}
		return board;
	}

}

function gameLoop(){
		if(!gameOver){
			window.setTimeout(gameLoop, FRAME_RATE);
			drawFunction();
	}
}	
	
	
	
//end of window onloadevent function	
}




//Class & Outter Functions
function prepareImage(image){
	if(Number(image.width) < minWidth || Number(image.height) < minHeight ){
		window.alert("Your image is too small! It will be replaced with a default image.");
		var defaultImage = new Image();
		defaultImage.src = "/assets/defaultImage/defaultImage.jpeg";
		defaultImage.onload = function (){
			image.src = defaultImage.src;
			image.centerOffsetX = 0;
			image.centerOffsetY = 0;
		}
	}else{
		
		image.centerOffsetX = (Number(image.width)/2)-(minWidth/2);
		image.centerOffsetY = (Number(image.height)/2)-(minHeight/2);
	}
	return image;
	
}
function Webcam(audioB, videoB){
	audioB = (audioB === undefined)? true: audioB;
	videoB = (videoB === undefined)? true: videoB;
	var video = document.createElement('video');
	var mediaStream;
	navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
	this.support = navigator.getUserMedia;
	this.running = false;
	var self = this;
	this.begin = function(){
		if(navigator.getUserMedia){
			//Added extra if statmenet because mozilla has its own version of the getUserMedia function
			if(navigator.mediaDevices.getUserMedia != undefined){
				var mozCam = navigator.mediaDevices.getUserMedia({audio:audioB, video:videoB});
				mozCam.then(successCall);
				mozCam.catch(failCall);
			}else{
				navigator.getUserMedia({audio:audioB, video:videoB}, successCall, failCall);
			}
		}else{
			video = document.createElement('p');
			video.innerHTML = "Your browser does not support webcam capture, download the latest version of Google Chrome";
		}
		function successCall(stream){
		  	mediaStream = stream;
			video.autoplay = true;
			video.src = window.URL.createObjectURL(stream);
			self.running = true;
			self.cameraName = mediaStream.getTracks()[0].label;
		}
		function failCall(stream){
		  mediaStream = stream;
			video = document.createElement('p');
			self.running = false;
			video.innerHTML = "Something went wrong with your camera or it is currently in use.";
		}
		return video;
	};
	this.stopVideo = function(){
	    if(mediaStream.getVideoTracks()[0].enabled){
	      mediaStream.getVideoTracks()[0].stop();
	    }
	};
	this.stopAudio = function(){
	    if(mediaStream.getVideoTracks()[0].enabled){
	      mediaStream.getAudioTracks()[0].stop();
	    }
	};
	this.cameraName = "Camera is not running" ;
	this.stop = function(){
		if(self.running){
			self.running = false;
			for(var i=0; i<mediaStream.getTracks().length; i++){
				mediaStream.getTracks()[i].stop();
			}		
		}
	}
}
function $(selector){
	return document.querySelector(selector);
}
function Timer(){
		var self = this;
		var seconds = 0;
		var minutes = 0;
		this.running = false;
		this.displayTime = "Time: "+minutes+":"+seconds;
		this.start = function(){
			self.running = true;
			seconds = 0;
			minutes = 0;
			self.displayTime = "Time: "+minutes+":"+seconds;
			addTime();
			function addTime(){
			if(self.running){
				seconds++;
				if(seconds>=60){
					seconds=0;
					minutes++;
				}
				self.displayTime = "Time: "+minutes+":"+seconds;
				window.setTimeout(addTime, 1000);
				}
			}
		}
		this.stop = function(){
			self.running = false;
		}
	}


















