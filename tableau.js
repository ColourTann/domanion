function Tableau(){
	this.cards=[];	
	shuffleArray(kingdomCards);
	for(var i=0;i<10;i++){
		this.cards.push(kingdomCards[i]);
	}
	sortByCost(this.cards);
	placeKingdomCards(this.cards);
}
var dividerX;
var gap=3;
var moneyStacks=[];
var vpStacks=[];
var kingdomStacks=[];
function placeKingdomCards(cards){
	var prevCost=2;
	var yGap=cardStatics.cardHeight+gap;
	var xGap=cardStatics.cardWidth+gap;

	//kingdom cards//
	var x=gap;
	var y=game.height-yGap;
	for(var i=0;i<10;i++){
		if(cards[i].args[2]>prevCost){

			prevCost=cards[i].args[2];
			if(x>0){
				x=gap;
				y-=yGap;
			}
		}
		kingdomStacks.push(new Stack(cards[i], 10, x, y));

		x+=xGap;
	
	}
 
 	//money and vp cards//
	 for(var i=0;i<3;i++){
	 	moneyStacks[i]=new Stack(moneyCards[i], 10, gap+xGap*4, game.height-yGap*(i+1));
		vpStacks[i]=new Stack(vpCards[i], 8, gap+xGap*5, game.height-yGap*(i+1));
	 }

	//divider//
	dividerX=gap+xGap*6;
	var divider = game.add.sprite(dividerX, 0, "pixel");
	divider.scale.setTo(1, game.height);
}

