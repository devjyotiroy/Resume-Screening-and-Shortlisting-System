import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('stopwords', quiet=True)
nltk.download('punkt',     quiet=True)
nltk.download('wordnet',   quiet=True)

stemmer    = PorterStemmer()
stop_words = set(stopwords.words('english'))

SKILL_ALIASES = {
    'ml':           ['machine learning', 'ml', 'sklearn', 'scikit-learn', 'scikit learn'],
    'dl':           ['deep learning', 'dl', 'neural network', 'neural networks', 'ann', 'cnn', 'rnn', 'lstm'],
    'nlp':          ['natural language processing', 'nlp', 'text mining', 'text processing', 'spacy', 'nltk'],
    'js':           ['javascript', 'js', 'node.js', 'nodejs', 'node js', 'es6', 'es2015'],
    'ts':           ['typescript', 'ts'],
    'python':       ['python', 'py', 'python3', 'python 3'],
    'react':        ['react', 'reactjs', 'react.js', 'react native'],
    'vue':          ['vue', 'vuejs', 'vue.js'],
    'angular':      ['angular', 'angularjs', 'angular.js'],
    'sql':          ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'mssql', 'oracle db', 'pl/sql', 't-sql'],
    'nosql':        ['nosql', 'mongodb', 'mongo', 'cassandra', 'redis', 'dynamodb', 'couchdb'],
    'aws':          ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'rds', 'cloudformation', 'sagemaker'],
    'azure':        ['azure', 'microsoft azure', 'azure devops'],
    'gcp':          ['gcp', 'google cloud', 'bigquery', 'google cloud platform'],
    'docker':       ['docker', 'containerization', 'containers', 'dockerfile'],
    'kubernetes':   ['kubernetes', 'k8s', 'kubectl', 'helm'],
    'git':          ['git', 'github', 'gitlab', 'bitbucket', 'version control'],
    'api':          ['api', 'rest api', 'restful', 'graphql', 'fastapi', 'flask api', 'openapi', 'swagger'],
    'java':         ['java', 'spring', 'spring boot', 'hibernate', 'maven', 'gradle'],
    'c++':          ['c++', 'cpp', 'c plus plus'],
    'c#':           ['c#', 'csharp', '.net', 'dotnet', 'asp.net'],
    'data science': ['data science', 'data scientist', 'data analysis', 'data analytics', 'eda'],
    'tensorflow':   ['tensorflow', 'tf', 'keras'],
    'pytorch':      ['pytorch', 'torch'],
    'pandas':       ['pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn'],
    'tableau':      ['tableau', 'power bi', 'powerbi', 'data visualization', 'looker', 'metabase'],
    'linux':        ['linux', 'unix', 'bash', 'shell scripting', 'shell', 'zsh'],
    'agile':        ['agile', 'scrum', 'kanban', 'jira', 'confluence', 'sprint'],
    'devops':       ['devops', 'ci/cd', 'cicd', 'jenkins', 'github actions', 'gitlab ci', 'circleci'],
    'testing':      ['unit testing', 'pytest', 'jest', 'selenium', 'cypress', 'tdd', 'bdd'],
    'flutter':      ['flutter', 'dart'],
    'android':      ['android', 'kotlin', 'android studio'],
    'ios':          ['ios', 'swift', 'xcode', 'objective-c'],
}

def normalize_skill(skill):
    s = skill.lower().strip()
    for canonical, aliases in SKILL_ALIASES.items():
        if s in aliases or s == canonical:
            return canonical
    return s

def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s\+\#\.]', ' ', text)
    tokens = text.split()
    tokens = [stemmer.stem(w) for w in tokens if w not in stop_words and len(w) > 1]
    return ' '.join(tokens)

def extract_skills(text, job_skills):
    text_lower = text.lower()
    matched = []
    for skill in job_skills:
        skill_norm = normalize_skill(skill)
        if skill.lower() in text_lower:
            matched.append(skill)
            continue
        aliases = SKILL_ALIASES.get(skill_norm, [skill_norm])
        if any(alias in text_lower for alias in aliases):
            matched.append(skill)
    return list(dict.fromkeys(matched))

def extract_experience_years(text):
    text_lower = text.lower()
    patterns = [
        r'(\d+)\+?\s*years?\s*of\s*(?:work\s*)?experience',
        r'experience\s*(?:of\s*)?(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s*(?:of\s*)?(?:industry|professional|work|relevant)?\s*experience',
        r'worked\s*for\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s*(?:of\s*)?experience',
        r'(\d+)\s*\+\s*years?',
    ]
    years_found = []
    for p in patterns:
        for m in re.finditer(p, text_lower):
            val = int(m.group(1))
            if 0 < val <= 40:  # sanity check
                years_found.append(val)
    return max(years_found) if years_found else 0

def extract_education_score(text):
    text_lower = text.lower()
    if any(k in text_lower for k in ['ph.d', 'phd', 'doctorate', 'doctor of']):
        return 100
    if any(k in text_lower for k in ['m.tech', 'mtech', 'm.e.', 'mba', 'master of', 'masters', 'm.sc', 'msc', 'm.s.']):
        return 85
    if any(k in text_lower for k in ['b.tech', 'btech', 'b.e.', 'bachelor', 'b.sc', 'bsc', 'b.s.', 'be ', 'b.e ']):
        return 70
    if any(k in text_lower for k in ['diploma', 'polytechnic', 'associate']):
        return 50
    if any(k in text_lower for k in ['12th', 'hsc', 'higher secondary', 'intermediate']):
        return 30
    return 20

def extract_certifications_score(text):
    cert_keywords = [
        'aws certified', 'azure certified', 'gcp certified', 'google certified',
        'microsoft certified', 'cisco certified', 'certified developer', 'pmp',
        'certification', 'certified', 'coursera', 'udemy', 'edx', 'nptel',
        'udacity', 'linkedin learning', 'pluralsight', 'comptia', 'oracle certified',
    ]
    text_lower = text.lower()
    count = sum(1 for c in cert_keywords if c in text_lower)
    return min(count * 15, 100)

def extract_projects_score(text):
    text_lower = text.lower()
    project_count = len(re.findall(r'\bprojects?\b', text_lower))
    github_bonus  = 20 if ('github' in text_lower or 'gitlab' in text_lower) else 0
    deploy_bonus  = 10 if any(k in text_lower for k in ['deployed', 'live', 'production', 'hosted', 'published']) else 0
    return min(project_count * 12 + github_bonus + deploy_bonus, 100)

def extract_keyword_density(resume_text, jd_text):
    if not jd_text:
        return 50
    jd_words = set(re.findall(r'\b[a-z]{3,}\b', jd_text.lower()))
    jd_words -= stop_words
    if not jd_words:
        return 50
    resume_lower = resume_text.lower()
    matched = sum(1 for w in jd_words if w in resume_lower)
    return round(min((matched / len(jd_words)) * 100 * 1.5, 100), 2)

def extract_soft_skills_score(text):
    soft_skills = [
        'communication', 'teamwork', 'leadership', 'problem solving', 'problem-solving',
        'critical thinking', 'time management', 'adaptability', 'creativity',
        'collaboration', 'interpersonal', 'presentation', 'analytical', 'self-motivated',
        'detail-oriented', 'multitasking', 'decision making', 'conflict resolution',
    ]
    text_lower = text.lower()
    count = sum(1 for s in soft_skills if s in text_lower)
    return min(count * 10, 100)
