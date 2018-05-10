
/** @namespace */
var Life = Life || {};

Life.config = {
	loopInterval: 41,
	timeSpeed: 1.0,
	temperature: 310, // ° Kelvin,
	potentialConstant: -0.00019842, // ("perfect gas constant" * "ln to log conversion") / "Faraday constant" = (8.3145 * 2.302586641) / 96485
	intra: {
		K: 140,
		Na: 14,
		Cl: 14,
		Ca: 0.0004,
		A: 125 // Organic anions
	},
	extra: {
		K: 5,
		Na: 140,
		Cl: 147,
		Ca: 1,
		A: 0
	},
	valence: {
		K: 1,
		Na: 1,
		Cl: -1,
		Ca: 2
	},
	potentialProximity: 12
}
