import fitz
import re
import json
import os

PDF_PATH = r"C:\Users\pujar\.gemini\antigravity\brain\091a9823-f0d0-40a3-b96c-b0ff4d49ba43\.user_uploaded\media_1794565183834_0d7e0081.pdf"
OUTPUT_PATH = r"src\data\infraQuestions.json"

doc = fitz.open(PDF_PATH)
print(f"Total PDF pages: {len(doc)}")

# Map question number to page number
q_pages = {}
for page_idx in range(1, 68):
    p_num = page_idx + 1
    t = doc[page_idx].get_text()
    for m in re.finditer(r"(?:^|\n)(Q\d+)\.", t):
        qn = int(m.group(1)[1:])
        if qn not in q_pages:
            q_pages[qn] = p_num

print(f"Mapped {len(q_pages)} questions to page numbers.")

# Clean and concatenate text from page 2 to 68
full_text = ""
for i in range(1, 68):
    p_text = doc[i].get_text()
    lines = p_text.split("\n")
    cleaned_lines = []
    for line in lines:
        s = line.strip()
        if s == "CDAC CMCE Preparation | 400 MCQs":
            continue
        if re.match(r"^Page \d+$", s):
            continue
        if s in [
            "Part A – ITIL",
            "Questions 1–100",
            "Part A – DCM",
            "Questions 101–200",
            "Part B – DevOps",
            "Questions 201–400"
        ]:
            continue
        cleaned_lines.append(line)
    full_text += "\n" + "\n".join(cleaned_lines)

# Split into blocks starting with Q\d+\.
raw_blocks = re.split(r"\n(?=Q\d+\.)", full_text)
blocks = [b.strip() for b in raw_blocks if b.strip().startswith("Q")]

print(f"Total question blocks extracted: {len(blocks)}")
assert len(blocks) == 400, f"Expected 400 blocks, got {len(blocks)}"

questions = []

for idx, b in enumerate(blocks):
    qn = idx + 1
    
    # 1. Q num match
    qm = re.match(r"^Q(\d+)\.\s*", b)
    assert qm, f"Block {idx} does not start with Q\\d+."
    parsed_qn = int(qm.group(1))
    assert parsed_qn == qn, f"Question number mismatch: expected {qn}, got {parsed_qn}"
    
    # 2. Extract markers
    mA = re.search(r"\nA\.\s*(.*?)(?=\nB\.\s)", b, re.DOTALL)
    mB = re.search(r"\nB\.\s*(.*?)(?=\nC\.\s)", b, re.DOTALL)
    mC = re.search(r"\nC\.\s*(.*?)(?=\nD\.\s)", b, re.DOTALL)
    mD = re.search(r"\nD\.\s*(.*?)(?=\nAnswer:\s*)", b, re.DOTALL)
    mAns = re.search(r"\nAnswer:\s*([A-D])(?:\.|\s*[—\-–])\s*(.*?)(?=\nWhy:|\Z)", b, re.DOTALL)
    mWhy = re.search(r"\nWhy:\s*(.*)", b, re.DOTALL)
    
    assert mA and mB and mC and mD and mAns and mWhy, f"Failed parsing markers in Q{qn}"
    
    optA = re.sub(r"\s+", " ", mA.group(1)).strip()
    optB = re.sub(r"\s+", " ", mB.group(1)).strip()
    optC = re.sub(r"\s+", " ", mC.group(1)).strip()
    optD = re.sub(r"\s+", " ", mD.group(1)).strip()
    
    options = [
        {"key": "A", "text": optA},
        {"key": "B", "text": optB},
        {"key": "C", "text": optC},
        {"key": "D", "text": optD},
    ]
    
    correct_letter = mAns.group(1).strip()
    explanation = re.sub(r"\s+", " ", mWhy.group(1)).strip()
    
    opt_map = {"A": optA, "B": optB, "C": optC, "D": optD}
    correct_text = opt_map[correct_letter]
    
    # Question body before \nA.
    pre_a = b[:mA.start()].strip()
    # Strip Q<num>. and ANY difficulty tag like [Easy], [Intermediate], [Difficult]
    # per user request: "in front of question it show easy , hard and intermediate don't show in site only add questions in module 4"
    body = re.sub(r"^Q\d+\.\s*", "", pre_a).strip()
    clean_question = re.sub(r"^\[(?:Easy|Intermediate|Difficult)\]\s*", "", body).strip()
    clean_question = re.sub(r"\s+", " ", clean_question).strip()
    
    # Determine topic & section
    if 1 <= qn <= 100:
        sourceSection = "Part A – ITIL"
        topic = "ITIL Service Management"
    elif 101 <= qn <= 200:
        sourceSection = "Part A – DCM"
        topic = "Data Center Management (DCM)"
    elif 201 <= qn <= 300:
        sourceSection = "Part B – DevOps (Containers & Cloud)"
        topic = "DevOps & Containerization"
    else: # 301 to 400
        sourceSection = "Part B – DevOps (IaC & Monitoring)"
        topic = "IaC, Configuration Management & Monitoring"
        
    q_obj = {
        "id": f"INFRA-{str(qn).zfill(3)}",
        "moduleId": "it-infrastructure",
        "sourcePdf": "CDAC_CMCE_ITIL_DCM_DevOps_400_MCQs.pdf",
        "sourceSection": sourceSection,
        "sourceQuestionNumber": f"Q{qn}",
        "pageNumber": q_pages.get(qn, 1),
        "question": clean_question,
        "options": options,
        "correctAnswer": correct_letter,
        "correctAnswerText": correct_text,
        "explanation": explanation,
        "topic": topic,
        "diagram": None
    }
    questions.append(q_obj)

print(f"Successfully processed {len(questions)} questions.")

# Assertions to ensure 100% data integrity
for q in questions:
    assert len(q["id"]) >= 9, f"Invalid id: {q['id']}"
    assert q["moduleId"] == "it-infrastructure"
    assert q["sourceQuestionNumber"].startswith("Q")
    assert 1 <= q["pageNumber"] <= 70
    assert len(q["question"]) > 5
    # Ensure no difficulty brackets leaked into question
    assert not q["question"].startswith("[Easy]"), f"Easy tag leaked in {q['id']}"
    assert not q["question"].startswith("[Intermediate]"), f"Intermediate tag leaked in {q['id']}"
    assert not q["question"].startswith("[Difficult]"), f"Difficult tag leaked in {q['id']}"
    assert len(q["options"]) == 4
    for opt in q["options"]:
        assert opt["key"] in ["A", "B", "C", "D"]
        assert len(opt["text"]) > 0
    assert q["correctAnswer"] in ["A", "B", "C", "D"]
    assert len(q["correctAnswerText"]) > 0
    assert len(q["explanation"]) > 5
    assert q["topic"] in [
        "ITIL Service Management",
        "Data Center Management (DCM)",
        "DevOps & Containerization",
        "IaC, Configuration Management & Monitoring"
    ]

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

file_size = os.path.getsize(OUTPUT_PATH)
print(f"Wrote {len(questions)} questions to {OUTPUT_PATH} ({file_size / 1024:.1f} KB).")
