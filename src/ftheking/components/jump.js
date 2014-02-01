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
			},
			tick: function(){
				if (this.input.isDown('space')){
					if (this._jumping){
						if (this._doubleSet && !this._double){
							console.log('Double!!')
							this._double = true;
							this.set('physics.vy', -700);
						}
					} else {
						if (this.entity.physics.grounded){
							this.set('physics.vy', -700);
							this._jumping = true;
							this._doubleSet = false;
						}
					}
				} else {
					if (this._jumping){
						console.log('Stop Jumping')
						this._doubleSet = true;
						if (this.get('physics.vy')<0){
							this.set('physics.vy', this.get('physics.vy') * 0.33);
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