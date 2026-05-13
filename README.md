# I Hate Docs — The AI Document OS

Production-grade MVP for a SaaS AI PDF editor powered by Supabase.

## Quick start

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure env
   ```bash
   cp .env.example .env
   # Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   ```
3. Run the app
   ```bash
   npm run dev
   ```

## Supabase setup

1. Create a Supabase project
2. Run migrations
   ```bash
   supabase db push
   ```
3. Create the `documents` storage bucket (migration includes policy setup)
4. Set Edge Function secrets
   ```bash
   supabase secrets set OPENAI_API_KEY=your_key
   supabase secrets set AI_PROVIDER_BASE_URL=https://api.openai.com/v1
   supabase secrets set AI_MODEL=gpt-4o-mini
   ```
5. Deploy Edge Functions
   ```bash
   supabase functions deploy ai-chat
   supabase functions deploy process-document
   supabase functions deploy summarize-document
   supabase functions deploy export-pdf
   ```

## MVP flow

- Sign up/sign in with Supabase Auth
- Upload PDFs to Supabase Storage
- Extract text client-side with pdf.js and save pages + chunks
- View PDFs and add annotations
- AI chat via Supabase Edge Function (`ai-chat`)
- Export annotated PDF client-side with pdf-lib

## Known MVP limitations

- Server-side PDF processing is stubbed (client-side extraction is used).
- Export runs on the client (Edge Function export is a placeholder).
- Multi-document comparison uses summaries where available.

## Project structure

```
src/
  app/
  pages/
  components/
  hooks/
  lib/
  styles/
supabase/
  migrations/
  functions/
```
