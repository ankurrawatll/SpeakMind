import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const languages = ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or']
const enPath = path.join(__dirname, '../src/locales/en.json')
const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'))

languages.forEach(lang => {
  const langPath = path.join(__dirname, `../src/locales/${lang}.json`)
  fs.writeFileSync(langPath, JSON.stringify(enContent, null, 2), 'utf-8')
  console.log(`Created placeholder: ${lang}.json`)
})

console.log('✅ All placeholder translation files created!')

