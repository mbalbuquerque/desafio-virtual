/* =====================================================
   CORRA POR VOCÊ
   ACESSO.JS

   Área do participante
   Consulta simplificada por e-mail
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const accessForm =
    document.getElementById(
        "accessForm"
    );

const emailInput =
    document.getElementById(
        "accessEmail"
    );

const accessButton =
    document.getElementById(
        "accessButton"
    );

const accessMessage =
    document.getElementById(
        "accessMessage"
    );


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const PARTICIPANT_STORAGE_KEY =
    "corra_por_voce_participante";


/* =====================================================
   MENSAGENS
===================================================== */

function showMessage(
    message,
    type = ""
) {

    if (!accessMessage) {
        return;
    }


    accessMessage.textContent =
        message;


    accessMessage.className =
        "access-message";


    if (type) {

        accessMessage
            .classList
            .add(type);

    }

}


/* =====================================================
   NORMALIZAR E-MAIL
===================================================== */

function normalizeEmail(
    email
) {

    return String(
        email || ""
    )
        .trim()
        .toLowerCase();

}


/* =====================================================
   VALIDAR E-MAIL
===================================================== */

function isValidEmail(
    email
) {

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailRegex.test(
        email
    );

}


/* =====================================================
   ESTADO DO BOTÃO
===================================================== */

function setLoading(
    loading
) {

    if (!accessButton) {
        return;
    }


    accessButton.disabled =
        loading;


    if (loading) {

        accessButton.innerHTML =
            `
                <span class="button-text">
                    Buscando inscrição...
                </span>
            `;

        return;

    }


    accessButton.innerHTML =
        `
            <span class="button-text">
                Acessar meu desafio
            </span>

            <span aria-hidden="true">
                →
            </span>
        `;

}


/* =====================================================
   LIMPAR DADOS ANTIGOS
===================================================== */

function clearParticipantStorage() {

    sessionStorage.removeItem(
        PARTICIPANT_STORAGE_KEY
    );

}


/* =====================================================
   SALVAR DADOS DO PARTICIPANTE

   Usamos sessionStorage nesta primeira versão.

   Os dados desaparecem quando a sessão/aba do
   navegador é encerrada.

   Não armazenar aqui:
   - telefone
   - user_id
   - tokens
   - secrets
   - credenciais Strava
===================================================== */

function saveParticipant(
    participant
) {

    const safeParticipant = {

        nome:
            participant.nome || "",

        email:
            emailInput.value
                .trim()
                .toLowerCase(),

        equipe:
            participant.equipe || "",

        modalidade:
            participant.modalidade || "",

        km_percorrido:
            Number(
                participant.km_percorrido || 0
            )

    };


    sessionStorage.setItem(

        PARTICIPANT_STORAGE_KEY,

        JSON.stringify(
            safeParticipant
        )

    );

}

/* =====================================================
   BUSCAR PARTICIPANTE
===================================================== */

async function findParticipant(
    email
) {

    /*
     * A função RPC será criada no Supabase.
     *
     * IMPORTANTE:
     * não fazemos SELECT direto em inscricoes.
     */

    const {
        data,
        error
    } = await db.rpc(

        "buscar_participante_por_email",

        {
            p_email:
                email
        }

    );


    if (error) {

        throw error;

    }


    /*
     * RETURNS TABLE normalmente devolve array.
     */

    if (
        !data ||
        !Array.isArray(data) ||
        data.length === 0
    ) {

        return null;

    }


    return data[0];

}


/* =====================================================
   ACESSAR DESAFIO
===================================================== */

async function accessChallenge(
    event
) {

    event.preventDefault();


    /* ---------------------------------------------
       1. NORMALIZAR E-MAIL
    --------------------------------------------- */

    const email =
        normalizeEmail(
            emailInput.value
        );


    /* ---------------------------------------------
       2. VALIDAR CAMPO
    --------------------------------------------- */

    if (!email) {

        showMessage(
            "Informe o e-mail utilizado na sua inscrição.",
            "error"
        );

        emailInput.focus();

        return;

    }


    /* ---------------------------------------------
       3. VALIDAR FORMATO
    --------------------------------------------- */

    if (
        !isValidEmail(email)
    ) {

        showMessage(
            "Informe um e-mail válido.",
            "error"
        );

        emailInput.focus();

        return;

    }


    /* ---------------------------------------------
       4. PREPARAR CONSULTA
    --------------------------------------------- */

    clearParticipantStorage();

    showMessage("");

    setLoading(true);


    try {

        /* -----------------------------------------
           5. CONSULTAR SUPABASE
        ----------------------------------------- */

        const participant =
            await findParticipant(
                email
            );


        /* -----------------------------------------
           6. NÃO ENCONTRADO
        ----------------------------------------- */

        if (!participant) {

            showMessage(
                "Não encontramos uma inscrição com este e-mail. " +
                "Confira o endereço informado.",
                "error"
            );

            return;

        }


        /* -----------------------------------------
           7. SALVAR SOMENTE DADOS NECESSÁRIOS
        ----------------------------------------- */

        saveParticipant(
            participant
        );


        /* -----------------------------------------
           8. FEEDBACK
        ----------------------------------------- */

        showMessage(
            "Inscrição encontrada! Abrindo seu desafio...",
            "success"
        );


        /* -----------------------------------------
           9. REDIRECIONAR
        ----------------------------------------- */

        setTimeout(

            () => {

                window.location.href =
                    "participante.html";

            },

            500

        );


    } catch (error) {

        console.error(
            "Erro ao buscar participante:",
            error
        );


        showMessage(
            "Não foi possível consultar sua inscrição agora. " +
            "Tente novamente em alguns instantes.",
            "error"
        );


    } finally {

        setLoading(false);

    }

}


/* =====================================================
   NORMALIZAÇÃO DURANTE DIGITAÇÃO
===================================================== */

function handleEmailInput() {

    /*
     * Remove espaços acidentais no início.
     * Não alteramos agressivamente enquanto
     * o usuário está digitando.
     */

    if (
        emailInput.value.startsWith(" ")
    ) {

        emailInput.value =
            emailInput.value.trimStart();

    }


    /*
     * Remove mensagem de erro quando
     * o usuário começa a corrigir.
     */

    if (
        accessMessage &&
        accessMessage.classList.contains(
            "error"
        )
    ) {

        showMessage("");

    }

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

function initializeAccessPage() {

    if (
        !accessForm ||
        !emailInput ||
        !accessButton
    ) {

        console.error(
            "Elementos da página de acesso não encontrados."
        );

        return;

    }


    /*
     * Não reaproveitamos automaticamente
     * participante anterior.
     */

    clearParticipantStorage();


    accessForm.addEventListener(
        "submit",
        accessChallenge
    );


    emailInput.addEventListener(
        "input",
        handleEmailInput
    );


    emailInput.focus();

}


/* =====================================================
   START
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeAccessPage

);