import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertList } from "@lexical/list";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  createCommand,
} from "lexical";
import { useEffect } from "react";

type BulletVariant = "red" | "default";

export const INSERT_RED_BULLET_LIST_COMMAND = createCommand<BulletVariant>("insertRedBulletList");
export const INSERT_DEFAULT_BULLET_LIST_COMMAND = createCommand<BulletVariant>("insertDefaultBulletList");

function applyBulletVariant(editor: ReturnType<typeof useLexicalComposerContext>[0], variant: BulletVariant) {
  requestAnimationFrame(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const lists = rootElement.querySelectorAll("ul");
    const targetList = lists[lists.length - 1] as HTMLElement | null;

    if (!targetList) return;

    targetList.classList.remove("custom-svg-list-red", "custom-svg-list-default");
    targetList.classList.add(variant === "red" ? "custom-svg-list-red" : "custom-svg-list-default");
  });
}

export function CustomListPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterRed = editor.registerCommand(
      INSERT_RED_BULLET_LIST_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $insertList("bullet");
          }
        });
        applyBulletVariant(editor, "red");
        editor.focus();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    const unregisterDefault = editor.registerCommand(
      INSERT_DEFAULT_BULLET_LIST_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $insertList("bullet");
          }
        });
        applyBulletVariant(editor, "default");
        editor.focus();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      unregisterRed();
      unregisterDefault();
    };
  }, [editor]);

  return null;
}