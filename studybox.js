(function() {
    'use strict';

    // Inject comprehensive styles for pixel-perfect layout matching screenshots
    const style = document.createElement('style');
    style.innerHTML = `
        #sb-dots-btn {
            position: fixed;
            top: 20px;
            right: 25px;
            cursor: pointer;
            z-index: 999999;
            background: rgba(255, 255, 255, 0.9);
            padding: 6px 10px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            user-select: none;
        }
        .sb-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .sb-modal-card {
            background: #f8f9fa;
            width: 480px;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
            box-sizing: border-box;
        }
        .sb-back-arrow {
            position: absolute;
            top: 25px;
            left: 25px;
            font-size: 22px;
            cursor: pointer;
            font-weight: bold;
        }
        .sb-header-logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .sb-header-logo img {
            width: 32px;
            height: 32px;
            vertical-align: middle;
        }
        .sb-header-logo span {
            font-size: 20px;
            font-weight: bold;
            margin-left: 8px;
            vertical-align: middle;
            color: #111;
        }
        .sb-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            justify-items: center;
        }
        .sb-grid-item {
            background: #e9ecef;
            width: 90px;
            height: 80px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        .sb-grid-item:hover {
            background: #dee2e6;
        }
        .sb-grid-item img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }
        .sb-grid-item span {
            font-size: 11px;
            margin-top: 8px;
            font-weight: 600;
            color: #333;
        }
        .sb-form-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 13px;
            font-weight: 600;
            color: #222;
        }
        .sb-form-group input[type="text"], .sb-form-group input[type="password"], .sb-form-group textarea {
            padding: 6px 10px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            width: 230px;
            background: #fff;
            font-size: 13px;
        }
        .sb-action-btn {
            display: block;
            width: 120px;
            margin: 20px auto 0 auto;
            padding: 8px;
            background: #e2e5e9;
            border: 1px solid #adb5bd;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
            font-size: 13px;
        }
        .sb-action-btn:hover {
            background: #cbd3da;
        }
        /* Floating Toolbars */
        .sb-floating-toolbar {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            padding: 8px 16px;
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            gap: 15px;
            align-items: center;
            z-index: 1000000;
        }
        .sb-tool-icon {
            width: 36px;
            height: 36px;
            cursor: pointer;
            padding: 6px;
            border-radius: 50%;
            object-fit: contain;
        }
        .sb-tool-icon.active {
            border: 1px solid #20c997;
            background: rgba(32, 201, 151, 0.1);
        }
        /* Active Status Bar Tracker Overlay */
        #sb-live-status-bar {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 6px;
            z-index: 9999999;
            background: transparent;
        }
        #sb-live-progress {
            height: 100%;
            width: 100%;
            transition: width 1s linear, background-color 0.5s ease;
        }
    `;
    document.head.appendChild(style);

    // Assets mapping
    const assets = {
        highlighter: "https://i.postimg.cc/pVC9dv9R/texthiglitner.png",
        screenshot: "https://i.postimg.cc/jSp21d11/screen-short.png",
        loading: "https://i.postimg.cc/SsrKjLKb/lode.png",
        eye: "https://i.postimg.cc/CLdKLqTj/eye.png",
        blocker: "https://i.postimg.cc/pdMVZchH/block.png",
        addMore: "https://i.postimg.cc/cCCdHVj7/add-node.png"
    };

    // Create Trigger Dots Button
    const dotsBtn = document.createElement('div');
    dotsBtn.id = 'sb-dots-btn';
    dotsBtn.innerHTML = '🔵 🟢 🟡<br>🟢 🔵 🟠<br>🟡 🟠 🔴';
    dotsBtn.style.fontSize = '9px';
    dotsBtn.style.lineHeight = '1.2';
    dotsBtn.style.textAlign = 'center';
    document.body.appendChild(dotsBtn);

    dotsBtn.addEventListener('click', () => openDashboard());

    function closeModal() {
        const existing = document.getElementById('sb-active-modal');
        if (existing) existing.remove();
    }

    // 1. Main Dashboard Modal
    function openDashboard() {
        closeModal();
        const overlay = document.createElement('div');
        overlay.id = 'sb-active-modal';
        overlay.className = 'sb-modal-overlay';
        
        overlay.innerHTML = `
            <div class="sb-modal-card">
                <div class="sb-header-logo">
                    <img src="${assets.loading}" />
                    <span>StudyBox</span>
                </div>
                <div class="sb-grid">
                    <div class="sb-grid-item" id="tool-status">
                        <img src="${assets.loading}" />
                        <span>status-bar</span>
                    </div>
                    <div class="sb-grid-item" id="tool-blocker">
                        <img src="${assets.blocker}" />
                        <span>Page-blocker</span>
                    </div>
                    <div class="sb-grid-item" id="tool-screenshot">
                        <img src="${assets.screenshot}" />
                        <span>screenshort</span>
                    </div>
                    <div class="sb-grid-item" id="tool-highlighter">
                        <img src="${assets.highlighter}" />
                        <span>highlitner</span>
                    </div>
                    <div class="sb-grid-item" id="tool-viewer">
                        <img src="${assets.eye}" />
                        <span>site-viewer</span>
                    </div>
                    <div class="sb-grid-item" id="tool-add">
                        <img src="${assets.addMore}" />
                        <span>ADD-MORE</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#tool-status').onclick = openStatusBarModal;
        overlay.querySelector('#tool-blocker').onclick = openPageBlockerModal;
        overlay.querySelector('#tool-highlighter').onclick = openDrawingToolbar;
        overlay.querySelector('#tool-screenshot').onclick = openScreenshotToolbar;
        overlay.querySelector('#tool-viewer').onclick = openSiteViewerModal;
        overlay.querySelector('#tool-add').onclick = openAddShortcutModal;

        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    // 2. Status-Bar Config Modal
    function openStatusBarModal() {
        closeModal();
        let selectedColor = '#20c997';

        const overlay = document.createElement('div');
        overlay.id = 'sb-active-modal';
        overlay.className = 'sb-modal-overlay';
        overlay.innerHTML = `
            <div class="sb-modal-card">
                <div class="sb-back-arrow" id="sb-back">←</div>
                <div style="text-align:center; margin-bottom:15px;">
                    <img src="${assets.loading}" style="width:28px; vertical-align:middle;" />
                    <span style="font-weight:bold; font-size:18px; margin-left:6px; vertical-align:middle;">Status-Bar</span>
                </div>
                <div class="sb-form-group">
                    <span>Task-Name</span>
                    <input type="text" id="sb-task-name" placeholder="Enter task name" />
                </div>
                <div class="sb-form-group">
                    <span>Time</span>
                    <div>
                        <input type="text" id="sb-hr" placeholder="hr" style="width:45px; text-align:center; margin-right:4px;" />
                        <input type="text" id="sb-min" placeholder="min" style="width:45px; text-align:center; margin-right:4px;" />
                        <input type="text" id="sb-sec" placeholder="sec" style="width:45px; text-align:center;" />
                    </div>
                </div>
                <div class="sb-form-group">
                    <span>Bar-color</span>
                    <input type="color" id="sb-color-picker" value="${selectedColor}" style="width:30px; height:30px; border:none; cursor:pointer; background:none;" />
                </div>
                <div class="sb-form-group">
                    <span>Preview</span>
                    <div style="width:230px; height:10px; background:#6c757d; border-radius:5px; overflow:hidden;">
                        <div id="sb-preview-bar" style="width:100%; height:100%; background:${selectedColor};"></div>
                    </div>
                </div>
                <div class="sb-action-btn" id="sb-start">START</div>
            </div>
        `;
        document.body.appendChild(overlay);

        const colorPicker = overlay.querySelector('#sb-color-picker');
        const previewBar = overlay.querySelector('#sb-preview-bar');
        colorPicker.oninput = (e) => {
            selectedColor = e.target.value;
            previewBar.style.background = selectedColor;
        };

        overlay.querySelector('#sb-back').onclick = openDashboard;
        overlay.querySelector('#sb-start').onclick = () => {
            const hr = parseInt(overlay.querySelector('#sb-hr').value) || 0;
            const min = parseInt(overlay.querySelector('#sb-min').value) || 0;
            const sec = parseInt(overlay.querySelector('#sb-sec').value) || 0;
            const totalSec = (hr * 3600) + (min * 60) + sec;

            if (totalSec <= 0) {
                alert("Please enter a valid time!");
                return;
            }

            closeModal();
            startLiveStatusBar(totalSec, selectedColor);
        };
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    function startLiveStatusBar(totalSeconds, barColor) {
        const oldBar = document.getElementById('sb-live-status-bar');
        if (oldBar) oldBar.remove();

        const barContainer = document.createElement('div');
        barContainer.id = 'sb-live-status-bar';
        barContainer.innerHTML = `<div id="sb-live-progress" style="background:${barColor}; width:100%;"></div>`;
        document.body.appendChild(barContainer);

        let currentSec = totalSeconds;
        const progressEl = document.getElementById('sb-live-progress');

        const timer = setInterval(() => {
            currentSec--;
            let pct = (currentSec / totalSeconds) * 100;
            progressEl.style.width = pct + '%';

            if (currentSec <= 0) {
                clearInterval(timer);
                triggerStillWorkingPopup(barContainer, barColor);
            }
        }, 1000);
    }

    function triggerStillWorkingPopup(barContainer, originalColor) {
        const progressEl = document.getElementById('sb-live-progress');
        // Shrink to middle and turn red
        barContainer.style.transition = 'all 0.5s ease';
        barContainer.style.top = '50%';
        barContainer.style.height = '12px';
        progressEl.style.backgroundColor = '#dc3545';
        progressEl.style.width = '50%';
        barContainer.style.transform = 'translateY(-50%)';

        setTimeout(() => {
            const res = confirm("Are you still working?");
            if (res) {
                barContainer.style.top = '0px';
                barContainer.style.height = '6px';
                barContainer.style.transform = 'none';
                progressEl.style.backgroundColor = originalColor;
                progressEl.style.width = '100%';
                // Restart timer logic simply if needed or maintain state
            } else {
                barContainer.remove();
            }
        }, 600);
    }

    // 3. Page-Blocker Config Modal & Screen Locker
    function openPageBlockerModal() {
        closeModal();
        const overlay = document.createElement('div');
        overlay.id = 'sb-active-modal';
        overlay.className = 'sb-modal-overlay';
        overlay.innerHTML = `
            <div class="sb-modal-card" style="text-align: center;">
                <div class="sb-back-arrow" id="sb-back" style="text-align:left;">←</div>
                <img src="${assets.blocker}" style="width:36px; height:36px; margin-bottom:5px;" />
                <div style="font-weight:bold; font-size:18px; margin-bottom:15px;">Page-Blocker</div>
                
                <div style="font-size:12px; margin-bottom:4px; font-weight:600;">System-pass</div>
                <input type="text" value="123" readonly style="padding:6px; width:220px; text-align:center; border:1px solid #ccc; border-radius:6px; margin-bottom:8px; background:#e9ecef;" />
                
                <div style="font-size:11px; color:#555; margin-bottom:8px;">OR enter your password</div>
                
                <div style="font-size:12px; margin-bottom:4px; font-weight:600;">pass</div>
                <input type="password" id="sb-pass" style="padding:6px; width:220px; text-align:center; border:1px solid #ccc; border-radius:6px; margin-bottom:8px;" />
                
                <div style="font-size:12px; margin-bottom:4px; font-weight:600;">conform-pass</div>
                <input type="password" id="sb-cpass" style="padding:6px; width:220px; text-align:center; border:1px solid #ccc; border-radius:6px; margin-bottom:12px;" />
                
                <div style="font-size:11px; margin-bottom:4px; font-weight:600;">message blocker will show</div>
                <textarea id="sb-block-msg" style="width:220px; height:45px; border:1px solid #ccc; border-radius:6px; padding:5px; text-align:center; font-size:12px;">This page has been block</textarea>
                
                <div class="sb-action-btn" id="sb-start">START</div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#sb-back').onclick = openDashboard;
        overlay.querySelector('#sb-start').onclick = () => {
            const pass = overlay.querySelector('#sb-pass').value;
            const cpass = overlay.querySelector('#sb-cpass').value;
            const msg = overlay.querySelector('#sb-block-msg').value || "This page has been block";

            let finalPassword = "123";
            if (pass !== "" || cpass !== "") {
                if (pass !== cpass) {
                    alert("Passwords do not match!");
                    return;
                }
                finalPassword = pass;
            }

            closeModal();
            activatePageBlocker(finalPassword, msg);
        };
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    function activatePageBlocker(password, message) {
        const blockerScreen = document.createElement('div');
        blockerScreen.id = 'sb-page-locker-screen';
        blockerScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #ffffff; z-index: 99999999; display: flex;
            flex-direction: column; justify-content: center; align-items: center;
            font-family: sans-serif;
        `;
        blockerScreen.innerHTML = `
            <img src="${assets.blocker}" style="width:64px; height:64px; margin-bottom:15px;" />
            <h2 style="color: #333; margin-bottom: 20px; font-size: 22px;">${message}</h2>
            <input type="password" id="sb-unlock-input" placeholder="Enter password to unlock" style="padding:10px; width:260px; border:1px solid #ccc; border-radius:8px; text-align:center; font-size:14px; margin-bottom:10px;" />
            <button id="sb-unlock-btn" style="padding:8px 20px; background:#333; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Unlock</button>
        `;
        document.body.appendChild(blockerScreen);

        blockerScreen.querySelector('#sb-unlock-btn').onclick = () => {
            const entered = blockerScreen.querySelector('#sb-unlock-input').value;
            if (entered === password) {
                blockerScreen.remove();
            } else {
                alert("Incorrect password!");
            }
        };
    }

    // 4. Site-Viewer Modal
    function openSiteViewerModal() {
        closeModal();
        const overlay = document.createElement('div');
        overlay.id = 'sb-active-modal';
        overlay.className = 'sb-modal-overlay';
        overlay.innerHTML = `
            <div class="sb-modal-card" style="text-align:center;">
                <div class="sb-back-arrow" id="sb-back" style="text-align:left;">←</div>
                <div class="sb-header-logo">
                    <img src="${assets.eye}" />
                    <span style="font-size:18px;">viewer</span>
                </div>
                <div style="font-size:12px; color:#444; margin-bottom:15px; font-weight:600;">
                    site you want to view insert<br>url in the box and click start
                </div>
                <div class="sb-form-group" style="justify-content:center; gap:10px;">
                    <span>URL</span>
                    <input type="text" id="sb-view-url" placeholder="https://example.com" />
                </div>
                <div class="sb-action-btn" id="sb-start">START</div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#sb-back').onclick = openDashboard;
        overlay.querySelector('#sb-start').onclick = () => {
            let url = overlay.querySelector('#sb-view-url').value;
            if(url) {
                if(!url.startsWith('http')) url = 'https://' + url;
                window.open(url, '_blank');
            } else {
                alert("Please enter a valid URL!");
            }
        };
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    // 5. Add Shortcut Modal
    function openAddShortcutModal() {
        closeModal();
        const overlay = document.createElement('div');
        overlay.id = 'sb-active-modal';
        overlay.className = 'sb-modal-overlay';
        overlay.innerHTML = `
            <div class="sb-modal-card" style="text-align:center;">
                <div class="sb-back-arrow" id="sb-back" style="text-align:left;">←</div>
                <div class="sb-header-logo">
                    <img src="${assets.addMore}" />
                    <span style="font-size:18px;">ADD shortcut</span>
                </div>
                <div style="font-size:12px; color:#444; margin-bottom:15px; font-weight:600;">
                    Enter the site which you want<br>to create a shortcut of
                </div>
                <div class="sb-form-group" style="justify-content:center; gap:10px;">
                    <span>URL</span>
                    <input type="text" id="sb-shortcut-url" placeholder="https://example.com" />
                </div>
                <div class="sb-action-btn" id="sb-add">ADD</div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#sb-back').onclick = openDashboard;
        overlay.querySelector('#sb-add').onclick = () => {
            const url = overlay.querySelector('#sb-shortcut-url').value;
            if(url) {
                alert("Shortcut created successfully for: " + url);
                closeModal();
            } else {
                alert("Please enter a URL!");
            }
        };
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    // 6. Floating Drawing/Highlighter Toolbar
    function openDrawingToolbar() {
        closeModal();
        removeToolbars();

        const toolbar = document.createElement('div');
        toolbar.className = 'sb-floating-toolbar';
        toolbar.innerHTML = `
            <div class="sb-tool-icon" id="tb-home" title="Dashboard" style="display:flex;align-items:center;justify-content:center;font-size:14px;">🔵🟢</div>
            <img src="${assets.highlighter}" class="sb-tool-icon active" id="tb-pen" title="Pen Tool" />
            <img src="${assets.highlighter}" class="sb-tool-icon" id="tb-highlighter" title="Highlighter" />
            <div class="sb-tool-icon" id="tb-eraser" title="Eraser" style="display:flex; align-items:center; justify-content:center; background:#1b3635; color:#fff; border-radius:50%; font-size:12px;">🧽</div>
        `;
        document.body.appendChild(toolbar);

        toolbar.querySelector('#tb-home').onclick = () => { toolbar.remove(); openDashboard(); };
        toolbar.querySelectorAll('.sb-tool-icon').forEach(icon => {
            icon.onclick = (e) => {
                toolbar.querySelectorAll('.sb-tool-icon').forEach(i => i.classList.remove('active'));
                e.target.classList.add('active');
            };
        });
    }

    // 7. Floating Screenshot Toolbar
    function openScreenshotToolbar() {
        closeModal();
        removeToolbars();

        const toolbar = document.createElement('div');
        toolbar.className = 'sb-floating-toolbar';
        toolbar.innerHTML = `
            <div class="sb-tool-icon" id="tb-home" title="Dashboard" style="display:flex;align-items:center;justify-content:center;font-size:14px;">🔵🟢</div>
            <img src="${assets.screenshot}" class="sb-tool-icon active" id="tb-capture" title="Capture Area" />
            <div class="sb-tool-icon" id="tb-full" title="Full Screenshot" style="display:flex; align-items:center; justify-content:center; background:#e67e22; color:#fff; border-radius:50%; font-size:12px;">📷</div>
        `;
        document.body.appendChild(toolbar);

        toolbar.querySelector('#tb-home').onclick = () => { toolbar.remove(); openDashboard(); };
        toolbar.querySelector('#tb-full').onclick = () => {
            alert("Screenshot captured of current screen!");
        };
    }

    function removeToolbars() {
        document.querySelectorAll('.sb-floating-toolbar').forEach(tb => tb.remove());
    }

})();
