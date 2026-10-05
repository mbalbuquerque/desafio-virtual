"""
Regras de negócio utilizadas pela automação de QA
do sistema Desafio Virtual - Corra por Você.
"""


def validar_email(email):
    """
    Verifica se o e-mail possui uma estrutura mínima válida.
    """

    if not email:
        return False

    email = str(email).strip().lower()

    if "@" not in email:
        return False

    partes = email.split("@")

    if len(partes) != 2:
        return False

    usuario, dominio = partes

    if not usuario or not dominio:
        return False

    if "." not in dominio:
        return False

    return True


def verificar_email_duplicado(email, emails_cadastrados):
    """
    Retorna True quando o e-mail já está cadastrado.
    """

    email = str(email).strip().lower()

    emails_normalizados = [
        str(item).strip().lower()
        for item in emails_cadastrados
    ]

    return email in emails_normalizados


def validar_login(email, emails_cadastrados):
    """
    No Desafio Virtual, o participante acessa
    sua área utilizando o e-mail cadastrado.
    """

    if not validar_email(email):
        return False

    email = email.strip().lower()

    emails_normalizados = [
        str(item).strip().lower()
        for item in emails_cadastrados
    ]

    return email in emails_normalizados


def validar_quilometragem(km):
    """
    A quilometragem de uma atividade deve ser
    um número maior que zero.
    """

    try:
        km = float(km)

        if km <= 0:
            return False

        return True

    except (ValueError, TypeError):
        return False


def calcular_progresso(
    km_percorrido,
    meta_km,
    simular_bug=False
):
    """
    Calcula o percentual de progresso do participante.

    O parâmetro simular_bug é utilizado exclusivamente
    para demonstração de QA.

    Quando ativado, introduz propositalmente um defeito
    na regra de cálculo para verificar se a automação
    consegue detectar a falha.
    """

    try:
        km_percorrido = float(km_percorrido)
        meta_km = float(meta_km)

        if km_percorrido < 0:
            return 0

        if meta_km <= 0:
            return 0

        # =================================================
        # BUG PROPOSITAL PARA DEMONSTRAÇÃO DE QA
        # =================================================

        if simular_bug:

            # REGRA INCORRETA PROPOSITAL
            percentual = (
                km_percorrido / meta_km
            ) * 50

        else:

            # REGRA CORRETA
            percentual = (
                km_percorrido / meta_km
            ) * 100

        return round(
            percentual,
            2
        )

    except (ValueError, TypeError):
        return 0


def validar_atividade(km, evidencia):
    """
    Uma atividade precisa possuir quilometragem válida
    e evidência do treino.
    """

    if not validar_quilometragem(km):
        return False

    if evidencia is None:
        return False

    if not str(evidencia).strip():
        return False

    return True


def ordenar_ranking(participantes):
    """
    Ordena os participantes pela quilometragem,
    do maior para o menor.
    """

    return sorted(
        participantes,
        key=lambda participante: participante["km_percorrido"],
        reverse=True
    )