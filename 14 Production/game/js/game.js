/*!
 * GAME SETTING CUSTOMIZATION START
 */
 
//Game Text
var playBackgroundMusic = true; //toggle background music

var menuMaxList = 5; //maximum list for menu page
var menuTextColour = "#bcb8b8"; //music name colour
var menuTextSelectedColour = '#fff'; //music name selected colour

var scoreNum = 10; //total score for each note
var errorText = 'OFF THE BEAT!'; //touch or keypress error text
var noteSpeed = .3; //drop down note speed
var touchedNoteSpeed = .1; //touched or keypressed notes animation

var keyboard_arr = [68,70,71,72]; //keyboard array list, also define maximum multiple touch
var touchStartRange = 20; //center bar start hit position y
var touchEndRange = 50; //center bar end hit position y
var musicBarColour = '#fff'; //music bar colour
var musicBarHeight = 5; //music bar height

var resultTitleText = 'GAME FINISHED!'; //text for result page title
var resultScoreText = 'Your best score is [NUMBER]'; //text for result page score, [NUMBER] will replace with score

//Social share, [SCORE] will replace with game score
var shareOption = true; //toggle share option
var shareText ='SHARE NOW...'; //text for share instruction
var shareTitle = 'High score on SoundGroove Rush is [SCORE]';//social share score title
var shareMessage = '[SCORE] is my new high score on SoundGroove Rush! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
var editMusic = false;
var curMusic = 0;
var user_data = {position:0, duration:0, endLine:0, noteSpeed:noteSpeed, touchCheck:false, touchID:[], touchNote:[], oldScore:0, score:0};
var menuMaxPage = 0;
var menuCurPage = 1;
var percentWidth = 200;

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	if($.browser.mobile || isTablet){
		setupMultitouch();
	}else{
		this.document.onkeydown = keydown;
		this.document.onkeyup = keyup;
	}
	
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundChord');
		goPage('menu');
	});
	
	for(n=0;n<menuMaxList;n++){
		$.menu[n+'_select'].id = n;
		$.menu[n+'_select'].cursor = "pointer";
		$.menu[n+'_select'].addEventListener("click", function(evt) {
			selectMenuMusic(evt.target.id);
		});
		
		$.menu[n+'_play'].id = n;
		$.menu[n+'_play'].cursor = "pointer";
		$.menu[n+'_play'].addEventListener("click", function(evt) {
			toggleMenuMusic(evt.target.id, true);
		});
		
		$.menu[n+'_pause'].id = n;
		$.menu[n+'_pause'].cursor = "pointer";
		$.menu[n+'_pause'].addEventListener("click", function(evt) {
			toggleMenuMusic(evt.target.id, false);
		});
	}
	
	buttonMenuPrev.cursor = "pointer";
	buttonMenuPrev.addEventListener("click", function(evt) {
		toggleMenuPage(false);
	});
	
	buttonMenuNext.cursor = "pointer";
	buttonMenuNext.addEventListener("click", function(evt) {
		toggleMenuPage(true);
	});
	
	buttonMenuPlay.cursor = "pointer";
	buttonMenuPlay.addEventListener("click", function(evt) {
		stopSound();
		goPage('game');
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		toggleInstruction(false);
	});
	
	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("click", function(evt) {
		playSound('soundChord');
		goPage('menu');
	});
	
	iconFacebook.cursor = "pointer";
	iconFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	iconTwitter.cursor = "pointer";
	iconTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	iconGoogle.cursor = "pointer";
	iconGoogle.addEventListener("click", function(evt) {
		share('google');
	});
}

function keydown(event) {
	var curKeyboardIndex = keyboard_arr.indexOf(event.keyCode);
	if(curKeyboardIndex != -1 && user_data.touchID.indexOf(event.keyCode) == -1){
		user_data.touchID.push(event.keyCode);
		user_data.touchCheck = true;
		$.touch[curKeyboardIndex].gotoAndPlay('touch');
	}
}

function keyup(event) {
    if(user_data.touchID.indexOf(event.keyCode) != -1){
		user_data.touchID.splice(user_data.touchID.indexOf(event.keyCode), 1);
	}
}

function setupMultitouch(){
	stage.addEventListener("mousedown", handlerMultitouchMethod);
	stage.addEventListener("pressmove", handlerMultitouchMethod);
	stage.addEventListener("pressup", handlerMultitouchMethod);
}

function removeMultitouch(){
	stage.removeEventListener("mousedown", handlerMultitouchMethod);
	stage.removeEventListener("pressmove", handlerMultitouchMethod);
	stage.removeEventListener("pressup", handlerMultitouchMethod);
}

function handlerMultitouchMethod(evt) {
	 switch (evt.type){
		 case 'mousedown':
		 	updateTouchID(evt, 'add');
		 break;
		 
		 case 'pressup':
		 	updateTouchID(evt, 'remove');
		 break;
	 }
}

function updateTouchID(evt, con){
	if(con == 'add'){
		if(user_data.touchID.indexOf(evt.pointerID) == -1){
			user_data.touchID.push(evt.pointerID);
			
			var curTouchIndex = user_data.touchID.indexOf(evt.pointerID);
			$.touch[curTouchIndex].x = evt.stageX / scalePercent;
			$.touch[curTouchIndex].y = evt.stageY / scalePercent;
			$.touch[curTouchIndex].gotoAndPlay('touch');
			user_data.touchCheck = true;
		}
	}else if(con == 'remove'){
		if(user_data.touchID.indexOf(evt.pointerID) != -1){
			user_data.touchID.splice(user_data.touchID.indexOf(evt.pointerID),1);
		}
	}
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
function goPage(page){
	mainContainer.visible=false;
	menuContainer.visible=false;
	gameContainer.visible=false;
	instructionContainer.visible = false;
	resultContainer.visible=false;
	
	stopAnimateButton(buttonStart);
	stopAnimateButton(buttonReplay);
	
	var targetContainer = '';
	
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			if(playBackgroundMusic){
				playSoundLoopMain('musicMain');
			}
			
			startAnimateButton(buttonStart);
		break;
		
		case 'menu':
			targetContainer = menuContainer;
			if(playBackgroundMusic){
				stopSoundLoop('musicMain');
			}
			
			for(n=0;n<menuMaxList;n++){
				if($.menu[n+'_pause'].visible){
					$.menu[n+'_play'].visible = true;
					$.menu[n+'_pause'].visible = false;
				}
			}
		break;
		
		case 'game':
			targetContainer = gameContainer;
				
			if(editMusic){
				loadEditPage();
			}else{
				startGame();
			}
		break;
		
		case 'result':
			targetContainer = resultContainer;
			
			playSound('soundChordEnd');
			startAnimateButton(buttonReplay);
			stopGame();
			resultScoreTxt.text = resultScoreText.replace('[NUMBER]', user_data.score);
		break;
	}
	
	targetContainer.alpha=0;
	targetContainer.visible=true;
	$(targetContainer)
	.clearQueue()
	.stop(true,true)
	.animate({ alpha:1 }, 500);
}

/*!
 * 
 * START ANIMATE BUTTON - This is the function that runs to play blinking animation
 * 
 */
function startAnimateButton(obj){
	obj.scaleX=obj.scaleY=1;
	$(obj)
	.animate({ scaleX:1.2, scaleY:1.2}, 200)
	.animate({ scaleX:1, scaleY:1}, 100, function(){
		startAnimateButton(obj);	
	});
}

/*!
 * 
 * STOP ANIMATE BUTTON - This is the function that runs to stop blinking animation
 * 
 */
function stopAnimateButton(obj){
	obj.scaleX=obj.scaleY=1;
	$(obj)
	.clearQueue()
	.stop(true,true);
}

/*!
 * 
 * MUSIC LIST - This is the function that runs to build music list
 * 
 */
function buildMusicListPage(){
	menuMaxPage=music_arr.length/menuMaxList;
	if (String(menuMaxPage).indexOf('.') > -1){
		menuMaxPage=Math.floor(menuMaxPage)+1;
	}
	toggleMenuPage(false);
}

function toggleMenuPage(con){
	if(con){
		menuCurPage++;
		menuCurPage = menuCurPage > menuMaxPage ? menuMaxPage : menuCurPage;
	}else{
		menuCurPage--;
		menuCurPage = menuCurPage < 1 ? 1 : menuCurPage;	
	}
	
	if(menuCurPage == 1){
		buttonMenuPrev.visible = false;
	}else{
		buttonMenuPrev.visible = true;	
	}
	
	if(menuCurPage >= 1 && menuMaxPage > 1){
		buttonMenuNext.visible = true;
	}else{
		buttonMenuNext.visible = false;	
	}
	
	if(menuCurPage == menuMaxPage){
		buttonMenuNext.visible = false;
	}
	
	var startMusicNum = (menuCurPage-1) * menuMaxList;
	var endMusicNum = startMusicNum + menuMaxList;
	var countNum = 0;
	for(n=startMusicNum;n<endMusicNum;n++){
		$.menu[countNum+'_text'].text = '';
		$.menu[countNum+'_select'].visible = false;
		$.menu[countNum+'_selected'].visible = false;
		$.menu[countNum+'_play'].visible = false;
		$.menu[countNum+'_pause'].visible = false;
		if(n < music_arr.length){
			$.menu[countNum+'_text'].text = (n+1)+'. '+music_arr[countNum].name;
			$.menu[countNum+'_select'].visible = true;
			$.menu[countNum+'_play'].visible = true;
		}
		countNum++;
	}
	
	selectMenuMusic(0);
}

function selectMenuMusic(num){
	curMusic = (menuCurPage-1) + num;
	for(n=0;n<menuMaxList;n++){
		$.menu[n+'_selected'].visible = false;
		$.menu[n+'_text'].color = menuTextColour;
		
		if(n == num){
			$.menu[n+'_selected'].visible = true;
			$.menu[n+'_text'].color = menuTextSelectedColour;
		}
	}
}

function toggleMenuMusic(num, con){
	stopSound();
	for(n=0;n<menuMaxList;n++){
		if($.menu[n+'_pause'].visible){
			$.menu[n+'_play'].visible = true;
			$.menu[n+'_pause'].visible = false;
		}
	}
	
	if(con){
		$.menu[num+'_play'].visible = false;
		$.menu[num+'_pause'].visible = true;
		playSound(music_arr[(menuCurPage-1) + num].id, true);
	}else{
		$.menu[num+'_play'].visible = true;
		$.menu[num+'_pause'].visible = false;	
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
function startGame(){
	resetError();
	musicBar.graphics.clear();
	musicBar.graphics.beginFill(musicBarColour).drawRect(0, 0, 0, musicBarHeight);
	
	user_data.touchCheck = false;
	user_data.oldScore = 0;
	user_data.score = 0;
	updateScore(0);
	loadMusic();
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	notesContainer.removeAllChildren();
	$.notes = {};
}


/*!
 * 
 * LOAD MUSIC - This is the function that runs to load music
 * 
 */
function loadMusic(){
	stopGame();
	
	user_data.touchID = [];
	user_data.touchNote = [];
	user_data.endLine = musicLine.y;
	
	if($.browser.mobile || isTablet || editMusic){
		playSoundLoop(music_arr[curMusic].id);
		user_data.duration = getSoundDuration(music_arr[curMusic].id);
	}else{
		toggleInstruction(true);
	}
}

function toggleInstruction(con){
	instructionContainer.visible = con;
	stopAnimateButton(buttonContinue);
	
	if(!con){
		playSoundLoop(music_arr[curMusic].id);
		user_data.duration = getSoundDuration(music_arr[curMusic].id);
	}else{
		startAnimateButton(buttonContinue);
	}
}

/*!
 * 
 * MUSIC NOTES - This is the function that runs to drop down music notes
 * 
 */
function updateNotes(){
	user_data.position = checkCuePoint(music_arr[curMusic].id);
	
	for(z=0;z<music_arr[curMusic].notes.length;z++){
		var notePosition = (user_data.position*user_data.noteSpeed) - ((music_arr[curMusic].notes[z].position*user_data.noteSpeed) - user_data.endLine);
		var noteTotal = music_arr[curMusic].notes[z].notes.length;
		for(n=0;n<noteTotal;n++){
			if(notePosition > -100 && notePosition < canvasH && user_data.touchNote.indexOf(z) == -1){
				if($.notes[z+'_'+n] == null){
					$.notes[z+'_'+n] = new createjs.Bitmap(loader.getResult(getNoteImage(noteTotal)));
					centerReg($.notes[z+'_'+n]);
					$.notes[z+'_'+n].y = -100;
					notesContainer.addChild($.notes[z+'_'+n]);
				}else{
					$.notes[z+'_'+n].x = Number(music_arr[curMusic].notes[z].notes[n])/percentWidth * canvasW;
					$.notes[z+'_'+n].y = notePosition;
					
					if(!editMusic){
						if($.notes[z+'_'+n].y > (user_data.endLine - touchStartRange) && $.notes[z+'_'+n].y < (user_data.endLine + touchEndRange) && user_data.touchCheck){
							if(user_data.touchID.length > 0){
								if(noteTotal == user_data.touchID.length){
									user_data.touchNote.push(z);
									user_data.touchID = [];
									user_data.touchChec = false;
									
									//console.log(user_data.touchNote.length+' '+music_arr[curMusic].notes.length);
									updateScore(scoreNum);
									updateError(false);
									animateTouchedNotes(z, noteTotal);
								}else{
									updateError(true);	
								}
							}
						}
					}
				}
			}else{
				if($.notes[z+'_'+n] != null){
					notesContainer.removeChild($.notes[z+'_'+n]);
					$.notes[z+'_'+n] = null;
				}
			}
		}
	}
	
	musicBar.graphics.clear();
	musicBar.graphics.beginFill(musicBarColour).drawRect(0, 0, (user_data.position/user_data.duration) * canvasW, musicBarHeight);
}

function getNoteImage(amount){
	for(p=0;p<notes_arr.length;p++){
		if(notes_arr[p].amount == amount){
			return 	notes_arr[p].id;
		}
	}
}

/*!
 * 
 * TOUCHED NOTES ANIMATION - This is the function that runs to animate touched notes
 * 
 */
function animateTouchedNotes(target, noteTotal){
	for(n=0;n<noteTotal;n++){
		$.animate[target+'_'+n] = $.notes[target+'_'+n].clone();
		$.animate[target+'_'+n].filters = [
			new createjs.ColorFilter(255,255,255,1, 0,0,0,0)
		];
		$.animate[target+'_'+n].cache(0, 0, $.notes[target+'_'+n].image.naturalWidth, $.notes[target+'_'+n].image.naturalHeight);
		$.animate[target+'_'+n].x = $.notes[target+'_'+n].x;
		$.animate[target+'_'+n].y = $.notes[target+'_'+n].y;
		notesContainer.addChild($.animate[target+'_'+n]);
		
		TweenMax.to($.animate[target+'_'+n], touchedNoteSpeed, {scaleX:1.5, scaleY:1.5, overwrite:true, onComplete:removeAnimate, onCompleteParams:[target, n]});
	}
}

function removeAnimate(target, n){
	notesContainer.removeChild($.animate[target+'_'+n]);
	$.animate[target+'_'+n] = null;
}

/*!
 * 
 * MUSIC FINISH - This is the function that runs when music end
 * 
 */
function musicEnd(){
	stopSoundLoop(music_arr[curMusic].id);
	goPage('result');	
}

/*!
 * 
 * SCORE - This is the function that runs to update score
 * 
 */
function updateScore(num){
	user_data.oldScore += num;
	
	$(user_data)
	.clearQueue()
	.stop()
    .animate({ score:user_data.oldScore},
		{duration: 100,
			step: function(){
				  if(scoreTxt.text != user_data.score){
					  scoreTxt.text = Math.round(user_data.score);
				  }
		},complete: function() {
			//complete
		}
	});
}


/*!
 * 
 * ERROR TEXT - This is the function that runs to display error text
 * 
 */
var guideInterval = null;
function updateError(con){
	if(guideInterval == null){
		if(con){
			guideInterval = setInterval(resetError, 800);
			guideTxt.text = errorText;	
		}else{
			guideTxt.text = '';
		}
	}
}

function resetError(){
	clearInterval(guideInterval);
	guideInterval = null;
	guideTxt.text = '';
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	var title = '';
	var text = '';
	title = shareTitle.replace("[SCORE]", user_data.score);
	text = shareMessage.replace("[SCORE]", user_data.score);
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}
	
	window.open(shareurl);
}