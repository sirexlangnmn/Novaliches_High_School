const db = require('../models/index.js');
const ecdc = require('../shared/ecdc.js');
const sequelizeConfig = require('../config/sequelize.config.js');

const Op = db.Sequelize.Op;


exports.getByLearningArea = async (req, res) => {
    const SCHOOL_YEAR = '2025-2026';
    const GRADE_LEVEL = 1;
    const QUARTER = 1;
    const TEACHER_ID = 1;

    try {
        const { learningAreaCode } = req.body;
        console.log('class_records.controller getByLearningArea learningAreaCode:', learningAreaCode)

        if (!learningAreaCode) {
            return res.status(400).send({ message: 'Learning area code is required' });
        }

        const learningArea = await db.learning_areas.findOne({
            where: { code: learningAreaCode, status: 1 },
        });

        if (!learningArea) {
            return res.status(404).send({ message: 'Learning area not found' });
        }

        const schoolYear = await db.school_years.findOne({
            where: { year: SCHOOL_YEAR, status: 1 },
        });

        const lsrWhere = { status: 1 };
        if (schoolYear) {
            lsrWhere.school_year_id = schoolYear.id;
        }

        console.log('class_records.controller getByLearningArea lsrWhere:', lsrWhere)

        const learnerSchoolRecord = await db.learner_school_records.findOne({
            where: { school_year_id: schoolYear.id, quarter: QUARTER, grade_level_id: GRADE_LEVEL, status: 1 },
        });

        console.log('class_records.controller getByLearningArea learnerSchoolRecord:', learnerSchoolRecord)
        console.log('class_records.controller getByLearningArea learnerSchoolRecord.id:', learnerSchoolRecord.id)


        const learnerGrades = await db.learner_grades.findAll({
            where: { teacher_id: TEACHER_ID, learning_area_id: learningArea.id, status: 1 },
        });

        console.log('class_records.controller getByLearningArea learnerGrades:', learnerGrades)


        const teachers = await db.teachers.findOne({
            where: { id: TEACHER_ID, status: 1 },
        });

        console.log('class_records.controller getByLearningArea learnerGrades:', learnerGrades)
        console.log('class_records.controller getByLearningArea learningArea.name:', learningArea.name)
        console.log('class_records.controller getByLearningArea teachers.first_name:', teachers.first_name)

        

        res.send({
            learningArea: { id: learningArea.id, name: learningArea.name, code: learningArea.code },
            students,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};





// exports.getByLearningArea = async (req, res) => {
//     try {
//         const { learningAreaCode } = req.body;
//         console.log('class_records.controller getByLearningArea called with:', learningAreaCode)

//         if (!learningAreaCode) {
//             return res.status(400).send({ message: 'Learning area code is required' });
//         }

//         const learningArea = await db.learning_areas.findOne({
//             where: { code: learningAreaCode, status: 1 },
//         });

//         if (!learningArea) {
//             return res.status(404).send({ message: 'Learning area not found' });
//         }

//         const schoolYear = await db.school_years.findOne({
//             where: { year: '2025-2026', status: 1 },
//         });

//         const lsrWhere = { status: 1 };
//         if (schoolYear) {
//             lsrWhere.school_year_id = schoolYear.id;
//         }

//         const records = await db.learner_grades.findAll({
//             where: { learning_area_id: learningArea.id, status: 1 },
//             include: [
//                 {
//                     model: db.learner_school_records,
//                     where: lsrWhere,
//                     include: [
//                         {
//                             model: db.academic_records,
//                             include: [
//                                 { model: db.learners },
//                             ],
//                         },
//                         { model: db.grade_levels },
//                         { model: db.teachers },
//                     ],
//                 },
//             ],
//         });

//         const students = records.map((grade) => {
//             const record = grade.learner_school_record;
//             const academic = record ? record.academic_record : null;
//             const learner = academic ? academic.learner : null;

//             return {
//                 id: learner ? learner.id : null,
//                 name: learner
//                     ? `${learner.last_name}, ${learner.first_name} ${learner.middle_name || ''}`.trim()
//                     : 'Unknown',
//                 lrn: learner ? learner.lrn : null,
//                 gradeLevel: record && record.grade_level ? record.grade_level.name : null,
//                 section: record ? record.section : null,
//                 teacher: record && record.teacher
//                     ? `${record.teacher.first_name} ${record.teacher.last_name}`
//                     : null,
//                 q1: grade.q1,
//                 q2: grade.q2,
//                 q3: grade.q3,
//                 q4: grade.q4,
//                 finalRating: grade.final_rating,
//                 remarks: grade.remarks,
//             };
//         });

//         res.send({
//             learningArea: { id: learningArea.id, name: learningArea.name, code: learningArea.code },
//             students,
//         });
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };