var depletedStacks=0;
var ended=false;

function Stack(cardArgs, number, x, y){
	this.numCards=number;
	this.cardStack=[];
	for(var i=0;i<number;i++){
	 	var card= createCard(cardArgs);
	 	card.group.x=x;
	 	card.group.y=y;
	 	this.cardStack.push(card);
	}

	var baseTextX=x+cardStatics.cardWidth-14;

	this.setupTextPosition=function(){
		this.text.x=Math.floor(baseTextX-this.text.textWidth/2);
	}

	// var me =this;
	click=function(){
		this.buy();
		sendAll();
	}

	this.buy=function(){
		if(this.cardStack.length==0)return;

		//specials//
		if(gameState==GameStates.gainCardMax && this.cardStack[0].cost<=stateArg){
    		this.gain(true);
    		stateSuccess();
    		return;
    	}

    	if(gameState!=GameStates.playing_cards)return;

		//regular buying//


		if(this.cardStack[0].cost>infoPanel.coins||infoPanel.buys<=0)return;
		this.gain();
		
	}

	this.remove=function(fromServer){
		console.log("removing");
		this.numCards--;
		if(this.numCards>0) this.text.text="["+this.numCards+"]";
		else this.text.text="";
		this.setupTextPosition();
		var card = this.cardStack.shift();

		if(!fromServer)sendMessage("b"+card.title);
		else card.hide();

		if(this.cardStack.length==0){
			depletedStacks++;
			if(!fromServer){
				if((card.title=="province"&&this.cardStack.length==0)||
					depletedStacks==3){
					ended=true;
				}
			}
		}
		
		return card;
	}



	this.gain = function(free){
		//do text//
		var card = this.remove();
		discard.push(card);
		if(!free){
			infoPanel.addData(InfoPanelStatics.coins, -card.cost);
			infoPanel.addData(InfoPanelStatics.buys, -1);
		}
		log.addLine(username+(free?" gains ":" buys ")+card.title);
		card.setState(CardStates.discard);
		player.updatePanel();
		if(ended){
			gameEnd();
		}
	}

	

	this.text = game.add.bitmapText(0, y+5, 'silkscreen', "["+this.numCards+"]", 16); 
	this.text.tint=c_light;
	
	this.setupTextPosition();

	this.clicker= game.add.sprite(x, y, "invisiblecard");

	this.clicker.inputEnabled = true;
    this.clicker.events.onInputDown.add(click, this);


	

	
	// this.buttonText.x=Math.round(this.buttonBase.width/2-this.buttonText.textWidth/2);
	// this.buttonText.y=Math.round(this.buttonBase.height/2-this.buttonText.textHeight/2-1);
}