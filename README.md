# Multiple‑Choice Questions Website

[Live Demo](https://poneonly.github.io/multiple-choices-questions/)

---

## 📖 Overview

A lightweight single‑page web app that serves multiple‑choice quiz questions from external **JSON** files. Built with plain **HTML**, **CSS**, and **JavaScript**, and hosted for free on **GitHub Pages**.

---

## ✨ Features

* **Vanilla stack only** – no frameworks required.
* **Dynamic question loading** via the Fetch API.
* Immediate **correct / incorrect** feedback.
* Clean, responsive UI that inherits the project colour palette:

  * Primary `#00B4D8`, secondary `#CAF0F8`, text `#1e293b`.
* Easily extensible to support **multiple questions** or **multiple quiz files**.
* **100 % static** – perfect for GitHub Pages or any static host.

---

## 🚀 Quick Start

### 1 Clone & Serve Locally

```bash
# clone the repo
git clone https://github.com/<your‑username>/multiple-choices-questions.git
cd multiple-choices-questions

# serve with a tiny web server (required for fetch)
python -m http.server 8000
# ↳ browse to http://localhost:8000
```

### 2 Open the App

Navigate to `/index.html` in your browser. The default question found in `question.json` will load automatically.

---

## 🗂️ Project Structure

```text
.
├── index.html          # entry point
├── style.css           # styling
├── script.js           # quiz logic
├── question.json       # default quiz file
├── quizzes/            # (optional) extra quiz JSONs
│   ├── quiz1.json
│   └── quiz2.json
└── README.md           # you are here ✨
```

---

## ➕ Adding / Editing Quiz Files

1. Create a new file inside **`quizzes/`** (e.g. `networking.json`).
2. Ensure it follows **this exact schema**:

   ```json
   {
     "question": "What does HTTP stand for?",
     "options": [
       "Hypertext Transmission Protocol",
       "Hypertext Transfer Protocol",
       "Hypertext Transfer Policy",
       "Hypertext Transport Protocol"
     ],
     "correct_answer": "Hypertext Transfer Protocol"
   }
   ```
3. List your new file in `script.js` (or implement an index fetch) so it appears in the quiz selector.

> **Tip:** Because GitHub Pages is static, the browser cannot enumerate the `quizzes/` folder. Use a small index file (e.g. `quizzes/index.json`) or hard‑code the list in `script.js`.

---

## 🛠️ Building Further

* **Multiple questions** per file → change `question.json` to an array and iterate.
* **Score tracking** → store results in `localStorage`.
* **Progress bar** + **Next / Previous** buttons.
* **Upload custom quiz** → accept a `.json` file with the schema above and parse it client‑side.

---

## 📦 Deployment

This site is published from the `main` branch using **GitHub Pages**. Push to `main`, wait a few moments, and your changes will be live at:

```
https://<your‑username>.github.io/multiple-choices-questions/
```

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

## ⚖️ License

Released under the MIT License. See `LICENSE` for details.

---

## 👤 Creator

Created by **Aiden Tran**.
