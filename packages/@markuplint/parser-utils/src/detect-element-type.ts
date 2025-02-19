import type { ElementType, ParserAuthoredElementNameDistinguishing } from '@markuplint/ml-ast';

import { isPotentialCustomElementName } from './decision';

export function detectElementType(
	name: string,
	option?: ParserAuthoredElementNameDistinguishing,
	defaultPattern?: ParserAuthoredElementNameDistinguishing,
): ElementType {
	if (distinguishAuthoredName(name, option, defaultPattern)) {
		return 'authored';
	}
	return isPotentialCustomElementName(name) ? 'web-component' : 'html';
}

function distinguishAuthoredName(
	name: string,
	pattern?: ParserAuthoredElementNameDistinguishing,
	defaultPattern?: ParserAuthoredElementNameDistinguishing,
) {
	if (pattern) {
		return _distinguishAuthoredName(name, pattern);
	}

	if (defaultPattern) {
		return _distinguishAuthoredName(name, defaultPattern);
	}

	return false;
}

function _distinguishAuthoredName(name: string, patterns: ParserAuthoredElementNameDistinguishing) {
	const patternList = Array.isArray(patterns) ? patterns : [patterns];

	return patternList.some(pattern => {
		if (typeof pattern === 'function') {
			return pattern(name);
		}
		const regex = typeof pattern === 'string' ? toRegexp(pattern) : pattern;
		return regex.test(name);
	});
}

function toRegexp(pattern: string) {
	const matched = pattern.match(/^\/(.+)\/([ig]*)$/i);
	if (matched) {
		return new RegExp(matched[1], matched[2]);
	}
	return new RegExp(pattern);
}
