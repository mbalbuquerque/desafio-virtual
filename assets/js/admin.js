/* =====================================================
   CORRA POR VOCÊ
   ADMIN.JS

   Painel administrativo
===================================================== */


/* =====================================================
   ESTADO
===================================================== */

let adminCurrentStatus =
    "PENDENTE";


let adminActivities =
    [];


let selectedActivity =
    null;


/* =====================================================
   ELEMENTOS
===================================================== */

const adminPageTitle =
    document.getElementById(
        "adminPageTitle"
    );


const refreshAdminButton =
    document.getElementById(
        "refreshAdminButton"
    );


const openActivitiesButton =
    document.getElementById(
        "openActivitiesButton"
    );


const adminLogoutButton =
    document.getElementById(
        "adminLogoutButton"
    );


const sectionDashboard =
    document.getElementById(
        "sectionDashboard"
    );


const sectionAtividades =
    document.getElementById(
        "sectionAtividades"
    );


const activitiesContainer =
    document.getElementById(
        "activitiesContainer"
    );


const recentActivities =
    document.getElementById(
        "recentActivities"
    );


/* =====================================================
   CONTADORES
===================================================== */

const menuPendingCount =
    document.getElementById(
        "menuPendingCount"
    );


const pendingCount =
    document.getElementById(
        "pendingCount"
    );


const approvedCount =
    document.getElementById(
        "approvedCount"
    );


const rejectedCount =
    document.getElementById(
        "rejectedCount"
    );


const dashboardPending =
    document.getElementById(
        "dashboardPending"
    );


const dashboardApproved =
    document.getElementById(
        "dashboardApproved"
    );


const dashboardRejected =
    document.getElementById(
        "dashboardRejected"
    );


const dashboardTotal =
    document.getElementById(
        "dashboardTotal"
    );


/* =====================================================
   MODAL
===================================================== */

const adminActivityModal =
    document.getElementById(
        "adminActivityModal"
    );


const adminModalOverlay =
    document.getElementById(
        "adminModalOverlay"
    );


const closeAdminModal =
    document.getElementById(
        "closeAdminModal"
    );


const adminProofImage =
    document.getElementById(
        "adminProofImage"
    );


const modalParticipantName =
    document.getElementById(
        "modalParticipantName"
    );


const modalParticipantEmail =
    document.getElementById(
        "modalParticipantEmail"
    );


const modalActivityDate =
    document.getElementById(
        "modalActivityDate"
    );


const modalActivityDistance =
    document.getElementById(
        "modalActivityDistance"
    );


const modalActivityTime =
    document.getElementById(
        "modalActivityTime"
    );


const modalActivityGoal =
    document.getElementById(
        "modalActivityGoal"
    );


const adminObservation =
    document.getElementById(
        "adminObservation"
    );


const adminObservationGroup =
    document.getElementById(
        "adminObservationGroup"
    );


const adminValidationMessage =
    document.getElementById(
        "adminValidationMessage"
    );


const adminValidationActions =
    document.getElementById(
        "adminValidationActions"
    );


const approveActivityButton =
    document.getElementById(
        "approveActivityButton"
    );


const rejectActivityButton =
    document.getElementById(
        "rejectActivityButton"
    );


/* =====================================================
   FORMATADORES
===================================================== */

function formatKm(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " KM";

}


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatDate(
    value
) {

    if (!value) {

        return "-";

    }


    /*
     * Evita alteração da data por timezone.
     */

    const parts =
        String(
            value
        ).split("-");


    if (
        parts.length === 3
    ) {

        return (
            parts[2] +
            "/" +
            parts[1] +
            "/" +
            parts[0]
        );

    }


    return value;

}


/* =====================================================
   ESCAPAR HTML

   Evita inserir diretamente dados do usuário
   como HTML.
===================================================== */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   TEXTO DO STATUS
===================================================== */

function getStatusLabel(
    status
) {

    switch (
        status
    ) {

        case "APROVADA":

            return "Aprovada";


        case "REJEITADA":

            return "Rejeitada";


        default:

            return "Pendente";

    }

}


/* =====================================================
   CLASSE DO STATUS
===================================================== */

function getStatusClass(
    status
) {

    switch (
        status
    ) {

        case "APROVADA":

            return "aprovada";


        case "REJEITADA":

            return "rejeitada";


        default:

            return "pendente";

    }

}


/* =====================================================
   MENSAGEM ADMIN
===================================================== */

function showAdminMessage(
    message,
    type = "error"
) {

    if (
        !adminValidationMessage
    ) {

        return;

    }


    adminValidationMessage.textContent =
        message;


    adminValidationMessage.className =
        `admin-message ${type}`;


    adminValidationMessage.hidden =
        false;

}


/* =====================================================
   LIMPAR MENSAGEM
===================================================== */

function clearAdminMessage() {

    if (
        !adminValidationMessage
    ) {

        return;

    }


    adminValidationMessage.textContent =
        "";


    adminValidationMessage.className =
        "admin-message";


    adminValidationMessage.hidden =
        true;

}


/* =====================================================
   CHAMAR EDGE FUNCTION

   Centralizamos a chamada para facilitar
   tratamento de erros.
===================================================== */

async function invokeAdminFunction(
    functionName,
    body = {}
) {

    if (
        typeof db === "undefined" ||
        !db?.functions
    ) {

        throw new Error(
            "Cliente Supabase não inicializado."
        );

    }


    const {
        data,
        error
    } =
        await db.functions.invoke(
            functionName,
            {
                body
            }
        );


    if (error) {

        console.error(
            `Erro ${functionName}:`,
            error
        );


        let message =
            "Erro ao comunicar com o servidor.";


        /*
         * Tenta recuperar a mensagem
         * retornada pela Edge Function.
         */

        if (
            error.context &&
            typeof error.context.json ===
                "function"
        ) {

            try {

                const details =
                    await error.context.json();


                if (
                    details?.error
                ) {

                    message =
                        details.error;

                }

            } catch (
                contextError
            ) {

                console.error(
                    "Erro lendo resposta:",
                    contextError
                );

            }

        }


        throw new Error(
            message
        );

    }


    if (
        !data ||
        data.success !== true
    ) {

        throw new Error(
            data?.error ||
            "Resposta inválida do servidor."
        );

    }


    return data;

}


/* =====================================================
   ATUALIZAR CONTADORES
===================================================== */

function updateCounters(
    counters = {}
) {

    const pending =
        Number(
            counters.pendentes || 0
        );


    const approved =
        Number(
            counters.aprovadas || 0
        );


    const rejected =
        Number(
            counters.rejeitadas || 0
        );


    const total =
        pending +
        approved +
        rejected;


    if (menuPendingCount) {

        menuPendingCount.textContent =
            pending;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }


    if (approvedCount) {

        approvedCount.textContent =
            approved;

    }


    if (rejectedCount) {

        rejectedCount.textContent =
            rejected;

    }


    if (dashboardPending) {

        dashboardPending.textContent =
            pending;

    }


    if (dashboardApproved) {

        dashboardApproved.textContent =
            approved;

    }


    if (dashboardRejected) {

        dashboardRejected.textContent =
            rejected;

    }


    if (dashboardTotal) {

        dashboardTotal.textContent =
            total;

    }

}


/* =====================================================
   CRIAR CARD
===================================================== */

function createActivityCard(
    activity
) {

    const participant =
        activity.participante || {};


    const name =
        escapeHtml(
            participant.nome ||
            "Participante"
        );


    const email =
        escapeHtml(
            participant.email ||
            ""
        );


    const date =
        formatDate(
            activity.data_atividade
        );


    const distance =
        formatKm(
            activity.distancia_km
        );


    const time =
        escapeHtml(
            activity.tempo ||
            "-"
        );


    const status =
        escapeHtml(
            getStatusLabel(
                activity.status
            )
        );


    const statusClass =
        getStatusClass(
            activity.status
        );


    return `
        <article
            class="activity-card"
            data-activity-id="${Number(activity.id)}"
        >

            <div class="activity-participant">

                <strong>
                    ${name}
                </strong>

                <span>
                    ${email}
                </span>

            </div>


            <div class="activity-info">

                <span>
                    Data
                </span>

                <strong>
                    ${date}
                </strong>

            </div>


            <div class="activity-info">

                <span>
                    Distância
                </span>

                <strong>
                    ${distance}
                </strong>

            </div>


            <div class="activity-info">

                <span>
                    Tempo
                </span>

                <strong>
                    ${time}
                </strong>

            </div>


            <div>

                <span
                    class="
                        activity-status
                        ${statusClass}
                    "
                >
                    ${status}
                </span>

                <button
                    class="activity-view-button"
                    type="button"
                    data-view-activity="${Number(activity.id)}"
                >
                    Ver
                </button>

            </div>

        </article>
    `;

}


/* =====================================================
   RENDERIZAR ATIVIDADES
===================================================== */

function renderActivities() {

    if (
        !activitiesContainer
    ) {

        return;

    }


    if (
        adminActivities.length === 0
    ) {

        activitiesContainer.innerHTML = `
            <div class="admin-empty">

                Nenhuma atividade encontrada
                para este filtro.

            </div>
        `;


        return;

    }


    activitiesContainer.innerHTML =
        adminActivities
            .map(
                createActivityCard
            )
            .join("");


    /*
     * Botões VER.
     */

    activitiesContainer
        .querySelectorAll(
            "[data-view-activity]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset
                                    .viewActivity
                            );


                        openActivity(
                            id
                        );

                    }
                );

            }
        );

}


/* =====================================================
   ATIVIDADES RECENTES
===================================================== */

function renderRecentActivities() {

    if (
        !recentActivities
    ) {

        return;

    }


    const recent =
        adminActivities
            .slice(
                0,
                5
            );


    if (
        recent.length === 0
    ) {

        recentActivities.innerHTML = `
            <div class="admin-empty">

                Nenhuma atividade pendente.

            </div>
        `;


        return;

    }


    recentActivities.innerHTML =
        recent
            .map(
                createActivityCard
            )
            .join("");


    recentActivities
        .querySelectorAll(
            "[data-view-activity]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset
                                    .viewActivity
                            );


                        openActivity(
                            id
                        );

                    }
                );

            }
        );

}


/* =====================================================
   CARREGAR ATIVIDADES
===================================================== */

async function loadActivities(
    status = adminCurrentStatus
) {

    adminCurrentStatus =
        status;


    if (
        activitiesContainer
    ) {

        activitiesContainer.innerHTML = `
            <div class="admin-loading">

                Carregando atividades...

            </div>
        `;

    }


    try {

        const result =
            await invokeAdminFunction(
                "atividades-admin",
                {
                    status:
                        status
                }
            );


        adminActivities =
            Array.isArray(
                result.atividades
            )
                ? result.atividades
                : [];


        updateCounters(
            result.contadores
        );


        renderActivities();


        /*
         * No dashboard queremos sempre
         * as atividades pendentes recentes.
         */

        if (
            status === "PENDENTE"
        ) {

            renderRecentActivities();

        }


        console.log(
            "Atividades carregadas:",
            adminActivities.length
        );


    } catch (error) {

        console.error(
            "Erro carregando atividades:",
            error
        );


        if (
            activitiesContainer
        ) {

            activitiesContainer.innerHTML = `
                <div class="admin-empty">

                    ${escapeHtml(
                        error.message ||
                        "Erro ao carregar atividades."
                    )}

                </div>
            `;

        }


        if (
            recentActivities
        ) {

            recentActivities.innerHTML = `
                <div class="admin-empty">

                    Não foi possível carregar
                    as atividades.

                </div>
            `;

        }

    }

}


/* =====================================================
   ABRIR ATIVIDADE
===================================================== */

function openActivity(
    id
) {

    const activity =
        adminActivities.find(
            item =>
                Number(
                    item.id
                ) ===
                Number(
                    id
                )
        );


    if (!activity) {

        console.error(
            "Atividade não encontrada:",
            id
        );


        return;

    }


    selectedActivity =
        activity;


    clearAdminMessage();


    const participant =
        activity.participante || {};


    if (
        modalParticipantName
    ) {

        modalParticipantName.textContent =
            participant.nome ||
            "Participante";

    }


    if (
        modalParticipantEmail
    ) {

        modalParticipantEmail.textContent =
            participant.email ||
            "";

    }


    if (
        modalActivityDate
    ) {

        modalActivityDate.textContent =
            formatDate(
                activity.data_atividade
            );

    }


    if (
        modalActivityDistance
    ) {

        modalActivityDistance.textContent =
            formatKm(
                activity.distancia_km
            );

    }


    if (
        modalActivityTime
    ) {

        modalActivityTime.textContent =
            activity.tempo ||
            "-";

    }


    if (
        modalActivityGoal
    ) {

        modalActivityGoal.textContent =
            participant.modalidade ||
            "-";

    }


    /*
     * Comprovante.
     */

    if (
        adminProofImage
    ) {

        if (
            activity.comprovante_url
        ) {

            adminProofImage.src =
                activity.comprovante_url;


            adminProofImage.hidden =
                false;

        } else {

            adminProofImage.removeAttribute(
                "src"
            );


            adminProofImage.hidden =
                true;

        }

    }


    /*
     * Observação.
     */

    if (
        adminObservation
    ) {

        adminObservation.value =
            activity.observacao_admin ||
            "";

    }


    /*
     * Somente atividade pendente
     * pode ser analisada.
     */

    const isPending =
        activity.status ===
        "PENDENTE";


    if (
        adminValidationActions
    ) {

        adminValidationActions.style.display =
            isPending
                ? ""
                : "none";

    }


    if (
        adminObservation
    ) {

        adminObservation.disabled =
            !isPending;

    }


    /*
     * Abre modal.
     */

    if (
        adminActivityModal
    ) {

        adminActivityModal.classList.add(
            "active"
        );


        adminActivityModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }

}


/* =====================================================
   FECHAR MODAL
===================================================== */

function closeActivityModal() {

    if (
        !adminActivityModal
    ) {

        return;

    }


    adminActivityModal.classList.remove(
        "active"
    );


    adminActivityModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    selectedActivity =
        null;


    clearAdminMessage();

}


/* =====================================================
   VALIDAR ATIVIDADE
===================================================== */

async function validateActivity(
    action
) {

    if (
        !selectedActivity
    ) {

        return;

    }


    clearAdminMessage();


    const observation =
        adminObservation
            ? adminObservation.value.trim()
            : "";


    /*
     * Rejeição exige motivo.
     */

    if (
        action === "REJEITAR" &&
        !observation
    ) {

        showAdminMessage(
            "Informe o motivo da rejeição.",
            "error"
        );


        adminObservation?.focus();


        return;

    }


    const activityId =
        Number(
            selectedActivity.id
        );


    const confirmationMessage =
        action === "APROVAR"

            ? (
                "Confirma a aprovação desta atividade? " +
                "A distância será adicionada ao progresso do participante."
            )

            : (
                "Confirma a rejeição desta atividade?"
            );


    if (
        !window.confirm(
            confirmationMessage
        )
    ) {

        return;

    }


    try {

        setValidationButtons(
            true
        );


        const result =
            await invokeAdminFunction(
                "atividade-validar",
                {
                    atividade_id:
                        activityId,

                    acao:
                        action,

                    observacao:
                        observation
                }
            );


        console.log(
            "Validação concluída:",
            result
        );


        showAdminMessage(
            result.message ||
            (
                action === "APROVAR"
                    ? "Atividade aprovada."
                    : "Atividade rejeitada."
            ),
            "success"
        );


        /*
         * Pequeno intervalo para o
         * administrador ver a confirmação.
         */

        setTimeout(
            async () => {

                closeActivityModal();


                await loadActivities(
                    adminCurrentStatus
                );

            },
            700
        );


    } catch (error) {

        console.error(
            "Erro validando atividade:",
            error
        );


        showAdminMessage(
            error.message ||
            "Erro ao validar atividade.",
            "error"
        );


    } finally {

        setValidationButtons(
            false
        );

    }

}


/* =====================================================
   BOTÕES DE VALIDAÇÃO
===================================================== */

function setValidationButtons(
    disabled
) {

    if (
        approveActivityButton
    ) {

        approveActivityButton.disabled =
            disabled;


        approveActivityButton.textContent =
            disabled
                ? "Processando..."
                : "✓ Aprovar";

    }


    if (
        rejectActivityButton
    ) {

        rejectActivityButton.disabled =
            disabled;


        rejectActivityButton.textContent =
            disabled
                ? "Processando..."
                : "✕ Rejeitar";

    }

}


/* =====================================================
   TROCAR SEÇÃO
===================================================== */

function showSection(
    section
) {

    const menuItems =
        document.querySelectorAll(
            ".admin-menu-item"
        );


    menuItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.section ===
                    section
            );

        }
    );


    if (
        sectionDashboard
    ) {

        sectionDashboard.classList.toggle(
            "active",
            section ===
                "dashboard"
        );

    }


    if (
        sectionAtividades
    ) {

        sectionAtividades.classList.toggle(
            "active",
            section ===
                "atividades"
        );

    }


    if (
        adminPageTitle
    ) {

        adminPageTitle.textContent =
            section ===
            "atividades"
                ? "Atividades"
                : "Dashboard";

    }


    if (
        section ===
        "atividades"
    ) {

        loadActivities(
            adminCurrentStatus
        );

    }

}


/* =====================================================
   FILTROS
===================================================== */

function initializeFilters() {

    const filters =
        document.querySelectorAll(
            ".activity-filter"
        );


    filters.forEach(
        filter => {

            filter.addEventListener(
                "click",
                async () => {

                    filters.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    filter.classList.add(
                        "active"
                    );


                    const status =
                        filter.dataset.status ||
                        "PENDENTE";


                    await loadActivities(
                        status
                    );

                }
            );

        }
    );

}


/* =====================================================
   MENU
===================================================== */

function initializeMenu() {

    const menuItems =
        document.querySelectorAll(
            ".admin-menu-item"
        );


    menuItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    showSection(
                        item.dataset.section
                    );

                }
            );

        }
    );


    openActivitiesButton
        ?.addEventListener(
            "click",
            () => {

                showSection(
                    "atividades"
                );

            }
        );

}


/* =====================================================
   ATUALIZAR
===================================================== */

refreshAdminButton
    ?.addEventListener(
        "click",
        async () => {

            refreshAdminButton.disabled =
                true;


            const originalText =
                refreshAdminButton.textContent;


            refreshAdminButton.textContent =
                "Atualizando...";


            try {

                /*
                 * Dashboard trabalha inicialmente
                 * com pendentes.
                 */

                const activeSection =
                    sectionAtividades
                        ?.classList
                        .contains(
                            "active"
                        );


                if (
                    activeSection
                ) {

                    await loadActivities(
                        adminCurrentStatus
                    );

                } else {

                    await loadActivities(
                        "PENDENTE"
                    );

                }


            } finally {

                refreshAdminButton.disabled =
                    false;


                refreshAdminButton.textContent =
                    originalText;

            }

        }
    );


/* =====================================================
   MODAL EVENTS
===================================================== */

closeAdminModal
    ?.addEventListener(
        "click",
        closeActivityModal
    );


adminModalOverlay
    ?.addEventListener(
        "click",
        closeActivityModal
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            adminActivityModal
                ?.classList
                .contains(
                    "active"
                )
        ) {

            closeActivityModal();

        }

    }
);


/* =====================================================
   APROVAR
===================================================== */

approveActivityButton
    ?.addEventListener(
        "click",
        () => {

            validateActivity(
                "APROVAR"
            );

        }
    );


/* =====================================================
   REJEITAR
===================================================== */

rejectActivityButton
    ?.addEventListener(
        "click",
        () => {

            validateActivity(
                "REJEITAR"
            );

        }
    );


/* =====================================================
   LOGOUT

   Por enquanto somente deixamos preparado.
   Na próxima etapa conectaremos ao login Admin.
===================================================== */

adminLogoutButton
    ?.addEventListener(
        "click",
        () => {

            /*
             * Ainda não criamos a autenticação
             * administrativa.
             */

            window.location.href =
                "index.html";

        }
    );


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

async function initializeAdmin() {

    console.log(
        "Inicializando painel administrativo..."
    );


    initializeMenu();


    initializeFilters();


    /*
     * Dashboard inicia mostrando
     * atividades pendentes.
     */

    await loadActivities(
        "PENDENTE"
    );


    console.log(
        "Painel administrativo inicializado."
    );

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
);