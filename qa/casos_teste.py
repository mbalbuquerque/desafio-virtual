from regras import (
    validar_email,
    verificar_email_duplicado,
    validar_login,
    validar_quilometragem,
    calcular_progresso,
    validar_atividade,
    ordenar_ranking
)


def executar_testes(simular_bug=False):

    resultados = []

    emails_cadastrados = [
        "atleta1@email.com",
        "atleta2@email.com"
    ]

    # =====================================================
    # QA-001 - E-mail válido
    # =====================================================

    obtido = validar_email("atleta@email.com")
    esperado = True

    resultados.append({
        "id": "QA-001",
        "requisito": "Inscrição",
        "descricao": "Validar e-mail corretamente preenchido",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "ALTA"
    })

    # =====================================================
    # QA-002 - E-mail inválido
    # =====================================================

    obtido = validar_email("atletaemail.com")
    esperado = False

    resultados.append({
        "id": "QA-002",
        "requisito": "Inscrição",
        "descricao": "Rejeitar e-mail inválido",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "ALTA"
    })

    # =====================================================
    # QA-003 - E-mail duplicado
    # =====================================================

    obtido = verificar_email_duplicado(
        "atleta1@email.com",
        emails_cadastrados
    )

    esperado = True

    resultados.append({
        "id": "QA-003",
        "requisito": "Inscrição",
        "descricao": "Detectar inscrição com e-mail duplicado",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "CRÍTICA"
    })

    # =====================================================
    # QA-004 - Login de participante cadastrado
    # =====================================================

    obtido = validar_login(
        "atleta1@email.com",
        emails_cadastrados
    )

    esperado = True

    resultados.append({
        "id": "QA-004",
        "requisito": "Área do participante",
        "descricao": "Permitir acesso de participante cadastrado",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "CRÍTICA"
    })

    # =====================================================
    # QA-005 - Login inexistente
    # =====================================================

    obtido = validar_login(
        "naocadastrado@email.com",
        emails_cadastrados
    )

    esperado = False

    resultados.append({
        "id": "QA-005",
        "requisito": "Área do participante",
        "descricao": "Bloquear e-mail não cadastrado",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "CRÍTICA"
    })

    # =====================================================
    # QA-006 - Quilometragem válida
    # =====================================================

    obtido = validar_quilometragem(5)
    esperado = True

    resultados.append({
        "id": "QA-006",
        "requisito": "Atividades",
        "descricao": "Aceitar quilometragem válida",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "ALTA"
    })

    # =====================================================
    # QA-007 - Quilometragem negativa
    # =====================================================

    obtido = validar_quilometragem(-5)
    esperado = False

    resultados.append({
        "id": "QA-007",
        "requisito": "Atividades",
        "descricao": "Bloquear quilometragem negativa",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "CRÍTICA"
    })

        # =====================================================
    # QA-008 - Cálculo de progresso
    # =====================================================

    obtido = calcular_progresso(
        50,
        100,
        simular_bug=simular_bug
    )

    esperado = 50.0

    resultados.append({
        "id": "QA-008",
        "requisito": "Progresso",
        "descricao": "Calcular percentual de progresso",
        "esperado": esperado,
        "obtido": obtido,
        "status": (
            "PASS"
            if obtido == esperado
            else "FAIL"
        ),
        "severidade": "CRÍTICA"
    })

    # =====================================================
    # QA-009 - Evidência da atividade
    # =====================================================

    obtido = validar_atividade(
        5,
        "strava_treino.jpg"
    )

    esperado = True

    resultados.append({
        "id": "QA-009",
        "requisito": "Atividades",
        "descricao": "Validar atividade com evidência",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "ALTA"
    })

    # =====================================================
    # QA-010 - Ranking
    # =====================================================

    participantes = [
        {
            "nome": "Atleta A",
            "km_percorrido": 30
        },
        {
            "nome": "Atleta B",
            "km_percorrido": 80
        },
        {
            "nome": "Atleta C",
            "km_percorrido": 50
        }
    ]

    ranking = ordenar_ranking(participantes)

    obtido = ranking[0]["nome"]
    esperado = "Atleta B"

    resultados.append({
        "id": "QA-010",
        "requisito": "Ranking",
        "descricao": "Ordenar ranking pela maior quilometragem",
        "esperado": esperado,
        "obtido": obtido,
        "status": "PASS" if obtido == esperado else "FAIL",
        "severidade": "MÉDIA"
    })

    return resultados