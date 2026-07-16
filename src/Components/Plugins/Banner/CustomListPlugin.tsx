import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import { 
  $createParagraphNode, 
  $getSelection, 
  $isRangeSelection, 
  COMMAND_PRIORITY_HIGH, 
  createCommand, 
  EditorConfig, 
  ElementNode, 
  LexicalNode, 
  NodeKey, 
  RangeSelection 
} from "lexical";

export class CustomListNode extends ElementNode {
  static getType(): string {
    return "custom-list";
  }

  static clone(node: CustomListNode): CustomListNode {
    return new CustomListNode(node.__key);
  }

  createDOM(_config: EditorConfig): HTMLElement {
    // Renders the structural wrapper wrapper (e.g., a standard <ul>)
    console.log('dasd')
    const element = document.createElement("ul");
    element.className = _config.theme.customList || "custom-list-wrapper";

    return element;
  }

  updateDOM(): false {
    return false;
  }

  collapseAtStart(selection: RangeSelection): boolean {
    const paragraph = $createParagraphNode();
    const children = this.getChildren();
    children.forEach((child) => paragraph.append(child));
    this.replace(paragraph);
    return true;
  }

  insertNewAfter(selection: RangeSelection, restoreSelection?: boolean): null | LexicalNode {
    const newblock = $createParagraphNode();
    const direction = this.getDirection();
    newblock.setDirection(direction);
    this.insertAfter(newblock, restoreSelection);
    return newblock;
  }
}

export function $createCustomListNode(): CustomListNode {
  return new CustomListNode();
}

export function $isCustomListNode(node: LexicalNode): node is CustomListNode {
  return node instanceof CustomListNode;
}

export function $createBannerNode():CustomListNode{
    console.log('hello')
    return new CustomListNode()
}


// 1. Defining the unique execution command
export const INSERT_CUSTOMLIST_COMMAND = createCommand("insertCustomList");

export function CustomListPlugin(): null {
  const [editor] = useLexicalComposerContext();
     
  // 2. Strict defensive check matching your node verification style
  if (!editor.hasNodes([CustomListNode])) {
    throw new Error("CustomListPlugin: CustomListNode is missing from configuration registration.");
  }

  // 3. Registering block updates inside selection
  editor.registerCommand(
    INSERT_CUSTOMLIST_COMMAND,
    () => {
      console.log('regis');
        const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, $createCustomListNode);
      }
      return true;
    },
    COMMAND_PRIORITY_HIGH
  );

  return null;
}