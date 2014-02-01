define([
	'sge',
	'../component'
	], function(sge, Component){
		var ControlComponent = Component.add('jump', {
			init: function(entity, data){
				this._super(entity, data);
				this._jumping = false;
			},
			tick: function(){
				if (this.input.isDown('space')){
					if (this._jumping){

					} else {
						if (this.entity.physics.grounded){
							this.set('physics.vy', -900);
							this._jumping = true;
						}
					}
				} else {
					if (this._jumping){
						console.log('Stop Jumping')
						this._jumping = false;
						if (this.get('physics.vy')<0){
							this.set('physics.vy', this.get('physics.vy') * 0.33);
						}
					}
					if (this.entity.physics.grounded){
						this._jumping = false;
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