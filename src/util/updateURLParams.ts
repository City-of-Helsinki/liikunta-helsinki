export default function updateUrlParams(
  asPath: string,
  key: string,
  value: string
): string {
  const [, searchParams] = asPath.split("?");
  const urlParams = new URLSearchParams(searchParams);
  urlParams.set(key, value);
  return urlParams.toString();
}
