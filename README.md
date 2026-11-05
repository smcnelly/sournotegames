# Sour Note Games

The studio site. Plain HTML, CSS and JS with no build step, made for GitHub Pages.

## Run it locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Check it

```bash
python3 check.py
```

Fails if a page points at a file that isn't there. GitHub Pages is case-sensitive and a Mac isn't, so it compares exact names.

## Publish it

Push this folder to a GitHub repo, then Settings > Pages > Deploy from a branch > `main`, `/ (root)`. `.nojekyll` stops GitHub running Jekyll over it.

The site lives at `https://sournote.games/`, set by the `CNAME` file, with the domain's DNS pointing at GitHub. The social card (`og:image` and `og:url` in `index.html`) uses that address too.

## Where the Pickled material comes from

Everything is from `~/pickled`, nothing is mocked up:

| On the site | From the game |
|---|---|
| `img/screens/*` | `--screen=map\|shop\|over --shot=PATH`, doubled with nearest neighbour |
| `img/title/*` | The title screen in layers, so the logo can move as it does in the game: the scene without its players and ball, the letters from `art/logo.png`, the ribbon, Mr Pickle from `art/mascot.png`, and the scanlines and dark edge on top. Captured from a copy of the game at 860 x 360 by `trailer/title_layers.py`, which is local only |
| `video/pickled-trailer.mp4` | Cut from real matches and the game's own art, fonts, music and effects |
| `video/pickled-trailer.vtt` | The trailer's captions, written from the cut by `trailer/captions.py`. Run it again whenever the cut changes |
| `img/screens/pensioners-vs-monster.webp` | The game's Doreen and Maureen sprites and the Monster's key art |

The art and text will drift as the game changes, so reshoot before launch.

The fonts in `fonts/` are the Latin files of Pixelify Sans, Bricolage Grotesque and DM Mono from Google Fonts, under the licence in `fonts/OFL.txt`. They live here so the first paint doesn't wait on Google and visitors' addresses don't go there. Screenshots are WebP, lossless except the trailer's poster.

## When you change `site.css` or `site.js`

Raise the `?v=` number where all the pages link to them. GitHub lets browsers keep each file for up to 10 minutes, so without a new number a phone can pair a new page with the old stylesheet, which can look badly broken.

## Before it goes live

- When the Steam page exists, point the "Watch the trailer" button in `index.html` at it and relabel it to wishlist, and add its address to the game's structured data as `sameAs`.

## When you add a page

Add it to `sitemap.xml` and give it a description and a canonical link. `check.py` fails if you don't.
