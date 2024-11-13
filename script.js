document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
});

const rapiPdf = document.getElementById('rapipdf');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const textInput = document.getElementById('text-input');
const formatSelect = document.getElementById('format-select');
const loadContentBtn = document.getElementById('load-content');
const formatContentBtn = document.getElementById('format-content');
const fileStatus = document.getElementById('file-status');
const textStatus = document.getElementById('text-status');

formatContentBtn.addEventListener('click', () => {
    try {
        const content = textInput.value.trim();
        if (!content) return;

        let formatted;
        if (formatSelect.value === 'json') {
            try {
                const obj = jsyaml.load(content);
                formatted = JSON.stringify(obj, null, 2);
            } catch {
                formatted = JSON.stringify(JSON.parse(content), null, 2);
            }
        } else {
            let obj;
            try {
                obj = JSON.parse(content);
            } catch {
                obj = jsyaml.load(content);
            }
            formatted = jsyaml.dump(obj);
        }
        textInput.value = formatted;
    } catch (error) {
        showStatus(textStatus, 'Invalid content format', 'error');
    }
});

loadContentBtn.addEventListener('click', () => {
    try {
        const content = textInput.value.trim();
        if (!content) return;

        let jsonContent;
        if (formatSelect.value === 'yaml') {
            jsonContent = JSON.stringify(jsyaml.load(content));
        } else {
            jsonContent = JSON.stringify(JSON.parse(content));
        }

        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        rapiPdf.setAttribute('spec-url', url);
        document.querySelector('[data-tab="url"]').click();
        showStatus(textStatus, 'Content loaded successfully', 'success');
    } catch (error) {
        showStatus(textStatus, 'Invalid content format', 'error');
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

dropZone.querySelector('.btn-default').addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            let jsonContent;

            if (file.name.endsWith('.json')) {
                JSON.parse(content);
                jsonContent = content;
            } else {
                const obj = jsyaml.load(content);
                jsonContent = JSON.stringify(obj);
            }

            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            rapiPdf.setAttribute('spec-url', url);
            document.querySelector('[data-tab="url"]').click();
            showStatus(fileStatus, 'File loaded successfully', 'success');
        } catch (error) {
            showStatus(fileStatus, 'Invalid file format', 'error');
        }
    };
    reader.readAsText(file);
}

function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status ${type}`;
    setTimeout(() => {
        element.className = 'status';
    }, 3000);
}

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('open');
}

function applySettings() {
    const booleanAttrs = [
        'include-info',
        'include-toc',
        'include-security',
        'include-example',
        'include-api-details',
        'include-api-list',
        'pdf-sort-tags'
    ];

    booleanAttrs.forEach(attr => {
        const element = document.getElementById(attr);
        rapiPdf.setAttribute(attr, element.checked.toString());
    });

    const textAttrs = [
        'pdf-title',
        'pdf-cover-text',
        'pdf-security-text',
        'pdf-api-text',
        'pdf-footer-text',
        'pdf-primary-color',
        'pdf-alternate-color',
        'pdf-schema-style'
    ];

    textAttrs.forEach(attr => {
        const element = document.getElementById(attr);
        if (element.value) {
            rapiPdf.setAttribute(attr, element.value);
        }
    });

    const button = document.querySelector('.apply-settings');
    button.textContent = 'Settings Applied!';
    setTimeout(() => {
        button.textContent = 'Apply Settings';
    }, 2000);
}

function initializeSettings() {
    const booleanElements = document.querySelectorAll('input[type="checkbox"]');
    booleanElements.forEach(checkbox => {
        const attr = checkbox.id;
        const value = rapiPdf.getAttribute(attr);
        checkbox.checked = value === null || value !== 'false';
    });

    const valueElements = document.querySelectorAll('input[type="text"], input[type="color"], select');
    valueElements.forEach(input => {
        const attr = input.id;
        const value = rapiPdf.getAttribute(attr);
        if (value) {
            input.value = value;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    document.getElementById('spec-url').value = rapiPdf.getAttribute('spec-url');
});