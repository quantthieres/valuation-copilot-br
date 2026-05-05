import React from "react";
import NavBar from "@/components/dashboard/NavBar";

// ─── Local layout components ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.8px",
      textTransform: "uppercase", color: "#94a3b8", marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function MethodologyCard({
  label,
  title,
  children,
}: {
  label?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
      overflow: "hidden", marginBottom: 16,
    }}>
      <div style={{
        padding: "14px 22px 12px",
        borderBottom: "1px solid #f1f5f9",
      }}>
        {label && (
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.7px",
            textTransform: "uppercase", color: "#94a3b8", marginBottom: 4,
          }}>
            {label}
          </div>
        )}
        <div style={{
          fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.2px",
        }}>
          {title}
        </div>
      </div>
      <div style={{ padding: "18px 22px" }}>
        {children}
      </div>
    </div>
  );
}

function FormulaBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6,
      padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12, color: "#0f172a", margin: "6px 0 10px",
      lineHeight: 1.9, overflowX: "auto",
    }}>
      {children}
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      margin: "0 0 12px", fontSize: 14, color: "#374151", lineHeight: 1.75,
    }}>
      {children}
    </p>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol style={{ margin: "0 0 4px", paddingLeft: 0, listStyle: "none" }}>
      {steps.map((step, i) => (
        <li key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "7px 0", borderBottom: i < steps.length - 1 ? "1px solid #f1f5f9" : "none",
        }}>
          <span style={{
            flexShrink: 0, width: 22, height: 22, borderRadius: 6,
            background: "#f1f5f9", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 11, fontWeight: 700,
            color: "#475569", fontFamily: "'JetBrains Mono', monospace",
          }}>
            {i + 1}
          </span>
          <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5, paddingTop: 3 }}>
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "flex", gap: 10, padding: "6px 0",
          borderBottom: i < items.length - 1 ? "1px solid #f8fafc" : "none",
          fontSize: 14, color: "#374151", lineHeight: 1.6,
        }}>
          <span style={{ color: "#94a3b8", flexShrink: 0, paddingTop: 1 }}>—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AssumptionRow({
  name,
  defaultVal,
  description,
}: {
  name: string;
  defaultVal: string;
  description: string;
}) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "180px 1fr",
      gap: 16, padding: "10px 0",
      borderBottom: "1px solid #f1f5f9", alignItems: "start",
    }}>
      <div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#0f172a",
          fontFamily: "'JetBrains Mono', monospace", marginBottom: 3,
        }}>
          {name}
        </div>
        <div style={{
          fontSize: 11, color: "#94a3b8",
        }}>
          Padrão WEGE3: {defaultVal}
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, paddingTop: 2 }}>
        {description}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MetodologiaPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <NavBar />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 64px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>Documentação · Valuation · DCF</SectionLabel>
          <h1 style={{
            margin: "0 0 10px", fontSize: 28, fontWeight: 800, color: "#0f172a",
            letterSpacing: "-0.6px", lineHeight: 1.2,
          }}>
            Metodologia de Valuation
          </h1>
          <p style={{
            margin: 0, fontSize: 15, color: "#64748b", lineHeight: 1.65, maxWidth: 620,
          }}>
            Entenda como o Valuation Copilot calcula o valor justo estimado das empresas
            analisadas. Este documento descreve o modelo, as fórmulas e as limitações
            da abordagem atual.
          </p>
        </div>

        {/* 1. Visão Geral */}
        <MethodologyCard label="Seção 1" title="Visão Geral">
          <Prose>
            O Valuation Copilot estima o valor justo de empresas listadas na B3 combinando
            quatro abordagens complementares:
          </Prose>
          <BulletList items={[
            "DCF — Fluxo de Caixa Descontado: modelo principal, que projeta os fluxos de caixa futuros e os desconta ao presente pelo custo de capital (WACC).",
            "Análise de sensibilidade: mapa bidimensional que mostra como o valor justo varia sob diferentes combinações de WACC e crescimento terminal.",
            "Múltiplos comparáveis: tabela com P/L, EV/EBITDA e EV/Receita de pares setoriais para contextualizar o preço relativo da empresa.",
            "Histórico financeiro: cinco anos de receita, EBITDA e fluxo de caixa livre como base empírica para as projeções.",
          ]} />
          <div style={{
            marginTop: 16, background: "#fefce8", border: "1px solid #fde68a",
            borderRadius: 8, padding: "10px 14px",
            fontSize: 12, color: "#92400e", lineHeight: 1.6,
          }}>
            <strong>Nota sobre o MVP:</strong> a versão atual utiliza dados financeiros
            ilustrativos para demonstração. As projeções e valores apresentados não
            refletem dados reais de mercado e não constituem recomendação de investimento.
          </div>
        </MethodologyCard>

        {/* 2. Modelo DCF */}
        <MethodologyCard label="Seção 2" title="Modelo DCF — Fluxo de Caixa Descontado">
          <Prose>
            O modelo DCF estima o valor intrínseco de uma empresa ao projetar seus fluxos
            de caixa livres futuros e trazê-los a valor presente com uma taxa de desconto
            que reflete o custo médio ponderado de capital (WACC). Ao final do período de
            projeção, um valor terminal captura todo o crescimento esperado a longo prazo.
          </Prose>
          <Prose>
            O modelo segue dez etapas sequenciais:
          </Prose>
          <StepList steps={[
            "Projetar a receita ano a ano, aplicando o CAGR definido pelo analista sobre a receita base (LTM).",
            "Estimar o EBIT de cada ano multiplicando a receita projetada pela margem EBIT.",
            "Calcular o NOPAT (lucro operacional líquido após impostos) aplicando a alíquota efetiva de IR/CS ao EBIT.",
            "Estimar a depreciação e amortização (D&A) como percentual da receita.",
            "Calcular o Capex como percentual da receita projetada.",
            "Estimar a variação do capital de giro (ΔCG) com base no incremento de receita.",
            "Calcular o Fluxo de Caixa Livre: NOPAT + D&A − Capex − ΔCapital de Giro.",
            "Descontar cada fluxo ao presente usando o fator (1 + WACC)^t.",
            "Calcular o Valor Terminal no ano final e trazê-lo a valor presente.",
            "Somar os fluxos descontados ao VP do Valor Terminal para obter o Enterprise Value; subtrair a dívida líquida e dividir pelo número de ações para chegar ao valor justo por ação.",
          ]} />
        </MethodologyCard>

        {/* 3. Fórmulas */}
        <MethodologyCard label="Seção 3" title="Fórmulas Principais">

          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
            Receita projetada
          </div>
          <FormulaBlock>
            Receita_t = Receita_(t-1) × (1 + CAGR)
          </FormulaBlock>

          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
            EBIT
          </div>
          <FormulaBlock>
            EBIT_t = Receita_t × Margem EBIT
          </FormulaBlock>

          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
            NOPAT
          </div>
          <FormulaBlock>
            NOPAT_t = EBIT_t × (1 − Alíquota efetiva de IR/CS)
          </FormulaBlock>

          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
            Fluxo de Caixa Livre (FCF)
          </div>
          <FormulaBlock>
            FCF_t = NOPAT_t + D&A_t − Capex_t − ΔCapital de Giro_t{"\n"}
            {"     "}onde:{"\n"}
            {"       "}D&A_t         = Receita_t × D&A%{"\n"}
            {"       "}Capex_t       = Receita_t × Capex%{"\n"}
            {"       "}ΔCG_t         = (Receita_t − Receita_(t-1)) × ΔCG%
          </FormulaBlock>

          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
            Valor Terminal
          </div>
          <FormulaBlock>
            Valor Terminal = FCF_final × (1 + g) / (WACC − g){"\n"}
            {"     "}condição: WACC {">"} g (crescimento terminal)
          </FormulaBlock>

          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
            Enterprise Value e Equity Value
          </div>
          <FormulaBlock>
            EV = Σ [FCF_t / (1 + WACC)^t] + Valor Terminal / (1 + WACC)^n{"\n"}
            Equity Value = EV − Dívida Líquida
          </FormulaBlock>

          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
            Valor justo por ação
          </div>
          <FormulaBlock>
            Valor justo por ação = Equity Value / Número de ações em circulação
          </FormulaBlock>
        </MethodologyCard>

        {/* 4. Premissas */}
        <MethodologyCard label="Seção 4" title="Premissas do Modelo">
          <Prose>
            O modelo depende de sete premissas editáveis pelo usuário. Cada uma influencia
            diretamente o valor justo calculado. A seguir, o significado prático de cada
            variável:
          </Prose>
          <div>
            <AssumptionRow
              name="CAGR Receita"
              defaultVal="10,0%"
              description="Taxa de crescimento anual composto da receita ao longo dos 10 anos de projeção. Reflete a expectativa de expansão orgânica e geográfica da empresa."
            />
            <AssumptionRow
              name="Margem EBIT"
              defaultVal="19,5%"
              description="Percentual da receita convertido em resultado operacional antes de juros e impostos. Representa a eficiência operacional e o poder de precificação da empresa."
            />
            <AssumptionRow
              name="Alíquota IR/CS"
              defaultVal="25,0%"
              description="Taxa efetiva de imposto de renda e contribuição social sobre o resultado operacional. No Brasil, a alíquota nominal é 34%, mas benefícios fiscais, JCP e incentivos regionais podem reduzi-la."
            />
            <AssumptionRow
              name="WACC"
              defaultVal="12,0%"
              description="Custo Médio Ponderado de Capital — taxa que reflete o retorno exigido por credores e acionistas, ponderado pela estrutura de capital. É a taxa de desconto central do modelo; quanto maior, menor o valor justo."
            />
            <AssumptionRow
              name="Crescimento Terminal (g)"
              defaultVal="4,0%"
              description="Taxa de crescimento perpétuo dos fluxos de caixa após o período de projeção. Geralmente alinhada à inflação de longo prazo ou ao PIB nominal esperado. Deve ser sempre inferior ao WACC."
            />
            <AssumptionRow
              name="Capex / Receita"
              defaultVal="3,8%"
              description="Percentual da receita destinado a investimentos em ativos fixos (instalações, máquinas, equipamentos). Empresas de capital intensivo têm Capex elevado; empresas de tecnologia e serviços, Capex reduzido."
            />
            <AssumptionRow
              name="ΔCG / Receita"
              defaultVal="1,2%"
              description="Variação do capital de giro (clientes + estoques − fornecedores) como percentual do incremento de receita. Captura o consumo de caixa necessário para financiar o crescimento operacional."
            />
          </div>
        </MethodologyCard>

        {/* 5. Sensibilidade */}
        <MethodologyCard label="Seção 5" title="Análise de Sensibilidade">
          <Prose>
            O WACC e o crescimento terminal são as duas premissas com maior impacto no
            valor justo calculado. Pequenas variações nessas variáveis podem mover o valor
            intrínseco em 20–40%, o que ilustra a incerteza inerente a qualquer modelo DCF.
          </Prose>
          <Prose>
            Para lidar com essa sensibilidade, o modelo gera uma matriz de cenários
            combinando diferentes valores de WACC (linhas) e crescimento terminal (colunas).
            Cada célula exibe o valor justo por ação correspondente àquele par de premissas.
          </Prose>
          <BulletList items={[
            "Células verdes indicam que o valor justo supera o preço atual — potencial de upside.",
            "Células vermelhas indicam que o valor justo está abaixo do preço atual — potencial de downside.",
            "A diagonal central representa o cenário-base com as premissas definidas pelo usuário.",
            "A análise evita apresentar o valuation como um número único e absoluto, expondo o intervalo plausível de valor.",
          ]} />
        </MethodologyCard>

        {/* 6. Múltiplos */}
        <MethodologyCard label="Seção 6" title="Múltiplos Comparáveis">
          <Prose>
            Além do DCF, o modelo exibe uma tabela de múltiplos de mercado de empresas
            comparáveis do mesmo setor. Os múltiplos funcionam como uma referência
            relativa — não são o motor principal de valuation, mas ajudam a calibrar
            se o DCF resulta em um preço que faz sentido no contexto do setor.
          </Prose>
          <Prose>
            Os múltiplos utilizados são:
          </Prose>
          <BulletList items={[
            "P/L (Preço sobre Lucro): quantas vezes o mercado está disposto a pagar pelo lucro anual da empresa. Útil para comparar empresas lucrativas dentro do mesmo setor.",
            "EV/EBITDA (Enterprise Value sobre EBITDA): compara o valor total da firma com sua geração operacional de caixa antes de depreciação e impostos. Amplamente usado em M&A e análise setorial.",
            "EV/Receita (Enterprise Value sobre Receita): compara o valor da firma com a receita bruta. Relevante para empresas de alto crescimento ou margens ainda em expansão.",
          ]} />
          <Prose>
            Comparáveis bem escolhidos ajudam a identificar se a empresa negocia com
            prêmio ou desconto em relação a pares, sem exigir projeções de longo prazo.
          </Prose>
        </MethodologyCard>

        {/* 7. Limitações */}
        <MethodologyCard label="Seção 7" title="Limitações do Modelo">
          <Prose>
            Todo modelo de valuation é uma simplificação da realidade. O usuário deve
            estar ciente das seguintes limitações:
          </Prose>
          <BulletList items={[
            "Os dados financeiros desta versão MVP são ilustrativos. Os valores apresentados não refletem demonstrações financeiras reais e não devem ser usados para decisões de investimento.",
            "O valor justo é altamente sensível às premissas de WACC e crescimento terminal. Mudanças pequenas nessas variáveis produzem grandes variações no resultado.",
            "O modelo assume crescimento constante ao longo dos 10 anos projetados, o que raramente ocorre na prática. Ciclos econômicos, disrupções setoriais e mudanças regulatórias não são capturados.",
            "Empresas de setores distintos podem exigir modelos diferentes. O DCF tradicional é mais adequado para empresas industriais, de consumo e utilidades; pode ser menos preciso para empresas de crescimento acelerado, turnarounds ou negócios em fase pré-receita.",
            "Bancos, seguradoras, FIIs e outras instituições financeiras geralmente requerem modelos específicos (Dividend Discount Model, Excess Return Model) que não estão implementados nesta versão.",
            "O modelo não incorpora prêmios de controle, descontos por iliquidez nem ajustes por governança corporativa.",
            "A plataforma não fornece recomendações de investimento, não substitui análise profissional independente e não é registrada como serviço de consultoria de valores mobiliários.",
          ]} />
        </MethodologyCard>

        {/* 8. Aviso Legal */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "10px 22px",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.7px",
            textTransform: "uppercase" as const, color: "#94a3b8",
          }}>
            Aviso Legal
          </div>
          <div style={{ padding: "18px 22px" }}>
            <p style={{
              margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.75,
            }}>
              Este projeto tem finalidade educacional e demonstrativa. As informações
              apresentadas não constituem recomendação de investimento, oferta de compra
              ou venda de valores mobiliários, nem substituem análise profissional
              independente. Investimentos em renda variável envolvem riscos e podem
              resultar em perdas. Consulte um profissional certificado antes de tomar
              decisões de investimento.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
