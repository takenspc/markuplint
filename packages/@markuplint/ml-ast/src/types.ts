export interface MLToken {
	uuid: string;
	raw: string;
	startOffset: number;
	endOffset: number;
	startLine: number;
	endLine: number;
	startCol: number;
	endCol: number;
	[extendKey: `__${string}`]: string | number | boolean | null;
}

export type MLASTNodeType =
	| 'doctype'
	| 'starttag'
	| 'endtag'
	| 'comment'
	| 'text'
	| 'omittedtag'
	| 'psblock'
	| 'html-attr'
	| 'ps-attr';

export type MLASTNode = MLASTDoctype | MLASTTag | MLASTComment | MLASTText | MLASTPreprocessorSpecificBlock | MLASTAttr;

export interface MLASTAbstractNode extends MLToken {
	type: MLASTNodeType;
	nodeName: string;
	parentNode: MLASTParentNode | null;
	prevNode: MLASTNode | null;
	nextNode: MLASTNode | null;
	isFragment: boolean;
	isGhost: boolean;
}

export interface MLASTDoctype extends MLASTAbstractNode {
	type: 'doctype';
	name: string;
	publicId: string;
	systemId: string;
}

export interface MLASTElement extends MLASTAbstractNode {
	type: 'starttag';
	namespace: string;
	attributes: MLASTAttr[];
	hasSpreadAttr: boolean;
	childNodes?: MLASTNode[];
	pearNode: MLASTElementCloseTag | null;
	selfClosingSolidus?: MLToken;
	endSpace?: MLToken;
	tagOpenChar: string;
	tagCloseChar: string;
	isCustomElement: boolean;
}

export interface MLASTElementCloseTag extends MLASTAbstractNode {
	type: 'endtag';
	namespace: string;
	attributes: MLASTAttr[];
	childNodes?: MLASTNode[];
	pearNode: MLASTTag | null;
	tagOpenChar: string;
	tagCloseChar: string;
	isCustomElement: boolean;
}

export interface MLASTPreprocessorSpecificBlock extends MLASTAbstractNode {
	type: 'psblock';
	nodeName: string;
	parentNode: MLASTParentNode | null;
	prevNode: MLASTNode | null;
	nextNode: MLASTNode | null;
	childNodes?: MLASTNode[];
	branchedChildNodes?: MLASTNode[];
}

export type MLASTTag = MLASTElement | MLASTElementCloseTag;

export type MLASTParentNode = MLASTElement | MLASTPreprocessorSpecificBlock;

export interface MLASTComment extends MLASTAbstractNode {
	type: 'comment';
}

export interface MLASTText extends MLASTAbstractNode {
	type: 'text';
}

export type MLASTAttr = MLASTHTMLAttr | MLASTPreprocessorSpecificAttr;

export interface MLASTHTMLAttr extends MLASTAbstractNode {
	type: 'html-attr';
	spacesBeforeName: MLToken;
	name: MLToken;
	spacesBeforeEqual: MLToken;
	equal: MLToken;
	spacesAfterEqual: MLToken;
	startQuote: MLToken;
	value: MLToken;
	endQuote: MLToken;
	isDynamicValue?: true;
	isDirective?: true;
	potentialName?: string;
	candidate?: string;
	isDuplicatable: boolean;
	parentNode: null;
	nextNode: null;
	prevNode: null;
	isFragment: false;
	isGhost: false;
}

export interface MLASTPreprocessorSpecificAttr extends MLASTAbstractNode {
	type: 'ps-attr';
	potentialName: string;
	potentialValue: string;
	valueType: 'string' | 'number' | 'boolean' | 'code';
	isDuplicatable: boolean;
}

export interface MLASTDocument {
	nodeList: MLASTNode[];
	isFragment: boolean;
	unknownParseError?: string;
}

export interface MLMarkupLanguageParser {
	parse(
		sourceCode: string,
		offsetOffset?: number,
		offsetLine?: number,
		offsetColumn?: number,
		ignoreFrontMatter?: boolean,
	): MLASTDocument;
	/**
	 * @default "omittable"
	 */
	endTag?: 'xml' | 'omittable' | 'never';
}

export type Parse = MLMarkupLanguageParser['parse'];

export type Walker = (node: MLASTNode, depth: number) => void;

export type NamespaceURI =
	| 'http://www.w3.org/1999/xhtml'
	| 'http://www.w3.org/2000/svg'
	| 'http://www.w3.org/1998/Math/MathML'
	| 'http://www.w3.org/1999/xlink';

export type Namespace = 'html' | 'svg' | 'mml' | 'xlink';
