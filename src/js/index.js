import * as Todo from './modules/todo.js';
import * as Typing from './modules/typing.js';
import * as Slide from './modules/slide.js';

const nav = document.querySelector('#nav');
const cover = document.querySelector('#cover');
const appNames = ['todo', 'typing', 'slide-puzzle', 'memory-card', 'life'];

appNames.forEach(appName => {
    const menu = document.createElement('a');
    menu.classList.add('nav-menu');
    menu.textContent = appName.toUpperCase();
    menu.addEventListener('click', e => {
        cover.classList.remove('active');
        const appEls = document.querySelectorAll('.app');
        appEls.forEach(appEl => {
            appEl.classList.remove('active');
        })
        const appEl = document.getElementById(appName);
        appEl.classList.add('active');
        const navMenus = document.querySelectorAll('.nav-menu');
        navMenus.forEach(navMenu => {
            navMenu.classList.remove('active');
        })
        menu.classList.add('active');
    })
    nav.appendChild(menu);
})