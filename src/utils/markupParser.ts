
import { Descendant } from 'slate';
import { CustomElement, CustomText } from '../types/slate.d';

const inlineMarks: Record<string, keyof CustomText> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  strike: 'strike',
  small: 'small',
  mark: 'mark',
  sup: 'superscript',
  sub: 'subscript',
};

function parseBlock(block: string): { command: string; content: string; params: Record<string, string> } {
  let i = 0;
  if (block[i] === '_') i++;
  let command = '';
  while (i < block.length && block[i] !== ':') {
    command += block[i];
    i++;
  }
  i++; // skip :
  while (i < block.length && block[i] === ' ') i++;
  let content = '';
  let depth = 0;
  while (i < block.length) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') depth--;
    if (block[i] === ',' && depth === 0) {
      i++;
      break;
    }
    content += block[i];
    i++;
  }
  content = content.trim();
  const params: Record<string, string> = {};
  while (i < block.length) {
    while (i < block.length && block[i] === ' ') i++;
    let key = '';
    while (i < block.length && block[i] !== ':') {
      key += block[i];
      i++;
    }
    i++; // :
    while (i < block.length && block[i] === ' ') i++;
    let value = '';
    depth = 0;
    while (i < block.length) {
      if (block[i] === '{') depth++;
      else if (block[i] === '}') depth--;
      if (block[i] === ',' && depth === 0) {
        i++;
        break;
      }
      value += block[i];
      i++;
    }
    params[key.trim()] = value.trim();
  }
  return { command, content, params };
}

function applyMarks(nodes: Descendant[], mark: keyof CustomText, value: any) {
  for (const node of nodes) {
    if ('text' in node) {
      (node as any)[mark] = value;
    } else if ('children' in node) {
      applyMarks(node.children, mark, value);
    }
  }
}

function parseLine(line: string): Descendant[] {
  const nodes: Descendant[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '{') {
      let j = i + 1;
      let depth = 1;
      while (j < line.length && depth > 0) {
        if (line[j] === '{') depth++;
        else if (line[j] === '}') depth--;
        j++;
      }
      const block = line.substring(i + 1, j - 1);
      const { command, content, params } = parseBlock(block);
      const common = {
        color: params.color,
        fontSize: params['font-size'] ? parseInt(params['font-size']) : undefined,
      };
      let added: Descendant[] = [];
      if (inlineMarks[command]) {
        const subChildren = parseLine(content);
        applyMarks(subChildren, inlineMarks[command], true);
        if (common.color) applyMarks(subChildren, 'color', common.color);
        if (common.fontSize) applyMarks(subChildren, 'fontSize', common.fontSize);
        added = subChildren;
      } else if (command === 'latex') {
        added = [{
          type: 'math',
          formula: content,
          inline: true,
          color: common.color,
          fontSize: common.fontSize,
          children: [{ text: '' }],
        }];
      } else if (command === 'margin') {
        const subChildren = parseLine(content);
        if (common.color) applyMarks(subChildren, 'color', common.color);
        if (common.fontSize) applyMarks(subChildren, 'fontSize', common.fontSize);
        added = [{ type: 'indented', children: subChildren }];
      } else if (command === 'heading') {
        const subChildren = parseLine(content);
        if (common.color) applyMarks(subChildren, 'color', common.color);
        if (common.fontSize) applyMarks(subChildren, 'fontSize', common.fontSize);
        added = [{ type: 'heading', color: common.color, fontSize: common.fontSize, children: subChildren }];
      } else if (command === 'center') {
        const subChildren = parseLine(content);
        if (common.color) applyMarks(subChildren, 'color', common.color);
        if (common.fontSize) applyMarks(subChildren, 'fontSize', common.fontSize);
        added = [{ type: 'centered', children: subChildren }];
      } else if (command === 'top') {
        const subChildren = parseLine(content);
        added = [{ type: 'top', fontSize: parseInt(content) || 20, children: subChildren }];
      } else if (command === 'br') {
        added = [{ text: '\n' }];
      } else if (command === 'text') {
        added = parseLine(content);
      } // Add more commands as needed
      nodes.push(...added);
      i = j;
    } else {
      let plain = '';
      while (i < line.length && line[i] !== '{') {
        plain += line[i];
        i++;
      }
      if (plain) nodes.push({ text: plain });
    }
  }
  return nodes;
}

export function parseMarkup(text: string): Descendant[] {
  const lines = text.split('\n');
  const nodes: Descendant[] = [];
  for (const line of lines) {
    let children = parseLine(line);
    let node: CustomElement;
    if (children.length === 1 && 'type' in children[0] && ['heading', 'math'].includes((children[0] as CustomElement).type)) {
      node = children[0] as CustomElement;
    } else if (children.length > 0 && 'type' in children[0] && children[0].type === 'centered') {
      node = { type: 'paragraph', align: 'center', children: (children[0] as CustomElement).children };
    } else if (children.length > 0 && 'type' in children[0] && children[0].type === 'top') {
      node = { type: 'paragraph', marginTop: (children[0] as CustomElement).fontSize || 20, children: (children[0] as CustomElement).children };
    } else if (children.length > 0 && 'type' in children[0] && children[0].type === 'indented') {
      const prefix = ((children[0] as CustomElement).children[0] as CustomText).text + ' ';
      children.shift();
      children.unshift({ text: prefix });
      node = { type: 'paragraph', marginLeft: 20, children };
    } else {
      node = { type: 'paragraph', children };
    }
    if (node.children.length > 0 || nodes.length === 0) { // Avoid empty paragraphs except initial
      nodes.push(node);
    }
  }
  return nodes;
} 