export default function ImageLoader({ src, width, quality }) {
  return `${process.env.NEXT_PUBLIC_ROOT_URL}/${src}?w=${width}&q=${
    quality || 75
  }`;
}
