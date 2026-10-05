import sys

from casos_teste import executar_testes
from gerador_relatorio import gerar_relatorio


def main():

    # =====================================================
    # MODO DE EXECUÇÃO
    # =====================================================

    simular_bug = "--bug" in sys.argv

    print("=" * 60)
    print(" DESAFIO VIRTUAL - AUTOMAÇÃO DE TESTES QA")
    print("=" * 60)

    if simular_bug:

        print()
        print("⚠ MODO DE DEMONSTRAÇÃO DE BUG ATIVADO")
        print(
            "Um defeito proposital foi introduzido "
            "no cálculo de progresso."
        )

    else:

        print()
        print("✓ EXECUÇÃO NORMAL DO SISTEMA")

    # =====================================================
    # EXECUÇÃO DOS TESTES
    # =====================================================

    resultados = executar_testes(
        simular_bug=simular_bug
    )

    total = len(resultados)

    aprovados = sum(
        1
        for teste in resultados
        if teste["status"] == "PASS"
    )

    falhas = total - aprovados

    falhas_criticas = sum(
        1
        for teste in resultados
        if (
            teste["status"] == "FAIL"
            and teste["severidade"] == "CRÍTICA"
        )
    )

    taxa = (
        aprovados / total * 100
        if total > 0
        else 0
    )

    # =====================================================
    # RESULTADOS
    # =====================================================

    print()

    for teste in resultados:

        print(
            f'{teste["id"]} | '
            f'{teste["status"]:<4} | '
            f'{teste["descricao"]}'
        )

        if teste["status"] == "FAIL":

            print(
                f'        Esperado: '
                f'{teste["esperado"]}'
            )

            print(
                f'        Obtido:   '
                f'{teste["obtido"]}'
            )

            print(
                f'        Severidade: '
                f'{teste["severidade"]}'
            )

    # =====================================================
    # MÉTRICAS
    # =====================================================

    print()
    print("-" * 60)

    print(
        f"Total de testes: {total}"
    )

    print(
        f"Aprovados: {aprovados}"
    )

    print(
        f"Falharam: {falhas}"
    )

    print(
        f"Taxa de aprovação: {taxa:.1f}%"
    )

    print(
        f"Falhas críticas: {falhas_criticas}"
    )

    print("-" * 60)

    # =====================================================
    # DECISÃO FINAL DE QA
    # =====================================================

    if falhas_criticas > 0:

        decisao = "NÃO LIBERAR"

    elif falhas > 0:

        decisao = "LIBERADO COM RESSALVAS"

    else:

        decisao = "LIBERADO"

    print()
    print(
        f"DECISÃO FINAL DE QA: {decisao}"
    )

    # =====================================================
    # RELATÓRIO
    # =====================================================

    metricas = {
        "total": total,
        "aprovados": aprovados,
        "falhas": falhas,
        "taxa": taxa,
        "falhas_criticas": falhas_criticas
    }

    arquivo = gerar_relatorio(
        resultados,
        metricas,
        decisao,
        simular_bug=simular_bug
)

    print()
    print(
        f"Relatório gerado: {arquivo}"
    )

    print()


if __name__ == "__main__":
    main()