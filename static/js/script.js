document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("predictionForm");
    const resultSection = document.getElementById("resultSection");
    const predictionValue = document.getElementById("predictionValue");
    const performanceLabel = document.getElementById("performanceLabel");
    const progressCircle = document.getElementById("progressCircle");
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("errorMessage");

    // --------------------------------------------------
    // Prediction Form
    // --------------------------------------------------

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            hideError();
            showLoading();

            const formData = new FormData(form);

            const data = {
                Hours_Studied: formData.get("Hours_Studied"),
                Attendance: formData.get("Attendance"),
                Parental_Involvement: formData.get("Parental_Involvement"),
                Access_to_Resources: formData.get("Access_to_Resources"),
                Extracurricular_Activities: formData.get("Extracurricular_Activities"),
                Sleep_Hours: formData.get("Sleep_Hours"),
                Previous_Scores: formData.get("Previous_Scores"),
                Motivation_Level: formData.get("Motivation_Level"),
                Internet_Access: formData.get("Internet_Access"),
                Tutoring_Sessions: formData.get("Tutoring_Sessions"),
                Family_Income: formData.get("Family_Income"),
                Teacher_Quality: formData.get("Teacher_Quality"),
                School_Type: formData.get("School_Type"),
                Peer_Influence: formData.get("Peer_Influence"),
                Physical_Activity: formData.get("Physical_Activity"),
                Learning_Disabilities: formData.get("Learning_Disabilities"),
                Parental_Education_Level: formData.get("Parental_Education_Level"),
                Distance_from_Home: formData.get("Distance_from_Home"),
                Gender: formData.get("Gender")
            };

            try {

                const response = await fetch("/predict", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Prediction failed.");
                }

                if (result.prediction === undefined) {
                    throw new Error("Invalid prediction received from server.");
                }

                displayPrediction(result.prediction);

            } catch (error) {

                console.error("Prediction Error:", error);

                showError(
                    error.message ||
                    "Something went wrong. Please check your inputs and try again."
                );

            } finally {
                hideLoading();
            }
        });
    }


    // --------------------------------------------------
    // Display Prediction
    // --------------------------------------------------

    function displayPrediction(score) {

        score = Number(score);

        if (isNaN(score)) {
            showError("Invalid prediction value.");
            return;
        }

        score = Math.max(0, Math.min(100, score));

        if (resultSection) {
            resultSection.classList.remove("hidden");

            setTimeout(() => {
                resultSection.classList.add("show");
            }, 50);
        }

        animateScore(score);

        updatePerformanceLabel(score);

        updateProgressCircle(score);

        // Scroll smoothly to result
        if (resultSection) {
            setTimeout(() => {
                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }, 200);
        }
    }


    // --------------------------------------------------
    // Score Animation
    // --------------------------------------------------

    function animateScore(targetScore) {

        if (!predictionValue) return;

        let current = 0;
        const duration = 1200;
        const startTime = performance.now();

        function update(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            // Smooth ease-out animation
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            current = targetScore * easedProgress;

            predictionValue.textContent =
                current.toFixed(1);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                predictionValue.textContent =
                    targetScore.toFixed(1);
            }
        }

        requestAnimationFrame(update);
    }


    // --------------------------------------------------
    // Performance Category
    // --------------------------------------------------

    function updatePerformanceLabel(score) {

        if (!performanceLabel) return;

        let label = "";

        if (score >= 90) {
            label = "Outstanding Performance 🌟";
        }
        else if (score >= 80) {
            label = "Excellent Performance 🚀";
        }
        else if (score >= 70) {
            label = "Very Good Performance 👍";
        }
        else if (score >= 60) {
            label = "Good Performance ✅";
        }
        else if (score >= 50) {
            label = "Average Performance 📚";
        }
        else {
            label = "Needs Improvement 💪";
        }

        performanceLabel.textContent = label;
    }


    // --------------------------------------------------
    // Progress Circle
    // --------------------------------------------------

    function updateProgressCircle(score) {

        if (!progressCircle) return;

        const circumference = 440;

        const offset =
            circumference -
            (score / 100) * circumference;

        progressCircle.style.strokeDasharray =
            circumference;

        progressCircle.style.strokeDashoffset =
            circumference;

        setTimeout(() => {
            progressCircle.style.strokeDashoffset =
                offset;
        }, 100);
    }


    // --------------------------------------------------
    // Loading Animation
    // --------------------------------------------------

    function showLoading() {

        if (loading) {
            loading.classList.remove("hidden");
        }
    }

    function hideLoading() {

        if (loading) {
            loading.classList.add("hidden");
        }
    }


    // --------------------------------------------------
    // Error Handling
    // --------------------------------------------------

    function showError(message) {

        if (!errorMessage) {
            alert(message);
            return;
        }

        errorMessage.textContent = message;

        errorMessage.classList.remove("hidden");

        setTimeout(() => {
            errorMessage.classList.add("show");
        }, 50);
    }

    function hideError() {

        if (!errorMessage) return;

        errorMessage.classList.remove("show");

        setTimeout(() => {
            errorMessage.classList.add("hidden");
        }, 200);
    }


    // --------------------------------------------------
    // Input Validation
    // --------------------------------------------------

    const numberInputs = document.querySelectorAll(
        'input[type="number"]'
    );

    numberInputs.forEach(input => {

        input.addEventListener("input", () => {

            const min = Number(input.min);
            const max = Number(input.max);
            const value = Number(input.value);

            if (input.value === "") return;

            if (!isNaN(min) && value < min) {
                input.value = min;
            }

            if (!isNaN(max) && value > max) {
                input.value = max;
            }
        });
    });


    // --------------------------------------------------
    // Reset Result When User Changes Form
    // --------------------------------------------------

    if (form) {

        form.addEventListener("input", () => {

            hideError();

            if (resultSection) {
                resultSection.classList.remove("show");
            }
        });
    }


    // --------------------------------------------------
    // Smooth Navigation
    // --------------------------------------------------

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // --------------------------------------------------
    // Navbar Scroll Effect
    // --------------------------------------------------

    const navbar =
        document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });


    // --------------------------------------------------
    // Reveal Animation
    // --------------------------------------------------

    const animatedElements =
        document.querySelectorAll(".animate-on-scroll");

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("visible");

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });

                },
                {
                    threshold: 0.15
                }
            );

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

});