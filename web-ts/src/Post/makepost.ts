export {};

    const titleInput = document.getElementById('titleInput') as HTMLTextAreaElement;
    const bodyInput = document.getElementById('bodyInput') as HTMLTextAreaElement;
    const postBtn = document.getElementById('postBtn') as HTMLElement;
    const photoInput = document.getElementById('photoInput') as HTMLInputElement;
    const videoInput = document.getElementById('videoInput') as HTMLInputElement;
    const mediaPreviewBox = document.getElementById('mediaPreviewBox') as HTMLElement;
    const previewImageEl = document.getElementById('previewImageEl') as HTMLImageElement;
    const previewVideoEl = document.getElementById('previewVideoEl') as HTMLVideoElement;

    let lastFocusedInput: HTMLTextAreaElement = titleInput;
    let attachedPhotoData: string | null = null;
    let attachedVideoData: string | null = null;

    // Back to feed
    function goBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'feed.html';
      }
    }

    titleInput.addEventListener('focus', () => { lastFocusedInput = titleInput; });
    bodyInput.addEventListener('focus', () => { lastFocusedInput = bodyInput; });

    function checkPostEligibility() {
      const hasTitle = titleInput.value.trim().length > 0;
      const hasBody = bodyInput.value.trim().length > 0;
      const hasMedia = attachedPhotoData !== null || attachedVideoData !== null;

      if (hasTitle || hasBody || hasMedia) {
        postBtn.classList.add('active');
      } else {
        postBtn.classList.remove('active');
      }
    }

    titleInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
      checkPostEligibility();
    });

    bodyInput.addEventListener('input', checkPostEligibility);

    // ==========================================
    // 1. PHOTO UPLOAD (Compressed so it never fails)
    // ==========================================
    photoInput.addEventListener('change', function(e) {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);

          // Compress to lightweight JPEG
          attachedPhotoData = canvas.toDataURL('image/jpeg', 0.72);
          attachedVideoData = null; // Clear video if photo chosen

          previewVideoEl.style.display = 'none';
          previewVideoEl.src = '';
          previewImageEl.src = attachedPhotoData;
          previewImageEl.style.display = 'block';
          mediaPreviewBox.style.display = 'block';

          checkPostEligibility();
        };
        img.src = (evt.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    });

    // ==========================================
    // 2. VIDEO UPLOAD (Added event listener)
    // ==========================================
    videoInput.addEventListener('change', function(e) {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        attachedVideoData = (evt.target?.result as string) || null;
        attachedPhotoData = null; // Clear photo if video chosen

        previewImageEl.style.display = 'none';
        previewImageEl.src = '';
        previewVideoEl.src = attachedVideoData || '';
        previewVideoEl.style.display = 'block';
        mediaPreviewBox.style.display = 'block';

        checkPostEligibility();
      };
      reader.readAsDataURL(file);
    });

    function clearAttachedMedia() {
      attachedPhotoData = null;
      attachedVideoData = null;
      photoInput.value = '';
      videoInput.value = '';
      previewImageEl.src = '';
      previewVideoEl.src = '';
      previewImageEl.style.display = 'none';
      previewVideoEl.style.display = 'none';
      mediaPreviewBox.style.display = 'none';
      checkPostEligibility();
    }

    // ==========================================
    // 3. CUSTOM LINK POPUP
    // ==========================================
    function openLinkModal() {
      const linkInp = document.getElementById('linkInputValue') as HTMLInputElement;
      linkInp.value = '';
      document.getElementById('linkModalOverlay')!.style.display = 'flex';
      setTimeout(() => linkInp.focus(), 100);
    }

    function closeLinkModal() {
      document.getElementById('linkModalOverlay')!.style.display = 'none';
    }

    function confirmInsertLink() {
      const url = (document.getElementById('linkInputValue') as HTMLInputElement).value.trim();
      if (url) {
        bodyInput.focus();
        bodyInput.value += (bodyInput.value ? "\n" : "") + url;
        checkPostEligibility();
      }
      closeLinkModal();
    }

    // Insert # and @
    function insertText(char: string) {
      const input = lastFocusedInput;
      input.focus();
      const start = input.selectionStart || input.value.length;
      const end = input.selectionEnd || input.value.length;
      const val = input.value;
      input.value = val.substring(0, start) + char + val.substring(end);
      input.selectionStart = input.selectionEnd = start + 1;
      input.dispatchEvent(new Event('input'));
    }

    // ==========================================
    // 4. INDEXEDDB STORAGE (Saves even large files without crashing)
    // ==========================================
    function saveToIndexedDB(post: any) {
      return new Promise((resolve) => {
        try {
          const req = indexedDB.open('TrexFeedStorage', 1);
          req.onupgradeneeded = function(e) {
            (e.target as IDBOpenDBRequest).result.createObjectStore('userPosts', { keyPath: 'id' });
          };
          req.onsuccess = function(e) {
            const db = (e.target as IDBOpenDBRequest).result;
            const tx = db.transaction('userPosts', 'readwrite');
            tx.objectStore('userPosts').put(post);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
          };
          req.onerror = () => resolve(false);
        } catch (err) {
          resolve(false);
        }
      });
    }

    // Post Submit
    async function submitPost() {
      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      if (!title && !body && !attachedPhotoData && !attachedVideoData) {
        return;
      }

      postBtn.innerText = 'Posting...';
      postBtn.style.opacity = '0.6';

      const newPost = {
        id: 'usr_' + Date.now(),
        author: 'You',
        handle: '@you',
        time: 'Just now',
        title: title || (body ? body.substring(0, 30) + '...' : 'Shared Media'),
        body: body,
        image: attachedPhotoData,
        video: attachedVideoData,
        likes: 0,
        dislikes: 0,
        reposts: 0,
        comments: 0
      };

      // 1. Save in IndexedDB (Full size media support)
      await saveToIndexedDB(newPost);

      // 2. Also save in localStorage (Backup for instant load)
      try {
        const stored = JSON.parse(localStorage.getItem('feed_user_posts') || '[]') || [];
        // Light version without heavy video for localStorage
        const lightPost = { ...newPost };
        if (lightPost.video) lightPost.video = null; // video remains in IndexedDB
        stored.unshift(lightPost);
        localStorage.setItem('feed_user_posts', JSON.stringify(stored.slice(0, 20)));
      } catch (err) {
        console.warn('LocalStorage quota limit reached, stored in IndexedDB.');
      }

      // Feed page par wapas jaye
      window.location.href = 'feed.html';
    }

    // Keyboard resize
    if (window.visualViewport) {
      const handleResize = () => {
        const viewportHeight = window.visualViewport!.height;
        document.getElementById('appScreen')!.style.height = `${viewportHeight}px`;
      };
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }

Object.assign(window, { goBack, checkPostEligibility, clearAttachedMedia, openLinkModal, closeLinkModal, confirmInsertLink, insertText, saveToIndexedDB, submitPost });
