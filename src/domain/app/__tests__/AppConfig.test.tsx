import AppConfig from "../AppConfig";

let env;
beforeAll(() => {
  env = process.env;
});

afterAll(() => {
  process.env = env;
});

test.each([
  {
    field: "cmsGraphqlEndpoint",
    mockEnvValue: "https://localhost/cms/graphql",
    envName: "NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT",
  },
  {
    field: "unifiedSearchGraphqlEndpoint",
    mockEnvValue: "https://localhost/unified-search/graphql",
    envName: "NEXT_PUBLIC_UNIFIED_SEARCH_GRAPHQL_ENDPOINT",
  },
  {
    field: "origin",
    mockEnvValue: "https://localhost",
    envName: "NEXT_PUBLIC_APP_ORIGIN",
  },
  {
    field: "nextApiGraphqlEndpoint",
    mockEnvValue: "https://localhost",
    envName: "NEXT_PUBLIC_APP_ORIGIN",
    expectToEqual: "https://localhost/api/graphql",
  },
])(
  "provides required config $field",
  ({ field, mockEnvValue, envName, expectToEqual }) => {
    // When exists, provides it
    process.env[envName] = mockEnvValue;
    expect(AppConfig[field]).toEqual(expectToEqual ?? process.env[envName]);

    // When it doesn't exists, errors
    delete process.env[envName];
    expect(() => AppConfig[field]).toThrowError(
      `Environment variable with name ${envName} was not found`
    );
  }
);

test.each([
  {
    field: "isHaukiEnabled",
    envName: "NEXT_PUBLIC_HAUKI_ENABLED",
  },
  {
    field: "debug",
    envName: "NEXT_PUBLIC_DEBUG",
  },
  {
    field: "allowUnauthorizedRequests",
    envName: "NEXT_PUBLIC_ALLOW_UNAUTHORIZED_REQUESTS",
  },
])("provides flag config $field", ({ field, envName }) => {
  // When undefined, returns false
  process.env[envName];
  expect(AppConfig[field]).toEqual(false);

  // When 0, returns false
  process.env[envName] = "0";
  expect(AppConfig[field]).toEqual(false);

  // When false, returns false
  process.env[envName] = "false";
  expect(AppConfig[field]).toEqual(false);

  // When 1, returns true
  process.env[envName] = "1";
  expect(AppConfig[field]).toEqual(true);

  // When true, returns true
  process.env[envName] = "true";
  expect(AppConfig[field]).toEqual(true);
});

test.each([
  {
    field: "defaultRevalidate",
    envName: "NEXT_PUBLIC_DEFAULT_ISR_REVALIDATE_SECONDS",
    defaultValue: 10,
  },
])("provides number config $field", ({ field, envName, defaultValue }) => {
  // When exists, provides it
  process.env[envName] = "10";
  expect(AppConfig[field]).toEqual(10);

  // When it doesn't exist
  delete process.env[envName];
  if (defaultValue) {
    expect(AppConfig[field]).toEqual(defaultValue);
  } else {
    expect(AppConfig[field]).toBeUndefined();
  }

  // When it's of wrong type, it errors
  process.env[envName] = "Some string";
  expect(() => AppConfig[field]).toThrowError(
    `${envName} must be a value that can be parsed into a number`
  );
});

test("provides configuration for Matomo", () => {
  process.env.NEXT_PUBLIC_MATOMO_ENABLED = "true";
  process.env.NEXT_PUBLIC_MATOMO_SITE_ID = "abc-123";

  expect(AppConfig.matomoConfiguration).toMatchInlineSnapshot(`
    Object {
      "disabled": false,
      "siteId": NaN,
      "srcUrl": "//webanalytics.digiaiiris.com/js/piwik.min.js",
      "trackerUrl": "//webanalytics.digiaiiris.com/js/tracker.php",
      "urlBase": "//webanalytics.digiaiiris.com/js/",
    }
  `);

  process.env.NEXT_PUBLIC_MATOMO_ENABLED = "1";
  expect(AppConfig.matomoConfiguration.disabled).toEqual(false);
});

test("gives access to misc configs", () => {
  expect(AppConfig.locales).toMatchInlineSnapshot(`
    Array [
      "fi",
      "sv",
      "en",
    ]
  `);
  expect(AppConfig.defaultLocale).toMatchInlineSnapshot(`"fi"`);
});
