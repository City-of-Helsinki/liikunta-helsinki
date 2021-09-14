import { format } from "date-fns";

import getEventsAsItems from "../getEventsAsItems";

function getEvent(fields) {
  return [
    {
      id: "tprek:12",
      name: "Test Event",
      shortDescription: "Short description",
      startTime: "2021-08-29T09:00:00",
      endTime: "2021-08-29T13:00:00",
      infoUrl: "",
      offers: [],
      images: [{ id: "123", alt: "", url: "" }],
      ...fields,
    },
  ];
}

describe("getEventsAsItems", () => {
  it("If the events list is falsy, return an empty list", () => {
    expect(getEventsAsItems(null)).toEqual([]);
  });

  it("Event is transformed into an item of expected values", () => {
    expect(getEventsAsItems(getEvent())).toMatchInlineSnapshot(`
      Array [
        Object {
          "href": "https://tapahtumat.hel.fi/fi/events/tprek:12",
          "id": "tprek:12",
          "image": "",
          "infoLines": Array [
            "Short description",
          ],
          "keywords": Array [],
          "pre": "29.8.2021, 09.00 – 13.00",
          "title": "Test Event",
        },
      ]
    `);
  });

  it("Pre value is rendered correctly when start and end time are during different dates", () => {
    expect(
      getEventsAsItems(
        getEvent({
          endTime: "2021-08-30T13:00:00",
        })
      )[0].pre
    ).toMatchInlineSnapshot(`"29 – 30.8.2021"`);
  });

  it("Pre should be rendered correctly if there is no end time", () => {
    expect(
      getEventsAsItems(
        getEvent({
          endTime: null,
        })
      )[0].pre
    ).toMatchInlineSnapshot(`"29.8.2021, 09.00"`);
  });

  it("Keywords should show that the event is free", () => {
    expect(
      getEventsAsItems(
        getEvent({
          offers: [
            {
              isFree: true,
            },
          ],
        })
      )[0].keywords
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "href": "",
          "isHighlighted": true,
          "label": "Maksuton",
        },
      ]
    `);
  });

  it("Keywords should show the price", () => {
    expect(
      getEventsAsItems(
        getEvent({
          offers: [
            {
              description: "Description",
              price: "20 €",
            },
          ],
        })
      )[0].keywords
    ).toMatchInlineSnapshot(`Array []`);
  });

  it("Keywords should show that the event is today", () => {
    expect(
      getEventsAsItems(
        getEvent({
          startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        })
      )[0].keywords
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "href": "",
          "label": "Tänään",
        },
      ]
    `);
  });
});
