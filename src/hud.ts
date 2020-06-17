import { newGame } from ".";

const hud = document.getElementById('hud');
const menu = document.getElementById('menu');
const newGameButton = document.getElementById('new-game-button');

export const showMenu = () => {
    menu.classList.remove('hidden');
}

export const hideMenu = () => {
    menu.classList.add('hidden');
}

newGameButton.addEventListener('click', () => {
    hideMenu();
    newGame();
});