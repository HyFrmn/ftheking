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
				this.entity.anim.setAnim('attack', true);
				this.on('anim.done', this.attackEnd, {once: true})
				var entities = this.state.findEntities(this.get('xform.tx'), this.get('xform.ty'), 140).filter(function(e){
					return e!=this.entity;
				}.bind(this));
				var response = new sat.Response();
				var hitbox = new sat.Box(new sat.Vector(this.get('xform.tx'),this.get('xform.ty')-32), 64, 32);
				var gfx = new PIXI.Graphics();
				gfx.beginFill(0x00F900);
				gfx.drawRect(0,0,64,32);
				gfx.position.x = this.get('xform.tx');
				gfx.position.y = this.get('xform.ty')-32;
				if (this.get('movement.dir')<0){
					gfx.position.x = this.get('xform.tx')-64;
					hitbox = new sat.Box(new sat.Vector(this.get('xform.tx')-64,this.get('xform.ty')-32), 64, 32);
				}
				//this.state.containers.entities.addChild(gfx);
				for (var i = entities.length - 1; i >= 0; i--) {
					var ep = entities[i];
					var bRect = new sat.Box(new sat.Vector(ep.get('xform.tx')+ep.get('physics.offsetx'),ep.get('xform.ty')+ep.get('physics.offsety')), ep.get('physics.width'), ep.get('physics.height'));
					collided = sat.testPolygonPolygon(hitbox.toPolygon(), bRect.toPolygon(), response);
					if (collided){
						if (this.get('movement.dir')<0){
							ep.set('physics.vx', -50)
						} else {
							ep.set('physics.vx', 50)
						}
						ep.set('physics.vy', -200)
						ep.chara.takeDamage(1)
					}
				};
			},
			attackEnd: function(){
				this.entity.chara.resetState();
			}
		});		
	}
)