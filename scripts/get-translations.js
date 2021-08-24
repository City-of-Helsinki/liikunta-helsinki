/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs").promises;
const path = require("path");

const axios = require("axios");

const TRANSLATIONS_SOURCE = "https://liikunta.content.api.hel.fi/graphql";
const LANGUAGES = ["fi", "sv", "en"];
const TRANSLATIONS_DESTINATION = "./public/locales";
const TRANSLATION_QUERY = `
  query TranslationQuery {
    translations(first: 1000) {
      nodes {
        title
        translations {
          key
          translations {
            en
            fi
            sv
          }
        }
      }
    }
  }
`;

async function fetchTranslations() {
  const res = await axios.post(TRANSLATIONS_SOURCE, {
    query: TRANSLATION_QUERY,
  });
  const translationDocuments = res.data.data.translations.nodes;

  console.debug(`Found ${translationDocuments.length} translation documents`);

  return translationDocuments;
}

async function prepareTranslationsDestination() {
  try {
    await fs.rm(TRANSLATIONS_DESTINATION, { recursive: true });
  } catch (e) {
    // Ignore file does not exist error; we don't need to delete it then
    if (e.code !== "ENOENT") {
      throw e;
    }
  }

  await fs.mkdir(TRANSLATIONS_DESTINATION);

  for (const language of LANGUAGES) {
    await fs.mkdir(path.join(TRANSLATIONS_DESTINATION, language));
  }
}

function dropFirstLevelFromKey(key) {
  const [, ...rest] = key.split(".");

  return rest.join(".");
}

async function saveTranslationDocumentToFileSystem(translationDocument) {
  try {
    const fileNameWithoutFormat = translationDocument.title
      .toLowerCase()
      // Replace spaces with underscores
      .replace(/ /g, "_");
    const fileName = `${fileNameWithoutFormat}.json`;

    for (const language of LANGUAGES) {
      const fileContentForLanguage = translationDocument.translations.reduce(
        (acc, translation) => ({
          ...acc,
          [dropFirstLevelFromKey(translation.key)]:
            translation.translations[language] || "Missing Translation",
        }),
        {}
      );

      await fs.writeFile(
        path.join(TRANSLATIONS_DESTINATION, language, fileName),
        JSON.stringify(fileContentForLanguage, null, 2)
      );
    }

    console.debug(
      `Saved translations for document ${translationDocument.title}`
    );
  } catch (e) {
    console.error(`Failed to save translation for document ${translationDocument.title}
    ERROR: ${e}`);
  }
}

async function getTranslations() {
  try {
    const translations = await fetchTranslations();

    await prepareTranslationsDestination();

    await Promise.all(
      translations.map((translation) =>
        saveTranslationDocumentToFileSystem(translation)
      )
    );

    console.info(
      `Saved translations for ${LANGUAGES.join(
        ", "
      )} into ${TRANSLATIONS_DESTINATION}`
    );
  } catch (e) {
    console.error(`Failed to get translations:
    ERROR: ${e}`);
  }
}

getTranslations();
