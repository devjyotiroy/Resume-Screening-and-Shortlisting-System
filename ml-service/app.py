import os
import sys
import uuid

# Allow imports from ml-service root
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, request, jsonify
from flask_cors import CORS
from parser import extract_text
from utils import (
    preprocess, extract_skills, extract_experience_years,
    extract_education_score, extract_certifications_score,
    extract_projects_score, extract_keyword_density, extract_soft_skills_score,
)
from scorer import get_similarity, calculate_final_score, get_score_grade
from config.settings import UPLOAD_FOLDER, MIN_TEXT_LENGTH, SELECTION_THRESHOLD

app = Flask(__name__)
CORS(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ML Resume Analyzer'})

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided'}), 400

    file             = request.files['resume']
    job_description  = request.form.get('job_description', '').strip()
    job_skills_raw   = request.form.get('job_skills', '')
    job_skills       = [s.strip() for s in job_skills_raw.split(',') if s.strip()]

    ext       = os.path.splitext(file.filename)[1].lower()
    safe_name = f"{uuid.uuid4().hex}{ext}"
    filepath  = os.path.join(UPLOAD_FOLDER, safe_name)
    file.save(filepath)

    try:
        raw_text = extract_text(filepath)
    except Exception as e:
        return jsonify({'error': f'Failed to parse resume: {str(e)}'}), 400
    finally:
        # Clean up uploaded file after extraction
        if os.path.exists(filepath):
            os.remove(filepath)

    if not raw_text or len(raw_text.strip()) < MIN_TEXT_LENGTH:
        return jsonify({'error': 'Could not extract sufficient text. Ensure the resume is not image-based.'}), 400

    processed_resume = preprocess(raw_text)
    processed_jd     = preprocess(job_description)

    matched_skills = extract_skills(raw_text, job_skills)
    skill_score    = round((len(matched_skills) / len(job_skills) * 100), 2) if job_skills else 50.0

    exp_years  = extract_experience_years(raw_text)
    exp_score  = min(exp_years * 20, 100)

    edu_score     = extract_education_score(raw_text)
    cert_score    = extract_certifications_score(raw_text)
    project_score = extract_projects_score(raw_text)
    keyword_score = extract_keyword_density(raw_text, job_description)
    soft_score    = extract_soft_skills_score(raw_text)
    similarity    = get_similarity(processed_resume, processed_jd) if job_description else 0.0

    final_score    = calculate_final_score(
        skill_score, exp_score, edu_score, cert_score,
        project_score, similarity, keyword_score, soft_score
    )
    grade          = get_score_grade(final_score)
    recommendation = 'Selected' if final_score >= SELECTION_THRESHOLD else 'Rejected'

    return jsonify({
        'raw_text_preview': raw_text[:500],
        'matched_skills':   matched_skills,
        'all_skills':       job_skills,
        'experience_years': exp_years,
        'education_score':  edu_score,
        'cert_score':       cert_score,
        'project_score':    project_score,
        'keyword_score':    keyword_score,
        'soft_score':       soft_score,
        'similarity_score': similarity,
        'skill_score':      skill_score,
        'exp_score':        exp_score,
        'final_score':      final_score,
        'grade':            grade,
        'recommendation':   recommendation,
    })

@app.route('/rank', methods=['POST'])
def rank():
    data       = request.get_json()
    candidates = data.get('candidates', [])
    sorted_c   = sorted(candidates, key=lambda x: x['final_score'], reverse=True)
    for i, c in enumerate(sorted_c):
        c['rank']           = i + 1
        c['recommendation'] = 'Selected' if c['final_score'] >= SELECTION_THRESHOLD else 'Rejected'
        c['grade']          = get_score_grade(c['final_score'])
    return jsonify(sorted_c)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
