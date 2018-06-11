
/** @namespace */
var Life = Life || {};
Life.Models = Life.Models || {};

Life.Models.channelNa1 = {
	sensibility: {
		voltageGated: [{
			threshold: 0.06,
			permeability: 0.8
		}],
		neurotransmitterGated: []
	},
	permeability: {
		default: 0.001,
		ion: "Na"
	}
}
