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
				this.set('movement.speed', data.speed || 90);
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
			takeDamage: function(amount){
				var health = this.get('chara.health');
				var new_health = health - amount;
				if (new_health < 0){
					this.state.killEntity(this.entity);
				}
				this.set('chara.health', new_health);
			},
			tick: function(delta){
				
				if (this.get('movement.vx')<0){
					this.set('sprite.scalex', -2);
					this.set('movement.dir', -1);

				}

				if (this.get('movement.vx')>0){
					this.set('sprite.scalex', 2);
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
				
			}
		});
	}
)