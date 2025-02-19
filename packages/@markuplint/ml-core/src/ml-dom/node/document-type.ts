import type { MLDocument } from './document';
import type { MLElement } from './element';
import type { DocumentTypeNodeType } from './types';
import type { MLASTDoctype } from '@markuplint/ml-ast';
import type { RuleConfigValue } from '@markuplint/ml-config';

import { after, before, remove, replaceWith } from '../manipulations/child-node-methods';

import { MLNode } from './node';

export class MLDocumentType<T extends RuleConfigValue, O = null>
	extends MLNode<T, O, MLASTDoctype>
	implements DocumentType
{
	readonly name: string;
	readonly publicId: string;
	readonly systemId: string;

	constructor(astNode: MLASTDoctype, document: MLDocument<T, O>) {
		super(astNode, document);
		this.name = astNode.name;
		this.publicId = astNode.publicId;
		this.systemId = astNode.systemId;
	}

	/**
	 * Returns a string appropriate for the type of node as `DocumentType`
	 *
	 * @see https://dom.spec.whatwg.org/#ref-for-documenttype%E2%91%A0%E2%93%AA
	 */
	get nodeName(): string {
		return this.name;
	}

	/**
	 * Returns a number appropriate for the type of `DocumentType`
	 */
	get nodeType(): DocumentTypeNodeType {
		return this.DOCUMENT_TYPE_NODE;
	}

	/**
	 * @implements DOM API: `CharacterData`
	 */
	after(...nodes: (string | MLElement<any, any>)[]): void {
		after(this, ...nodes);
	}

	/**
	 * @implements DOM API: `CharacterData`
	 */
	before(...nodes: (string | MLElement<any, any>)[]): void {
		before(this, ...nodes);
	}

	/**
	 * @implements DOM API: `CharacterData`
	 */
	remove(): void {
		remove(this);
	}

	/**
	 * @implements DOM API: `CharacterData`
	 */
	replaceWith(...nodes: (string | MLElement<any, any>)[]): void {
		replaceWith(this, ...nodes);
	}
}
