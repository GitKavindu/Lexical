import {$createTextNode, $getRoot, $getSelection, $isRangeSelection, EditorState} from 'lexical';
import {$createHeadingNode} from '@lexical/rich-text'
import {$setBlocksType} from '@lexical/selection'
import {LexicalComposerContext, useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import { INSERT_ORDERED_LIST_COMMAND,INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { INSERT_BANNER_COMMAND } from '../Plugins/Banner/BannerPlugin';
import {INSERT_TABLE_COMMAND} from "@lexical/table";

export function ToolBarPlugin () :JSX.Element{
  const [editor]=useLexicalComposerContext();
  return <div className='toolBarWrapper'>
    <MyHeadingPludin/>
    <ListToolBarPlugin/>
    <BannerToolbarplugin/>
    <InsertTableButton/>
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

function BannerToolbarplugin(){
    const [editor]=useLexicalComposerContext();
    const onclick = (e:React.MouseEvent) :void => {   
        editor.dispatchCommand(INSERT_BANNER_COMMAND,undefined)
    }
    return <button type='button' onClick={onclick}>Banner</button>
}

function InsertTableButton():JSX.Element {
    const [editor] = useLexicalComposerContext();

    const insertTable = () => {
        editor.dispatchCommand(
            INSERT_TABLE_COMMAND,
            {
                rows: "3",
                columns: "2",
                includeHeaders: true,
            }
        );
    };

    return (
        <button onClick={insertTable}>
            Insert Table
        </button>
    );
}