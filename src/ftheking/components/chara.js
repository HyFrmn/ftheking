define([
	'sge',
	'../component'
	], function(sge, Component){
		var CharaComponent = Component.add('chara', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('sprite.frame', 0);
				this.set('movement.vx', 0);
				this.set('movement.vy', 0);
				this.set('movement.speed', 140);
				this.set('movement.dir', 1);
				this.set('chara.health', 2);
				this._state = 'idle';
			},
			setState: function(state){
				this._state = state;
			},
			resetState : function(){
				this._state = 'idle'
			},
			setDirection: function(dir){
				if (this.get('chara.dir')!=dir){
					this.set('chara.dir', dir)
				}
			},
			tick: function(delta){
				
				if (this.get('movement.vx')<0){
					this.set('sprite.scalex', -4);
					this.set('movement.dir', -1);

				}

				if (this.get('movement.vx')>0){
					this.set('sprite.scalex', 4);
					this.set('movement.dir', 1);
				}

				if (this._state=='attack'){

				} else {
					if (this.get('movement.vx')!=0 && this.entity.physics.grounded){
						this.entity.anim.setAnim('walk');
					} else {
						this.entity.anim.setAnim('idle');
					}
				}
				/*
				if (this.get('movement.vy')<0){
					this.setDirection('up');
				}

				if (this.get('movement.vy')>0){
					this.setDirection('down');
				}

				if (this.get('movement.vx')!=0||this.get('movement.vy')!=0){
					this.setAnim('walk_' + this.get('chara.dir'));
				} else {
					this.setAnim('stand_' + this.get('chara.dir'));
				}
				*/
				this.set('physics.vx', this.get('movement.speed') * this.get('movement.vx'));
			}
		});
	}
)