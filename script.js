// --- ESTADO DA APLICAÇÃO & LOCALSTORAGE ---
const STORAGE_KEYS = {
    USER: 'todo_user_session',
    USERS_DB: 'todo_users_db',
    LISTS: 'todo_lists_data',
    THEME: 'todo_theme'
};

let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null;
let currentListId = null;

// Dados mockados iniciais padrão caso não existam
const defaultLists = [
    {
        id: '1',
        name: 'Supermercado',
        icon: 'fa-cart-shopping',
        tasks: [
            { id: 't1', text: 'Café em grãos', completed: true },
            { id: 't2', text: 'Leite desnatado', completed: false },
            { id: 't3', text: 'Frutas da estação', completed: false }
        ]
    },
    {
        id: '2',
        name: 'Estudos',
        icon: 'fa-graduation-cap',
        tasks: [
            { id: 't4', text: 'Praticar JavaScript puro', completed: false }
        ]
    }
];

let listsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTS)) || defaultLists;

// --- GERENCIAMENTO DE TEMA (DARK/LIGHT) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    updateThemeIcon(newTheme);
});

// --- CONTROLE DE TELAS ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function checkAuthState() {
    if (currentUser) {
        renderLists();
        showScreen('lists-screen');
    } else {
        showScreen('auth-screen');
    }
}

// --- AUTENTICAÇÃO ---
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toRegisterLink = document.getElementById('to-register');
const toLoginLink = document.getElementById('to-login');
const logoutBtn = document.getElementById('logout-btn');

toRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login com credencial de teste (eu@eu.com / 1234)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (email === 'eu@eu.com' && password === '1234') {
        currentUser = { name: 'Usuário Teste', email };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        checkAuthState();
    } else {
        alert('Credenciais inválidas! Use e-mail: eu@eu.com e senha: 1234');
    }
});

// Cadastro simples
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (name && email && password) {
        currentUser = { name, email };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        alert('Cadastro realizado com sucesso!');
        checkAuthState();
    }
});

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
    checkAuthState();
});

// --- GERENCIAMENTO DE LISTAS (TELA 2) ---
const listsContainer = document.getElementById('lists-container');
const openModalBtn = document.getElementById('open-new-list-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const newListModal = document.getElementById('new-list-modal');
const createListForm = document.getElementById('create-list-form');

function saveListsToStorage() {
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(listsData));
}

function renderLists() {
    listsContainer.innerHTML = '';
    
    if (listsData.length === 0) {
        listsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhuma lista criada. Clique em "Nova Lista" acima.</p>`;
        return;
    }

    listsData.forEach(list => {
        const completedCount = list.tasks.filter(t => t.completed).length;
        const totalCount = list.tasks.length;

        const card = document.createElement('div');
        card.className = 'list-card';
        card.innerHTML = `
            <div class="list-card-info" onclick="openTasks('${list.id}')">
                <div class="list-card-icon">
                    <i class="fa-solid ${list.icon || 'fa-list-check'}"></i>
                </div>
                <div class="list-card-text">
                    <h3>${escapeHtml(list.name)}</h3>
                    <span>${completedCount} de ${totalCount} concluídas</span>
                </div>
            </div>
            <button class="btn-icon" onclick="deleteList(event, '${list.id}')" title="Excluir Lista">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        listsContainer.appendChild(card);
    });
}

openModalBtn.addEventListener('click', () => newListModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => newListModal.classList.remove('active'));

createListForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('list-name-input');
    const selectedIcon = document.querySelector('input[name="list-icon"]:checked').value;

    const newList = {
        id: Date.now().toString(),
        name: nameInput.value.trim(),
        icon: selectedIcon,
        tasks: []
    };

    listsData.push(newList);
    saveListsToStorage();
    renderLists();

    nameInput.value = '';
    newListModal.classList.remove('active');
});

function deleteList(event, listId) {
    event.stopPropagation();
    if (confirm('Deseja realmente excluir esta lista e todas as suas tarefas?')) {
        listsData = listsData.filter(l => l.id !== listId);
        saveListsToStorage();
        renderLists();
    }
}

function openTasks(listId) {
    currentListId = listId;
    renderTasksScreen();
    showScreen('tasks-screen');
}

// --- VISUALIZAÇÃO E EDIÇÃO DE TAREFAS (TELA 3) ---
const backToListsBtn = document.getElementById('back-to-lists');
const currentListTitle = document.getElementById('current-list-title');
const addTaskForm = document.getElementById('add-task-form');
const newTaskInput = document.getElementById('new-task-input');
const tasksContainer = document.getElementById('tasks-container');
const taskCounter = document.getElementById('task-counter');
const progressBarFill = document.getElementById('progress-bar-fill');

backToListsBtn.addEventListener('click', () => {
    renderLists();
    showScreen('lists-screen');
});

function getCurrentList() {
    return listsData.find(l => l.id === currentListId);
}

function renderTasksScreen() {
    const list = getCurrentList();
    if (!list) return;

    currentListTitle.textContent = list.name;
    tasksContainer.innerHTML = '';

    const total = list.tasks.length;
    const completed = list.tasks.filter(t => t.completed).length;
    
    taskCounter.textContent = `${completed} de ${total} concluídas`;
    const progressPercent = total === 0 ? 0 : (completed / total) * 100;
    progressBarFill.style.width = `${progressPercent}%`;

    if (total === 0) {
        tasksContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhuma tarefa nesta lista ainda.</p>`;
        return;
    }

    list.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask('${task.id}')">
                <span>${escapeHtml(task.text)}</span>
            </div>
            <div class="task-actions">
                ${index > 0 ? `<button onclick="moveTask('${task.id}', 'up')" title="Mover para cima"><i class="fa-solid fa-arrow-up"></i></button>` : ''}
                ${index < total - 1 ? `<button onclick="moveTask('${task.id}', 'down')" title="Mover para baixo"><i class="fa-solid fa-arrow-down"></i></button>` : ''}
                <button onclick="deleteTask('${task.id}')" title="Excluir"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        tasksContainer.appendChild(li);
    });
}

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = newTaskInput.value.trim();
    if (!text) return;

    const list = getCurrentList();
    if (list) {
        list.tasks.push({
            id: 't_' + Date.now(),
            text: text,
            completed: false
        });
        saveListsToStorage();
        newTaskInput.value = '';
        renderTasksScreen();
    }
});

function toggleTask(taskId) {
    const list = getCurrentList();
    if (list) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveListsToStorage();
            renderTasksScreen();
        }
    }
}

function deleteTask(taskId) {
    const list = getCurrentList();
    if (list) {
        list.tasks = list.tasks.filter(t => t.id !== taskId);
        saveListsToStorage();
        renderTasksScreen();
    }
}

function moveTask(taskId, direction) {
    const list = getCurrentList();
    if (!list) return;

    const index = list.tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < list.tasks.length) {
        const temp = list.tasks[index];
        list.tasks[index] = list.tasks[targetIndex];
        list.tasks[targetIndex] = temp;
        saveListsToStorage();
        renderTasksScreen();
    }
}

// Utilitário de segurança contra XSS
function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Inicialização da aplicação ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    checkAuthState();
});