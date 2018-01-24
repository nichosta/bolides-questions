const menu = {
    container: document.getElementById('menu'),
    nav: document.getElementsByTagName('nav')[0],
    instructions: document.getElementById('instructions'),
    username: document.getElementById('username'),
    add: document.getElementById('addQuestion')
};

menuStart = function() {
    menuListeners();
};

menuListeners = function() {
    document.getElementById('playButton').addEventListener('click', () => {
        initiate();
        menu.nav.style.display = 'none';
        menu.username.style.display = 'block';
        document.getElementById('bolide').style.display = 'none';
    });
}
document.getElementById('instructionsButton').onclick = function() {
    menu.nav.style.display = 'none';
    menu.instructions.style.display = 'block';
}
document.getElementById('instruBack').onclick = function() {
    menu.nav.style.display = 'flex';
    menu.instructions.style.display = 'none';
};
addEventListener('load', menuStart);