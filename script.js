import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection, addDoc, doc, setDoc, getDoc,
  onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------- USER ---------- */

function randomUsername() {
  const names = ["Otaku", "Senpai", "Kage", "Weeb", "Ninja"];
  return names[Math.floor(Math.random()*names.length)] + Math.floor(Math.random()*1000);
}

let currentUserData = null;

onAuthStateChanged(auth, async user => {
  if (!user && !location.pathname.includes("index")) {
    location.href = "index.html";
  }

  if (user) {
    const snap = await getDoc(doc(db, "users", user.uid));
    currentUserData = snap.data();
  }
});

/* ---------- LOGIN / REGISTER ---------- */

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

if (registerBtn) {
  registerBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", cred.user.uid), {
      username: randomUsername()
    });

    location.href = "home.html";
  };
}

if (loginBtn) {
  loginBtn.onclick = async () => {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    location.href = "home.html";
  };
}

/* ---------- DISCUSSIONS ---------- */

const uploadBtn = document.getElementById("uploadBtn");
const newPostText = document.getElementById("newPostText");
const posts = document.getElementById("posts");

if (uploadBtn) {
  uploadBtn.onclick = async () => {
    if (!newPostText.value) return;

    await addDoc(collection(db, "posts"), {
      text: newPostText.value,
      username: currentUserData.username,
      time: Date.now()
    });

    newPostText.value = "";
  };
}

if (posts) {
  const q = query(collection(db, "posts"), orderBy("time", "desc"));

  onSnapshot(q, snap => {
    posts.innerHTML = "";
    snap.forEach(d => {
      const div = document.createElement("div");
      div.className = "post";

      div.innerHTML = `
        <strong>${d.data().username}</strong>
        <p>${d.data().text}</p>
        <input id="r-${d.id}" placeholder="Reply">
        <button onclick="reply('${d.id}')">Reply</button>
        <div id="rep-${d.id}"></div>
      `;
      posts.appendChild(div);
      loadReplies(d.id);
    });
  });
}

window.reply = async id => {
  const input = document.getElementById("r-" + id);
  if (!input.value) return;

  await addDoc(collection(db, "posts", id, "replies"), {
    text: input.value,
    username: currentUserData.username,
    time: Date.now()
  });

  input.value = "";
};

function loadReplies(id) {
  const q = query(collection(db, "posts", id, "replies"), orderBy("time"));
  onSnapshot(q, snap => {
    const box = document.getElementById("rep-" + id);
    box.innerHTML = "";
    snap.forEach(r => {
      const d = document.createElement("div");
      d.className = "reply";
      d.textContent = `${r.data().username}: ${r.data().text}`;
      box.appendChild(d);
    });
  });
}

/* ---------- CHAT ---------- */

const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const chatBox = document.getElementById("chatBox");

if (sendChat) {
  sendChat.onclick = async () => {
    await addDoc(collection(db, "chat"), {
      text: chatInput.value,
      username: currentUserData.username,
      time: Date.now()
    });
    chatInput.value = "";
  };

  const q = query(collection(db, "chat"), orderBy("time"));
  onSnapshot(q, snap => {
    chatBox.innerHTML = "";
    snap.forEach(m => {
      chatBox.innerHTML += `<p><b>${m.data().username}:</b> ${m.data().text}</p>`;
    });
  });
}

/* ---------- ACCOUNT ---------- */

const saveUsername = document.getElementById("saveUsername");

if (saveUsername) {
  saveUsername.onclick = async () => {
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { username: newUsername.value },
      { merge: true }
    );
    alert("Username updated");
  };
}
