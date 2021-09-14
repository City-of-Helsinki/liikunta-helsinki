import { Address } from "../../types";

export default function renderAddressToString(address: Address): string {
  return [address.streetName, address.zip, address.city]
    .filter((item) => item)
    .join(", ");
}
