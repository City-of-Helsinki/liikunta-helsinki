# Liikunta-helsinki

Liikunta-helsinki helps citizens find sports related content.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environments

Test: https://liikunta-helsinki.test.kuva.hel.ninja/

Production: https://liikunta-helsinki.prod.kuva.hel.ninja/

## Links

Issue board: https://helsinkisolutionoffice.atlassian.net/jira/software/c/projects/LIIKUNTA/boards/197

Sentry: https://sentry.io/organizations/city-of-helsinki/issues/?project=6160933

Codecov: https://app.codecov.io/gh/City-of-Helsinki/liikunta-helsinki

## Developing locally

Run the development server:

```
yarn install
cp .env.local.example .env.local
yarn dev
# or
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available scripts

### `yarn dev`

Runs the application in development mode.
Open [http://localhost:3000](http://localhost:3000) to view in the browser.

The page will reload if you make changes.

### `yarn build`

Builds the production application in the `.next` folder.
Production build can be run locally with `yarn start`.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn get-translations`

Fetches translations from the CMS and generates translations files of them in `.json` format into `public/locales`.

### `yarn generate:graphql`

Generates hooks and types out of graphql queries. Check codegen.yml for current configurations.

## Environment variables

The following environment variables can be configured for this application.

Note that Next has some special behaviour when it comes to passing environment variables: https://nextjs.org/docs/basic-features/environment-variables

| Name                                          | Description                                                                                                                                                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT`            | Headless-CMS GraphQL endpoint.                                                                                                                                                                                                      |
| `NEXT_PUBLIC_UNIFIED_SEARCH_GRAPHQL_ENDPOINT` | Unified search GraphQL endpoint.                                                                                                                                                                                                    |
| `NEXT_PUBLIC_NEXT_API_GRAPHQL_ENDPOINT`       | GraphQL endpoint for the BFF of this application.                                                                                                                                                                                   |
| `NEXT_PUBLIC_ALLOW_UNAUTHORIZED_REQUESTS`     | By toggling this variable, you may allow Apollo to handle requests without correct authorization. Our review environments do not have valid certificates (and won't), so we've allowed unauthorized request in them. Use with care! |
| `NEXT_PUBLIC_DEBUG`                           | When toggled on, the application will produce more detailed logs.                                                                                                                                                                   |
| `NEXT_PUBLIC_SENTRY_DSN`                      | Configure a project for Sentry.                                                                                                                                                                                                     |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT`              | Provide an unique name for each environment.                                                                                                                                                                                        |
| `NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE`        | When this environment variable is provided, and Sentry is configured properly, [Browser Tracing](https://docs.sentry.io/platforms/javascript/performance/instrumentation/automatic-instrumentation/) is configured for use.         |
| `NEXT_PUBLIC_HAUKI_ENABLED`                   | When this configuration is toggled on, Hauki related features are enabled. _**Default:** `true`_                                                                                                                                    |
| `NEXT_PUBLIC_MATOMO_ENABLED`                  | Control whether Matomo is enabled.                                                                                                                                                                                                  |
| `NEXT_PUBLIC_MATOMO_SITE_ID`                  | If Matomo is in use, provide site id to direct analytics into the correct destination.                                                                                                                                              |
| `NEXT_PUBLIC_DEFAULT_ISR_REVALIDATE_SECONDS`  | Default length of time in seconds between [NextJS's ISR's](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) regenerations. _**Default:** `10`_                                                 |

## Internationalization

Translation files can be refreshed by running `yarn get-translations`.

Translations are sourced from the content management system.

The `next-i18next` library is used to distribute translations in the application. Required translations are marked with `serverSideTranslationsWithCommon` which automatically includes some common translations or with `serverSideTranslations` if the defaults are not useful.

## Briefly on architecture

This section covers what integrations this application has an briefly describes the backend-for-frontend, because these parts of the application may lie a bit farther out of from its core.

### Integrations

This application integrates into various services.

| Name               | Description                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tprek**          | Tprek is used as the main source of data for venues. When make direct calls to TPREK on the venue details page for instance.                     |
| **Liikunta CMS**   | This headless CMS contains the data that defines menus, collections, SEO fields and more.                                                        |
| **Unified Search** | Unified Search provides an API we've used to build the search experience. It allows us to query for venues through a graphql endpoint.           |
| **Linked Events**  | Event related data is fetched from Linked Events.                                                                                                |
| **Hauki**          | Hauki contains structured data of opening hours. Hauki related features have been disabled for now as Hauki hasn't been officially released yet. |

### Backend-for-frontend

This application provides a GraphQL endpoint that's used as a BFF.

It allows:

- Querying of venues by ids from the new TPREK API. Making equivalent queries directly into the TPREK API (any version) is not possible to our knowledge.
- Querying of events from Linked Events. The API is sightly different to conform with values we receive from the Headless-CMS (check usage for details). The implementation also contains a caching layer.
- Querying of a venue. Enriches the data from TPREK with ontology data and opening hours information from Hauki (when integration is enabled).

## Contact

City of Helsinki Slack channel #liikuntahelsinki
