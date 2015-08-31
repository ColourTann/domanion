var currentPrompt;

function removePrompt(){
	if(currentPrompt==null)return;
	currentPrompt.group.visible=false;
}

function addPrompt(text, ok){
	removePrompt();
	currentPrompt = new Prompt(text, ok);

}

var promptX=748;
var promptY=250;
function Prompt(text, ok){
	//group to add everything to//
	this.group = game.add.group(); 

	//button texture//
    this.buttonBase = game.add.sprite(0,0,'longbutton');
    this.group.add(this.buttonBase);

    //text for the button//
    this.buttonText = game.add.bitmapText(0, cardStatics.titleY, 'silkscreen', text, 16); 
	this.buttonText.x=Math.round(this.buttonBase.width/2-this.buttonText.textWidth/2);
	this.buttonText.y=Math.round(this.buttonBase.height/2-this.buttonText.textHeight/2-1);
	

 	text.tint=c_light;
 	this.group.add(this.buttonText);

 	if(ok){
 		var butt = new Button("ok");
 		butt.group.x+=255;
 		butt.addClickFunction(okFunction);
 		this.group.add(butt.group);
 	}

 	this.group.x=promptX;
 	this.group.y=promptY;

}

function okFunction(){
	stateSuccess(true);
}