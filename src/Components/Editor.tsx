import {$createTextNode, $getRoot, $getSelection, EditorState} from 'lexical';
import {useEffect} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {LexicalComposerContext, useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {$createHeadingNode, HeadingNode} from '@lexical/rich-text'
import "./Editor.css"

const theme = {
  // Theme styling goes here
  //...
  heading:{
    h1:'glyf-editor-h1'
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
      HeadingNode
    ]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <MyHeadingPludin/>
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

function MyHeadingPludin():JSX.Element{
  const [editor]=useLexicalComposerContext();
  const onclick = (e:React.MouseEvent):void => {
    editor.update(()=>{
      const root = $getRoot();
      root.append($createHeadingNode('h1').append($createTextNode('Hello World')));
    });
  }
  return <button onClick={onclick}>Heading</button>
}

export default Editor


