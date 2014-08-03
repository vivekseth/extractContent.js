var getArticleRootTag = function (threshhold) {

	// CONSTANTS
	var __threshhold = threshhold;

	/** int */ 
	function textContentSize(node) {
		// TODO(vivek): change to recursive definition that excludes all script tags
		// TODO(vivek): ^ Save all data in dictionary to retrieve for future calls.
		return node.textContent.length;
	}

	/** node */
	function getFirstChildren(node) {
		return node.children;
	}

	/** node */
	function getLargestChild(node) {
		var children = getFirstChildren(node);
		if (children.length <= 0) {
			console.log("ERROR, no children found");
			return null;
		}
	 	var best = children[0];
		for (var i=0; i<children.length; i++) {
			var c = children[i];
			if (textContentSize(c) > textContentSize(best)) {
				if (isScriptTag(c) || isPossibleCommentTag(c)) {
					continue;
				} else {
					best = c;
				}
			}
		};
		if (node == best) {
			return null;
		} else {
			return best;
		}
	}

	/** boolean */
	function isPossibleCommentTag(node) {
		var blacklist = ["COMMENT", "CHAT"];
		var attributes = node.attributes;
		for (var i = 0; i < attributes.length; i++) {
			var a = attributes[i];
			if (a.value) {
				for (var i = 0; i < blacklist.length; i++) {
					if (a.value.toUpperCase().search(blacklist[i].toUpperCase()) >= 0) {
						return true;
					} 
				};
			}
		};
		return false;
	}

	/** boolean */
	function isScriptTag(node) {
		if (node.tagName.toUpperCase().search("SCRIPT") >= 0) {
			return true;
		} else {
			return false;
		}
	}

	/** node */
	function rootNode() {
		return document.body;
	}

	/** node */
	function articleRootTag() {
		var totalWords = textContentSize(rootNode());
		var bestGuess = rootNode();
		var tagIDQueue = [rootNode()];

		while(tagIDQueue.length > 0) {
			var currTagID = tagIDQueue.shift();
			var ratio = textContentSize(currTagID) / textContentSize(bestGuess);
			if (ratio >= __threshhold) {
				bestGuess = currTagID;
				var largestChild = getLargestChild(bestGuess);
				if (largestChild) {
					tagIDQueue.push(largestChild);
				}
			} else {
				break;
			}
		}

		return bestGuess;
	}

	return articleRootTag;

}

getArticleRootTag(0.4570)();