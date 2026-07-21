from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


FEATURES = ["income", "age", "loan_amount", "credit_score", "existing_debt"]
MODEL_VERSION = "1.0.0"


def generate_dataset(rows=4000, random_state=42):
    rng = np.random.default_rng(random_state)

    data = pd.DataFrame({
        "income": rng.integers(15_000, 120_001, rows),
        "age": rng.integers(21, 66, rows),
        "loan_amount": rng.integers(5_000, 80_001, rows),
        "credit_score": rng.integers(300, 851, rows),
        "existing_debt": rng.integers(0, 50_001, rows),
    })

    score = (
        0.27 * (data["income"] - 15_000) / 105_000
        + 0.08 * (data["age"] - 21) / 44
        + 0.13 * (1 - (data["loan_amount"] - 5_000) / 75_000)
        + 0.38 * (data["credit_score"] - 300) / 550
        + 0.14 * (1 - data["existing_debt"] / 50_000)
    )
    noisy_score = score + rng.normal(0, 0.035, rows)
    data["approved"] = (noisy_score >= 0.52).astype(int)
    return data


def train_model(output_path, random_state=42):
    data = generate_dataset(random_state=random_state)
    X_train, X_test, y_train, y_test = train_test_split(
        data[FEATURES],
        data["approved"],
        test_size=0.20,
        random_state=random_state,
        stratify=data["approved"],
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(max_iter=1000, random_state=random_state)),
    ])
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)[:, 1]
    metrics = {
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, probabilities)), 4),
        "training_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "approval_rate": round(float(data["approved"].mean()), 4),
    }

    bundle = {
        "model": pipeline,
        "features": FEATURES,
        "metrics": metrics,
        "version": MODEL_VERSION,
    }

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, output_path)
    return bundle, data


if __name__ == "__main__":
    model_path = Path(__file__).parent / "model" / "loan_model.joblib"
    trained_bundle, _ = train_model(model_path)
    print(f"Saved model to {model_path.resolve()}")
    print("Metrics:", trained_bundle["metrics"])
