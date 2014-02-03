define([
		'./class'
	], 
	function(Class){
		var Timeout = Class.extend({
			init: function(state, delay, callback){
				this.state = state;
				this.id = state._timeout_id++;
				this._timeout = state._time + delay;
				state._timeouts[this.id] = this;
				this.callback = callback;
			},
			check: function(){
				if (this.state._time >= this._timeout){
					this.callback();
					delete this.state._timeouts[this.id];
				}
			}
		})

		var GameState =  Class.extend({
			init: function(game, options){
				this.game = game;
				this._time = 0;
				this.input = game.input.createProxy();
				this._timeouts = {};
				this._timeout_id = 0;
			},
			startState: function(){},
			endState: function(){},
			tick: function(delta){
			    this._time += delta;
			    var ids = Object.keys(this._timeouts);
			    for (var i = ids.length - 1; i >= 0; i--) {
			    	this._timeouts[ids[i]].check();
			    }
			},
		    getTime: function(){
		        return this._time;
		    },
		    createTimeout: function(func, delay){
		    	var timeout = new Timeout(this, delay, func);
		    	return timeout;
		    }
		});



		return GameState;
	}
)