import { useLayoutEffect, useRef, useState } from "react";

type Span = 1 | 2 | 3 | 4;
type Align = "left" | "center" | "right";
type VAlign = "top" | "middle" | "bottom";

type Item = {
  id: string; title: string; teaser: string; content: string;
  span?: Span; rows?: number;
  expandMode?: "full" | "inline";
  expandTo?: { span?: Span | 6; rows?: number };

  // Teaser-Layout
  teaserAlign?: Align;
  teaserVAlign?: VAlign;
  teaserSize?: "sm" | "md" | "lg";
  teaserClamp?: number;
  teaserMinH?: number;
  teaserColorVar?: string;     // default "--text"

  // NEU: Titel-Farbe per Karte überschreibbar
  titleColorVar?: string;      // default "--cardtitel"
};

const spanCls: Record<Span,string> = {
  1:"sm:col-span-1", 2:"sm:col-span-2", 3:"sm:col-span-3", 4:"sm:col-span-4",
};
const ROW_PX = 8;

export default function ExpandableCards({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string|null>(null);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-6 auto-rows-[8px] sm:[grid-auto-flow:dense]">
      {items.map(it => {
        const open = openId === it.id;
        const baseSpan = spanCls[it.span ?? 2];
        const mode = it.expandMode ?? "full";
        const targetSpan = it.expandTo?.span ?? (mode === "full" ? 6 : (it.span ?? 2));
        const colClass = open ? (targetSpan === 6 ? "sm:col-span-6" : spanCls[targetSpan as Span]) : baseSpan;

        return (
          <Card
            key={it.id}
            item={it}
            open={open}
            className={colClass}
            baseRows={it.rows ?? 24}
            targetRows={it.expandTo?.rows}
            onToggle={() => setOpenId(open ? null : it.id)}
          />
        );
      })}
    </div>
  );
}

function Card({
  item, open, onToggle, className, baseRows, targetRows,
}: {
  item: Item; open: boolean; onToggle: () => void; className?: string;
  baseRows: number; targetRows?: number;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [rowSpan, setRowSpan] = useState(baseRows);

  useLayoutEffect(() => {
    const el = innerRef.current; if (!el) return;
    const staticPx = 120;
    const neededPx = el.scrollHeight + staticPx;
    const contentRows = Math.max(Math.ceil(neededPx / ROW_PX), 8);
    setRowSpan(open ? (targetRows ?? contentRows) : baseRows);
  }, [open, baseRows, targetRows, item.content]);

  // Teaser-Layout
  const alignCls =
    item.teaserAlign === "center" ? "text-center" :
    item.teaserAlign === "right"  ? "text-right"  : "text-left";
  const vAlignCls =
    item.teaserVAlign === "middle" ? "items-center" :
    item.teaserVAlign === "bottom" ? "items-end"   : "items-start";
  const sizeCls =
    item.teaserSize === "lg" ? "text-base" :
    item.teaserSize === "md" ? "text-sm"  : "text-xs";
  const clamp = item.teaserClamp ?? 2;
  const teaserMinH = item.teaserMinH ?? 72;

  const teaserColorVar = item.teaserColorVar ?? "--text";        // Light/Dark folgt globalem Text
  const titleColorVar  = item.titleColorVar  ?? "--cardtitel";    // eigene Titel-Farbe je Modus

  return (
    <article
      className={`col-span-1 ${className} rounded-2xl border shadow-md overflow-hidden
                  bg-[var(--card-bg)] border-[var(--card-border)]`}
      style={{ gridRowEnd: `span ${rowSpan}` }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center justify-between card-head transition-colors"
        aria-expanded={open}
        style={{ color: `var(${titleColorVar})` }}
      >
        <h3 className="font-semibold">{item.title}</h3>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>▾</span>
      </button>

      {/* Teaser */}
      <div className={`px-5 pt-2 pb-3 ${alignCls}`} style={{ color: `var(${teaserColorVar})` }}>
        <div className={`flex ${vAlignCls} ${sizeCls}`} style={{ minHeight: `${teaserMinH}px` }}>
          <p
            className="m-0"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: clamp,
              WebkitBoxOrient: "vertical" as any,
              overflow: "hidden",
            }}
          >
            {item.teaser}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        ref={innerRef}
        className={`px-5 pb-5 pt-1 prose prose-neutral dark:prose-invert max-w-none
                    transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        dangerouslySetInnerHTML={{ __html: item.content }}
        aria-hidden={!open}
      />
    </article>
  );
}
