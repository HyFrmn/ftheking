define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('anim', {
			init: function(entity, data){
				this._super(entity, data);
				this._tracks = data.tracks;
				this._current = null;
				this._currentTrack = null
				this._index=0;
				this._animTimeout = 0;
			},
			register: function(state){
				this._super(state);
				this.on('anim.set', this.setAnim);
			},
			deregister: function(state){
				this._super(state);
				this.off('anim.set', this.setAnim);
			},
			setAnim: function(anim){
				if (this._current!=anim){
					this._current=anim;
					this._currentTrack = this._tracks[anim];
					this._index = 0;
					this.set('sprite.frame', this._currentTrack.frames[this._index]);
					this._animTimeout=1/15;
				}
				
			},
			tick: function(delta){
				if (this._currentTrack!=null){
					this._animTimeout-=delta;
					if (this._animTimeout<=0){
						this._animTimeout=1/15;
						this._index++;
						if (this._index>=this._currentTrack.frames.length){
							if (this._currentTrack.once){
								this._index=0;
								this._currentTrack = this._current = null;
								this.entity.trigger('anim.done');
								this.setAnim('idle');
								return;
							} else {
								this._index = 0;
							}
						}
						this.set('sprite.frame', this._currentTrack.frames[this._index]);
					}
				}
				
			}
		});		
	}
)