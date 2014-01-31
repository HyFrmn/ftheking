define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('enemy', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('movement.vx', -1)
			}
		});		
	}
)