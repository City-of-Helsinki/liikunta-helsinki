const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  i18n: {
    // These values should correspond to the slug field in the headless CMS
    locales: ["fi", "sv", "en"],
    // Will be used for non-localized paths
    defaultLocale: "fi",
  },
  async rewrites() {
    return [
      {
        source: "/haku",
        destination: "/search",
      },
      {
        source: "/sok",
        destination: "/search",
      },
    ];
  },
};
