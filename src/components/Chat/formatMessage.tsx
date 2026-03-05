import React from "react";

/**
 * Lightweight Markdown renderer for chat messages.
 * Handles: **bold**, *italic*, bullet lists (- or *), and line breaks.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={`${keyPrefix}-b-${match.index}`}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={`${keyPrefix}-i-${match.index}`}>{match[3]}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function formatMessage(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`}>{currentList}</ul>);
      currentList = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Bullet list item: starts with "- " or "* "
    const listMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (listMatch) {
      currentList.push(
        <li key={`li-${i}`}>{renderInline(listMatch[1], `li-${i}`)}</li>
      );
      return;
    }

    flushList();

    if (trimmed === "") {
      return; // skip empty lines
    }

    elements.push(
      <p key={`p-${i}`} style={{ margin: "4px 0" }}>
        {renderInline(trimmed, `p-${i}`)}
      </p>
    );
  });

  flushList();

  return <>{elements}</>;
}
