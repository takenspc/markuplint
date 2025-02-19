import { createPlugin } from '@markuplint/ml-core';

import { __ruleName__c } from './rules/__ruleName__';

export default createPlugin({
	name: '__pluginName__',
	create(settings) {
		return {
			rules: {
				// prettier-ignore
				'__ruleName__': __ruleName__c(settings),
			},
		};
	},
});
