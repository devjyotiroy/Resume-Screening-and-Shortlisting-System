# ML Service configuration — Skills & Projects focused scoring

UPLOAD_FOLDER   = 'uploads'
MIN_TEXT_LENGTH = 50

# Scoring weights — skills + projects are primary, experience is NOT a blocker
WEIGHTS = {
    'skill':      0.35,   # highest — skills matter most
    'keyword':    0.18,   # JD keyword match
    'similarity': 0.15,   # TF-IDF cosine similarity
    'project':    0.12,   # projects & github
    'education':  0.08,   # education level
    'cert':       0.06,   # certifications
    'soft':       0.04,   # soft skills
    'experience': 0.02,   # very low — freshers should not be penalised
}

SELECTION_THRESHOLD = 55  # lowered slightly to be fair to freshers

GRADE_THRESHOLDS = [
    (85, 'Excellent'),
    (70, 'Good'),
    (55, 'Average'),
    (40, 'Below Average'),
    (0,  'Poor'),
]
