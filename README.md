# Bombs Away

A simple physics survival game. The aim is to make it as far down as possible before exploding.

This game was inspired by 7bomb on Windows Phone 7, back in the day. It contains a custom game engine and physics engine and the build contains no external dependencies (WebPack and Typescript are required to build the project).

In addition, the game is a valid PWA, meaning that it should be installable and will work offline.

A live version of the game is available at https://bombs-away.now.sh/

## Gameplay

### Desktop

<kbd>A</kbd> or <kbd>←</kbd> to go left.

<kbd>D</kbd> or <kbd>→</kbd> to go right.

<kbd>Space</kbd> or <kbd>W</kbd> to jump.

### Mobile 
Tap the left side of the screen to go left, and the right side to go right. Tap the other side of the screen (when moving in a direction) to jump.

### Power-ups

![green triangle](https://lingtalfi.com/services/pngtext?color=32cd32&size=15&text=%E2%96%B2): Laser. Cuts out a space to sit in, safe from bombs. Tap player to use.

![yellow triangle](https://lingtalfi.com/services/pngtext?color=ffff00&size=15&text=%E2%96%B2): Grenade. Makes an explosion, flinging away bombs (and potentially you!) and destroying terrain. Tap player to use.

![purple triangle](https://lingtalfi.com/services/pngtext?color=5a005a&size=15&text=%E2%96%B2): Agility: temporarily increase your speed and agility. Used on contact.

![purple triangle](https://lingtalfi.com/services/pngtext?color=517ea0&size=15&text=%E2%96%B2): Invulnerability: temporarily makes you invulnerable! Used on contact.

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