
//メニュー画面
const menuCover = document.querySelector('.sp-cover');

//レベルのリスト
const menu = document.querySelectorAll('.sp-menu > li');

// 戻るボタン
const backToMenu = document.querySelector('.sp-back-to-menu');

//元画像a
const originalImage = document.querySelector('#sp-original-image');

//元画像表示、非表示ボタン
const showOriginalBtn = document.querySelector('#sp-show-original-btn');

//タイル領域
const screen = document.querySelector('.sp-screen');

let level;
let size;
let orderedArray = [];
let hiddenTileIndex;
let tilesArray = [];
let tiles;
let count = 0;
const images = ['space', 'veges'];
let selectedImage;

//レベルの連想配列
const levelMap = {
    easy: {
        grid: 'auto auto',
        size: 2
    },
    medium: {
        grid: 'auto auto auto',
        size: 3
    },
    difficult: {
        grid: 'auto auto auto auto',
        size: 4
    }
}

// レベルリストのボタンを選択した場合
menu.forEach(item => {
    item.addEventListener('click', () => {
        //非表示にする
        menuCover.classList.add('hide');

        //レベルを取得
        level = item.dataset.level;

        //レベルに指定されたサイズを取得
        size = levelMap[level].size;

        //配列の初期化
        orderedArray = [];

        //選択したレベルによって画像ファイル名のプレフィックスを配列に取得
        // ex)  00,01,10,11 とかが配列に入る
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let tileXY = "" + x + y;
                orderedArray.push(tileXY);
            }
        }

        //グリッド列数をCSSに設定する
        screen.style.gridTemplateColumns = levelMap[level].grid;
        start();
    })
})

// 戻るボタンをクリックした場合、cssの非表示を削除する
backToMenu.addEventListener('click', () => {
    menuCover.classList.remove('hide');
})

//元画像をimgタグにセットする関数
function setOriginalImage() {
    //images 配列の要素数 (images.length) を最大値とするランダムなインデックスを生成
    //ランダムなindexを生成し、配列を値を取得する spaceかvegesが変数にセットされる
    selectedImage = images[Math.floor(Math.random() * images.length)];
    //元の1枚画像をimgタグのsrcに設定
    originalImage.setAttribute('src', `./images/slide_puzzle/${selectedImage}/${selectedImage}.png`);
}

//マウスオーバーで元画像を表示、非表示する
showOriginalBtn.addEventListener('mouseover', () => {
    originalImage.classList.add('show');
})
showOriginalBtn.addEventListener('mouseleave', () => {
    originalImage.classList.remove('show');
})

//選択したレベルに応じて、パズル領域に画像を追記していく
function renderTiles(arr) {
    screen.innerHTML = '';

    arr.forEach((tile, index) => {
        const div = document.createElement('div');
        div.classList.add('sp-tile');

        //非表示タイルの場合、hiddenクラスを追加
        if (index === hiddenTileIndex) {
            div.classList.add('hidden');
        }

        div.style.backgroundImage = `url(./images/slide_puzzle/${selectedImage}/${level}/tile${tile}.png)`;
        screen.appendChild(div);
    })
}

function start() {
    setOriginalImage();
    renderTiles(orderedArray);
}