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
    document.getElementById('instructionsButton').addEventListener('click', () => {
        menu.nav.style.display = 'none';
        menu.instructions.style.display = 'flex';
    });
    document.getElementById('instruBack').addEventListener('click', () => {
        menu.nav.style.display = 'flex';
        menu.instructions.style.display = 'none';
    });
    document.getElementById('addButton').addEventListener('click', () => {
        menu.nav.style.display = 'none';
        menu.add.style.display = 'inline-block';
    });
    document.getElementById('addBack').addEventListener('click', () => {
        menu.add.style.display = 'none';
        menu.nav.style.display = 'flex';
    })
}
addEventListener('load', menuStart);