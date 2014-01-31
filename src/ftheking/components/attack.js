define([
	'sge',
	'../component',
	'../sat'
	], function(sge, Component, sat){
		Component.add('attack', {
			init: function(entity, data){
				this._super(entity, data);
			},
			attackStart: function(){
				this.entity.chara.setState('attack');
				this.entity.anim.setAnim('attack');
				this.on('anim.done', this.attackEnd, {once: true})
				var entities = this.state.findEntities(this.get('xform.tx'), this.get('xform.ty'), 140).filter(function(e){
					return e!=this.entity;
				}.bind(this));
				var response = new sat.Response();
				var hitbox = new sat.Box(new sat.Vector(this.get('xform.tx')-140,this.get('xform.ty')-105), 140, 140);
				if (this.get('movement.dir')>0){
					hitbox = new sat.Box(new sat.Vector(this.get('xform.tx'),this.get('xform.ty')-105), 140, 140);
				}
				
				for (var i = entities.length - 1; i >= 0; i--) {
					var ep = entities[i];
					var bRect = new sat.Box(new sat.Vector(ep.get('xform.tx')+ep.get('physics.offsetx'),ep.get('xform.ty')+ep.get('physics.offsety')), ep.get('physics.width'), ep.get('physics.height'));
					collided = sat.testPolygonPolygon(hitbox.toPolygon(), bRect.toPolygon(), response);
					if (collided){
						if (this.get('movement.dir')>0){
							ep.set('physics.vx', 100)
						} else {
							ep.set('physics.vx', -100)
						}
						ep.set('physics.vy', -100)
						ep.set('chara.health', ep.get('chara.health')-1);
						console.log('Health',ep.get('chara.health') )
						if (ep.get('chara.health')<=0){
							this.state.removeEntity(ep);
						}
						response.clear();
					}

				};
			},
			attackEnd: function(){
				this.entity.chara.resetState();
			}
		});		
	}
)