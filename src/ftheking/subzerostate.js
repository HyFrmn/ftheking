define([
		'sge',
		'./tilemap',
		'./tiledlevel',
		'./entity',
		'./physics',
		'./factory',
		'./social',
		'./ai',
		'./hud',
		'./filters/camera'
	], function(sge, TileMap, TiledLevel, Entity, Physics, Factory, Social, AI, HUD){
		var SubzeroState = sge.GameState.extend({
			init: function(game){
				this._super(game);
				this._entities = {};
				this._entity_ids = [];
				this._entity_name = {};
				this._lives = 3;
				this._points = 0;
				this._entity_spatial_hash = {}
				this._unspawnedEntities={}
				this._killList = [];

				this.stage = new PIXI.Stage(0xD5F5F3);
				this.container = new PIXI.DisplayObjectContainer();
				this._scale = 1;
				
				this.container.scale.x *= this._scale;
				this.container.scale.y *= this._scale
				this.containers={};
				this.containers.entities = new PIXI.DisplayObjectContainer();
				this.containers.map = new PIXI.DisplayObjectContainer();
				this.containers.overhead = new PIXI.DisplayObjectContainer();
				this.containers.underfoot = new PIXI.DisplayObjectContainer();
				this.containers.glow = new PIXI.DisplayObjectContainer();
				this.containers.hud = new PIXI.DisplayObjectContainer();
				this.container.addChild(this.containers.map);
				this.container.addChild(this.containers.hud);

				this.curtain = new PIXI.Graphics();
				//*
				this.curtain.beginFill('0x000000');
				this.curtain.drawRect(0,0,game.width*this._scale, game.height*this._scale);
				this.curtain.endFill();
				//*/
				this.container.addChild(this.curtain);
				
				this.physics = new Physics();
				this.factory = Factory;
				this.social = new Social();
				this.hud = new HUD(this);
				game.loader.loadJSON('content/levels/' + this.game.data.map + '.json').then(function(data){
					this.loadLevelData(data);
				}.bind(this))
			},
			winGame: function(){
				this.game.changeState('win');
			},
			openInventory: function(){
				this.game.getState('inventory').createMenu(this.getEntity('pc'));
				this.game.changeState('inventory');
			},
			swapInventory: function(a, b){
				this.game.getState('swap').createMenu(a, b);
				this.game.changeState('swap');
			},
			loseGame: function(){
				this.game.changeState('lose');
			},
			startCutscene: function(options){
				if (options.dialog){
					var cutscene = this.game.getState('cutscene');
					cutscene.startDialog(options.dialog);
				} else {
					this.game.changeState('cutscene');
				}
			},
			addPoints : function(points){
				this.hud.addPoints(points)
			},
			loadLevelData : function(levelData){
				this.stage.addChild(this.container);
				this.map = new TileMap(levelData.width, levelData.height, this.game.renderer);
				TiledLevel(this, this.map, levelData).then(function(){
					this.social.setMap(this.map);
					this.map.preRender();
					this.physics.setMap(this);
					var loader = this.game.loader;
					loader.loadJS('content/levels/' + this.game.data.map + '.js', null, {state : this}).then(this.loadLevelEvents.bind(this), this.initGame.bind(this));
				}.bind(this), 500);
			},
			loadLevelEvents: function(sandbox){
				sandbox();
				this.initGame();
			},
			changeLevel: function(map, location){
				this.game.changeState('load');
				//TODO: MOVE TO PERSIST SYSTEM (CurrentGame? Story? SavedGame?);
				this.game.data.persist.maps[this.game.data.map] = {
					entities: {}
				}
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					this._entities[this._entity_ids[i]].trigger('persist');
				}
				this.game.data.map = map;
				this.game.data.spawn = location;
				this.game.createState('game');
			},
			initGame: function(){
				var pc = this.getEntity('pc');
				this.pc = pc;
				if (this.pc){
					this.pc.on('entity.killed', this.spawnPlayer.bind(this));
					if (this.game.data.spawn){
						var spawnEntity = this.getEntity(this.game.data.spawn);
						this.pc.set('xform.tx', spawnEntity.get('xform.tx'));
						this.pc.set('xform.ty', spawnEntity.get('xform.ty'));
					} else {
						this._spawnPoint = [this.pc.get('xform.tx'),this.pc.get('xform.ty')];
					}
				}
			
				var names = Object.keys(this.game.data.persist.entities);
				for (var i = names.length - 1; i >= 0; i--) {
					var name = names[i];
					var data = this.game.data.persist.entities[name];
					var entity = this.getEntity(name);
					if (entity){
						var attrs = Object.keys(data);
						for (var j = attrs.length - 1; j >= 0; j--) {
							entity.set(attrs[j], data[attrs[j]]);
						}
					}
				};

				var mapData = this.game.data.persist.maps[this.game.data.map];
				if (mapData){
					var names = Object.keys(mapData.entities);
					for (var i = names.length - 1; i >= 0; i--) {
						var name = names[i];
						var data = mapData.entities[name];
						var entity = this.getEntity(name);
						if (entity){
							var attrs = Object.keys(data);
							for (var j = attrs.length - 1; j >= 0; j--) {
								entity.set(attrs[j], data[attrs[j]]);
							}
						}
					}
				}

				this.containers.map.addChild(this.map.container);
				this.containers.map.addChild(this.containers.underfoot);
				this.containers.map.addChild(this.containers.entities);
				
				this.containers.map.position.x = 0;
				this.containers.map.position.y = 0;
				
				//if @DEBUG
				console.log('Starting Game')
				//endif
				
				this.hud.createDisplay(this.containers.hud);
				this.game.getState('load').ready('game');
				TweenLite.to(this.curtain, 1, {alpha: 0, delay:1, onComplete: function(){
					//if @DEBUG
					console.log('Game Started')
					//endif
					this.container.removeChild(this.curtain);
					}.bind(this)
				});
				

			},
			spawnPlayer : function(){
				this.pc = null;
				this.createTimeout(function(){
					if (!this.getEntity('pc')){
						this._lives--;
						if (this._lives>0){
							pc = this.factory.create('pc', {xform: {tx: this._spawnPoint[0], ty: this._spawnPoint[1]}});
							pc.name = 'pc'
							this.addEntity(pc);
							pc.tags.push('pc');
							this.pc = pc;
							this.pc.on('entity.killed', this.spawnPlayer.bind(this));
						} else {
							this.loseGame();
						}
					}
				}.bind(this), 1)
			},
			killEntity: function(e){
				this._killList.push(e);
				e.trigger('entity.killed');
			},
			pruneEntities: function(){
				this._killList.forEach(this.removeEntity.bind(this));
				this._killList =[ ];
			},
			tick: function(delta){
			    this._super(delta);
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.tick(delta);
					if (e.get('xform.ty')>this.map.height*this.map.tileSize){
						this.killEntity(e);
					}
				}
				this.physics.tick(delta);

				this.pruneEntities();
				if (this.pc){
					var pcx = -this.pc.get('xform.tx')+this.game.width/(2*this._scale);
					var pcy = -this.pc.get('xform.ty')+this.game.height/(2*this._scale);
					var maxy = -(this.map.height * this.map.tileSize) + (this.game.renderer.height*this._scale);
					this.containers.map.position.x = Math.min(0, pcx);
					this.containers.map.position.y = Math.max(maxy, Math.min(0, pcy));
				}	
				this.map.render(-this.containers.map.position.x, -this.containers.map.position.y);
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.render();
				};
				this.spriteSort(this.containers.entities);
			},

			spriteSort: function(parent) {
				var sortMe = parent.children;
			    for (var i = 0, j, tmp; i < sortMe.length; ++i) {
			      tmp = sortMe[i];
			      for (j = i - 1; j >= 0 && sortMe[j].position.y > tmp.position.y; --j)
			         parent.swapChildren(sortMe[j + 1], sortMe[j]);

			      sortMe[j + 1] = tmp;
			   }
			},

			render: function(){
				this.game.renderer.render(this.stage);
			},

			addEntity : function(e){
				var id = 0;
				while (this._entities[id]!==undefined){
					id++;
				}
				e.id = id;
				this._entity_ids.push(e.id);
				this._entities[e.id] = e;
				e.register(this);

				tx = e.get('xform.tx');
				ty = e.get('xform.ty');
				e.on('entity.moved', this._updateHash.bind(this));
				this._updateHash(e, tx, ty);
				if (e.name){
					this._entity_name[e.name] = e;
				}
				return e;
			},
			
			removeEntity: function(e){
				e.deregister(this);
				var id = e.id;
				var idx = this._entity_ids.indexOf(id);
				this._entity_ids.splice(idx,1);
				tile = e.get('map.tile');
				if (tile){
					idx = tile.data.entities.indexOf(e);
					tile.data.entities.splice(idx, 1);
				}
				delete this._entity_name[e.name];
				e.id = null;
				delete this._entities[id];
			},

			_updateHash: function(e, tx, ty){
				if (!e){
					return;
				}
				var hx = Math.floor(tx/this.map.tileSize);
				var hy = Math.floor(ty/this.map.tileSize);
				var hash = e.get('map.hash');
				var tile = null;
				
				if (hash != hx + '.' + hy){
					
					tile = e.get('map.tile');
					if (tile){
						idx = tile.data.entities.indexOf(e);
						tile.data.entities.splice(idx, 1);
					}
					e.set('map.hash', hx + '.' + hy)
					tile = this.map.getTile(hx, hy);
					if (tile){
						e.set('map.tile', tile);
						if (tile.data.entities==undefined){
							tile.data.entities=[];
						}
						tile.data.entities.push(e);
					}	
				}
			},
			
			findEntities: function(tx, ty, radius){
				var hx = Math.floor(tx/this.map.tileSize);
				var hy = Math.floor(ty/this.map.tileSize);
				var tileRad = Math.max(Math.ceil(radius/this.map.tileSize),1);
				var sqrRad = (radius*radius);
				var tile = null;
				var entities = [];
				var dx, dy, es;
				for (var j=hx-tileRad;j<tileRad+1+hx;j++){
					for(var k=hy-tileRad;k<tileRad+1+hy;k++){
						tile = this.map.getTile(j,k);
						if (tile){
							es = (tile.data.entities || []).filter(function(e){
								dx = (e.get('xform.tx')-tx);
								dy = (e.get('xform.ty')-ty);
								e._findDist = (dx*dx)+(dy*dy);
								return ((dx*dx)+(dy*dy)<=sqrRad && e.id!=null);
							});
							if (es){
								entities = entities.concat(es);
							}
						}
					}
				}
				return entities;
			},
			
			getEntity: function(name){
				return this._entity_name[name.replace(/@/,'')];
			},
			
			getEntities: function(query){

			},

			get: function(path){
				return this.game.data.persist.vars[path];
			},

			set: function(path, value){
				return this.game.data.persist.vars[path]=value;
			},
			startState: function(){
				window.onblur = function(){
					if (this.game._currentState==this){
	                    this.game.changeState('paused')
	                }
                }.bind(this);
			},
			endState: function(){
				//window.onblue = null;
			}
		})

		return SubzeroState
	}
)