const Event = {
  id({ id }) {
    return id;
  },
  name({ name }, _, { language }) {
    return name?.[language];
  },
  shortDescription({ short_description }, _, { language }) {
    return short_description?.[language];
  },
  startTime({ start_time }) {
    return start_time;
  },
  endTime({ end_time }) {
    return end_time;
  },
  images({ images }) {
    return images.map(({ id, url, alt_text }) => ({ id, url, alt: alt_text }));
  },
  offers({ offers }, _, { language }) {
    return offers.map(({ is_free, description, infoUrl, price }) => ({
      isFree: is_free,
      description: description?.[language],
      infoUrl: infoUrl?.[language],
      price: price?.[language],
    }));
  },
  infoUrl({ info_url }, _, { language }) {
    return info_url?.[language];
  },
};

export default Event;
