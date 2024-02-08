// import IMG_UP from '../../images/todo_button/up.png';
// import IMG_OK from '../../images/todo_button/ok.png';
// import IMG_CANCEL from '../../images/todo_button/cancel.png';

// Todoの追加フォーム
const addForm = document.querySelector('.td-add-form'); 
//Todo追加の入力テキスト
const addInput = document.querySelector('.td-add-input');

//Remains to do
const todosUl = document.querySelector('.todos');
//Already dones
const donesUl = document.querySelector('.dones');

//Todoの検索フォーム
const searchForm = document.querySelector('.td-search-form');
//Todo検索の入力テキスト
const searchInput = document.querySelector('.td-search-input');

let todoData = [];

addForm.addEventListener('submit', e => {
    //リロードを抑制
    e.preventDefault();
    //フォームから入力値を取得し、配列に確保する
    let todoObj = {
        content: addInput.value.trim(),
        isDone: false
    };
    if (todoObj.content) {
        todoData.push(todoObj);
    }
    addInput.value = '';
    //ローカルストレージに保存する
    updateLs();
    updateTodo();
})

//ローカルストレージに保存する
function updateLs() {
    //jsonに変換する
    localStorage.setItem('myTodo', JSON.stringify(todoData));
}

//ローカルストレージからデータをJson形式で取得する
//データが保存されていない場合は空の配列をJson形式に変換
function getTodoData() {
    return JSON.parse(localStorage.getItem('myTodo')) || [];
}

//Todo表示欄を作成する
function createTodoElement(todo) {
    
    //todoリストを作成
    const todoItem = document.createElement('li');
    todoItem.classList.add('td-item');

    const todoContent = document.createElement('p');
    todoContent.classList.add('td-content');
    todoContent.textContent = todo.content;
    todoItem.appendChild(todoContent);

    //ボタンの作成
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('td-btn-container');

    const btn = document.createElement('img');
    btn.classList.add('td-btn');

    const upBtn = btn.cloneNode(false);
    upBtn.setAttribute('src', './images/todo_button/up.png');
    
    if (!todo.isDone) {

        //未完了の場合
        //Remains to do
        upBtn.classList.add('edit-btn');
        btn.classList.add('idDone-btn');
        btn.setAttribute('src', './images/todo_button/ok.png');

        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer);
        todosUl.appendChild(todoItem);
        
    } else {
    
        //完了の場合
        //Already dones
        upBtn.classList.add('undo-btn');
        btn.classList.add('delete-btn');
        btn.setAttribute('src', './images/todo_button/cancel.png');
    
        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer);
        donesUl.appendChild(todoItem);
    }

    todoItem.addEventListener('click', e => {
        if(e.target.classList.contains('idDone-btn')) {
            //チェックボタンの場合
            todo.isDone = true;
        }
        if(e.target.classList.contains('undo-btn')) {
            //undoボタンの場合
            todo.isDone = false;
        }
        if (e.target.classList.contains('edit-btn')) {
            //編集ボタンの場合
            addInput.value =  e.target.parentElement.previousElementSibling.textContent;
            todoData = todoData.filter(data => data !== todo);
            addInput.focus();
        }
        if(e.target.classList.contains('delete-btn')) {
            //削除ボタンの場合
            todoData = todoData.filter(data => data !== todo);
        }
        updateLs();
        updateTodo();
    })
}

//Todoリストを再表示する
function updateTodo() {
    todosUl.innerHTML = '';
    donesUl.innerHTML = '';
    todoData = getTodoData();
    todoData.forEach(todo => {
        createTodoElement(todo);
    })
}

updateTodo();

searchForm.addEventListener('submit', e => {
    //submitはキャンセル
    e.preventDefault();
})

//検索テキストの入力
searchInput.addEventListener('keyup', () => {
    const searchWord = searchInput.value.trim().toLowerCase();
    const todoItems = document.querySelectorAll('.td-item');
    todoItems.forEach(todoItem => {
        //hideクラスを初期化
        todoItem.classList.remove('hide');
        if(!todoItem.textContent.toLowerCase().includes(searchWord)) {
            //検索文字が含まれていない場合、hideクラスを追加
            todoItem.classList.add('hide');
        }
    })
})