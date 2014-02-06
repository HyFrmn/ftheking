define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('swirl', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this.on('contact.start', this.contacted);
			},
			deregister: function(){
				this.off('contact.start', this.contacted)
			},
			contacted: function(e){
				if (e.tags.indexOf('pc')>=0){
					this.state.killEntity(this.entity);
					this.state.addPoints(10);
					createjs.Sound.play('pickup');
				}
			},
		});		
	}
)