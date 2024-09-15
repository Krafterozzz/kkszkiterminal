document.addEventListener('DOMContentLoaded', function() {
    const consoleBody = document.getElementById('consolebody');
    const visibleInput = document.getElementById('visible-input');
    const terminal = document.querySelector('.mac-terminal');
    let currentInput = '';
    const disclaimerText = 'Igen is vannak bugok a weboldalon de ha valami történik egy oldal refresh megoldhatja a problémát';
    const aboutText = 'Ez az iskoláról egy archív weboldal lesz, és idővel bővítve lesz, stb. Lesz még pár vicces/furcsa funkció is beépítve. Nincs végtelen időm, de ahogy tudom, csinálgatni fogom.<br>@zsombi9.b';
    const audioPlayer = document.getElementById('audio-player');
    const commandHistory = [];
    let historyIndex = -1;
    
    const maxLineLength = 80; // Maximális sorhossz

    function wrapText(text, maxLength) {
        let wrappedText = '';
        let currentLineLength = 0;

        text.split(' ').forEach(word => {
            if (currentLineLength + word.length + 1 > maxLength) {
                wrappedText += '<br>'; // Sortörés HTML-ben
                currentLineLength = 0;
            }
            wrappedText += word + ' ';
            currentLineLength += word.length + 1;
        });

        return wrappedText.trim();
    }

    function createInputLine() {
        const inputLine = document.createElement('div');
        inputLine.classList.add('body__row');
        inputLine.innerHTML = '<span class="body__row-arrow">></span> <span class="current-input"></span><span class="cursor">█</span>';
        consoleBody.appendChild(inputLine);
        scrollToBottom();
        return inputLine;
    }

    function updateInput() {
        const currentInputSpans = consoleBody.querySelectorAll('.current-input');
        const currentInputSpan = currentInputSpans[currentInputSpans.length - 1];
        if (currentInputSpan) {
            currentInputSpan.textContent = currentInput;
        }
    }

    function addOutputLine(text, isHtml = false) {
        const outputLine = document.createElement('div');
        outputLine.classList.add('body__row');
        if (isHtml) {
            outputLine.innerHTML = text;
        } else {
            outputLine.textContent = text;
        }
        consoleBody.insertBefore(outputLine, consoleBody.lastChild); // Insert before the input line
        scrollToBottom();
    }

    function executeCommand() {
        addOutputLine(`> ${currentInput}`);
        
        if (currentInput.toLowerCase() === 'help') {
            addOutputLine('Elérhető parancsok: help, clear, echo [szöveg], date, time, whoami,<br>disclaimer, play, stop, whomade, kkszki, about', true);
        } else if (currentInput.toLowerCase() === 'disclaimer') {
            addOutputLine(disclaimerText);
        } else if (currentInput.toLowerCase() === 'about') {
            const wrappedAboutText = wrapText(aboutText, maxLineLength);
            addOutputLine(wrappedAboutText, true);
        } else if (currentInput.toLowerCase() === 'clear') {
            consoleBody.innerHTML = ''; // Clear the console
            createInputLine(); // Recreate the input line
        } else if (currentInput.toLowerCase().startsWith('echo ')) {
            addOutputLine(currentInput.slice(5));
        } else if (currentInput.toLowerCase() === 'date') {
            const date = new Date().toLocaleDateString();
            addOutputLine(date);
        } else if (currentInput.toLowerCase() === 'time') {
            const time = new Date().toLocaleTimeString();
            addOutputLine(time);
        } else if (currentInput.toLowerCase() === 'whoami') {
            addOutputLine('student');
        } else if (currentInput.toLowerCase() === 'play') {
            audioPlayer.play();
            addOutputLine('Zene lejátszódik... "stop"-al lehet megállitani');
        } else if (currentInput.toLowerCase() === 'stop') {
            if (!audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                addOutputLine('A zene megállt');
            } else {
                addOutputLine('A zene nem játszik, így nem lehet megállítani.');
            }
        } else if (currentInput.toLowerCase() === 'whomade') {
            addOutputLine('@zsombi9.b');
        } else if (currentInput.toLowerCase() === 'kkszki') {
            addOutputLine('<a href="https://www.kkszki.hu" target="_blank">https://www.kkszki.hu</a>', true);
        } else if (currentInput.trim() !== '') {
            addOutputLine(`Ismeretlen parancs: ${currentInput}`);
        }
        
        // Add the command to the history
        if (currentInput.trim() !== '') {
            commandHistory.push(currentInput);
        }
        
        currentInput = '';  // Clear the current input
        historyIndex = -1;  // Reset history index
        updateInput();
        scrollToBottom();
    }

    function scrollToBottom() {
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }

    visibleInput.addEventListener('input', function(event) {
        currentInput = visibleInput.value;
        updateInput();
    });

    visibleInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            executeCommand();
            visibleInput.value = ''; // Clear the visible input field
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                }
                currentInput = commandHistory[commandHistory.length - 1 - historyIndex];
                visibleInput.value = currentInput;
                updateInput();
                // Mozgassuk a kurzort a szöveg végére
                visibleInput.setSelectionRange(currentInput.length, currentInput.length);
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex > 0) {
                    historyIndex--;
                    currentInput = commandHistory[commandHistory.length - 1 - historyIndex];
                } else {
                    historyIndex = -1;
                    currentInput = '';
                }
                visibleInput.value = currentInput;
                updateInput();
                // Mozgassuk a kurzort a szöveg végére
                visibleInput.setSelectionRange(currentInput.length, currentInput.length);
            }
        }
    });

    // Focus the visible input field on mobile devices
    document.addEventListener('click', function() {
        visibleInput.focus();
    });

    createInputLine(); // Initial line creation

    // Cursor blinking effect
    setInterval(() => {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }
    }, 500);

    // Focus the visible input field on mobile devices
    if (window.innerWidth <= 768) {
        visibleInput.focus();
    }

    // Draggable functionality
    const draggableContainer = document.getElementById('draggable-container');
    const draggableHeader = document.getElementById('draggable-header');
    let isDragging = false;
    let offsetX, offsetY;

    // Center the draggable container
    const centerContainer = () => {
        const containerWidth = draggableContainer.offsetWidth;
        const containerHeight = draggableContainer.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        draggableContainer.style.left = `${(windowWidth - containerWidth) / 2}px`;
        draggableContainer.style.top = `${(windowHeight - containerHeight) / 2}px`;
    };

    centerContainer(); // Center it initially

    draggableHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - draggableContainer.offsetLeft;
        offsetY = e.clientY - draggableContainer.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            draggableContainer.style.left = `${e.clientX - offsetX}px`;
            draggableContainer.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Re-center the container on window resize
    window.addEventListener('resize', centerContainer);

    // Ensure the container does not resize below the minimum dimensions
    const minWidth = 300; // Példa minimális szélesség
    const minHeight = 200; // Példa minimális magasság

    const enforceMinSize = () => {
        const containerWidth = draggableContainer.offsetWidth;
        const containerHeight = draggableContainer.offsetHeight;

        if (containerWidth < minWidth) {
            draggableContainer.style.width = `${minWidth}px`;
        }
        if (containerHeight < minHeight) {
            draggableContainer.style.height = `${minHeight}px`;
        }
    };

    window.addEventListener('resize', enforceMinSize);
    enforceMinSize(); // Ensure the initial size is enforced




});

