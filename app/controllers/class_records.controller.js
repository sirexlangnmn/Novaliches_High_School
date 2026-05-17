const db = require('../models/index.js');
const ecdc = require('../shared/ecdc.js');
const sequelizeConfig = require('../config/sequelize.config.js');

const Op = db.Sequelize.Op;


exports.getByLearningArea = async (req, res) => {

    const SCHOOL_ID = 1;
    const SCHOOL_YEAR_ID = 1;
    const GRADE_LEVEL_ID = 1;
    const SECTION_ID = 1;

    const QUARTER_ID = 1;

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


        const learnerSchoolRecords = await db.learner_school_records.findAll({
            where: {
                school_id: SCHOOL_ID,
                school_year_id: SCHOOL_YEAR_ID,
                grade_level_id: GRADE_LEVEL_ID,
                section_id: SECTION_ID,
                status: 1,
            },
        });

        console.log('class_records.controller getByLearningArea learnerSchoolRecords:', learnerSchoolRecords)

        const students = [];

        for (const record of learnerSchoolRecords) {
            const learner = await db.learners.findByPk(record.learner_id);
            if (!learner) continue;

            const grade = await db.learner_grades.findOne({
                where: {
                    learner_school_record_id: record.id,
                    learning_area_id: learningArea.id,
                    status: 1,
                },
                include: [{ model: db.teachers }],
            });

            const name = [learner.first_name, learner.middle_name, learner.last_name].filter(Boolean).join(' ');

            const subjects = {};
            if (grade) {
                const parseJSON = (val) => {
                    if (Array.isArray(val)) return val;
                    if (typeof val === 'string') {
                        try { return JSON.parse(val); } catch (e) { return []; }
                    }
                    return [];
                };
                subjects[learningArea.name] = {
                    teacher: grade.teacher ? `${grade.teacher.first_name} ${grade.teacher.last_name}` : null,
                    writtenScores: parseJSON(grade.writtenScores),
                    writtenTotal: Number(grade.writtenTotal),
                    writtenPS: Number(grade.writtenPS),
                    writtenWS: Number(grade.writtenWS),
                    performanceScores: parseJSON(grade.performanceScores),
                    performanceTotal: Number(grade.performanceTotal),
                    performancePS: Number(grade.performancePS),
                    performanceWS: Number(grade.performanceWS),
                    examScores: parseJSON(grade.examScores),
                    examTotal: Number(grade.examTotal),
                    examPS: Number(grade.examPS),
                    examWS: Number(grade.examWS),
                    initialGrade: Number(grade.initialGrade),
                    termGrade: Number(grade.termGrade),
                    descriptor: grade.descriptor,
                };
            }

            students.push({
                id: record.learner_id,
                name,
                subjects,
            });
        }

        console.log('class_records.controller getByLearningArea learningArea:', { id: learningArea.id, name: learningArea.name, code: learningArea.code })
        console.log('class_records.controller getByLearningArea students:', students)

        res.send({
            learningArea: { id: learningArea.id, name: learningArea.name, code: learningArea.code },
            students,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


