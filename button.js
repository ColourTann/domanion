function Button(text){
	//group to add everything to//
	this.group = game.add.group(); 

	//button texture//
    this.buttonBase = game.add.sprite(0,0,'button');
    this.group.add(this.buttonBase);

    //text for the button//
    this.buttonText = game.add.bitmapText(0, cardStatics.titleY, 'silkscreen', text, 16); 
	this.buttonText.x=Math.round(this.buttonBase.width/2-this.buttonText.textWidth/2);
	this.buttonText.y=Math.round(this.buttonBase.height/2-this.buttonText.textHeight/2-1);
	

 	text.tint=c_light;
 	this.group.add(this.buttonText);

    //add clickListener to base sprite//
    
    this.addClickFunction=function(clickFunction){
    	this.buttonBase.inputEnabled = true;
    	this.buttonBase.events.onInputDown.add(clickFunction, this);
    }
}