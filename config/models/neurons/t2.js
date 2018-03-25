
/** @namespace */
var Life = Life || {};
Life.Models = Life.Models || {};

Life.Models.neuronT2 = {
	distances: {
		dendrites: 100, // 100 microns | 0.1 millimeters
		axon: 10000
	},
	impulseSpeed: 12, // micrometers / microsecondes
	neurotransmitter: Life.Neurotransmitters.glutamate
}