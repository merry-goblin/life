
/** @namespace */
var Life = Life || {};
Life.Models = Life.Models || {};

Life.Models.channelCl1 = {
	sensibility: {
		voltageGated: new Array(
			
		),
		neurotransmitterGated: [{
			neurotransmitters: Life.Neurotransmitters.gaba,
			permeability: 0.01
		}]
	},
	permeability: {
		default: 0.000,
		ion: "Cl",
	}
}

/*
	In order to make calculation more simple
	We allow a channel to let pass only one type of ion

	permeability: {
		default: 0.000,
		ions: ["Cl"],
		ionicCharge: {
			anion: true,
			cation: true
		}
	},
*/