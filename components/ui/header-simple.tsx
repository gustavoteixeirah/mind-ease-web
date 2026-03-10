import { ReactNode } from "react";

type HeaderSimpleProps = {
  title: string;
  children?: ReactNode;
};

export default function HeaderSimple({ title, children }: HeaderSimpleProps) {
  return (
    <div className="flex items-center pt-10 justify-between p-6 md:p-0 md:pt-0 md:pb-3">
      <h2 className="font-(--font-atkinson-family) text-[24px]">{title}</h2>
      {children}
    </div>
  );
}
