//スタート画面
const startPage = document.querySelector('#ty-start-page');
//入力画面
const typingGame = document.querySelector('#ty-game');

//入力画面のタイトル
const titleTime = document.querySelector('#ty-title-time');

//タイマー
const timer = document.querySelector('#ty-timer');

//selectコントロール
const timeSelectEl = document.querySelector('.ty-time-select');

//タイピングゲームのセクション
const typing = document.querySelector('#typing');

//戻るボタン
const backToStart = document.querySelector('#ty-back-to-start');

//結果画面
const resultContainer = document.querySelector('#ty-result-container');

//入力画面の入力テキストエリア
const textarea = document.querySelector('#ty-textarea');

//名言表示欄
const quote = document.querySelector('#ty-quote');
//著者を表示
const author = document.querySelector('#ty-author-name');

//1分あたりの文字数
const LPM = document.querySelector('#ty-LPM');

//名言の再表示欄
const quoteReview = document.querySelector('#ty-quote-review');

//制限時間
let timeLimit = 30;
//残り時間
let remainingTime;
//タイピングタブが選択されているか
let isActive = false;
//タイピングゲームが実行中であるか
let isPlaying = false;
let intervalId = null;
let quotes;

//入力文字数
let typedCount;

//1分間に入力した文字数
let LPMCount;

//selectコントロールから選択した制限時間を取得する
timeSelectEl.addEventListener('change', () => {
    timeLimit = timeSelectEl.value;
})

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        "ここにescキーを押した時の処理を書く"
    }
})

window.addEventListener('keypress', e => {

    //ナビゲーションでタイピングが選択されている場合のみ実行する
    isActive = typing.classList.contains('active');
    //Enterをクリックすると、start関数を実行
    if (e.key === 'Enter' && isActive && !isPlaying) {
        start();
        isActive = false;
        isPlaying = true;
    }
    return;
})

async function start() {
    //スタート画面から入力画面にshowクラスの付替え
    startPage.classList.remove('show');
    typingGame.classList.add('show');

    //タイトルに秒数を表示
    titleTime.textContent = timeLimit;

    //スタート時は制限時間=残り時間
    remainingTime = timeLimit;

    //スタート時は残り時間を表示
    timer.textContent = remainingTime;

    //APIから名言をfetchする
    await fetchAndRenderQuotes();

    textarea.disabled = false;
    textarea.focus();
    typedCount = 0;

    intervalId = setInterval(() => {
        remainingTime -= 1;
        timer.textContent = remainingTime;
        if (remainingTime <= 0) {
            //0になったら、結果画面を表示する
            showResult();
        }
    }, 1000)
}

backToStart.addEventListener('click', () => {
    //スタートページへshowクラスを付け替え、実行フラグを変更
    typingGame.classList.remove('show');
    startPage.classList.add('show');
    resultContainer.classList.remove('show');
    isPlaying = false;
})

function showResult() {
    //入力エリアを入力無効にする
    textarea.disabled = true;

    //インターバルをクリア
    clearInterval(intervalId);

    //1分間に入力した文字数
    LPMCount = remainingTime === 0 ? Math.floor(typedCount * 60 / timeLimit) :
        Math.floor(typedCount * 60 / (timeLimit - remainingTime));

    //名言を再度表示
    quoteReview.innerHTML = `${quotes.quote} <br>---${quotes.author}`;

    let count = 0;
    setTimeout(() => {
        //タイピング終了の１秒後に結果画面を表示する
        resultContainer.classList.add('show');
        //20ミリ秒ごとにカウントアップする
        const countUp = setInterval(() => {
            LPM.textContent = count;
            count += 1;
            if (count >= LPMCount) {
                clearInterval(countUp);
            }
        }, 20)

    }, 1000);
}

//APIからfetchする
async function fetchAndRenderQuotes() {
    //名言表示欄と、テキストエリアをクリアする
    quote.innerHTML = '';
    textarea.value = '';

    const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
    //非同期で取得する
    const response = await fetch(RANDOM_QUOTE_API_URL);
    //APIの戻り値のJsonオブジェクトに格納
    const data = await response.json();

    //連想配列に格納
    quotes = {
        quote: data.content,
        author: data.author
    };

    //戻り値文字列を一文字処理し、spanタグに格納する
    quotes.quote.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        quote.appendChild(span);
    })

    //著者を表示
    author.textContent = quotes.author;
}

//テキストエリアへの文字列の入力に対して、文字列を色を変更する
textarea.addEventListener('input', () => {
    let inputArray = textarea.value.split('');

    let spans = quote.querySelectorAll('span');
    spans.forEach(span => {
        span.className = '';
    })

    typedCount = 0;
    inputArray.forEach((letter, index) => {
        if (letter === spans[index].textContent) {
            // 入力が正解の場合
            spans[index].classList.add('correct');
            //入力した文字数をカウント。ただしスペースは含めない
            if (spans[index].textContent !== ' ') {
                typedCount += 1;
            }
        } else {
            //入力が不正解の場合
            spans[index].classList.add('wrong');
            if (spans[index].textContent === ' ') {
                spans[index].classList.add('bar');
            }
        }
    })
    //正しく入力できた場合、結果画面を表示する
    if (spans.length === inputArray.length && [...spans].every(span => span.classList.contains('correct'))) {
        showResult();
    }
})