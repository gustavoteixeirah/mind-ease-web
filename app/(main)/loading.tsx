export default function AppLoading() {
  return (
    <div className="p-6 md:p-8 animate-pulse">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex gap-4">
          <div className="size-14 shrink-0 rounded-full bg-[#e8e8e8]" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-40 rounded bg-[#e8e8e8]" />
            <div className="h-4 w-32 rounded bg-[#e8e8e8]" />
          </div>
        </div>
        <div className="h-24 rounded-2xl bg-[#e8e8e8]/60" />
        <div className="h-32 rounded-2xl bg-[#e8e8e8]/60" />
      </div>
    </div>
  );
}
