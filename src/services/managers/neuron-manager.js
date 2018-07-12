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

		function consumeExocytoses(time, timePassed) {

			for (let key in nScope.neuron.synapses) {

				let synapse = nScope.neuron.synapses[key];

				let bindingExocytoses = life.synapseHandler.consumeExocytoses(synapse, timePassed);
				for (let index in bindingExocytoses) {

					let exocytose = bindingExocytoses[index];
					nScope.services.synapseListener.binding(synapse.id, exocytose.id);
				}
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
					//	newPspIndexes is not reliable
					if (pspList[currentPspIndex] == undefined) {
						delete pspList[currentPspIndex];
						continue;
					}

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
					if (!pspList[pspIndex].new) {
						//	First iteration is ignore (no dilution)
						pspList[pspIndex].new = true;
						continue;
					}
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
						life.neuronHandler.remove(nScope, 'postsynaptic-potential', pspIndex);
					}
				}
			}
		}

		/**
		 * We check each postsynaptic potentials in order to see 
		 * if we have to replace them by an action potential
		 * 
		 * @param  integer timePassed
		 * @return null
		 */
		function checkNewActionPotentials(time, timePassed) {

			if (timePassed != 0) {

				let threshold = nScope.neuron.model.threshold;
				let pspList = nScope.neuron.postsynapticPotentials;

				for (let pspIndex in pspList) {
					let psp = pspList[pspIndex];
					//	todo : this test is too much simplified ... should be a range test instead
					if (psp.potential > threshold) {
						convertPostSynapticPotentialToActionPotential(psp, time, timePassed);
					}
				}
			}
		}

		function convertPostSynapticPotentialToActionPotential(psp, time, timePassed) {

			//	Add an action potential
			let actionPotentialRight = life.actionPotentialHandler.build(nScope, psp.origin, time, 1);
			let actionPotentialLeft = life.actionPotentialHandler.build(nScope, psp.origin, time, -1);

			life.neuronHandler.add(nScope, nScope.neuron, 'action-potential', null, actionPotentialRight);
			life.neuronHandler.add(nScope, nScope.neuron, 'action-potential', null, actionPotentialLeft);

			//	Remove a postsynaptic pontential
			life.neuronHandler.remove(nScope, 'postsynaptic-potential', psp.id);
		}

		function checkActionPotentialCollisions(time, timePassed) {

			if (timePassed != 0) {
				let apList = nScope.neuron.actionPotentials;
				let pspList = nScope.neuron.postsynapticPotentials;
				let ignoreList = [];

				for (let apIndex in apList) {
					let endThisIteration = false;
					ignoreList.push(apIndex);

					//	Action potentials
					for (let apIndex2 in apList) {
						//	We don't check an action potential twice
						if (!life.utils.inArray(apIndex2, ignoreList)) {
							let isCollided = checkCollisionBetweenTwoActionPotentials(time, timePassed, apList[apIndex], apList[apIndex2]);
							if (isCollided) {
								life.neuronHandler.remove(nScope, 'action-potential', apIndex);
								life.neuronHandler.remove(nScope, 'action-potential', apIndex2);
								ignoreList.push(apIndex);
								ignoreList.push(apIndex2);
								endThisIteration = true;
								break;
							}
						}
					}

					if (endThisIteration) {
						continue;
					}

					//	Postsynaptic potentials
					for (let pspIndex in pspList) {
						let isCollided = checkCollisionBetweenActionPotentialAndPostsynapticPotential(time, timePassed, apList[apIndex], pspList[pspIndex]);
						if (isCollided) {
							life.neuronHandler.remove(nScope, 'postsynaptic-potential', pspIndex);
						}
					}
				}
			}
		}

		function checkCollisionBetweenTwoActionPotentials(time, timePassed, ap1, ap2) {

			let isCollided = false;
			let intersection = life.analyticGeometry.intersectionOfLines(ap1.a, ap1.b, ap2.a, ap2.b);

			if (intersection !== false) {
				if (intersection.y > time && intersection.y <= (time+timePassed)) {
					isCollided = true;
				}
			}

			return isCollided;
		}

		function checkCollisionBetweenActionPotentialAndPostsynapticPotential(time, timePassed, ap, psp) {

			let isCollided = true;
			let radius = life.config.potentialProximity;
			let intersection = life.analyticGeometry.intersectionOfLineInRange(ap.a, ap.b, psp.origin - radius, psp.origin + radius);

			let end = time + timePassed;
			if ((time <= intersection.y1 && end <= intersection.y1) || (time > intersection.y2 && end > intersection.y2)) {
				isCollided = false;
			}

			return isCollided;
		}

		function moveActionPotentials(timePassed) {

			for (var actionPotentialIndex in nScope.neuron.actionPotentials) {

				var actionPotential = nScope.neuron.actionPotentials[actionPotentialIndex];
				moveActionPotential(actionPotential, timePassed);
			}
		}

		function moveActionPotential(actionPotential, timePassed) {

			let step = nScope.neuron.model.impulseSpeed * timePassed * actionPotential.direction;
			actionPotential.origin += step;

			checkEndReachedForActionPotential(actionPotential);
		}

		/**
		 * If actionPotential is out of dendrite of axon we have to delete it
		 * @param  Life.ActionPotential actionPotentia
		 * @return null
		 */
		function checkEndReachedForActionPotential(actionPotential) {

			if (actionPotential.direction == -1) {
				// Dendrite
				if (actionPotential.origin < -1*nScope.neuron.model.distances.dendrites) {
					life.neuronHandler.remove(nScope, 'action-potential', actionPotential.id);
				}
			}
			else {
				// Axon
				if (actionPotential.origin > nScope.neuron.model.distances.axon) {
					life.neuronHandler.remove(nScope, 'action-potential', actionPotential.id);
					nScope.neuron.presynapticPotentialActivation = true;
				}
			}
		}

		var scope = {

			/*** Public methods ***/

			init: function(nScopeParam) {

				nScope = nScopeParam;
				newPspIndexes = new Array();
			},

			generateExocytose: function(synapseKey) {

				let synapse = life.neuronHandler.get(nScope.neuron, 'synapse', synapseKey);

				let exocytose = life.synapseHandler.activate(synapse);
				life.neuronHandler.add(nScope, synapse, 'exocytose', null, exocytose);
			},

			generatePostsynapticPotential: function(args) {

				let synapseKey = args[0];
				let exocytoseKey = args[1];

				let synapse = life.neuronHandler.get(nScope.neuron, 'synapse', synapseKey);
				let exocytose = life.neuronHandler.get(synapse, 'exocytose', exocytoseKey);

				let postsynapticPotential = life.synapseHandler.binding(exocytose);
				life.neuronHandler.add(nScope, nScope.neuron, 'postsynaptic-potential', null, postsynapticPotential);
				newPspIndexes.push(postsynapticPotential.id);

				life.neuronHandler.remove(nScope, "exocytose", exocytoseKey, synapse);
			},

			/**
			 * @param  integer time [Initial time without time passed applied]
			 * @param  integer timePassed
			 * @return null
			 */
			iterate: function(time, timePassed) {

				if (timePassed > 0) {
					consumeActivations(); // todo : maybe not the best way to proceed. A neuron manager has to modify a neuron and not other neurons

					//	Exocytose
					consumeExocytoses(time, timePassed);

					//	Action potentials
					checkNewActionPotentials(time, timePassed);
					checkActionPotentialCollisions(time, timePassed);
					moveActionPotentials(timePassed);

					//	Postsynaptic potentials
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
