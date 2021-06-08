import formatResponseObject from "../formatResponseObject";
import {
  mockLinkedDefaultData,
  mockedResponse,
  mockTprekDefaultData,
} from "../mockResponseData";

it("Returns correctly formatted object", () => {
  const linked = formatResponseObject(mockLinkedDefaultData, "linked");
  const tprek = formatResponseObject(mockTprekDefaultData, "tprek");

  expect(linked).toEqual(mockedResponse);
  expect(tprek).toEqual(mockedResponse);
});
