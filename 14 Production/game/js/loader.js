

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
var loaded = false;
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest = [{src:'assets/background.jpg', id:'background'},
				{src:'assets/logo.png', id:'logo'},
				{src:'assets/button_round.png', id:'buttonRound'},
				{src:'assets/button_arrow.png', id:'buttonArrow'},
				{src:'assets/button_play.png', id:'buttonPlay'},
				{src:'assets/menu.png', id:'bgMenu'},
				{src:'assets/music_select.png', id:'selectMusic'},
				{src:'assets/music_selected.png', id:'selectedMusic'},
				{src:'assets/music_play.png', id:'buttonMusicPlay'},
				{src:'assets/music_pause.png', id:'buttonMusicPause'},
				{src:'assets/touch_Spritesheet4x3.png', id:'touchAnime'},
				{src:'assets/musicLine.png', id:'musicLine'},
				{src:'assets/instruction.png', id:'instruction'},
				
				{src:'assets/icon_facebook.png', id:'btnFacebook'},
				{src:'assets/icon_twitter.png', id:'btnTwitter'},
				{src:'assets/icon_google.png', id:'btnGoogle'},
				];
	
	for(n=0;n<notes_arr.length;n++){
		manifest.push({src:notes_arr[n].src, id:notes_arr[n].id});
	}
	
	soundOn = true;		
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/music.ogg', id:'musicMain'});
		manifest.push({src:'assets/sounds/chord.ogg', id:'soundChord'});
		manifest.push({src:'assets/sounds/chord_end.ogg', id:'soundChordEnd'});
		
		for(n=0;n<music_arr.length;n++){
			manifest.push({src:music_arr[n].src, id:music_arr[n].id});
		}
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader').html(Math.round(loader.progress/1*100));
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	loaded = true;
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}