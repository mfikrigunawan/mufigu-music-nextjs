/** Tiga batang equalizer; bergerak saat `playing`, diam (tetap terlihat) saat dijeda. */
export function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span className="eq" data-playing={playing} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
