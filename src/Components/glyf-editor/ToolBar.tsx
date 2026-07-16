import { $getSelection, $isRangeSelection } from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_BANNER_COMMAND } from '../Plugins/Banner/BannerPlugin';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_DEFAULT_BULLET_LIST_COMMAND, INSERT_RED_BULLET_LIST_COMMAND } from '../Plugins/Banner/CustomListPlugin';

export function ToolBarPlugin(): JSX.Element {
  return (
    <div className='toolBarWrapper'>
      <MyHeadingPlugin />
      <CustomListToolbarPlugin />
      <BannerToolbarplugin />
      <InsertTableButton />
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