import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    DecoratorNode,
    type NodeKey,
    type SerializedLexicalNode
} from "lexical";

export type SerializedImageNode = SerializedLexicalNode & {
    type: "image";
    version: 1;
    src: string;
    altText: string;
    width: number;
    height: number;
};

export class ImageNode extends DecoratorNode<JSX.Element> {

    __src: string;
    __altText: string;
    __width: number;
    __height: number;

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key );
    }

    constructor( src: string, altText: string, width = 500, height = 300,key?: NodeKey) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width;
        this.__height = height;
    }

    createDOM(): HTMLElement {
        return document.createElement("span");
    }

    updateDOM(): boolean {
        return false;
    }

    decorate(): JSX.Element {

        return (
            <img
                src={this.__src}
                alt={this.__altText}
                width={this.__width}
                height={this.__height}
                style={{ maxWidth:"100%", height:"auto", display:"block" }}
            />
        );
    }

    exportJSON(): SerializedImageNode {

        return {

            type:"image",
            version:1,
            src:this.__src,
            altText:this.__altText,
            width:this.__width,
            height:this.__height

        };

    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {

        return $createImageNode({
            src:serializedNode.src,
            altText:serializedNode.altText,
            width:serializedNode.width,
            height:serializedNode.height
        });

    }

}

export function $createImageNode(
    payload:{
        src:string;
        altText:string;
        width?:number;
        height?:number;
    }

):ImageNode 
{
    return new ImageNode(

        payload.src,
        payload.altText,
        payload.width ?? 100,
        payload.height ?? 100

    );
}

export function $isImageNode(node:unknown): node is ImageNode {
    return node instanceof ImageNode;
}

export default function ImagesPlugin(){
    console.log("ImagesPlugin component rendered");

    const [editor] = useLexicalComposerContext();

    console.log("ImagesPlugin mounted");

    editor.registerCommand(        
        INSERT_IMAGE_COMMAND,

        (payload)=>{
            console.log("INSERT IMAGE COMMAND FIRED", payload);

            editor.update(()=>{

                const selection = $getSelection();

                console.log("CURRENT SELECTION", selection);

                if(!$isRangeSelection(selection)){
                    return;
                }

                const imageNode = $createImageNode(payload);
                selection.insertNodes([imageNode]);
            });

            return true;
        },

        COMMAND_PRIORITY_EDITOR
    );



    return null;

}

export type ImagePayload = {

    src:string;
    altText:string;
    width?:number;
    height?:number;

};



export const INSERT_IMAGE_COMMAND =createCommand<ImagePayload>();