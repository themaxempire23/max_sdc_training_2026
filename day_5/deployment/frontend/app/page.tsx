"use client";

import Image from "next/image";
import { CSSProperties, useMemo, useState } from "react";

type FieldKey = "income" | "age" | "loan_amount" | "credit_score" | "existing_debt";
type Applicant = Record<FieldKey, number>;

type Prediction = {
  decision: "Approved" | "Declined";
  approved: boolean;
  confidence: number;
  approval_probability: number;
  explanation: Record<FieldKey, number>;
  model_version: string;
};

type Field = {
  key: FieldKey;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  money?: boolean;
  suffix?: string;
};

const fields: Field[] = [
  { key: "income", label: "Annual income", hint: "Gross income per year", min: 15000, max: 120000, step: 1000, money: true },
  { key: "age", label: "Applicant age", hint: "Age at application", min: 21, max: 65, step: 1, suffix: " years" },
  { key: "loan_amount", label: "Requested loan", hint: "Total amount requested", min: 5000, max: 80000, step: 1000, money: true },
  { key: "credit_score", label: "Credit score", hint: "Model range: 300–850", min: 300, max: 850, step: 5 },
  { key: "existing_debt", label: "Existing debt", hint: "Outstanding debt balance", min: 0, max: 50000, step: 500, money: true },
];

const initialApplicant: Applicant = {
  income: 65000,
  age: 34,
  loan_amount: 25000,
  credit_score: 690,
  existing_debt: 8000,
};

const scenarios: Array<{ label: string; description: string; values: Applicant }> = [
  {
    label: "Strong profile",
    description: "High score, low debt",
    values: { income: 98000, age: 38, loan_amount: 20000, credit_score: 760, existing_debt: 3000 },
  },
  {
    label: "Typical profile",
    description: "Balanced application",
    values: initialApplicant,
  },
  {
    label: "Stretched profile",
    description: "Higher loan and debt",
    values: { income: 38000, age: 28, loan_amount: 55000, credit_score: 570, existing_debt: 18000 },
  },
];

const names: Record<FieldKey, string> = {
  income: "Annual income",
  age: "Applicant age",
  loan_amount: "Requested loan",
  credit_score: "Credit score",
  existing_debt: "Existing debt",
};

function formatMoney(value: number) {
  return `N$ ${Math.round(value).toLocaleString("en-NA")}`;
}

function formatField(value: number, field: Field) {
  return field.money ? formatMoney(value) : `${value.toLocaleString("en-NA")}${field.suffix ?? ""}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Home() {
  const [applicant, setApplicant] = useState<Applicant>(initialApplicant);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [term, setTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(10.5);

  const drivers = useMemo(() => {
    if (!prediction) return [];
    return Object.entries(prediction.explanation)
      .map(([key, value]) => ({ key: key as FieldKey, value }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [prediction]);

  const maxDriver = Math.max(...drivers.map((driver) => Math.abs(driver.value)), 0.001);
  const debtToIncome = applicant.income ? (applicant.existing_debt / applicant.income) * 100 : 0;
  const totalExposure = applicant.existing_debt + applicant.loan_amount;
  const exposureToIncome = applicant.income ? (totalExposure / applicant.income) * 100 : 0;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? applicant.loan_amount / term
    : applicant.loan_amount * (monthlyRate * (1 + monthlyRate) ** term) / ((1 + monthlyRate) ** term - 1);

  const comparison = [
    { label: "Annual income", value: applicant.income, tone: "navy" },
    { label: "Requested loan", value: applicant.loan_amount, tone: "gold" },
    { label: "Existing debt", value: applicant.existing_debt, tone: "red" },
    { label: "Total exposure", value: totalExposure, tone: "slate" },
  ];
  const comparisonMax = Math.max(...comparison.map((item) => item.value), 1);

  function updateField(key: FieldKey, value: number) {
    setApplicant((current) => ({ ...current, [key]: value }));
    if (prediction) setDirty(true);
  }

  async function assess(values: Applicant = applicant) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Assessment failed");
      setPrediction(data);
      setDirty(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Assessment failed");
    } finally {
      setLoading(false);
    }
  }

  function applyScenario(values: Applicant) {
    setApplicant(values);
    setPrediction(null);
    setDirty(false);
    void assess(values);
  }

  function reset() {
    setApplicant(initialApplicant);
    setPrediction(null);
    setDirty(false);
    setError("");
    setTerm(36);
    setInterestRate(10.5);
  }

  const probability = prediction ? prediction.approval_probability * 100 : 0;
  const gaugeStyle = { "--score": probability } as CSSProperties;

  return (
    <main>
      <div className="brandRule" />
      <header className="institutionHeader">
        <div className="headerInner">
          <Image
            className="nustLogo"
            src="/nust-logo.png"
            alt="Namibia University of Science and Technology"
            width={338}
            height={70}
            priority
          />
          <div className="moduleMeta">
            <span>Data Science Practical</span>
            <strong>Day 5 · Model deployment</strong>
          </div>
        </div>
      </header>

      <section className="pageHeading">
        <div>
          <p className="overline">Namibia University of Science and Technology</p>
          <h1>Loan eligibility explorer</h1>
          <p className="lede">Adjust an applicant profile, run the teaching model and inspect what influenced its result.</p>
        </div>
        <div className="headerActions">
          <button className="textButton" type="button" onClick={reset}>Reset</button>
          <button className="textButton" type="button" onClick={() => window.print()}>Print summary</button>
        </div>
      </section>

      <section className="scenarioStrip" aria-label="Example applicant profiles">
        <div className="scenarioIntro">
          <strong>Try an example</strong>
          <span>Loads and assesses a complete profile</span>
        </div>
        {scenarios.map((scenario) => (
          <button key={scenario.label} type="button" onClick={() => applyScenario(scenario.values)} disabled={loading}>
            <span>{scenario.label}</span>
            <small>{scenario.description}</small>
          </button>
        ))}
      </section>

      <div className="dashboard">
        <section className="panel inputsPanel">
          <div className="panelHeading">
            <div>
              <span className="stepLabel">Application inputs</span>
              <h2>Applicant profile</h2>
            </div>
            <span className="rangeNote">Training ranges enforced</span>
          </div>

          <div className="fields">
            {fields.map((field) => {
              const progress = ((applicant[field.key] - field.min) / (field.max - field.min)) * 100;
              return (
                <div className="field" key={field.key}>
                  <div className="fieldHeader">
                    <div>
                      <label htmlFor={`${field.key}-number`}>{field.label}</label>
                      <span>{field.hint}</span>
                    </div>
                    <input
                      id={`${field.key}-number`}
                      className="numberInput"
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={applicant[field.key]}
                      aria-label={`${field.label} value`}
                      onChange={(event) => updateField(field.key, Number(event.target.value))}
                      onBlur={(event) => updateField(field.key, clamp(Number(event.target.value), field.min, field.max))}
                    />
                  </div>
                  <div className="currentValue">{formatField(applicant[field.key], field)}</div>
                  <input
                    className="rangeInput"
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={applicant[field.key]}
                    style={{ "--progress": `${progress}%` } as CSSProperties}
                    aria-label={field.label}
                    onChange={(event) => updateField(field.key, Number(event.target.value))}
                  />
                  <div className="rangeLabels">
                    <span>{formatField(field.min, field)}</span>
                    <span>{formatField(field.max, field)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="assessButton" type="button" onClick={() => assess()} disabled={loading}>
            <span>{loading ? "Running model…" : prediction ? "Update assessment" : "Run assessment"}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
          </button>
          {dirty && <p className="updateNotice">Inputs changed. Update the assessment to refresh the model result.</p>}
          {error && <p className="error" role="alert">{error}</p>}
        </section>

        <div className="analysisColumn">
          <section className="panel resultPanel" aria-live="polite">
            <div className="panelHeading">
              <div>
                <span className="stepLabel">Model output</span>
                <h2>Eligibility result</h2>
              </div>
              <span className="modelBadge">{prediction ? `Model v${prediction.model_version}` : "Awaiting assessment"}</span>
            </div>

            {!prediction ? (
              <div className="resultEmpty">
                <div className="emptyGauge"><span>—</span></div>
                <div>
                  <h3>No result yet</h3>
                  <p>Run the model or select an example profile. The result and its strongest drivers will appear here.</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`resultSummary ${prediction.approved ? "isApproved" : "isDeclined"}`}>
                  <div className="decisionCopy">
                    <span>Model decision</span>
                    <h3>{prediction.decision}</h3>
                    <p>{prediction.confidence.toFixed(1)}% confidence in this classification</p>
                  </div>
                  <div className="gauge" style={gaugeStyle} role="img" aria-label={`${probability.toFixed(1)} percent approval probability`}>
                    <svg viewBox="0 0 128 128" aria-hidden="true">
                      <circle className="gaugeTrack" cx="64" cy="64" r="52" />
                      <circle className="gaugeValue" cx="64" cy="64" r="52" pathLength="100" />
                    </svg>
                    <div><strong>{probability.toFixed(1)}%</strong><span>approval</span></div>
                  </div>
                </div>

                <div className="chartBlock">
                  <div className="chartHeading">
                    <div>
                      <h3>Model contribution by factor</h3>
                      <p>Signed contribution to the approval log-odds</p>
                    </div>
                    <div className="factorLegend"><span><i className="againstDot" />Against</span><span><i className="forDot" />In favour</span></div>
                  </div>
                  <div className="driverChart">
                    {drivers.map((driver) => {
                      const width = `${(Math.abs(driver.value) / maxDriver) * 50}%`;
                      return (
                        <div className="driverRow" key={driver.key}>
                          <span>{names[driver.key]}</span>
                          <div className="driverPlot">
                            <i className="zeroLine" />
                            <i className={driver.value >= 0 ? "forBar" : "againstBar"} style={{ width }} />
                          </div>
                          <strong>{driver.value >= 0 ? "+" : ""}{driver.value.toFixed(2)}</strong>
                        </div>
                      );
                    })}
                  </div>
                  <div className="axisLabels"><span>Against approval</span><span>0</span><span>In favour of approval</span></div>
                </div>
              </>
            )}
          </section>

          <section className="panel planningPanel">
            <div className="panelHeading compact">
              <div>
                <span className="stepLabel">Live planning view</span>
                <h2>Affordability overview</h2>
              </div>
              <span className="rangeNote">Updates as inputs change</span>
            </div>

            <div className="metricStrip">
              <div><span>Debt / income</span><strong>{debtToIncome.toFixed(1)}%</strong></div>
              <div><span>Total exposure</span><strong>{formatMoney(totalExposure)}</strong></div>
              <div><span>Exposure / income</span><strong>{exposureToIncome.toFixed(1)}%</strong></div>
            </div>

            <div className="planningGrid">
              <div className="comparisonChart">
                <div className="chartHeading simple">
                  <div><h3>Amounts compared</h3><p>Current applicant values in Namibian dollars</p></div>
                </div>
                {comparison.map((item) => (
                  <div className="comparisonRow" key={item.label}>
                    <div><span>{item.label}</span><strong>{formatMoney(item.value)}</strong></div>
                    <div className="comparisonTrack"><i className={item.tone} style={{ width: `${(item.value / comparisonMax) * 100}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="repaymentTool">
                <div className="chartHeading simple">
                  <div><h3>Repayment estimate</h3><p>Illustrative equal monthly instalment</p></div>
                </div>
                <div className="paymentValue"><span>Estimated monthly payment</span><strong>{formatMoney(monthlyPayment)}</strong></div>
                <label className="miniControl">
                  <span><b>Interest rate</b><strong>{interestRate.toFixed(1)}%</strong></span>
                  <input type="range" min="5" max="20" step="0.5" value={interestRate} onChange={(event) => setInterestRate(Number(event.target.value))} />
                </label>
                <div className="termControl">
                  <span>Loan term</span>
                  <div>{[12, 24, 36, 48, 60].map((months) => <button className={term === months ? "active" : ""} type="button" key={months} onClick={() => setTerm(months)}>{months}m</button>)}</div>
                </div>
                <p className="estimateNote">Planning estimate only; fees and lender-specific charges are excluded.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="siteFooter">
        <span>Namibia University of Science and Technology · Data Science Practical</span>
        <span>Educational model only — not for real lending decisions</span>
      </footer>
    </main>
  );
}
