// 기존 변수는 그대로 유지 
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
            deck.push({ suit, value });
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
    switch (suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
    }
}

// 베팅 금액을 설정하는 함수
function setBet(amount) {
    if (amount > balance) {
        alert('잔고가 부족합니다.');
        return;
    }
    betAmount = amount;
    document.getElementById('result').innerText = `${playerBet.charAt(0).toUpperCase() + playerBet.slice(1)}에 ${betAmount}원이 배팅되었습니다.`;
    document.getElementById('deal-button').disabled = false; // 베팅 후 딜 버튼 활성화
}

// 베팅 설정
document.querySelectorAll('.bet-container').forEach(container => {
    container.addEventListener('click', (e) => {
        playerBet = e.currentTarget.getAttribute('data-bet');
        document.querySelectorAll('.bet-container').forEach(c => c.classList.remove('active'));
        container.classList.add('active');
    });
});

// 칩 버튼 클릭 이벤트
document.querySelectorAll('.chip-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const chipAmount = parseInt(e.target.getAttribute('data-chip'));
        setBet(chipAmount);
    });
});

// 무료 돈 받기
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
        alert('먼저 베팅을 해주세요!');
        return;
    }
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert('유효한 베팅 금액을 입력하세요.');
        return;
    }
    balance -= betAmount; // 딜 시작 시 베팅 금액 차감
    document.getElementById('balance').innerText = `Balance: ${balance}`;
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
        // 승부 판단
        resolveGame(playerScore, bankerScore);
    }, 4000);
}

// 승부 판단 및 추가 카드 로직
function resolveGame(playerScore, bankerScore) {
    if (playerScore >= 8 || bankerScore >= 8) {
        // 8 이상인 경우 바로 승부
        determineResult(playerScore, bankerScore);
    } else if (playerScore === bankerScore && (playerScore === 6 || playerScore === 7)) {
        // 6, 7 동점인 경우 타이
        const result = '무승부!';
        balance += betAmount; // 베팅 금액 반환
        document.getElementById('balance').innerText = `Balance: ${balance}`;
        animateResult(result);
        return;
    } else {
        // 5 이하인 경우 추가 카드 로직
        handleAdditionalCards(playerScore, bankerScore);
    }
}

// 추가 카드 처리
async function handleAdditionalCards(playerScore, bankerScore) {
    // 플레이어의 추가 카드
    if (playerScore <= 5) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
        playerHand.push(deck.pop());
        displayHand(playerHand, 'player-cards');
        const newPlayerScore = calculateHandValue(playerHand);
        document.getElementById('player-score').innerText = `Score: ${newPlayerScore}`;
        // 추가 카드 처리 후 점수 확인
        if (newPlayerScore >= 8) {
            determineResult(newPlayerScore, bankerScore);
            return;
        }
    }
    // 뱅커의 추가 카드
    if (bankerScore <= 5) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
        bankerHand.push(deck.pop());
        displayHand(bankerHand, 'banker-cards');
        const newBankerScore = calculateHandValue(bankerHand);
        document.getElementById('banker-score').innerText = `Score: ${newBankerScore}`;
        // 추가 카드 처리 후 점수 확인
        if (newBankerScore >= 8) {
            determineResult(calculateHandValue(playerHand), newBankerScore);
            return;
        }
    }
    // 최종 승부
    determineResult(calculateHandValue(playerHand), calculateHandValue(bankerHand));
}

// 결과 판단 및 잔고 조정
function determineResult(playerScore, bankerScore) {
    let result;
    if (playerScore > bankerScore) {
        result

 = '플레이어 승리!';
        if (playerBet === 'player') {
            balance += betAmount * 1.95;
        }
    } else if (playerScore < bankerScore) {
        result = '뱅커 승리!';
        if (playerBet === 'banker') {
            balance += betAmount * 1.95;
        }
    } else {
        result = '무승부!';
        balance += betAmount; // 베팅 금액 반환
    }
    document.getElementById('balance').innerText = `Balance: ${balance}`;
    animateResult(result);
    gameHistory.unshift(result);
    if (gameHistory.length > 10) gameHistory.pop();
    updateHistoryDisplay();
}

// 게임 기록 표시
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

// 버튼 클릭 이벤트 추가
document.getElementById('deal-button').addEventListener('click', playGame);