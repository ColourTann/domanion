function Tableau(){
	this.cards=[];	
	shuffleArray(kingdomCards);
	for(var i=0;i<10;i++){
		this.cards.push(createCard(kingdomCards[i]));
	}
	sortByCost(this.cards);
	placeKingdomCards(this.cards);
}
var dividerX;
var gap=3;
function placeKingdomCards(cards){
	var prevCost=2;
	var yGap=cards[0].cardBase.height+gap;
	var xGap=cards[0].cardBase.width+gap;

	//kingdom cards//
	var x=gap;
	var y=game.height-yGap;
	for(var i=0;i<10;i++){
		if(cards[i].cost>prevCost){
			prevCost=cards[i].cost;
			if(x>0){
				x=gap;
				y-=yGap;
			}
		}
		cards[i].group.x=x;
		x+=xGap;
		cards[i].group.y=y;
	}
 
 	//money and vp cards//
	 for(var i=0;i<3;i++){
	 	var money= createCard(moneyCards[i]);
	 	money.group.x=gap+xGap*4;
	 	money.group.y=game.height-yGap*(i+1);
	 	var vp = createCard(vpCards[i]);
	 	vp.group.x=gap+xGap*5;
	 	vp.group.y=game.height-yGap*(i+1);
	 }

	//divider//
	dividerX=gap+xGap*6;
	var divider = game.add.sprite(dividerX, 0, "pixel");
	divider.scale.setTo(1, game.height);
}

