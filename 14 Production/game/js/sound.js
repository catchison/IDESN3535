
var enableMobileSound = true;
var soundOn;

function playSound(target, loop){
	if(soundOn){
		var isLoop;
		if(loop){
			isLoop = -1;
			createjs.Sound.stop();
			musicLoop = createjs.Sound.play(target, createjs.Sound.INTERRUPT_NONE, 0, 0, isLoop, 1);
			if (musicLoop == null || musicLoop.playState == createjs.Sound.PLAY_FAILED) {
				return;
			}else{
				musicLoop.removeAllEventListeners();
				musicLoop.addEventListener ("complete", function(musicLoop) {
					
				});
			}
		}else{
			isLoop = 0;
			createjs.Sound.play(target);
		}
	}
}

function stopSound(){
	createjs.Sound.stop();
}

/*!
 * 
 * PLAY MUSIC - This is the function that runs to play and stop music
 * 
 */
$.sound = {};
function playSoundLoop(sound){
	if(soundOn){
		if($.sound[sound]==null){
			$.sound[sound] = createjs.Sound.play(sound);
			$.sound[sound].removeAllEventListeners();
			
			$.sound[sound].addEventListener ("complete", function() {
				if(editMusic){
					$.sound[sound].play();
				}else{
					musicEnd();	
				}
			});
		}
	}
}

function playSoundLoopMain(sound){
	if(soundOn){
		if($.sound[sound]==null){
			$.sound[sound] = createjs.Sound.play(sound);
			$.sound[sound].removeAllEventListeners();
			
			$.sound[sound].addEventListener ("complete", function() {
				$.sound[sound].play();
			});
		}
	}
}

function stopSoundLoop(sound){
	if(soundOn){
		if($.sound[sound]!=null){
			$.sound[sound].stop();
			$.sound[sound]=null;
		}
	}
}

/*!
 * 
 * TOGGLE MUTE - This is the function that runs to toggle mute
 * 
 */
function toggleMute(con){
	createjs.Sound.setMute(con);	
}

/*!
 * 
 * SOUND RETURN CUE POINT - This is the function that runs to check cue points
 * 
 */
function checkCuePoint(sound){
	if($.sound[sound]!=null){
		var curPosition = Math.floor($.sound[sound].getPosition());
		return curPosition;
	}
}

/*!
 * 
 * SOUND DURATION - This is the function that runs to check sound duration
 * 
 */
function getSoundDuration(sound){
	if($.sound[sound]!=null){
		return Math.floor($.sound[sound].getDuration());
	}
}

/*!
 * 
 * SOUND POSITION - This is the function that runs to set sound position
 * 
 */
function setSoundPosition(sound, position){
	$.sound[sound].setPosition(position);
}


/*!
 * 
 * SOUND CONTROL - This is the function that runs to control sound
 * 
 */
function controlSound(sound, con){
	if(con == 'play'){
		$.sound[sound].play();
	}else if(con == 'pause'){
		$.sound[sound].paused = true;
	}else if(con == 'stop'){
		$.sound[sound].stop();	
	}
}