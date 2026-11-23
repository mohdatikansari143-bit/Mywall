export {};

    const MAX_ANSWERS = 5;
    const answersList = document.getElementById("answersList") as HTMLElement;
    const addAnswerBtn = document.getElementById("addAnswerBtn") as HTMLButtonElement;
    const questionInput = document.getElementById("questionInput") as HTMLTextAreaElement;
    const explanationInput = document.getElementById("explanationInput") as HTMLTextAreaElement;
    const postBtn = document.getElementById("postBtn") as HTMLElement;

    // Initial 2 answers, Answer 1 selected as correct by default
    let answersData: Array<{ text: string; image: string | null }> = [
      { text: "", image: null },
      { text: "", image: null }
    ];
    let correctIndex = 0;

    // Auto-resize question textarea
    questionInput.addEventListener("input", () => {
      questionInput.style.height = "auto";
      questionInput.style.height = questionInput.scrollHeight + "px";
      updatePostButton();
    });

    explanationInput.addEventListener("input", () => {
      explanationInput.style.height = "auto";
      explanationInput.style.height = Math.max(66, explanationInput.scrollHeight) + "px";
      updatePostButton();
    });

    function updatePostButton() {
      const hasQuestion = questionInput.value.trim().length > 0;
      const hasExplanation = explanationInput.value.trim().length > 0;
      const hasAnyAnswer = answersData.some(
        ans => ans.text.trim().length > 0 || ans.image !== null
      );

      if (hasQuestion || hasAnyAnswer || hasExplanation) {
        postBtn.classList.add("active");
      } else {
        postBtn.classList.remove("active");
      }
    }

    function renderAnswers() {
      answersList.innerHTML = "";

      answersData.forEach((ans, index) => {
        const row = document.createElement("div");
        row.className = "answer-row" + (index === correctIndex ? " correct" : "");

        // Checkmark button (select correct answer)
        const checkBtn = document.createElement("button");
        checkBtn.type = "button";
        checkBtn.className = "check-btn";
        checkBtn.setAttribute("aria-label", `Mark Answer ${index + 1} as correct`);
        checkBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        checkBtn.addEventListener("click", () => {
          correctIndex = index;
          renderAnswers();
        });

        const inputWrap = document.createElement("div");
        inputWrap.className = "answer-input-wrap";

        const imgPreview = document.createElement("img");
        imgPreview.className = "answer-preview";
        if (ans.image) {
          imgPreview.src = ans.image;
          imgPreview.style.display = "block";
        }

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.className = "answer-input";
        textInput.placeholder = `Answer ${index + 1}`;
        textInput.value = ans.text;
        textInput.addEventListener("input", (e) => {
          answersData[index].text = (e.target as HTMLInputElement).value;
          updatePostButton();
        });

        inputWrap.appendChild(imgPreview);
        inputWrap.appendChild(textInput);

        // Hidden file input for image upload
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.className = "hidden-file-input";
        fileInput.addEventListener("change", (e) => {
          const inputEl = e.target as HTMLInputElement;
          const file = inputEl.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              answersData[index].image = (event.target?.result as string) || null;
              renderAnswers();
              updatePostButton();
            };
            reader.readAsDataURL(file);
          }
        });

        // Image button
        const imgBtn = document.createElement("button");
        imgBtn.className = "icon-btn";
        imgBtn.type = "button";
        imgBtn.setAttribute("aria-label", "Add image");
        imgBtn.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        `;
        imgBtn.addEventListener("click", () => fileInput.click());

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.className = "icon-btn";
        delBtn.type = "button";
        delBtn.setAttribute("aria-label", "Delete answer");
        delBtn.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
        `;
        delBtn.addEventListener("click", () => {
          answersData.splice(index, 1);
          if (answersData.length === 0) {
            correctIndex = -1;
          } else if (index === correctIndex) {
            correctIndex = 0;
          } else if (index < correctIndex) {
            correctIndex--;
          }
          renderAnswers();
          updatePostButton();
        });

        row.appendChild(checkBtn);
        row.appendChild(inputWrap);
        row.appendChild(fileInput);
        row.appendChild(imgBtn);
        row.appendChild(delBtn);

        answersList.appendChild(row);
      });

      // Limit strictly to 5 answers
      addAnswerBtn.disabled = answersData.length >= MAX_ANSWERS;
    }

    addAnswerBtn.addEventListener("click", () => {
      if (answersData.length < MAX_ANSWERS) {
        answersData.push({ text: "", image: null });
        if (correctIndex === -1) {
          correctIndex = 0;
        }
        renderAnswers();
        updatePostButton();
      }
    });

    postBtn.addEventListener("click", () => {
      if (postBtn.classList.contains("active")) {
        alert("Quiz post created!");
      }
    });

    renderAnswers();

Object.assign(window, { updatePostButton, renderAnswers });
