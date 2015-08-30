var InfoPanelStatics={
	startY:8,
	startX:12,
	yGap:23,
	coins:0,
	actions:1,
	buys:2
};
function InfoPanel(){
	var col = c_light;
	this.group = game.add.group(); 
    this.panelBase = game.add.sprite(0,0,'bigbutton');
    this.group.add(this.panelBase);

    //add panel text//
    var currentX=InfoPanelStatics.startX;
    var currentY=InfoPanelStatics.startY;

    this.buysText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Buys: unset", 16); 
 	this.buysText.tint=col;
 	this.group.add(this.buysText);

 	currentY+=InfoPanelStatics.yGap;

 	this.actionsText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Actions: unset", 16); 
 	this.actionsText.tint=col;
 	this.group.add(this.actionsText);

	currentY+=InfoPanelStatics.yGap; 	

	this.coinsText = game.add.bitmapText(currentX, currentY, 'silkscreen', "Coins: unset", 16); 
 	this.coinsText.tint=col;
 	this.group.add(this.coinsText);

 
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
 	}

 	this.setData(InfoPanelStatics.coins, 0);
    this.setData(InfoPanelStatics.actions,1);
    this.setData(InfoPanelStatics.buys, 1);


}