/* =====================================================
   CORRA POR VOCÊ
   PARTICIPANTE.JS

   Área do participante
===================================================== */



/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const activitiesList =
    document.getElementById(
        "activitiesList"
    );

const PARTICIPANT_STORAGE_KEY =
    "corra_por_voce_participante";


const CHALLENGE_END_DATE =
    new Date("2026-12-31T23:59:59");


/* =====================================================
   ELEMENTOS PRINCIPAIS
===================================================== */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const shareResultButton =
    document.getElementById(
        "shareResultButton"
    );


const participantName =
    document.getElementById(
        "participantName"
    );


const challengeGoal =
    document.getElementById(
        "challengeGoal"
    );


const goalKm =
    document.getElementById(
        "goalKm"
    );


const progressKm =
    document.getElementById(
        "progressKm"
    );


const progressPercentage =
    document.getElementById(
        "progressPercentage"
    );


const actualProgress =
    document.getElementById(
        "actualProgress"
    );
    const expectedProgress =
    document.getElementById(
        "expectedProgress"
    );


const weeklyAverage =
    document.getElementById(
        "weeklyAverage"
    );


const progressBar =
    document.getElementById(
        "progressBar"
    );


const remainingKm =
    document.getElementById(
        "remainingKm"
    );


const remainingDays =
    document.getElementById(
        "remainingDays"
    );


const weeklyRequired =
    document.getElementById(
        "weeklyRequired"
    );


const challengeStatus =
    document.getElementById(
        "challengeStatus"
    );


const performanceTitle =
    document.getElementById(
        "performanceTitle"
    );


const performanceText =
    document.getElementById(
        "performanceText"
    );


/* =====================================================
   ELEMENTOS REGISTRAR ATIVIDADE
===================================================== */

const btnRegistrarAtividade =
    document.getElementById(
        "btnRegistrarAtividade"
    );


const modalAtividade =
    document.getElementById(
        "modalAtividade"
    );


const btnFecharAtividade =
    document.getElementById(
        "btnFecharAtividade"
    );


const formAtividade =
    document.getElementById(
        "formAtividade"
    );


const atividadeData =
    document.getElementById(
        "atividadeData"
    );


const atividadeDistancia =
    document.getElementById(
        "atividadeDistancia"
    );


const atividadeTempo =
    document.getElementById(
        "atividadeTempo"
    );


const atividadeComprovante =
    document.getElementById(
        "atividadeComprovante"
    );


const atividadeArquivoNome =
    document.getElementById(
        "atividadeArquivoNome"
    );


const atividadePreviewContainer =
    document.getElementById(
        "atividadePreviewContainer"
    );


const atividadePreview =
    document.getElementById(
        "atividadePreview"
    );


const atividadeMensagem =
    document.getElementById(
        "atividadeMensagem"
    );


const btnEnviarAtividade =
    document.getElementById(
        "btnEnviarAtividade"
    );


/* =====================================================
   FORMATADORES
===================================================== */

function formatNumber(
    value,
    decimals = 1
) {

    return Number(
        value || 0
    ).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits:
                decimals,

            maximumFractionDigits:
                decimals
        }
    );

}


/* =====================================================
   CARREGAR PARTICIPANTE
===================================================== */

function getParticipant() {

    const storedParticipant =
        sessionStorage.getItem(
            PARTICIPANT_STORAGE_KEY
        );


    if (!storedParticipant) {

        return null;

    }


    try {

        return JSON.parse(
            storedParticipant
        );

    } catch (error) {

        console.error(
            "Erro ao ler participante:",
            error
        );


        sessionStorage.removeItem(
            PARTICIPANT_STORAGE_KEY
        );


        return null;

    }

}


/* =====================================================
   META DO DESAFIO
===================================================== */

function getGoalKm(
    modalidade
) {

    const text =
        String(
            modalidade || ""
        )
            .toUpperCase()
            .replace(",", ".");


    const match =
        text.match(
            /(\d+(?:\.\d+)?)\s*KM/
        );


    if (match) {

        return Number(
            match[1]
        );

    }


    /*
     * Fallback.
     */

    return 200;

}


/* =====================================================
   DIAS RESTANTES
===================================================== */

function getRemainingDays() {

    const now =
        new Date();


    const difference =
        CHALLENGE_END_DATE.getTime() -
        now.getTime();


    if (difference <= 0) {

        return 0;

    }


    return Math.ceil(
        difference /
        (
            1000 *
            60 *
            60 *
            24
        )
    );

}


/* =====================================================
   CALCULAR MÉTRICAS
===================================================== */

function calculateMetrics(
    participant
) {

    const currentKm =
        Math.max(
            0,
            Number(
                participant.km_percorrido || 0
            )
        );


    const targetKm =
        getGoalKm(
            participant.modalidade
        );


    const percentage =
        targetKm > 0

            ? (
                currentKm /
                targetKm
            ) * 100

            : 0;


    const remaining =
        Math.max(
            targetKm - currentKm,
            0
        );


    const days =
        getRemainingDays();


    const weeks =
        days > 0

            ? days / 7

            : 0;


    const requiredPerWeek =
        weeks > 0

            ? remaining / weeks

            : 0;


    return {

        currentKm,

        targetKm,

        percentage,

        remaining,

        days,

        requiredPerWeek

    };

}


/* =====================================================
   SITUAÇÃO DO DESAFIO
===================================================== */

function getChallengeSituation(metrics) {

    /*
     * Atleta ainda não iniciou
     *
     * Não devemos avaliar ritmo ou consistência
     * enquanto não houver quilômetros aprovados.
     */
   
        if (
    metrics.currentKm <= 0
) {

    return {

        status:
            "Aguardando primeira atividade",

        title:
            "Comece seu desafio! 🏃",

        text:
            "Você ainda não possui atividades aprovadas. " +
            "Registre seu primeiro treino para começarmos " +
            "a acompanhar seu ritmo e evolução."

    };

}

        

    }


    /*
     * Meta concluída
     */
    if (
        metrics.remaining <= 0
    ) {

        return {

            status:
                "Meta concluída",

            title:
                "Parabéns! Meta concluída! 🎉",

            text:
                "Você já atingiu a sua meta no " +
                "Desafio Corra Por Você."

        };

    }


    /*
     * Desafio encerrado
     */
    if (
        metrics.days === 0
    ) {

        return {

            status:
                "Desafio encerrado",

            title:
                "Período encerrado",

            text:
                "O período oficial do desafio foi encerrado."

        };

    }


    /*
     * Ritmo confortável
     */
    if (
        metrics.requiredPerWeek <= 10
    ) {

        return {

            status:
                "No ritmo da meta",

            title:
                "Você está no caminho certo!",

            text:
                "Faltam " +
                formatNumber(
                    metrics.remaining
                ) +
                " km para concluir sua meta. " +
                "Você precisa percorrer aproximadamente " +
                formatNumber(
                    metrics.requiredPerWeek
                ) +
                " km por semana até o encerramento."

        };

    }


    /*
     * Ritmo de atenção
     */
    if (
        metrics.requiredPerWeek <= 20
    ) {

        return {

            status:
                "Atenção ao ritmo",

            title:
                "Sua meta continua ao alcance.",

            text:
                "Para completar o desafio no prazo, " +
                "sua média necessária daqui em diante é de " +
                formatNumber(
                    metrics.requiredPerWeek
                ) +
                " km por semana."

        };

    }


    /*
     * Necessidade de aumentar consistência
     */
    return {

        status:
            "Aumentar consistência",

        title:
            "Acompanhe seu ritmo nas próximas semanas.",

        text:
            "Faltam " +
            formatNumber(
                metrics.remaining
            ) +
            " km. No ritmo necessário atual, seriam cerca de " +
            formatNumber(
                metrics.requiredPerWeek
            ) +
            " km por semana até o encerramento."

    };




/* =====================================================
   ATUALIZAR INTERFACE
===================================================== */

function renderParticipant(
    participant
) {

    const metrics =
        calculateMetrics(
            participant
        );


    const situation =
        getChallengeSituation(
            metrics
        );


    /* NOME */

    if (participantName) {

        const firstName =
            String(
                participant.nome || "Atleta"
            )
                .trim()
                .split(/\s+/)[0];


        participantName.textContent =
            firstName;

    }


    /* META */

    if (challengeGoal) {

        challengeGoal.textContent =
            formatNumber(
                metrics.targetKm,
                0
            ) +
            " KM";

    }


    if (goalKm) {

        goalKm.textContent =
            formatNumber(
                metrics.targetKm,
                0
            );

    }


    /* KM PERCORRIDO */

    if (progressKm) {

        progressKm.textContent =
            formatNumber(
                metrics.currentKm
            );

    }


    /* PERCENTUAL */

    const percentageText =
        formatNumber(
            metrics.percentage
        ) +
        "%";


    if (progressPercentage) {

        progressPercentage.textContent =
            percentageText;

    }


    if (actualProgress) {

        actualProgress.textContent =
            percentageText;

    }


    /* BARRA */

    if (progressBar) {

        const barPercentage =
            Math.min(
                Math.max(
                    metrics.percentage,
                    0
                ),
                100
            );


        progressBar.style.width =
            barPercentage + "%";

    }


    /* RESTANTE */

    if (remainingKm) {

        remainingKm.textContent =
            formatNumber(
                metrics.remaining
            ) +
            " KM";

    }


    /* DIAS */

    if (remainingDays) {

        remainingDays.textContent =
            metrics.days;

    }


    /* KM / SEMANA */

    if (weeklyRequired) {

        weeklyRequired.textContent =
            formatNumber(
                metrics.requiredPerWeek
            ) +
            " KM";

    }


    /* SITUAÇÃO */

    if (challengeStatus) {

        challengeStatus.textContent =
            situation.status;

    }


    /* INSIGHT */

    if (performanceTitle) {

        performanceTitle.textContent =
            situation.title;

    }


    if (performanceText) {

        performanceText.textContent =
            situation.text;

    }


    window.participantMetrics =
        metrics;

}


/* =====================================================
   SAIR
===================================================== */

function logout() {

    sessionStorage.removeItem(
        PARTICIPANT_STORAGE_KEY
    );


    window.location.href =
        "acesso.html";

}

/* =====================================================
   COMPARTILHAR
===================================================== */

async function shareResult() {

    const participant =
        getParticipant();


    const metrics =
        window.participantMetrics;


    if (
        !participant ||
        !metrics
    ) {

        return;

    }


    const firstName =
        String(
            participant.nome || "Atleta"
        )
            .trim()
            .split(/\s+/)[0];


    const text =

        "🏃 " +
        firstName +
        " está no Desafio Corra Por Você!\n\n" +

        "📏 " +
        formatNumber(
            metrics.currentKm
        ) +
        " km percorridos\n" +

        "🎯 Meta: " +
        formatNumber(
            metrics.targetKm,
            0
        ) +
        " km\n" +

        "🔥 " +
        formatNumber(
            metrics.percentage
        ) +
        "% concluído\n\n" +

        "#CorraPorVoce";


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "Corra Por Você",

                text:
                    text

            });


            return;


        } catch (error) {

            if (
                error.name !==
                "AbortError"
            ) {

                console.error(
                    "Erro ao compartilhar:",
                    error
                );

            }


            return;

        }

    }


    try {

        await navigator.clipboard
            .writeText(
                text
            );


        alert(
            "Seu resultado foi copiado. " +
            "Agora você pode compartilhar!"
        );


    } catch (error) {

        console.error(
            "Erro ao copiar resultado:",
            error
        );


        alert(
            text
        );

    }

}


/* =====================================================
   MENSAGEM DA ATIVIDADE
===================================================== */

function mostrarMensagemAtividade(
    mensagem,
    tipo = "erro"
) {

    if (!atividadeMensagem) {

        console.error(
            "Elemento atividadeMensagem não encontrado."
        );

        return;

    }


    atividadeMensagem.textContent =
        mensagem;


    atividadeMensagem.className =
        `atividade-mensagem ${tipo}`;


    atividadeMensagem.hidden =
        false;

}


/* =====================================================
   LIMPAR MENSAGEM
===================================================== */

function limparMensagemAtividade() {

    if (!atividadeMensagem) {

        return;

    }


    atividadeMensagem.textContent =
        "";


    atividadeMensagem.className =
        "atividade-mensagem";


    atividadeMensagem.hidden =
        true;

}


/* =====================================================
   ABRIR MODAL
===================================================== */

function abrirModalAtividade() {

    if (!modalAtividade) {

        console.error(
            "Modal modalAtividade não encontrado."
        );

        return;

    }


    limparMensagemAtividade();


    modalAtividade.classList.add(
        "ativo"
    );


    modalAtividade.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    /*
     * Não permite atividade futura.
     */

    if (atividadeData) {

        const hoje =
            new Date();


        const ano =
            hoje.getFullYear();


        const mes =
            String(
                hoje.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const dia =
            String(
                hoje.getDate()
            ).padStart(
                2,
                "0"
            );


        atividadeData.max =
            `${ano}-${mes}-${dia}`;

    }

}


/* =====================================================
   FECHAR MODAL
===================================================== */

function fecharModalAtividade() {

    if (!modalAtividade) {

        return;

    }


    modalAtividade.classList.remove(
        "ativo"
    );


    modalAtividade.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   PREVIEW DO COMPROVANTE
===================================================== */

function atualizarPreviewComprovante() {

    if (
        !atividadeComprovante ||
        !atividadeArquivoNome ||
        !atividadePreviewContainer ||
        !atividadePreview
    ) {

        return;

    }


    limparMensagemAtividade();


    const arquivo =
        atividadeComprovante.files?.[0];


    if (!arquivo) {

        atividadeArquivoNome.textContent =
            "";


        atividadePreviewContainer.hidden =
            true;


        atividadePreview.removeAttribute(
            "src"
        );


        return;

    }


    /*
     * 5 MB.
     */

    const limite =
        5 * 1024 * 1024;


    if (
        arquivo.size >
        limite
    ) {

        atividadeComprovante.value =
            "";


        atividadeArquivoNome.textContent =
            "";


        atividadePreviewContainer.hidden =
            true;


        atividadePreview.removeAttribute(
            "src"
        );


        mostrarMensagemAtividade(
            "A imagem deve possuir no máximo 5 MB.",
            "erro"
        );


        return;

    }


    const tiposPermitidos = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];


    if (
        !tiposPermitidos.includes(
            arquivo.type
        )
    ) {

        atividadeComprovante.value =
            "";


        atividadeArquivoNome.textContent =
            "";


        atividadePreviewContainer.hidden =
            true;


        atividadePreview.removeAttribute(
            "src"
        );


        mostrarMensagemAtividade(
            "Utilize uma imagem JPG, PNG ou WEBP.",
            "erro"
        );


        return;

    }


    atividadeArquivoNome.textContent =
        arquivo.name;


    const url =
        URL.createObjectURL(
            arquivo
        );


    atividadePreview.onload =
        () => {

            URL.revokeObjectURL(
                url
            );

        };


    atividadePreview.src =
        url;


    atividadePreviewContainer.hidden =
        false;

}

/* =====================================================
   ENVIAR ATIVIDADE
===================================================== */

async function enviarAtividade(
    event
) {

    event.preventDefault();


    limparMensagemAtividade();


    const participant =
        getParticipant();


    if (
        !participant ||
        !participant.email
    ) {

        mostrarMensagemAtividade(
            "Não foi possível identificar o participante. " +
            "Saia e entre novamente na Área do Participante.",
            "erro"
        );


        return;

    }


    if (
        !atividadeData ||
        !atividadeDistancia ||
        !atividadeComprovante
    ) {

        mostrarMensagemAtividade(
            "O formulário de atividade não foi carregado corretamente.",
            "erro"
        );


        return;

    }


    const data =
        atividadeData.value;


    const distancia =
        atividadeDistancia.value;


    const tempo =
        atividadeTempo
            ? atividadeTempo.value.trim()
            : "";


    const arquivo =
        atividadeComprovante
            .files?.[0];


    if (!data) {

        mostrarMensagemAtividade(
            "Informe a data da atividade.",
            "erro"
        );


        return;

    }


    const distanciaNumero =
        Number(
            String(
                distancia
            ).replace(
                ",",
                "."
            )
        );


    if (
        !Number.isFinite(
            distanciaNumero
        ) ||
        distanciaNumero <= 0
    ) {

        mostrarMensagemAtividade(
            "Informe uma distância válida.",
            "erro"
        );


        return;

    }


    if (!arquivo) {

        mostrarMensagemAtividade(
            "Selecione o print da atividade.",
            "erro"
        );


        return;

    }


    /*
     * Confirma novamente tamanho e formato.
     */

    const limite =
        5 * 1024 * 1024;


    if (
        arquivo.size >
        limite
    ) {

        mostrarMensagemAtividade(
            "A imagem deve possuir no máximo 5 MB.",
            "erro"
        );


        return;

    }


    const tiposPermitidos = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];


    if (
        !tiposPermitidos.includes(
            arquivo.type
        )
    ) {

        mostrarMensagemAtividade(
            "Utilize uma imagem JPG, PNG ou WEBP.",
            "erro"
        );


        return;

    }


    const formData =
        new FormData();


    formData.append(
        "email",
        participant.email
    );


    formData.append(
        "data_atividade",
        data
    );


    formData.append(
        "distancia_km",
        String(
            distanciaNumero
        )
    );


    formData.append(
        "tempo",
        tempo
    );


    formData.append(
        "comprovante",
        arquivo
    );


    try {

        if (btnEnviarAtividade) {

            btnEnviarAtividade.disabled =
                true;


            btnEnviarAtividade.textContent =
                "Enviando...";

        }


        console.log(
            "Enviando atividade para validação..."
        );


        /*
         * Usa o cliente Supabase já configurado
         * em assets/js/supabase.js.
         */

        if (
            typeof db === "undefined" ||
            !db?.functions
        ) {

            throw new Error(
                "Cliente Supabase não inicializado."
            );

        }


        const {
            data: resultado,
            error
        } = await db.functions.invoke(
            "atividade-enviar",
            {
                body:
                    formData
            }
        );


        if (error) {

            console.error(
                "Erro atividade-enviar:",
                error
            );


            /*
             * Algumas versões do supabase-js
             * encapsulam a resposta da função.
             */

            let mensagem =
                "Não foi possível enviar a atividade.";


            if (
                error.context &&
                typeof error.context.json ===
                    "function"
            ) {

                try {

                    const detalhes =
                        await error.context.json();


                    if (
                        detalhes?.error
                    ) {

                        mensagem =
                            detalhes.error;

                    }

                } catch (
                    contextError
                ) {

                    console.error(
                        "Erro lendo resposta da função:",
                        contextError
                    );

                }

            }


            throw new Error(
                mensagem
            );

        }


        console.log(
            "Resposta atividade-enviar:",
            resultado
        );


        if (
            !resultado ||
            !resultado.success
        ) {

            throw new Error(
                resultado?.error ||
                "Não foi possível registrar a atividade."
            );

        }


        mostrarMensagemAtividade(
            "Atividade enviada! " +
            "Aguarde a validação da organização.",
            "sucesso"
        );


        /*
         * Limpa o formulário.
         */

        formAtividade?.reset();


        if (
            atividadeArquivoNome
        ) {

            atividadeArquivoNome.textContent =
                "";

        }


        if (
            atividadePreviewContainer
        ) {

            atividadePreviewContainer.hidden =
                true;

        }


        if (
            atividadePreview
        ) {

            atividadePreview.removeAttribute(
                "src"
            );

        }


        console.log(
            "Atividade registrada com sucesso:",
            resultado.atividade
        );


    } catch (error) {

        console.error(
            "Erro enviando atividade:",
            error
        );


        mostrarMensagemAtividade(
            error?.message ||
            "Erro ao enviar atividade.",
            "erro"
        );


    } finally {

        if (btnEnviarAtividade) {

            btnEnviarAtividade.disabled =
                false;


            btnEnviarAtividade.textContent =
                "Enviar para validação";

        }

    }

}
/* =====================================================
   FORMATAR DATA DA ATIVIDADE
===================================================== */

function formatActivityDate(date) {

    if (!date) {
        return "Data não informada";
    }

    /*
     * Evita diferença de fuso ao interpretar YYYY-MM-DD.
     */
    const parts =
        String(date)
            .split("-");

    if (parts.length !== 3) {
        return date;
    }

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


/* =====================================================
   STATUS DA ATIVIDADE
===================================================== */

function getActivityStatus(status) {

    const normalized =
        String(status || "")
            .trim()
            .toUpperCase();


    if (normalized === "APROVADA") {

        return {
            text: "✓ Aprovada",
            className: "activity-valid"
        };

    }


    if (normalized === "REJEITADA") {

        return {
            text: "✕ Rejeitada",
            className: "activity-rejected"
        };

    }


    return {
        text: "⏳ Pendente",
        className: "activity-pending"
    };

}


/* =====================================================
   RENDERIZAR ATIVIDADES
===================================================== */

function renderActivities(activities) {

    if (!activitiesList) {
        return;
    }


    activitiesList.innerHTML = "";


    /*
     * Nenhuma atividade.
     */
    if (
        !Array.isArray(activities) ||
        activities.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "activities-empty";


        const icon =
            document.createElement(
                "span"
            );

        icon.className =
            "activities-empty-icon";

        icon.textContent =
            "🏃";


        const title =
            document.createElement(
                "strong"
            );

        title.textContent =
            "Nenhuma atividade registrada";


        const text =
            document.createElement(
                "p"
            );

        text.textContent =
            "Seus treinos aparecerão aqui após o envio.";


        empty.append(
            icon,
            title,
            text
        );


        activitiesList.appendChild(
            empty
        );

        return;

    }


    activities.forEach(
        activity => {

            const status =
                getActivityStatus(
                    activity.status
                );


            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "activity-card";


            /* Ícone */

            const icon =
                document.createElement(
                    "div"
                );

            icon.className =
                "activity-icon";

            icon.textContent =
                "🏃";


            /* Informações */

            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "activity-info";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                "Corrida";


            const date =
                document.createElement(
                    "span"
                );

            date.textContent =
                formatActivityDate(
                    activity.data_atividade
                );


            info.append(
                title,
                date
            );


            /* Distância e tempo */

            const stats =
                document.createElement(
                    "div"
                );

            stats.className =
                "activity-stat";


            const distance =
                document.createElement(
                    "strong"
                );

            distance.textContent =
                formatNumber(
                    activity.distancia_km
                ) +
                " KM";


            const time =
                document.createElement(
                    "span"
                );

            time.textContent =
                activity.tempo ||
                "Tempo não informado";


            stats.append(
                distance,
                time
            );


            /* Status */

            const statusElement =
                document.createElement(
                    "span"
                );

            statusElement.className =
                status.className;

            statusElement.textContent =
                status.text;


            card.append(
                icon,
                info,
                stats,
                statusElement
            );


            activitiesList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   CARREGAR ATIVIDADES DO PARTICIPANTE
===================================================== */

async function loadParticipantActivities(
    participant
) {

    if (!activitiesList) {
        return;
    }


    /*
     * O participante precisa possuir ID da inscrição.
     */
    if (!participant?.id) {

        console.error(
            "ID da inscrição não encontrado."
        );

        renderActivities([]);

        return;

    }


    try {

        const {
            data,
            error
        } = await db
            .from("atividades")
            .select(`
                id,
                inscricao_id,
                data_atividade,
                distancia_km,
                tempo,
                status,
                observacao_admin,
                criado_em,
                validado_em
            `)
            .eq(
                "inscricao_id",
                participant.id
            )
            .order(
                "data_atividade",
                {
                    ascending: false
                }
            );


        if (error) {

            throw error;

        }


        console.log(
            "Atividades carregadas:",
            data
        );


        renderActivities(
            data || []
        );


    } catch (error) {

        console.error(
            "Erro carregando atividades:",
            error
        );


        activitiesList.innerHTML =
            "<p>Não foi possível carregar suas atividades.</p>";

    }

}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

function initializeParticipantPage() {

    const participant =
        getParticipant();


    /*
     * Participante não está autenticado.
     */

    if (!participant) {

        window.location.replace(
            "acesso.html"
        );


        return;

    }


    console.log(
        "Participante carregado:",
        participant.id
    );


    /*
     * Renderiza dashboard.
     */

    renderParticipant(
        participant
    );

    loadParticipantActivities(
    participant
);


    /*
     * Logout.
     */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    /*
     * Compartilhar.
     */

    if (shareResultButton) {

        shareResultButton.addEventListener(
            "click",
            shareResult
        );

    }


    /*
     * Registrar atividade.
     */

    if (btnRegistrarAtividade) {

        btnRegistrarAtividade.addEventListener(
            "click",
            abrirModalAtividade
        );

    } else {

        console.error(
            "Botão btnRegistrarAtividade não encontrado."
        );

    }


    /*
     * Fechar modal.
     */

    if (btnFecharAtividade) {

        btnFecharAtividade.addEventListener(
            "click",
            fecharModalAtividade
        );

    }


    /*
     * Clique fora do modal.
     */

    modalAtividade
        ?.querySelector(
            ".modal-atividade-overlay"
        )
        ?.addEventListener(
            "click",
            fecharModalAtividade
        );


    /*
     * Seleção do comprovante.
     */

    if (atividadeComprovante) {

        atividadeComprovante.addEventListener(
            "change",
            atualizarPreviewComprovante
        );

    }


    /*
     * Envio da atividade.
     */

    if (formAtividade) {

        formAtividade.addEventListener(
            "submit",
            enviarAtividade
        );

    }


    console.log(
        "Área do participante inicializada."
    );

}


/* =====================================================
   ESC FECHA MODAL
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            modalAtividade?.classList.contains(
                "ativo"
            )
        ) {

            fecharModalAtividade();

        }

    }
);


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeParticipantPage
);