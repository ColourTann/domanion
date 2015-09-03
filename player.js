var deck=[];
var hand=[];
var discard=[];
var played=[];



function Player(){
	
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

	this.dominion = function (){
		deck=deck.concat(discard);
		discard=[];
		shuffleArray(deck);
	}

	this.drawCards=function(amount){
		for(var i =0;i<amount;i++){
			if(deck.length==0){
				this.dominion();
			} 
			if(deck.length==0)return;
			var card = deck.splice(0,1)[0];
			card.setState(CardStates.hand);
			this.addCardToHand(card);
		}	
		
	}

	this.addCardToHand=function(card){
		hand.push(card);
		this.displayCards();
		infoPanel.redoText();
	}

	this.drawHand = function(){
		hand=[];
		this.drawCards(5);
	}

	

	var xGap=game.cache.getImage("cardBase").width+gap;
	var yGap=-(game.cache.getImage("cardBase").height+gap);
	this.displayCards = function(){
		
		sortByType(hand);

		var startX=dividerX+gap;
		var startY=game.height+yGap;
		var x=0;
		var y=0;




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
			card.group.visible=true;
			var dupe=false;
			if(prevCard!=null&&prevCard.title==card.title){
				dupe=true;
			}
			if(dupe){
				card.group.x=prevCard.group.x+4;
				card.group.y=prevCard.group.y-4;
			}
			else{
				card.group.y=startY+y*yGap;
				card.group.x=startX+x*xGap;
				x++;
				if(x>=3){
					x=0;
					y++;
				}
				
			}
			card.group.visible=true;
			
			prevCard=card;
		}
	}
	this.drawHand();
	this.displayCards();

	this.playAllCoins= function(){
		if(gameState!=GameStates.playing_cards)return;

		

		for(var i=hand.length-1;i>=0;i--){
			var card = hand[i];
			if(card.cardType==CardTypes.money){
				card.play();
			}
		}
	}

	this.updatePanel=function(){
		infoPanel.setData(InfoPanelStatics.deck, deck.length);
		infoPanel.setData(InfoPanelStatics.discard, discard.length);
	}

	this.endTurn= function(){
		if(gameState!=GameStates.playing_cards)return;
		for(var i=0;i<hand.length;i++){
			hand[i].setState(CardStates.discard);
		}
		for(var i=0;i<played.length;i++){
			played[i].setState(CardStates.discard);
		}
		discard=discard.concat(hand);
		discard=discard.concat(played);
		played=[];
		hand=[];
		player.displayCards();
		player.drawHand();
		infoPanel.reset();
		player.updatePanel();
		setState(GameStates.enemyturn);
		sendMessage("e");
	}

	
	var buttX=842;
	var buttY=300;
	var buttGap=40;
	var playCoinsButt;
	var endButt;
	playCoinsButt=new Button("play all coins");
	playCoinsButt.addClickFunction(this.playAllCoins);
	playCoinsButt.group.x=buttX;
	playCoinsButt.group.y=buttY;

	endButt=new Button("endTurn");
	endButt.addClickFunction(this.endTurn);
	endButt.group.x=buttX;
	endButt.group.y=buttY+buttGap;

	this.updatePanel();
	this.showButtons=function(show){
		endButt.group.visible=show;
		playCoinsButt.group.visible=show;
	}
	this.showButtons(false);

	this.getAllCards=function(){
		var totalCards = [];
		totalCards=totalCards.concat(deck);
		totalCards=totalCards.concat(hand);
		totalCards=totalCards.concat(played);
		totalCards=totalCards.concat(discard);
		return totalCards;
	}

	this.logVictoryCards=function(){
		var totalCards=this.getAllCards();
		var cards=[];
		for(var i=0;i<totalCards.length;i++){
			var card = totalCards[i];
			for(var j=0;j<card.actions.length;j++){
				var action = card.actions[j];
				var found=false;
				switch(action.action){
					case actionStatics.vp:
						found=true;
					break;
					case actionStatics.onePointPerTen:
						found=true;
					break;
					case actionStatics.pointsPerDuchy:
						found=true;
					break;
				}
				if(found){
					cards.push(card);
					break;	
				}
				
			}
		}
		sortByType(cards);
		for(var i=0;i<cards.length;i++){
			var card = cards[i];
			log.addLine(card.title);
		}
	}

	this.calculateScore=function(){
		var totalCards = this.getAllCards();
		
		var score=0;
		var numDuchy=0;
		for(var i=0;i<totalCards.length;i++){
			var card = totalCards[i];
			if(card.title=="duchy")numDuchy++;
		}

		for(var i=0;i<totalCards.length;i++){
			var card = totalCards[i];
			
			for(var j=0;j<card.actions.length;j++){
				var action = card.actions[j];
				switch(action.action){
					case actionStatics.vp:
						score+=action.arg;
					break;
					case actionStatics.onePointPerTen:
						score+=Math.floor(totalCards.length/10);
					break;
					case actionStatics.pointsPerDuchy:
						score+=numDuchy;
					break;
				}
			}
		}
		return score;
	}
}



function startTurn(){

}

function toFront(start,end,list){
	for(var i=start;i<=end;i++){
		game.world.bringToTop(list[i].group);
	}
}