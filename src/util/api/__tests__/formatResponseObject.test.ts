import formatResponseObject from "../formatResponseObject";
import {
  mockLinkedDefaultData,
  mockedResponse,
  mockTprekDefaultData,
} from "../mockResponseData";

it("Returns correctly formatted object", () => {
  const linked = formatResponseObject(mockLinkedDefaultData, "linked");
  const tprek = formatResponseObject(mockTprekDefaultData, "tprek");
  const {
    ontologyTreeIds,
    ontologyWordIds,
    ...linkedMockedResponse
  } = mockedResponse;

  expect(linked).toEqual(linkedMockedResponse);
  expect(tprek).toEqual(mockedResponse);
});

it("Can return trimmed translations", () => {
  const linked = formatResponseObject(mockLinkedDefaultData, "linked", "fi");
  const tprek = formatResponseObject(mockTprekDefaultData, "tprek", "fi");

  expect(tprek.name).toEqual(mockTprekDefaultData.name_fi);
  expect(linked.name).toEqual(mockLinkedDefaultData.name.fi);
});
