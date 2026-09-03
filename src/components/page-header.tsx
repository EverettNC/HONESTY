import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  children,
  actions,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <>
      <p className="kicker">{kicker}</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl text-fg">{title}</h1>
          {children ? <div className="mt-3 text-sm text-muted">{children}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </>
  );
}
