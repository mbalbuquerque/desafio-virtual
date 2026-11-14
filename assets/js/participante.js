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

const rankingPosition =
    document.getElementById("rankingPosition");


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
            .trim()
            .toUpperCase()
            .replace(",", ".");


    /*
     * Aceita:
     *
     * 100km
     * 100 KM
     * 200km
     * 300km
     * 400km
     */
    const match =
        text.match(
            /(\d+(?:\.\d+)?)\s*KM/
        );


    if (match) {

        const goal =
            Number(
                match[1]
            );


        if (
            Number.isFinite(goal) &&
            goal > 0
        ) {

            return goal;

        }

    }


    /*
     * Nenhuma modalidade válida encontrada.
     * Não inventamos uma meta.
     */
    console.warn(
        "Modalidade não reconhecida:",
        modalidade
    );


    return 0;

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

/* =====================================================
   CALCULAR MÉTRICAS DO PARTICIPANTE
===================================================== */

const CHALLENGE_START_DATE =
    new Date("2026-10-05T00:00:00");

function calculateMetrics(participant) {

    const currentKm = Math.max(
        0,
        Number(participant.km_percorrido || 0)
    );

    const targetKm = getGoalKm(
        participant.modalidade
    );

    const percentage = targetKm > 0
        ? (currentKm / targetKm) * 100
        : 0;

    const remaining = Math.max(
        targetKm - currentKm,
        0
    );

    const days = getRemainingDays();

    const now = new Date();

    const totalDays = Math.max(
        1,
        (
            CHALLENGE_END_DATE.getTime() -
            CHALLENGE_START_DATE.getTime()
        ) / 86400000
    );

    const elapsedDays = Math.max(
        0,
        Math.min(
            totalDays,
            (
                now.getTime() -
                CHALLENGE_START_DATE.getTime()
            ) / 86400000
        )
    );

    const expectedProgress =
        (elapsedDays / totalDays) * 100;

    const elapsedWeeks = elapsedDays / 7;

    const weeklyAverage = elapsedWeeks > 0
        ? currentKm / elapsedWeeks
        : 0;

    const remainingWeeks = days / 7;

    const requiredPerWeek = remainingWeeks > 0
        ? remaining / remainingWeeks
        : 0;

    return {
        currentKm,
        targetKm,
        percentage,
        remaining,
        days,
        expectedProgress,
        weeklyAverage,
        requiredPerWeek
    };
}


/* =====================================================
   SITUAÇÃO DO DESAFIO
===================================================== */

function getChallengeSituation(
    metrics
) {

    /*
     * Ainda não iniciou
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
     * Bom ritmo
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
     * Ritmo abaixo do necessário
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

}

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

    /* =====================================================
   PROGRESSO ESPERADO
===================================================== */

if (expectedProgress) {

    expectedProgress.textContent =
        formatNumber(
            metrics.expectedProgress
        ) + "%";

}

/* =====================================================
   MÉDIA ATUAL POR SEMANA
===================================================== */

if (weeklyAverage) {

    weeklyAverage.textContent =
        formatNumber(
            metrics.weeklyAverage
        ) + " KM";

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
   COMPARTILHAR RESULTADO — CARD PERSONALIZADO
===================================================== */

async function shareResult() {
    const participant = getParticipant();
    const metrics = window.participantMetrics;

    if (!participant || !metrics) {
        alert("Não foi possível carregar seu resultado.");
        return;
    }

    const nome = String(participant.nome || "Atleta").trim();
    const equipe = String(participant.equipe || "Atleta independente");
    const km = Number(metrics.currentKm || 0);
    const meta = Number(metrics.targetKm || 0);
    const percentual = meta > 0
        ? Math.min(100, Math.max(0, (km / meta) * 100))
        : 0;

    const formatar = (valor, casas = 1) =>
        Number(valor).toLocaleString("pt-BR", {
            minimumFractionDigits: casas,
            maximumFractionDigits: casas
        });

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;

    const ctx = canvas.getContext("2d");

    // Fundo
    const fundo = ctx.createLinearGradient(0, 0, 1080, 1350);
    fundo.addColorStop(0, "#06182C");
    fundo.addColorStop(1, "#0B2B49");
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, 1080, 1350);

    // Detalhes decorativos
    ctx.fillStyle = "#FF7900";
    ctx.fillRect(0, 0, 1080, 18);
    ctx.fillRect(0, 1332, 1080, 18);

    ctx.textAlign = "center";

    // Identidade do evento
    ctx.fillStyle = "#FF7900";
    ctx.font = "bold 34px Arial";
    ctx.fillText("DESAFIO VIRTUAL 2026", 540, 150);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 76px Arial";
    ctx.fillText("CORRA POR VOCÊ", 540, 260);

    ctx.fillStyle = "#A9C0D6";
    ctx.font = "30px Arial";
    ctx.fillText("MINHA EVOLUÇÃO NO DESAFIO", 540, 325);

    // Nome do atleta (ajuste para nomes longos)
    let tamanhoNome = 54;
    do {
        ctx.font = `bold ${tamanhoNome}px Arial`;
        if (ctx.measureText(nome).width <= 940) break;
        tamanhoNome -= 2;
    } while (tamanhoNome > 28);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(nome, 540, 465);

    ctx.fillStyle = "#A9C0D6";
    ctx.font = "30px Arial";
    ctx.fillText(equipe.slice(0, 55), 540, 520);

    // Quilometragem
    ctx.fillStyle = "#FF7900";
    ctx.font = "bold 150px Arial";
    ctx.fillText(formatar(km), 540, 750);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 48px Arial";
    ctx.fillText("KM PERCORRIDOS", 540, 820);

    ctx.fillStyle = "#A9C0D6";
    ctx.font = "34px Arial";
    ctx.fillText(`META: ${formatar(meta, 0)} KM`, 540, 890);

    // Barra de progresso
    const barraX = 130;
    const barraY = 970;
    const barraLargura = 820;
    const barraAltura = 30;

    ctx.fillStyle = "#24425D";
    ctx.fillRect(barraX, barraY, barraLargura, barraAltura);

    ctx.fillStyle = "#FF7900";
    ctx.fillRect(
        barraX,
        barraY,
        barraLargura * percentual / 100,
        barraAltura
    );

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 46px Arial";
    ctx.fillText(
        `${formatar(percentual)}% CONCLUÍDO`,
        540,
        1090
    );

    ctx.fillStyle = "#A9C0D6";
    ctx.font = "28px Arial";
    ctx.fillText(
        "Cada quilômetro é uma conquista!",
        540,
        1190
    );

    ctx.fillStyle = "#FF7900";
    ctx.font = "bold 28px Arial";
    ctx.fillText("#CorraPorVoce", 540, 1250);

    // Gerar arquivo PNG
    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/png")
    );

    if (!blob) {
        alert("Não foi possível gerar o card.");
        return;
    }

    const arquivo = new File(
        [blob],
        "corra-por-voce-resultado.png",
        { type: "image/png" }
    );

    const url = URL.createObjectURL(blob);

    // Criar modal de pré-visualização
    document.getElementById("modalCompartilharResultado")?.remove();

    const modal = document.createElement("div");
    modal.id = "modalCompartilharResultado";

    Object.assign(modal.style, {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.88)",
        zIndex: "99999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
    });

    const painel = document.createElement("div");

    Object.assign(painel.style, {
        background: "#071B30",
        border: "1px solid #29435B",
        borderRadius: "18px",
        padding: "20px",
        width: "100%",
        maxWidth: "430px",
        maxHeight: "95vh",
        overflowY: "auto",
        textAlign: "center",
        color: "#FFFFFF"
    });

    const titulo = document.createElement("h2");
    titulo.textContent = "Compartilhe sua evolução";
    titulo.style.margin = "0 0 15px";

    const imagem = document.createElement("img");
    imagem.src = url;
    imagem.alt = "Card com o resultado do desafio";
    imagem.style.width = "100%";
    imagem.style.maxHeight = "55vh";
    imagem.style.objectFit = "contain";
    imagem.style.borderRadius = "10px";

    const botoes = document.createElement("div");

    Object.assign(botoes.style, {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "18px"
    });

    function criarBotao(texto, cor) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = texto;

        Object.assign(botao.style, {
            background: cor,
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            padding: "12px 16px",
            fontWeight: "bold",
            cursor: "pointer"
        });

        return botao;
    }

    const baixar = criarBotao("Baixar imagem", "#FF7900");
    const compartilhar = criarBotao("Compartilhar", "#087F5B");
    const fechar = criarBotao("Fechar", "#34495E");

    baixar.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "corra-por-voce-resultado.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
    });

    compartilhar.addEventListener("click", async () => {
        try {
            if (
                navigator.share &&
                navigator.canShare?.({ files: [arquivo] })
            ) {
                await navigator.share({
                    title: "Corra Por Você",
                    text: "Confira minha evolução no desafio! 🏃",
                    files: [arquivo]
                });
            } else {
                alert(
                    "O compartilhamento direto da imagem não está disponível neste navegador. Baixe o card para compartilhar."
                );
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Erro ao compartilhar:", error);
            }
        }
    });

    function fecharModal() {
        modal.remove();
        URL.revokeObjectURL(url);
    }

    fechar.addEventListener("click", fecharModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) fecharModal();
    });

    botoes.append(baixar, compartilhar, fechar);
    painel.append(titulo, imagem, botoes);
    modal.appendChild(painel);
    document.body.appendChild(modal);
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

        /*
 * Atualiza a lista de atividades
 * sem recarregar a página.
 */
await loadParticipantActivities(
    participant
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

/* =====================================================
   CARREGAR ATIVIDADES DO PARTICIPANTE
===================================================== */

async function loadParticipantActivities(participant) {

    if (!participant?.id) {
        console.error("ID da inscrição não encontrado.");

        if (activitiesList) {
            activitiesList.textContent =
                "Não foi possível identificar sua inscrição.";
        }

        return;
    }

    try {

        if (typeof db === "undefined") {
            throw new Error(
                "Cliente Supabase não inicializado."
            );
        }

        const { data, error } = await db
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
            .eq("inscricao_id", participant.id)
            .order("data_atividade", {
                ascending: false
            });

        if (error) {
            throw error;
        }

        const atividades = data || [];

        /* Exibir atividades no histórico */

        renderActivities(atividades);

        /* Considerar somente atividades aprovadas */

        const atividadesAprovadas =
            atividades.filter(atividade => {

                return String(
                    atividade.status || ""
                )
                    .trim()
                    .toUpperCase() === "APROVADA";

            });

        /* Somar quilômetros aprovados */

        const totalKm =
            atividadesAprovadas.reduce(
                (total, atividade) => {

                    const km = Number(
                        String(
                            atividade.distancia_km ?? 0
                        ).replace(",", ".")
                    );

                    return total + (
                        Number.isFinite(km) && km > 0
                            ? km
                            : 0
                    );

                },
                0
            );

        /* Atualizar os dados do participante */

        const participanteAtualizado = {
            ...participant,
            km_percorrido: totalKm
        };

        /* Atualizar armazenamento da sessão */

        sessionStorage.setItem(
            PARTICIPANT_STORAGE_KEY,
            JSON.stringify(participanteAtualizado)
        );

        /* Atualizar dashboard */

        renderParticipant(participanteAtualizado);

        console.log(
            "Atividades carregadas:",
            atividades.length
        );

        console.log(
            "Atividades aprovadas:",
            atividadesAprovadas.length
        );

        console.log(
            "Total de KM aprovados:",
            totalKm
        );

    } catch (error) {

        console.error(
            "Erro ao carregar atividades:",
            error
        );

        if (activitiesList) {
            activitiesList.textContent =
                "Não foi possível carregar as atividades. " +
                "Tente atualizar a página.";
        }

        /* Não sobrescrever métricas com zero
           quando a consulta falhar. */

    }

}


/* =====================================================
   POSIÇÃO DO ATLETA NO RANKING
===================================================== */


async function loadRankingPosition(participant) {
    if (!rankingPosition) return;

    rankingPosition.textContent = "—";

    try {
        const { data, error } = await db
            .from("ranking_publico")
            .select("id, nome, equipe, modalidade, km_percorrido");

        if (error) throw error;

        const ranking = (data || [])
            .filter(item =>
                Number.isFinite(Number(item.km_percorrido))
            )
            .sort((a, b) =>
                Number(b.km_percorrido) -
                Number(a.km_percorrido)
            );

        const normalizar = valor =>
            String(valor || "").trim().toLowerCase();

        let atleta = null;

        // Prioridade: identificar pelo ID.
        if (participant.id != null) {
            atleta = ranking.find(item =>
                String(item.id) === String(participant.id)
            );
        }

        // Alternativa: identificar por dados da inscrição.
        if (!atleta) {
            const candidatos = ranking.filter(item =>
                normalizar(item.nome) === normalizar(participant.nome) &&
                normalizar(item.modalidade) === normalizar(participant.modalidade) &&
                normalizar(item.equipe) === normalizar(participant.equipe)
            );

            if (candidatos.length === 1) {
                atleta = candidatos[0];
            }
        }

        if (!atleta) {
            console.warn("Não foi possível identificar o atleta no ranking.");
            return;
        }

        const kmAtleta = Number(atleta.km_percorrido);

        const posicao = ranking.filter(item =>
            Number(item.km_percorrido) > kmAtleta
        ).length + 1;

        rankingPosition.textContent = posicao + "º";

        console.log("Posição no ranking:", posicao);
    } catch (error) {
        console.error("Erro ao carregar ranking:", error);
        rankingPosition.textContent = "—";
    }
}



async function recuperarIdInscricao(participant) {
    if (!participant) return null;

    try {
        // Obtém o usuário autenticado pelo Supabase
        const { data: authData, error: authError } =
            await db.auth.getUser();

        if (authError) {
            console.error("Erro de autenticação:", authError);
            return participant;
        }

        const user = authData?.user;

        if (!user) {
            console.warn("Usuário não autenticado no Supabase.");
            return participant;
        }

        // Busca a inscrição vinculada ao usuário autenticado
        const { data, error } = await db
            .from("inscricoes")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (error) {
            console.error("Erro ao consultar inscrição:", error);
            return participant;
        }

        if (!data?.id) {
            console.warn(
                "Nenhuma inscrição vinculada ao usuário autenticado."
            );
            return participant;
        }

        const atualizado = {
            ...participant,
            id: data.id
        };

        sessionStorage.setItem(
            PARTICIPANT_STORAGE_KEY,
            JSON.stringify(atualizado)
        );

        console.log("Inscrição identificada:", atualizado.id);

        return atualizado;

    } catch (error) {
        console.error("Erro ao recuperar inscrição:", error);
        return participant;
    }
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */


async function initializeParticipantPage() {

    let participant = getParticipant();

    /*
     * Participante não está autenticado.
     */
    if (!participant) {
        window.location.replace("acesso.html");
        return;
    }

    /*
     * Recupera o ID da inscrição, caso não esteja
     * disponível na sessão.
     */
    if (!participant.id) {
        participant = await recuperarIdInscricao(participant);
    }

    console.log(
        "Participante carregado:",
        participant.id
    );

    /*
     * Renderiza dashboard.
     */
    renderParticipant(participant);

    /*
     * Carrega atividades do participante.
     */
    try {
        await loadParticipantActivities(participant);
    } catch (error) {
        console.error(
            "Erro ao carregar atividades:",
            error
        );
    }

    /*
     * Carrega posição no ranking.
     */
    try {
        await loadRankingPosition(participant);
    } catch (error) {
        console.error(
            "Erro ao carregar ranking:",
            error
        );
    }

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
        ?.querySelector(".modal-atividade-overlay")
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