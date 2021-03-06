const menu = {
    container: document.getElementById('menu'),
    nav: document.getElementsByTagName('nav')[0],
    instructions: document.getElementById('instructions'),
    add: document.getElementById('addQuestion'),
    questionText: document.getElementById('questionText'),
    answerA: document.getElementById('answerA'),
    answerB: document.getElementById('answerB'),
    answerC: document.getElementById('answerC'),
    answerD: document.getElementById('answerD'),
    remove: document.getElementById('removeQuestion'),
    questions: document.getElementById('questionList'),
    questionsArr: [],
    questionPrompt: document.getElementById('questionPrompt')
};

function menuListeners() {
    document.getElementById('playButton').addEventListener('click', () => {
        initiate();
        menu.nav.style.display = 'none';
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
    document.getElementById('removeButton').addEventListener('click', () => {
        ws.send(JSON.stringify({ type: 'questionget' }));
        setTimeout(() => {
            for (let i = 0; i < questions.length; i++) {
                menu.questionsArr.push(document.createElement('button'));
                menu.questionsArr[i].addEventListener('click', () => {
                    menu.questionsArr[i].parentNode.removeChild(menu.questionsArr[i]);
                    questions.splice(questions.indexOf(menu.questionsArr[i]), 1);
                    ws.send(JSON.stringify({ type: 'questiondelete', data: questions }));
                });
                menu.questionsArr[i].innerHTML = questions[i].text;
                menu.questionsArr[i].setAttribute('class', 'questionButton');
                menu.questions.appendChild(menu.questionsArr[i]);
            }
            menu.nav.style.display = 'none';
            menu.remove.style.display = 'flex';
        }, 50); // Epic laziness of coding right here kids
    });
    document.getElementById('removeBack').addEventListener('click', () => {
        menu.questions.innerHTML = '';
        menu.questionsArr = [];
        menu.remove.style.display = 'none';
        menu.nav.style.display = 'flex';
    })
    setQuestion();
}

function setQuestion() {
    document.getElementById('submitnew').addEventListener('click', () => {
        if (ws.readyState = ws.OPEN) {
            ws.send(JSON.stringify({
                type: 'questionset',
                data: {
                    text: menu.questionText.value,
                    options: [answerA.value, answerB.value, answerC.value, answerD.value],
                    correct: document.querySelector('input[name="correct"]:checked').value
                }
            }));
        }
    })
};


addEventListener('load', menuListeners);