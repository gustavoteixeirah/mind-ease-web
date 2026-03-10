import { BackButton } from "./back-button";

type HeaderBackButtonProps = {
  title: string;
};

export default function HeaderBackButton({ title }: HeaderBackButtonProps) {
  return (
    <div className="flex items-center gap-4 pt-10 p-6">
      <BackButton />
      <h2
        className="font-atkinson"
        style={{ fontSize: "var(--title-font-size)" }}
      >
        {title}
      </h2>
    </div>
  );
}
