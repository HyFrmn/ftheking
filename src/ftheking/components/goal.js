define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('goal', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this.on('contact.start',  this.contact);
			},
			deregister: function(){
				this.on('contact.start',  this.contact);
			},
			contact: function(e){
				if (e==this.state.pc){
					this.state.winGame();
				}
			}
		});		
	}
)