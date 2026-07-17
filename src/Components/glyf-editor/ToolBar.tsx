import { $findMatchingParent, $getSelection, $isRangeSelection, $setSelection } from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_BANNER_COMMAND } from '../Plugins/Banner/BannerPlugin';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_DEFAULT_BULLET_LIST_COMMAND, INSERT_RED_BULLET_LIST_COMMAND } from '../Plugins/Banner/CustomListPlugin';
import { $isLinkNode, $toggleLink } from '@lexical/link';
import { INSERT_IMAGE_COMMAND } from '../Plugins/Banner/ImageNode';
import { useRef } from 'react';

export function ToolBarPlugin(): JSX.Element {
  return (
    <div className='toolBarWrapper'>
      <MyHeadingPlugin />
      <CustomListToolbarPlugin />
      <BannerToolbarplugin />
      <InsertTableButton />
      <LinkPlugin />
      <InsertImageButton/>
    </div>
  );
}

function MyHeadingPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const onclick = (tag: 'h1' | 'h2' | 'h3'): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <div>
      <button type='button' onClick={() => onclick('h1')}>H1</button>
      <button type='button' onClick={() => onclick('h2')}>H2</button>
      <button type='button' onClick={() => onclick('h3')}>H3</button>
    </div>
  );
}

function CustomListToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const handleInsert = (command: any) => (event: React.MouseEvent) => {
    event.preventDefault();
    editor.dispatchCommand(command, undefined);
  };

  return (
    <div>
      <button type='button' onMouseDown={handleInsert(INSERT_RED_BULLET_LIST_COMMAND)}>
        Red Bullet
      </button>
      <button type='button' onMouseDown={handleInsert(INSERT_DEFAULT_BULLET_LIST_COMMAND)}>
        Default Bullet
      </button>
    </div>
  );
}

function BannerToolbarplugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const onclick = (event: React.MouseEvent): void => {
    event.preventDefault();
    editor.dispatchCommand(INSERT_BANNER_COMMAND, undefined);
  };

  return <button type='button' onClick={onclick}>Banner</button>;
}

function InsertTableButton(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: '3',
      columns: '2',
      includeHeaders: {
        rows: true,
        columns: false,
      },
    });
  };

  return <button onClick={insertTable}>Insert Table</button>;
}

function LinkPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const handleInsertLink = (event: React.MouseEvent) => {
    event.preventDefault();
    toggleSelectionLink(editor);
  };

  return <button type='button' onClick={handleInsertLink}>Insert Link</button>;
}

export function toggleSelectionLink(editor) {
  
  editor.update(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      return;
    }

    // Find the nearest LinkNode from the anchor
    const linkNode = $findMatchingParent(selection.anchor.getNode(),$isLinkNode);

    if (linkNode) {
      $toggleLink(null);
    } else {
      const url = prompt('Enter the URL');
      if (url) {
        $toggleLink(url);
      }

    }
  });
}

export default function InsertImageButton(){

    const [editor] =useLexicalComposerContext();
    const inputRef =useRef<HTMLInputElement>(null);
    const savedSelection =useRef<any>(null);

    function openFilePicker(){

      editor.getEditorState().read(()=>{

          const selection =$getSelection();

          if($isRangeSelection(selection)){
              savedSelection.current = selection.clone();
          }

      });

      inputRef.current?.click();

    }

    function onChange(event:React.ChangeEvent<HTMLInputElement>){

        const file =event.target.files?.[0];

        if(!file)
            return;

        const reader =new FileReader();

        reader.onload = ()=>{

            editor.update(()=>{

                if(savedSelection.current){
                    $setSelection(savedSelection.current);
                }

            });

            editor.dispatchCommand(

                INSERT_IMAGE_COMMAND,
                {
                    src:reader.result as string,
                    altText:file.name,
                    width:100,
                    height:100
                }

            );

        };

        reader.readAsDataURL(file);

        // allow selecting same file again
        event.target.value = "";

    }

    return (
        <>
            <button type="button" onClick={openFilePicker}>🖼 Insert Image</button>
            <input ref={inputRef} type="file" accept="image/*"  hidden onChange={onChange}/>
        </>
    );

}