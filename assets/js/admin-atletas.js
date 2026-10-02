/* =========================================================
   CORRA POR VOCÊ
   ADMIN - ATLETAS
========================================================= */

"use strict";


/* =========================================================
   1. ESTADO
========================================================= */

let athletes = [];
let filteredAthletes = [];


/* =========================================================
   2. ELEMENTOS
========================================================= */

const athletesTableBody =
    document.getElementById("athletesTableBody");

const totalAthletesElement =
    document.getElementById("totalAthletes");

const totalKilometersElement =
    document.getElementById("totalKilometers");

const activeAthletesElement =
    document.getElementById("activeAthletes");

const completedAthletesElement =
    document.getElementById("completedAthletes");

const athleteSearch =
    document.getElementById("athleteSearch");

const modalityFilter =
    document.getElementById("modalityFilter");

const statusFilter =
    document.getElementById("statusFilter");

const refreshAthletesButton =
    document.getElementById("refreshAthletesButton");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================================================
   3. MODAL
========================================================= */

const athleteModal =
    document.getElementById("athleteModal");

const athleteModalName =
    document.getElementById("athleteModalName");

const athleteModalTeam =
    document.getElementById("athleteModalTeam");

const modalGoal =
    document.getElementById("modalGoal");

const modalCompleted =
    document.getElementById("modalCompleted");

const modalRemaining =
    document.getElementById("modalRemaining");

const modalActivities =
    document.getElementById("modalActivities");

const modalProgressText =
    document.getElementById("modalProgressText");

const modalProgressBar =
    document.getElementById("modalProgressBar");

const modalAverage =
    document.getElementById("modalAverage");

const modalLongest =
    document.getElementById("modalLongest");

const modalLastActivity =
    document.getElementById("modalLastActivity");

const athleteHistory =
    document.getElementById("athleteHistory");


/* =========================================================
   4. UTILITÁRIOS
========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function normalizeText(value) {

    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function toNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    if (typeof value === "number") {
        return Number.isFinite(value)
            ? value
            : 0;
    }

    const normalized =
        String(value)
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");

    const number =
        Number(normalized);

    return Number.isFinite(number)
        ? number
        : 0;
}


function formatKm(value) {

    const number =
        toNumber(value);

    return number.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    ) + " KM";
}


function formatDate(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }

    return date.toLocaleDateString(
        "pt-BR"
    );
}


/* =========================================================
   5. CAMPOS DA INSCRIÇÃO
========================================================= */

function getAthleteId(registration) {

    return (
        registration.id ??
        registration.inscricao_id ??
        registration.participante_id ??
        null
    );
}


function getAthleteName(registration) {

    return (
        registration.nome ||
        registration.name ||
        "Participante"
    );
}


function getAthleteEmail(registration) {

    return (
        registration.email ||
        ""
    );
}


function getAthleteTeam(registration) {

    return (
        registration.equipe ||
        registration.team ||
        "Sem equipe"
    );
}


function getAthleteModality(registration) {

    return (
        registration.modalidade ||
        registration.modality ||
        registration.meta ||
        ""
    );
}


/* =========================================================
   META DO ATLETA
========================================================= */

function getGoalFromModality(modality) {

    if (!modality) {
        return 0;
    }

    const text =
        String(modality)
            .toLowerCase()
            .trim();


    /*
     * Formatos utilizados no banco:
     *
     * 100km
     * 200km
     * 300km
     * 400km
     *
     * Também aceita:
     * 100 KM
     * 100
     * "Meta 100km"
     */

    const match =
        text.match(
            /(100|200|300|400)/
        );


    if (match) {

        return Number(
            match[1]
        );

    }


    return 0;
}

/* =========================================================
   7. CAMPOS DA ATIVIDADE
========================================================= */

function getActivityAthleteId(activity) {

    return (
        activity.inscricao_id ??
        activity.participante_id ??
        activity.atleta_id ??
        activity.usuario_id ??
        null
    );
}


function getActivityEmail(activity) {

    return (
        activity.email ||
        activity.participante_email ||
        activity.atleta_email ||
        ""
    );
}


function getActivityDistance(activity) {

    return toNumber(

        activity.distancia ??
        activity.distancia_km ??
        activity.km ??
        activity.quilometragem ??
        activity.km_percorrido ??
        0

    );
}


function getActivityStatus(activity) {

    return normalizeText(
        activity.status ||
        ""
    );
}


function getActivityDate(activity) {

    return (
        activity.data_atividade ||
        activity.data ||
        activity.activity_date ||
        activity.created_at ||
        null
    );
}


function getActivityTime(activity) {

    return (
        activity.tempo ||
        activity.duracao ||
        activity.tempo_atividade ||
        "—"
    );
}


function getActivityProof(activity) {

    return (
        activity.comprovante_url ||
        activity.imagem_url ||
        activity.image_url ||
        activity.comprovante ||
        null
    );
}


/* =========================================================
   8. ATIVIDADE APROVADA
========================================================= */

function isApprovedActivity(activity) {

    const status =
        getActivityStatus(activity);

    return [
        "aprovada",
        "aprovado",
        "approved"
    ].includes(status);
}


/* =========================================================
   9. RELACIONAR ATIVIDADE AO ATLETA
========================================================= */

function activityBelongsToAthlete(
    activity,
    registration
) {

    const athleteId =
        getAthleteId(registration);

    const activityAthleteId =
        getActivityAthleteId(activity);


    /*
     * Prioridade: relacionamento por ID.
     */

    if (
        athleteId !== null &&
        activityAthleteId !== null
    ) {

        return String(athleteId) ===
            String(activityAthleteId);

    }


    /*
     * Fallback por e-mail.
     */

    const athleteEmail =
        normalizeText(
            getAthleteEmail(
                registration
            )
        );

    const activityEmail =
        normalizeText(
            getActivityEmail(
                activity
            )
        );


    return Boolean(
        athleteEmail &&
        activityEmail &&
        athleteEmail === activityEmail
    );
}


/* =========================================================
   10. SITUAÇÃO DO ATLETA
========================================================= */

function getAthleteStatus(
    completed,
    goal
) {

    if (completed <= 0) {

        return {
            key: "not-started",
            label: "Não iniciou"
        };

    }


    if (
        goal > 0 &&
        completed >= goal
    ) {

        return {
            key: "completed",
            label: "Meta concluída"
        };

    }


    return {
        key: "active",
        label: "Em andamento"
    };
}


/* =========================================================
   11. MONTAR OBJETO DO ATLETA
========================================================= */

function buildAthlete(
    registration,
    activities
) {

    const approvedActivities =
        activities.filter(
            activity =>
                isApprovedActivity(activity) &&
                activityBelongsToAthlete(
                    activity,
                    registration
                )
        );


    /*
 * Quilometragem oficial acumulada.
 *
 * A tabela inscricoes já mantém o total
 * aprovado do participante em km_percorrido.
 */

const kilometers =
    toNumber(
        registration.km_percorrido
    );


    const modality =
        getAthleteModality(
            registration
        );


    const goal =
        getGoalFromModality(
            modality
        );


    const remaining =
        Math.max(
            goal - kilometers,
            0
        );


    const progress =
        goal > 0
            ? Math.min(
                (kilometers / goal) * 100,
                100
            )
            : 0;


    const average =
        approvedActivities.length
            ? kilometers /
              approvedActivities.length
            : 0;


    const longest =
        approvedActivities.reduce(
            (max, activity) =>
                Math.max(
                    max,
                    getActivityDistance(
                        activity
                    )
                ),
            0
        );


    const sortedActivities =
        [...approvedActivities]
            .sort(
                (a, b) =>
                    new Date(
                        getActivityDate(b) || 0
                    ) -
                    new Date(
                        getActivityDate(a) || 0
                    )
            );


    const lastActivity =
        sortedActivities.length
            ? getActivityDate(
                sortedActivities[0]
            )
            : null;


    const status =
        getAthleteStatus(
            kilometers,
            goal
        );


    return {

        id:
            getAthleteId(
                registration
            ),

        name:
            getAthleteName(
                registration
            ),

        email:
            getAthleteEmail(
                registration
            ),

        team:
            getAthleteTeam(
                registration
            ),

        modality:
            modality,

        goal:
            goal,

        kilometers:
            kilometers,

        remaining:
            remaining,

        progress:
            progress,

        activityCount:
            approvedActivities.length,

        average:
            average,

        longest:
            longest,

        lastActivity:
            lastActivity,

        status:
            status,

        activities:
            sortedActivities,

        registration:
            registration

    };
}


/* =========================================================
   12. CARREGAR DADOS
========================================================= */

async function loadAthletes() {

    if (!athletesTableBody) {
        return;
    }


    athletesTableBody.innerHTML = `
        <tr>
            <td
                colspan="7"
                class="athletes-empty"
            >
                Carregando atletas...
            </td>
        </tr>
    `;


    if (refreshAthletesButton) {

        refreshAthletesButton.disabled =
            true;

        refreshAthletesButton.textContent =
            "Atualizando...";

    }


    try {

        if (
            typeof db === "undefined" ||
            !db
        ) {

            throw new Error(
                "Cliente Supabase não encontrado."
            );

        }


        /* -----------------------------------------
           INSCRIÇÕES
        ----------------------------------------- */

        const {
            data: registrations,
            error: registrationsError
        } = await db
            .from("inscricoes")
            .select("*")
            .order(
                "id",
                {
                    ascending: false
                }
            );


        if (registrationsError) {
            throw registrationsError;
        }


        /* -----------------------------------------
           ATIVIDADES
        ----------------------------------------- */

        const {
            data: activities,
            error: activitiesError
        } = await db
            .from("atividades")
            .select("*");


        if (activitiesError) {
            throw activitiesError;
        }


        /* -----------------------------------------
           MONTAGEM
        ----------------------------------------- */

        athletes =
            (registrations || [])
                .map(
                    registration =>
                        buildAthlete(
                            registration,
                            activities || []
                        )
                );


        filteredAthletes =
            [...athletes];


        updateStatistics();

        applyFilters();


        console.log(
            "Atletas carregados:",
            athletes
        );


    } catch (error) {

        console.error(
            "Erro ao carregar atletas:",
            error
        );


        athletesTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="athletes-empty"
                >
                    Não foi possível carregar os atletas.
                </td>
            </tr>
        `;

    } finally {

        if (refreshAthletesButton) {

            refreshAthletesButton.disabled =
                false;

            refreshAthletesButton.textContent =
                "↻ Atualizar";

        }

    }

}


/* =========================================================
   13. INDICADORES
========================================================= */

function updateStatistics() {

    const total =
        athletes.length;


    const kilometers =
        athletes.reduce(
            (sum, athlete) =>
                sum +
                athlete.kilometers,
            0
        );


    const active =
        athletes.filter(
            athlete =>
                athlete.status.key ===
                "active"
        ).length;


    const completed =
        athletes.filter(
            athlete =>
                athlete.status.key ===
                "completed"
        ).length;


    if (totalAthletesElement) {

        totalAthletesElement.textContent =
            total.toLocaleString(
                "pt-BR"
            );

    }


    if (totalKilometersElement) {

        totalKilometersElement.textContent =
            kilometers.toLocaleString(
                "pt-BR",
                {
                    maximumFractionDigits: 2
                }
            );

    }


    if (activeAthletesElement) {

        activeAthletesElement.textContent =
            active.toLocaleString(
                "pt-BR"
            );

    }


    if (completedAthletesElement) {

        completedAthletesElement.textContent =
            completed.toLocaleString(
                "pt-BR"
            );

    }

}


/* =========================================================
   14. FILTROS
========================================================= */

function applyFilters() {

    const search =
        normalizeText(
            athleteSearch
                ? athleteSearch.value
                : ""
        );


    const modality =
        modalityFilter
            ? modalityFilter.value
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "";


    filteredAthletes =
        athletes.filter(
            athlete => {

                const searchableText =
                    normalizeText(
                        [
                            athlete.name,
                            athlete.email,
                            athlete.team
                        ].join(" ")
                    );


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                const matchesModality =
                    !modality ||
                    String(
                        athlete.goal
                    ) === modality;


                const matchesStatus =
                    !status ||
                    athlete.status.key ===
                        status;


                return (
                    matchesSearch &&
                    matchesModality &&
                    matchesStatus
                );

            }
        );


    renderAthletes();

}


/* =========================================================
   15. RENDERIZAR TABELA
========================================================= */

function renderAthletes() {

    if (!athletesTableBody) {
        return;
    }


    if (!filteredAthletes.length) {

        athletesTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="athletes-empty"
                >
                    Nenhum atleta encontrado.
                </td>
            </tr>
        `;

        return;
    }


    athletesTableBody.innerHTML =
        filteredAthletes
            .map(
                athlete => {

                    const progress =
                        Math.min(
                            athlete.progress,
                            100
                        );


                    return `
                        <tr>

                            <td>

                                <div class="athlete-name">

                                    <strong>
                                        ${escapeHtml(
                                            athlete.name
                                        )}
                                    </strong>

                                    <small>
                                        ${escapeHtml(
                                            athlete.email
                                        )}
                                    </small>

                                </div>

                            </td>


                            <td>
                                ${formatKm(
                                    athlete.goal
                                )}
                            </td>


                            <td>
                                ${formatKm(
                                    athlete.kilometers
                                )}
                            </td>


                            <td>

                                <div
                                    class="athlete-table-progress"
                                >

                                    <div
                                        class="athlete-table-progress-info"
                                    >

                                        <span>
                                            ${formatKm(
                                                athlete.kilometers
                                            )}
                                        </span>

                                        <strong>
                                            ${progress.toFixed(
                                                1
                                            ).replace(
                                                ".",
                                                ","
                                            )}%
                                        </strong>

                                    </div>


                                    <div
                                        class="athlete-table-progress-track"
                                    >

                                        <div
                                            class="athlete-table-progress-fill"
                                            style="width: ${progress}%"
                                        ></div>

                                    </div>

                                </div>

                            </td>


                            <td>
                                ${athlete.activityCount}
                            </td>


                            <td>

                                <span
                                    class="
                                        athlete-status
                                        ${athlete.status.key}
                                    "
                                >
                                    ${escapeHtml(
                                        athlete.status.label
                                    )}
                                </span>

                            </td>


                            <td>

                                <button
                                    type="button"
                                    class="athlete-view-button"
                                    data-athlete-id="${escapeHtml(
                                        athlete.id
                                    )}"
                                >
                                    Ver
                                </button>

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   16. ABRIR PERFIL
========================================================= */

function openAthleteModal(
    athlete
) {

    if (
        !athlete ||
        !athleteModal
    ) {
        return;
    }


    athleteModalName.textContent =
        athlete.name;


    athleteModalTeam.textContent =
        athlete.team ||
        "Sem equipe";


    modalGoal.textContent =
        formatKm(
            athlete.goal
        );


    modalCompleted.textContent =
        formatKm(
            athlete.kilometers
        );


    modalRemaining.textContent =
        formatKm(
            athlete.remaining
        );


    modalActivities.textContent =
        athlete.activityCount;


    modalProgressText.textContent =
        athlete.progress
            .toFixed(1)
            .replace(".", ",") +
        "%";


    modalProgressBar.style.width =
        Math.min(
            athlete.progress,
            100
        ) + "%";


    modalAverage.textContent =
        formatKm(
            athlete.average
        );


    modalLongest.textContent =
        formatKm(
            athlete.longest
        );


    modalLastActivity.textContent =
        athlete.lastActivity
            ? formatDate(
                athlete.lastActivity
            )
            : "—";


    renderAthleteHistory(
        athlete.activities
    );


    athleteModal.classList.add(
        "open"
    );


    athleteModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   17. HISTÓRICO
========================================================= */

function renderAthleteHistory(
    activities
) {

    if (!athleteHistory) {
        return;
    }


    if (
        !activities ||
        !activities.length
    ) {

        athleteHistory.innerHTML = `
            <p class="athletes-empty">
                Nenhuma atividade aprovada.
            </p>
        `;

        return;
    }


    athleteHistory.innerHTML =
        activities
            .map(
                activity => {

                    const proof =
                        getActivityProof(
                            activity
                        );


                    return `
                        <div
                            class="athlete-history-item"
                        >

                            <span>
                                ${escapeHtml(
                                    formatDate(
                                        getActivityDate(
                                            activity
                                        )
                                    )
                                )}
                            </span>


                            <strong>
                                ${escapeHtml(
                                    formatKm(
                                        getActivityDistance(
                                            activity
                                        )
                                    )
                                )}
                            </strong>


                            <span>
                                ${escapeHtml(
                                    getActivityTime(
                                        activity
                                    )
                                )}
                            </span>


                            ${
                                proof
                                    ? `
                                        <a
                                            href="${escapeHtml(
                                                proof
                                            )}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="athlete-view-button"
                                        >
                                            Comprovante
                                        </a>
                                    `
                                    : `
                                        <span>
                                            Aprovada
                                        </span>
                                    `
                            }

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================================
   18. FECHAR MODAL
========================================================= */

function closeAthleteModal() {

    if (!athleteModal) {
        return;
    }


    athleteModal.classList.remove(
        "open"
    );


    athleteModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   19. CLIQUE NA TABELA
========================================================= */

if (athletesTableBody) {

    athletesTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-athlete-id]"
                );


            if (!button) {
                return;
            }


            const athleteId =
                button.dataset.athleteId;


            const athlete =
                athletes.find(
                    item =>
                        String(item.id) ===
                        String(athleteId)
                );


            if (athlete) {

                openAthleteModal(
                    athlete
                );

            }

        }
    );

}


/* =========================================================
   20. FECHAR MODAL
========================================================= */

document
    .querySelectorAll(
        "[data-close-athlete-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closeAthleteModal
            );

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            athleteModal &&
            athleteModal.classList.contains(
                "open"
            )
        ) {

            closeAthleteModal();

        }

    }
);


/* =========================================================
   21. EVENTOS DOS FILTROS
========================================================= */

if (athleteSearch) {

    athleteSearch.addEventListener(
        "input",
        applyFilters
    );

}


if (modalityFilter) {

    modalityFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* =========================================================
   22. ATUALIZAR
========================================================= */

if (refreshAthletesButton) {

    refreshAthletesButton.addEventListener(
        "click",
        loadAthletes
    );

}


/* =========================================================
   23. LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                if (
                    typeof db !==
                    "undefined"
                ) {

                    await db.auth.signOut();

                }

            } catch (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

            }


            window.location.href =
                "admin-login.html";

        }
    );

}


/* =========================================================
   24. INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadAthletes();

    }
);