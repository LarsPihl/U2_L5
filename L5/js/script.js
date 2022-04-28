// Globala konstanter och variabler
var boardElem;			// Referens till div-element för "spelplanen"
const carImgs = ["car_up.png","car_right.png","car_down.png","car_left.png"];
						// Array med filnamn för bilderna med bilen
var carDir = 1;			// Riktning för bilen, index till carImgs
var carElem;			// Referens till img-element för bilen
const xStep = 5;		// Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 5;		// eller y-led i varje steg
const timerStep = 20;	// Tid i ms mellan varje steg i förflyttningen
var timerRef = null;	// Referens till timern för bilens förflyttning
var startBtn;			// Referens till startknappen
var stopBtn;			// Referens till stoppknappen
/* === Tillägg i labben === */
var pigElem;//Variabel som senare används för att referera till grisbilden.
var pigTimerRef = null;//Variabel för timer som genererar en ny gris efter 2 sekunder.
const pigDuration = 2000;//Tid som används som timeout för att anropa 'newPig', vilket är efter 2 sekunder.
var pigNr;//Räknare för antal grisar som genererats.
var pigNrElem;//Variabel som sedan används för att skriva ut antal grisar.
var hitCounter;//Räknare för antal träffar.
var hitCounterElem;//Variabel som senare används för att skriva ut antal träffar.
var catchedPig;//Bool som anger om en viss gris blivit träffad eller ej.


// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	// Referenser till element i gränssnittet
	boardElem = document.getElementById("board");//Referens till spelplanen.
	carElem = document.getElementById("car");//Referens till bilbilden.
	startBtn = document.getElementById("startBtn");//Referens till startknappen.
	stopBtn = document.getElementById("stopBtn");//Referens till stoppknapp.
	// Lägg på händelsehanterare
	document.addEventListener("keydown",checkKey);
	// Känna av om användaren trycker på tangenter för att styra bilen
	startBtn.addEventListener("click",startGame);//Tryck på startknappen anropar 'startGame'.
	stopBtn.addEventListener("click",stopGame);//Tryck på startknappen anropar 'stopGame'.
	// Aktivera/inaktivera knappar
	startBtn.disabled = false;//Startknapp aktiveras.
	stopBtn.disabled = true;//Stoppknapp inaktiveras.
	/* === Tillägg i labben === */
	//Referens för olika element, där bilden på en gris och utskrifter för antal träffar respektive antal grisar avses.
	pigElem = document.getElementById("pig");//Referens till grisbilden.
	pigNrElem = document.getElementById("pigNr");//Referens till span-element där antal grisar skrivs ut.
	hitCounterElem = document.getElementById("hitCounter");//Referens till span-element där antal träffar skrivs ut.
	

} // End init
window.addEventListener("load",init);
// ------------------------------
// Kontrollera tangenter och styr bilen
function checkKey(e) { //e är eventobjektet.
	let k = e.key;//Variabel för den knapp som trycks ned i eventobjektet.
	switch (k) {//switchsats för vilken knapp som trycks ned.
		case "ArrowLeft"://För vänsterpil eller 'z', bilen svänger då 90 grader åt vänster då värdet på 'carDir' minskar.
		case "z":
			carDir--; // Bilens riktning 90 grader åt vänster
			if (carDir < 0) carDir = 3; //Bilriktningen sätts till 3 då -1 hade nåtts, då detta är 90
			//åt vänster från 'carDir = 0'. Bilen åker då åt vänster.
			carElem.src = "img/" + carImgs[carDir];//Bilbilden bestäms av värdet på 'carDir', som används
			//som index i 'carImgs'.
			break;
		case "ArrowRight"://För högerpil eller '-', bilen svänger då 90 grader åt höger då värdet på 'carDir' ökar..
		case "-":
			carDir++; // Bilens riktning 90 grader åt höger
			if (carDir > 3) carDir = 0;//Istället för 4 tilldelas värdet 0 för 'carDir', då det är 90 grader
			//höger om 'carDir = 3'. Bilen åker då uppåt.
			carElem.src = "img/" + carImgs[carDir];//Bilbilden bestäms av värdet på 'carDir', som används
			//som index i 'carImgs'.
			break;
	}
} // End checkKey
// ------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
	startBtn.disabled = true;//Startknappen inaktiveras.
	stopBtn.disabled = false;//Stoppknappen aktiveras.
	document.activeElement.blur(); // Knapparna sätts ur focus, så att webbsidan kommer i fokus igen
								   // Detta behövs för att man ska kunna känna av keydown i Firefox.
	carElem.style.left = "0px";//Startposition för bilen.
	carElem.style.top = "0px";//Startposition för bilen.
	carDir = 1;//Bilen startar med rikting åt höger genom att motsvara en sådan bild i 'carImgs' på index [1].
	carElem.src = "img/" + carImgs[carDir];
	moveCar();//Funktionen 'moveCar' anropas.
	/* === Tillägg i labben === */
	//Antal grisar och träffar samt deras utskrifter initieras med startvärdet 0.
	pigNr = 0;
	hitCounter = 0;
	pigNrElem.innerHTML = 0;
	hitCounterElem.innerHTML = 0;
	pigTimerRef = setTimeout(newPig, pigDuration);//Timern som genererar en gris startas. Funktionen
	//'newPig' anropas varannan sekund.
	catchedPig = true;//Grisen sätts till träffad trots att ingen gris ännu finns, då 'checkHit' anropas.
	//Då 'catchedPig' är 'true' avbryts funktionen, då ingen kontroll ännu ska genomföras.
	
} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);//Timern för bilens förflyttning avbryts om den har ett värde.
	startBtn.disabled = false;//Startknappen aktiveras.
	stopBtn.disabled = true;//Stoppknappen inaktiveras.
	/* === Tillägg i labben === */
	if (pigTimerRef != null) clearTimeout(pigTimerRef);//Timern som genererar grisar avbryts om den har ett värde.
	pigElem.style.visibility = "hidden";//Grisbilden sätts då till osynlig.
	

} // End stopGame
// ------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;//Gränsvärde i x-led, som bestäms av spelplanen och bilens storlek.
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;//Gränsvärde i y-led, som bestäms av spelplanen och bilens storlek.
	let x = parseInt(carElem.style.left);	// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);	// y-koordinat (top) för bilen
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;//Bilens y-kordinat minskas med 5 pixlar.
			if (y < 0) y = 0;//Bilens position i y-led sätts till 0 om ett mindre värde nås, då den ej kan åka ovanför planen.
			break;
		case 1: // Höger
			x += xStep;//Bilens x-kordinat ökas med 5 pixlar.
			if (x > xLimit) x = xLimit;//Om ett större värde än gränsvärdet i x-led nås sätts x till gränsvärdet,
			//då bilen ej kan åka utanför planen.
			break;
		case 2: // Nedåt
			y += yStep;//Bilens y-kordinat ökas med 5 pixlar.
			if (y > yLimit) y = yLimit;//Om ett större värde än gränsvärdet i y-led nås sätts y till gränsvärdet,
			//då bilen ej kan åka utanför planen.
			break;
		case 3: // Vänster
			x -= xStep;//Bilens x-kordinat minskas med 5 pixlar.
			if (x < 0) x = 0;//Bilens position i x-led sätts till 0 om ett mindre värde nås, då den ej kan åka ovanför planen.
			break;
	}
	
	/* === Tillägg i labben === */

	carElem.style.left = x + "px";//Bilbildens position i x-led i antal pixlar.
	carElem.style.top = y + "px";//Grisbildens position i x-led i antal pixlar.
	timerRef = setTimeout(moveCar,timerStep);//Timer för bilens förflytning initieras.
	checkHit();//Funktionen 'checkHit' anropas för att kontrollera om en gris bilvit träffad eller ej.

} // End moveCar
// ------------------------------

/* === Tillägg av nya funktioner i labben === */

function newPig() { //En ny gris genereras så länge som räknaren är mindre än 10.
	if (pigNr < 10) {
		pigNr++;//Antalet grisar ökas med 1.
		pigNrElem.innerHTML = pigNr;//Antal grisar skrivs ut.
		catchedPig = false; //När en ny gris skapas sätts det till 'ej träffat'.
		//x och y-värden som maximalt kan ges för grisen bestämms av spelplanens yta, grisens storlek och 10 px 
		//plats på varje sida.
		let xLimit = boardElem.offsetWidth - pigElem.offsetWidth - 20;
		let yLimit = boardElem.offsetHeight - pigElem.offsetHeight - 20;
		//Bland de möjliga värden som kan ges slumpas ett värde fram för x och ett värde för y.
		let x = Math.floor(xLimit*Math.random()) + 10;
		let y = Math.floor(yLimit*Math.random()) + 10;
		//Dessa värden tilldelas grisen, vilket ger den en slumpmässig position på spelplanen.
		pigElem.style.left = x + "px";
		pigElem.style.top = y + "px";
		pigElem.src = "img/pig.png";//Bilden sätts till den givna bilden på en gris, då den i vissa fall
		//ändrats till en annan bild.
		pigElem.style.visibility = "visible";//Bilden sätts till synlig.
		pigTimerRef = setTimeout(newPig, pigDuration);//Timern på funktionen sätts till 2 sekunder, vilket innebär
		//att grisen får en ny position efter 2 sekunder så länge som antalet understiger 10.
	}
	else stopGame();//Spelet stoppas om antalet grisar nått 10.
}

function checkHit() {//Funktion för kontroll av en träff av en gris.
	if (catchedPig == true) return;//Om grisen redan konstaterats träffad avbryts funktionen.
	let cSize = carElem.offsetWidth;//Bilens bredd
	let pSize = pigElem.offsetWidth;//Grisens bredd.
	let cL = parseInt(carElem.style.left);//Bilens position i x-led omvandlat till ett heltal.
	let cT = parseInt(carElem.style.top);//Bilens position i y-led omvandlat till ett heltal.
	let pL = parseInt(pigElem.style.left);//Grisens position i x-led omvandlat till ett heltal.
	let pT = parseInt(pigElem.style.top);//Grisens position i y-led omvandlat till ett heltal.

	if (cL+10 < pL+pSize && cL+cSize-10 > pL && cT+10 < pT+pSize && cT+cSize-10 > pT) {
		//Den formel som anges i labbinstruktionerna används, där bilden på bilen beskärs vid beräkning då den 
		//ursprungligen är större än själva bilen, och därmed annars hade gett en träff när kanten av bilden, 
		//men ej själva bilen, träffat grisen. 
		if (pigTimerRef != null) clearTimeout(pigTimerRef);//Timern som genererar nya grisar efter 2 sekunder avbryts.
		catchedPig = true;//Den bool som anger om grisen är träffad eller ej sätts till sann, så att
		//antalet träffar inte ökas mer än en gång per träff.
		hitCounter++;//Antalet träffar ökas med 1.
		hitCounterElem.innerHTML = hitCounter;//Antalet träffar skrivs ut till användaren.
		pigElem.src = "img/smack.png";//Grisbilden ändrar till en passande bild för en krock, den återställs 
		//igen när 'newPig' anropas.
		pigTimerRef = setTimeout(newPig, pigDuration);//2-sekunderstimern aktiveras igen, och en ny gris
		//dyker alltså upp efter 2 sekunder.
	}
}

