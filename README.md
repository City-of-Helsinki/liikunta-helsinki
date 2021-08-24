#Liikunta-helsinki
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Developing locally

Run the development server:

```
yarn dev
# or
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available scripts

###`yarn dev`

Runs the application in development mode.
Open [http://localhost:3000](http://localhost:3000) to view in the browser.

The page will reload if you make changes.

###`yarn build`

Builds the production application in the `.next` folder.
Production build can be run locally with `yarn start`.

###`yarn test`

Launches the test runner in the interactive watch mode.

###`yarn get-translations`

Fetches translations from the CMS and generates translations files of them in `.json` format into `public/locales`.

## Internationalization

Translation files can be refreshed by running `yarn get-translations`.

Translations are sourced from the content management system.

The `next-i18next` library is used to distribute translations in the application. Required translations are marked with `serverSideTranslationsWithCommon` which automatically includes some common translations or with `serverSideTranslations` if the defaults are not useful.

## Contact

City of Helsinki Slack channel #liikuntahelsinki

## Learn more

You can learn more in the [NextJs documentation](https://nextjs.org/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
