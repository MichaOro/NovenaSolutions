import { PropsWithChildren } from "react";
type Cols = 1|2|3|4|5|6;
const colCls: Record<Cols,string> = {
  1:"sm:grid-cols-1",2:"sm:grid-cols-2",3:"sm:grid-cols-3",
  4:"sm:grid-cols-4",5:"sm:grid-cols-5",6:"sm:grid-cols-6",
};
export default function MasonryGrid({
  children, rowPx=8, cols=6, gapRem=1,
}: PropsWithChildren<{ rowPx?:number; cols?:Cols; gapRem?:number }>) {
  return (
    <div
      className={`grid grid-cols-1 ${colCls[cols]} sm:[grid-auto-flow:dense] auto-rows-[var(--row)]`}
      style={{ ["--row" as any]: `${rowPx}px`, gap: `${gapRem}rem` }}
    >
      {children}
    </div>
  );
}
