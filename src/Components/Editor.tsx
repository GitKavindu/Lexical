import {$createTextNode, $getRoot, $getSelection, $isRangeSelection, EditorState} from 'lexical';
import {useEffect} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {LexicalComposerContext, useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {$createHeadingNode, HeadingNode} from '@lexical/rich-text'
import {$setBlocksType} from '@lexical/selection'
import {ListPlugin} from '@lexical/react/LexicalListPlugin'
import { ListNode, ListItemNode } from "@lexical/list";
import { INSERT_ORDERED_LIST_COMMAND,INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import "./Editor.css"

const theme = {
  // Theme styling goes here
  //...
  heading:{
    h1:'glyf-editor-h1',
    h2:'glyf-editor-h2',
    h3:'glyf-editor-h3'
  },
  text: {
    bold: 'glyf-editor-bold',
    italic: 'glyf-editor-italics'
  }
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes : [
      HeadingNode,ListNode, ListItemNode
    ]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolBarPlugin/>
      <ListPlugin/>
      <RichTextPlugin
        contentEditable={
          <ContentEditable 
            className='content-editable'
            aria-placeholder={'Enter some text...'}
            placeholder={<div className='placeholder'>Enter some text...</div>}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}

function ToolBarPlugin () :JSX.Element{
  const [editor]=useLexicalComposerContext();
  return <div className='toolBarWrapper'>
    <MyHeadingPludin/>
    <ListToolBarPlugin/>
  </div>
}

function MyHeadingPludin():JSX.Element{
  const [editor]=useLexicalComposerContext();
  const onclick = (tag : 'h1' |  'h2' | 'h3'):void => {
    editor.update(()=>{
      const selection =$getSelection();
      //this is only range selection. there are other types which is known as
      //Grid selection and Node Selection
      if($isRangeSelection(selection)){
        $setBlocksType(selection,()=> $createHeadingNode(tag))
      }
    });
  }
  return <div>
    {['h1', 'h2', 'h3'].map((tag) => (
      <button onClick={() => onclick(tag)} key={tag}>
        {tag.toUpperCase()}
      </button>
    ))}
  </div>
  
}

function ListToolBarPlugin():JSX.Element{
  const [editor]=useLexicalComposerContext();
  const onclick = (tag : 'ol' |  'ul') :void => {
    if(tag === 'ol'){
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND,undefined)
      return
    }
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND,undefined)
  }
  return <div>
    {['ol','ul'].map((tag) => (
      <button onClick={() => onclick(tag)} key={tag}>
        {tag.toUpperCase()}
      </button>
    ))}
  </div>
  
}

export default Editor


