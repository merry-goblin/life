
/** @namespace */
var Life = Life || {};
Life.Models = Life.Models || {};

Life.Models.channelK1 = {
	sensibility: {
		voltageGated: [],
		neurotransmitterGated: [{
			neurotransmitter: Life.neurotransmitters.glutamate,
			permeability: 0.2
		}]
	},
	permeability: {
		default: 0.05,
		ion: "K"
	}
}
