const i18nRoutes = {
  "/search": [
    { source: "/haku", locale: "fi" },
    { source: "/sok", locale: "sv" },
  ],
  "/venues/:id": [
    { source: "/paikat/:id", locale: "fi" },
    { source: "/platser/:id", locale: "sv" },
  ],
};

module.exports = i18nRoutes;
