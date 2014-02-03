require.config({
	baseUrl: 'src',
	packages: ['sge', 'ftheking'],

})
define([
		'sge','ftheking'
	], function(sge, ftheking){
		function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        }

		var options = {
            debug: {
                drawSocial: getURLParameter('debug-social') || false,
                map: getURLParameter('debug-map') || 'test',
            },
            //TODO: Move to SaveGame
            persist: {
                vars: {},
                entities: {},
                maps: {}
            },
            points: 0,
            map: getURLParameter('debug-map') || 'level1',
        }
        PIXI.BaseTexture.SCALE_MODE.DEFAULT = PIXI.BaseTexture.SCALE_MODE.NEAREST;
		ftheking.createGame(options);
	}
)