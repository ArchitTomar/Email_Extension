console.log("jai shree ram");

function findComposeToolbar() {
    const selectors = ['.btc .aDh [role="toolbar"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function createAIButton() {
    const button = document.createElement('div');

    const sendButton = document.querySelector('.T-I.T-I-atl.L3');

    if (sendButton) {
        button.className = sendButton.className + " ai-reply-button";
        const styles = window.getComputedStyle(sendButton);
        for (let prop of styles) {
            button.style.setProperty(prop, styles.getPropertyValue(prop), styles.getPropertyPriority(prop));
        }

        // ✅ force spacing so it's not grouped with Send
        button.style.marginLeft = '12px';
        button.style.marginRight = '4px';
        button.style.display = 'inline-flex';
        button.style.verticalAlign = 'middle';
    } else {
        button.className = 'T-I J-J5-Ji aoO v7 T-I-at1 L3 ai-reply-button';
        button.style.marginLeft = '12px';
    }

    button.innerText = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');

    button.addEventListener('click', async () => {
        console.log("🚀 AI Reply clicked");
        try {
            // Extract original email body (opened mail view)
            let originalEmail = document.querySelector(".a3s.aiL")?.innerText || "";

            // Fallback to compose area if no opened email body found
            if (!originalEmail) {
                originalEmail = document.querySelector('.Am.Al.editable')?.innerText || "";
            }

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: originalEmail,   // ✅ send proper email content
                    tone: "professional"           // ✅ tone added
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiContent = data.content || 'No content received from backend';

            // Find compose area and insert reply
            let composeArea = document.querySelector('.Am.Al.editable[role="textbox"]');
            if (composeArea) {
                composeArea.innerText = aiContent;
                console.log("✅ AI content inserted:", aiContent);
            } else {
                console.log("❌ No compose area found");
                alert("Could not find compose area to insert AI content");
            }
        } catch (error) {
            console.error("❌ Error fetching AI content:", error);
            alert(`Failed to generate AI content: ${error.message}`);
        }
    });

    return button;
}

function injectButton() {
    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("❌ Toolbar not found yet");
        return;
    }

    const existingButton = toolbar.querySelector('.ai-reply-button');
    if (existingButton) {
        existingButton.remove();
    }

    console.log("✅ Toolbar Found");

    const button = createAIButton();

    const sendWrapper = toolbar.querySelector('.dC');
    const sendButton = sendWrapper ? sendWrapper.querySelector('.T-I.T-I-atl.L3') : null;

    if (sendWrapper && sendButton) {
        sendButton.insertAdjacentElement("afterend", button);
        console.log("✅ AI Reply inserted next to Send with spacing");
    } else {
        toolbar.appendChild(button);
        console.log("⚠️ Fallback: AI Reply appended at end of toolbar");
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btc, [role="dialog"]') ||
             node.querySelector('.aDh, .btc, [role="dialog"]'))
        );
        if (hasComposeElements) {
            console.log("✉️ Compose window detected");
            setTimeout(injectButton, 1000);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
