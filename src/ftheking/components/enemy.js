define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('enemy', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('movement.vx', -1)
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
				this.set('movement.vx', this.get('movement.vx') * -1)
			},
			contacted: function(e){
				if (e.tags.indexOf('pc')>=0){
					this.entity.attack.attackStart();
					//e.chara.takeDamage(1);
				} else {
					this.turnaround();
				}
			},
			tick: function(){
				if (this.entity.physics.grounded){
					var testY = this.get('xform.ty') + 3;
					var tileA = this.state.map.getTileAtPos(this.get('xform.tx')-20, testY);
					if (tileA){
						if (tileA.data.passable){
							this.turnaround()
						}
					} else {
						this.turnaround();
					}

					var tileB = this.state.map.getTileAtPos(this.get('xform.tx')+20, testY);
					if (tileB){
						if (tileB.data.passable){
							this.turnaround()
						}
					} else {
						this.turnaround();
					}
				}

				/*
				var pc = this.state.getEntity('pc');
				if (pc){
					var dx = this.get('xform.tx') - pc.get('xform.tx');
					var dy = this.get('xform.ty') - pc.get('xform.ty');

					var dist = Math.sqrt((dx*dx) + (dy*dy));
					if (dist<90 && Math.random()>0.9){
						this.entity.attack.attackStart();
					}
				} 
				*/
			}
		});		
	}
)