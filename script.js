document.addEventListener('DOMContentLoaded', function() {
    const consoleBody = document.getElementById('consolebody');
    const visibleInput = document.getElementById('visible-input');
    const terminal = document.querySelector('.mac-terminal');
    let currentInput = '';
    const disclaimerText = 'Igen is vannak bugok a weboldalon de ha valami történik egy oldal refresh megoldhatja a problémát';
    const aboutText = 'Ez az iskoláról egy archív weboldal lesz, és idővel bővítve lesz, stb. Lesz még pár vicces/furcsa funkció is beépítve. Nincs végtelen időm, de ahogy tudom, csinálgatni fogom.<br>@zsombi9.b';
    const asciiArt = `
                       **################**                       
                  **##########################**                  
               *##################################*               
            **###**++--+-=+=+*:++#=+*++*#-=-+=+#####**            
          *###+-=-==+=-+:+===+-+=*=+++=**+==+=*-+++####*          
        *######=-==*+++******+++++++******+*==*-++#######*        
       *########**+=-::....:..........::...::-=+*##########       
     *#####*+-:......---:.==-:..----.:=:.-:..:.....:-+######*     
    *##*=:...::.-:----::-=-.:-..-==.:-=---..:=-=-:.=-...:+###*    
   *+:..::=:.==-:-----==-.-=-...-::==:.-=-=--==+-.==-.=-....-**   
  =:....--=::=----:.::--=+***########**++=-::::-------===-....-*  
 =:.....:-::-::-+*##############################*=-::-:--......=* 
 -........=+###+:..:*####*-....-*####################*+-.......:+ 
=:.......=#####+...:*###-....-*########################*-.......=+
=.......:*#####+...:*#+....:+###########################+.......:*
-.......=######+...:+:....=#############################*-.......+
:.......+######+.........:+#####*+++*######*+++++########=.......+
:.......+######+......:....+####=...-####*-....-*########=.......=
:.:---=:+######+....-*#=....=###=...-##*=....-*##########=:-===:.+
-.:----:=######+...:*###+....-##=...-#+:...:+############-..:=-:.+
=...--:.-######+...:*####+....:*=...::....=#############*:--==:..+
+..-==-=:+#####+:..:*#####+:...:-..........=############+.-----.-+
 -.:--==:-*#####################=.....-=....=##########*:..:--:.=*
 -:.::=--.=#####################=...:*##+....-*########-.-=-:=:-+ 
  -...---:.=####################=...-####*....:*######-.:-:-=::+# 
  +:.:=..--.-###################=...-#####*:....+###*:.-==-:..=*  
   *-.==-=-=..+#################+:::=######*-:::-+#=..-=--=-.+*   
     =..:-=:=-.:*################################+....=--=-.*     
      +:..-=-==:.:+*##########################*=..:=-=---:-*      
       +-.-==+-:--..-+*####################*=:..-::===-::=*       
         =-.:===---=::..-=+*##########*+=:...-==---:.:.=*         
           +-.:==-=-:-===-:..........::-=----=:.==:.:=*           
             +=:..:=-=:.=-===::=-:-:..--.-=-:---:.-+*             
                *+-....-=---=--==---..:=::=-:..=**                
                    *+-:.....:...::......::=+*                    
                          *++==---===+***                                                        
`;

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

    function executeCommand(command = null) {
        if (command) {
            currentInput = command;
        }
    
        if (currentInput.toLowerCase() === 'snake') {
            startSnakeGame();
            currentInput = '';  // Clear the current input immediately
            updateInput();
            return;  // Exit the function early
        }
    
        addOutputLine(`> ${currentInput}`);
        
        if (currentInput.toLowerCase() === 'help') {
            addOutputLine('Elérhető parancsok: help, clear, echo [szöveg], date, time, whoami,<br>disclaimer, play, stop, whomade, kkszki, about, ascii, how, socials//mégnemjo//, kill terminal, milyencsodasezanap, snake', true);
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
            addOutputLine('root');
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
        } else if (currentInput.toLowerCase() === 'forms') {
            addOutputLine('<a href="https://forms.gle/2DMyuaGhAfpTZbUaA" target="_blank">https://forms.gle/2DMyuaGhAfpTZbUaA</a>', true);
        } else if (currentInput.toLowerCase() === 'milyencsodasezanap') {
            window.location.href = 'https://f.olenyo.hu/norbi%20k%C3%A9pek%20szex/goofy/gaspar-laci-1_image_e63453a5d5534b9208bdfe414424.png';
        } else if (currentInput.toLowerCase() === 'ascii') {
            addOutputLine(asciiArt, true);
        } else if (currentInput.toLowerCase() === 'how') {
            addOutputLine('Így készült: html, js, css, claude.ai');
        } else if (currentInput.toLowerCase() === 'socials//mégnemjo//') {
            const socialsHtml = `
                <p><a href="https://www.facebook.com/kandomiskolc" target="_blank">https://www.facebook.com/kandomiskolc</a></p>
                <p><a href="https://www.twitch.tv/kkszki" target="_blank">https://www.twitch.tv/kkszki</a></p>
                <p><a href="https://www.kkszki.hu/" target="_blank">https://www.kkszki.hu</a></p>
                <p><a href="https://www.youtube.com/channel/UCV_wwFqieO3pwjailCbCdtg" target="_blank">https://www.youtube.com/channel/UCV_wwFqieO3pwjailCbCdtg</a></p>
            `;
            addOutputLine(socialsHtml, true);
        } else if (currentInput.toLowerCase() === 'kill terminal') {
            terminal.classList.add('closing');
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
    
    
    function startSnakeGame() {
        const gameContainer = document.createElement('div');
        gameContainer.classList.add('snake-game-container');
        consoleBody.appendChild(gameContainer);
    
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        gameContainer.appendChild(canvas);
    
        const ctx = canvas.getContext('2d');
    
        const box = 20;
        let snake = [];
        snake[0] = { x: 9 * box, y: 10 * box };
    
        let food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    
        let score = 0;
        let d;
    
        document.addEventListener('keydown', direction);
    
        function direction(event) {
            if (event.keyCode == 37 && d != 'RIGHT') {
                d = 'LEFT';
            } else if (event.keyCode == 38 && d != 'DOWN') {
                d = 'UP';
            } else if (event.keyCode == 39 && d != 'LEFT') {
                d = 'RIGHT';
            } else if (event.keyCode == 40 && d != 'UP') {
                d = 'DOWN';
            } else if (event.keyCode == 40 && d == 'UP') {
                d = 'DOWN';
            } else if (event.keyCode == 38 && d == 'DOWN') {
                d = 'UP';
            } else if (event.keyCode == 37 && d == 'RIGHT') {
                d = 'LEFT';
            } else if (event.keyCode == 39 && d == 'LEFT') {
                d = 'RIGHT';
            }
        }
    
        function collision(head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x == array[i].x && head.y == array[i].y) {
                    return true;
                }
            }
            return false;
        }
    
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = i == 0 ? 'green' : 'white';
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
    
                ctx.strokeStyle = 'red';
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }
    
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x, food.y, box, box);
    
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;
    
            if (d == 'LEFT') snakeX -= box;
            if (d == 'UP') snakeY -= box;
            if (d == 'RIGHT') snakeX += box;
            if (d == 'DOWN') snakeY += box;
    
            if (snakeX == food.x && snakeY == food.y) {
                score++;
                food = {
                    x: Math.floor(Math.random() * 19 + 1) * box,
                    y: Math.floor(Math.random() * 19 + 1) * box
                };
            } else {
                snake.pop();
            }
    
            let newHead = {
                x: snakeX,
                y: snakeY
            };
    
            if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
                clearInterval(game);
                addOutputLine(`> Game Over! Score: ${score}`);
                setTimeout(() => {
                    executeCommand('clear'); // Execute the clear command
                }, 1000); // Delay to show the game over message
                gameContainer.remove();
                return;
            }
    
            snake.unshift(newHead);
    
            ctx.fillStyle = 'white';
            ctx.font = '45px Changa one';
            ctx.fillText(score, 2 * box, 1.6 * box);
        }
    
        let game = setInterval(draw, 100);
    }
});