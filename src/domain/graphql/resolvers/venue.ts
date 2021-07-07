const Venue = {
  addressLocality({ addressLocality }) {
    return addressLocality;
  },
  dataSource({ dataSource }) {
    return dataSource;
  },
  description({ description }) {
    return description;
  },
  email({ email }) {
    return email;
  },
  id({ id }) {
    return id;
  },
  image({ image }) {
    return image;
  },
  infoUrl({ infoUrl }) {
    return infoUrl;
  },
  name({ name }) {
    return name;
  },
  position({ position }) {
    return position;
  },
  postalCode({ postalCode }) {
    return postalCode;
  },
  streetAddress({ streetAddress }) {
    return streetAddress;
  },
  telephone({ telephone }) {
    return telephone;
  },
  openingHours({ openingHours }) {
    return openingHours;
  },
  isOpen({ isOpen }) {
    return isOpen;
  },
  ontologyTree({ ontologyTree }) {
    if (!ontologyTree) {
      return [];
    }

    return ontologyTree;
  },
  ontologyWords({ ontologyWords }) {
    if (!ontologyWords) {
      return [];
    }

    return ontologyWords;
  },
};

export default Venue;
