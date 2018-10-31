import manageTranslations from './dist/Application';

manageTranslations({
  messagesDirectory: './src/locales/extractedMessages',
  translationsDirectory: './src/locales/lang/',
  whitelistsDirectory: './src/locales/whitelists/',
  languages: ['nl'],
  singleMessagesFile: true
});
