// LocalStorageからリストを取得
function getLists() {
  return JSON.parse(localStorage.getItem("lists")) || [];
}

// LocalStorageに保存
function saveLists(lists) {
  localStorage.setItem("lists", JSON.stringify(lists));
}

// --- index.html 用 ---
function createList() {
  const name = document.getElementById("listName").value.trim();
  if (!name) return alert("リスト名を入力してください");

  const lists = getLists();
  const newList = { id: Date.now().toString(), name, questions: [] };
  lists.push(newList);
  saveLists(lists);

  document.getElementById("listName").value = "";
  renderLists();
}

function renderLists() {
  const lists = getLists();
  const container = document.getElementById("listContainer");
  if (!container) return;

  container.innerHTML = "";
  lists.forEach(list => {
    const div = document.createElement("div");
    div.className = "list-card";
    div.innerHTML = `
      <strong>${list.name}</strong><br>
      <button onclick="openList('${list.id}')">開く</button>
    `;
    container.appendChild(div);
  });
}

function openList(id) {
  localStorage.setItem("selectedList", id);
  window.location.href = "list.html";
}

// --- list.html 用 ---
function renderQuestions() {
  const selectedListId = localStorage.getItem("selectedList");
  const lists = getLists();
  const list = lists.find(l => l.id === selectedListId);
  const container = document.getElementById("questionContainer");

  if (!list || !container) return;
  container.innerHTML = "";

  list.questions.forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "question-card";
    div.innerHTML = `
      <p><strong>問題 ${idx + 1}:</strong> ${q.text}</p>
      ${q.image ? `<img src="${q.image}" style="max-width:100px;">` : ""}
      <div class="question-actions">
        <button class="quizBtn" onclick="startQuiz()">出題</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function addQuestion() {
  const text = document.getElementById("questionText").value.trim();
  const fileInput = document.getElementById("questionImage");
  if (!text && !fileInput.files[0]) return alert("問題文または画像を入力してください");

  const selectedListId = localStorage.getItem("selectedList");
  const lists = getLists();
  const list = lists.find(l => l.id === selectedListId);

  if (!list) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const newQuestion = {
      text,
      image: fileInput.files[0] ? e.target.result : null
    };
    list.questions.push(newQuestion);
    saveLists(lists);
    document.getElementById("questionText").value = "";
    fileInput.value = "";
    renderQuestions();
  };

  if (fileInput.files[0]) {
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    reader.onload();
  }
}

function startQuiz() {
  window.location.href = "quiz.html";
}

function goIndex() {
  window.location.href = "index.html";
}
