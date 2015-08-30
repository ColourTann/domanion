var deck=[];
var hand=[];
var discard=[];
var infoPanel;
function Player(){
	infoPanel= new InfoPanel();
	for(var i=0;i<7;i++){
		deck.push(createCard(moneyCards[0]));
	}	

	for(var i=0;i<3;i++){
		deck.push(createCard(vpCards[0]));
	}	
	shuffleArray(deck);
	for(var i=0;i<deck.length;i++){
		deck[i].group.visible=false;
	}

	drawHand = function(){
		hand=[];
		for(var i =0;i<5;i++){
			if(deck.length==0) dominion();
			hand.push(deck.splice(0,1)[0])
		}
	}

	dominion = function (){
		deck=discard;
		discard=[];
		shuffleArray(deck);
	}

	displayCards = function(){
		
		sortByType(hand);

		
		var x=dividerX+gap;
		var y=game.height-hand[0].cardBase.height-gap;
		var prevCard;

		var prevCard;
		var prevIndex=hand.length-1;
		for(var i=hand.length-1;i>=0;i--){
			var card = hand[i];
			if((prevCard!=null&&prevCard.title!=card.title)||i==0){
				toFront(i, prevIndex, hand);
				prevIndex=i;
			}
			prevCard=card;
		}
		prevCard=null;
		for(var i=0;i<hand.length;i++){
			var card = hand[i];
			var dupe=false;
			if(prevCard!=null&&prevCard.title==card.title){
				dupe=true;
			}
			if(dupe){
				card.group.x=prevCard.group.x+4;
				card.group.y=prevCard.group.y-4;
			}
			else{
				card.group.y=y;
				card.group.x=x;
				x+=card.cardBase.width+gap;
			}
			card.group.visible=true;
			
			prevCard=card;
		}
	}
	drawHand();
	displayCards();

	playAllCoins= function(){
		for(var i=hand.length-1;i>=0;i--){
			var card = hand[i];
			if(card.cardType==CardTypes.money){
				card.play();
			}
		}
	}

	endTurn= function(){
		for(var i=0;i<hand.length;i++){
			hand[i].hide();
		}
		discard=discard.concat(hand);
		drawHand();
		displayCards();
	}

	var playCoinsButt=new Button("play all coins");
	playCoinsButt.addClickFunction(playAllCoins);
	playCoinsButt.group.x=850;
	playCoinsButt.group.y=50;

	var endButt=new Button("endTurn");
	endButt.addClickFunction(endTurn);
	endButt.group.x=850;
	endButt.group.y=150;
}



function startTurn(){

}

function toFront(start,end,list){
	for(var i=start;i<=end;i++){
		game.world.bringToTop(list[i].group);
	}
}