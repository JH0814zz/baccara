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

// 게임 시작
document.getElementById('deal-button').addEventListener('click', () => {
    if (betAmount > 0 && playerBet) {
        initializeGame();
        // 여기서 게임 진행 로직 추가
    } else {
        document.getElementById('result').innerText = '먼저 베팅하고 금액을 선택하세요.';
    }
});