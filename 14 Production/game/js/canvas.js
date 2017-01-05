////////////////////////////////////////////////////////////
// CANVAS


var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
}

var canvasContainer, mainContainer, menuContainer, gameContainer, instructionContainer, notesContainer, resultContainer;
var background, logo, buttonStart, bgMenu, buttonMenuPrev, buttonMenuNext, buttonMenuPlay, touchAnimeData, musicLine, musicBar, scoreTxt, guideTxt, instruction, buttonContinue, resultTitleTxt, resultScoreTxt, buttonReplay, iconFacebook, iconTwitter, iconGoogle, shareTxt;

$.menu = {};
$.notes = {};
$.touch = {};
$.animate = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	menuContainer = new createjs.Container();
	notesContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	instructionContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	
	background = new createjs.Bitmap(loader.getResult('background'));
	
	logo = new createjs.Bitmap(loader.getResult('logo'));
	centerReg(logo);
	logo.x = canvasW/2;
	logo.y = canvasH/100 * 42;
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonRound'));
	centerReg(buttonStart);
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100 * 60;
	
	bgMenu = new createjs.Bitmap(loader.getResult('bgMenu'));
	
	var menuStartY = canvasH/100 * 20;
	var menuSpace = 105;
	for(n=0;n<menuMaxList;n++){
		$.menu[n+'_select'] = new createjs.Bitmap(loader.getResult('selectMusic'));
		centerReg($.menu[n+'_select']);
		createHitarea($.menu[n+'_select']);
		$.menu[n+'_select'].x = canvasW/2;
		$.menu[n+'_select'].y = menuStartY;
		
		$.menu[n+'_selected'] = new createjs.Bitmap(loader.getResult('selectedMusic'));
		centerReg($.menu[n+'_selected']);
		$.menu[n+'_selected'].x = canvasW/2;
		$.menu[n+'_selected'].y = menuStartY;
		
		$.menu[n+'_text'] = new createjs.Text();
		$.menu[n+'_text'].font = "65px buran_ussrregular";
		$.menu[n+'_text'].color = "#bcb8b8";
		$.menu[n+'_text'].text = n;
		$.menu[n+'_text'].textAlign = "left";
		$.menu[n+'_text'].textBaseline='alphabetic';
		$.menu[n+'_text'].x = canvasW/100 * 7;
		$.menu[n+'_text'].y = menuStartY+25;
		
		$.menu[n+'_play'] = new createjs.Bitmap(loader.getResult('buttonMusicPlay'));
		centerReg($.menu[n+'_play']);
		createHitarea($.menu[n+'_play']);
		$.menu[n+'_play'].x = canvasW/100 * 90;
		$.menu[n+'_play'].y = menuStartY;
		
		$.menu[n+'_pause'] = new createjs.Bitmap(loader.getResult('buttonMusicPause'));
		centerReg($.menu[n+'_pause']);
		createHitarea($.menu[n+'_pause']);
		$.menu[n+'_pause'].x = canvasW/100 * 90;
		$.menu[n+'_pause'].y = menuStartY;
		
		menuContainer.addChild($.menu[n+'_select'], $.menu[n+'_selected'], $.menu[n+'_text'], $.menu[n+'_play'], $.menu[n+'_pause']);
		menuStartY+=menuSpace;
	}
	
	buttonMenuPrev = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonMenuPrev);
	createHitarea(buttonMenuPrev);
	buttonMenuPrev.x = canvasW/100 * 12;
	buttonMenuPrev.y = canvasH/100 * 90;
	
	buttonMenuNext = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonMenuNext);
	createHitarea(buttonMenuNext);
	buttonMenuNext.scaleX = -1;
	buttonMenuNext.x = canvasW/100 * 88;
	buttonMenuNext.y = canvasH/100 * 90;
	
	buttonMenuPlay = new createjs.Bitmap(loader.getResult('buttonPlay'));
	centerReg(buttonMenuPlay);
	createHitarea(buttonMenuPlay);
	buttonMenuPlay.x = canvasW/2;
	buttonMenuPlay.y = canvasH/100 * 90;
	
	var _frameW=110;
	var _frameH=110;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 10, "width": _frameW};
	var _animations = {static:{frames: [0]},
						touch:{frames: [1,2,3,4,5,6,7,8,9], speed: 1, next:'static'}};
						
	touchAnimeData = new createjs.SpriteSheet({
		"images": [loader.getResult("touchAnime").src],
		"frames": _frame,
		"animations": _animations
	});
	
	var touchSpacing = canvasW/(keyboard_arr.length + 1);
	var touchStartX = touchSpacing;
	var touchStartY = canvasH/100 * 80;
	
	for(n=0;n<keyboard_arr.length;n++){
		$.touch[n] = new createjs.Sprite(touchAnimeData, "static");
		$.touch[n].framerate = 30;
		$.touch[n].x = touchStartX;
		$.touch[n].y = touchStartY;
		touchStartX+=touchSpacing;
		
		gameContainer.addChild($.touch[n]);
	}
	
	musicLine = new createjs.Bitmap(loader.getResult('musicLine'));
	centerReg(musicLine);
	musicLine.regY = 7;
	musicLine.x = canvasW/2;
	musicLine.y = canvasH/100 * 80;
	
	musicBar = new createjs.Shape();
	musicBar.graphics.beginFill(musicBarColour).drawRect(0, 0, canvasW, musicBarHeight);
	
	scoreTxt = new createjs.Text();
	scoreTxt.font = "70px buran_ussrregular";
	scoreTxt.color = "#fff";
	scoreTxt.text = '0';
	scoreTxt.textAlign = "right";
	scoreTxt.textBaseline='alphabetic';
	scoreTxt.x = canvasW/100 * 95;
	scoreTxt.y = canvasH/100 * 10;
	
	guideTxt = new createjs.Text();
	guideTxt.font = "50px buran_ussrregular";
	guideTxt.color = "#bcb8b8";
	guideTxt.text = '0';
	guideTxt.textAlign = "right";
	guideTxt.textBaseline='alphabetic';
	guideTxt.x = canvasW/100 * 95;
	guideTxt.y = canvasH/100 * 18;
	
	instruction = new createjs.Bitmap(loader.getResult('instruction'));
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonRound'));
	centerReg(buttonContinue);
	createHitarea(buttonContinue);
	buttonContinue.x = canvasW/2;
	buttonContinue.y = canvasH/100 * 60;
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "100px buran_ussrregular";
	resultTitleTxt.color = "#707070";
	resultTitleTxt.text = resultTitleText;
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100 * 33;
	
	resultScoreTxt = new createjs.Text();
	resultScoreTxt.font = "60px buran_ussrregular";
	resultScoreTxt.color = "#fff";
	resultScoreTxt.text = resultScoreText;
	resultScoreTxt.textAlign = "center";
	resultScoreTxt.textBaseline='alphabetic';
	resultScoreTxt.x = canvasW/2;
	resultScoreTxt.y = canvasH/100 * 43;
	
	buttonReplay = new createjs.Bitmap(loader.getResult('buttonRound'));
	centerReg(buttonReplay);
	buttonReplay.x = canvasW/2;
	buttonReplay.y = canvasH/100 * 53;
	
	shareTxt = new createjs.Text();
	shareTxt.font = "50px buran_ussrregular";
	shareTxt.color = "#707070";
	shareTxt.text = shareText;
	shareTxt.textAlign = "center";
	shareTxt.textBaseline='alphabetic';
	shareTxt.x = canvasW/2;
	shareTxt.y = canvasH/100 * 70;
	
	iconFacebook = new createjs.Bitmap(loader.getResult('btnFacebook'));
	iconTwitter = new createjs.Bitmap(loader.getResult('btnTwitter'));
	iconGoogle = new createjs.Bitmap(loader.getResult('btnGoogle'));
	centerReg(iconFacebook);
	createHitarea(iconFacebook);
	centerReg(iconTwitter);
	createHitarea(iconTwitter);
	centerReg(iconGoogle);
	createHitarea(iconGoogle);
	iconFacebook.x = canvasW/100*40;
	iconTwitter.x = canvasW/2;
	iconGoogle.x = canvasW/100*60;
	iconFacebook.y = iconTwitter.y = iconGoogle.y = canvasH/100 * 80;
	
	mainContainer.addChild(logo, buttonStart);
	menuContainer.addChild(bgMenu, buttonMenuPrev, buttonMenuNext, buttonMenuPlay);
	instructionContainer.addChild(instruction, buttonContinue);
	gameContainer.addChild(musicLine, notesContainer, scoreTxt, guideTxt, musicBar, instructionContainer);
	resultContainer.addChild(resultTitleTxt, resultScoreTxt, buttonReplay);
	
	if(shareOption){
		resultContainer.addChild(shareTxt, iconFacebook, iconTwitter, iconGoogle);
	}
	canvasContainer.addChild(background, mainContainer, menuContainer, gameContainer, resultContainer);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		canvasContainer.scaleX=canvasContainer.scaleY=scalePercent;
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	if(typeof updateEditMusicPosition == 'function'){
		updateEditMusicPosition();
	}
	updateNotes();
	
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}