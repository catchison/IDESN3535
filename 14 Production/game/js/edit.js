////////////////////////////////////////////////////////////
// NOTES EDIT


var heightScale = .2;
var edtNotesCount = 0;
var curNote = -1;

$(function() {
	 editMusic = true;
});

function loadEditPage(){
	$.get('editTools.html', function(data){
		$('body').prepend(data);
		buildEditButtons();
	});		
}

function buildEditButtons(){
	for(n=0;n<notes_arr.length;n++){
		$('.dotsWrapper').append('Dot '+(n+1)+': <input id="dot'+(n+1)+'" name="dot'+(n+1)+'" class="half" value="" /><br/>');
		$("#dot"+(n+1)).change(function() {
			updateNoteValue(true);
		});
		
		$("#dot"+(n+1)).keyup(function() {
			updateNoteValue(true);
		});
	}
	
	$("#notePosition").change(function() {
		updateNoteValue(true);
	});
	
	$("#notePosition").keyup(function() {
		updateNoteValue(true);
	});
			
	//build songs list dropdown
	$('#musiclist').empty();
	$('#musiclist').append($("<option/>", {
		value: '',
		text: 'Select musics'
	}));
	for(n=0;n<music_arr.length;n++){
		$('#musiclist').append($("<option/>", {
			value: n,
			text: music_arr[n].name
		}));
	}
	buildMusicData();
	
	//build notes list dropdown
	$('#typeofnotes').empty();
	$('#typeofnotes').append($("<option/>", {
		value: '',
		text: 'Select types of note'
	}));
	for(n=0;n<notes_arr.length;n++){
		$('#typeofnotes').append($("<option/>", {
			value: notes_arr[n].id,
			text: notes_arr[n].id
		}));
	}
	
	$('#editWrapper').show();
	
	$('#add').click(function(){
		if($("#typeofnotes").val()==''){
			alert('Please select one types of note');	
		}else{
			addNotes($("#typeofnotes").val(), false);
			generateArray(false);
			
			curNote = $('.added').attr('data-array');
			$('.added').removeClass('.added');
			highLightNote(false);
		}
	});
	
	$("#musiclist").change(function() {
		if($(this).val() != ''){
			stopSoundLoop(music_arr[curMusic].id);
			curMusic = $(this).val();
			buildMusicData();
		}
	});
	
	$("#listofnotes").change(function() {
		if($(this).val() != ''){
			curNote = $(this).val();
			highLightNote(true);
		}
	});
	
	$( "#play" ).click(function(){
		controlSound(music_arr[curMusic].id,'play');
		musicPlaying = true;
	});
	$( "#pause" ).click(function(){
		controlSound(music_arr[curMusic].id,'pause');
		musicPlaying = false;
	});
	$( "#stop" ).click(function(){
		controlSound(music_arr[curMusic].id,'stop');
		musicPlaying = false;
	});
	$( "#jump" ).click(function(){
		setSoundPosition(music_arr[curMusic].id,Number($( "#musicPosition" ).val()));
	});
	
	$( "#prev" ).click(function(){
		toggleNotes(false);
	});
	$( "#next" ).click(function(){
		toggleNotes(true);
	});
	$( "#remove" ).click(function(){
		removeNote();
	});
	
	$( "#generate" ).click(function(){
		generateArray(true);
	});
	
	$('.playerBg, .playerBar, .playerPosition').click(function(e){
	   var parentOffset = $(this).parent().offset();
	   var relY = e.pageY - parentOffset.top;
	   var amount = user_data.duration * heightScale;
	   var startY = 0;
	   var position = ((relY-startY)+$('.playerWrapper').scrollTop())/amount * user_data.duration;
	   setSoundPosition(music_arr[curMusic].id, position);
	});
	
	$('.playerIndicator').draggable({ containment:'.editPlayerWrapper', scroll:false, 
	start:function(){
		indicatorDrag = true;
	}, drag:function() {
		var position = parseInt($('#floatPlayer .playerIndicator').css('top')) / heightScale;
    	setSoundPosition(music_arr[curMusic].id, position);
    }, stop:function(){
		indicatorDrag = false;
	}});
	
	$('.editPlayerWrapper').css('width', percentWidth);
}

function buildMusicData(){
	$('.playerNotes').empty();
	loadMusic();
	user_data.duration = getSoundDuration(music_arr[curMusic].id);
	
	var amount = user_data.duration * heightScale;
	$('#floatPlayer .playerBg, #floatPlayer .playerBar, #floatPlayer .playerPosition').css('height',amount);
	
	edtNotesCount = 0;
	for(z=0;z<music_arr[curMusic].notes.length;z++){
		addNotes(music_arr[curMusic].notes[z], true);
	}
	
	curNote = 0;
	generateArray(false);
	highLightNote(false);
}


/*!
 * 
 * MUSIC POSITION LOOP - This is the function that runs for music position loop
 * 
 */
var musicPlaying = true;
var curMusicPosition = 0;
var indicatorDrag = false;

function updateEditMusicPosition(){
	if(editMusic){
	    var amount = user_data.duration * heightScale;
		var curPos = Number(checkCuePoint(music_arr[curMusic].id)/user_data.duration * amount);
		curMusicPosition = curPos;
		
		$('.playerPosition').css('height', curPos);
		if(!indicatorDrag){
			$('#floatPlayer .playerIndicator').css('top', curPos);
		}
		if(musicPlaying){
			$('.editPlayerWrapper').scrollTop(curPos - ($('.editPlayerWrapper').innerHeight()/2));
		}
		$('.musicPosition').html(checkCuePoint(music_arr[curMusic].id)+' / '+user_data.duration);
	}
}

/*!
 * 
 * ADD NOTE - This is the function that runs to add note
 * 
 */
function addNotes(id, con){
	var musicPosition = 0;
	var storeNotes_arr = [];
	
	if(con){
		musicPosition = id.position;
		storeNotes_arr = id.notes;
		id = id.id;
	}
	
	var notesHTML = '';
	var noteID = 'note'+edtNotesCount;
	var percent = 0;
	var bgColour = '';
	var editAdded = '';
	
	for(n=0;n<notes_arr.length;n++){
		if(id == notes_arr[n].id){
			percent = 100/(Number(notes_arr[n].amount)+1);
			bgColour = notes_arr[n].colour;
			
			var totalNote = '';
			for(p=0;p<notes_arr[n].amount;p++){
				totalNote += '<div class="note"></div>';
			}
			
			if(!con){
				editAdded = 'added';
			}
			notesHTML = '<div id="'+noteID+'" data-array='+id+' data-type='+id+' class="notesWrapper '+editAdded+'">'+totalNote+'</div>';
		}
	}
	
	$('.playerNotes').append(notesHTML);
	$('#'+noteID+', #'+noteID+' .note').css('background', bgColour);
	$('#'+noteID+' .note').draggable({ containment: '#'+noteID, scroll: false, start:function(){ curNote=$(this).closest('div.notesWrapper').attr('data-array');highLightNote(false); }, drag:function(){updateNoteValue(false);}});
	$('#'+noteID).draggable({ containment:'.editPlayerWrapper', scroll:false, start:function(){ curNote=$(this).attr('data-array');highLightNote(false); }, drag:function(){updateNoteValue(false);}});
	
	$('#'+noteID).click(function(){
		curNote=$(this).attr('data-array');highLightNote(false);
	});
	
	$('#'+noteID+' .note').click(function(){
		curNote=$(this).closest('div.notesWrapper').attr('data-array');highLightNote(false);
	});
	
	if(con){
		$('#'+noteID).css('top', musicPosition * heightScale);
	}else{
		$('#'+noteID).css('top', curMusicPosition);	
	}
	
	var curLeft = percent;
	$('#'+noteID+' .note').each(function(index, element) {
		if(con){
			$(this).css('left',storeNotes_arr[index]);
		}else{
			$(this).css('left',curLeft+'%');
			curLeft+=percent;
		}
    });
	
	edtNotesCount++;
	stopGame();
}

/*!
 * 
 * GENERATE ARRAY - This is the function that runs to generate array
 * 
 */
function generateArray(con){
	var generate_arr = [];
	var generateNotes_arr = [];
	var id = '';
	$('.playerNotes .notesWrapper').each(function(index, element) {
		id = $(this).attr('data-type');
		generateNotes_arr = [];
		$(this).find('div.note').each(function(index, element) {
            generateNotes_arr.push(parseInt($(this).css('left')));
        });
		generateNotes_arr.sort(function(a, b){return a-b});
        generate_arr.push({id:$(this).attr('id'), noteid:id, top:parseInt($(this).css('top')), notes:generateNotes_arr});
    });
	sortOnObject(generate_arr, 'top');
	
	var final_arr = [];
	for(n=0;n<generate_arr.length;n++){
		$('#'+generate_arr[n].id).attr('data-array', n);
		final_arr.push({position:generate_arr[n].top / heightScale, id:generate_arr[n].noteid, notes:generate_arr[n].notes});
	}
	
	music_arr[curMusic].notes = final_arr;
	
	$('#listofnotes').empty();
	if(curNote > final_arr.length - 1){
		curNote = 0;
	}
	
	var outputString = '';
	for(n=0;n<final_arr.length;n++){
		$('#listofnotes').append($("<option/>", {
			value: n,
			text: (n+1)
		}));
		outputString+='{position:'+final_arr[n].position+', id:"'+final_arr[n].id+'", notes:['+final_arr[n].notes+']},';
	}
	$("#listofnotes").val(curNote);
	
	if(con)
		$("#output").val(outputString);
}

/*!
 * 
 * TOGGLE NOTE LIST - This is the function that runs to toggle next/prev note list
 * 
 */
function toggleNotes(con){
	if(con){
		curNote++;	
		curNote = curNote > music_arr[curMusic].notes.length-1 ? music_arr[curMusic].notes.length-1 : curNote;
	}else{
		curNote--;	
		curNote = curNote < 0 ? 0 : curNote;
	}
	highLightNote(true);
}

/*!
 * 
 * HIGHLIGHT SELECTED NOTE - This is the function that runs to highligh selected note
 * 
 */
function highLightNote(con){
	$('.playerNotes .notesWrapper').each(function(index, element) {
		if($(this).attr('data-array')==curNote){
			if(con){
				$('.editPlayerWrapper').scrollTop(parseInt($(this).css('top')) - ($('.editPlayerWrapper').innerHeight()/2));
			}
			$(this).addClass('selected');
			updateNoteValue(false);
		}else{
			$(this).removeClass('selected');	
		}
    });
	$("#listofnotes").val(curNote);
}

/*!
 * 
 * UPDATE NOTE VALUE - This is the function that runs to update notes value
 * 
 */
function updateNoteValue(con){
	if(con){
		$('.playerNotes .selected').find('div.note').each(function(index, element) {
			$(this).css('left', Number($('#dot'+(index+1)).val()));
		});
		
		$('.playerNotes .selected').css('top', Number($('#notePosition').val()) * heightScale);
	}else{
		//dragging
		for(n=0;n<notes_arr.length;n++){
			$("#dot"+(n+1)).val('');
		}
		
		$('.playerNotes .selected').find('div.note').each(function(index, element) {
		   $('#dot'+(index+1)).val(parseInt($(this).css('left'))); 
		});
		
		var curIndex = Number($('.playerNotes .selected').attr('data-array'));
		$("#notePosition").val(music_arr[curMusic].notes[curIndex].position);
	}
	
	generateArray(false);
	stopGame();
}

/*!
 * 
 * REMOVE NOTE - This is the function that runs to remove note
 * 
 */
function removeNote(){
	$('.playerNotes .notesWrapper').each(function(index, element) {
		if($(this).attr('data-array')==curNote){
			$(this).remove();
		}
    });
	generateArray(false);
	highLightNote(false);
	stopGame();
}