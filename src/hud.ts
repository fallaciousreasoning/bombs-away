import { newGame } from ".";

const hud = document.getElementById('hud');
const menu = document.getElementById('menu');
const motivator = document.getElementById('motivator');
const newGameButton = document.getElementById('new-game-button');

export const setMotivationalMessage = (message: string) => {
    motivator.innerText = message;
}

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