const rapiPdf = document.getElementById('rapipdf');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const textInput = document.getElementById('text-input');
const formatSelect = document.getElementById('format-select');
const loadContentBtn = document.getElementById('load-content');
const formatContentBtn = document.getElementById('format-content');
const fileStatus = document.getElementById('file-status');
const textStatus = document.getElementById('text-status');

document.querySelectorAll('.tab').forEach(tab => {
    if (tab) {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab, .tab-content').forEach(el => {
                if (el) el.classList.remove('active');
            });
            tab.classList.add('active');
            const tabContent = document.getElementById(`${tab.dataset.tab}-tab`);
            if (tabContent) tabContent.classList.add('active');
        });
    }
});

if (formatContentBtn && textInput && formatSelect) {
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
            if (textStatus) showStatus(textStatus, 'Invalid content format', 'error');
            console.error('Format error:', error);
        }
    });
}

if (loadContentBtn && textInput && formatSelect && rapiPdf) {
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

            const urlTab = document.querySelector('[data-tab="url"]');
            if (urlTab) urlTab.click();

            if (textStatus) showStatus(textStatus, 'Content loaded successfully', 'success');
        } catch (error) {
            if (textStatus) showStatus(textStatus, 'Invalid content format', 'error');
            console.error('Load error:', error);
        }
    });
}

if (dropZone) {
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

    const uploadButton = dropZone.querySelector('.btn-default');
    if (uploadButton && fileInput) {
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });
    }
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });
}

function handleFile(file) {
    if (!rapiPdf) {
        console.error('RapiPdf element not found');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            let jsonContent;

            if (file.name.endsWith('.json')) {
                JSON.parse(content); // Validate JSON
                jsonContent = content;
            } else {
                const obj = jsyaml.load(content);
                jsonContent = JSON.stringify(obj);
            }

            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            rapiPdf.setAttribute('spec-url', url);

            const urlTab = document.querySelector('[data-tab="url"]');
            if (urlTab) urlTab.click();

            if (fileStatus) showStatus(fileStatus, 'File loaded successfully', 'success');
        } catch (error) {
            if (fileStatus) showStatus(fileStatus, 'Invalid file format', 'error');
            console.error('File processing error:', error);
        }
    };
    reader.readAsText(file);
}

function showStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `status ${type}`;
    setTimeout(() => {
        element.className = 'status';
    }, 3000);
}

function applySettings() {
    if (!rapiPdf) {
        console.error('RapiPdf element not found');
        return;
    }

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
        if (element) {
            rapiPdf.setAttribute(attr, element.checked.toString());
        }
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
        if (element && element.value) {
            rapiPdf.setAttribute(attr, element.value);
        }
    });

    const button = document.querySelector('.apply-settings');
    if (button) {
        button.textContent = 'Settings Applied!';
        setTimeout(() => {
            button.textContent = 'Apply Settings';
        }, 2000);
    }
}

function initializeSettings() {
    if (!rapiPdf) {
        console.warn('RapiPdf element not found');
        return;
    }

    const booleanElements = document.querySelectorAll('input[type="checkbox"]');
    booleanElements.forEach(checkbox => {
        if (checkbox && checkbox.id) {
            const attr = checkbox.id;
            const value = rapiPdf.getAttribute(attr);
            checkbox.checked = value === null || value !== 'false';
        }
    });

    const valueElements = document.querySelectorAll('input[type="text"], input[type="color"], select');
    valueElements.forEach(input => {
        if (input && input.id) {
            const attr = input.id;
            const value = rapiPdf.getAttribute(attr);
            if (value) {
                input.value = value;
            }
        }
    });

    const specUrlInput = document.getElementById('spec-url');
    if (specUrlInput && rapiPdf) {
        const specUrl = rapiPdf.getAttribute('spec-url');
        if (specUrl) {
            specUrlInput.value = specUrl;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeSettings();
    } catch (error) {
        console.warn('Error initializing settings:', error);
    }
});