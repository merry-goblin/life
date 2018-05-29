/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.NeuronManager = function() {

		/*** Private properties ***/

		var nScope = null;
		var newPspIndexes = null; // List of postsynaptic potential indexes to test proximity with others postsynatpic potentials

		/*** Private methods ***/

		function consumeActivations() {

			for (var key in nScope.neuron.synapses) {
				life.synapseHandler.consumeActivation(nScope.neuron.synapses[key]);
			}
		}

		function checkNewPostsynapticPotentials(timePassed) {

			var pspList = nScope.neuron.postsynapticPotentials;
			var pspIndexListToIgnore = new Array();
			var pspToMerge = new Array();

			if (newPspIndexes.length > 0) {

				//	We have to check proximity with new postsynpatic potentials created and old ones
				for (var i in newPspIndexes) {

					var currentPspIndex = newPspIndexes[i];
					for (var pspIndex in pspList) {

						//	Ignore tests already done
						if (pspIndex != currentPspIndex) {
							if (!life.utils.inArray(pspIndex, pspIndexListToIgnore)) {

								if (checkTwoPostsynapticPotentialsProximity(pspList[pspIndex], pspList[currentPspIndex])) {
									pspToMerge.push([pspIndex, currentPspIndex]);
								}
							}
						}

					}
					pspIndexListToIgnore.push(currentPspIndex);
				}
			}

			handlePostsynapticPotentialsMerging(pspToMerge);

			newPspIndexes = new Array();
		}

		function checkTwoPostsynapticPotentialsProximity(psp1, psp2) {

			var distance = Life.arithmetic.getDistanceOnOneAxis(psp1.origin, psp2.origin);
			if (distance <= life.config.potentialProximity) {
				
				return true;
			}
			return false;
		}

		function handlePostsynapticPotentialsMerging(pspIndexesToMerge) {

			let pspListToDelete = new Array();

			//	Merging
			for (let i=0, nb=pspIndexesToMerge.length; i<nb; i++) {

				//	We don't remove a postsynaptic potential twice
				if (!life.utils.inArray(pspIndexesToMerge[i][1], pspListToDelete)) {
					let psp = mergeTwoPostsynapticPotentials(pspIndexesToMerge[i][0], pspIndexesToMerge[i][1]);
					pspListToDelete.push(pspIndexesToMerge[i][1]);
				}
			}

			//	We want the last indexes to be removed before the first ones
			pspListToDelete.sort(function(a, b) {
				return (a < b) ? 1 : -1;
			});

			//	Removing
			for (let i=0, nb=pspListToDelete.length; i<nb; i++) {
			
				life.neuronHandler.remove(nScope, 'postsynaptic-potential', pspListToDelete[i]);
			}
		}

		function mergeTwoPostsynapticPotentials(psp1Index, psp2Index) {

			let pspList = nScope.neuron.postsynapticPotentials;
			let diff = pspList[psp2Index].potential - nScope.neuron.model.standByPotential;
			let middle = life.arithmetic.getMiddleOnOneAxis(pspList[psp1Index].origin, pspList[psp2Index].origin);

			//	First postsynaptic potential is modified
			pspList[psp1Index].potential += diff;
			pspList[psp1Index].origin = middle;

			//	Second is deleted
			pspList[psp2Index].delete = true;
		}

		function postsynapticPotentialsDilution(timePassed) {

			if (timePassed != 0) {

				var pspList = nScope.neuron.postsynapticPotentials;
				let standByPotential = nScope.neuron.model.standByPotential;

				//	Postsynaptic potential get closer to neuron stand by potential
				for (var pspIndex in pspList) {
					let toRemove = false;
					let potential = pspList[pspIndex].potential;
					if (potential > standByPotential) {
						potential = potential - (life.globals.potentialDilution * timePassed);
						if (potential < standByPotential) {
							potential = standByPotential;
							toRemove = true;
						}
					}
					else {
						potential = potential + (life.globals.potentialDilution * timePassed);
						if (potential > standByPotential) {
							potential = standByPotential;
							toRemove = true;
						}
					}
					pspList[pspIndex].potential = potential;

					if (toRemove) {
						life.neuronHandler.remove(nScope, 'postsynaptic-potential', pspIndex)
					}
				}
			}
		}

		var scope = {

			/*** Public methods ***/

			init: function(nScopeParam) {

				nScope = nScopeParam;
				newPspIndexes = new Array();
			},

			generatePostsynapticPotential: function(synapseKey) {

				var synapse = life.neuronHandler.get(nScope.neuron, 'synapse', synapseKey);
				postsynapticPotential = life.synapseHandler.activate(synapse);

				life.neuronHandler.add(nScope, nScope.neuron, 'postsynaptic-potential', null, postsynapticPotential);
				newPspIndexes.push(postsynapticPotential.id);
			},

			iterate: function(timePassed) {

				if (timePassed > 0) {
					consumeActivations();
					checkNewPostsynapticPotentials(timePassed);
					postsynapticPotentialsDilution(timePassed);
				}
			},

			/**
			 * Free any pointer stored in an element
			 * @return null
			 */
			destruct: function() {

				
			}
		}
		return scope;
	}

})(Life);
