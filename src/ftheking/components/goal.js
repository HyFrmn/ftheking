define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('goal', {
			init: function(entity, data){
				this._super(entity, data);
				this._nextLevel = data.level || null;
			},
			register: function(state){
				this._super(state);
				this.on('contact.start', this.contact);
			},
			deregister: function(){
				this.on('contact.start', this.contact);
			},
			contact: function(e){
				if (e==this.state.pc){
					if (this._nextLevel){
						this.state.changeLevel(this._nextLevel)
					} else {
						this.state.winGame();
					}
				}
			}
		});		
	}
)