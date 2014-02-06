define([
	'sge'
	], function(sge){
		var PlayerHUD = sge.Class.extend({
			init: function(state){
				this.pc = null;
				this.state = state;
				this.game = state.game;
				this.points = 0;
				this.container = new PIXI.DisplayObjectContainer();
				this.state.containers.hud.addChild(this.container)
			},
			createDisplay: function(container){
				this._pointsText = new PIXI.BitmapText('Points: 0000', {font: '32px marker_pink'});
				this.container.addChild(this._pointsText);
				this._pointsText.position.y = 20;
				this._pointsText.position.x = this.state.game.renderer.width - this._pointsText.width - 40;
				this._pointsText.setText('Points: ' + this.game.data.points);
			},
			addPoints: function(points){
				this.game.data.points += points;
				this._pointsText.setText('Points: ' + this.game.data.points)
			}
		})

		return PlayerHUD
	}
)