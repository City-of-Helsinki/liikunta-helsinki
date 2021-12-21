import venueQueryResolver from "./venueQueryResolver";

// Implementation is a bit ugly here.
//
// Reason is that the most recent version of the tprek API does not allow for
// units to be found based on an ID list. This is possible with an earlier
// version of the API, but it provides ontologies as list of strings. Because
// it does not provide the ID, they aren't very useful for us in this project.
//
// I chose this compromise because it's technically simple.
//
// Note the lack of pagination support.
export default async function resolver(_, { ids }, context, __) {
  return await Promise.all(
    ids.map((idWithSource: string) =>
      venueQueryResolver(_, { id: idWithSource }, context, __)
    )
  );
}
