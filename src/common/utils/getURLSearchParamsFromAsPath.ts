export default function getURLSearchParamsFromAsPath(
  asPath: string
): URLSearchParams {
  const [, searchParams] = asPath.split("?");

  return new URLSearchParams(searchParams);
}
