# Corporate Meeting Bingo

## About

When you're in a meeting and a bit bored, amuse yourself by playing bingo. The game is to predict buzzwords that will be said during the meeting, arranging them in a grid in your notebook and yell Bingo! in the middle of the meeting for no apparent reason to your colleagues.

## Stack

Implemented as a web app with Mongo as a backing store.

- frontend: React
- backend: Node + Express
- store: Mongo

## Setup

- `vagrant up`

## Run Instructions

- start server inside Vagrant box: `npm start`
- port forwarded @ 8080
    - from host box navigate to [here](http://localhost:8080)

## Sample Data

- contained in `stock_phrases.yaml`
- to insert into mongodb run `python tools/yaml_check.py stock_phrases.yaml` from within Vagrant
    - should set up virtualenv or install requirements as sudo first
