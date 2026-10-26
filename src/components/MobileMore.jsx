import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Mobile progressive-disclosure toggle.
 *
 * Pairs with the `.m-clamp`, `.m-collapse` and `.m-limit` utility classes in
 * styles.css. Those classes only collapse content at phone widths (≤640px) and
 * only while the target lacks `.is-open` — desktop always shows everything.
 *
 * Content is never unmounted, so the full copy stays in the DOM for Google /
 * AI crawlers (mobile-first indexing treats expandable content as on-page).
 * This button is hidden on desktop via CSS.
 */
export default function MobileMore({
  open,
  onToggle,
  moreLabel = 'Read more',
  lessLabel = 'Show less',
  controls,
  className = ''
}) {
  return (
    <button
      type="button"
      className={`m-more-btn ${open ? 'is-open' : ''} ${className}`}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
    >
      <span>{open ? lessLabel : moreLabel}</span>
      <ChevronDown size={15} className="m-more-chevron" aria-hidden="true" />
    </button>
  );
}
