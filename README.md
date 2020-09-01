# Bombs Away

A simple physics survival game. The aim is to make it as far down as possible before exploding.

This game was inspired by 7bomb on Windows Phone 7, back in the day. It contains a custom game engine and physics engine and the build contains no external dependencies (WebPack and Typescript are required to build the project).

In addition, the game is a valid PWA, meaning that it should be installable and will work offline.

A live version of the game is available at https://bombs-away.now.sh/

## Development

Initialize submodules

    git submodule init
    git submodule update

Install Packages

    npm i

Run a development server

    npm run start

## Build for production

(assuming submodules and packages are installed)

    npm run build

The `public` directory can be served with any static web server (I generally use [serve](https://www.npmjs.com/package/serve)).