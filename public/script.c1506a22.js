var currentX = 0;
var currentY = 0;
var done = false;
var todayWord = getCookie("da");
var words =[];
var lastRow=false;
var winRow;
var statistic;

if(localStorage.getItem("winRow")){
	winRow=localStorage.getItem("winRow").split(",");
}else{
	winRow=[0,0,0,0,0,0,0];
}
if(localStorage.getItem("statistic")){
	statistic=localStorage.getItem("statistic").split(",");
}else{
	statistic=[0,0];
}

function moveNext(tb) {
		if (tb.value.length == 1){
		var id = tb.getAttribute("id"); //cell_0-0
		var index = id.slice(-1);
		var newIndex = parseInt(index) + 1;
		var newId = id.slice(0, -1) + newIndex;
		document.getElementById(newId).focus();
		}
}


var board = document.getElementById("board");

for(var i=0;i<7;i++){
	var row = document.getElementById("board").appendChild(document.createElement("div"));
	row.setAttribute("id", "row_" + i);
	row.classList.add("row");

	for (var j = 0; j < 7; j++) {
		var tile = row.appendChild(document.createElement("div"));
		tile.setAttribute("id", "tile_"+i+"-"+j);
		////el.setAttribute("class", "tile");
		tile.classList.add("tile");

		var spacer = tile.appendChild(document.createElement("div"));
		spacer.classList.add("tile-spacer");
		var content = tile.appendChild(document.createElement("div"));
		content.classList.add("tile-content");
	}
}


var keys=[['q','w','e','r','t','y','u','i','o','p'],
			['a','s','d','f','g','h','j','k','l'],
			['ENTER','z','x','c','v','b','n','m','XOÁ'],
			['KHOẢNG CÁCH']
		];

var keyboard = document.getElementById("keyboard");
for(var i = 0; i<4;i++){
	var row = keyboard.appendChild(document.createElement("div"));
	row.classList.add("keyboard-row");
	if(i==1){
		var keyboardSpacer = row.appendChild(document.createElement("div"));
		keyboardSpacer.classList.add("keyboard-spacer");
	}
	for(var j=0;j<keys[i].length;j++){
		var key = row.appendChild(document.createElement("button"));
		key.classList.add("key");
		var currentKeyText = keys[i][j];
		key.innerHTML = currentKeyText;

		if(currentKeyText == "ENTER"){
			key.setAttribute("onclick", "enter()");
		}else if(currentKeyText == "XOÁ"){
			key.setAttribute("onclick", "backspace()");
		}
		else{
			key.setAttribute("onclick", 'inputKey(\"' + currentKeyText + '\")');
		}
	}
	if(i==1){
		var keyboardSpacer = row.appendChild(document.createElement("div"));
		keyboardSpacer.classList.add("keyboard-spacer");
	}
}

function fillPreviousResultColor(){
	var colors = getCookie("resultColors").split(',');
	var tiles = document.getElementById("board").getElementsByClassName("tile");
	for(var i = 0;i<colors.length;i++){
		tiles[i].style.backgroundColor = colors[i];
	}
}

function fillPreviousResult(){
	//get guess cookie and prefill all the tiles
	//for loop
	var guesses = getCookie("guess").split(',');
	// guesses = "asfasdf, asdfasdf, asdfasdfasd, fasdfasdf";
	for(var i=0;i<guesses.length;i++){
		var guess = guesses[i];
		for(var j=0;j<7;j++){
			var id = "tile_"+i+"-"+j;
			var tile = document.getElementById(id);
			var content="<div class='tile-spacer'></div>"+"<div class='tile-content'>"+guess[j]+"</div>";
			tile.innerHTML = content;
		}
	}
	fillPreviousResultColor();
}

function showPreviousResult(){
	console.log("showPreviousResult()");
	var result=document.getElementById("result");
	result.style.display = "flex";
	if(getCookie("result")=="win"){
		document.getElementById("result-content").innerHTML = resultHTML("win");
	}else{
		document.getElementById("result-content").innerHTML = resultHTML("lose");
	}
	fillPreviousResult();
}

if(getCookie("done")=="true"){
	showPreviousResult();
}else{
	document.getElementById("result").style.display = "none";
}


function getCurrentTileId(){
	return getCurrentTile().getAttribute("id");
}

function getCurrentTileText(){
	return getCurrentTile().getElementsByClassName("tile-content")[0].innerHTML;
}

function getCurrentTile(){
	var id = "tile_"+currentX + "-" + currentY;
	return document.getElementById(id);
}

function setCurrentTile(x, y){
	currentX = x;
	currentY = y;
}

function getNextTile(){
	var nextY = currentY + 1;
	var id = "tile_"+currentX + "-" + nextY;
	return document.getElementById(id);
}

function getPreviousTile(){
	var nextY = currentY - 1;
	var id = "tile_"+currentX + "-" + nextY;
	return document.getElementById(id);
}

function inputKey(key){
	if(!getCookie("done")=="true" || getCookie("done")==""){
		if(key == "KHOẢNG CÁCH"){
			inputValue = " ";
		}else{
			inputValue = key;
		}
		if(getCurrentTileText()!="" && currentY!=6){
			setCurrentTile(currentX, currentY+1);
		}
		////getCurrentTile().style.border = "1px solid gray";

		getCurrentTile().style.animation = "shake 0.5s";

		//for animation to work again
		var currentElement = getCurrentTile();
		var newElement = currentElement.cloneNode(true);
		currentElement.parentNode.replaceChild(newElement, currentElement);

		//getCurrentTile().style.animationIterationCount = "infinite";
		
	  	getCurrentTile().getElementsByClassName("tile-content")[0].innerHTML = inputValue.toLowerCase();

	  	if(!getCurrentTileId().match(/tile_\d-6/)){
	  		setCurrentTile(currentX, currentY + 1);
	  	}
	  	////getCurrentTile().style.border = "1px solid white";
  	}
}

var resultColors=[];

function resultHTML(result){
	var output;
	if(result=="win"){
		output = "\
		<DIV style='color:rgb(83, 141, 78);font-size: 30px;'>&#9734; BẠN ĐÃ THẮNG &#9734;</DIV>\
		<DIV style='text-align: center;'>QUAY LẠI VÀO NGÀY MAI ĐỂ CHƠI VÒNG TIẾP THEO &#x26F9;</DIV>";
	}else{
		output = "\<DIV style='color:red;font-size: 20px;'>&#x2639; BẠN ĐÃ THUA &#x2639;</DIV>\
		<DIV style='text-align: center;'>QUAY LẠI VÀO NGÀY MAI ĐỂ CHƠI VÒNG TIẾP THEO &#x26F9;</DIV>\
		";
	}
	output = output + "\
		<div style='margin-top:30px'>THỐNG KÊ SỐ LẦN THẮNG TRONG</div>\
		<div id='statistic'>\
			<div id='statistic-content' style='display:flex;align-items:center;flex-direction:column'>\
				<div class='winRow'>1 lượt: " +winRow[0]+"</div>\
				<div class='winRow'>2 lượt: " +winRow[1]+"</div>\
				<div class='winRow'>3 lượt: " +winRow[2]+"</div>\
				<div class='winRow'>4 lượt: " +winRow[3]+"</div>\
				<div class='winRow'>5 lượt: " +winRow[4]+"</div>\
				<div class='winRow'>6 lượt: " +winRow[5]+"</div>\
				<div class='winRow'>7 lượt: " +winRow[6]+"</div>\
				<div class='winRow'>Bạn đã chơi "+statistic[1] +" lần và thắng " + statistic[0] +" lần" + "</div>\
			</div>\
		</div>\
		"
	return output;
}
function finish(){
	//set cookie to not be able to play for today
	done = true;
	setCookie("done", true);
	document.getElementById("result").style.display = "flex";
	setCookie("guess", words);
	//document.getElementById("result-content").innerHTML = words;
	setCookie("resultColors", resultColors.toString());
	
	if(getCookie("result")=="win"){
		document.getElementById("result-content").innerHTML = resultHTML("win");
		if(lastRow==true){
			winRow[currentX] = parseInt(winRow[currentX]) + 1;
		}else{
			winRow[currentX-1] = parseInt(winRow[currentX]) + 1;
		}
		localStorage.setItem("winRow", winRow);
		statistic[0]=parseInt(statistic[0])+1;
		statistic[1]=parseInt(statistic[1])+1;
	}else{
		document.getElementById("result-content").innerHTML = resultHTML("lose");
		statistic[1]=parseInt(statistic[1])+1;
	}
	localStorage.setItem("statistic", statistic);
}

function win(todayWordNorm){
	console.log("win()");
	setCookie("result", "win");
	setCookie("todayWordNorm", todayWordNorm)
	finish();
}

function lose(){
	console.log("lose()");
	setCookie("result", "lose");
	finish();
}

function submitWord(){
	console.log("submitWord()");
	evaluate();
}

function evaluate(){
	console.log("evaluate()");
	//must be a valid Vietnamese word
	var word ="";
	var previousRow = currentX - 1;
	var todayWordNorm = todayWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	todayWordNorm = todayWord.normalize("NFD").replace(/\p{Diacritic}/gu, "");
	
	if(document.getElementById("tile_6-6").getElementsByClassName("tile-content")[0].innerHTML!=""){
		lastRow=true;
	}
	for(var i=0; i<7; i++){
		if(lastRow==true){ //last row
			var id = "tile_" + currentX + "-" + i;
		}else{
			var id = "tile_" + previousRow + "-" + i;
		}
		var character = document.getElementById(id).getElementsByClassName("tile-content")[0].innerHTML;
		word = word + character;
		word = word.toLowerCase();

		var indexOfChar = todayWordNorm.indexOf(character);
		var flag = 0;
		if(indexOfChar >-1){
			document.getElementById(id).style.backgroundColor = "#b59f3b";
			flag = 1;
		}
		if(word[i] === todayWordNorm[i]){
			document.getElementById(id).style.backgroundColor = "#538d4e";
			document.getElementById(id).getElementsByClassName("tile-content")[0].innerHTML = todayWord[i];

			word = word.substring(0, word.length - 1);
			word = word + todayWord[i];
			flag = 2;
		}

		if(flag==0){
			resultColors.push("#121213");
		}else if(flag==1){
			resultColors.push("#b59f3b");
		}else if(flag==2){
			resultColors.push("#538d4e");
		}

	}

	words.push(word);
	
	if(word.match(todayWord)){
		win(todayWordNorm);
	}else if(!word.match(todayWord) && getCurrentTileId() == "tile_6-6"){
		lose();
	}
}

function backspace(){
	if(!getCookie("done")=="true" || getCookie("done")==""){
		////getCurrentTile().style.border = "2px solid gray";
		if(getCurrentTileText() == '' && currentY == 1){ //second tile
			setCurrentTile(currentX, currentY - 1);
			getCurrentTile().getElementsByClassName("tile-content")[0].innerHTML = '';
		}
		if(getCurrentTileText() == '' && currentY != 0){ //leading empty tile
			setCurrentTile(currentX, currentY - 1);
			getCurrentTile().getElementsByClassName("tile-content")[0].innerHTML = '';
			setCurrentTile(currentX, currentY - 1);
		}
		else if(getCurrentTileText() != '' && currentY != 0){ //occupied tile
			getCurrentTile().getElementsByClassName("tile-content")[0].innerHTML = '';
			setCurrentTile(currentX, currentY - 1);
		}
		else if(getCurrentTileText() != '' && currentY == 0){ //occupied first tile
			getCurrentTile().getElementsByClassName("tile-content")[0].innerHTML = '';
		}
		getCurrentTile().style.animation = "shake 0.5s";

		//for animation to work again
		var currentElement = getCurrentTile();
		var newElement = currentElement.cloneNode(true);
		currentElement.parentNode.replaceChild(newElement, currentElement);

		////getPreviousTile().style.border = "1px solid white";
		//getCurrentTile().style.border = "1px solid white";
	}
}

function enter(){
	if(!getCookie("done")=="true" || getCookie("done")==""){
		////getCurrentTile().style.border = "1px solid gray";
		if(getCurrentTileId().match(/tile_\d-6/) && 
			getCurrentTileText()!='' && 
			!getCurrentTileId().match(/tile_6-\d/)){ //submit word
	  			setCurrentTile(currentX+1, 0);
	  			submitWord();
	  	}
	  	else if(getCurrentTileId().match(/tile_\d-6/) &&
	  			getCurrentTileText()!='' && 
	  			getCurrentTileId().match(/tile_6-\d/)){ //finish - submit last try
	  				//finish();
	  			submitWord();
	  	}
	  	////getCurrentTile().style.border = "1px solid white";
  	}
}

document.onkeypress = function(event){
	var keynum = event.keyCode || event.charCode;
	var key = String.fromCharCode(keynum)
	//var currentRow = tb.parentElement.parentElement;
	if(key.match(/^(q|Q|w|W|e|E|r|R|t|T|y|Y|u|U|i|I|o|O|p|P|a|A|s|S|d|D|f|F|g|G|h|H|j|J|k|K|l|L|z|Z|x|X|c|C|v|V|b|B|n|N|m|M)$/)){
		inputKey(key);
	}else if(keynum == 32){
		inputKey(key);
	}
}

document.onkeydown = function(event){
	var keynum = event.keyCode || event.charCode;
	if(keynum == 8){ //BACKSPACE
		backspace();
	}else if(keynum == 13){ //ENTER
		enter();
	}
}


function help(){
	document.getElementById("help").style.display =  "flex";
}

function closeHelp(){
	document.getElementById("help").style.display =  "none";
}

function setCookie(name,value,path) {
    var expires = "";
    var date = new Date();
    var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    expires = "; expires=" + midnight.toGMTString();
    if (!path) {
        path = "/";
    }
    document.cookie = name + "=" + value + expires + "; path=" + path;
}

function setPermanentCookie(name, value){

}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}