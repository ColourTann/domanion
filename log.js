function Log(){
	var groupX=725;
	var groupY=241;
	var yGap=-20;
	var currentY=0;
	var prevText;
	var prevString="";
	var mult=1;
	this.group=game.add.group();
	this.group.x=groupX;
	this.group.y=groupY;
	this.addLine=function(text, fromServer){
		 //text for the button//
		if(!fromServer)sock.send("m"+text);
		if(prevString==text){
			mult++;
			prevText.text=prevString+" x"+mult;
			return;
		}
		prevString=text;
		mult=1;
    	text = game.add.bitmapText(0, currentY, 'silkscreen', text, 16); 
    	this.group.add(text);
    	prevText=text;
		currentY-=yGap;
		this.group.y+=yGap;
	}

}
