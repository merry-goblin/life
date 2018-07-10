
/** @namespace */
var Life = Life || {};
Life.Models = Life.Models || {};

Life.Models.neuronT2 = {
	distances: {
		dendrites: 100, // 100 microns | 0.1 millimeters
		axon: 10000
	},
	impulseSpeed: 12, // micrometers / microsecondes
	gradient: null, // equation
	neurotransmitter: Life.neurotransmitters.glutamate,
	channels: [
		Life.Models.channelCl1,
		Life.Models.channelK1,
		Life.Models.channelNa1
	],
	standByPotential: null,
	threshold: null,
	exocytose: {
		duration: 20
	}
}
