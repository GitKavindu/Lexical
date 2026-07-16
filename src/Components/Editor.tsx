import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HeadingNode} from '@lexical/rich-text'

import {ListPlugin} from '@lexical/react/LexicalListPlugin'
import { ListNode, ListItemNode } from "@lexical/list";
import { ToolBarPlugin } from './glyf-editor/ToolBar';

import "./Editor.css"
import { BannerNode, BannerPlugin } from './Plugins/Banner/BannerPlugin';
import {TableNode,TableCellNode,TableRowNode} from "@lexical/table";
import {TablePlugin} from "@lexical/react/LexicalTablePlugin";
import { CustomListNode } from './Plugins/Banner/CustomListPlugin';

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
  },
  banner:'glyf-editor-banner',
  table: "editor-table",
  tableCell: "editor-table-cell",
  tableCellHeader: "editor-table-header",
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
      HeadingNode,ListNode, ListItemNode,BannerNode,TableNode,TableRowNode,TableCellNode,CustomListNode
    ]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolBarPlugin/>
      <BannerPlugin/>
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
      <TablePlugin
          hasCellMerge={true}
          hasCellBackgroundColor={true}
          hasTabHandler={true}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}

export default Editor


