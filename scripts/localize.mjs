import { readFile, writeFile, mkdir } from 'node:fs/promises';

const template = await readFile(new URL('../content/page.html', import.meta.url), 'utf8');
const translations = JSON.parse(await readFile(new URL('../content/translations.json', import.meta.url), 'utf8'));
const languages = { pl: 'Polski', uk: 'Українська', en: 'English', ru: 'Русский' };
const messageKeys = ['menuOpen', 'menuClose', 'required', 'fileTitle', 'fileName', 'fileContact', 'fileColor', 'fileIdea', 'fallbackIdea', 'success'];
export async function localize(root = '.') {
  for (const [lang, name] of Object.entries(languages)) {
    const values = {
      ...translations[lang], lang,
      languageLabel: translations[lang].languageLabel,
      languageLinks: Object.entries(languages).map(([code, label]) => `<a href="/${code}/" lang="${code}" hreflang="${code}" aria-label="${label}"${code === lang ? ' aria-current="page"' : ''}>${code.toUpperCase()}</a>`).join(''),
      alternateLinks: Object.keys(languages).map(code => `<link rel="alternate" hreflang="${code}" href="/${code}/">`).join('\n  ') + '\n  <link rel="alternate" hreflang="x-default" href="/">',
      messages: JSON.stringify(Object.fromEntries(messageKeys.map(key => [key, translations[lang][key]]))).replaceAll('<', '\\u003c'),
    };
    const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!(key in values)) throw new Error(`Missing ${lang} translation: ${key}`);
      return values[key];
    });
    await mkdir(`${root}/${lang}`, { recursive: true });
    await writeFile(`${root}/${lang}/index.html`, html);
    if (lang === 'pl') await writeFile(`${root}/index.html`, html);
  }
}
if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) await localize();
