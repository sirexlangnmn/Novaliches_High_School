const db = require('../models/index.js');

const subjectCodes = {
    'Filipino': 'fil',
    'English': 'eng',
    'Mathematics': 'math',
    'Science': 'science',
    'Araling Panlipunan': 'ap',
    'Edukasyon sa Pagpapakatao': 'esp',
    'Technology and Livelihood Education': 'tle',
    'MAPEH': 'mapeh',
};

const sectionMap = {
    1: 'Homogeneous',
    2: 'Heterogeneous',
};

function computeDescriptor(grade) {
    if (grade == null || isNaN(grade)) return '';
    if (grade >= 90) return 'Advance';
    if (grade >= 85) return 'Proficient';
    if (grade >= 80) return 'Approaching Proficiency';
    if (grade >= 75) return 'Developing';
    if (grade >= 66) return 'Beginning';
    return '';
}

exports.getForm137Data = async (req, res) => {
    try {
        const { learnerSchoolRecordId } = req.body;
        console.log('form-137.controller learner_school_record_id:', learnerSchoolRecordId);

        // 1. Learner School Record + related data
        const schoolRecord = await db.learner_school_records.findOne({
            where: { id: learnerSchoolRecordId, status: 1 },
            include: [
                { model: db.school_years, attributes: ['year'] },
                { model: db.grade_levels, attributes: ['name'] },
            ],
        });

        if (!schoolRecord) {
            return res.status(404).send({ message: 'School record not found' });
        }

        // 2. Learner
        const learner = await db.learners.findOne({
            where: { id: schoolRecord.learner_id, status: 1 },
        });

        // 3. School
        const school = await db.schools.findOne({
            where: { id: schoolRecord.school_id },
        });

        // 4. JHS Eligibility
        const eligibility = await db.learner_jhs_eligibility.findOne({
            where: { learner_id: schoolRecord.learner_id, status: 1 },
        });

        // 5. All grades with learning area
        const grades = await db.learner_grades.findAll({
            where: { learner_school_record_id: learnerSchoolRecordId },
            include: [
                { model: db.learning_areas, attributes: ['name'] },
                { model: db.teachers, attributes: ['first_name', 'last_name'] },
            ],
        });

        // 6. Remedial classes
        const remedial = await db.remedial_classes.findOne({
            where: { learner_school_record_id: learnerSchoolRecordId, status: 1 },
        });

        // --- Build grades object by subject and quarter ---
        const gradesBySubject = {};

        for (const g of grades) {
            const subjectName = g.learning_area ? g.learning_area.name : null;
            if (!subjectName) continue;

            if (!gradesBySubject[subjectName]) {
                gradesBySubject[subjectName] = { 1: null, 2: null, 3: null, 4: null };
            }
            gradesBySubject[subjectName][g.quarter_id] = g;
        }

        const result = {
            // IMAGES
            deped_logo_left: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Department_of_Education.svg',
            deped_logo_right: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Department_of_Education.svg',

            // LEARNER'S INFORMATION
            last_name: learner ? learner.last_name || '' : '',
            first_name: learner ? learner.first_name || '' : '',
            name_extension: learner ? learner.name_extension || '' : '',
            middle_name: learner ? learner.middle_name || '' : '',
            lrn: learner ? learner.lrn || '' : '',
            birthdate: learner ? learner.birthdate || '' : '',
            sex: learner ? learner.sex || '' : '',

            // ELIGIBILITY FOR JHS ENROLLMENT
            general_average: eligibility ? eligibility.general_average || '' : '',
            citation: eligibility ? eligibility.citation || '' : '',
            elementary_school: eligibility ? eligibility.elementary_school || '' : '',
            school_id: eligibility ? eligibility.school_id || '' : '',
            school_address: eligibility ? eligibility.school_address || '' : '',
            pept_rating: eligibility ? eligibility.pept_rating || '' : '',
            als_rating: eligibility ? eligibility.als_rating || '' : '',
            exam_date: eligibility ? eligibility.exam_date || '' : '',
            testing_center: eligibility ? eligibility.testing_center || '' : '',

            // SCHOLASTIC RECORD
            school_name: school ? school.school_name || '' : '',
            school_id_2: school ? school.school_code || '' : '',
            district: school ? school.district || '' : '',
            division: school ? school.division || '' : '',
            region: school ? school.region || '' : '',
            grade_level: schoolRecord.grade_level ? schoolRecord.grade_level.name || '' : '',
            section: sectionMap[schoolRecord.section_id] || '',
            school_year: schoolRecord.school_year ? schoolRecord.school_year.year || '' : '',
            adviser: '',
            signature: '',
        };

        // Set adviser from first grade's teacher
        if (grades.length > 0 && grades[0].teacher) {
            const t = grades[0].teacher;
            result.adviser = [t.first_name, t.last_name].filter(Boolean).join(' ');
            result.signature = result.adviser;
        }

        // --- Populate grades per subject ---
        const allFinals = [];

        for (const [subjectName, quarters] of Object.entries(gradesBySubject)) {
            const code = subjectCodes[subjectName];
            if (!code) continue;

            const q1 = quarters[1] ? Number(quarters[1].termGrade) : null;
            const q2 = quarters[2] ? Number(quarters[2].termGrade) : null;
            const q3 = quarters[3] ? Number(quarters[3].termGrade) : null;
            const q4 = quarters[4] ? Number(quarters[4].termGrade) : null;

            const ratings = [q1, q2, q3, q4].filter(v => v !== null);
            const finalRating = ratings.length > 0
                ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
                : null;

            result[`${code}_q1`] = q1 !== null ? q1.toString() : '';
            result[`${code}_q2`] = q2 !== null ? q2.toString() : '';
            result[`${code}_q3`] = q3 !== null ? q3.toString() : '';
            result[`${code}_q4`] = q4 !== null ? q4.toString() : '';
            result[`${code}_final`] = finalRating !== null ? finalRating.toFixed(2) : '';
            result[`${code}_remarks`] = computeDescriptor(finalRating);

            if (finalRating !== null) {
                allFinals.push(finalRating);
            }
        }

        // Fill empty subjects with empty strings
        for (const [, code] of Object.entries(subjectCodes)) {
            if (result[`${code}_q1`] === undefined) {
                result[`${code}_q1`] = '';
                result[`${code}_q2`] = '';
                result[`${code}_q3`] = '';
                result[`${code}_q4`] = '';
                result[`${code}_final`] = '';
                result[`${code}_remarks`] = '';
            }
        }

        // OVERALL
        const overallAvg = allFinals.length > 0
            ? (allFinals.reduce((a, b) => a + b, 0) / allFinals.length)
            : null;

        result.overall_average = overallAvg !== null ? overallAvg.toFixed(2) : '';
        result.overall_remarks = computeDescriptor(overallAvg);

        // REMEDIAL CLASSES
        result.remedial_from = remedial ? remedial.remedial_from || '' : '';
        result.remedial_to = remedial ? remedial.remedial_to || '' : '';
        result.remedial_subject_1 = remedial ? remedial.remedial_subject_1 || '' : '';
        result.remedial_final_rating_1 = remedial ? (remedial.remedial_final_rating_1 || '') : '';
        result.remedial_mark_1 = remedial ? (remedial.remedial_mark_1 || '') : '';
        result.recomputed_grade_1 = remedial ? (remedial.recomputed_grade_1 || '') : '';
        result.remedial_remarks_1 = remedial ? remedial.remedial_remarks_1 || '' : '';
        result.remedial_subject_2 = remedial ? remedial.remedial_subject_2 || '' : '';
        result.remedial_final_rating_2 = remedial ? (remedial.remedial_final_rating_2 || '') : '';
        result.remedial_mark_2 = remedial ? (remedial.remedial_mark_2 || '') : '';
        result.recomputed_grade_2 = remedial ? (remedial.recomputed_grade_2 || '') : '';
        result.remedial_remarks_2 = remedial ? remedial.remedial_remarks_2 || '' : '';

        console.log('form-137.controller result:', JSON.stringify(result, null, 2));

        res.send(result);
    } catch (error) {
        console.error('form-137.controller error:', error);
        res.status(500).send({ message: error.message });
    }
};
