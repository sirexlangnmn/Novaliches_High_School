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

const mapehSubComponents = ['Music', 'Arts', 'Physical Education', 'Health'];

function computeDescriptor(grade) {
    if (grade == null || isNaN(grade)) return '';
    if (grade >= 90) return 'Outstanding';
    if (grade >= 85) return 'Very Satisfactory';
    if (grade >= 80) return 'Satisfactory';
    if (grade >= 75) return 'Fairly Satisfactory';
    return 'Did Not Meet Expectations';
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
                { model: db.sections, attributes: ['name'], include: [{ model: db.teachers, as: 'adviser', attributes: ['first_name', 'last_name'] }] },
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
            // MAPEH sub-components: store as array per quarter
            if (subjectName === 'MAPEH') {
                if (!Array.isArray(gradesBySubject[subjectName][g.quarter_id])) {
                    gradesBySubject[subjectName][g.quarter_id] = [];
                }
                gradesBySubject[subjectName][g.quarter_id].push(g);
            } else {
                gradesBySubject[subjectName][g.quarter_id] = g;
            }
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
            section: schoolRecord.section ? schoolRecord.section.name || '' : '',
            school_year: schoolRecord.school_year ? schoolRecord.school_year.year || '' : '',
            adviser: '',
            signature: '',
            principal_name: school ? school.principal_name || '' : '',
            principal_signature: school ? school.principal_name || '' : '',
            school_head_name: school ? school.school_head_name || '' : '',
            school_head_signature: school ? school.school_head_name || '' : '',
        };

        // Set adviser from section's class adviser
        if (schoolRecord.section && schoolRecord.section.adviser) {
            const adv = schoolRecord.section.adviser;
            result.adviser = [adv.first_name, adv.last_name].filter(Boolean).join(' ');
            result.signature = result.adviser;
        }

        // --- Populate grades per subject ---
        const allFinals = [];

        // Separate MAPEH sub-component grades from regular grades
        const mapehGradesByQuarter = { 1: [], 2: [], 3: [], 4: [] };

        for (const [subjectName, quarters] of Object.entries(gradesBySubject)) {
            const code = subjectCodes[subjectName];
            if (!code) continue;

            // Handle MAPEH sub-components
            if (subjectName === 'MAPEH') {
                for (let q = 1; q <= 4; q++) {
                    const entry = quarters[q];
                    if (entry) {
                        if (Array.isArray(entry)) {
                            entry.forEach(grade => {
                                if (grade.sub_component && mapehSubComponents.includes(grade.sub_component)) {
                                    mapehGradesByQuarter[q].push(grade);
                                }
                            });
                        } else if (entry.sub_component && mapehSubComponents.includes(entry.sub_component)) {
                            mapehGradesByQuarter[q].push(entry);
                        }
                    }
                }
                // Overall MAPEH grade will be computed from sub-components
                const mapehQ1 = mapehGradesByQuarter[1].length > 0
                    ? mapehGradesByQuarter[1].reduce((sum, g) => sum + Number(g.termGrade), 0) / mapehGradesByQuarter[1].length
                    : null;
                const mapehQ2 = mapehGradesByQuarter[2].length > 0
                    ? mapehGradesByQuarter[2].reduce((sum, g) => sum + Number(g.termGrade), 0) / mapehGradesByQuarter[2].length
                    : null;
                const mapehQ3 = mapehGradesByQuarter[3].length > 0
                    ? mapehGradesByQuarter[3].reduce((sum, g) => sum + Number(g.termGrade), 0) / mapehGradesByQuarter[3].length
                    : null;
                const mapehQ4 = mapehGradesByQuarter[4].length > 0
                    ? mapehGradesByQuarter[4].reduce((sum, g) => sum + Number(g.termGrade), 0) / mapehGradesByQuarter[4].length
                    : null;

                const ratings = [mapehQ1, mapehQ2, mapehQ3, mapehQ4].filter(v => v !== null);
                const finalRating = ratings.length > 0
                    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
                    : null;

                result[`${code}_q1`] = mapehQ1 !== null ? mapehQ1.toFixed(2) : '';
                result[`${code}_q2`] = mapehQ2 !== null ? mapehQ2.toFixed(2) : '';
                result[`${code}_q3`] = mapehQ3 !== null ? mapehQ3.toFixed(2) : '';
                result[`${code}_q4`] = mapehQ4 !== null ? mapehQ4.toFixed(2) : '';
                result[`${code}_final`] = finalRating !== null ? finalRating.toFixed(2) : '';
                result[`${code}_remarks`] = computeDescriptor(finalRating);

                // Populate MAPEH sub-component rows
                for (const comp of mapehSubComponents) {
                    const compKey = comp.toLowerCase().replace(/\s+/g, '_');
                    const findCompGrade = (q) => {
                        const entry = quarters[q];
                        if (!entry) return null;
                        if (Array.isArray(entry)) {
                            const found = entry.find(g => g.sub_component === comp);
                            return found ? Number(found.termGrade) : null;
                        }
                        return entry.sub_component === comp ? Number(entry.termGrade) : null;
                    };
                    const compQ1 = findCompGrade(1);
                    const compQ2 = findCompGrade(2);
                    const compQ3 = findCompGrade(3);
                    const compQ4 = findCompGrade(4);
                    const compRatings = [compQ1, compQ2, compQ3, compQ4].filter(v => v !== null);
                    const compFinal = compRatings.length > 0
                        ? (compRatings.reduce((a, b) => a + b, 0) / compRatings.length)
                        : null;

                    result[`${compKey}_q1`] = compQ1 !== null ? compQ1.toString() : '';
                    result[`${compKey}_q2`] = compQ2 !== null ? compQ2.toString() : '';
                    result[`${compKey}_q3`] = compQ3 !== null ? compQ3.toString() : '';
                    result[`${compKey}_q4`] = compQ4 !== null ? compQ4.toString() : '';
                    result[`${compKey}_final`] = compFinal !== null ? compFinal.toFixed(2) : '';
                    result[`${compKey}_remarks`] = computeDescriptor(compFinal);
                }

                if (finalRating !== null) {
                    allFinals.push(finalRating);
                }
                continue;
            }

            // Regular subjects (non-MAPEH)
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

        // Fill empty MAPEH sub-component rows
        for (const comp of mapehSubComponents) {
            const compKey = comp.toLowerCase().replace(/\s+/g, '_');
            if (result[`${compKey}_q1`] === undefined) {
                result[`${compKey}_q1`] = '';
                result[`${compKey}_q2`] = '';
                result[`${compKey}_q3`] = '';
                result[`${compKey}_q4`] = '';
                result[`${compKey}_final`] = '';
                result[`${compKey}_remarks`] = '';
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
