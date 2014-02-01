define([
	'sge',
	'../component'
	], function(sge, Component){
		var ControlComponent = Component.add('controls', {
			init: function(entity, data){
				this._super(entity, data);
			},
			tick: function(){
				var dpad = this.input.dpad();
				this.set('movement.vx', dpad[0]);
				this.set('movement.vy', dpad[1]);

				if (this.input.isDown('Z')){
					this.set('movement.vx', dpad[0]*2);
				}

				if (this.input.isPressed('X')){
					this.entity.attack.attackStart();	
				}

				if (this.input.isPressed('enter')){
					this.entity.trigger('interact');
				}
				/*
				if (this.get('movement.vx')!=0 && this.entity.physics.grounded){
					this.entity.anim._defaultAnim = 'walk'
				} else {
					this.entity.anim._defaultAnim = 'idle'
				}
				*/
				
			},
			register: function(state){
				this._super(state);
				this.input = state.input;
			}
		});
	}
)