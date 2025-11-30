// ========= GLOBAL CHART STYLE & CONFIG =========
Chart.defaults.font.family = "'Poppins', 'Inter', sans-serif";
Chart.defaults.color = "#666";
Chart.defaults.animation = {
    duration: 1000,
    easing: "easeOutQuart"
};

// Color Palette (Professional Gradients)
const colors = {
    primary: "#1e3a5f",
    secondary: "#00bcd4",
    accent: "#64b5f6",
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    neutral: "#e0e4e8"
};

// Diagnosis label mapping
const diagnosisMap = {
    "0": "No Dementia",
    "1": "Dementia"
};

async function fetchJson(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Fetch failed: ${url}`);
    return await r.json();
}

function gradient(ctx, c1, c2) {
    const g = ctx.createLinearGradient(0, 0, 0, 300);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
}

function horizontalGradient(ctx, c1, c2) {
    const g = ctx.createLinearGradient(0, 0, 400, 0);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
}

function elegantBar(ctx, labels, data, label, c1, c2) {
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: (e) => gradient(e.chart.ctx, c1, c2),
                borderRadius: 12,
                borderSkipped: false,
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: colors.primary,
                    padding: 12,
                    titleFont: { size: 14, weight: 600 },
                    bodyFont: { size: 13 },
                    borderColor: colors.secondary,
                    borderWidth: 1
                }
            },
            scales: {
                x: { 
                    grid: { display: false },
                    ticks: { font: { size: 12, weight: 500 } }
                },
                y: { 
                    grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
                    ticks: { font: { size: 12 } }
                }
            }
        }
    });
}

function elegantRadar(ctx, labels, datasets) {
    // Assign colors to datasets
    const dsColors = [
        { border: colors.secondary, bg: "rgba(0, 188, 212, 0.1)" },
        { border: colors.primary, bg: "rgba(30, 58, 95, 0.1)" }
    ];

    datasets.forEach((ds, i) => {
        ds.borderColor = dsColors[i]?.border || colors.accent;
        ds.backgroundColor = dsColors[i]?.bg || "rgba(100, 181, 246, 0.1)";
        ds.borderWidth = 2;
        ds.pointBackgroundColor = dsColors[i]?.border || colors.accent;
        ds.pointBorderColor = "#fff";
        ds.pointBorderWidth = 2;
        ds.pointRadius = 5;
        ds.pointHoverRadius = 7;
    });

    return new Chart(ctx, {
        type: "radar",
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    labels: { font: { size: 12, weight: 500 }, padding: 15 }
                },
                tooltip: {
                    backgroundColor: colors.primary,
                    padding: 12,
                    titleFont: { size: 13, weight: 600 },
                    bodyFont: { size: 12 },
                    borderColor: colors.secondary,
                    borderWidth: 1
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: { color: "rgba(0,0,0,0.08)" },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// ============ MAIN LOADER ============

document.addEventListener("DOMContentLoaded", () => {
    // helper to show a top-level error message
    function showDashboardError(msg) {
        const el = document.getElementById('dashboardError');
        if (!el) return console.error('dashboardError element missing:', msg);
        el.style.display = 'block';
        el.textContent = msg;
    }

    (async function loadAll() {
        try {
            // ---- SUMMARY ----
            try {
                const summary = await fetchJson("http://192.168.1.6:5000/api/summary");
                const s = document.getElementById("summary-cards");
                if (s) {
                    s.innerHTML = `
                        <div class="summ-card">
                            <div>👥</div>
                            <div>${summary.total}</div>
                            <span>Total Patients</span>
                        </div>
                        <div class="summ-card">
                            <div>🏥</div>
                            <div>${summary.percent_alzheimer}%</div>
                            <span>Alzheimer %</span>
                        </div>
                        <div class="summ-card">
                            <div>📅</div>
                            <div>${summary.mean_age}</div>
                            <span>Mean Age</span>
                        </div>
                        <div class="summ-card">
                            <div>⚖️</div>
                            <div style="font-size: 1.2rem;">
                                <div class="gender-row male">M: ${summary.gender_male}%</div>
                                <div class="gender-row female">F: ${summary.gender_female}%</div>
                            </div>
                            <span>Gender Ratio</span>
                        </div>
                    `;
                }
            } catch (e) {
                console.warn('summary fetch failed', e);
            }

            // ---- DIAGNOSIS COUNT ----
            try {
                const diag = await fetchJson("http://192.168.1.6:5000/api/diagnosis_counts");
                const el = document.getElementById("diagnosisChart");
                if (el && diag && diag.labels && diag.values) {
                    elegantBar(el.getContext("2d"), diag.labels, diag.values, "Diagnosis Distribution", "#4CC9F0", "#4895EF");
                } else console.warn('diagnosisChart skipped - missing element or data', el, diag);
            } catch (e) {
                console.warn('diagnosis_counts failed', e);
            }

            // ---- AGE ----
            try {
                const age = await fetchJson("http://192.168.1.6:5000/api/age_distribution");
                const el = document.getElementById("ageChart");
                if (el && age && age.labels && age.counts) {
                    elegantBar(el.getContext("2d"), age.labels, age.counts, "Age Distribution", "#80ED99", "#38A3A5");
                } else console.warn('ageChart skipped - missing element or data', el, age);
            } catch (e) {
                console.warn('age_distribution failed', e);
            }

            // ---- BMI ----
            try {
                const bmi = await fetchJson("http://192.168.1.6:5000/api/bmi_stats");
                const el = document.getElementById("bmiChart");
                if (el && bmi && Object.keys(bmi).length) {
                    const bmiLabels = Object.keys(bmi).map(k => diagnosisMap[k] || k);
                    const bmiMeans = Object.keys(bmi).map(k => bmi[k].mean);
                    elegantBar(el.getContext("2d"), bmiLabels, bmiMeans, "Mean BMI", "#FFB703", "#FB8500");
                } else console.warn('bmiChart skipped - missing element or data', el, bmi);
            } catch (e) {
                console.warn('bmi_stats failed', e);
            }

            // ---- EDUCATION ----
            try {
                const edu = await fetchJson("http://192.168.1.6:5000/api/education_vs_diagnosis");
                const el = document.getElementById("eduChart");
                if (el && edu && edu.labels) {
                    new Chart(el.getContext("2d"), {
                        type: "bar",
                        data: {
                            labels: edu.labels,
                            datasets: [
                                { label: "No Dementia", data: edu.no_dementia || [], backgroundColor: "#4CC9F0" },
                                { label: "Dementia", data: edu.dementia || [], backgroundColor: "#F72585" }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: { x: { stacked: true }, y: { stacked: true } }
                        }
                    });
                } else console.warn('eduChart skipped - missing element or data', el, edu);
            } catch (e) {
                console.warn('education_vs_diagnosis failed', e);
            }

            // ---- SMOKING ----
            try {
                const smoke = await fetchJson("http://192.168.1.6:5000/api/smoking_by_diag");
                const el = document.getElementById("smokeChart");
                if (el && smoke && Object.keys(smoke).length) {
                    const smokeLabels = Object.keys(smoke).map(k => diagnosisMap[k] || k);
                    const smokeValues = Object.keys(smoke).map(k => smoke[k]);
                    elegantBar(el.getContext("2d"), smokeLabels, smokeValues, "Smoking (mean)", "#72EFDD", "#56CFE1");
                } else console.warn('smokeChart skipped - missing element or data', el, smoke);
            } catch (e) {
                console.warn('smoking_by_diag failed', e);
            }

            // ---- ALCOHOL ----
            try {
                const alc = await fetchJson("http://192.168.1.6:5000/api/alcohol_stats");
                const el = document.getElementById("alcoholChart");
                if (el && alc && Object.keys(alc).length) {
                    const alcLabels = Object.keys(alc).map(k => diagnosisMap[k] || k);
                    const alcMeds = Object.keys(alc).map(k => alc[k].median);
                    elegantBar(el.getContext("2d"), alcLabels, alcMeds, "Alcohol (median)", "#FFAFCC", "#FF8FA3");
                } else console.warn('alcoholChart skipped - missing element or data', el, alc);
            } catch (e) {
                console.warn('alcohol_stats failed', e);
            }

            // ---- ACTIVITY ----
            try {
                const act = await fetchJson("http://192.168.1.6:5000/api/activity_by_diag");
                const el = document.getElementById("activityChart");
                if (el && act && Object.keys(act).length) {
                    const actLabels = Object.keys(act).map(k => diagnosisMap[k] || k);
                    const actValues = Object.keys(act).map(k => act[k]);
                    elegantBar(el.getContext("2d"), actLabels, actValues, "Physical Activity", "#B5E48C", "#76C893");
                } else console.warn('activityChart skipped - missing element or data', el, act);
            } catch (e) {
                console.warn('activity_by_diag failed', e);
            }

            // ---- COGNITIVE ----
            try {
                const cognitive = await fetchJson("http://192.168.1.6:5000/api/cognitive_stats");
                const el = document.getElementById("mmseChart");
                if (el && cognitive && Object.keys(cognitive).length) {
                    const mmseLabels = Object.keys(cognitive).map(k => diagnosisMap[k] || k);
                    const mmseMeans = Object.keys(cognitive).map(k => cognitive[k]["MMSE"].mean);
                    elegantBar(el.getContext("2d"), mmseLabels, mmseMeans, "MMSE Mean", "#3A86FF", "#8338EC");
                } else console.warn('mmseChart skipped - missing element or data', el, cognitive);
            } catch (e) {
                console.warn('cognitive_stats failed', e);
            }

            // ---- RADAR ----
            try {
                const radar = await fetchJson("http://192.168.1.6:5000/api/radar_data");
                const el = document.getElementById("radarChart");
                if (el && radar && radar.labels && radar.datasets) {
                    elegantRadar(el.getContext("2d"), radar.labels, radar.datasets);
                } else console.warn('radarChart skipped - missing element or data', el, radar);
            } catch (e) {
                console.warn('radar_data failed', e);
            }

            // ---- CORRELATION (Top 5 by absolute value) ----
            try {
                const corr = await fetchJson("http://192.168.1.6:5000/api/correlation_diagnosis");
                if (corr && corr.features && corr.values) {
                    let pairs = corr.features.map((f, i) => ({ feature: f, value: corr.values[i] }));
                    pairs.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
                    const top5 = pairs.slice(0, 5);
                    let html = `
                    <table class="corr">
                        <tr><th>Feature</th><th>Correlation</th></tr>
                    `;
                    top5.forEach(p => {
                        const v = p.value;
                        const color = v > 0 ? `rgba(255, 99, 132, ${Math.abs(v)})` : `rgba(54, 162, 235, ${Math.abs(v)})`;
                        html += `
                            <tr>
                                <td>${p.feature}</td>
                                <td style="background:${color}; color:white; font-weight:600;">${v}</td>
                            </tr>
                        `;
                    });
                    html += "</table>";
                    const ct = document.getElementById("corrTable");
                    if (ct) ct.innerHTML = html;
                } else console.warn('corrTable skipped - missing corr data', corr);
            } catch (e) {
                console.warn('correlation_diagnosis failed', e);
            }

        } catch (err) {
            console.error('Dashboard load failed', err);
            showDashboardError('Failed to load dashboard data — check backend is running and open DevTools → Network for details.');
        }
    })();

});
