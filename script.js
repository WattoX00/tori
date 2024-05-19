/*
    History quiz

    Author: WattoX00
    Date:   19/05/2024
*/
document.addEventListener('DOMContentLoaded', () => {
    const repoUrl = 'https://api.github.com/repos/WattoX00/Tortenelem/contents/tema';
    const menu = document.getElementById('menu');
    const questionDiv = document.getElementById('question');
    const answerInput = document.getElementById('answerInput');
    const descriptionDiv = document.getElementById('description');
    const nextQuestionButton = document.getElementById('nextQuestion');
    const footerContainer = document.getElementById('footerContainer');
    const footerArrow = document.getElementById('footerArrow');
    let isFooterVisible = true;

    window.onload = () => {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';
    };
    footerArrow.addEventListener('mouseenter', function () {
        isFooterVisible = !isFooterVisible;
        toggleFooterVisibility();
    });

    footerContainer.addEventListener('click', function () {
        isFooterVisible = false;
        toggleFooterVisibility();
    });

    let currentFileContent = [];
    let currentQuestionIndex = 0;

    fetch(repoUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.type === 'dir') {
                    const menuItem = document.createElement('div');
                    menuItem.textContent = item.name;
                    menuItem.addEventListener('click', () => loadTextFiles(item.url));
                    menu.appendChild(menuItem);
                }
            });
        });

    function loadTextFiles(directoryUrl) {
        fetch(directoryUrl)
            .then(response => response.json())
            .then(data => {
                menu.innerHTML = '';
                const backButton = document.createElement('div');
                backButton.textContent = 'Vissza';
                backButton.classList.add('menuItem', 'backButton');
                backButton.addEventListener('click', () => {
                    fetch(repoUrl)
                        .then(response => response.json())
                        .then(data => {
                            menu.innerHTML = '';
                            data.forEach(item => {
                                if (item.type === 'dir') {
                                    const menuItem = document.createElement('div');
                                    menuItem.textContent = item.name;
                                    menuItem.addEventListener('click', () => loadTextFiles(item.url));
                                    menu.appendChild(menuItem);
                                }
                            });
                        });
                });
                menu.appendChild(backButton);

                data.forEach(item => {
                    if (item.type === 'file' && item.name.endsWith('.txt')) {
                        const fileItem = document.createElement('a');
                        fileItem.textContent = item.name;
                        fileItem.classList.add('menuItem');
                        fileItem.href = '#';
                        fileItem.addEventListener('click', () => {
                            loadTextFileContent(item.download_url);
                            menuContainer.classList.remove('show');
                        });
                        menu.appendChild(fileItem);
                    }
                });
            });
    }

    function loadTextFileContent(fileUrl) {
        fetch(fileUrl)
            .then(response => response.text())
            .then(text => {
                currentFileContent = text.split('\n').map(line => {
                    const [question, answer, description] = line.split(';');
                    return { question, answer, description };
                });
                currentQuestionIndex = 0;
                displayQuestion();
            });
    }

    function displayQuestion() {
        if (currentQuestionIndex < currentFileContent.length) {
            const { question } = currentFileContent[currentQuestionIndex];
            questionDiv.textContent = question;
            answerInput.value = '';
            descriptionDiv.textContent = '';
        } else {
            questionDiv.textContent = 'Kvíz befejezve!';
            answerInput.style.display = 'none';
            nextQuestionButton.style.display = 'none';
        }
    }

    answerInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const userAnswer = answerInput.value.trim();
            const { answer, description } = currentFileContent[currentQuestionIndex];
            const correctAnswer = answer.split('-')[0];
            const userAnswerFirstPart = userAnswer.split('-')[0];
            if (userAnswerFirstPart.toLowerCase() === correctAnswer.toLowerCase() || userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                descriptionDiv.textContent = description;
            } else {
                descriptionDiv.textContent = 'Incorrect! Try again.';
            }
        }
    });

    nextQuestionButton.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    const showAnswerButton = document.getElementById('showAnswer');
    const modal = document.getElementById('myModal');
    const modalAnswer = document.getElementById('modalAnswer');

    showAnswerButton.addEventListener('click', () => {
        const { answer } = currentFileContent[currentQuestionIndex];
        showModalAnswer(answer);
    });

    function showModalAnswer(answer) {
        modal.style.display = 'block';
        modalAnswer.textContent = answer;
    
        // Copy answer to clipboard
        const clipboardTextArea = document.getElementById('clipboardTextArea');
        clipboardTextArea.value = answer;
        clipboardTextArea.select();
        document.execCommand('copy');
    }
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    const closeModalButton = document.getElementsByClassName('close')[0];
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    });

    const toggleMenuButton = document.getElementById('toggleMenuButton');
    const menuContainer = document.getElementById('menuContainer');

    toggleMenuButton.addEventListener('click', () => {
        menuContainer.classList.toggle('show');
    });

    function toggleFooterVisibility() {
        footerContainer.classList.toggle('active', isFooterVisible);
        footerArrow.classList.toggle('hidden', isFooterVisible);
    }
    function showModalAnswer(answer) {
        modal.style.display = 'block';
        modalAnswer.textContent = answer;
        const clipboardTextArea = document.getElementById('clipboardTextArea');
        clipboardTextArea.value = answer;
        clipboardTextArea.select();
        document.execCommand('copy');
    }

});
