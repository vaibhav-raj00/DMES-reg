// ==UserScript==
// @name         BattleXo Tournament Auto-Filler (Advanced)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Auto-fill BattleXo tournament form with saved times and custom button
// @match        https://hub.battlexo.com/tournaments/clone/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const defaults = {
        startTime: '8:40 PM',
        endTime: '10:00 PM',
        deadlineTime: '7:00 PM',
        buttonName: 'Auto-Fill Tournament'
    };

    function saveSettings() {
        const data = {
            startTime: document.getElementById('bx-start-time').value.trim(),
            endTime: document.getElementById('bx-end-time').value.trim(),
            deadlineTime: document.getElementById('bx-deadline-time').value.trim(),
            buttonName: document.getElementById('bx-button-name').value.trim()
        };
        localStorage.setItem('bx-settings', JSON.stringify(data));
        alert('Settings saved!');
    }

    function loadSettings() {
        const data = JSON.parse(localStorage.getItem('bx-settings')) || defaults;
        return data;
    }

    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    function createUI() {
        const data = loadSettings();

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '100px';
        panel.style.right = '20px';
        panel.style.background = '#fff';
        panel.style.border = '2px solid #000';
        panel.style.padding = '15px';
        panel.style.borderRadius = '10px';
        panel.style.zIndex = 9999;
        panel.style.width = '250px';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        panel.innerHTML = `
            <label><b>Start Time:</b></label><br>
            <input type="text" id="bx-start-time" value="${data.startTime}" style="width:100%; margin-bottom:5px;"><br>

            <label><b>End Time:</b></label><br>
            <input type="text" id="bx-end-time" value="${data.endTime}" style="width:100%; margin-bottom:5px;"><br>

            <label><b>Deadline Time:</b></label><br>
            <input type="text" id="bx-deadline-time" value="${data.deadlineTime}" style="width:100%; margin-bottom:5px;"><br>

            <label><b>Button Name:</b></label><br>
            <input type="text" id="bx-button-name" value="${data.buttonName}" style="width:100%; margin-bottom:10px;"><br>

            <button id="bx-save" style="background:#007bff;color:#fff;padding:6px 10px;border:none;border-radius:5px;margin-bottom:5px;width:100%;">Save Settings</button>
            <button id="bx-fill" style="background:#28a745;color:#fff;padding:8px 10px;border:none;border-radius:5px;width:100%;">${data.buttonName}</button>
        `;
        document.body.appendChild(panel);

        // Save settings on button click
        document.getElementById('bx-save').addEventListener('click', saveSettings);

        // Fill form on click
        document.getElementById('bx-fill').addEventListener('click', () => {
            const settings = loadSettings();
            const today = getTodayDate();
            const title = `(${settings.startTime}) DMES COMPETITIVE SCRIM`;

            document.querySelector('input[placeholder="Tournament Title"]').value = title;
            document.querySelector('#rs-80').value = today; // Deadline
            document.querySelector('#rs-83').value = today; // Start
            document.querySelector('#rs-86').value = today; // End

            document.querySelector('input[placeholder="Max Members In a Team"]').value = '6';
            document.querySelector('input[placeholder="Min Members In a Team"]').value = '4';
            document.querySelector('input[placeholder="Max Number of Teams"]').value = '24';

            setTimeout(() => {
                document.querySelector('input[placeholder="Enter Number of Matches"]').value = '3';
                document.querySelector('input[placeholder="Number of wildcard (optional)"]').value = '0';
                document.querySelector('input[placeholder="Round Name"]').value = 'Round 1';

                const createBtn = document.querySelector('.create-tourneey-btn button[type="submit"]');
                if (createBtn) {
                    createBtn.click();
                } else {
                    alert("Create button not found.");
                }
            }, 500);
        });
    }

    window.addEventListener('load', () => {
        setTimeout(createUI, 1000);
    });
})();
