export {};

    const MAX_OPTIONS = 5;
    const optionsList = document.getElementById("optionsList") as HTMLElement;
    const addOptionBtn = document.getElementById("addOptionBtn") as HTMLButtonElement;
    const questionInput = document.getElementById("questionInput") as HTMLTextAreaElement;
    const postBtn = document.getElementById("postBtn") as HTMLElement;

    // Initial 2 options
    let optionsData: Array<{ text: string; image: string | null }> = [
      { text: "", image: null },
      { text: "", image: null }
    ];

    // Auto-resize question textarea
    questionInput.addEventListener("input", () => {
      questionInput.style.height = "auto";
      questionInput.style.height = questionInput.scrollHeight + "px";
      updatePostButton();
    });

    function updatePostButton() {
      const hasQuestion = questionInput.value.trim().length > 0;
      const hasAnyOption = optionsData.some(
        opt => opt.text.trim().length > 0 || opt.image !== null
      );

      if (hasQuestion || hasAnyOption) {
        postBtn.classList.add("active");
      } else {
        postBtn.classList.remove("active");
      }
    }

    function renderOptions() {
      optionsList.innerHTML = "";

      optionsData.forEach((opt, index) => {
        const row = document.createElement("div");
        row.className = "option-row";

        const inputWrap = document.createElement("div");
        inputWrap.className = "option-input-wrap";

        const imgPreview = document.createElement("img");
        imgPreview.className = "option-preview";
        if (opt.image) {
          imgPreview.src = opt.image;
          imgPreview.style.display = "block";
        }

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.className = "option-input";
        textInput.placeholder = `Option ${index + 1}`;
        textInput.value = opt.text;
        textInput.addEventListener("input", (e) => {
          optionsData[index].text = (e.target as HTMLInputElement).value;
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
              optionsData[index].image = (event.target?.result as string) || null;
              renderOptions();
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
        delBtn.setAttribute("aria-label", "Delete option");
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
          optionsData.splice(index, 1);
          renderOptions();
          updatePostButton();
        });

        row.appendChild(inputWrap);
        row.appendChild(fileInput);
        row.appendChild(imgBtn);
        row.appendChild(delBtn);

        optionsList.appendChild(row);
      });

      // Limit strictly to 5 options
      addOptionBtn.disabled = optionsData.length >= MAX_OPTIONS;
    }

    addOptionBtn.addEventListener("click", () => {
      if (optionsData.length < MAX_OPTIONS) {
        optionsData.push({ text: "", image: null });
        renderOptions();
        updatePostButton();
      }
    });

    postBtn.addEventListener("click", () => {
      if (postBtn.classList.contains("active")) {
        alert("Post created!");
      }
    });

    renderOptions();

Object.assign(window, { updatePostButton, renderOptions });
