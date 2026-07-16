import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_NORMAL, createCommand, EditorConfig, ElementNode, LexicalEditor, LexicalNode, NodeKey, RangeSelection } from "lexical";

export class BannerNode extends ElementNode{
    static getType(): string {
        return 'banner'
    }
    // constructor(key?:NodeKey){
    //     super();
    // }

    static clone(node:BannerNode):BannerNode{
        return new BannerNode(node.__key)
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement('div')
        element.className = _config.theme.banner;
        return element
    }

    updateDOM():false{
        return false
    }
    //Use if you want to explicitly unmount/remount the dom
    /*
        updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
            
        }
    */

    collapseAtStart(selection: RangeSelection): boolean {
        const paragraph = $createParagraphNode();
        const children = this.getChildren();
        children.forEach((child) => paragraph.append(child));
        this.replace(paragraph);
        return true
    }

    insertNewAfter(selection: RangeSelection, restoreSelection?: boolean): null | LexicalNode {
        const newblock= $createParagraphNode()
        const direction = this.getDirection()
        newblock.setDirection(direction)
        this.insertAfter(newblock,restoreSelection)
        return newblock
    }
}

export function $createBannerNode():BannerNode{
    return new BannerNode()
}

export function  $isBannerNode(node:LexicalNode):node is BannerNode{
    return node instanceof BannerNode
}

export const INSERT_BANNER_COMMAND=createCommand('insertBanner')

export function BannerPlugin(): null{
    const editor = useLexicalComposerContext()
    
    if(!editor[0].hasNodes([BannerNode])){
        throw new Error("Bannerplugin not exist")
    }

    editor[0].registerCommand(INSERT_BANNER_COMMAND,()=>{
        const selection=$getSelection()
        if($isRangeSelection(selection)){
            $setBlocksType(selection,$createBannerNode)  
        }
        return true
    },COMMAND_PRIORITY_LOW)  // COMMAND_PRIORITY_LOW values are used to overide commands

    return null
}