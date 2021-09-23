import { createTestDocument, createTestNodeList } from '../test';
import { createRule } from '../create-rule';

test('node count', async () => {
	const nodeList = createTestNodeList('<div>text</div>');
	expect(nodeList.length).toBe(3);
});

test('raw', async () => {
	const nodeList = createTestNodeList('<div>text</div>');
	expect(nodeList[0].raw).toBe('<div>');
	expect(nodeList[1].raw).toBe('text');
	expect(nodeList[2].raw).toBe('</div>');
});

test('raw', async () => {
	const nodeList = createTestNodeList(`
<div>
	text
</div>`);
	expect(nodeList[0].raw).toBe('\n');
	expect(nodeList[1].raw).toBe('<div>');
	expect(nodeList[2].raw).toBe('\n\ttext\n');
	expect(nodeList[3].raw).toBe('</div>');
});

test('raw', async () => {
	const nodeList = createTestNodeList(`
    <div>
        text
    </div>`);
	expect(nodeList[0].raw).toBe('\n    ');
	expect(nodeList[1].raw).toBe('<div>');
	expect(nodeList[2].raw).toBe('\n        text\n    ');
	expect(nodeList[3].raw).toBe('</div>');
	expect(nodeList[0].prevToken).toBe(null);
	expect(nodeList[1].prevToken!.raw).toBe('\n    ');
	expect(nodeList[2].prevToken!.raw).toBe('<div>');
	expect(nodeList[3].prevToken!.raw).toBe('\n        text\n    ');
	expect(nodeList[1].prevToken!.uuid).toBe(nodeList[0].uuid);
	expect(nodeList[2].prevToken!.uuid).toBe(nodeList[1].uuid);
	expect(nodeList[3].prevToken!.uuid).toBe(nodeList[2].uuid);
	expect(nodeList[0].indentation).toBe(null);
	expect(nodeList[1].indentation!.width).toBe(4);
	expect(nodeList[2].indentation!.width).toBe(8);
	expect(nodeList[3].indentation!.width).toBe(4);
});

test('raw', async () => {
	const nodeList = createTestNodeList(`
    <div>
        <span>text</span>
    </div>`);
	expect(nodeList[0].raw).toBe('\n    ');
	expect(nodeList[1].raw).toBe('<div>');
	expect(nodeList[2].raw).toBe('\n        ');
	expect(nodeList[3].raw).toBe('<span>');
	expect(nodeList[4].raw).toBe('text');
	expect(nodeList[5].raw).toBe('</span>');
	expect(nodeList[6].raw).toBe('\n    ');
	expect(nodeList[7].raw).toBe('</div>');
	expect(nodeList[0].indentation!).toBe(null);
	expect(nodeList[1].indentation!.width).toBe(4);
	expect(nodeList[2].indentation!).toBe(null);
	expect(nodeList[3].indentation!.width).toBe(8);
	expect(nodeList[4].indentation!).toBe(null);
	expect(nodeList[5].indentation!).toBe(null);
	expect(nodeList[6].indentation!).toBe(null);
	expect(nodeList[7].indentation!.width).toBe(4);
});

test('raw', async () => {
	const nodeList = createTestNodeList(`
<div>
	<span>text</span>
</div>`);
	expect(nodeList[0].raw).toBe('\n');
	expect(nodeList[1].raw).toBe('<div>');
	expect(nodeList[2].raw).toBe('\n\t');
	expect(nodeList[3].raw).toBe('<span>');
	expect(nodeList[4].raw).toBe('text');
	expect(nodeList[5].raw).toBe('</span>');
	expect(nodeList[6].raw).toBe('\n');
	expect(nodeList[7].raw).toBe('</div>');
	expect(nodeList[0].indentation!).toBe(null);
	expect(nodeList[1].indentation!.width).toBe(0);
	expect(nodeList[2].indentation!).toBe(null);
	expect(nodeList[3].indentation!.width).toBe(1);
	expect(nodeList[4].indentation!).toBe(null);
	expect(nodeList[5].indentation!).toBe(null);
	expect(nodeList[6].indentation!).toBe(null);
	expect(nodeList[7].indentation!.width).toBe(0);
});

test('rule', async () => {
	const document = createTestDocument<'foo', any>('<div><span>text</span></div>', {
		rules: {
			ruleA: true,
			ruleB: true,
		},
		nodeRules: [
			{
				tagName: 'span',
				rules: {
					ruleA: false,
				},
			},
		],
	});
	const ruleA = createRule({
		name: 'ruleA',
		defaultValue: 'foo',
		defaultOptions: null,
		async verify() {
			throw new Error();
		},
	});
	document.setRule(ruleA);
	expect(document.nodeList[1].rule.disabled).toBe(true);
	const ruleB = createRule({
		name: 'ruleB',
		defaultValue: 'foo',
		defaultOptions: null,
		async verify() {
			throw new Error();
		},
	});
	document.setRule(ruleB);
	expect(document.nodeList[1].rule.disabled).toBe(false);
});
