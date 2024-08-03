let deck = [];
let playerHand = [];
let bankerHand = [];
let playerBet = '';
let betAmount = 0;
let balance = 0;
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let gameHistory = [];

// 카드 덱 생성
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({suit, value});
        }
    }
}

// 카드 덱 섞기
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// 카드 점수 계산
function getCardValue(card) {
    if (card.value === 'A') {
        return 1;
    } else if (['K', 'Q', 'J', '10'].includes(card.value)) {
        return 0;
    } else {
        return parseInt(card.value);
    }
}

function calculateHandValue(hand) {
    const total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    return total % 10;
}

// 카드 핸드 표시
function displayHand(hand, elementId) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = '';
    hand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.suit}`;
        cardDiv.innerText = `${card.value} ${getSuitSymbol(card.suit)}`;
        handElement.appendChild(cardDiv);
    });
}

// 카드 모양 심볼 반환 함수
function getSuitSymbol(suit) {
    switch(suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
    }
}

// 베팅 설정
document.querySelectorAll('.bet-button').forEach(button => {
    button.addEventListener('click', (e) => {
        playerBet = e.target.getAttribute('data-bet');
        betAmount = parseInt(document.getElementById('bet-amount').value);
        if (isNaN(betAmount) || betAmount <= 0) {
            document.getElementById('result').innerText = '베팅할 금액을 입력해주세요.';
            return;
        }
        if (betAmount > balance) {
            document.getElementById('result').innerText = '잔고가 부족합니다.';
            return;
        }
        document.getElementById('result').innerText = `${playerBet.charAt(0).toUpperCase() + playerBet.slice(1)}에 ${betAmount}원이 배팅되었습니다.`;
        document.getElementById('deal-button').disabled = false; // 베팅 후 딜 버튼 활성화
    });
});

// 무료 돈받기
document.getElementById('free-money-button').addEventListener('click', () => {
    balance += 10000;
    document.getElementById('balance').innerText = `Balance: ${balance}`;
});

// 게임 초기화
function initializeGame() {
    createDeck();
    shuffleDeck();
    playerHand = [];
    bankerHand = [];
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('banker-cards').innerHTML = '';
    document.getElementById('player-score').innerText = 'Score: 0';
    document.getElementById('banker-score').innerText = 'Score: 0';
    document.getElementById('result').innerText = '';
    document.getElementById('deal-button').disabled = true; // 딜 버튼 비활성화
}

// 애니메이션 효과 추가
function animateResult(result) {
    const resultElement = document.getElementById('result');
    resultElement.style.transform = 'scale(1.1)';
    resultElement.style.opacity = '0';
    setTimeout(() => {
        resultElement.innerText = result;
        resultElement.style.transform = 'scale(1)';
        resultElement.style.opacity = '1';
    }, 300);
}

// 게임 실행
function playGame() {
    if (!playerBet) {
        alert('Please place your bet first!');
        return;
    }

    betAmount = parseInt(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert('Please enter a valid bet amount.');
        return;
    }

    balance -= betAmount; // 딜 시작 시 베팅 금액 차감
    document.getElementById('balance').innerText = `Balance: ${balance}`;

    // 잔고 확인 및 무료 돈 받기 안내
    if (balance <= 0) {
        alert('잔고가 부족합니다. 무료 돈 받기를 클릭하세요.');
        document.getElementById('deal-button').disabled = true; // 잔고 부족 시 딜 버튼 비활성화
        return;
    }

    initializeGame();

    setTimeout(() => {
        // 플레이어의 첫 번째 카드 분배
        playerHand.push(deck.pop());
        displayHand(playerHand, 'player-cards');
    }, 1000);

    setTimeout(() => {
        // 뱅커의 첫 번째 카드 분배
        bankerHand.push(deck.pop());
        displayHand(bankerHand, 'banker-cards');
    }, 2000);

    setTimeout(() => {
        // 플레이어의 두 번째 카드 분배
        playerHand.push(deck.pop());
        displayHand(playerHand, 'player-cards');
    }, 3000);

    setTimeout(() => {
        // 뱅커의 두 번째 카드 분배
        bankerHand.push(deck.pop());
        displayHand(bankerHand, 'banker-cards');

        // 점수 계산
        const playerScore = calculateHandValue(playerHand);
        const bankerScore = calculateHandValue(bankerHand);

        // 점수 표시
        document.getElementById('player-score').innerText = `Score: ${playerScore}`;
        document.getElementById('banker-score').innerText = `Score: ${bankerScore}`;

        // 결과 판단 및 잔고 조정
        let result;
        if (playerScore > bankerScore) {
            result = 'Player Wins!';
            if (playerBet === 'player') {
                balance += betAmount * 1.95;
                result = `플레이어 승리! ${betAmount * 1.95}원이 지급되었습니다.`;
            } else {
                result = `플레이어 승리! ${betAmount}원이 차감되었습니다.`;
            }
        } else if (playerScore < bankerScore) {
            result = 'Banker Wins!';
            if (playerBet === 'banker') {
                balance += betAmount * 2;
                result = `뱅커 승리! ${betAmount * 2}원이 지급되었습니다.`;
            } else {
                result = `뱅커 승리! ${betAmount}원이 차감되었습니다.`;
            }
        } else {
            result = 'It\'s a Tie!';
            if (playerBet === 'tie') {
                balance += betAmount * 8;
                result = `무승부! ${betAmount * 8}원이 지급되었습니다.`;
            } else {
                result = `무승부! ${betAmount}원이 차감되었습니다.`;
            }
        }

        document.getElementById('balance').innerText = `Balance: ${balance}`;
        animateResult(result);
        addToHistory(result);
    }, 4000);
}

// 베팅 금액 제한 기능
document.getElementById('bet-amount').addEventListener('input', function(e) {
    let maxBet = Math.min(balance, 100000); // 최대 베팅 금액을 잔고나 100,000 중 작은 값으로 제한
    if (parseInt(e.target.value) > maxBet) {
        e.target.value = maxBet;
    }
});

// 게임 이력 추가
function addToHistory(result) {
    gameHistory.unshift(result);
    if (gameHistory.length > 10) gameHistory.pop();
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyElement = document.getElementById('game-history');
    historyElement.innerHTML = '';
    gameHistory.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'history-item';
        resultDiv.innerText = result;
        historyElement.appendChild(resultDiv);
    });
}

document.getElementById('deal-button').addEventListener('click', playGame);