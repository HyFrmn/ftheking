define([
	'sge',
	'./sat'
	], function(sge, sat){
		var Physics = sge.Class.extend({
			init: function(){
				this.entities = [];
				this.map = null;
				this.gravity = 560*2;
			},
			tick: function(delta){
				this.entities.forEach(function(entity){
					this.move(entity, delta);
				}.bind(this));
				this.detectCollision();
			},
			_collisionHash: function(a, b){
				if (a.id>b.id){
					return b.id + '.' + a.id;
				} else {
					return a.id + '.' + b.id;
				}
			},
			detectCollision: function(){
				var e, ep, aRect, bRect;
				var response = new sat.Response();
				var testEntities = this.entities.filter(function(q){
					return q.get('physics.type')==0;
				});
				var testHashes = [];
				var collisionHashes = [];
				for (var i = testEntities.length - 1; i >= 0; i--) {
					e = testEntities[i];
					tx = e.get('xform.tx');
					ty = e.get('xform.ty');
					
					aRect = new sat.Box(new sat.Vector(tx+e.get('physics.offsetx'), ty+e.get('physics.offsety')), e.get('physics.width'), e.get('physics.height'));
					potential = this.state.findEntities(tx,ty, 280).filter(function(q){return q.physics!=null && q!=e});
					for (var k = potential.length - 1; k >= 0; k--) {
						var hash = this._collisionHash(e, potential[k])
						if (testHashes.indexOf(hash)<0){
							testHashes.push(hash);
							ep = potential[k];
							/*
							if (ep.get('physics.type')==2){
								continue;
							}
							*/
							bRect = new sat.Box(new sat.Vector(ep.get('xform.tx')+ep.get('physics.offsetx'),ep.get('xform.ty')+ep.get('physics.offsety')), ep.get('physics.width'), ep.get('physics.height'));
							collided = sat.testPolygonPolygon(aRect.toPolygon(), bRect.toPolygon(), response)
							if (collided){
								e.trigger('contact.start', ep);
								ep.trigger('contact.start', e);
								if (ep.get('physics.type')==2||e.get('physics.type')==2){
									//Don't resolve the collision.
								} else if (ep.get('physics.type')==1){
									this.move(e, 0, -response.overlapV.x, -response.overlapV.y);
								} else {
									this.move(e, 0, -0.5*response.overlapV.x, -0.5*response.overlapV.y);
									this.move(ep, 0, 0.5*response.overlapV.x,  0.5*response.overlapV.y);
								}
								
								response.clear();
								// @if DEBUG
								ep.set('physics.color', '0xAA0000');
								// @endif
							}
							
						}
					};
				};
			},
			move: function(entity, delta, vx, vy){
				

				if (vx==undefined){
					entity.set('physics.vy', entity.get('physics.vy') + (this.gravity * delta));
					vx = entity.get('physics.vx') * delta;
					vy = entity.get('physics.vy') * delta;
				}

				var tx = entity.get('xform.tx');
				var ty = entity.get('xform.ty');

				

				var ptx = tx + vx;
				var pty = ty + vy;
				entity.physics.grounded = false;
				if (this.map){
					var testPoints = [
							[entity.get('physics.width')/2, entity.get('physics.height')/2],
							[entity.get('physics.width')/2, -entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, -entity.get('physics.height')/2],
							[entity.get('physics.width')/2, 0],
							[-entity.get('physics.width')/2, 0]
						]
						var horzMove = true;
						var vertMove = true;
						for (var i = testPoints.length - 1; i >= 0; i--) {
							testPoints[i];
							var newTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx+entity.get('physics.offsetx'), testPoints[i][1]+vy+ty+entity.get('physics.offsety'));
							if (newTile){
							    if (!newTile.data.passable){
									if (horzMove){
									    horzTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx+entity.get('physics.offsetx'), testPoints[i][1]+ty+entity.get('physics.offsety'));
										if (horzTile){
										    if (!horzTile.data.passable){
											    horzMove=false;
											    entity.set('physics.vx', 0);
										    }
										}
									}
									if (vertMove){
									    vertTile = this.map.getTileAtPos(testPoints[i][0]+tx+entity.get('physics.offsetx'), testPoints[i][1]+vy+ty+entity.get('physics.offsety'));
										if (vertTile){
										    if (!vertTile.data.passable){
											    vertMove=false;
											    entity.set('physics.vy', 0);
											    if (vy>0){
											    	entity.physics.grounded = true;
											    	entity.set('physics.vx', entity.get('physics.vx')*0.9)
											    }
										    }
										}
									}
							    }
							}
							if (!horzMove){
								ptx=tx;
							}
							if (!vertMove){
								pty=ty;
							}
						};
						
				}
				if (tx!=ptx||ty!=pty){
					entity.trigger('entity.moved', entity, ptx, pty, ptx-tx, pty-ty);
					entity.set('xform.tx', ptx);
					entity.set('xform.ty', pty);
				}

			},
			setMap: function(state){
				this.state = state;
				this.map = state.map;
			}
		});

		return Physics;
	}
)