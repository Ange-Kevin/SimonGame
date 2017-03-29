var hide = true;
var melody, copy;
var active = true;
var gameMode = true;
var vitesse = 800;
var vitesseMode = 0;
var score = 0;

/*----------------- Mon script d'affichage du menu ---------------*/
$(function() 
{
	var pull    = $('#pull');
	menu        = $('nav>ul');
	menuHeight  = menu.height();
	xx = document.body.clientWidth;
	$(pull).on('click', function(e)
	{
	    e.preventDefault();
	    menu.slideToggle();
	});

	$(window).resize(function() 
	{
		var w = $(window).width();
		if(w > 320 && menu.is(':hidden'))
		{
		   menu.removeAttr('style');
		}
	});
});
/*------------------------------------------------------------------------------------*/


// ------------------------------------ Initialisation du Jeu et Nouvelle Partie --------------------------------------------

 //Jeu Simon
$(document).ready(function(){
	$('#end').hide();
	$('#gameHard').hide();
	$('#hard').prop('checked', false);
	$('#easy').prop('checked', true);
	$('#low').prop('checked', false);
	$('#normal').prop('checked', true);
	$('#fast').prop('checked', false);
});

$('#start').click(function() {
	initGame();
	$('#end').hide();
});

$('#restart').click(function() {
	initGame();
	$('#end').hide();
});

$('#stop').click(function() {
	stopAnimation();
	endGame();
	$('#end').hide();
});

$('#restop').click(function() {
	stopAnimation();
	endGame();
	$('#end').hide();
});

//Initialisation du jeu
function initGame() {
	stopAnimation();
	startGame();
	return score = 0;
}

//Lancement du jeu
function startGame() {
	melody = [];
	copy = [];
	newRound();
}

//Nouveau tour
function newRound() {
	melody.push(randomNumber());
	nbRound(melody.length);
	this.copy = this.melody.slice(0);
	animate(melody);
	clickPlayer();
	vitesseMode = this.vitesse;
	if(vitesseMode > 400){
		return vitesseMode = this.vitesse - 25 * melody.length;
	} else {
		return vitesseMode = 400;
	} 
}

//Génération de nombres aléatoires
function randomNumber() {
	if(this.gameMode == true) {
		return Math.floor(Math.random()*3+1);
	} else {
		return Math.floor(Math.random()*8+1);
	}
}


// ----------------------------------------- Animations des couleurs et des sons du jeu ---------------------------------------


//Animation des séquences
function animate(melody) {
	var i = 0;
	var interval = setInterval(function() {
		melodyNote(melody[i]);
		lightOnSound(melody[i]);
        i++;
        if (i >= melody.length) {
			clearInterval(interval);
        }
   }, vitesseMode);
}

//Animation des boutons
function lightOnSound(tile) {
	var $tile = $('[data-tile=' + tile + ']').addClass('lit');
	window.setTimeout(function() {
		$tile.removeClass('lit');
	}, 300);
}

//Sons du jeu
function melodyNote(tile) {
	var piano = Synth.createInstrument('piano');
	switch (tile) {
		case 1:
			piano.play('C', 3, 2);
			$('#red h2').html("DO").fadeIn(150);
			$('#red h2').delay(100).fadeOut(150);
			break;
		case 2:
			piano.play('D', 3, 2);
			$('#blue h2').html("RE").fadeIn(150);
			$('#blue h2').delay(100).fadeOut(150);
			break;
		case 3:
			piano.play('E', 3, 2);
			$('#yellow h2').html("MI").fadeIn(150);
			$('#yellow h2').delay(100).fadeOut(150);
			break;
		case 4:
			piano.play('F', 3, 2);
			$('#green h2').html("FA").fadeIn(150);
			$('#green h2').delay(100).fadeOut(150);
			break;
		case 5:
			piano.play('G', 3, 2);
			$('#purple h2').html("SOL").fadeIn(150);
			$('#purple h2').delay(100).fadeOut(150);
			break;
		case 6:
			piano.play('A', 3, 2);
			$('#orange h2').html("LA").fadeIn(150);
			$('#orange h2').delay(100).fadeOut(150);
			break;
		case 7:
			piano.play('B', 3, 2);
			$('#pink h2').html("SI").fadeIn(150);
			$('#pink h2').delay(100).fadeOut(150);
			break;
		case 8:
			piano.play('C', 4, 2);
			$('#brown h2').html("DO").fadeIn(150);
			$('#brown h2').delay(100).fadeOut(150);
			break;
		default: abcdefg
			break;
	}
}


// ----------------------------------------- Choix des options du Jeu (Difficulté et vitesse) ---------------------------------------

//Choix de la difficulté
$('#easy').click(function() {
	$('#hard').prop('checked', false);
	$('#easy').prop('checked', true);
	$('.tile').width('33.33%');
	$('#gameHard').hide();
	$('#gameEasy').show();
	$('.tile h2').html("");
	changeGameMode();
});

$('#hard').click(function() {
	$('#easy').prop('checked', false);
	$('#hard').prop('checked', true);
	$('.tile').width('12.5%');
	$('#gameEasy').hide();
	$('#gameHard').show();
	$('.tile h2').html("");
	changeGameMode();
});

//Change de mode pour permettre de générer les notes plus aigues
function changeGameMode(){
	if(this.gameMode == true){
		return gameMode = false;
	} else {
		return gameMode = true;
	}
}

//Choix de la vitesse
$('#vitesse input').click(function() {
	if($('#low').prop('checked')){
		return vitesse = 1200;
	}
	else if($('#normal').prop('checked')){
		return vitesse = 800;
	}
	else{
		return vitesse = 400;
	}
});


// ----------------------------------------- Interaction du Joueur et son Score -----------------------------------------------


//Détection des clicks de l'utilisateur
function clickPlayer(){
	$('#game-board div')
		.on('click', '[data-tile]', registerScore)
		.on('mousedown', '[data-tile]', function(){
			$(this).addClass('active');
			melodyNote($(this).data('tile'));
		})
		.on('mouseup', '[data-tile]', function(){
			$(this).removeClass('active');
		});
	$('[data-tile]').addClass('hoverable');
}

//Vérifie si le joueur s'est trompé
function checkPlayerClick() {
	if (copy.length === 0 && active) {
		stopAnimation();
		newRound();
	} else if (!active) { // user lost
		stopAnimation();
		endGame();
	}
}

//Enregistrement du score
function registerScore(e) {
	var desiredResponse = copy.shift();
	var actualResponse = $(e.target).data('tile');
	active = (desiredResponse === actualResponse);
	checkPlayerClick();
	return score++;
}

//Compteur de tours
function nbRound(c) {
	if(c==1){
		$('h3[data-action="nbround"]').hide();
	} else {
		$('h3[data-action="nbround"]').show().html("Round : " + (c-1));
	}
}
// ------------------------------------------------- Fin du Jeu --------------------------------------------------

//Stopper les animations
function stopAnimation() {
		$('#game-board div')
			.off('click', '[data-tile]')
			.off('mousedown', '[data-tile]')
			.off('mouseup', '[data-tile]');

		$('[data-tile]').removeClass('hoverable');
}

//Fin du jeu
function endGame() {
	// notify the user that they lost
	$('#menu').hide();
	$('#end').show();
	$('#nav').show();
	$('#end h2').html("Ton score est de " + this.score + ".");
	return hide = false;
}

