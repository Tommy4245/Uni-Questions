let questions = [];
let current = 0;
let correctCount = 0;
let wrongCount = 0;

document.querySelectorAll(".course-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    loadCSV(btn.dataset.file);
  });
});

document.getElementById("nextBtn").addEventListener("click", nextQuestion);
document.getElementById("resetBtn").addEventListener("click", resetQuiz);

async function loadCSV(fileName) {
  try {
    const response = await fetch(fileName);
    if (!response.ok) throw new Error("CSV not found!");
    const text = await response.text();
    const lines = text.trim().split("\n").slice(1);
    questions = lines
      .map(line => line.split(","))
      .filter(parts => parts.length >= 7)
      .map(parts => ({
        question: parts[0],
        options: [parts[1], parts[2], parts[3], parts[4]],
        correct: parts[5].trim().toUpperCase(),
        description: parts[6]
      }));
    shuffle(questions);
    document.getElementById("courseSelect").classList.add("hidden");
    document.getElementById("quizArea").classList.remove("hidden");
    showQuestion();
  } catch (err) {
    alert("Error loading quiz: " + err.message);
  }
}

function showQuestion() {
  const q = questions[current];
  document.getElementById("questionBox").innerText = q.question;
  document.getElementById("description").innerText = "";
  document.getElementById("nextBtn").classList.add("hidden");

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
    btn.addEventListener("click", () => selectOption(btn, i));
    optionsBox.appendChild(btn);
  });

  updateCounters();
}

function selectOption(selectedBtn, index) {
  const q = questions[current];
  const correctIndex = q.correct.charCodeAt(0) - 65;
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach((btn, i) => {
    btn.style.pointerEvents = "none";
    if (i === correctIndex) btn.classList.add("correct");
    else if (i === index) btn.classList.add("wrong");
  });

  if (index === correctIndex) {
    correctCount++;
  } else {
    wrongCount++;
  }

  document.getElementById("description").innerText = q.description;
  document.getElementById("nextBtn").classList.remove("hidden");
  updateCounters();
}

function nextQuestion() {
  current++;
  if (current >= questions.length) {
    document.getElementById("questionBox").innerText =
      `🎉 Quiz finished! You got ${correctCount}/${questions.length} correct.`;
    document.getElementById("optionsBox").innerHTML = "";
    document.getElementById("nextBtn").classList.add("hidden");
  } else {
    showQuestion();
  }
}

function resetQuiz() {
  current = 0;
  correctCount = 0;
  wrongCount = 0;
  shuffle(questions);
  showQuestion();
}

function updateCounters() {
  document.getElementById("questionCounter").innerText =
    `Question: ${current + 1}/${questions.length}`;
  document.getElementById("correctCounter").innerText = `✅ Correct: ${correctCount}`;
  document.getElementById("wrongCounter").innerText = `❌ Wrong: ${wrongCount}`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
