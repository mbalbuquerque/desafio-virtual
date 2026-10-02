/* =====================================================
   CORRA POR VOCÊ
   APP.JS
===================================================== */


/* =====================================================
   1. CONFIGURAÇÕES DO DESAFIO
===================================================== */

const CHALLENGE = {

    start: new Date(
        "2026-10-05T00:00:00-03:00"
    ),

    end: new Date(
        "2026-12-31T23:59:59-03:00"
    ),

    goals: {
        "100km": 100,
        "200km": 200,
        "300km": 300,
        "400km": 400
    }

};


/* =====================================================
   2. ELEMENTOS PRINCIPAIS
===================================================== */

const menuButton =
    document.getElementById("menuButton");

const navigation =
    document.getElementById("navigation");

const themeButton =
    document.getElementById("themeButton");

const registrationForm =
    document.getElementById("registrationForm");

const formMessage =
    document.getElementById("formMessage");

const searchProgressButton =
    document.getElementById(
        "searchProgressButton"
    );

const progressEmail =
    document.getElementById(
        "progressEmail"
    );


/* =====================================================
   3. FUNÇÕES AUXILIARES
===================================================== */

/*
 * Evita que conteúdo vindo do banco seja
 * interpretado como HTML.
 */

function escapeHTML(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/*
 * Converte KM para número seguro.
 */

function normalizeKilometers(value) {

    const kilometers =
        Number(value);

    if (
        !Number.isFinite(kilometers) ||
        kilometers < 0
    ) {

        return 0;

    }

    return kilometers;

}


/* =====================================================
   4. MENU MOBILE
===================================================== */

if (
    menuButton &&
    navigation
) {

    menuButton.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "active"
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation
                        .classList
                        .remove("active");

                }
            );

        });

}


/* =====================================================
   5. DARK / LIGHT MODE
===================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "cpv-theme"
        );


    if (
        savedTheme === "light"
    ) {

        document.body
            .classList
            .add("light-mode");


        if (themeButton) {

            themeButton.textContent =
                "☀";

        }

    }

}


function toggleTheme() {

    document.body
        .classList
        .toggle("light-mode");


    const isLight =
        document.body
            .classList
            .contains("light-mode");


    localStorage.setItem(

        "cpv-theme",

        isLight
            ? "light"
            : "dark"

    );


    if (themeButton) {

        themeButton.textContent =
            isLight
                ? "☀"
                : "☾";

    }

}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        toggleTheme
    );

}


/* =====================================================
   6. COUNTDOWN
===================================================== */

function updateCountdown() {

    const now =
        new Date();

    const difference =
        CHALLENGE.end - now;


    const daysElement =
        document.getElementById("days");

    const hoursElement =
        document.getElementById("hours");

    const minutesElement =
        document.getElementById("minutes");

    const secondsElement =
        document.getElementById("seconds");


    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {

        return;

    }


    /*
     * Desafio encerrado
     */

    if (difference <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        return;

    }


    const days =
        Math.floor(
            difference /
            86400000
        );


    const hours =
        Math.floor(
            (
                difference %
                86400000
            ) /
            3600000
        );


    const minutes =
        Math.floor(
            (
                difference %
                3600000
            ) /
            60000
        );


    const seconds =
        Math.floor(
            (
                difference %
                60000
            ) /
            1000
        );


    daysElement.textContent =
        String(days)
            .padStart(2, "0");


    hoursElement.textContent =
        String(hours)
            .padStart(2, "0");


    minutesElement.textContent =
        String(minutes)
            .padStart(2, "0");


    secondsElement.textContent =
        String(seconds)
            .padStart(2, "0");

}


/* =====================================================
   7. MENSAGENS DO FORMULÁRIO
===================================================== */

function showFormMessage(
    message,
    type
) {

    if (!formMessage) {
        return;
    }


    formMessage.textContent =
        message;


    if (type === "success") {

        formMessage.style.color =
            "#A4D932";

    } else {

        formMessage.style.color =
            "#FF6262";

    }

}


/* =====================================================
   8. INSCRIÇÃO
===================================================== */

async function handleRegistration(
    event
) {

    event.preventDefault();


    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const whatsappInput =
        document.getElementById("whatsapp");

    const teamInput =
        document.getElementById("team");

    const modalityInput =
        document.getElementById("modality");


    if (
        !nameInput ||
        !emailInput ||
        !modalityInput
    ) {

        return;

    }


    const name =
        nameInput
            .value
            .trim();


    const email =
        emailInput
            .value
            .trim()
            .toLowerCase();


    const whatsapp =
        whatsappInput
            ? whatsappInput.value.trim()
            : "";


    const team =
        teamInput
            ? teamInput.value.trim()
            : "";


    const modality =
        modalityInput.value;


    /*
     * Campos obrigatórios
     */

    if (
        !name ||
        !email ||
        !modality
    ) {

        showFormMessage(
            "Preencha nome, e-mail e modalidade.",
            "error"
        );

        return;

    }


    /*
     * E-mail
     */

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailRegex.test(email)
    ) {

        showFormMessage(
            "Informe um e-mail válido.",
            "error"
        );

        return;

    }


    /*
     * Modalidade
     */

    if (
        !CHALLENGE.goals[
            modality
        ]
    ) {

        showFormMessage(
            "Selecione uma modalidade válida.",
            "error"
        );

        return;

    }


    const submitButton =
        registrationForm
            .querySelector(
                'button[type="submit"]'
            );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.innerHTML =
            "Enviando...";

    }


    const registration = {

        nome:
            name,

        email:
            email,

        whatsapp:
            whatsapp || null,

        equipe:
            team || null,

        modalidade:
            modality,

        km_percorrido:
            0

    };


    try {

        /*
         * Supabase
         */

        const { error } = await db
    .from("inscricoes")
    .insert([
        registration
    ]);


        if (error) {

            console.error(
                "Erro Supabase:",
                error
            );


            /*
             * E-mail duplicado
             */

            if (
                error.code === "23505"
            ) {

                showFormMessage(
                    "Este e-mail já possui uma inscrição.",
                    "error"
                );

                return;

            }


            throw error;

        }


        console.log(
            "Inscrição criada:",
           

        );console.log(
    "Inscrição criada com sucesso."
);


        showFormMessage(
            "✓ Inscrição realizada com sucesso!",
            "success"
        );


        registrationForm.reset();


        /*
         * Atualiza os componentes
         * sem recarregar a página.
         */

        await Promise.all([

            loadParticipantCount(),

            loadRanking()

        ]);


    } catch (error) {

        console.error(
            "Erro ao realizar inscrição:",
            error
        );


        showFormMessage(
            "Não foi possível realizar sua inscrição. Tente novamente.",
            "error"
        );


    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                'Fazer minha inscrição <span>→</span>';

        }

    }

}


/* /* =====================================================
   9. CONTADOR DE PARTICIPANTES
===================================================== */

async function loadParticipantCount() {

    const element =
        document.getElementById(
            "participantCount"
        );


    if (!element) {
        return;
    }


    try {

        /*
         * Consulta somente o total.
         *
         * Não acessamos diretamente
         * a tabela inscricoes.
         */

        const {
            data,
            error
        } = await db.rpc(
            "total_participantes"
        );


        if (error) {
            throw error;
        }


        element.textContent =
            Number(data || 0);


    } catch (error) {

        console.error(
            "Erro ao carregar participantes:",
            error
        );


        /*
         * Não exibimos erro técnico
         * para o visitante.
         */

        element.textContent =
            "—";

    }

}
/* =====================================================
   10. CONSULTA DE PROGRESSO
===================================================== */

async function searchProgress() {

    const emailInput =
        document.getElementById(
            "progressEmail"
        );


    const result =
        document.getElementById(
            "progressResult"
        );


    if (
        !emailInput ||
        !result
    ) {

        return;

    }


    const email =
        emailInput
            .value
            .trim()
            .toLowerCase();


    if (!email) {

        result.innerHTML = `

            <div class="empty-message">

                Informe o e-mail
                utilizado na inscrição.

            </div>

        `;

        return;

    }


    result.innerHTML = `

        <div class="empty-message">

            Buscando seu progresso...

        </div>

    `;


    try {

        const {
            data,
            error
        } = await db

            .from("inscricoes")

            .select(
                "id,nome,email,equipe,modalidade,km_percorrido"
            )

            .eq(
                "email",
                email
            )

            .maybeSingle();


        if (error) {
            throw error;
        }


        if (!data) {

            result.innerHTML = `

                <div class="empty-message">

                    Nenhuma inscrição encontrada
                    para este e-mail.

                </div>

            `;

            return;

        }


        renderProgress(data);


    } catch (error) {

        console.error(
            "Erro ao consultar progresso:",
            error
        );


        result.innerHTML = `

            <div class="empty-message">

                Não foi possível consultar
                seu progresso.

            </div>

        `;

    }

}


/* =====================================================
   11. RENDERIZAÇÃO DO PROGRESSO
===================================================== */

function renderProgress(
    participant
) {

    const result =
        document.getElementById(
            "progressResult"
        );


    if (!result) {
        return;
    }


    const goal =
        CHALLENGE.goals[
            participant.modalidade
        ] || 100;


    const kilometers =
        normalizeKilometers(
            participant.km_percorrido
        );


    const percentage =
        Math.min(
            100,
            (
                kilometers /
                goal
            ) * 100
        );


    const remaining =
        Math.max(
            0,
            goal - kilometers
        );


    result.innerHTML = `

        <article class="progress-card">

            <div class="progress-header">

                <div>

                    <small>
                        OLÁ
                    </small>

                    <h3>
                        ${escapeHTML(
                            participant.nome
                        )}
                    </h3>

                </div>


                <span
                    class="progress-modality"
                >

                    ${goal} KM

                </span>

            </div>


            <div
                class="progress-number"
            >

                ${percentage.toFixed(1)}%

            </div>


            <div
                class="progress-bar"
            >

                <div
                    class="progress-bar-value"

                    style="
                        width:
                        ${percentage}%
                    "
                ></div>

            </div>


            <div
                class="progress-stats"
            >

                <div>

                    <small>
                        PERCORRIDO
                    </small>

                    <strong>

                        ${kilometers.toFixed(1)}
                        KM

                    </strong>

                </div>


                <div>

                    <small>
                        META
                    </small>

                    <strong>

                        ${goal}
                        KM

                    </strong>

                </div>


                <div>

                    <small>
                        FALTAM
                    </small>

                    <strong>

                        ${remaining.toFixed(1)}
                        KM

                    </strong>

                </div>

            </div>


            <div
                class="strava-preview"
            >

                <div>

                    <strong>
                        STRAVA
                    </strong>

                    <p>

                        Em breve você poderá
                        sincronizar suas corridas
                        automaticamente.

                    </p>

                </div>


                <button
                    type="button"
                    class="strava-button"
                    disabled
                >

                    Conectar Strava

                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   12. RANKING
===================================================== */

async function loadRanking() {

    const container =
        document.getElementById(
            "rankingGrid"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="empty-message">

            Carregando ranking...

        </div>

    `;


    try {

        const {
            data,
            error
        } = await db

            .from("ranking_publico")

            .select(
                "nome,equipe,modalidade,km_percorrido"
            )

            .order(
                "km_percorrido",
                {
                    ascending: false
                }
            )

            .limit(10);


        if (error) {
            throw error;
        }


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-message">

                    O ranking ainda não possui
                    participantes.

                </div>

            `;

            return;

        }


        container.innerHTML =
            data
                .map(
                    (
                        participant,
                        index
                    ) => {


                        const position =
                            index + 1;


                        let medal =
                            position;


                        if (
                            position === 1
                        ) {

                            medal = "🥇";

                        }


                        if (
                            position === 2
                        ) {

                            medal = "🥈";

                        }


                        if (
                            position === 3
                        ) {

                            medal = "🥉";

                        }


                        const kilometers =
                            normalizeKilometers(
                                participant
                                    .km_percorrido
                            );


                        return `

                            <article
                                class="ranking-card"
                            >

                                <span
                                    class="
                                        ranking-position
                                    "
                                >

                                    ${medal}

                                </span>


                                <div
                                    class="
                                        ranking-person
                                    "
                                >

                                    <strong>

                                        ${escapeHTML(
                                            participant.nome
                                        )}

                                    </strong>


                                    <small>

                                        ${escapeHTML(
                                            participant.equipe ||
                                            "Sem equipe"
                                        )}

                                    </small>

                                </div>


                                <div
                                    class="
                                        ranking-km
                                    "
                                >

                                    ${kilometers.toFixed(1)}

                                    <span>
                                        KM
                                    </span>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");


    } catch (error) {

        console.error(
            "Erro ao carregar ranking:",
            error
        );


        container.innerHTML = `

            <div class="empty-message">

                Não foi possível carregar
                o ranking.

            </div>

        `;

    }

}


/* =====================================================
   13. SERVICE WORKER / PWA
===================================================== */

function registerServiceWorker() {

    if (
        !(
            "serviceWorker"
            in navigator
        )
    ) {

        return;

    }


    window.addEventListener(
        "load",
        () => {

            navigator
                .serviceWorker
                .register(
                    "./service-worker.js"
                )

                .then(
                    registration => {

                        console.log(
                            "PWA ativo:",
                            registration.scope
                        );

                    }
                )

                .catch(
                    error => {

                        console.error(
                            "Erro no Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}


/* =====================================================
   14. EVENTOS
===================================================== */

if (registrationForm) {

    registrationForm
        .addEventListener(
            "submit",
            handleRegistration
        );

}


if (searchProgressButton) {

    searchProgressButton
        .addEventListener(
            "click",
            searchProgress
        );

}


if (progressEmail) {

    progressEmail.addEventListener(

        "keydown",

        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                searchProgress();

            }

        }

    );

}


/* =====================================================
   15. INICIALIZAÇÃO
===================================================== */

async function init() {

    /*
     * Interface
     */

    loadTheme();


    /*
     * Contador regressivo
     */

    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );


    /*
     * PWA
     */

    registerServiceWorker();


    /*
     * Dados Supabase
     */

    try {

        await Promise.all([

            loadParticipantCount(),

            loadRanking()

        ]);


    } catch (error) {

        console.error(
            "Erro durante inicialização:",
            error
        );

    }

}

const copyPixButton =
    document.getElementById(
        "copyPixButton"
    );

const pixKey =
    document.getElementById(
        "pixKey"
    );

const pixCopyMessage =
    document.getElementById(
        "pixCopyMessage"
    );


copyPixButton?.addEventListener(
    "click",
    async () => {

        try {

            const key =
                pixKey.textContent.trim();

            await navigator.clipboard.writeText(
                key
            );

            pixCopyMessage.textContent =
                "✓ Chave PIX copiada!";

            setTimeout(() => {

                pixCopyMessage.textContent =
                    "";

            }, 3000);

        } catch (error) {

            console.error(
                "Erro ao copiar PIX:",
                error
            );

            pixCopyMessage.textContent =
                "Não foi possível copiar a chave.";
        }
    }
);


/* =====================================================
   START
===================================================== */

init();