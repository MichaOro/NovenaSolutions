// src/components/ExpandableCards.tsx
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Span = 1 | 2 | 3 | 4 | 5 | 6;
type Align = "left" | "center" | "right";
type VAlign = "top" | "middle" | "bottom";

export type ExpandItem = {
  id: string;
  title: string;
  teaser: string;
  content: string; // HTML
  span?: Span;
  expandMode?: "full" | "inline";
  expandTo?: { span?: Span | 6 };

  teaserAlign?: Align;
  teaserVAlign?: VAlign;
  teaserSize?: "sm" | "md" | "lg";
  teaserClamp?: number;
  teaserMinH?: number;
  teaserColorVar?: string; // CSS var, z.B. "--text"
  titleColorVar?: string;  // CSS var, z.B. "--cardtitel"
};

const spanCls: Record<Span, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
};

const ROW_PX = 8; // zu auto-rows-[8px] im MasonryGrid passend

export function ExpandableCard({
  item,
  open,
  onToggle,
  className = "",
}: {
  item: ExpandItem;
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rowSpan, setRowSpan] = useState(4);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const rows = Math.max(Math.ceil(el.scrollHeight / ROW_PX), 1);
      setRowSpan(rows);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
  }, [open, item.teaser, item.content, item.teaserClamp, item.teaserMinH]);

  const alignCls =
    item.teaserAlign === "center" ? "text-center" : item.teaserAlign === "right" ? "text-right" : "text-left";
  const vAlignCls =
    item.teaserVAlign === "middle" ? "items-center" : item.teaserVAlign === "bottom" ? "items-end" : "items-start";
  const sizeCls = item.teaserSize === "lg" ? "text-base" : item.teaserSize === "md" ? "text-sm" : "text-xs";
  const clamp = item.teaserClamp ?? 2;
  const teaserMinH = item.teaserMinH ?? 72;

  const teaserColorVar = item.teaserColorVar ?? "--text";
  const titleColorVar = item.titleColorVar ?? "--cardtitel";

  const styleVars: CSSProperties = {
    // @ts-expect-error CSS var passt zur Runtime
    "--cardtitel": `var(${titleColorVar})`,
  };

  return (
    <article
      className={`${className} rounded-2xl border shadow-md overflow-hidden bg-[var(--card-bg)] border-[var(--card-border)]`}
      style={{ gridRowEnd: `span ${rowSpan}`, ...styleVars }}
    >
      <div ref={wrapperRef}>
        <button
          onClick={onToggle}
          className="w-full text-left px-5 py-1 flex items-center justify-between card-head transition-colors"
          aria-expanded={open}
        >
          <h3 className="card-heading">{item.title}</h3>
          <span className={`card-chevron transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
            ▾
          </span>
        </button>

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

        <div
          className={`px-5 pb-5 pt-1 prose prose-neutral dark:prose-invert max-w-none transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          dangerouslySetInnerHTML={{ __html: item.content }}
          aria-hidden={!open}
        />
      </div>
    </article>
  );
}

export default function ExpandableCards({ items }: { items: ExpandItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      {items.map((it) => {
        const open = openId === it.id;
        const mode = it.expandMode ?? "full";
        const targetSpan = it.expandTo?.span ?? (mode === "full" ? 6 : it.span ?? 2);
        const baseSpan = spanCls[it.span ?? 2];
        const colClass = open ? spanCls[(targetSpan as Span) ?? 6] : baseSpan;

        return (
          <ExpandableCard
            key={it.id}
            item={it}
            open={open}
            className={colClass}
            onToggle={() => setOpenId(open ? null : it.id)}
          />
        );
      })}
    </>
  );
}
