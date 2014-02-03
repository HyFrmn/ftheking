define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('physics', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('physics.type', data.type!=undefined ? data.type : 0);
				this.set('physics.width', data.width || 24);
				this.set('physics.height', data.height || 24);
				this.set('physics.offsetx', data.offsetx || 0);
				this.set('physics.offsety', data.offsety || 0);
				this.set('physics.vx', 0);
				this.set('physics.vy', 0);
				// @if DEBUG
				this.set('physics.color', '0x00AA00')
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.indicater.beginFill('0xAA0000');
				this.indicater.drawRect(0, 0, this.get('physics.width'), this.get('physics.height'));
				this.indicater.endFill();
				// @endif
				
			},
			register: function(state){
				this._super(state);
				if (this.get('physics.type')==0){
				    state.physics.entities.push(this.entity);   
				}
				// @if DEBUG
				this.state.containers.underfoot.addChild(this.indicater);
				// @endif
			},
			deregister: function(state){
				// @if DEBUG
				this.state.containers.underfoot.removeChild(this.indicater);
				// @endif
				
				idx = this.state.physics.entities.indexOf(this.entity);
				if (idx>=0){
				    this.state.physics.entities.splice(idx, 1);
				}
			},
			// @if DEBUG
			render: function(){
				this.indicater.clear()
				this.indicater.alpha = 0.65;
				this.indicater.beginFill(this.get('physics.color'));
				this.indicater.drawRect(0, 0, this.get('physics.width'), this.get('physics.height'));
				this.indicater.endFill();
				this.indicater.position.x = this.get('xform.tx')+this.get('physics.offsetx')-(this.get('physics.width')/2);
				this.indicater.position.y = this.get('xform.ty')+this.get('physics.offsety')-(this.get('physics.height')/2);
			
			}
			// @endif
		});		
	}
)