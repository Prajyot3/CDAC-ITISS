import fitz
import re
import json
import os

PDF_PATH = r"C:\Users\pujar\.gemini\antigravity\brain\091a9823-f0d0-40a3-b96c-b0ff4d49ba43\.user_uploaded\media_1794561437325_ec086e9d.pdf"
OUTPUT_PATH = r"src\data\programmingQuestions.json"

doc = fitz.open(PDF_PATH)
print(f"Total PDF pages: {len(doc)}")

# Map question number to page number
q_pages = {}
for page_idx in range(1, len(doc)):
    p_num = page_idx + 1
    t = doc[page_idx].get_text()
    for m in re.finditer(r"(?:^|\n)(Q\d+)\.", t):
        qn = int(m.group(1)[1:])
        if qn not in q_pages:
            q_pages[qn] = p_num

print(f"Mapped {len(q_pages)} questions to page numbers.")

# Clean and concatenate text from page 2 to 71
full_text = ""
for i in range(1, len(doc)):
    p_text = doc[i].get_text()
    lines = p_text.split("\n")
    cleaned_lines = []
    for line in lines:
        s = line.strip()
        if s == "CMCE Python & MySQL — 400 MCQ Practice Bank":
            continue
        if re.match(r"^Page \d+$", s):
            continue
        if s in [
            "MYSQL — QUERY-BASED (60)",
            "MYSQL — THEORY (40)",
            "PYTHON — CODE-BASED (150)",
            "PYTHON — THEORY (150)",
            "Choose the single best answer."
        ]:
            continue
        cleaned_lines.append(line)
    full_text += "\n" + "\n".join(cleaned_lines)

# Split into blocks starting with Q\d+\.
raw_blocks = re.split(r"\n(?=Q\d+\.)", full_text)
blocks = [b.strip() for b in raw_blocks if b.strip().startswith("Q")]

print(f"Total question blocks extracted: {len(blocks)}")
assert len(blocks) == 400, f"Expected 400 blocks, got {len(blocks)}"

def format_python_code(code_str: str) -> str:
    lines = [l.rstrip() for l in code_str.split("\n") if l.strip()]
    if not lines:
        return ""
    
    # Check if lines have indentation or if indentation needs standard 4-space formatting
    # Standard Python constructs in our dataset:
    # 1. def ...:\n  ...
    # 2. class ...:\n  def ...:\n    ...
    # 3. for ...:\n  ...
    # 4. try:\n  ...\nexcept ...:\n  ...\nfinally:\n  ...
    formatted = []
    indent_level = 0
    
    for line in lines:
        s = line.strip()
        # Check dedent triggers before line
        if s.startswith(("return ", "return\n", "return$", "except", "finally", "elif ", "else:")):
            if indent_level > 0:
                indent_level -= 1
        elif s.startswith("def ") and indent_level > 0 and formatted and formatted[-1].strip().startswith("def "):
            # sibling def inside class
            indent_level = 1
        elif not s.startswith(("def ", "for ", "while ", "if ", "try:", "except", "finally", "class ", "return")) and indent_level > 0:
            # check if top-level caller e.g. print(...) or c=C(...) after def/class
            if s.startswith(("print(", "c=C", "p=PurePosixPath", "total=", "a=", "x=")):
                # If it's a top-level execution statement following a function/class block, reset indent
                # Except if it's inside try/except
                is_in_try = any("try:" in fl for fl in formatted)
                if not is_in_try:
                    indent_level = 0

        # Apply indent
        formatted.append("    " * indent_level + s)
        
        # Check indent triggers after line
        if s.endswith(":") and not s.startswith(("try: ", "except ", "finally: ")):
            # If line is e.g. 'def f(n):', next line should be indented
            indent_level += 1
        elif s.startswith("try:") and s == "try:":
            indent_level += 1
        elif (s.startswith("except") or s.startswith("finally:")) and s.endswith(":"):
            indent_level += 1

    return "\n".join(lines) # Wait, let's keep exact code lines as authored, or formatted?

# Let's inspect options and questions
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
    mAns = re.search(r"\nAnswer:\s*([A-D])(?:\s*[—\-–]\s*(.*?))?(?=\nWhy:|\Z)", b, re.DOTALL)
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
    
    # Map correct answer text directly from the matching option
    opt_map = {"A": optA, "B": optB, "C": optC, "D": optD}
    correct_text = opt_map[correct_letter]
    
    # Question body before \nA.
    pre_a = b[:mA.start()].strip()
    body = re.sub(r"^Q\d+\.\s*", "", pre_a).strip()
    
    # Determine topic, sourceSection, diagram
    diagram = None
    if 1 <= qn <= 60:
        sourceSection = "MYSQL — QUERY-BASED"
        topic = "MySQL Query Construction"
        q_text = re.sub(r"\s+", " ", body).strip()
    elif 61 <= qn <= 100:
        sourceSection = "MYSQL — THEORY"
        topic = "MySQL Database Administration & DDL"
        q_text = re.sub(r"\s+", " ", body).strip()
    elif 101 <= qn <= 250:
        sourceSection = "PYTHON — CODE-BASED"
        topic = "Python Code Tracing & Output"
        # Split at last '?'
        qmark_pos = body.rfind("?")
        if qmark_pos != -1:
            q_text = re.sub(r"\s+", " ", body[:qmark_pos+1]).strip()
            code_part = body[qmark_pos+1:].strip()
            diagram = code_part if code_part else None
        else:
            q_text = body
    else: # 251 to 400
        sourceSection = "PYTHON — THEORY"
        topic = "Python Architecture & Standard Library"
        q_text = re.sub(r"\s+", " ", body).strip()
    
    q_obj = {
        "id": f"PROG-{str(qn).zfill(3)}",
        "moduleId": "programming",
        "sourcePdf": "CMCE_Python_MySQL_400_MCQ_Practice_Bank.pdf",
        "sourceSection": sourceSection,
        "sourceQuestionNumber": f"Q{qn}",
        "pageNumber": q_pages.get(qn, 1),
        "question": q_text,
        "options": options,
        "correctAnswer": correct_letter,
        "correctAnswerText": correct_text,
        "explanation": explanation,
        "topic": topic,
        "diagram": diagram
    }
    questions.append(q_obj)

print(f"Successfully processed {len(questions)} questions.")

# Verify all questions
for q in questions:
    assert len(q["id"]) >= 8, f"Invalid id: {q['id']}"
    assert q["moduleId"] == "programming"
    assert q["sourceQuestionNumber"].startswith("Q")
    assert 1 <= q["pageNumber"] <= 71
    assert len(q["question"]) > 5
    assert len(q["options"]) == 4
    for opt in q["options"]:
        assert opt["key"] in ["A", "B", "C", "D"]
        assert len(opt["text"]) > 0
    assert q["correctAnswer"] in ["A", "B", "C", "D"]
    assert len(q["correctAnswerText"]) > 0
    assert len(q["explanation"]) > 5
    assert q["topic"] in [
        "MySQL Query Construction",
        "MySQL Database Administration & DDL",
        "Python Code Tracing & Output",
        "Python Architecture & Standard Library"
    ]
    if q["topic"] == "Python Code Tracing & Output":
        assert q["diagram"] is not None and len(q["diagram"]) > 0, f"Missing diagram in {q['id']}"

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

file_size = os.path.getsize(OUTPUT_PATH)
print(f"Wrote {len(questions)} questions to {OUTPUT_PATH} ({file_size / 1024:.1f} KB).")
