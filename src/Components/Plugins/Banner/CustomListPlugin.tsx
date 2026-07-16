import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function CustomListPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return undefined;
  }, [editor]);

  return null;
}