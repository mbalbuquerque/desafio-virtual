
/* =====================================================
   CORRA POR VOCÊ
   GRÁFICOS DINÂMICOS — CHART.JS 4
===================================================== */

(() => {

    const section = document.getElementById(
        "performanceCharts"
    );

    if (!section) return;

    const message = document.getElementById(
        "chartsMessage"
    );

    const storageKey = "corra_por_voce_participante";

    const number = value =>
        Number(
            String(value ?? "0").replace(",", ".")
        ) || 0;

    const dateUTC = value => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
            return null;
        }

        const date = new Date(`${value}T12:00:00Z`);

        return Number.isNaN(date.getTime())
            ? null
            : date;
    };

    const dayString = date =>
        date.toISOString().slice(0, 10);

    const dayDiff = (start, end) =>
        Math.round((end - start) / 86400000);

    const format = value =>
        value.toLocaleString("pt-BR", {
            maximumFractionDigits: 1
        });

    const label = value =>
        new Date(`${value}T12:00:00Z`)
            .toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                timeZone: "UTC"
            });

    /* =================================================
       IDENTIFICAR META DA MODALIDADE
    ================================================= */

    function goalFromModality(modality) {

        const match = String(modality || "")
            .match(/(\d+(?:[.,]\d+)?)\s*km/i);

        return match ? number(match[1]) : 0;
    }

    let lineChart = null;
    let goalChart = null;

    /* =================================================
       CARREGAR DADOS E ATUALIZAR GRÁFICOS
    ================================================= */

    async function update() {

        try {

            if (typeof Chart === "undefined") {
                throw new Error(
                    "Biblioteca Chart.js não carregada."
                );
            }

            const start = dateUTC(
                section.dataset.startDate
            );

            const end = dateUTC(
                section.dataset.endDate
            );

            if (!start || !end || end <= start) {

                message.textContent =
                    "Configure as datas oficiais do desafio.";

                return;
            }

            /* PARTICIPANTE DA SESSÃO */

            const participant = JSON.parse(
                sessionStorage.getItem(storageKey) || "null"
            );

            if (
                !participant?.nome ||
                !participant?.modalidade
            ) {

                message.textContent =
                    "Entre na área do participante para visualizar os gráficos.";

                return;
            }

            const goal = goalFromModality(
                participant.modalidade
            );

            if (!goal) {
                throw new Error(
                    "Meta da modalidade não identificada."
                );
            }

            if (typeof db === "undefined" || !db) {
                throw new Error(
                    "Cliente Supabase não inicializado."
                );
            }

            /* CONSULTAR ATIVIDADES */

            const { data, error } = await db
                .from("atividades_publicas")
                .select(`
                    data_atividade,
                    distancia_km,
                    status
                `)
                .eq("nome", participant.nome)
                .eq("modalidade", participant.modalidade)
                .order("data_atividade", {
                    ascending: true
                });

            if (error) throw error;

            /* SOMENTE ATIVIDADES APROVADAS */

            const approved = (data || []).filter(
                activity =>
                    String(activity.status || "")
                        .trim()
                        .toUpperCase() === "APROVADA"
            );

            /* AGRUPAR KM POR DATA */

            const byDate = new Map();

            for (const activity of approved) {

                if (!dateUTC(activity.data_atividade)) {
                    continue;
                }

                const previous =
                    byDate.get(activity.data_atividade) || 0;

                const distance = Math.max(
                    0,
                    number(activity.distancia_km)
                );

                byDate.set(
                    activity.data_atividade,
                    previous + distance
                );
            }

            /* =================================================
               PERÍODO DO DESAFIO
            ================================================= */

            const today = new Date();

            const current = new Date(
                Date.UTC(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                    12
                )
            );

            const visibleEnd =
                current < start
                    ? start
                    : current > end
                        ? end
                        : current;

            const dates = [];

            for (
                let date = new Date(start);
                date <= end;
                date.setUTCDate(date.getUTCDate() + 1)
            ) {

                dates.push(dayString(date));
            }

            /* =================================================
               LINHA REAL — KM ACUMULADOS
            ================================================= */

            let running = 0;

            const actual = dates.map(date => {

                if (dateUTC(date) > visibleEnd) {
                    return null;
                }

                running += byDate.get(date) || 0;

                return Math.round(running * 100) / 100;
            });

            /* =================================================
               LINHA ESPERADA — PROGRESSÃO LINEAR
            ================================================= */

            const expected = dates.map(date => {

                const elapsed = dayDiff(
                    start,
                    dateUTC(date)
                );

                const duration = dayDiff(
                    start,
                    end
                );

                return Math.round(
                    goal * elapsed / duration * 100
                ) / 100;
            });

            /* TOTAL APROVADO */

            const total = approved.reduce(
                (sum, activity) => {

                    return sum + Math.max(
                        0,
                        number(activity.distancia_km)
                    );

                },
                0
            );

            const complete = Math.min(goal, total);

            /* =================================================
               CONFIGURAÇÃO DO GRÁFICO DE LINHAS
            ================================================= */

            const lineOptions = {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                plugins: {

                    legend: {
                        labels: {
                            color: "#dce8f3"
                        }
                    },

                    tooltip: {

                        callbacks: {

                            label: context =>
                                `${context.dataset.label}: ${format(context.parsed.y)} km`
                        }
                    }
                },

                scales: {

                    x: {

                        ticks: {
                            color: "#91a7bb",
                            maxTicksLimit: 7
                        },

                        grid: {
                            color: "rgba(255,255,255,.05)"
                        }
                    },

                    y: {

                        beginAtZero: true,

                        ticks: {
                            color: "#91a7bb"
                        },

                        grid: {
                            color: "rgba(255,255,255,.09)"
                        },

                        title: {
                            display: true,
                            text: "KM acumulados",
                            color: "#91a7bb"
                        }
                    }
                }
            };

            /* =================================================
               RENDERIZAR GRÁFICO DE EVOLUÇÃO
            ================================================= */

            if (lineChart) {
                lineChart.destroy();
            }

            lineChart = new Chart(
                document.getElementById("evolutionChart"),
                {

                    type: "line",

                    data: {

                        labels: dates.map(label),

                        datasets: [

                            {
                                label: "Real",

                                data: actual,

                                borderColor: "#20c5ef",

                                backgroundColor:
                                    "rgba(32,197,239,.1)",

                                fill: true,

                                tension: 0.25,

                                pointRadius: 0,

                                pointHoverRadius: 5,

                                spanGaps: false
                            },

                            {
                                label: "Esperado",

                                data: expected,

                                borderColor: "#ff7300",

                                borderDash: [7, 5],

                                tension: 0,

                                pointRadius: 0,

                                pointHoverRadius: 4
                            }
                        ]
                    },

                    options: lineOptions
                }
            );

            /* =================================================
               GRÁFICO CIRCULAR — PROGRESSO DA META
            ================================================= */

            if (goalChart) {
                goalChart.destroy();
            }

            goalChart = new Chart(
                document.getElementById("goalChart"),
                {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Concluído",
                            "Restante"
                        ],

                        datasets: [

                            {
                                data: [
                                    complete,
                                    Math.max(0, goal - complete)
                                ],

                                backgroundColor: [
                                    "#20d88a",
                                    "#183b56"
                                ],

                                borderWidth: 0
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "76%",

                        plugins: {

                            legend: {
                                display: false
                            },

                            tooltip: {

                                callbacks: {

                                    label: context =>
                                        `${context.label}: ${format(context.parsed)} km`
                                }
                            }
                        }
                    }
                }
            );

            /* =================================================
               RESUMO DO GRÁFICO
            ================================================= */

            document.getElementById(
                "goalChartSummary"
            ).textContent =
                `${format(total)} de ${format(goal)} km ` +
                `(${format(total / goal * 100)}%)`;

            message.textContent =
                "Somente atividades aprovadas entram no desempenho real.";

            console.log(
                "Gráficos atualizados:",
                approved.length,
                "atividades aprovadas."
            );

        } catch (error) {

            console.error(
                "Erro nos gráficos:",
                error
            );

            message.textContent =
                `Não foi possível carregar os gráficos: ${error.message}`;
        }
    }

    /* =================================================
       INICIALIZAÇÃO
    ================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            update
        );

    } else {

        update();
    }

    /* ATUALIZAR AO RETORNAR PARA A PÁGINA */

    window.addEventListener("focus", () => {

        if (!document.hidden) {
            update();
        }
    });

})();
