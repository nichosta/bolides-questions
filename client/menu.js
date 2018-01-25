const menu = {
    container: document.getElementById('menu'),
    nav: document.getElementsByTagName('nav')[0],
    instructions: document.getElementById('instructions'),
    username: document.getElementById('username'),
    add: document.getElementById('addQuestion'),
    questionText: document.getElementById('questionText'),
    answerA: document.getElementById('answerA'),
    answerB: document.getElementById('answerB'),
    answerC: document.getElementById('answerC'),
    answerD: document.getElementById('answerD'),
};

function menuListeners() {
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
    });
    setQuestion();
}

function setQuestion() {
    document.getElementById('submitnew').addEventListener('click', () => {
        if (ws.readyState = ws.OPEN) {
            window[menu.questionText.value] = {
                options: [answerA.value, answerB.value, answerC.value, answerD.value],
                correct: document.querySelector('input[name="correct"]:checked').value
            };
            ws.send(JSON.stringify(window[menu.questionText.value]));
            delete window[menu.questionText.value];
        }
    });
}


addEventListener('load', menuListeners);