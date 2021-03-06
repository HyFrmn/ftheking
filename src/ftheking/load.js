define([
        'sge',
        './config'
    ], function(sge, config){
    	var LoadState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x000000);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                
                this.text = new PIXI.BitmapText('Loading', {font: '96px 8bit', align: 'center'});
                this.text.alpha = 1;
                this.text.position.x = game.renderer.width / 2 - (this.text.width/2);
                this.text.position.y = game.renderer.height / 2 - 96;
                this.container.addChild(this.text);

                this.stage.addChild(this.container);
            },
            render: function(){
                this.game.renderer.render(this.stage);
            },
            ready: function(stateName){
                TweenLite.to(this.text, 1, {alpha: 0, onComplete:
                    function(){
                        this.game.changeState(stateName);
                    }.bind(this)

                })
            },
            startState: function(){
                TweenLite.to(this.text, 1, {alpha: 1})
            }
        });
		return LoadState;
	}
)