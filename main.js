window.addEventListener('load', eventWindowLoaded, false);	

function eventWindowLoaded() {
	//creates assets
	var selectSound = new Audio();
	var passedGameSound = new Audio();
	var gameOverSound = new Audio();
	var imageElement = new Image();
	var userPhoto = new Image();
	selectSound.src = 'assets/sounds/mp3/select.mp3';
	passedGameSound.src = 'assets/sounds/mp3/passedGame.mp3';
	gameOverSound.src = 'assets/sounds/mp3/gameOver.mp3';
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
	
	//variable to hold the function that is called by gameLoop
	var drawFunction;

	var minWidth = 650;
	var minHeight = 450;
	
	//image arrays for puzzle themes
	var italyPictures = [];
	var newyorkPictures = [];
	var landscapesPictures = [];
	
	//number of pictures avaiable for each theme.
	var newyorkCount = 18;
	var italyCount = 45;
	var landscapesCount = 30;
	
	//objects for the puzzle difficulty and puzzle theme.
	var puzzleDiff = {selected: false, value:undefined};
	var puzzleTheme = {selected: false, value:undefined};
	
	function onAssetsLoad(e){
	
		//if mp3 is not supported, change source for wav
	if(passedGameSound.canPlayType('audio/mp3') === ""){
	   		passedGameSound.src = 'assets/sounds/wav/passedGame.wav';
			selectSound.src = 'assets/sounds/wav/select.wav';
			gameOverSound.src = 'assets/sounds/wav/gameOver.wav';
			passedGameSound.addEventListener('load', onAssetsLoad, false);
			selectSound.addEventListener('load', onAssetsLoad, false);
			gameOverSound.addEventListener('load', onAssetsLoad, false);
		
	   }else{
		  //removes event listeners once all assets have loaded.
		passedGameSound.removeEventListener('load', onAssetsLoad, false);
		selectSound.removeEventListener('load', onAssetsLoad, false);
		gameOverSound.removeEventListener('load', onAssetsLoad, false);
		imageElement.removeEventListener('load', onAssetsLoad, false);
		 
		   //calls the function that will draw the starting page.
		startScreen();
	   }
	}
	
	
function startScreen(){

	
	//creates a variable for the div holding the option controls
	var initForm = $('#initForm');
	var videoPhoto;
	
	var takePhoto = $('#takePhoto');
	var cameraHolder = $('#cameraHolder');
	//creates a webcam object and sets audio to false.
	var myWebcam = new Webcam(false);
	var difficultyControl = $('#difficulty');
	difficultyControl.addEventListener('change', onDifficultyChange, false);
	var puzzleThemeControl = $('#puzzleTheme');
	puzzleThemeControl.addEventListener('change', onThemeChange, false);
	var startButtons = $('#startButtons');
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
	
	
	
	
	//sets the draw function to the welcomeDraw that draws the bubbles.
	drawFunction = welcomeDraw;
	
	//starts the loop
	gameLoop();
	

	
	var textAlpha = 1;
	var alphaSpeed = -0.02;
	
	function welcomeDraw(){
		
		
		//the intro image clears the canvas on every call.
	context.drawImage(imageElement, 0, 0, theCanvas.width, theCanvas.height);
	context.strokeStyle = 'rgba(0,0,150,0.5)';
	context.lineWidth = 10;
	context.strokeRect(0, 0, theCanvas.width, theCanvas.height);
		
	//game name animation
	context.fillStyle = 'rgba(255,0,0,'+textAlpha+')';
	context.font = "bold 50px Comic Sans MS";
	context.textAlign = "center";
	context.fillText("LOGIC PUZZLE GAME!", theCanvas.width/2, 100);	
	
		
	textAlpha += alphaSpeed;			
	alphaSpeed = (textAlpha<= 0)? 0.02: (textAlpha>=1)? -0.02: alphaSpeed;	
		
		//drawws the balls and checks for bouncing.
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
	
	//the handler for the difficulty control
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
	
	//the handler for the theme control
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
					//begins the webcam, a paragraph will be created since it is not supported
					videoPhoto = myWebcam.begin();
					takePhoto = cameraHolder.replaceChild(videoPhoto, takePhoto);
					cameraHolder.setAttribute('style', 'display: block; visibility: visible;');
				}
				break;
				
			case "italy":
				if(myWebcam.running || !myWebcam.support){
					myWebcam.stop();
					cameraHolder.setAttribute('style', '');
					initForm.setAttribute('style', '');
				}
				
				//cretes the url for each image and pushes it to the theme respective array.
				for(var a=0; a<italyCount; a++){
					italyPictures.push("assets/italy/italy"+a+".jpeg");
				}
				
				//randomizes the array so always a different image will start.
				italyPictures = randomizeImageArray(italyPictures);
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
					newyorkPictures.push("assets/newyork/newyork"+i+".jpeg");
				}
				
				newyorkPictures = randomizeImageArray(newyorkPictures);
				puzzleTheme.selected = true;
				puzzleTheme.value = target.value;
				break;
				
			case "landscapes":
				
				if(myWebcam.running  || !myWebcam.support){
					myWebcam.stop();
					cameraHolder.setAttribute('style', '');
					initForm.setAttribute('style', '');
				}
				
				for(var j=0; j<landscapesCount; j++){
				landscapesPictures.push("assets/landscapes/landscape"+j+".jpeg");
				}
				
				landscapesPictures = randomizeImageArray(landscapesPictures);
				puzzleTheme.selected = true;
				puzzleTheme.value = target.value;
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
	
	//will handle when the first level puzzle will load
	function gameReady(){
			imageElement.removeEventListener('load', gameReady, false);
		//starts the actual game when the first level puzzle image has loaded. 
			beginGame();
	}	
	
	
	//the begin game button handler
	function onBeginGame(e){
		
		//onces a theme and difficulty setting has been selected, it will run this.
		if(puzzleDiff.selected && puzzleTheme.selected){
			//removes everything from the start game screen.
			//particle = numParticles = startX = startY = textAlpha = alphaSpeed = undefined;
			
			//removes the event listeners for each theme and difficulty controls.
			difficultyControl.removeEventListener('click', onDifficultyChange, false);
			puzzleThemeControl.removeEventListener('click', onThemeChange, false);
			beginButton.removeEventListener('click', onBeginGame, false);
			startButtons.setAttribute('style', 'display: none; visibility: hidden;');
			initForm.setAttribute('style', 'display: none; visibility: hidden;');
			gameOver = true;
			gameLoop();
			
			//if the camera was running, it will stop it and hide the video and take photo button
			if(myWebcam.running && myWebcam.support){
				myWebcam.stop();
				cameraHolder.removeChild(videoPhoto);
				cameraHolder.removeChild(takePhoto);
			}
			
			//hides the starting screen menu
			$('#puzzleMenu').setAttribute('style', 'display:block; visibility: visible;');
			
			//sets the image element to the first image in the theme that was selected. 
			imageElement = setLevelImage(imageElement, puzzleTheme, 0);
			
			//begin game when first level image has loaded.
			imageElement.addEventListener('load', gameReady, false);
			
		}
	}
	
	
	//handles the take photo button
	function onTakePhoto(e){
		e.target.value = "GOT IT!";
		var photoCanvas = document.createElement('canvas');
		var photoContext = photoCanvas.getContext('2d');
		photoCanvas.width = 650;
		photoCanvas.height = 450;
		photoContext.drawImage(videoPhoto, 0, 0);
		userPhoto.src = photoCanvas.toDataURL('image/jpeg');
		
		//sets the button back to take photo after 300 mil seconds.
		window.setTimeout(function(){e.target.value = "Take Photo";}, 300);
	}
	
	//checks for balls hitting the canvas walls.
	function checkBoundary(object){
			if(object.x >= theCanvas.width - object.radius){
				object.x = theCanvas.width - object.radius;
				object.velX = -object.velX;
				
			}else if(object.x <= object.radius){
				object.x = object.radius;
				object.velX = -object.velX;

			}else if(object.y <= object.radius){
				object.y = object.radius;
				object.velY = -object.velY;
 
			}else if(object.y >= theCanvas.height - object.radius){
				object.y = theCanvas.height - object.radius;
				object.velY = -object.velY;
			}
		}		
}

	
//function that begins the actual game
function beginGame() {
	
	//Puzzle Settings
	var rows;
	var cols;
	var xPad;
	var yPad;
	
	//piece width and height
	var startXOffset = 20;
	var startYOffset = 40;
	var partWidth;
	var partHeight;
	var numHints = 5;
	var currentLevel = 0;
	var canvasMessage = "Good Job!";
	
	//sets the puzzle difficulty.
	setDifficulty(puzzleDiff.value);
	
	//Initialize Board
	var board = [];
	
	//resets the board to normal.
	board = resetBoard(board);
	
	//booleans that represent important state of the game. 
	var puzzleSorted = false;
	var userGaveUp = false;
	var giveUserHint = false;
	var userBeatGame = false;
	var puzzleSolved = false; 
	var soundEnded = false;
	var imageLoaded = false;
	
	
	//adds the event listener for clicks of the user selecting pieces.
	theCanvas.addEventListener("mouseup",eventMouseUp, false);	
	
	//adds event listeners for the puzzle game buttons 
	var sortButton = document.getElementById("sortButton");
	sortButton.addEventListener("click", onSort, false);
	sortButton.removeAttribute('disabled');
	var giveUp = document.getElementById("giveupButton");
	giveUp.addEventListener('click', onGiveUp, false);
	giveUp.removeAttribute('disabled');
	var mainMenu = $('#mainMenu');
	mainMenu.addEventListener('click', function(){window.location.reload();}, false);
	var hintButton = $('#hintButton');
	hintButton.addEventListener('click', onHintClick, false);
	
	//creates the timer that will time the user on each level. 
	var puzzleTimer = new Timer();
	
	//changes the call rate for every second to improve performance to be only on par with the timer
	FRAME_RATE = 1000;
	//changes the gameLoop call function to the actual game draw Screen.
	drawFunction = drawScreen; 
	gameOver = false; 
	gameLoop();

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
	
		//draws each piece of the puzzle.
		for (var c = 0; c < cols; c++) {
			for (var r = 0; r < rows; r++) {
				var tempPiece  = board[c][r];
				var imageX = tempPiece.finalCol*partWidth ;
				var imageY = tempPiece.finalRow*partHeight ;
				var placeX = c*partWidth+c*xPad+startXOffset;
				var placeY = r*partHeight+r*yPad+startYOffset;
				
				context.drawImage(imageElement, imageX,  imageY, partWidth, partHeight, placeX, placeY, partWidth, partHeight);
				
				//if a piece has been selected, draw a yellow stroke.
				if (tempPiece.selected) {
					context.strokeStyle = '#FFFF00'; 
					context.lineWidth = 5;
					context.strokeRect( placeX,  placeY, partWidth, partHeight);
					
				}
			}
		}
	
		//if the user click to get a hint, show the actual picture.
		if(giveUserHint){
			context.drawImage(imageElement, startXOffset, startYOffset, minWidth+10, minHeight+10);
		}
		
		
		//once the puzzle has been sorted, check to see if it has been solved.
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
		//updates the varaible to reflect whether the puzzle is solved or not.
		puzzleSolved = (resultBoard.indexOf(false) == -1)? true: false;	    
	  	}
	
		//sets font-text properties for the pass or fail message
			context.fillStyle = "#ff0000";
		  	context.font = "bold 50px helvetica";
		  	context.textAlign = "center";
	
		//if the puzzle has been solved and the user has not given up, stop the timer and set the next level.
		if(puzzleSolved && puzzleSorted && userGaveUp === false){
			puzzleTimer.stop();
			gameOver = true;
			gameLoop();
			//removes the click event listener so that the user cant click on the puzzle once it is solved.
			theCanvas.removeEventListener('mouseup', eventMouseUp, false);
			context.fillText(canvasMessage, theCanvas.width/2, theCanvas.height/2);
			setNextLevel();  
		  }
			  
	
		//if the puzzle is solved but the user gave up, display a game over.
		if(puzzleSolved && userGaveUp){
		  	context.fillText("Game Over!", theCanvas.width/2, theCanvas.height/2);
			puzzleTimer.stop();
			//stop the timer and stop the gameLoop.
			gameOver = true;
		  }
	
	//END OF DRAWSCREEN FUNCT
	}
	
	//randomizes board 
function randomizeBoard(board) {
		var newBoard = [];
		var cols = board.length;
		var rows = board[0].length;
		for (var i = 0; i < cols; i++) {
			newBoard[i] = [];
			for (var j =0; j < rows; j++) {
				var found = false;
				var rndCol = 0;
				var rndRow = 0;
				while (!found) {
					rndCol = Math.floor(Math.random() * cols);
					rndRow = Math.floor(Math.random() * rows);

					if (board[rndCol][rndRow] !== false) {
						found = true;
					}
				}
				
				newBoard[i][j] = board[rndCol][rndRow];
				board[rndCol][rndRow] = false;
			}
			
		}
		return newBoard;
	
	}
	
	
	//handles taps or clicks on the canvas
function eventMouseUp(event) {
		
		var mouseX;
		var mouseY;
		var pieceX;
		var pieceY;
		if ( event.layerX ||  event.layerX === 0) { // Firefox
   			mouseX = event.layerX ;
    		mouseY = event.layerY;
  		} else if (event.offsetX || event.offsetX === 0) { // Opera
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
			   		selectedList.push({col:c,row:r});
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
		
		//update the canvas and play the select sound.
		drawScreen();
		selectSound.play();
	}
	
function onHintClick(e){
	//creates a toggle like effect
	giveUserHint = !giveUserHint;
	if(puzzleSorted && giveUserHint && numHints !== 0){
		numHints--;
		numHints = (numHints<0)? 0: numHints;
		e.target.innerHTML = "Hint ON";
		drawScreen();
	}else if(numHints <= 0){
		e.target.innerHTML = "Hint OFF";
		e.target.disabled = true;
		drawScreen();
	}else{
		e.target.innerHTML = "Hint OFF";
		drawScreen();
	}
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
				rows = 7;
				cols = 7;
				xPad = 2;
				yPad = 2;
				partWidth = minWidth/cols;
				partHeight = minHeight/rows;
				break;	
		}
	}
	
	
	//handler when the passed Game sound is done playing.
	function onSoundEnd(){
		passedGameSound.removeEventListener('ended', onSoundEnd, false);
		//set to true when sound is done playing
		soundEnded = true;
		//calls the check assets so that it runs the rest of teh code of the next level image function
		checkAssets();
	}
	
	//handles that the image is done loading
	function onImageLoad(){
		imageElement.removeEventListener('load', onImageLoad, false);
		//sets tot true when the next image puzzle level has finished loading.
		imageLoaded = true;
		checkAssets();
	}
	
	function checkAssets(){
		//if the next level puzzle image has loaded and the passed level sound is done playing.
		if(soundEnded && imageLoaded){
		canvasMessage = "Good Job!";
		numHints = 5;
		userGaveUp = false;
		puzzleSorted = false;
		puzzleSolved = false;
		sortButton.innerHTML = "Start";
		sortButton.disabled = false;
		puzzleTimer.displayTime = "Time: 0:0";
		board = resetBoard(board);
		hintButton.disabled = false;
		gameOver = false;
		gameLoop();	
		//adds the mouseup event listener for the canvas again.
		theCanvas.addEventListener('mouseup', eventMouseUp, false);
			}
		}
		
function setNextLevel(){
	
	//sets the next puzzle image level and played varaible to false.
	soundEnded = false;
	imageLoaded = false;
	
	//increates the level count by one. 
	currentLevel++;
	if(currentLevel >= italyCount || currentLevel >= newyorkCount || currentLevel >= landscapesCount){
			userBeatGame = true;
			//Background
			context.fillStyle = '#000';
			context.fillRect(0, 0, theCanvas.width, theCanvas.height);
			//Box
			context.strokeStyle = 'rgba(0,0,150,0.5)';
			context.lineWidth = 10;
			context.strokeRect(0, 0, theCanvas.width, theCanvas.height);
		
			context.fillStyle = "#FF0000";
			canvasMessage = "You Beat The Game!";
			context.fillText(canvasMessage, theCanvas.width/2, (theCanvas.height/2 +30));
			passedGameSound.play(); 
			passedGameSound.addEventListener('ended', function(){
				window.location.reload(); 
			}, false);
			currentLevel -=1;
		}else{
			
	//sets the image to the next image
	imageElement = setLevelImage(imageElement, puzzleTheme, currentLevel);
	imageElement.addEventListener('load', onImageLoad, false);
	passedGameSound.play();
	passedGameSound.addEventListener('ended', onSoundEnd, false);

	}
	
}	
	
	//handles the sort button
function onSort(e){
	puzzleTimer.start();
	var target = e.target;
	target.innerHTML = "Sorted";
	target.disabled = true;
	board = randomizeBoard(board);
	puzzleSorted = true;
	drawScreen();
	
	}
	//handles the give up button
function onGiveUp(e){
	if(puzzleSorted){
	board = resetBoard(board);
	sortButton.disabled = false;
	sortButton.innerHTML = "Start";
	userGaveUp = true;	
	gameOverSound.play();	
	drawScreen();
	gameOverSound.addEventListener('ended', function(){window.location.reload();}, false);
	}

}
	//sets the board to solved
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

	
//Class & Outter Functions
function prepareImage(image){
	if(Number(image.width) < minWidth || Number(image.height) < minHeight ){
		var defaultImage = new Image();
		defaultImage.src = "assets/defaultImage/defaultImage.jpeg";
		defaultImage.onload = function (){
			image.src = defaultImage.src;
			image.centerOffsetX = 0;
			image.centerOffsetY = 0;
		};
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
			if(navigator.mediaDevices.getUserMedia !== undefined){
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
	};
}
function $(selector){
	return document.querySelector(selector);
}

function randomizeImageArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
	
function setLevelImage(puzzleImage, puzzleTheme, level){
	
	switch(puzzleTheme.value){
		case 'userphoto':
		puzzleImage.src = userPhoto.src;
			break;
		case 'italy':
		puzzleImage.src = italyPictures[level];	
			break;
		case 'newyork':
		puzzleImage.src = newyorkPictures[level];	
			break;
		case 'landscapes':
		puzzleImage.src = landscapesPictures[level];
			break;
	}
	return puzzleImage;	
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
		};
		this.stop = function(){
			self.running = false;
		};
	}	
	
	
//end of window onloadevent function	
}
