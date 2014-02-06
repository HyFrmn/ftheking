define([
        'sge',
        './config'
    ], function(sge, config){
    	var MenuState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x000000);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                //this.container.scale.x= window.innerWidth / game.width;
                //this.container.scale.y= window.innerHeight / game.height;
            
                /*
                this.background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
                this.background.alpha = 0;
                this.container.addChild(this.background);
                */
               
                this.text = new PIXI.BitmapText('F The King', {font: '96px marker_pink', align: 'center'});
                this.text.position.x = game.renderer.width * 0.5 - (this.text.width * 0.5);
                this.text.position.y = game.renderer.height / 2 - 96;
                this.text.alpha = 0;
                this.container.addChild(this.text);

                this.subtitle = new PIXI.BitmapText('The Saga to Defend Candy', {font: '48px marker_pink', align: 'center'});
                this.subtitle.position.x = game.renderer.width * 0.5 - (this.subtitle.width * 0.5);
                this.subtitle.position.y = (game.renderer.height / 2) + 12;
                this.subtitle.alpha = 0;
                this.container.addChild(this.subtitle);

                this.instructions = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
                this.instructions.position.y = game.renderer.height - 64;
                this.instructions.position.x = 64;
                this.instructions.alpha = 0;
                this.container.addChild(this.instructions);

                this.stage.addChild(this.container);
            },
            tick: function(){
                if (this.input.isPressed('space')){
                    this.game.data.points = 0;
                    this.game.data.map = 'level1';
                    TweenLite.to(this.container, 1, {alpha: 0, onComplete: function(){
                        this.game.createState('game');
                        this.game.changeState('load');
                    }.bind(this)});
                    return;
                }
            },
            render: function(){
                this.game.renderer.render(this.stage);
            },
            startState: function(){
                this.container.alpha = 1;
                this.subtitle.alpha = 0;
                this.text.alpha = 0;
                this.instructions.alpha = 0;
                var tl = new TimelineLite();
                //tl.add(TweenLite.to(this.background, 1, {alpha: 1}));
                tl.add(TweenLite.to(this.text, 1, {alpha: 1}));
                tl.add(TweenLite.to(this.subtitle, 1, {alpha: 1}));
                tl.add(TweenLite.to(this.instructions, 1, {alpha: 1}));
            }
        });
		return MenuState;
	}
)