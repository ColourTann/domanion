var cardStatics={
	titleY:5,
	costX:10,
	textStartY:68,
	yGap:14,
	cardWidth:116,
	cardHeight:118
};

var CardTypes={vp:0, action:1, money:2};

var actionStatics={	money:0, action:1, draw:2, buy:3, trash:4, cycle:5, immunity:6, gainCardMax:7, 
	trashSelf:8, onePointPerTen:9, otherDiscard:10, trashCopper:11, doublePlay:12, opponentseDraw:13,
	upgradeTreasure:14, curse:15, upgrade:17, drawDiscarded:18, gainBetterTreasure:19, discard:20, vp:21, pointsPerDuchy:22
};

var CardRequirement={hasCopper:0, hasCard:1, hasTreasure:2};

var CardStates={pool:0, deck:1, hand:2, discard:3, played:4};

function stringEnum(val,eenum){
	for (var k in eenum) if (eenum[k] == val) return k;
  return null;
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function Action(action, arg, resultActions, card){
	this.action=action;
	this.arg=arg;
	this.resultActions=resultActions;

	this.run = function(){
			
		switch (action){
			case actionStatics.money:
				infoPanel.addData(InfoPanelStatics.coins, arg);
				setState(GameStates.playing_cards);
			break;
			case actionStatics.action:
				infoPanel.addData(InfoPanelStatics.actions, arg);
			break;
			case actionStatics.draw:
				player.drawCards(arg);
			break;
			case actionStatics.buy:
				infoPanel.addData(InfoPanelStatics.buys, arg);
			break;
			case actionStatics.trash:
				setState(GameStates.trashCardFromHand, arg, arg!=1, resultActions);
			break;
			case actionStatics.upgrade:
				setState(GameStates.gainCardMax, stateSpecial.cost+2, false, resultActions);
			break;
			case actionStatics.cycle:
				setState(GameStates.discard, 0, true, [new Action(actionStatics.drawDiscarded)]);
			break;
			case actionStatics.drawDiscarded:
				player.drawCards(stateSpecial);
				setState(GameStates.playing_cards);
			break;
			case actionStatics.gainCardMax:
				setState(GameStates.gainCardMax, arg, false, resultActions);
			break;
			case actionStatics.trashCopper:
				setState(GameStates.trashCopper, 1, false, resultActions);
			break;
			case actionStatics.trashSelf:
				playedCard.trash();
			break;
			case actionStatics.upgradeTreasure:
				setState(GameStates.trashTreasure, 1, false, [new Action(actionStatics.gainBetterTreasure)]);
			break;
			case actionStatics.gainBetterTreasure:
				var card;
				if(stateSpecial.title=="copper"){
					var card = moneyStacks[1].remove();
				}
				if(stateSpecial.title=="silver"||stateSpecial.title=="gold"){
					var card = moneyStacks[2].remove();
				}
				if(card) player.addCardToHand(card);
				card.setState(CardStates.hand);
				setState(GameStates.playing_cards);
			break;
			case actionStatics.discard:
				setState(GameStates.discard, arg, false);
			break;
			case actionStatics.opponentseDraw:
				sendMessage("fd");
			break;

			
			
			

		}
	}
}

function CardArgs(cardType, title, cost, texts, actions){
	this.args=[cardType, title, cost, texts, actions];
}

function Card(cardType, title, cost, texts, actions){
	

	this.trash =function(){
		this.removeFromHand();
		this.removeFromPlayed();
		this.hide();
		player.displayCards();
		log.addLine(username+" trashes "+this.title);
    }

    this.removeFromPlayed=function(){
    	var index = played.indexOf(this);
		if (index > -1) {
		    played.splice(index, 1);
		}
    }

    function cardClick(){
    	

    	if(gameState!=GameStates.playing_cards){

	    	if(gameState==GameStates.trashCardFromHand||
	    		gameState==GameStates.trashCopper&&this.title=="copper"||
	    		gameState==GameStates.trashTreasure&&this.cardType==CardTypes.money){
	    		this.trash();
	    		stateSpecial=this;
	    		stateSuccess();
	    		return;
	    	}

	    	if(gameState==GameStates.discard){
	    		this.discard();
	    		stateSpecial++;
	    		stateSuccess();
	    		return;
	    	}
	    	return;
		}
    	if(this.state==CardStates.hand)this.play();
    }
    
	this.addText= function(line, text, group){
		text = game.add.bitmapText(0, cardStatics.textStartY+line*cardStatics.yGap, 'silkscreen', text, 16);
		text.x=Math.round(cardStatics.cardWidth/2-text.textWidth/2);
     	text.tint=col;
     	group.add(text);
	};
	

	this.getSortByTypeValue=function(){
		var result=0;
		 switch(cardType){
		 	case CardTypes.vp:
		    	result+=0;
			break;
			case CardTypes.money:
				result+=10000;
			break;
			case CardTypes.action:
				result+=20000;
			break;
		 }
		result+=cost*1000;
		result+=title.charCodeAt(0)*10;
		result+=title.charCodeAt(1)*.1;
		result+=title.charCodeAt(2)*.001;
		return result;
	}

	this.setState=function(state){
		switch(state){
			case CardStates.hand:

			break;
			case CardStates.played:
				this.hide();
			break;
			case CardStates.discard:
				this.hide();
			break;
			case CardStates.hand:
				this.group.visible=true;


			break;
		}
		this.state=state;
	}

	this.removeFromHand=function(){
		var index = hand.indexOf(this);
		if (index > -1) {
		    hand.splice(index, 1);
		}
	}

	this.discard=function(){
		log.addLine(username+" discards "+this.title);
		this.removeFromHand();
		discard.push(this);
		this.hide();
		player.displayCards();
		infoPanel.redoText();
	}

	this.play=function(){
	
		if(this.cardType==CardTypes.vp)return;
		if(this.cardType==CardTypes.action){
			if(infoPanel.actions<=0)return;
		}

		var draw=false;
		for(var i=0;i<actions.length;i++){
			var act = actions[i];
			if(draw)break;
			switch(act.action){
				case actionStatics.draw:
					draw=true;
				break;
				case actionStatics.trashCopper:
					var found=false;
					for(var i=0;i<hand.length;i++){
						var card = hand[i];
						if(card.title=="copper"){
							found=true;
							break;
						}
					}
					if(!found){
						console.log("not playing because no copper");
						return;
					}
				break;
				case actionStatics.trashTreasure:
				case actionStatics.upgradeTreasure:
					var found=false;
					for(var i=0;i<hand.length;i++){
						var card = hand[i];
						if(card.cardType==CardTypes.money){
							found=true;
							break;
						}
					}
					if(!found){
						console.log("not playing because no treasure");
						return;
					}
					break;
				case actionStatics.trash:
					if(hand.length<2){
						console.log("not playing because nothing to trash");
						return;
					}
				break;
			}
		}

		if(this.cardType==CardTypes.action)infoPanel.addData(InfoPanelStatics.actions, -1);

		log.addLine(username+" plays "+this.title);
		playedCard=this;
		this.removeFromHand();
		played.push(this);
    	this.setState(CardStates.played);
    	for(var i =0; i<actions.length;i++){
    		var action = this.actions[i];
    		action.run();
    	}

	}

	this.hide=function(){
		this.group.visible=false;
	}

	this.setSide=function(side){
		var frontVisible = side==0;
		faceDownGroup.visible=frontVisible;
		faceUpGroup.visible=!frontVisible;	
	}

	this.state=CardStates.pool;
	this.cardType=cardType;
	this.title=title;
	this.cost=cost;
	this.actions=actions;
	var col=c_light;
	//group to add everything to//
	this.group = game.add.group();
	this.faceUpGroup=game.add.group();
	this.faceDownGroup=game.add.group();
	this.group.add(this.faceUpGroup);
	this.group.add(this.faceDownGroup);

	//setup faceDownGroup//
	this.backSprite=game.add.sprite(0,0,"cardback");
	this.faceDownGroup.add(this.backSprite);
	this.faceDownGroup.visible=false;

	//setup base sprite//
    this.cardBase = game.add.sprite(0,0,'cardBase');
    switch(cardType){
	case CardTypes.vp:
    	this.cardBase.tint=c_green;
	break;
	case CardTypes.money:
		if(title=="copper") this.cardBase.tint=c_copper;
		if(title=="silver") this.cardBase.tint=c_silver;
		if(title=="gold") {
			this.cardBase.tint=c_yellow;
			col=c_dark;
		}
	break;
	case CardTypes.action:
		this.cardBase.tint=c_blueDark;
		break;
    }
    this.faceUpGroup.add(this.cardBase);

    //add clickListener to base sprite//
    this.cardBase.inputEnabled = true;
    this.cardBase.events.onInputDown.add(cardClick, this);

   

    //add outline//
 	this.cardOutline = game.add.sprite(0,0,'cardOutline');
 	this.faceUpGroup.add(this.cardOutline);

 	//add image//
 	console.log(this.title);
 	this.cardpic = game.add.sprite(22,25, this.title+"");
 	this.faceUpGroup.add(this.cardpic);

    //add card title//
    text = game.add.bitmapText(0, cardStatics.titleY, 'silkscreen', title, 16); 
	text.x=Math.round(cardStatics.cardWidth/2-text.textWidth/2);
 	text.tint=col;
 	this.faceUpGroup.add(text);

    //add card cost circle//
    this.costOutline = game.add.sprite(0,0,'cost');
   	this.faceUpGroup.add(this.costOutline);

   	//add card cost text//
	text = game.add.bitmapText(0, cardStatics.titleY, 'silkscreen', ""+cost, 16); 
	text.x=cardStatics.costX;
 	text.tint=c_dark;
 	this.faceUpGroup.add(text);

 	//add card text//
 	for(var i =0;i<texts.length;i++){
		this.addText(i, texts[i], this.faceUpGroup);
	}		
}

function createCard(cardArgs) {
    return new Card(
    	cardArgs.args[0],
    	cardArgs.args[1],
    	cardArgs.args[2],
    	cardArgs.args[3],
    	cardArgs.args[4]
    	);
}



var vpCards=[];
var moneyCards=[];
var kingdomCards=[];
function setupCards(){

	//vp cards constructor list//

	vpCards[0]= new CardArgs(CardTypes.vp, "estate", 2, ["1 point"],[new Action(actionStatics.vp, 1)]); vpCards[0].points=1;
	vpCards[1]= new CardArgs(CardTypes.vp, "duchy", 5, ["3 points"],[new Action(actionStatics.vp, 3)]); vpCards[1].points=3;
	vpCards[2]= new CardArgs(CardTypes.vp, "province", 8, ["6 points"],[new Action(actionStatics.vp, 6)]); vpCards[2].points=6;


	//money cards constructor list//

	moneyCards[0]= new CardArgs(CardTypes.money, "copper", 0, 
		["+1 coin"], 
		[new Action(actionStatics.money, 1)]);  

	moneyCards[1]= new CardArgs(CardTypes.money, "silver", 3, 
		["+2 coins"], 
		[new Action(actionStatics.money, 2)]); 

	moneyCards[2]= new CardArgs(CardTypes.money, "gold", 6, 
		["+3 coins"], 
		[new Action(actionStatics.money, 3)]); 


	//kingdom cards constructor list//

	kingdomCards[0]= new CardArgs(CardTypes.action, "cellar", 2, 
		["+1 action", "discard x cards", "draw x cards"], 
		[new Action(actionStatics.action, 1), new Action(actionStatics.cycle, 0)]);  

	kingdomCards[1]= new CardArgs(CardTypes.action, "chapel", 2, 
		["trash up", "to 4 cards"], 
		[new Action(actionStatics.trash, 4)]);

	kingdomCards[2]= new CardArgs(CardTypes.action, "oracle", 3, 
		["+1 card, +1 action", "+1 coin", "discard a card"], 
		[new Action(actionStatics.draw, 1), new Action(actionStatics.action, 1),
		new Action(actionStatics.money, 1),	new Action(actionStatics.discard, 1)]);  

	kingdomCards[3]= new CardArgs(CardTypes.action, "great hall", 3, 
		["+1 action", "+1 card", "worth 1 point"], 
		[new Action(actionStatics.action, 1), new Action(actionStatics.draw, 1),new Action(actionStatics.vp, 1)]);  

	kingdomCards[4]= new CardArgs(CardTypes.action, "woodcutter", 3, 
		["+2 coins", "+1 buy"], 
		[new Action(actionStatics.money, 2), new Action(actionStatics.buy, 1)]);  

	kingdomCards[5]= new CardArgs(CardTypes.action, "workshop", 3, 
		["gain any card", "up to cost 4"], 
		[new Action(actionStatics.gainCardMax, 4)]);  

	kingdomCards[6]= new CardArgs(CardTypes.action, "feast", 4, 
		["trash this to", "gain a card", "up to cost 5"], 
		[new Action(actionStatics.trashSelf), new Action(actionStatics.gainCardMax, 5)]);  

	kingdomCards[7]= new CardArgs(CardTypes.vp, "gardens", 4, 
		["1 point per", "10 cards in deck"], 
		[new Action(actionStatics.onePointPerTen)]);

	kingdomCards[8]= new CardArgs(CardTypes.action, "pub", 2, 
		["+2 cards", "+1 buy"], 
		[new Action(actionStatics.draw, 2), new Action(actionStatics.buy, 1)]);

	kingdomCards[9]= new CardArgs(CardTypes.action, "loanshark", 4, 
		["trash a copper", "to gain 3 coins"], 
		[new Action(actionStatics.trashCopper, 1, [new Action(actionStatics.money, 3)])],
		CardRequirement.hasCopper);	

	kingdomCards[10]= new CardArgs(CardTypes.action, "remodel", 4, 
		["trash a card to", "gain a card", "worth 2 more"], 
		[new Action(actionStatics.trash, 1, [new Action(actionStatics.upgrade,2)] )],
		CardRequirement.hasCard);	

	kingdomCards[11]= new CardArgs(CardTypes.action, "smithy", 4, 
		["+3 cards"], 
		[new Action(actionStatics.draw, 3)]);  

	kingdomCards[12]= new CardArgs(CardTypes.action, "bazaar", 5, 
		["+1 card", "+2 actions", "+1 coin"], 
		[new Action(actionStatics.action, 2), new Action(actionStatics.draw, 1), 
		new Action(actionStatics.money, 1)]);  

	kingdomCards[13]= new CardArgs(CardTypes.action, "council", 5, 
		["+4 cards", "+1 buy", "opponents draw 1"], 
		[new Action(actionStatics.draw, 4), new Action(actionStatics.buy, 1), 
		new Action(actionStatics.opponentseDraw, 1)]);	

	kingdomCards[14]= new CardArgs(CardTypes.action, "festival", 5, 
		["+2 actions", "+1 buy", "+2 coins"], 
		[new Action(actionStatics.action, 2), new Action(actionStatics.buy, 1), 
		new Action(actionStatics.money, 2)]);  

	kingdomCards[15]= new CardArgs(CardTypes.action, "laboratory", 5, 
		["+1 action", "+2 cards"], 
		[new Action(actionStatics.draw, 2), new Action(actionStatics.action, 1)]);	

	kingdomCards[16]= new CardArgs(CardTypes.action, "market", 5, 
		["+1 action", "+1 card", "+1 buy, +1 coin"], 
		[new Action(actionStatics.draw, 1), new Action(actionStatics.action, 1), 
		new Action(actionStatics.buy, 1), new Action(actionStatics.money, 1)]);	

	kingdomCards[17]= new CardArgs(CardTypes.action, "mine", 5, 
		["upgrade a", "treasure card"], 
		[new Action(actionStatics.upgradeTreasure, 1)],
		CardRequirement.hasTreasure);	

	kingdomCards[18]= new CardArgs(CardTypes.action, "altar", 6, 
		["trash a card", "gain a card", "up to cost 5"], 
		[new Action(actionStatics.trash, 1, [new Action(actionStatics.gainCardMax, 5)])]);	

	kingdomCards[19]= new CardArgs(CardTypes.vp, "duke", 5, 
		["1 point per", "duchy in your", "deck"], 
		[new Action(actionStatics.pointsPerDuchy, 1)]);	

	kingdomCards[20]= new CardArgs(CardTypes.action, "warehouse", 3, 
		["+3 cards", "+1 action", "discard 3 cards"], 
		[new Action(actionStatics.draw, 3), new Action(actionStatics.action, 1), new Action(actionStatics.discard, 3)]);	


	kingdomCards[21]= new CardArgs(CardTypes.action, "junk dealer", 5, 
		["+1 action, +1 card", "+1 coin", "trash 1 card"], 
		[new Action(actionStatics.draw, 1), new Action(actionStatics.action, 1), 
		new Action(actionStatics.money, 1), new Action(actionStatics.trash, 1)]);	

	kingdomCards[22]= new CardArgs(CardTypes.action, "village", 3, 
		["+2 actions", "+1 card"], 
		[new Action(actionStatics.draw, 1), new Action(actionStatics.action, 2)]);	

	
}

function placeNicely(cards, y){
	for (var i=0;i<cards.length;i++){
		cards[i].group.x=i*80;
		cards[i].group.y=y;
	}
}

function sortByCost(cards){
	cards.sort(compareCardCosts);
}

function compareCardCosts(a,b){
	return a.args[2]-b.args[2];
}

function sortByType(cards){
	cards.sort(compareCardTypes);
}

function compareCardTypes(a, b){
	return a.getSortByTypeValue()-b.getSortByTypeValue();
}