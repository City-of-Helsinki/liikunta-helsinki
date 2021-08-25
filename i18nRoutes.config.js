const i18nRoutes = {
  "/search": [
    { source: "/haku", locale: "fi" },
    { source: "/sok", locale: "sv" },
  ],
  "/search/map": [
    { source: "/haku/kartta", locale: "fi" },
    { source: "/sok/karta", locale: "sv" },
  ],
  "/venues/:id": [
    { source: "/paikat/:id", locale: "fi" },
    { source: "/platser/:id", locale: "sv" },
  ],
  "/collections/:slug": [
    { source: "/kokoelmat/:slug", locale: "fi" },
    { source: "/collections/:slug", locale: "sv" },
  ],
};

module.exports = i18nRoutes;
