# Database Schema — Novaliches High School

Sequelize models for the Learner Information System (SF10-JHS / Form 137).

## Existing Models (current implementation)

| # | Model | Table | Purpose |
|---|-------|-------|---------|
| 1 | `users` | users | System user profile (name, gender, type, uuid) |
| 2 | `user_accounts` | user_accounts | Login credentials (email, password, verification) |
| 3 | `teachers` | teachers | Teaching staff (employee_id, name) |
| 4 | `learners` | learners | Student demographic info |
| 5 | `grade_levels` | grade_levels | Grade 7–10 with ordering |
| 6 | `learning_areas` | learning_areas | Subjects (Math, English, etc.) |
| 7 | `schools` | schools | School information |
| 8 | `school_years` | school_years | Academic year periods |
| 9 | `academic_records` | academic_records | Form 137 document header per learner |
| 10 | `learner_school_records` | learner_school_records | Enrollment record per learner per grade level |
| 11 | `learner_grades` | learner_grades | Quarterly grades per learner per subject |
| 12 | `learner_jhs_eligibility` | learner_jhs_eligibility | JHS completion / eligibility data |
| 13 | `remedial_classes` | remedial_classes | Remedial class records |
| 14 | `grade_snapshots` | grade_snapshots | Audit trail for grade changes |
| 15 | `reset_tokens` | reset_tokens | Password reset tokens |
| 16 | `user_sessions` | user_sessions | Login/logout session tracking |
| 17 | `user_download_histories` | user_download_histories | Download logs |

---

## Entity Relationship Diagram (Current)

```
┌──────────────────────┐       ┌──────────────────────────────┐
│       users          │       │       user_accounts           │
│                      │       │                              │
│  id (PK)             │       │  id (PK)                     │
│  first_name          │       │  email_address               │
│  last_name           │       │  contact_number              │
│  middle_name         │       │  password                    │
│  gender              │       │  accountType                 │
│  status              │       │  isVerified                  │
│  type                │       │  isActive                    │
│  uuid                │       │  verification_code           │
└──────────────────────┘       │  uuid                        │
                               └──────────────────────────────┘
┌──────────────────────┐
│      teachers        │       ┌──────────────────────────────┐
│                      │       │      learners                │
│  id (PK)             │       │                              │
│  employee_id         │       │  id (PK)                     │
│  first_name          │       │  last_name                   │
│  last_name           │       │  first_name                  │
│  middle_name         │       │  middle_name                 │
│  status              │       │  name_extension              │
└──────────────────────┘       │  lrn                         │
                               │  birthdate                   │
┌──────────────────────┐       │  sex                         │
│    grade_levels      │       │  status                      │
│                      │       └──────────┬───────────────────┘
│  id (PK)             │                  │ 1
│  name                │                  │
│  code                │                  │ 1
│  order_sequence      │                  ▼
│  status              │       ┌──────────────────────────────┐
└──────────────────────┘       │   learner_jhs_eligibility    │
                               │                              │
┌──────────────────────┐       │  id (PK)                     │
│   learning_areas     │       │  learner_id (FK)             │
│                      │       │  general_average             │
│  id (PK)             │       │  citation                    │
│  name                │       │  elementary_school           │
│  code                │       │  school_id                   │
│  status              │       │  school_address              │
└──────────────────────┘       │  pept_rating                 │
                               │  als_rating                  │
┌──────────────────────┐       │  exam_date                   │
│      schools         │       │  testing_center              │
│                      │       │  status                      │
│  id (PK)             │       └──────────────────────────────┘
│  school_name         │
│  school_code         │                 1
│  district            │                  │
│  division            │                  │ N
│  region              │                  ▼
│  address             │       ┌──────────────────────────────┐
│  school_type         │       │     academic_records          │
└──────────────────────┘       │                              │
                               │  id (PK)                     │
┌──────────────────────┐       │  learner_id (FK) ────────────┘
│    school_years      │       │  school_id (FK) ─────────────┐
│                      │       │  status                      │
│  id (PK)             │       └──────────────┬───────────────┘
│  year                │                      │ 1
│  status              │                      │
└──────────────────────┘                      │ N
                               │              ▼
                               │   ┌──────────────────────────────────┐
                               │   │   learner_school_records         │
                               │   │                                  │
                               │   │  id (PK)                         │
                               │   │  school_id (FK) ─────────────────┤
                               │   │  school_year_id (FK) ────────────┤
                               │   │  learner_id (FK) ────────────────┘
                               │   │  grade_level_id (FK) ────────────┐
                               │   │  section_id (⚠️ orphan — no FK)  │
                               │   │  status                          │
                               │   └──────────┬───────────────────────┘
                               │              │ 1
                               │              │
                               │              │ N
                               │              ▼
                               │   ┌──────────────────────────────────┐
                               │   │      learner_grades              │
                               │   │                                  │
                               │   │  id (PK)                         │
                               │   │  learner_school_record_id (FK) ──┘
                               │   │  quarter_id                      │
                               │   │  teacher_id (FK) ────────────────┐
                               │   │  learning_area_id (FK) ──────────┤
                               │   │  writtenScores / writtenTotal    │
                               │   │  performanceScores / total       │
                               │   │  examScores / examTotal          │
                               │   │  initialGrade / termGrade        │
                               │   │  descriptor / remarks            │
                               │   │  status                          │
                               │   └──────────────────────────────────┘
                               │
                               │   ┌──────────────────────────────────┐
                               │   │      remedial_classes            │
                               │   │                                  │
                               │   │  id (PK)                         │
                               │   │  learner_school_record_id (FK) ──┘
                               │   │  remedial_from / remedial_to     │
                               │   │  remedial_subject_1 / rating_1   │
                               │   │  remedial_subject_2 / rating_2   │
                               │   │  status                          │
                               │   └──────────────────────────────────┘
                               │
                               │   ┌──────────────────────────────────┐
                               │   │      grade_snapshots             │
                               │   │                                  │
                               │   │  id (PK)                         │
                               │   │  learner_school_record_id (FK) ──┘
                               │   │  quarter_id                      │
                               │   │  teacher_id                      │
                               │   │  learning_area_id                │
                               │   │  field                           │
                               │   │  previous_value                  │
                               │   │  updated_value                   │
                               │   │  status                          │
                               │   └──────────────────────────────────┘
```

---

## Current Sample Data

### 1. `schools`

| id | school_name | school_code | district | division | region | address | school_type |
|----|------------|-------------|----------|----------|--------|---------|-------------|
| 1 | Novaliches High School | 301201 | Novaliches | Quezon City | NCR | N. B. Antonio St., Novaliches, QC | Public |

### 2. `school_years`

| id | year | status |
|----|------|--------|
| 1 | 2022-2023 | 1 |
| 2 | 2023-2024 | 1 |
| 3 | 2024-2025 | 1 |
| 4 | 2025-2026 | 1 |

### 3. `grade_levels`

| id | name | code | order_sequence | status |
|----|------|------|----------------|--------|
| 1 | Grade 7 | G7 | 7 | 1 |
| 2 | Grade 8 | G8 | 8 | 1 |
| 3 | Grade 9 | G9 | 9 | 1 |
| 4 | Grade 10 | G10 | 10 | 1 |

### 4. `learning_areas`

| id | name | code | status |
|----|------|------|--------|
| 1 | Filipino | fil | 1 |
| 2 | English | eng | 1 |
| 3 | Mathematics | math | 1 |
| 4 | Science | science | 1 |
| 5 | Araling Panlipunan | ap | 1 |
| 6 | Edukasyon sa Pagpapakatao | esp | 1 |
| 7 | Technology and Livelihood Education | tle | 1 |
| 8 | MAPEH | mapeh | 1 |

### 5. `teachers`

| id | employee_id | first_name | last_name | middle_name | status |
|----|-------------|------------|-----------|-------------|--------|
| 1 | TCH-001 | Maria | Santos | Lopez | 1 |
| 2 | TCH-002 | Juan | Reyes | Cruz | 1 |
| 3 | TCH-003 | Ana | Cruz | Garcia | 1 |
| 4 | TCH-004 | Pedro | Lopez | Santos | 1 |
| 5 | TCH-005 | Liza | Garcia | Ramos | 1 |
| 6 | TCH-006 | Mark | Dela Cruz | Torres | 1 |
| 7 | TCH-007 | Nina | Rivera | Sanchez | 1 |
| 8 | TCH-008 | Karl | Mendoza | Villanueva | 1 |

### 6. `learners`

| id | last_name | first_name | middle_name | name_extension | lrn | birthdate | sex | status |
|----|-----------|------------|-------------|----------------|-----|-----------|-----|--------|
| 1 | Dela Cruz | Juan | Mercado | | 100123456789 | 2008-05-12 | Male | 1 |
| 2 | Santos | Maria | Reyes | | 100987654321 | 2009-02-28 | Female | 1 |
| 3 | Bautista | Angela | Cruz | | 100456789123 | 2008-11-03 | Female | 1 |
| 4 | Mendoza | Paolo | Garcia | Jr. | 100321654987 | 2009-07-19 | Male | 1 |

### 7. `academic_records`

Form 137 document header — one per learner.

| id | learner_id | school_id | status |
|----|------------|-----------|--------|
| 1 | 1 | 1 | 1 |
| 2 | 2 | 1 | 1 |
| 3 | 3 | 1 | 1 |
| 4 | 4 | 1 | 1 |

### 8. `learner_school_records`

One enrollment record per learner per grade level.

| id | school_id | school_year_id | learner_id | grade_level_id | section_id | status |
|----|-----------|----------------|------------|----------------|------------|--------|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 | 1 | 2 | 1 | 2 | 2 | 1 |
| 3 | 1 | 3 | 1 | 3 | 3 | 1 |
| 4 | 1 | 4 | 1 | 4 | 4 | 1 |
| 5 | 1 | 1 | 2 | 1 | 1 | 1 |
| 6 | 1 | 2 | 2 | 2 | 2 | 1 |
| 7 | 1 | 3 | 2 | 3 | 3 | 1 |
| 8 | 1 | 4 | 2 | 4 | 4 | 1 |

Note: `section_id` currently has **no foreign key** — no `sections` table exists.

### 9. `learner_grades`

One row per learning area per quarter per enrollment record. Uses `quarter_id` (1–4) and stores raw scores + weighted scores.

**Juan Dela Cruz, Grade 7 (learner_school_record_id = 1), Quarter 1**

| id | learner_school_record_id | quarter_id | teacher_id | learning_area_id | writtenTotal | performanceTotal | examTotal | initialGrade | termGrade | descriptor | remarks | status |
|----|-------------------------|------------|------------|-----------------|-------------|-----------------|-----------|-------------|-----------|------------|---------|--------|
| 1 | 1 | 1 | 1 | 1 | 40.00 | 50.00 | 40.00 | 83.50 | 83.50 | Satisfactory | Passed | 1 |
| 2 | 1 | 1 | 2 | 2 | 42.00 | 45.00 | 38.00 | 86.50 | 86.50 | Satisfactory | Passed | 1 |
| 3 | 1 | 1 | 3 | 3 | 35.00 | 40.00 | 30.00 | 75.25 | 75.25 | Fair | Failed | 1 |
| 4 | 1 | 1 | 4 | 4 | 38.00 | 42.00 | 35.00 | 80.75 | 80.75 | Satisfactory | Passed | 1 |
| 5 | 1 | 1 | 5 | 5 | 41.00 | 44.00 | 37.00 | 84.50 | 84.50 | Satisfactory | Passed | 1 |
| 6 | 1 | 1 | 6 | 6 | 43.00 | 47.00 | 39.00 | 87.50 | 87.50 | Very Satisfactory | Passed | 1 |
| 7 | 1 | 1 | 7 | 7 | 36.00 | 41.00 | 32.00 | 78.75 | 78.75 | Fair | Passed | 1 |
| 8 | 1 | 1 | 8 | 8 | 40.00 | 43.00 | 36.00 | 85.50 | 85.50 | Satisfactory | Passed | 1 |

### 10. `remedial_classes`

| id | learner_school_record_id | remedial_from | remedial_to | remedial_subject_1 | remedial_final_rating_1 | remedial_mark_1 | recomputed_grade_1 | remedial_remarks_1 | status |
|----|-------------------------|---------------|-------------|-------------------|------------------------|-----------------|--------------------|--------------------|--------|
| 1 | 3 | 2025-06-15 | 2025-07-15 | Mathematics | 75.25 | 85.00 | 80.13 | Passed | 1 |

### 11. `learner_jhs_eligibility`

One record per learner for JHS completion.

| id | learner_id | general_average | citation | elementary_school | school_id | school_address | pept_rating | als_rating | exam_date | testing_center | status |
|----|------------|-----------------|----------|-------------------|-----------|----------------|-------------|------------|-----------|----------------|--------|
| 1 | 1 | 87.50 | Honorable Mention | Novaliches Elementary School | 101201 | N. B. Antonio St., Novaliches, QC | null | null | null | null | 1 |

### 12. `grade_snapshots`

Audit log for grade changes.

| id | learner_school_record_id | quarter_id | teacher_id | learning_area_id | field | previous_value | updated_value | status |
|----|-------------------------|------------|------------|-----------------|-------|----------------|---------------|--------|
| 1 | 1 | 1 | 3 | 3 | examScores | {"exam1": 25} | {"exam1": 30} | 1 |

---

## Recommendations (Proposed Additions)

The current models have three critical gaps:

### Gap 1: No `sections` table

`learner_school_records.section_id` is an orphan column — it references no table. A section represents a physical classroom/division of a grade level (e.g., Grade 7 — Section Newton).

**Proposed table: `sections`**

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| name | STRING | Section name, e.g. "Newton", "Einstein" |
| grade_level_id | INTEGER FK → grade_levels | Which grade this section belongs to |
| school_year_id | INTEGER FK → school_years | Sections change every year |
| adviser_teacher_id | INTEGER FK → teachers | The class adviser assigned to this section |
| status | TINYINT | |

**Sample data:**

| id | name | grade_level_id | school_year_id | adviser_teacher_id | status |
|----|------|----------------|----------------|-------------------|--------|
| 1 | Newton | 1 | 4 | 1 (Maria Santos) | 1 |
| 2 | Einstein | 1 | 4 | 2 (Juan Reyes) | 1 |
| 3 | Curie | 2 | 4 | 3 (Ana Cruz) | 1 |
| 4 | Newton | 2 | 4 | 4 (Pedro Lopez) | 1 |

### Gap 2: No `teacher_assignments` table (THE BIGGEST GAP)

There is **no record of what each teacher teaches**. Currently, the only way to know is to scan `learner_grades` — but grades are per-learner, not a source of truth for assignments.

**Without this table:**
- Teacher logs in → has no way to know their subjects, sections, or students
- Student logs in → no way to see which teacher handles which subject
- Admin has no way to view the "teaching load" for a given school year

**Proposed table: `teacher_assignments`**

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| teacher_id | INTEGER FK → teachers | |
| school_year_id | INTEGER FK → school_years | |
| grade_level_id | INTEGER FK → grade_levels | |
| section_id | INTEGER FK → sections | |
| learning_area_id | INTEGER FK → learning_areas | The subject assigned |

**Sample data: SY 2025-2026 (school_year_id = 4)**

| id | teacher_id | school_year_id | grade_level_id | section_id | learning_area_id |
|----|-----------|----------------|----------------|------------|-----------------|
| 1 | 1 (Maria Santos) | 4 | 1 (G7) | 1 (Newton) | 1 (Filipino) |
| 2 | 1 (Maria Santos) | 4 | 1 (G7) | 2 (Einstein) | 1 (Filipino) |
| 3 | 2 (Juan Reyes) | 4 | 1 (G7) | 1 (Newton) | 2 (English) |
| 4 | 3 (Ana Cruz) | 4 | 2 (G8) | 3 (Curie) | 3 (Math) |
| 5 | 4 (Pedro Lopez) | 4 | 2 (G8) | 4 (Newton) | 4 (Science) |
| 6 | 5 (Liza Garcia) | 4 | 1 (G7) | 1 (Newton) | 5 (AP) |
| 7 | 6 (Mark Dela Cruz) | 4 | 1 (G7) | 1 (Newton) | 6 (ESP) |
| 8 | 7 (Nina Rivera) | 4 | 1 (G7) | 1 (Newton) | 7 (TLE) |
| 9 | 8 (Karl Mendoza) | 4 | 1 (G7) | 1 (Newton) | 8 (MAPEH) |

### Gap 3: `teachers` not linked to `user_accounts`

`teachers` has no foreign key to `user_accounts`. A teacher cannot log in because there's no link between their teacher record and their login credentials.

**Proposed change: Add `user_account_id` to `teachers`**

| id | employee_id | first_name | last_name | middle_name | **user_account_id** | status |
|----|-------------|------------|-----------|-------------|--------------------|--------|
| 1 | TCH-001 | Maria | Santos | Lopez | **1** | 1 |
| 2 | TCH-002 | Juan | Reyes | Cruz | **2** | 1 |

### How the Gaps Connect — Visualized

```
                    ┌─────────────────────┐
                    │   user_accounts     │
                    │   (login creds)     │
                    └─────────┬───────────┘
                              │ FK
                              ▼
                    ┌─────────────────────┐
                    │     teachers        │
                    │  (employee data)    │
                    └─────────┬───────────┘
                              │ one teacher │
                              │ has many    │
                              │ assignments │
                              ▼
                    ┌─────────────────────────────────────────────┐
                    │          teacher_assignments                │
                    │  (teacher_id + grade_level_id + section_id │
                    │   + learning_area_id + school_year_id)     │
                    └──────┬──────────┬──────────────┬───────────┘
                           │          │              │
                           │          │              │ learning_area_id
                           │          │ section_id   ▼
                           │          │     ┌──────────────────┐
                           │          │     │  learning_areas  │
                           │          │     │  (subjects)      │
                           │          │     └──────────────────┘
                           │          ▼
                           │  ┌─────────────────────┐
                           │  │      sections       │
                           │  │  (name, adviser,    │
                           │  │   grade_level)      │
                           │  └─────────┬───────────┘
                           │            │
                           ▼            ▼
                    ┌────────────────────────────────────┐
                    │    learner_school_records           │
                    │  (learner_id + grade_level_id      │
                    │   + section_id + school_year_id)   │
                    └────────────────┬───────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────────┐
                    │        learner_grades              │
                    │  (learner_school_record_id +       │
                    │   learning_area_id + quarter_id    │
                    │   + teacher_id + scores)           │
                    └────────────────────────────────────┘
```

### Answering Your Scenarios

**Scenario 1: Teacher logs in**
1. Teacher logs in via `user_accounts` (email/password)
2. `user_accounts` links to `teachers` via `user_account_id`
3. `teacher_assignments WHERE teacher_id = ?` returns all their teaching load:
   - "I teach **Filipino** to **Grade 7 — Newton** and **Grade 7 — Einstein**"
   - "I am the **adviser** of **Grade 7 — Newton**" (from `sections.adviser_teacher_id`)
4. `learner_school_records WHERE section_id IN (their sections)` returns all their students

**Scenario 2: Student logs in / views profile**
1. Student record (`learner_school_records`) has `section_id`
2. `teacher_assignments WHERE section_id = ? AND school_year_id = ?` returns all teachers per subject:
   - "Your Math teacher is **Ana Cruz**"
   - "Your English teacher is **Juan Reyes**"

**Scenario 3: Admin views class program**
- A clean `teacher_assignments` table shows the complete teaching load matrix for any school year — no need to query grade records.

### Missing Associations in `index.js`

The current `index.js` is missing several key Sequelize associations:

| Missing Association | Impact |
|--------------------|--------|
| `learner_school_records.belongsTo(learners)` | Can't eager-load learner from enrollment record |
| `teachers` has **zero** associations | No eager-loading possible for teacher's data |
| `learner_school_records` ↔ `sections` | Not possible yet (no sections model) |
| `teachers` ↔ `user_accounts` | Not possible yet |

---

## General Notes

- All tables include a `status` field (`TINYINT`) for soft deletes: `1` = active, `0` = inactive.
- `learner_jhs_eligibility` has a 1:1 relationship with `learners`.
- `academic_records` acts as the Form 137 document header.
- `learner_school_records` stores one row per grade level per learner per school year.
- `learner_grades` stores one row per learning area per quarter per enrollment record.
- All `DECIMAL(5,2)` fields can store values from `-999.99` to `999.99`.
- `ENUM('Male', 'Female')` is used for the `sex` field in `learners`.
