import { API_ORIGIN } from "../api";

export default function ProductImage({
  src,
  size = "h-12 w-12",
  emojiSize = "text-4xl",
  fill = false,
}) {
  const isImage = src && (src.startsWith("/") || src.startsWith("http"));
  const url = src && src.startsWith("/api") ? API_ORIGIN + src : src;

  // fill = true: stretch to the full width of the parent as a square
  const box = fill ? "w-full aspect-square" : size;

  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden ${box}`}>
      {isImage ? (
        <img
          src={url}
          alt=""
          className={`h-full w-full ${fill ? "object-cover" : "object-contain"}`}
        />
      ) : (
        <span className={fill ? "text-5xl" : emojiSize}>{src}</span>
      )}
    </div>
  );
}