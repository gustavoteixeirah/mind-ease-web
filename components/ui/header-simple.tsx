type HeaderSimpleProps = {
  title: string;
};

export default function HeaderSimple({ title }: HeaderSimpleProps) {
  return (
    <div className="flex items-center gap-4 pt-10 p-6">
      <h2 className="font-(--font-atkinson-family) text-[24px]">{title}</h2>
    </div>
  );
}
