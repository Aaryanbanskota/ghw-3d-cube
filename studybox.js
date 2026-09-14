(function() {
    'use strict';

    // Inject styles for UI components
    const style = document.createElement('style');
    style.innerHTML = `
        #sb-dots-btn {
            position: fixed;
            top: 20px;
            right: 25px;
            cursor: pointer;
            z-index: 999999;
            background: rgba(255, 255, 255, 0.8);
            padding: 6px 10px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 18px;
            line-height: 1;
            user-select: none;
        }
        .sb-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .sb-modal-card {
            background: #f4f5f7;
            width: 520px;
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
        }
        .sb-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            justify-items: center;
        }
        .sb-grid-item {
            background: #e4e7eb;
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
            background: #d0d5dd;
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
            color: #111;
        }
        /* Form controls inside sub-modals */
        .sb-form-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 14px;
            font-weight: 600;
        }
        .sb-form-group input[type="text"], .sb-form-group input[type="password"] {
            padding: 6px 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            width: 240px;
            background: #fff;
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
        }
        .sb-action-btn:hover {
            background: #cbd3da;
        }
        /* Floating Toolbar */
        #sb-floating-toolbar {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            padding: 8px 16px;
            border-radius: 14px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            gap: 20px;
            align-items: center;
            z-index: 1000000;
        }
        .sb-tool-icon {
            width: 36px;
            height: 36px;
            cursor: pointer;
            padding: 6px;
            border-radius: 50%;
        }
        .sb-tool-icon.active {
            border: 1px solid #20c997;
            background: rgba(32, 201, 151, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Assets mapping from your inputs
    const assets = {
        highlighter: "https://i.postimg.cc/pVC9dv9R/texthiglitner.png",
        screenshot: "https://i.postimg.cc/jSp21d11/screen-short.png",
        loading: "https://i.postimg.cc/SsrKjLKb/lode.png",
        eye: "https://i.postimg.cc/CLdKLqTj/eye.png",
        blocker: "https://i.postimg.cc/pdMVZchH/block.png",
        addMore: "https://i.postimg.cc/cCCdHVj7/add-node.png",
        dotsLogo: "https://i.postimg.cc/jSp21d11/screen-short.png" // fallback/logo reference
    };

    // Create Top-Right Trigger Dots Button
    const dotsBtn = document.createElement('div');
    dotsBtn.id = 'sb-dots-btn';
    dotsBtn.innerHTML = '🔵 🟢 🟡<br>🟢 🔵 🟠<br>🟡 🟠 🔴';
    dotsBtn.style.fontSize = '10px';
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
                    <span>🔵🟢🟡 StudyBox</span>
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

        // Bind clicks to tools
        overlay.querySelector('#tool-status').onclick = openStatusBarModal;
        overlay.querySelector('#tool-blocker').onclick = openPageBlockerModal;
        overlay.querySelector('#tool-highlighter').onclick = openDrawingToolbar;
        overlay.querySelector('#tool-screenshot').onclick = () => { alert("Screenshot tool triggered!"); closeModal(); };
        overlay.querySelector('#tool-viewer').onclick = () => { alert("Site Viewer opened!"); closeModal(); };
        overlay.querySelector('#tool-add').onclick = () => { alert("Add More feature clicked!"); closeModal(); };

        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    // 2. Status-Bar Config Modal
    function openStatusBarModal() {
        closeModal();
        const overlay = document.createElement('div');
        overlay.id = 'sb-active-modal';
        overlay.className = 'sb-modal-overlay';
        overlay.innerHTML = `
            <div class="sb-modal-card">
                <div class="sb-back-arrow" id="sb-back">←</div>
                <div style="text-align:center; font-weight:bold; font-size:18px; margin-bottom:15px;">Status-Bar</div>
                <div class="sb-form-group">
                    <span>Task-Name</span>
                    <input type="text" placeholder="Enter task name" />
                </div>
                <div class="sb-form-group">
                    <span>Time</span>
                    <div>
                        <input type="text" placeholder="hr" style="width:45px; text-align:center; margin-right:5px;" />
                        <input type="text" placeholder="min" style="width:45px; text-align:center; margin-right:5px;" />
                        <input type="text" placeholder="sec" style="width:45px; text-align:center;" />
                    </div>
                </div>
                <div class="sb-form-group">
                    <span>Bar-color</span>
                    <div style="width:20px; height:20px; background:#20c997; border-radius:50%; display:inline-block;"></div>
                </div>
                <div class="sb-form-group">
                    <span>Preview</span>
                    <div style="width:240px; height:10px; background:#6c757d; border-radius:5px; overflow:hidden;">
                        <div style="width:40%; height:100%; background:#20c997;"></div>
                    </div>
                </div>
                <div class="sb-action-btn" id="sb-start">START</div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#sb-back').onclick = openDashboard;
        overlay.querySelector('#sb-start').onclick = () => { alert("Status Bar Task Started!"); closeModal(); };
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    // 3. Page-Blocker Config Modal
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
                
                <div style="font-size:13px; margin-bottom:5px; font-weight:600;">System-pass</div>
                <input type="text" value="123" readonly style="padding:6px; width:220px; text-align:center; border:1px solid #ccc; border-radius:6px; margin-bottom:10px;" />
                
                <div style="font-size:12px; color:#555; margin-bottom:10px;">OR enter yor password</div>
                
                <div style="font-size:13px; margin-bottom:5px; font-weight:600;">pass</div>
                <input type="password" style="padding:6px; width:220px; text-align:center; border:1px solid #ccc; border-radius:6px; margin-bottom:10px;" />
                
                <div style="font-size:13px; margin-bottom:5px; font-weight:600;">conform-pass</div>
                <input type="password" style="padding:6px; width:220px; text-align:center; border:1px solid #ccc; border-radius:6px; margin-bottom:15px;" />
                
                <div style="font-size:12px; margin-bottom:5px; font-weight:600;">message blocker will show</div>
                <textarea style="width:220px; height:50px; border:1px solid #ccc; border-radius:6px; padding:5px; text-align:center;">This page has been block</textarea>
                
                <div class="sb-action-btn" id="sb-start">START</div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#sb-back').onclick = openDashboard;
        overlay.querySelector('#sb-start').onclick = () => { alert("Page Blocker Activated!"); closeModal(); };
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }

    // 4. Floating Drawing/Highlighter Toolbar
    function openDrawingToolbar() {
        closeModal();
        // Remove existing toolbar if any
        const existingTb = document.getElementById('sb-floating-toolbar');
        if (existingTb) existingTb.remove();

        const toolbar = document.createElement('div');
        toolbar.id = 'sb-floating-toolbar';
        toolbar.innerHTML = `
            <div class="sb-tool-icon" id="tb-home" title="Dashboard">🔵🟢</div>
            <img src="${assets.highlighter}" class="sb-tool-icon active" id="tb-pen" title="Pen/Highlighter" />
            <img src="${assets.highlighter}" class="sb-tool-icon" id="tb-highlighter" title="Highlighter Tool" />
            <div class="sb-tool-icon" id="tb-eraser" title="Eraser" style="display:flex; align-items:center; justify-content:center; background:#1b3635; color:#fff; border-radius:50%; font-size:12px;">🧽</div>
        `;
        document.body.appendChild(toolbar);

        toolbar.querySelector('#tb-home').onclick = () => { toolbar.remove(); openDashboard(); };
    }

})();
