/* =====================================================
   CONFIGURAÇÃO SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://dkvmnznkhoprdpqpcjlu.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_UeDPQjcS4UoKkFaa2vPuhg_7DPsAQel";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =====================================================
   ELEMENTOS
===================================================== */

const loginForm =
    document.getElementById(
        "adminLoginForm"
    );

const emailInput =
    document.getElementById(
        "adminEmail"
    );

const passwordInput =
    document.getElementById(
        "adminPassword"
    );

const loginButton =
    document.getElementById(
        "adminLoginButton"
    );

const messageElement =
    document.getElementById(
        "adminLoginMessage"
    );


/* =====================================================
   MENSAGEM
===================================================== */

function showMessage(
    message,
    type = "error"
) {

    messageElement.textContent =
        message;

    messageElement.style.color =
        type === "success"
            ? "#52d273"
            : "#ff795f";
}


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;

        if (!email || !password) {

            showMessage(
                "Informe e-mail e senha."
            );

            return;
        }


        loginButton.disabled = true;

        loginButton.textContent =
            "Entrando...";

        messageElement.textContent =
            "";


        try {

            /* =========================================
               AUTENTICAR
            ========================================= */

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({
                        email,
                        password
                    });


            if (error) {

                console.error(
                    "Erro de autenticação:",
                    error
                );

                throw new Error(
                    "E-mail ou senha inválidos."
                );
            }


            const user =
                data.user;


            if (!user) {

                throw new Error(
                    "Não foi possível identificar o usuário."
                );
            }


            /* =========================================
               VERIFICAR SE É ADMIN
            ========================================= */

            const {
                data: admin,
                error: adminError
            } =
                await supabaseClient
                    .from("admin_users")
                    .select(
                        "id,email,nome,ativo"
                    )
                    .eq(
                        "id",
                        user.id
                    )
                    .eq(
                        "ativo",
                        true
                    )
                    .maybeSingle();


            if (adminError) {

                console.error(
                    "Erro verificando administrador:",
                    adminError
                );

                await supabaseClient.auth
                    .signOut();

                throw new Error(
                    "Não foi possível validar o administrador."
                );
            }


            if (!admin) {

                await supabaseClient.auth
                    .signOut();

                throw new Error(
                    "Usuário sem permissão administrativa."
                );
            }


            /* =========================================
               SUCESSO
            ========================================= */

            showMessage(
                "Acesso autorizado.",
                "success"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "./admin.html";

                },
                500
            );

        } catch (error) {

            console.error(
                "Erro no login administrativo:",
                error
            );

            showMessage(
                error.message ||
                "Não foi possível entrar."
            );

        } finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Entrar";
        }
    }
);


/* =====================================================
   SESSÃO JÁ EXISTENTE

   Se o administrador já estiver autenticado,
   manda diretamente para o painel.
===================================================== */

async function checkExistingSession() {

    try {

        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth
                .getSession();


        if (!session?.user) {
            return;
        }


        const {
            data: admin
        } =
            await supabaseClient
                .from("admin_users")
                .select("id")
                .eq(
                    "id",
                    session.user.id
                )
                .eq(
                    "ativo",
                    true
                )
                .maybeSingle();


        if (admin) {

            window.location.href =
                "./admin.html";
        }

    } catch (error) {

        console.error(
            "Erro verificando sessão:",
            error
        );
    }
}


checkExistingSession();