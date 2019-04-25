function openChatOverlay(){
    const modal = document.getElementById('chat-modal');
    modal.style.visibility = 'visible';
}
function closeChatOverlay(){
    const modal = document.getElementById('chat-modal');
    modal.style.visibility = 'collapse';
}
const idForInject = 'contact-chat-element';
const startChat = async ({email, formTitle,customFields}) => {
    if (AnswersWidget) {
        AnswersWidget.injectToElementById(idForInject);
        AnswersWidget.onChatLoaded(() => {
            AnswersWidget.clearChats(true);
            AnswersWidget.identifyUser({ email }, formTitle);
            if (AnswersWidget.setCustomFields) {
                try {
                    AnswersWidget.setCustomFields(Object.assign({}, customFields));
                } catch (_) { return undefined; }
            }
            AnswersWidget.beginChatWithForm();
        });
    }
};

const endChat = () => {
    if (AnswersWidget && AnswersWidget.ejectFromElementById) {
        AnswersWidget.clearChats(true);
        AnswersWidget.ejectFromElementById(idForInject);
        AnswersWidget.destroy();
    }
};

function generateCustomFields(data) {
    return Object.assign({}, {
        issue: data.issue,
        subcategory: data.subcategory,
        category: data.category,
    });
};

function getQuery() {
    const search = window.location.search;
    if (search && search.length) {
        
        try {
            const query = decodeURIComponent(search).slice(1).split('&').reduce((acc, cur) => {
                const [key, value] = cur.split('=');
                acc[key] = value;
                return acc;
            }, {});
            return query;
        } catch (e) {
            console.log({ e });
        }
    }
}

function parseToken(jwt){
    try {
        const json = JSON.parse(atob(jwt));
        return json;
    } catch(e){
        console.log({e});
    }
}

function start() {
    const query = getQuery();
    if (query) {
        const json = parseToken(query.data);
        const interval = setInterval(() => {
            if (AnswersWidget !== undefined) {
                clearInterval(interval);
                startChat({
                    email: json.email,
                    customFields: generateCustomFields(json),
                    formTitle: 'To get started, please enter your name.',
                });
            }
        }, 1000);

    }
}

start();