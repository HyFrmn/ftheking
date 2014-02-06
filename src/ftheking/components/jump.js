define([
	'sge',
	'../component'
	], function(sge, Component){
		var ControlComponent = Component.add('jump', {
			init: function(entity, data){
				this._super(entity, data);
				this._jumping = false;
				this._double = false;
				this._doubleSet = false;
				this._jumpHeight = 350;
			},
			tick: function(){
				if (this.input.isDown('space')){
					if (this._jumping){
						if (this._doubleSet && !this._double){
							this._double = true;
							this.set('physics.vy', -this._jumpHeight*1.5);
							createjs.Sound.play('jump');
						}
					} else {
						if (this.entity.physics.grounded){
							this.set('physics.vy', -this._jumpHeight);
							this._jumping = true;
							this._doubleSet = false;
							createjs.Sound.play('jump');
						}
					}
				} else {
					if (this._jumping){
						this._doubleSet = true;
						if (this.get('physics.vy')<0){
							this.set('physics.vy', this.get('physics.vy') * 0.16);
						}
					}
					if (this.entity.physics.grounded){
						this._jumping = false;
						this._double = false;
						this._doubleSet = true;
					}
				}

			},
			register: function(state){
				this._super(state);
				this.input = state.input;
			}
		});
	}
)