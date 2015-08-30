var cardStatics={
	titleY:5,
	costX:10,
	textStartY:68,
	yGap:14,
	cardWidth:116
};

var CardTypes={vp:0, action:1, money:2};

var actionStatics={	money:0, action:1, draw:2, buy:3, trash:4, cycle:5, immunity:6, gainCardMax:7, trashSelf:8, onePointPerTen:9, otherDiscard:10 };

function stringEnum(val,eenum){
	for (var k in eenum) if (eenum[k] == val) return k;
  return null;
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function Action(action, arg, resultActions){
	this.action=action;
	this.arg=arg;
	this.resultActions=resultActions;
	this.run = function(){
		switch (action){
			case actionStatics.money:
				infoPanel.addData(InfoPanelStatics.coins, 1);
			break;
		}
		console.log(stringEnum(action, actionStatics)+":"+arg);
	}
}

function CardArgs(cardType, title, cost, texts, actions){
	this.args=[cardType, title, cost, texts, actions];
}

function Card(cardType, title, cost, texts, actions){
	this.cardType=cardType;
	this.title=title;
	this.cost=cost;
	this.actions=actions;
	var col=c_light;
	//group to add everything to//
	this.group = game.add.group(); 

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
    this.group.add(this.cardBase);

    //add clickListener to base sprite//
    this.cardBase.inputEnabled = true;
    this.cardBase.events.onInputDown.add(cardClick, this);
    function cardClick(){
    	this.play();
    }

    //add outline//
 	this.cardOutline = game.add.sprite(0,0,'cardOutline');
 	this.group.add(this.cardOutline);

 	//add image//
 	this.cardpic = game.add.sprite(0,0,'cardpic');
 	this.group.add(this.cardpic);

    //add card title//
    text = game.add.bitmapText(0, cardStatics.titleY, 'silkscreen', title, 16); 
	text.x=Math.round(cardStatics.cardWidth/2-text.textWidth/2);
 	text.tint=col;
 	this.group.add(text);

    //add card cost circle//
    this.costOutline = game.add.sprite(0,0,'cost');
   	this.group.add(this.costOutline);

   	//add card cost text//
	text = game.add.bitmapText(0, cardStatics.titleY, 'silkscreen', ""+cost, 16); 
	text.x=cardStatics.costX;
 	text.tint=c_dark;
 	this.group.add(text);

    //add card text//
	this.addText= function(line, text, group){
		text = game.add.bitmapText(0, cardStatics.textStartY+line*cardStatics.yGap, 'silkscreen', text, 16);
		text.x=Math.round(cardStatics.cardWidth/2-text.textWidth/2);
     	text.tint=col;
     	group.add(text);
	};
	for(var i =0;i<texts.length;i++){
		this.addText(i, texts[i], this.group);
	}	

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
		result+=title.charCodeAt(1)*1;
		result+=title.charCodeAt(2)*1;
		return result;
	}

	this.play=function(){
		if(this.cardType==CardTypes.vp)return;
    	for(var i =0; i<actions.length;i++){
    		var action = this.actions[i];
    		action.run();
    	}
    	this.hide();
	}

	this.hide=function(){
		this.group.visible=false;
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

	vpCards[0]= new CardArgs(CardTypes.vp, "estate", 2, ["1 point"]); vpCards[0].points=1;
	vpCards[1]= new CardArgs(CardTypes.vp, "duchy", 5, ["3 points"]); vpCards[1].points=3;
	vpCards[2]= new CardArgs(CardTypes.vp, "province", 8, ["6 points"]); vpCards[2].points=6;


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
		["+1 action,", "discard x cards,", "draw x cards"], 
		[new Action(actionStatics.action, 1), new Action(actionStatics.cycle, 0)]);  

	kingdomCards[1]= new CardArgs(CardTypes.action, "chapel", 2, 
		["trash up", "to 4 cards"], 
		[new Action(actionStatics.trash, 4)]);  

	kingdomCards[2]= new CardArgs(CardTypes.action, "Moat", 2, 
		["Draw 2 cards,", "attack immunity", "if in your hand"], 
		[new Action(actionStatics.draw, 2), new Action(actionStatics.immunity)]);  

	kingdomCards[3]= new CardArgs(CardTypes.action, "village", 3, 
		["+2 actions,", "+1 card"], 
		[new Action(actionStatics.action, 2), new Action(actionStatics.draw, 1)]);  

	kingdomCards[4]= new CardArgs(CardTypes.action, "woodcutter", 3, 
		["+2 coins,", "+1 buy"], 
		[new Action(actionStatics.money, 2), new Action(actionStatics.buy, 1)]);  

	kingdomCards[5]= new CardArgs(CardTypes.action, "workshop", 3, 
		["gain any card", "up to 4 cost"], 
		[new Action(actionStatics.gainCardMax, 4)]);  

	kingdomCards[6]= new CardArgs(CardTypes.action, "feast", 4, 
		["trash this to", "gain a card", "up to 5 cost"], 
		[new Action(actionStatics.trashSelf), new Action(actionStatics.gainCardMax, 5)]);  

	kingdomCards[7]= new CardArgs(CardTypes.vp, "gardens", 4, 
		["1 point per", "10 cards in deck"], 
		[new Action(actionStatics.onePointPerTen)]);

	kingdomCards[8]= new CardArgs(CardTypes.action, "militia", 4, 
		["+2 money,", "opponents discard", "down to 3 cards"], 
		[new Action(actionStatics.money, 2), new Action(actionStatics.otherDiscard, 3)]);

	kingdomCards[9]= new CardArgs(CardTypes.action, "smithy", 4, 
		["+3 cards"], 
		[new Action(actionStatics.draw, 3)]);  

	kingdomCards[10]= new CardArgs(CardTypes.action, "festival", 5, 
		["+2 actions,", "+1 buy,", "+2 coins"], 
		[new Action(actionStatics.action, 2), new Action(actionStatics.buy, 1), new Action(actionStatics.money, 2)]);  
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
	return a.cost-b.cost;
}

function sortByType(cards){
	cards.sort(compareCardTypes);
}

function compareCardTypes(a, b){

	return a.getSortByTypeValue()-b.getSortByTypeValue();
}