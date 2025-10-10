// src/components/ContentCards.tsx
import { useLayoutEffect, useRef, useState } from "react";

type Span = 1 | 2 | 3 | 4 | 5 | 6;
type Align = "left" | "center" | "right";
type VAlign = "top" | "middle" | "bottom";

export type ContentItem = {
  id: string;
  title: string;
  text: string;
  span?: Span;
  maxChars?: number;
  headerAlign?: Align;
  bodyAlign?: Align;
  bodyVAlign?: VAlign;
  bodyMinH?: number;
  expandable?: boolean;
  expandIfOverChars?: number;
  expandTo?: { span?: Span };
};

const spanCls: Record<Span, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
};

const ROW_PX = 8; // gleiche Einheit wie auto-rows-[8px] im Grid

export function ContentCard({
  item,
  open,
  onToggle,
  className = "",
}: {
  item: ContentItem;
  open: boolean;
  onToggle?: () => void;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rowSpan, setRowSpan] = useState(4);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => setRowSpan(Math.max(Math.ceil(el.scrollHeight / ROW_PX), 1));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
    };
  }, [
    open,
    item.text,
    item.maxChars,
    item.bodyMinH,
    item.headerAlign,
    item.bodyAlign,
    item.bodyVAlign,
  ]);

  const hAlign =
    item.headerAlign === "center"
      ? "text-center"
      : item.headerAlign === "right"
      ? "text-right"
      : "text-left";

  const bAlign =
    item.bodyAlign === "center"
      ? "text-center"
      : item.bodyAlign === "right"
      ? "text-right"
      : "text-left";

  const bV =
    item.bodyVAlign === "middle"
      ? "items-center"
      : item.bodyVAlign === "bottom"
      ? "items-end"
      : "items-start";

  const bodyMinH = item.bodyMinH ?? 0;

  const max = item.maxChars ?? 220;
  const textShown = open
    ? item.text
    : item.text.length > max
    ? item.text.slice(0, max).trimEnd() + " . . ."
    : item.text;

  const colorStyle = {
    color: "var(--text)" as const,
    borderColor: "currentColor" as const,
  };

  return (
    <article
      className={`${className} rounded-2xl bg-transparent`}
      style={{ gridRowEnd: `span ${rowSpan}` }}
    >
      <div ref={wrapperRef} className="border-y" style={colorStyle}>
        <div
          className={`w-full ${hAlign} px-4 py-1.5 flex items-center justify-between`}
        >
          <h3 className="m-0 font-bold leading-[1.2] tracking-[.01em] text-base sm:text-[1.0625rem]">
            {item.title}
          </h3>
          {item.expandable && (
            <button
              type="button"
              onClick={onToggle}
              className="card-chevron transition-transform select-none"
              aria-expanded={open}
              aria-label={open ? "Einklappen" : "Ausklappen"}
              style={{ color: "currentColor" }}
            >
              <span
                className={`${open ? "rotate-180" : ""} inline-block`}
              >
                ▾
              </span>
            </button>
          )}
        </div>
        <div className={`px-4 pt-2 pb-0 flex ${bV}`} style={{ minHeight: bodyMinH }}>
          <p className={`m-0 text-sm leading-relaxed ${bAlign}`}>{textShown}</p>
        </div>
      </div>
    </article>
  );
}

export default function ContentCards({ items }: { items: ContentItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      {items.map((it) => {
        const autoElig =
          typeof it.expandIfOverChars === "number"
            ? it.text.length > it.expandIfOverChars
            : false;
        const canExpand = it.expandable ?? autoElig;
        const open = canExpand && openId === it.id;

        const baseSpan = spanCls[it.span ?? 2];
        const tSpan = it.expandTo?.span ?? (open ? 6 : it.span ?? 2);
        const colClass = open ? spanCls[(tSpan as Span) ?? 6] : baseSpan;

        return (
          <ContentCard
            key={it.id}
            item={{ ...it, expandable: canExpand }}
            open={open}
            className={colClass}
            onToggle={() => canExpand && setOpenId(open ? null : it.id)}
          />
        );
      })}
    </>
  );
}
