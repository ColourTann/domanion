function removeFromStack(data){
	var stack;
	for(var i=0;i<3;i++){
		stack=moneyStacks[i];
	
		if(stack.cardStack.length>0&&stack.cardStack[0].title==data){
			stack.remove(true);
		}
		stack=vpStacks[i];
		if(stack.cardStack.length>0&&stack.cardStack[0].title==data){
			stack.remove(true);
		}
	}	
	for(var i=0;i<10;i++){
		stack=kingdomStacks[i];
		if(stack.cardStack.length>0&&stack.cardStack[0].title==data){
			stack.remove(true);
		}
	}	

}
function Tableau(input){
	this.cards=[];	
	indices = input.split(",");

	
	for(var i=0;i<indices.length;i++){
		this.cards.push(kingdomCards[indices[i]]);
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
	var across=0;
	var x=gap;
	var y=game.height-yGap;
	for(var i=0;i<10;i++){
		// if(cards[i].args[2]>prevCost){
			if(across==3){
				across=0;

			prevCost=cards[i].args[2];
			if(x>0){
				x=gap;
				y-=yGap;
			}
		}
		kingdomStacks.push(new Stack(cards[i], (cards[i].args[0]==CardTypes.vp?8:10), x, y));
		across++;
		x+=xGap;
	
	}
 
 	//money and vp cards//
	 for(var i=0;i<3;i++){
	 	moneyStacks[i]=new Stack(moneyCards[i], 20, Math.floor(gap+xGap*3.5), game.height-yGap*(i+1));
		vpStacks[i]=new Stack(vpCards[i], 8, Math.floor(gap+xGap*4.5), game.height-yGap*(i+1));
	 }

	//divider//
	dividerX=Math.floor(gap+xGap*5.5);
	var divider = game.add.sprite(dividerX, 0, "pixel");
	divider.scale.setTo(1, game.height);
}

