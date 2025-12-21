


// ========== 一次表示機能 ==========

function showContent(id, button) {


 
 
  // すべてのページを非表示にする
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active'); // activeクラスを外す
  });

  // クリックしたページだけ表示
  document.getElementById(id).classList.add('active');
 
  // ⭐ メニュー切り替え（すべてのボタンから active を外す）
  document.querySelectorAll('.menu-button').forEach(b => b.classList.remove('active'));

  // ⭐ クリックされたボタンだけ active を付ける
  button.classList.add('active');

  // ★ 追加：時計ページを開いたら updateDateTime を即実行
  if (id === 'clock') {
    updateDateTime();
  }

  if (id === 'timer') {
    initTimerEvents(); // ← ここに追加！
  }

 

}


// ========== 時計機能 ==========


function updateDateTime() {
  // 1. 現在の日時を取得
  const now = new Date();  
  // Date() オブジェクト → 「年、月、日、曜日、時、分、秒、ミリ秒」などの情報を持っている


  // 2. 年月日を取り出して整形
  const year = now.getFullYear(); // 西暦を取得（例: 2024）

  const month = String(now.getMonth() + 1).padStart(2, '0'); 
  // 月を取得（0〜11で返るので +1）
  // padStart(2, '0') → 1桁の数字を2桁に揃える（例: "4" → "04"）

  const day = String(now.getDate()).padStart(2, '0'); 
  // 日を取得して2桁に揃える（例: "9" → "09"）

  const days = ['日', '月', '火', '水', '木', '金', '土']; 
  // 曜日リスト（getDay() が返す 0〜6 の数字をこの配列に当てはめる）
  
  const weekday = days[now.getDay()]; 
  // 曜日を取得（例: 0 → "日"）

  const dateString = `${year}/${month}/${day} ${weekday}曜日`;
  // → "2024/04/21 日曜日" のような文字列に整形


  // 3. 時刻を取り出して整形
  const hours = String(now.getHours()).padStart(2, '0');     // 時を2桁で取得
  const minutes = String(now.getMinutes()).padStart(2, '0'); // 分を2桁で取得
  const seconds = String(now.getSeconds()).padStart(2, '0'); // 秒を2桁で取得

  const timeString = `${hours}:${minutes}:${seconds}`;
  // → "12:34:56" のように整形


  // 4. タイムゾーンを取得
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Intl.DateTimeFormat → 国際化API
  // resolvedOptions().timeZone → 現在のタイムゾーンを文字列で返す（例: "Asia/Tokyo"）

  const timezoneString = `${timezone} JST`; 
  // JST（日本標準時）を明示的に追加して表示


  // 5. HTMLに反映する
  document.getElementById('date').textContent = dateString;
  // → <div id="date"></div> の中身を "2024/04/21 日曜日" にする

  document.getElementById('time').textContent = timeString;
  // → <div id="time"></div> の中身を "12:34:56" にする

  document.getElementById('timezone').textContent = timezoneString;
  // → <div id="timezone"></div> の中身を "Asia/Tokyo JST" にする
}


// 6. ページを開いた瞬間に一度だけ実行（初期表示）
updateDateTime();

// 7. 1秒ごとに updateDateTime を実行し続ける
setInterval(updateDateTime, 1000);
// → 1000ms = 1秒ごと
// → 時計がリアルタイムで動き続ける

// =============================
// タイマー機能のJavaScript
// =============================

// ========= グローバル変数 =========
let timer;
let timeLeft;
let isRunning = false;

// ========= タイマー機能 =========
function updateDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  document.getElementById("timer-input").value = `${minutes}:${seconds}`;
}

function initTimerEvents() {
  if (document.getElementById("start").dataset.bound === "true") return;

  const timeInput = document.getElementById("timer-input");
  const pauseMessage = document.getElementById("pause-message");
  const pauseOverlay = document.getElementById("pause-overlay");
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const resetBtn = document.getElementById("reset");
  const closeBtn = document.getElementById("close-popup");

  // ▶ Start ボタン処理
  startBtn.addEventListener("click", () => {
    if (isRunning) return;

    const timeString = timeInput.value.trim();
    const [minutes, seconds] = timeString.split(":").map(Number);

    if (isNaN(minutes) || isNaN(seconds)) {
      alert("正しい形式で入力してください。");
      return;
    }

    timeLeft = minutes * 60 + seconds;
    isRunning = true;
    updateDisplay();

    // ポップアップ消す
    pauseOverlay.style.display = "none";
    pauseMessage.style.display = "none";

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;

        

        pauseOverlay.style.display = "flex";
        pauseMessage.style.display = "flex";
        document.getElementById("pause-text").textContent = "時間になりました！";
      }
    }, 1000);
  });

  // ▶ Stop ボタン処理
  stopBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    pauseOverlay.style.display = "flex";
    pauseMessage.style.display = "flex";
    document.getElementById("pause-text").textContent = "一時停止中です";
  });

  // ▶ Reset ボタン処理
  resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 0;
    updateDisplay();
    pauseOverlay.style.display = "none";
    pauseMessage.style.display = "none";
  });

  // ▶ ✕ ボタン処理
  closeBtn.addEventListener("click", () => {
    pauseOverlay.style.display = "none";
    pauseMessage.style.display = "none";
  });

  // イベントバインド済みフラグ
  startBtn.dataset.bound = "true";
}

// 一時停止ポップアップ用のOK/✕
document.getElementById("pause-ok-btn").addEventListener("click", () => {
  document.getElementById("pause-overlay").style.display = "none";
  document.getElementById("pause-message").style.display = "none";
});
document.getElementById("pause-close-btn").addEventListener("click", () => {
  document.getElementById("pause-overlay").style.display = "none";
  document.getElementById("pause-message").style.display = "none";
});

// タイマー通知ポップアップ閉じる処理
document.getElementById("timer-ok-btn").addEventListener("click", () => {
  document.getElementById("timer-popup").style.display = "none";
});

document.getElementById("timer-close-btn").addEventListener("click", () => {
  document.getElementById("timer-popup").style.display = "none";
});



//リマインダー機能
// ===============================
// 要素取得
// ===============================
const addReminderBtn = document.getElementById("open-modal");
const reminderList = document.getElementById("reminder-list");
const modal = document.getElementById("reminder-modal");
const closeModalBtn = document.getElementById("close-modal");
const saveReminderBtn = document.getElementById("save-reminder");
const reminderInput = document.getElementById("modal-title");
const toggleCompletedBtn = document.getElementById("toggle-completed");

// ===============================
// 初期データ
// ===============================
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
let showCompleted = true;
renderReminders(); // 初回表示

// ===============================
// モーダル開閉
// ===============================
addReminderBtn.addEventListener("click", () => {
  modal.style.display = "block"; // 開く
});
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none"; // 閉じる
});

// ===============================
// ★変更：登録処理（日付・時間付き）
// ===============================
saveReminderBtn.addEventListener("click", () => {
  const title = reminderInput.value.trim();
  const date = document.getElementById("modal-date").value;
  const time = document.getElementById("modal-time").value;
   const notifyBefore = Number(document.getElementById("modal-notify").value); // ★通知タイミングの取得

if (title === "" || date === "" || time === "") {
  showReminderPopup("⚠️ タイトル・日付・時間をすべて入力してください。");
  return;
}

  // 🔧 ISO形式に統一（YYYY-MM-DDTHH:mm:ss）
  const isoDate = date.replace(/\//g, "-"); // スラッシュをハイフンに変換
  const datetime = `${isoDate}T${time}:00`;


 

  const newReminder = {
    id: Date.now(),
    text: title,
    datetime,             // ← ISO形式で保存
    notifyBefore,
    completed: false,
     notified: false // ★追加（事前通知済み管理）
   
  };

  reminders.push(newReminder);
  saveAndRender();

  // 入力フォームをリセット
  reminderInput.value = "";
  document.getElementById("modal-date").value = "";
  document.getElementById("modal-time").value = "";
  document.getElementById("modal-notify").value = "0"; // 初期値（ちょうど）
  modal.style.display = "none"; // モーダルを閉じる


 
});

// ===============================
// ✨追加：リスト描画
// ===============================
function renderReminders() {
  reminderList.innerHTML = "";

  reminders.forEach((reminder) => {
    if (!showCompleted && reminder.completed) return;

    const li = document.createElement("li");
    li.classList.add("reminder-item");
    if (reminder.completed) li.classList.add("completed");

    const check = document.createElement("span");
    check.classList.add("checkmark");
    check.textContent = reminder.completed ? "✓" : "○";

    const span = document.createElement("span");

    // ✅ ISO文字列から日本時刻に変換し、きれいに整形
    const d = new Date(reminder.datetime);
    const formatted = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    // 「T」を半角スペースに戻す
      span.textContent = `${reminder.text} (${reminder.datetime.replace("T", " ")})`;


    // ★変更：クリックで編集モーダル開く
    check.addEventListener("click", () => openEditModal(reminder.id));

    li.appendChild(check);
    li.appendChild(span);
    reminderList.appendChild(li);
  });
}

// ===============================
// ✨追加：編集モーダル制御
// ===============================
const editModal = document.getElementById("edit-modal");
const editTitle = document.getElementById("edit-title");
const editDate = document.getElementById("edit-date");
const editTime = document.getElementById("edit-time");
const updateReminderBtn = document.getElementById("update-reminder");
const deleteReminderBtn = document.getElementById("delete-reminder");
const closeEditBtn = document.getElementById("close-edit");

let currentEditingId = null;

// 開く
function openEditModal(id) {
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return;

  currentEditingId = id;
  editTitle.value = reminder.text;

  const [datePart, timePart] = reminder.datetime.split("T");
  editDate.value = datePart || "";
  editTime.value = timePart?.slice(0,5) || ""; // HH:MM のみに整形（秒はカット）


  editModal.style.display = "block";
}

// 保存
updateReminderBtn.addEventListener("click", () => {
  const title = editTitle.value.trim();
  const date = editDate.value;
  const time = editTime.value;

  if (title === "" || date === "" || time === "") return;

  reminders = reminders.map((r) =>
    r.id === currentEditingId
      ? { ...r, text: title, 
        datetime: `${date} ${time}`,
        completed: false,
        notified: false 


      }
      : r
  );

  saveAndRender();
  editModal.style.display = "none";
});

// ===============================
// ✅ 追加：完了ボタン処理
// ===============================
const completeReminderBtn = document.getElementById("complete-reminder");

completeReminderBtn.addEventListener("click", () => {
  reminders = reminders.map((r) =>
    r.id === currentEditingId
      ? { ...r, completed: true } // ★完了状態にする
      : r
  );

  saveAndRender();
  editModal.style.display = "none";
});


// 削除
deleteReminderBtn.addEventListener("click", () => {
  reminders = reminders.filter((r) => r.id !== currentEditingId);
  saveAndRender();
  editModal.style.display = "none";
});

// 閉じる
closeEditBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

// ===============================
// ★変更：完了タスク切り替え
// ===============================
toggleCompletedBtn.addEventListener("click", () => {
  showCompleted = !showCompleted;
  toggleCompletedBtn.textContent = showCompleted
    ? "完了タスクを隠す"
    : "完了タスクを表示";
  renderReminders();
});

// ===============================
// ✨追加：データ保存
// ===============================
function saveAndRender() {
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
}


// ===============================
// ✨追加／修正：通知ポップアップ関連（★修正）
// ===============================
const notifySound = document.getElementById("notify-sound"); // ★修正：通知音
const reminderPopup = document.getElementById("reminder-popup"); // ★修正：ポップアップ本体
const reminderPopupMsg = document.getElementById("reminder-popup-message"); // ★修正：メッセージ
const closePopupBtn = document.getElementById("close-popup"); // ★修正：×ボタン
const okPopupBtn = document.getElementById("ok-popup-btn"); // ★修正：OKボタン

// ===============================
// ✨既存のcheckReminders関数を修正
// ===============================
setInterval(checkReminders, 30000); // 30秒ごと

function checkReminders() {
  const now = new Date(); // 現在時刻

  reminders.forEach((reminder) => {
    if (reminder.completed) return; // 完了済みスキップ

    const reminderTime = new Date(reminder.datetime);
    const notifyBefore = parseInt(reminder.notifyBefore || "0", 10); // ★修正：通知タイミング取得
    const notifyTime = new Date(reminderTime.getTime() - notifyBefore * 60000); // ★修正：通知時刻計算

    // ① 期限前通知：「期限◯分前です」
    if (now >= notifyTime && now < reminderTime && !reminder.notified) {
      showReminderPopup(`🔔 「${reminder.text}」の期限${notifyBefore}分前です`);
      notifySound.play().catch(() => {}); // ★修正：音を鳴らす
      reminder.notified = true;
      saveAndRender();
    }

    // ② 期限ジャスト通知：「期限です」
    if (notifyBefore === 0 && now >= reminderTime && !reminder.completed) {
      showReminderPopup(`⏰ 「${reminder.text}」の期限です`);
      notifySound.play().catch(() => {});
  
      return;
    }

  });
}

// ===============================
// 💬 ポップアップ表示関数（★修正）
// ===============================
function showReminderPopup(message) {
  reminderPopupMsg.textContent = message;
  reminderPopup.style.display = "block";
}

// ×ボタンで閉じる（★修正）
closePopupBtn.addEventListener("click", () => {
  reminderPopup.style.display = "none";
});

// OKボタンで閉じる（★修正）
okPopupBtn.addEventListener("click", () => {
    reminderPopup.style.display = "none";

});


// ===============================
// 📅 flatpickr（フラットピッカー）初期化設定
// ===============================

// 日本語化
flatpickr.localize(flatpickr.l10ns.ja);

//ポップアップ入力画面

// 📅 日付入力欄（modal-date）
flatpickr("#modal-date", {
  dateFormat: "Y/m/d", // 表示形式
  minDate: "today", // 今日より前を選べない
  defaultDate: new Date(), // デフォルトを今日に設定
});

// ⏰ 時間入力欄（modal-time）
flatpickr("#modal-time", {
  enableTime: true, // 時間選択をON
  noCalendar: true, // カレンダーを非表示
  dateFormat: "H:i", // 時刻フォーマット
  time_24hr: true, // 24時間制
  defaultHour: new Date().getHours(), // 現在時刻
  defaultMinute: new Date().getMinutes(),
});

//ポップアップ編集画面
// ---------- 🔵 編集モーダル ----------
flatpickr("#edit-date", {
  dateFormat: "Y/m/d",
  minDate: "today",
});

flatpickr("#edit-time", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true,
});
>>>>>>> 29a5099 (バグ修正)
