export default function capitalize(string: string) {
  const [firstCharacter, ...rest] = string.split("");

  return `${firstCharacter.toUpperCase()}${rest.join("")}`;
}
