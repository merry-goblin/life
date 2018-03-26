
/** @namespace */
var Life = Life || {};
Life.Models = Life.Models || {};

Life.Models.neuronT1 = {
	distances: {
		dendrites: 100, // 100 microns | 0.1 millimeters
		axon: 10000
	},
	impulseSpeed: 12, // micrometers / microsecondes
	neurotransmitter: Life.Neurotransmitters.gaba, // (Produced by the neuron) In biology some neurons can produce more than one neurotransmitter. Let s keep it simple.
	channels: [
		Life.Models.channelCl1,
		Life.Models.channelK1,
		Life.Models.channelNa1
	],
	standByPotential: null
}
