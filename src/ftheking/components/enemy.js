define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('enemy', {
			init: function(entity, data){
				this._super(entity, data);
				this._speed = 30;
				this.set('physics.vx', this._speed);
			},
			register: function(state){
				this._super(state);
				this.on('contact.start', this.contacted);
				this.on('contact.wall', this.turnaround);
			},
			deregister: function(){
				this.off('contact.start', this.contacted);
			},
			turnaround: function(){
				this.set('movement.dir', this.get('movement.dir') * -1)
				this.set('sprite.scalex', this.get('movement.dir') * 2);
			},
			contacted: function(e){
				if (e.tags.indexOf('pc')>=0){
					this.entity.attack.attackStart();
					//e.chara.takeDamage(1);
				} else {
					this.turnaround();
				}
			},
			tick: function(delta){
				if (this.entity.physics.grounded){
					vx=this.get('physics.vx');
					if (vx!=0){
							var testY = this.get('xform.ty') + 3;
							var testTile = this.state.map.getTileAtPos(this.get('xform.tx')+(this.get('physics.width')/2*this.get('movement.dir')), testY);
							if (testTile){
								if (testTile.data.passable){
									this.turnaround()
								}
							} else {
								this.turnaround();
							}
						
					}
					this.set('physics.vx', this._speed * this.get('movement.dir'))
				}

				//*
				var pc = this.state.getEntity('pc');
				if (pc){
					var dx = this.get('xform.tx') - pc.get('xform.tx');
					var dy = this.get('xform.ty') - pc.get('xform.ty');

					var dist = Math.sqrt((dx*dx) + (dy*dy));
					if (dist<16 && Math.random()>0.9){
						this.entity.attack.attackStart();
					}
				} 
				//*/
			}
		});		
	}
)