bolides.menuStart = function() {
    bolides.menuListeners();
}
bolides.menuListeners = function() {
    document.getElementById('playButton').onclick = function() {
        bolides.initiate();
        bolides.menu.nav.style.display = 'none';
        bolides.menu.username.style.display = 'block';
        document.getElementById('bolide').style.display = 'none';
    }
    document.getElementById('instructionsButton').onclick = function() {
        bolides.menu.nav.style.display = 'none';
        bolides.menu.instructions.style.display = 'block';
    }
    document.getElementById('instruBack').onclick = function() {
        bolides.menu.nav.style.display = 'flex';
        bolides.menu.instructions.style.display = 'none';
    };
}