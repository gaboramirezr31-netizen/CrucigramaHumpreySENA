var rows = 11;
var cols = 12;

var words = [
    { word: 'ARCO', r: 1, c: 2, dir: 'H', num: 1 },
    { word: 'RESPIRACION', r: 3, c: 0, dir: 'H', num: 2 },
    { word: 'OPOSICION', r: 5, c: 2, dir: 'H', num: 3 },
    { word: 'CAIDA', r: 7, c: 4, dir: 'H', num: 4 },
    { word: 'RITMO', r: 9, c: 5, dir: 'H', num: 5 },
    { word: 'RECUPERACION', r: 0, c: 5, dir: 'V', num: 6 },
    { word: 'GRAVEDAD', r: 2, c: 2, dir: 'V', num: 7 },
    { word: 'SUCESION', r: 2, c: 8, dir: 'V', num: 8 },
    { word: 'APOLINEO', r: 0, c: 10, dir: 'V', num: 9 },
    { word: 'DIONISIACO', r: 1, c: 0, dir: 'V', num: 10 }
];

// Generar matriz lógica
var gridData = [];
for (var i = 0; i < rows; i++) {
    gridData[i] = [];
    for (var j = 0; j < cols; j++) {
        gridData[i][j] = null;
    }
}

words.forEach(function(w) {
    var curRow = w.r;
    var curCol = w.c;
    for (var i = 0; i < w.word.length; i++) {
        if (!gridData[curRow][curCol]) {
            gridData[curRow][curCol] = { letter: w.word[i], numbers: [] };
        }
        if (i === 0) {
            gridData[curRow][curCol].numbers.push(w.num);
        }
        if (w.dir === 'H') curCol++;
        else curRow++;
    }
});

// Función que dibuja el crucigrama en pantalla de manera segura
function drawCrossword() {
    var gridContainer = document.getElementById('grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = ''; // Limpiar residuos

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var cellDiv = document.createElement('div');
            cellDiv.className = 'cell';

            if (gridData[r][c]) {
                cellDiv.className = 'cell active';
                
                if (gridData[r][c].numbers.length > 0) {
                    var numSpan = document.createElement('span');
                    numSpan.className = 'number';
                    numSpan.innerText = gridData[r][c].numbers.join('/');
                    cellDiv.appendChild(numSpan);
                }

                var input = document.createElement('input');
                input.setAttribute('maxlength', '1');
                input.setAttribute('id', 'input-' + r + '-' + c);
                input.dataset.letter = gridData[r][c].letter;
                
                // Evento de salto de foco avanzado utilizando funciones anónimas
                (function(row, col) {
                    input.addEventListener('input', function(e) {
                        if (e.target.value.length === 1) {
                            var nextInput = document.getElementById('input-' + row + '-' + (col + 1)) || 
                                            document.getElementById('input-' + (row + 1) + '-' + col);
                            if (nextInput) nextInput.focus();
                        }
                    });
                })(r, c);

                cellDiv.appendChild(input);
            }
            gridContainer.appendChild(cellDiv);
        }
    }
}

function checkRealScore() {
    var correctWordsCount = 0;
    words.forEach(function(w) {
        var isWordCorrect = true;
        var hasEmptyCell = false;
        var curRow = w.r;
        var curCol = w.c;

        for (var i = 0; i < w.word.length; i++) {
            var input = document.getElementById('input-' + curRow + '-' + curCol);
            if (input) {
                var val = input.value.trim().toUpperCase();
                if (val === '') {
                    hasEmptyCell = true;
                    isWordCorrect = false;
                } else if (val !== w.word[i]) {
                    isWordCorrect = false;
                }
            }
            if (w.dir === 'H') curCol++;
            else curRow++;
        }
        if (isWordCorrect && !hasEmptyCell) {
            correctWordsCount++;
        }
    });
    return correctWordsCount;
}

function verifyGame() {
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var input = document.getElementById('input-' + r + '-' + c);
            if (input) {
                var val = input.value.trim().toUpperCase();
                if (val === '') {
                    input.parentElement.className = 'cell active';
                } else if (val === input.dataset.letter) {
                    input.parentElement.className = 'cell active correct';
                } else {
                    input.parentElement.className = 'cell active incorrect';
                }
            }
        }
    }

    var finalScore = checkRealScore();
    var resultBox = document.getElementById('resultBox');
    resultBox.style.display = 'block';

    if (finalScore === 10) {
        resultBox.style.backgroundColor = '#d4edda'; resultBox.style.color = '#155724';
        resultBox.innerHTML = '¡Excelente! Puntuación perfecta: ' + finalScore + '/10 respuestas correctas.';
    } else if (finalScore > 0) {
        resultBox.style.backgroundColor = '#fff3cd'; resultBox.style.color = '#856404';
        resultBox.innerHTML = '¡Vas por buen camino! Tienes ' + finalScore + '/10 palabras completamente correctas. Revisa los cuadros rojos o vacíos.';
    } else {
        resultBox.style.backgroundColor = '#ffd2d2'; resultBox.style.color = '#d61c1c';
        resultBox.innerHTML = 'Puntuación: 0/10 palabras completadas. Sigue intentándolo, verifica tus respuestas.';
    }
}

function giveUp() {
    var scoreBeforeGivingUp = checkRealScore();

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var input = document.getElementById('input-' + r + '-' + c);
            if (input) {
                input.value = input.dataset.letter;
                input.parentElement.className = 'cell active correct';
                input.disabled = true;
            }
        }
    }

    var resultBox = document.getElementById('resultBox');
    resultBox.style.display = 'block';
    resultBox.style.backgroundColor = '#e2e3e5'; resultBox.style.color = '#383d41';
    resultBox.innerHTML = 'Te has rendido. Respuestas correctas reveladas.<br>Lograste responder con éxito: <strong>' + scoreBeforeGivingUp + '/10 palabras</strong> antes de retirarte.';

    var giveupBtn = document.getElementById('giveupBtn');
    giveupBtn.innerText = 'Reiniciar Juego';
    giveupBtn.style.backgroundColor = '#6c757d';
    giveupBtn.onclick = function() { window.location.reload(); };
}

// Inicializar funciones cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', function() {
    drawCrossword();
    
    var verifyBtn = document.getElementById('verifyBtn');
    var giveupBtn = document.getElementById('giveupBtn');
    
    if(verifyBtn) verifyBtn.addEventListener('click', verifyGame);
    if(giveupBtn) giveupBtn.addEventListener('click', giveUp);
});
