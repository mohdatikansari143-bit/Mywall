export {};

    const bugTitle = document.getElementById('bugTitle') as HTMLTextAreaElement;
    const bugDescription = document.getElementById('bugDescription') as HTMLTextAreaElement;
    const tgUsername = document.getElementById('tgUsername') as HTMLInputElement;
    const tgUserId = document.getElementById('tgUserId') as HTMLInputElement;
    const submitBtn = document.getElementById('submitBtn')!;
    const screenshotInput = document.getElementById('screenshotInput') as HTMLInputElement;
    const previewContainer = document.getElementById('previewContainer')!;
    const screenshotImg = document.getElementById('screenshotImg') as HTMLImageElement;

    // Title type hone par submit button activate
    function checkInputs() {
      if (bugTitle.value.trim().length > 0) {
        submitBtn.classList.add('active');
      } else {
        submitBtn.classList.remove('active');
      }
    }

    bugTitle.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
      checkInputs();
    });

    bugDescription.addEventListener('input', checkInputs);

    // Photo/Screenshot select handler
    function handleFileSelect(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          screenshotImg.src = (e.target?.result as string) || '';
          previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    }

    // Remove screenshot
    function removeScreenshot() {
      screenshotInput.value = "";
      screenshotImg.src = "";
      previewContainer.style.display = 'none';
    }

    // Submit Bug Report
    function submitBugReport() {
      if (!bugTitle.value.trim()) return;

      const user = tgUsername.value.trim() || "Not provided";
      const uid = tgUserId.value.trim() || "Not provided";

      alert(
        "Bug Report Submitted Successfully!\n" +
        "Telegram User: " + user + "\n" +
        "User ID: " + uid + "\n" +
        "Title: " + bugTitle.value
      );
    }

    // --- MOBILE KEYBOARD FLOATING BAR ADJUSTMENT ---
    if (window.visualViewport) {
      const handleResize = () => {
        const viewportHeight = window.visualViewport.height;
        document.getElementById('appScreen').style.height = `${viewportHeight}px`;
      };

      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

Object.assign(window, { checkInputs, handleFileSelect, removeScreenshot, submitBugReport });
