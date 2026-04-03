from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from config.settings import WEIGHTS, GRADE_THRESHOLDS

def get_similarity(resume_text, jd_text):
    if not resume_text.strip() or not jd_text.strip():
        return 0.0
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=8000,
        sublinear_tf=True,
        min_df=1,
    )
    try:
        vectors = vectorizer.fit_transform([resume_text, jd_text])
        return round(float(cosine_similarity(vectors[0], vectors[1])[0][0]), 4)
    except Exception:
        return 0.0

def calculate_final_score(skill_score, exp_score, edu_score, cert_score,
                           project_score, similarity_score, keyword_score=50, soft_score=50):
    w = WEIGHTS
    # Experience contributes very little — freshers with good skills should pass
    # Give a base exp score of 40 so 0-year candidates aren't heavily penalised
    effective_exp = max(exp_score, 40)

    final = (
        w['skill']      * skill_score +
        w['keyword']    * keyword_score +
        w['similarity'] * (similarity_score * 100) +
        w['project']    * project_score +
        w['education']  * edu_score +
        w['cert']       * cert_score +
        w['soft']       * soft_score +
        w['experience'] * effective_exp
    )
    return round(min(final, 100), 2)

def get_score_grade(score):
    for threshold, grade in GRADE_THRESHOLDS:
        if score >= threshold:
            return grade
    return 'Poor'
