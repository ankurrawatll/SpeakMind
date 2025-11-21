# Multilingual Setup Guide

## Overview
SpeakMind now supports 10 Indian languages plus English. Translations are generated using Gemini AI and stored in JSON files for fast loading.

## Supported Languages

1. **English** (en) - Default
2. **Hindi** (hi) - हिंदी
3. **Bengali** (bn) - বাংলা
4. **Telugu** (te) - తెలుగు
5. **Marathi** (mr) - मराठी
6. **Tamil** (ta) - தமிழ்
7. **Gujarati** (gu) - ગુજરાતી
8. **Kannada** (kn) - ಕನ್ನಡ
9. **Malayalam** (ml) - മലയാളം
10. **Punjabi** (pa) - ਪੰਜਾਬੀ
11. **Odia** (or) - ଓଡ଼ିଆ

## Architecture

### Components

1. **LanguageContext** (`src/contexts/LanguageContext.tsx`)
   - Manages current language state
   - Loads translation files
   - Provides `t()` function for translations

2. **LanguageToggle** (`src/components/LanguageToggle.tsx`)
   - Language selector dropdown
   - Positioned top-left on screens
   - Scrollable list of languages

3. **Translation Files** (`src/locales/*.json`)
   - One JSON file per language
   - Nested structure matching app sections
   - Supports parameter interpolation

### Translation File Structure

```json
{
  "app": {
    "name": "SpeakMind",
    "loading": "Loading..."
  },
  "home": {
    "hi": "Hi",
    "howAreYouFeeling": "How are you feeling today?"
  }
}
```

## Generating Translations

### Step 1: Ensure Gemini API Key is Configured

Make sure your `.env` file has:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Generate Translations

```bash
npm run generate-translations
```

This script will:
- Load English translations from `src/locales/en.json`
- Generate translations for all 10 Indian languages
- Save them to `src/locales/{lang}.json`
- Include rate limiting (3s between calls, 6s between languages)
- Handle rate limit errors gracefully
- Create fallback files if translation fails

### Rate Limiting

The script includes built-in rate limiting:
- **3 seconds** delay between API calls
- **6 seconds** delay between languages
- **15 seconds** wait if rate limited (429 error)

This prevents 403/429 errors from Gemini API.

## Using Translations in Components

### Basic Usage

```tsx
import { useLanguage } from '../contexts/LanguageContext'

function MyComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('home.hi')}</h1>
      <p>{t('home.howAreYouFeeling')}</p>
    </div>
  )
}
```

### With Parameters

```tsx
// Translation: "You've completed your {{duration}}-minute meditation session"
<p>{t('meditation.completedSession', { duration: 10 })}</p>
```

### Adding Language Toggle

```tsx
import LanguageWrapper from '../components/LanguageWrapper'

function MyScreen() {
  return (
    <LanguageWrapper>
      {/* Your screen content */}
    </LanguageWrapper>
  )
}
```

## Adding New Translations

### 1. Add to English File

Edit `src/locales/en.json`:

```json
{
  "newSection": {
    "newKey": "New translation text"
  }
}
```

### 2. Regenerate All Languages

```bash
npm run generate-translations
```

### 3. Use in Component

```tsx
{t('newSection.newKey')}
```

## Translation Keys Structure

Current sections:
- `app` - App-wide strings
- `auth` - Authentication screen
- `home` - Home screen
- `navigation` - Bottom navigation
- `meditation` - Meditation features
- `brainHealth` - EEG/Brain Health
- `profile` - Profile screen
- `askQuestion` - Ask Question screen
- `streaks` - Streaks screen
- `journal` - Journal screen
- `common` - Common UI elements

## Best Practices

1. **Use descriptive keys**: `home.howAreYouFeeling` not `home.text1`
2. **Group by feature**: Keep related translations together
3. **Use parameters**: For dynamic content like `{{duration}}`
4. **Keep keys consistent**: Use same structure across languages
5. **Test translations**: Check that all languages display correctly

## Troubleshooting

### Translations Not Loading

- Check browser console for errors
- Verify translation files exist in `src/locales/`
- Ensure file names match language codes exactly

### Missing Translations

- Check if key exists in `en.json`
- Run `npm run generate-translations` again
- Verify key path is correct (e.g., `home.hi` not `home.hi.text`)

### Rate Limit Errors

- The script handles rate limits automatically
- If you see 429 errors, the script will wait and retry
- Increase delays in `scripts/generate-translations.js` if needed

### Translation Quality

- Review generated translations
- Edit translation files manually if needed
- Re-run generator to update (will overwrite manual changes)

## Language Toggle Position

The language toggle appears in the **top-left corner** of screens that use `LanguageWrapper`. 

To add it to a screen:
```tsx
import LanguageWrapper from '../components/LanguageWrapper'

export default function MyScreen() {
  return (
    <LanguageWrapper>
      {/* Screen content */}
    </LanguageWrapper>
  )
}
```

## Future Enhancements

- [ ] Add more languages
- [ ] Translation management UI
- [ ] Context-aware translations
- [ ] RTL language support
- [ ] Translation versioning

