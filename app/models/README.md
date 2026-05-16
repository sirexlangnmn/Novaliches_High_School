# Database Schema — SF10-JHS (Form 137)

Normalized Sequelize models for the Department of Education's Learner's Permanent Academic Record for Junior High School (SF10-JHS), formerly Form 137.

## Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────────────────┐
│    learners      │ 1   1 │  learner_jhs_eligibility      │
│                  │──────▶│                              │
│  id (PK)         │       │  id (PK)                     │
│  last_name       │       │  learner_id (FK)             │
│  first_name      │       │  general_average             │
│  middle_name     │       │  citation                    │
│  name_extension  │       │  elementary_school           │
│  lrn             │       │  school_id                   │
│  birthdate       │       │  school_address              │
│  sex             │       │  pept_rating                 │
│  status          │       │  als_rating                  │
└────────┬─────────┘       │  exam_date                   │
         │                 │  testing_center              │
         │ 1               │  status                      │
         │                 └──────────────────────────────┘
         │
         │ 1
         ▼
┌──────────────────┐
│ academic_records  │
│                   │
│  id (PK)          │
│  learner_id (FK)  │
│  status           │
└────────┬─────────┘
         │ 1
         │
         │ N
         ▼
┌──────────────────────────────┐       ┌──────────────────┐
│ learner_school_records       │       │    schools       │
│                               │       │                  │
│  id (PK)                     │       │  id (PK)         │
│  academic_record_id (FK) ────┤       │  ...             │
│  school_id (FK) ─────────────┼──────▶│                  │
│  school_year_id (FK) ────────┼┐      └──────────────────┘
│  grade_level_id (FK) ────────┼┤┌─────┐
│  teacher_id (FK) ────────────┼┤│     │  ┌──────────────────┐
│  section                     │││     │  │  school_years    │
│  remedial_from               │││     └──│                  │
│  remedial_to                 │││       │  id (PK)         │
│  remedial_subject_1          │││       │  year            │
│  remedial_final_rating_1     │││       │  status          │
│  remedial_mark_1             │││       └──────────────────┘
│  recomputed_grade_1          │││
│  remedial_remarks_1          │││       ┌──────────────────┐
│  remedial_subject_2          │││       │  grade_levels    │
│  remedial_final_rating_2     ││├──────▶│                  │
│  remedial_mark_2             │││       │  id (PK)         │
│  recomputed_grade_2          │││       │  name            │
│  remedial_remarks_2          │││       │  code            │
│  status                      │││       │  order_sequence  │
└────────┬─────────────────────┘││       │  status          │
         │                     ││       └──────────────────┘
         │ 1                   ││
         │                     ││       ┌──────────────────┐
         │ N                   │└──────▶│   teachers       │
         ▼                     │        │                  │
┌──────────────────┐           │        │  id (PK)         │
│ learner_grades   │           │        │  employee_id     │
│                  │           │        │  first_name      │
│  id (PK)         │           │        │  last_name       │
│  learner_school_ │           │        │  middle_name     │
│    record_id(FK)─┘           │        │  status          │
│  learning_area_id(FK)────┐   │        └──────────────────┘
│  q1                     │   │
│  q2                     │   │        ┌──────────────────┐
│  q3                     │   │        │ learning_areas   │
│  q4                     │   └────────│                  │
│  final_rating           │            │  id (PK)         │
│  remarks                │            │  name            │
│  status                 │            │  code            │
└─────────────────────────┘            │  status          │
                                       └──────────────────┘
```

## Tables & Sample Data

### 1. `schools`
*Already exists in the project.*

### 2. `school_years`

| id | year | status |
|----|------|--------|
| 1 | 2022-2023 | 1 |
| 2 | 2023-2024 | 1 |
| 3 | 2024-2025 | 1 |
| 4 | 2025-2026 | 1 |
| 5 | 2026-2027 | 1 |

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

### 6. `learners`

| id | last_name | first_name | middle_name | name_extension | lrn | birthdate | sex | status |
|----|-----------|------------|-------------|----------------|-----|-----------|-----|--------|
| 1 | Dela Cruz | Juan | Mercado | | 100123456789 | 2008-05-12 | Male | 1 |
| 2 | Santos | Maria | Reyes | | 100987654321 | 2009-02-28 | Female | 1 |
| 3 | Bautista | Angela | Cruz | | 100456789123 | 2008-11-03 | Female | 1 |
| 4 | Mendoza | Paolo | Garcia | Jr. | 100321654987 | 2009-07-19 | Male | 1 |

### 7. `learner_jhs_eligibility`

| id | learner_id | general_average | citation | elementary_school | school_id | school_address | pept_rating | als_rating | exam_date | testing_center | status |
|----|------------|-----------------|----------|-------------------|-----------|----------------|-------------|------------|-----------|----------------|--------|
| 1 | 1 | 87.50 | Honorable Mention | Novaliches Elementary School | 101201 | N. B. Antonio St., Novaliches, Quezon City | null | null | null | null | 1 |
| 2 | 2 | 90.00 | With Honors | Bagbag Elementary School | 101202 | Bagbag, Novaliches, Quezon City | null | null | null | null | 1 |
| 3 | 3 | 83.25 | null | Novaliches Elementary School | 101201 | N. B. Antonio St., Novaliches, Quezon City | 85.00 | null | 2020-06-15 | Novaliches District | 1 |
| 4 | 4 | null | null | null | null | null | null | 82.50 | 2020-05-20 | Novaliches District | 1 |

### 8. `academic_records`
Each learner gets one academic record (the Form 137 document).

| id | learner_id | status |
|----|------------|--------|
| 1 | 1 | 1 |
| 2 | 2 | 1 |
| 3 | 3 | 1 |
| 4 | 4 | 1 |

### 9. `learner_school_records`
One record per grade level per learner. Remedial fields apply per school year.

| id | academic_record_id | school_id | school_year_id | grade_level_id | teacher_id | section | remedial_from | remedial_to | status |
|----|-------------------|-----------|----------------|----------------|------------|---------|---------------|-------------|--------|
| 1 | 1 | 1 | 1 | 1 | 1 | Newton | null | null | 1 |
| 2 | 1 | 1 | 2 | 2 | 2 | Einstein | null | null | 1 |
| 3 | 1 | 1 | 3 | 3 | 3 | Curie | 2025-06-15 | 2025-07-15 | 1 |
| 4 | 1 | 1 | 4 | 4 | 4 | Newton | null | null | 1 |
| 5 | 2 | 1 | 1 | 1 | 1 | Einstein | null | null | 1 |
| 6 | 2 | 1 | 2 | 2 | 2 | Newton | null | null | 1 |
| 7 | 2 | 1 | 3 | 3 | 3 | Einstein | null | null | 1 |
| 8 | 2 | 1 | 4 | 4 | 4 | Curie | null | null | 1 |

### 10. `learner_grades`
One record per learning area per school record. This is where the quarterly ratings (q1–q4), final rating, and remarks are stored.

**Example: Learner School Record ID 1 (Juan Dela Cruz / Grade 7 / SY 2022-2023)**

| id | learner_school_record_id | learning_area_id | q1 | q2 | q3 | q4 | final_rating | remarks | status |
|----|-------------------------|-----------------|----|----|----|----|-------------|---------|--------|
| 1 | 1 | 1 | 82 | 84 | 83 | 85 | 83.50 | Passed | 1 |
| 2 | 1 | 2 | 85 | 87 | 86 | 88 | 86.50 | Passed | 1 |
| 3 | 1 | 3 | 78 | 80 | 82 | 81 | 80.25 | Passed | 1 |
| 4 | 1 | 4 | 79 | 81 | 80 | 83 | 80.75 | Passed | 1 |
| 5 | 1 | 5 | 83 | 85 | 84 | 86 | 84.50 | Passed | 1 |
| 6 | 1 | 6 | 86 | 88 | 87 | 89 | 87.50 | Passed | 1 |
| 7 | 1 | 7 | 80 | 82 | 81 | 84 | 81.75 | Passed | 1 |
| 8 | 1 | 8 | 84 | 86 | 85 | 87 | 85.50 | Passed | 1 |

**Example: Learner School Record ID 4 (Juan Dela Cruz / Grade 10 / SY 2025-2026)**

| id | learner_school_record_id | learning_area_id | q1 | q2 | q3 | q4 | final_rating | remarks | status |
|----|-------------------------|-----------------|----|----|----|----|-------------|---------|--------|
| 25 | 4 | 1 | 88 | 90 | 87 | 91 | 89.00 | Passed | 1 |
| 26 | 4 | 2 | 90 | 93 | 89 | 94 | 91.50 | Passed | 1 |
| 27 | 4 | 3 | 85 | 87 | 86 | 88 | 86.50 | Passed | 1 |
| 28 | 4 | 4 | 87 | 89 | 86 | 90 | 88.00 | Passed | 1 |
| 29 | 4 | 5 | 89 | 91 | 88 | 92 | 90.00 | Passed | 1 |
| 30 | 4 | 6 | 92 | 94 | 91 | 95 | 93.00 | Passed | 1 |
| 31 | 4 | 7 | 84 | 86 | 83 | 87 | 85.00 | Passed | 1 |
| 32 | 4 | 8 | 90 | 92 | 89 | 93 | 91.00 | Passed | 1 |

### 11. `learner_school_records` — Remedial Example

When a learner takes remedial classes (e.g., Juan failed Math in Grade 9):

| id | ... | remedial_from | remedial_to | remedial_subject_1 | remedial_final_rating_1 | remedial_mark_1 | recomputed_grade_1 | remedial_remarks_1 | ... | status |
|----|-----|---------------|-------------|-------------------|------------------------|-----------------|--------------------|--------------------|-----|--------|
| 3 | ... | 2025-06-15 | 2025-07-15 | Mathematics | 80.25 | 85.00 | 82.63 | Passed | ... | 1 |

## Usage in Controllers

```javascript
const db = require('../models');
const { learners, learner_school_records, learner_grades } = db;

// Fetch a learner with their Form 137 records
const learner = await learners.findByPk(learnerId, {
    include: [
        { model: db.learner_jhs_eligibility },
        {
            model: db.academic_records,
            include: [{
                model: db.learner_school_records,
                include: [
                    { model: db.grade_levels },
                    { model: db.school_years },
                    { model: db.teachers },
                    {
                        model: db.learner_grades,
                        include: [{ model: db.learning_areas }]
                    }
                ]
            }]
        }
    ]
});
```

## Notes

- All tables include a `status` field (`TINYINT`) for soft deletes: `1` = active, `0` = inactive.
- `learner_jhs_eligibility` has a 1:1 relationship with `learners` (one eligibility record per learner).
- `academic_records` acts as the Form 137 document header.
- `learner_school_records` stores one row per grade level (G7–G10).
- `learner_grades` stores one row per learning area per school record (8 rows per grade level).
- All `DECIMAL(5,2)` fields can store values from `-999.99` to `999.99`, suitable for grades (0–100 range).
- `ENUM('Male', 'Female')` is used for the `sex` field. Adjust if your database does not support ENUM.
