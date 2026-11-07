"use client";

import { useEffect } from "react";
import { reverseTranslation, translateText, type Language } from "@/lib/translations";

const originals = new WeakMap<Text, string>();
const ignored = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);

export function LanguageNormalizer({ language }: { language: Language }) {
  useEffect(() => {
    const root = document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let current: Node | null = walker.nextNode();
    while (current) {
      const text = current as Text;
      const parent = text.parentElement;
      if (parent && !ignored.has(parent.tagName) && !parent.closest(".sr-only")) nodes.push(text);
      current = walker.nextNode();
    }
    for (const node of nodes) {
      const source = originals.get(node) ?? reverseTranslation(node.nodeValue?.trim() ?? "");
      if (!source.trim() || source.length > 180) continue;
      originals.set(node, source);
      const translated = translateText(source, language);
      const raw = node.nodeValue ?? "";
      const leading = raw.match(/^\s*/)?.[0] ?? "";
      const trailing = raw.match(/\s*$/)?.[0] ?? "";
      node.nodeValue = `${leading}${translated}${trailing}`;
    }
  }, [language]);
  return null;
}
