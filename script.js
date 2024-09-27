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

// 칩 선택
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
        betAmount = parseInt(e.target.getAttribute('data-value'));
        document.getElementById('result').innerText = `베팅 금액: ${betAmount}`;
    });
});

// 베팅 클릭 이벤트
document.querySelectorAll('.bet-area').forEach(area => {
    area.addEventListener('click', (e) => {
        playerBet = e.target.getAttribute('data-bet');
        document.getElementById('result').innerText = `${playerBet}에 베팅했습니다.`;
        document.getElementById('deal-button').disabled = false;
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
    document.getElementById('deal-button').disabled = true;
}

// 점수 계산 (Ace는 1점, 2-9는 그 값, 10과 JQK는 0점)
function calculateScore(hand) {
    let score = 0;
    hand.forEach(card => {
        let value = card.value;
        if (value === 'A') {
            score += 1;
        } else if (['J', 'Q', 'K', '10'].includes(value)) {
            score += 0;
        } else {
            score += parseInt(value);
        }
    });
    return score % 10; // Baccarat는 9를 넘으면 나머지 사용
}

// 카드 한 장 뽑기
function drawCard() {
    return deck.pop();
}

// 게임 시작
document.getElementById('deal-button').addEventListener('click', () => {
    if (betAmount > 0 && playerBet) {
        initializeGame();

        // 플레이어와 뱅커가 각각 두 장의 카드를 뽑는다
        playerHand.push(drawCard());
        playerHand.push(drawCard());
        bankerHand.push(drawCard());
        bankerHand.push(drawCard());

        // 플레이어와 뱅커의 점수를 계산
        const playerScore = calculateScore(playerHand);
        const bankerScore = calculateScore(bankerHand);

        // 화면에 카드와 점수를 표시
        document.getElementById('player-cards').innerHTML = playerHand.map(card => `<span class="card ${card.suit}">${card.value}</span>`).join('');
        document.getElementById('banker-cards').innerHTML = bankerHand.map(card => `<span class="card ${card.suit}">${card.value}</span>`).join('');
        document.getElementById('player-score').innerText = `Score: ${playerScore}`;
        document.getElementById('banker-score').innerText = `Score: ${bankerScore}`;

        // 게임 결과 결정
        let result = '';
        if (playerScore > bankerScore) {
            result = '플레이어 승리!';
            if (playerBet === 'player') balance += betAmount * 2; // 플레이어에 베팅했으면 승리
        } else if (bankerScore > playerScore) {
            result = '뱅커 승리!';
            if (playerBet === 'banker') balance += betAmount * 1.95; // 뱅커에 베팅했으면 승리
        } else {
            result = '무승부!';
            if (playerBet === 'tie') balance += betAmount * 8; // 무승부에 베팅했으면 승리
        }

        // 잔액 업데이트 및 결과 표시
        document.getElementById('balance').innerText = `Balance: ${balance}`;
        document.getElementById('result').innerText = result;

        // 게임 기록 저장
        gameHistory.push({ playerScore, bankerScore, result });
        document.getElementById('game-history').innerHTML += `<div class="history-item">플레이어: ${playerScore}, 뱅커: ${bankerScore}, ${result}</div>`;
        
        // 다음 게임을 위해 베팅 버튼 비활성화
        document.getElementById('deal-button').disabled = true;
    } else {
        document.getElementById('result').innerText = '먼저 베팅하고 금액을 선택하세요.';
    }
});