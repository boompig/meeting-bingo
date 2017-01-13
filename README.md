# Corporate Meeting Bingo

## About

When you're in a meeting and a bit bored, amuse yourself by playing bingo. The game is to predict buzzwords that will be said during the meeting, arranging them in a grid in your notebook and yell Bingo! in the middle of the meeting for no apparent reason to your colleagues.

## Stack

Implemented as a web app with Mongo as a backing store.

- frontend: React + Flexbox
- backend: Node + Express
- store: Mongo

## Vagrant (Setup)

- node + npm
- mongo
- `npm init` + (set to private)
- `npm install -g webpack`
- Optional: `npm install -g nodemon`
- `npm install` (obviously)

## Run Instructions

- start MongoDB: `mongod --dbpath mongo-data` (where you created local directory mongo-data)
- start server: `npm start`

