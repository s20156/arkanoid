(function arkanoid() {
    const brickScore = [0, 1, 2, 3, 4];

    let score = 0;
    let lifes = 3;

    let paddleLeft;
    let ballLeft;
    let ballTop;
    let ballAnimUid = null;

    const gameElement = elementCreator("div", "game", "arkanoid");
    gameElement.setAttribute("role", "application");
    

    const panelElement = elementCreator("div", "panel", "panel");
    const arenaElement = elementCreator("div", "arena", "arena");
    const lifesElement = pannelElement({ text: "Lifes: ", value: lifes });
    lifesElement.classList.add("textdata");
    const scoreElement = pannelElement({ text: "Score: ", value: score });
    scoreElement.classList.add("textdata");
    const bricksElement = elementCreator("div", "bricks");
    const paddleElement = elementCreator("div", "paddle");
    const ballElement = elementCreator("div", "ball");

    function pannelElement({text, value}) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = text;
        const span = document.createElement('span');
        wrapper.appendChild(span);
        panelElement.appendChild(wrapper);
        span.dataset.value = value;
        return span;
    }

    function elementCreator(nodeType, className, id) {
        let node = document.createElement(nodeType);
        node.className = className;
        node.id = id;
        return node;
    }

    function getIndex(length) {
        return Math.floor(Math.random() * length);
    }

    bricksElement.innerHTML = Array.from(
        new Array(30),
        () => {
            const score = brickScore[getIndex(brickScore.length)];
            return `<div class="brick${score === 0 ? ' metal-brick' : ''}"${score ? ` data-score="${score}"` : ''}></div>`
        }
    ).join('');

    let deltaX = 1;
    let deltaY = -1;

    function ballStart() {
        return setInterval(function () {
            const {
                offsetWidth: arenaWidth,
                offsetHeight: arenaHeight
            } = arenaElement;

            if (ballElement.offsetLeft >= arenaWidth - ballElement.offsetWidth) {
                deltaX = -1;
            }

            if (ballElement.offsetLeft === 0) {
                deltaX = 1;
            }

            if (ballElement.offsetTop >= paddleElement.offsetTop - ballElement.offsetWidth) {
                if (ballLeft > paddleLeft && ballLeft < paddleLeft + paddleElement.offsetWidth) {
                    deltaY = -1;
                }
            }

            if (ballElement.offsetTop === 0) {
                deltaY = 1;
            }

            if (ballElement.offsetTop > arenaHeight - ballElement.offsetWidth) {
                lifes -= 1;
                reset();

                if (lifes <= 0) {
                    setTimeout(function () {
                        alert('GAME OVER');
                    }, 100);
                }
            }

            ballTop = ballElement.offsetTop + deltaY;
            ballLeft = ballElement.offsetLeft + deltaX;

            const {
                left: arenaLeft,
                top: arenaTop
            } = arenaElement.getBoundingClientRect();

            const brick = document.elementFromPoint(
                ballLeft + arenaLeft,
                ballTop + arenaTop
            );

            if (brick && brick.classList.contains('brick')) {
                deltaY *= -1;

                if (!brick.classList.contains('metal-brick')) {
                    score += Number(brick.dataset.score);
                    scoreElement.dataset.value = score;
                    brick.classList.add('hide');
                }
            }

            ballElement.style.top = `${ballTop}px`;
            ballElement.style.left = `${ballLeft}px`;
        }, 1);
    }

    function setBallStartPosition() {
        const {
            offsetLeft: paddleLeft,
            offsetWidth: paddleWidth,
            offsetTop: paddleTop
        } = paddleElement;
        const {offsetWidth: ballWidth} = ballElement;

        ballElement.style.left = `${paddleLeft + (paddleWidth / 2) - (ballWidth / 2)}px`;
        ballElement.style.top = `${paddleTop - ballWidth}px`;
    }

    const onMouseMove = function (e) {
        const {left: arenaLeft, right: arenaRight} = arenaElement.getBoundingClientRect();

        if (e.pageX > arenaLeft && e.pageX < arenaRight - paddleElement.offsetWidth) {
            paddleLeft = e.pageX - arenaLeft;
        }

        paddleElement.style.left = `${paddleLeft}px`;
    };

    const onTouchMove = onMouseMove;

    paddleElement.addEventListener(
        'mousedown',
        function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (!ballAnimUid) {
                ballAnimUid = ballStart();
            }

            document.addEventListener(
                'mousemove',
                onMouseMove,
                false
            );
        },
        false
    );

    document.addEventListener(
        'mouseup',
        function () {
            document.removeEventListener(
                'mousemove',
                onMouseMove,
                false
            );
        },
        false
    );

    arenaElement.appendChild(bricksElement);
    arenaElement.appendChild(paddleElement);
    arenaElement.appendChild(ballElement);
    gameElement.appendChild(panelElement);
    gameElement.appendChild(arenaElement);
    document.body.appendChild(gameElement);

    setBallStartPosition();

    function reset() {
        lifesElement.dataset.value  = lifes;
        setBallStartPosition();
        clearInterval(ballAnimUid);
        ballAnimUid = null;
    }
}());
