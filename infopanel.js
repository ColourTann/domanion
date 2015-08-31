var InfoPanelStatics={
	startY:6,
	startX:12,
	yGap:18,
	coins:0,
	actions:1,
	buys:2,
};


function InfoPanel(){
	var col = c_light;
	this.group = game.add.group(); 
    this.panelBase = game.add.sprite(0,0,'bigbutton');
    this.group.add(this.panelBase);

    //add panel text//
    var currentX=InfoPanelStatics.startX;
    var currentY=InfoPanelStatics.startY;

this.coinsText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Coins: unset", 16); 
 	this.coinsText.tint=col;
 	this.group.add(this.coinsText);
   

 	currentY+=InfoPanelStatics.yGap;

 	this.actionsText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Actions: unset", 16); 
 	this.actionsText.tint=col;
 	this.group.add(this.actionsText);

	currentY+=InfoPanelStatics.yGap; 	

	 this.buysText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Buys: unset", 16); 
 	this.buysText.tint=col;
 	this.group.add(this.buysText);

 	currentY+=InfoPanelStatics.yGap; 	

 	currentY+=5;

 	var divider = game.add.sprite(0, currentY, "pixel");
	divider.scale.setTo(this.panelBase.width, 1);
	this.group.add(divider);

	currentY+=5;

	this.discardText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Discard: unset", 16); 
 	this.discardText.tint=col;
 	this.group.add(this.discardText);

 	currentY+=InfoPanelStatics.yGap; 	

	this.deckText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Deck: unset", 16); 
 	this.deckText.tint=col;
 	this.group.add(this.deckText);

 
 	this.setData= function(type, value){
 		switch (type){
 			case InfoPanelStatics.coins:
 				this.coins=value;
 				break;
 			case InfoPanelStatics.actions:
 				this.actions=value;
 			break;
 			case InfoPanelStatics.buys:
 				this.buys=value;
 			break;
 			case InfoPanelStatics.deck:
 				this.deck=value;
 			break;
 			case InfoPanelStatics.discard:
 				this.discard=value;
 			break;
 		}
 		this.redoText();
 	}

 	this.addData=function(type, value){
 		switch (type){
 			case InfoPanelStatics.coins:
 				this.coins+=value;
 				break;
 			case InfoPanelStatics.actions:
 				this.actions+=value;
 			break;
 			case InfoPanelStatics.buys:
 				this.buys+=value;
 			break;
 			

 		}
 		this.redoText();
 	}

 	this.redoText= function(){

 		this.buysText.text="Buys: "+this.buys;
 		this.coinsText.text="Coins: "+this.coins;
 		this.actionsText.text="Actions: "+this.actions;
 		this.discardText.text="Discard: "+discard.length;
 		this.deckText.text="Deck: "+deck.length;
 	}

 	this.reset= function(){
	 	this.setData(InfoPanelStatics.coins, 0);
	    this.setData(InfoPanelStatics.actions,1);
	    this.setData(InfoPanelStatics.buys, 1);
	    this.setData(InfoPanelStatics.deck, 1);
 		this.setData(InfoPanelStatics.discard, 1);
 	}	
 	this.reset();

 	this.group.x=game.width-this.panelBase.width-5;
 	this.group.y=290;


}
