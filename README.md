# Bingo Card Generator

Bingo card generator with your custom phrases.
Works well for Oscar bingo, Game of Thrones tropes, or "Meeting Bingo".

You can print the cards or play in the browser.

## About Meeting Bingo

When you're in a meeting and a bit bored, amuse yourself by playing bingo. The game is to predict buzzwords that will be said during the meeting, arranging them in a grid in your notebook and yell Bingo! in the middle of the meeting for no apparent reason to your colleagues.

## Query Parameters

- `phrases` - can be used to directly encode phrases in base64. This is somewhat unsafe but allows sharing custom phrase sets between users
- `editable` - can be set to "false" to prevent changing phrases
- `phraseFile` - can specify the file to use, which are contained in `data` directory
    - "debate2020" - `data/debate-phrases.json`
    - if it ends with .json, search for that phrase file directly in `data` directory
- `contest` - can specify this to get custom landing pages. Right now the only valid value is "vp-debates-2020"

## Stack

Implemented as a Redux/React webapp.

## Run

Start any HTTP server to serve the root directory (ex. `http-server .`) then navigate to root.

## Sample Data

- contained in `data/stock-phrases.json`

## Build

during development:

```
yarn build:watch
```

before deploying:

```
yarn build:prod
```
