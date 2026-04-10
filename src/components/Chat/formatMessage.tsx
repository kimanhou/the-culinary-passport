import React from "react";
import FoodPlace from "../../model/FoodPlace";

/**
 * Lightweight Markdown renderer for chat messages.
 * Handles: **bold**, *italic*, bullet lists (- or *), and line breaks.
 */

function renderInline(
  text: string,
  keyPrefix: string,
  slugMap?: Map<string, FoodPlace>,
  onOpenCard?: (fp: FoodPlace) => void
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Links first, then bold, then italic — avoids bracket/asterisk conflicts
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2] && match[3]) {
      const linkText = match[2];
      const url = match[3];

      if (/^https?:\/\//.test(url)) {
        // HTTP(S) link → anchor tag opening in new tab
        parts.push(
          <a
            key={`${keyPrefix}-a-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-booking-link"
          >
            {linkText} →
          </a>
        );
      } else if (slugMap && onOpenCard && slugMap.has(url)) {
        // Slug link found in map → button that opens the card
        const fp = slugMap.get(url)!;
        parts.push(
          <button
            key={`${keyPrefix}-btn-${match.index}`}
            className="chat-booking-link"
            onClick={() => onOpenCard(fp)}
          >
            {linkText} →
          </button>
        );
      } else {
        // Non-HTTP string not in slugMap → plain text
        parts.push(linkText);
      }
    } else if (match[4]) {
      parts.push(<strong key={`${keyPrefix}-b-${match.index}`}>{match[4]}</strong>);
    } else if (match[5]) {
      parts.push(<em key={`${keyPrefix}-i-${match.index}`}>{match[5]}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}


export function formatMessage(
  text: string,
  slugMap?: Map<string, FoodPlace>,
  onOpenCard?: (fp: FoodPlace) => void
): React.ReactNode {
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
        <li key={`li-${i}`}>{renderInline(listMatch[1], `li-${i}`, slugMap, onOpenCard)}</li>
      );
      return;
    }

    flushList();

    if (trimmed === "") {
      return; // skip empty lines
    }

    elements.push(
      <p key={`p-${i}`} style={{ margin: "4px 0" }}>
        {renderInline(trimmed, `p-${i}`, slugMap, onOpenCard)}
      </p>
    );
  });

  flushList();

  return <>{elements}</>;
}
