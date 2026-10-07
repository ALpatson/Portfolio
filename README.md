# Portfolio

Personal portfolio site for Alpatson Cobbina Siaw: plain HTML, Tailwind CSS and vanilla JavaScript.
Live at https://alpatsonportfolio.vercel.app/

## Run locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Styles

Tailwind is compiled to `assets/css/tailwind.css` (committed, so Vercel needs no build step).
After adding or changing Tailwind classes in the HTML, rebuild it:

```bash
npm install          # first time only
npm run build:css    # or: npm run watch:css while editing
```

Custom styles that aren't Tailwind utilities live in `assets/css/styles.css`.

## Contact form

The form posts to [FormSubmit](https://formsubmit.co), which forwards messages to the address in
`CONTACT_EMAIL` (`assets/js/main.js`). The first message sent triggers an activation email to that
inbox, so click the link in it once.
