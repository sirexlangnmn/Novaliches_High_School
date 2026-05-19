const db = require('../models/index.js');
const ecdc = require('../shared/ecdc.js');
const sequelizeConfig = require('../config/sequelize.config.js');

const Op = db.Sequelize.Op;


exports.getByLearningArea = async (req, res) => {

    const SCHOOL_ID = 1;
    const SCHOOL_YEAR_ID = 1;
    const GRADE_LEVEL_ID = 1;
    const SECTION_ID = 1;

    // const QUARTER_ID = 1;

    let school = null;
    let division = null;
    let region = null;
    if (SCHOOL_ID === 1) {
        school = 'Novaliches High School';
        division = 'Quezon City';
        region = 'Region III';
    }


    let schoolYear = null;
    if (SCHOOL_YEAR_ID === 1) {
        schoolYear = '2025-2026';
    }


    let gradeLevel = null;
    if (GRADE_LEVEL_ID === 1) {
        gradeLevel = 'Grade 7';
    } else if (GRADE_LEVEL_ID === 2) {
        gradeLevel = 'Grade 8';
    } else if (GRADE_LEVEL_ID === 3) {
        gradeLevel = 'Grade 9';
    } else if (GRADE_LEVEL_ID === 4) {
        gradeLevel = 'Grade 10';
    }


    let section = null;
    if (SECTION_ID === 1) {
        section = 'Homogeneous';
    } else if (SECTION_ID === 2) {
        section = 'Heterogeneous';
    }


    // let quarter = null;
    // if (QUARTER_ID === 1) {
    //     quarter = 'First Quarter';
    // } else if (QUARTER_ID === 2) {
    //     quarter = 'Second Quarter';
    // } else if (QUARTER_ID === 3) {
    //     quarter = 'Third Quarter';
    // } else if (QUARTER_ID === 4) {
    //     quarter = 'Fourth Quarter';
    // }




    try {
        const { learningAreaCode, quarterId } = req.body;
        console.log('class_records.controller getByLearningArea learningAreaCode:', learningAreaCode);
        console.log('class_records.controller getByLearningArea quarterId:', quarterId);

        if (!learningAreaCode) {
            return res.status(400).send({ message: 'Learning area code is required' });
        }

        if (!quarterId) {
            return res.status(400).send({ message: 'Quarter ID is required' });
        }

        let quarter = parseInt(quarterId, 10);

        const learningArea = await db.learning_areas.findOne({
            where: { code: learningAreaCode, status: 1 },
        });

        if (!learningArea) {
            return res.status(404).send({ message: 'Learning area not found' });
        }

        const subject = learningArea.name

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
        console.log('class_records.controller getByLearningArea quarter:', quarter)

        const students = [];

        for (const record of learnerSchoolRecords) {
            const learner = await db.learners.findByPk(record.learner_id);
            if (!learner) continue;

            const grade = await db.learner_grades.findOne({
                where: {
                    learner_school_record_id: record.id,
                    quarter_id: quarter,
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


                let descriptor = null;
                if (grade.termGrade >= 90 && grade.termGrade <= 100) {
                    descriptor = 'Advance';
                } else if (grade.termGrade >= 85 && grade.termGrade <= 89) {
                    descriptor = 'Proficient';
                } else if (grade.termGrade >= 80 && grade.termGrade <= 84) {
                    descriptor = 'Approaching Proficiency';
                } else if (grade.termGrade >= 75 && grade.termGrade <= 79) {
                    descriptor = 'Developing';
                } else if (grade.termGrade >= 66 && grade.termGrade <= 74) {
                    descriptor = 'Beginning';
                }

                subjects[learningArea.name] = {
                    learner_school_record_id: grade.learner_school_record_id,
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
                    descriptor
                };
            }

            students.push({
                id: record.learner_id,
                learnerSchoolRecordId: record.id,
                name,
                subjects,
            });
        }

        console.log('class_records.controller getByLearningArea learningArea:', { id: learningArea.id, name: learningArea.name, code: learningArea.code })
        console.log('class_records.controller getByLearningArea students:', students)

        res.send({
            schoolYear,
            school,
            division,
            region,
            gradeLevel,
            section,
            subject,
            quarter,
            learningArea: { id: learningArea.id, name: learningArea.name, code: learningArea.code },
            students,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.saveGradeChange = async (req, res) => {
    try {
        const { gradeChangeRecord, updatedStudentRecord, referenceData } = req.body;

        const teacher = await db.teachers.findOne({
            where: db.Sequelize.where(
                db.Sequelize.fn('CONCAT',
                    db.Sequelize.col('first_name'), ' ',
                    db.Sequelize.col('last_name')
                ),
                referenceData.teacher
            )
        });

        const learningArea = await db.learning_areas.findOne({
            where: { name: referenceData.learning_area }
        });

        if (!learningArea) {
            return res.status(404).send({ message: 'Learning area not found' });
        }

        const quarterId = parseInt(referenceData.quarter, 10);

        if (!quarterId) {
            return res.status(400).send({ message: `Invalid quarter: ${referenceData.quarter}` });
        }

        const subjectData = updatedStudentRecord.subjects[learningArea.name];

        if (!subjectData) {
            return res.status(400).send({ message: `Subject data not found for ${learningArea.name}` });
        }

        const existingGrade = await db.learner_grades.findOne({
            where: {
                learner_school_record_id: referenceData.learner_school_record_id,
                learning_area_id: learningArea.id,
                quarter_id: quarterId,
            }
        });

        if (!existingGrade) {
            await db.learner_grades.create({
                learner_school_record_id: referenceData.learner_school_record_id,
                quarter_id: quarterId,
                teacher_id: teacher ? teacher.id : null,
                learning_area_id: learningArea.id,
                writtenScores: subjectData.writtenScores,
                writtenTotal: subjectData.writtenTotal,
                writtenPS: subjectData.writtenPS,
                writtenWS: subjectData.writtenWS,
                performanceScores: subjectData.performanceScores,
                performanceTotal: subjectData.performanceTotal,
                performancePS: subjectData.performancePS,
                performanceWS: subjectData.performanceWS,
                examScores: subjectData.examScores,
                examTotal: subjectData.examTotal,
                examPS: subjectData.examPS,
                examWS: subjectData.examWS,
                initialGrade: subjectData.initialGrade,
                termGrade: subjectData.termGrade,
                descriptor: subjectData.descriptor,
                status: 1,
            });
        } else {
            await db.grade_snapshots.create({
                learner_school_record_id: referenceData.learner_school_record_id,
                quarter_id: quarterId,
                teacher_id: teacher ? teacher.id : null,
                learning_area_id: learningArea.id,
                field: gradeChangeRecord.field,
                previous_value: gradeChangeRecord.previous_value,
                updated_value: gradeChangeRecord.updated_value,
            });

            await db.learner_grades.update({
                writtenScores: subjectData.writtenScores,
                writtenTotal: subjectData.writtenTotal,
                writtenPS: subjectData.writtenPS,
                writtenWS: subjectData.writtenWS,
                performanceScores: subjectData.performanceScores,
                performanceTotal: subjectData.performanceTotal,
                performancePS: subjectData.performancePS,
                performanceWS: subjectData.performanceWS,
                examScores: subjectData.examScores,
                examTotal: subjectData.examTotal,
                examPS: subjectData.examPS,
                examWS: subjectData.examWS,
                initialGrade: subjectData.initialGrade,
                termGrade: subjectData.termGrade,
                descriptor: subjectData.descriptor,
            }, {
                where: {
                    learner_school_record_id: referenceData.learner_school_record_id,
                    learning_area_id: learningArea.id,
                    quarter_id: quarterId,
                }
            });
        }

        res.send({ message: 'Grade saved successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


