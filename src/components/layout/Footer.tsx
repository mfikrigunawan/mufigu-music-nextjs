type Props = {
  linkLabel?: string | null;
  linkUrl: string;
  text?: string | null;
};

export function Footer({ linkLabel, linkUrl, text }: Props) {
  return (
    <footer className="mt-[clamp(3rem,7vw,7rem)] border-t border-line py-8 text-[.85rem] text-muted">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p></p>
        <p>
          © {new Date().getFullYear()}{' '}
          <a
            className="font-medium text-brand-primary underline underline-offset-[3px]"
            href={linkUrl}
          >
            {linkLabel}
          </a>{' '}
          · {text}
        </p>
      </div>
    </footer>
  );
}
