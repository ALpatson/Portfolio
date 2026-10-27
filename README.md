# Portfolio

Personal portfolio of Alpatson Cobbina Siaw. One page, in English (`/en`) and French (`/fr`), built with Next.js 16, Tailwind CSS 4 and Motion. The hero chessboard replays Morphy's Opera Game, and visitors can play a game against a small built-in engine (`chess.js` handles the rules).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build`, then `npm start`.

## Where things live

- `src/content/en.ts`, `src/content/fr.ts`: all text, projects, journey and skills. Edit content here, not in the components.
- `src/app/globals.css`: the colour palette (one block of CSS variables at the top).
- `src/components/`: one file per section, plus `ChessBoard.tsx` and `KnightField.tsx`.
- `src/proxy.ts`: sends `/` to `/en` or `/fr` based on the browser language, and redirects the old `*.html` pages.
- `public/`: images, the CV (`resume.pdf`) and the chess pieces.

## Contact form

The form posts to [FormSubmit](https://formsubmit.co), which forwards messages to the address in `src/components/Contact.tsx`.

Chess pieces: cburnett set from Lichess, CC BY-SA 3.0.
