const db = require('../models/index.js');
const ecdc = require('../shared/ecdc.js');
const sequelizeConfig = require('../config/sequelize.config.js');

const Op = db.Sequelize.Op;

const TEACHER_ID = 1;
const SCHOOL_YEAR_ID = 1;

const isTeacherAdviserOfSection = async (teacherId, sectionId) => {
    const section = await db.sections.findOne({
        where: { id: sectionId, adviser_teacher_id: teacherId, school_year_id: SCHOOL_YEAR_ID, status: 1 },
    });
    return !!section;
};

exports.getMyClasses = async (req, res) => {
    try {
        console.log('=== getMyClasses START ===');
        console.log('TEACHER_ID:', TEACHER_ID, 'SCHOOL_YEAR_ID:', SCHOOL_YEAR_ID);

        console.log('[1/6] Fetching teacher by PK...');
        const teacher = await db.teachers.findByPk(TEACHER_ID);
        console.log('[1/6] Teacher result:', teacher ? `found (ID: ${teacher.id})` : 'NOT FOUND');
        if (!teacher) {
            return res.status(404).send({ message: 'Teacher not found' });
        }

        console.log('[2/6] Fetching school year by PK...');
        const schoolYear = await db.school_years.findByPk(SCHOOL_YEAR_ID);
        console.log('[2/6] School year result:', schoolYear ? schoolYear.year : 'NOT FOUND');
        if (!schoolYear) {
            return res.status(404).send({ message: 'School year not found' });
        }

        console.log('[3/6] Querying teacher_assignments...');
        console.log('db.teacher_assignments exists?:', !!db.teacher_assignments);
        const assignments = await db.teacher_assignments.findAll({
            where: { teacher_id: TEACHER_ID, school_year_id: SCHOOL_YEAR_ID, status: 1 },
            include: [
                { model: db.grade_levels },
                { model: db.sections },
                { model: db.learning_areas },
            ],
        });
        console.log('[3/6] Assignments found:', assignments ? assignments.length : 0);
        if (assignments && assignments.length > 0) {
            assignments.forEach((a, i) => {
                console.log(`  Assignment ${i + 1}: subject=${a.learning_area ? a.learning_area.name : '?'}, section=${a.section ? a.section.name : '?'}, grade=${a.grade_level ? a.grade_level.name : '?'}`);
            });
        }

        console.log('[4/6] Fetching school...');
        const school = await db.schools.findOne({ where: { status: 1 } });
        console.log('[4/6] School result:', school ? school.school_name : 'NONE');

        console.log('[5/6] Counting students per assignment...');
        const classes = [];
        for (const assignment of assignments) {
            const studentCount = await db.learner_school_records.count({
                where: {
                    section_id: assignment.section_id,
                    school_year_id: SCHOOL_YEAR_ID,
                    grade_level_id: assignment.grade_level_id,
                    status: 1,
                },
            });
            console.log(`  Section "${assignment.section ? assignment.section.name : '?'}" has ${studentCount} students`);

            classes.push({
                assignmentId: assignment.id,
                subject: assignment.learning_area ? assignment.learning_area.name : null,
                subjectCode: assignment.learning_area ? assignment.learning_area.code : null,
                gradeLevel: assignment.grade_level ? assignment.grade_level.name : null,
                section: assignment.section ? assignment.section.name : null,
                sectionId: assignment.section_id,
                gradeLevelId: assignment.grade_level_id,
                studentCount,
            });
        }

        console.log('[6/6] Checking if teacher is section adviser...');
        console.log('db.sections exists?:', !!db.sections);
        const adviserSection = await db.sections.findOne({
            where: { adviser_teacher_id: TEACHER_ID, school_year_id: SCHOOL_YEAR_ID, status: 1 },
            include: [{ model: db.grade_levels }],
        });
        console.log('[6/6] Adviser section:', adviserSection ? `${adviserSection.name} (${adviserSection.grade_level ? adviserSection.grade_level.name : '?'})` : 'NONE');

        console.log('=== getMyClasses response ===');
        res.send({
            teacher: { id: teacher.id, name: `${teacher.first_name} ${teacher.last_name}` },
            school: school ? school.school_name : null,
            schoolYear: schoolYear.year,
            adviserOf: adviserSection
                ? { section: adviserSection.name, gradeLevel: adviserSection.grade_level ? adviserSection.grade_level.name : null }
                : null,
            classes,
        });
    } catch (error) {
        console.error('=== getMyClasses ERROR ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).send({ message: error.message });
    }
};

exports.getByLearningArea = async (req, res) => {
    try {
        console.log('=== getByLearningArea START ===');
        console.log('TEACHER_ID:', TEACHER_ID, 'SCHOOL_YEAR_ID:', SCHOOL_YEAR_ID);
        console.log('Request body:', JSON.stringify(req.body));

        console.log('[1/7] Fetching teacher by PK...');
        const teacher = await db.teachers.findByPk(TEACHER_ID);
        console.log('[1/7] Teacher result:', teacher ? `found (ID: ${teacher.id})` : 'NOT FOUND');
        if (!teacher) {
            return res.status(404).send({ message: 'Teacher not found' });
        }

        console.log('[2/7] Fetching school year by PK...');
        const schoolYear = await db.school_years.findByPk(SCHOOL_YEAR_ID);
        console.log('[2/7] School year result:', schoolYear ? schoolYear.year : 'NOT FOUND');
        if (!schoolYear) {
            return res.status(404).send({ message: 'School year not found' });
        }

        const { learningAreaCode, quarterId, sectionId } = req.body;

        if (!learningAreaCode) {
            return res.status(400).send({ message: 'Learning area code is required' });
        }
        if (!quarterId) {
            return res.status(400).send({ message: 'Quarter ID is required' });
        }

        const quarter = parseInt(quarterId, 10);

        console.log('[3/7] Fetching learning area by code:', learningAreaCode);
        const learningArea = await db.learning_areas.findOne({
            where: { code: learningAreaCode, status: 1 },
        });
        console.log('[3/7] Learning area result:', learningArea ? `${learningArea.name} (ID: ${learningArea.id})` : 'NOT FOUND');
        if (!learningArea) {
            return res.status(404).send({ message: 'Learning area not found' });
        }

        console.log('[4/7] Checking teacher assignment or advisory access...');
        console.log('db.teacher_assignments exists?:', !!db.teacher_assignments);

        let assignment = await db.teacher_assignments.findOne({
            where: {
                teacher_id: TEACHER_ID,
                school_year_id: SCHOOL_YEAR_ID,
                learning_area_id: learningArea.id,
                ...(sectionId ? { section_id: sectionId } : {}),
                status: 1,
            },
            include: [
                { model: db.grade_levels },
                { model: db.sections },
            ],
        });

        if (!assignment) {
            const adviserSection = await db.sections.findOne({
                where: {
                    adviser_teacher_id: TEACHER_ID,
                    school_year_id: SCHOOL_YEAR_ID,
                    ...(sectionId ? { id: sectionId } : {}),
                    status: 1,
                },
                include: [{ model: db.grade_levels }],
            });

            if (adviserSection) {
                assignment = {
                    grade_level_id: adviserSection.grade_level_id,
                    section_id: adviserSection.id,
                    grade_level: adviserSection.grade_level,
                    section: adviserSection,
                    learning_area: learningArea,
                };
                console.log('[4/7] Teacher is ADVISER of section "' + adviserSection.name + '" — granting access');
            }
        }

        console.log('[4/7] Assignment result:', assignment ? `FOUND: ${assignment.grade_level ? assignment.grade_level.name : '?'} - ${assignment.section ? assignment.section.name : '?'}` : 'NOT FOUND');
        if (!assignment) {
            return res.status(403).send({ message: 'You are not assigned to this subject or section' });
        }

        console.log('[5/7] Fetching school...');
        const school = await db.schools.findOne({ where: { status: 1 } });
        console.log('[5/7] School result:', school ? school.school_name : 'NONE');

        console.log('[6/7] Fetching learner school records...');
        const learnerSchoolRecords = await db.learner_school_records.findAll({
            where: {
                school_id: school ? school.id : null,
                school_year_id: SCHOOL_YEAR_ID,
                grade_level_id: assignment.grade_level_id,
                section_id: assignment.section_id,
                status: 1,
            },
            include: [{ model: db.learners }],
        });
        console.log('[6/7] Learner school records found:', learnerSchoolRecords ? learnerSchoolRecords.length : 0);

        console.log('[7/7] Processing grades for each student...');
        const students = [];
        for (const record of learnerSchoolRecords) {
            const learner = record.learner;
            if (!learner) {
                console.log('  Skipping record', record.id, '- no learner data');
                continue;
            }

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
            console.log(`  Student: ${name} (record ID: ${record.id}) - Grade found: ${!!grade}`);

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
                if (grade.termGrade >= 90) {
                    descriptor = 'Advance';
                } else if (grade.termGrade >= 85) {
                    descriptor = 'Proficient';
                } else if (grade.termGrade >= 80) {
                    descriptor = 'Approaching Proficiency';
                } else if (grade.termGrade >= 75) {
                    descriptor = 'Developing';
                } else if (grade.termGrade >= 66) {
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
                    descriptor,
                };
            }

            students.push({
                id: record.learner_id,
                learnerSchoolRecordId: record.id,
                name,
                subjects,
            });
        }

        console.log('=== getByLearningArea response ===');
        console.log('Students count:', students.length);
        res.send({
            schoolYear: schoolYear.year,
            school: school ? school.school_name : null,
            division: school ? school.division : null,
            region: school ? school.region : null,
            gradeLevel: assignment.grade_level ? assignment.grade_level.name : null,
            section: assignment.section ? assignment.section.name : null,
            subject: learningArea.name,
            quarter,
            learningArea: { id: learningArea.id, name: learningArea.name, code: learningArea.code },
            teacher: { id: teacher.id, name: `${teacher.first_name} ${teacher.last_name}` },
            students,
        });
    } catch (error) {
        console.error('=== getByLearningArea ERROR ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).send({ message: error.message });
    }
};

exports.saveGradeChange = async (req, res) => {
    try {
        console.log('=== saveGradeChange START ===');
        console.log('TEACHER_ID:', TEACHER_ID, 'SCHOOL_YEAR_ID:', SCHOOL_YEAR_ID);
        console.log('Request body:', JSON.stringify(req.body));

        console.log('[1/9] Fetching teacher by PK...');
        const teacher = await db.teachers.findByPk(TEACHER_ID);
        console.log('[1/9] Teacher result:', teacher ? `found (ID: ${teacher.id})` : 'NOT FOUND');
        if (!teacher) {
            return res.status(404).send({ message: 'Teacher not found' });
        }

        console.log('[2/9] Fetching school year by PK...');
        const schoolYear = await db.school_years.findByPk(SCHOOL_YEAR_ID);
        console.log('[2/9] School year result:', schoolYear ? schoolYear.year : 'NOT FOUND');
        if (!schoolYear) {
            return res.status(404).send({ message: 'School year not found' });
        }

        const { gradeChangeRecord, updatedStudentRecord, referenceData } = req.body;
        console.log('[3/9] referenceData:', JSON.stringify(referenceData));

        console.log('[4/9] Fetching learning area by name:', referenceData.learning_area);
        const learningArea = await db.learning_areas.findOne({
            where: { name: referenceData.learning_area, status: 1 },
        });
        console.log('[4/9] Learning area result:', learningArea ? `${learningArea.name} (ID: ${learningArea.id})` : 'NOT FOUND');
        if (!learningArea) {
            return res.status(404).send({ message: 'Learning area not found' });
        }

        const quarterId = parseInt(referenceData.quarter, 10);
        console.log('[5/9] Quarter ID:', quarterId);
        if (!quarterId) {
            return res.status(400).send({ message: `Invalid quarter: ${referenceData.quarter}` });
        }

        console.log('[6/9] Verifying teacher assignment or advisory access...');
        console.log('db.teacher_assignments exists?:', !!db.teacher_assignments);
        let assignment = await db.teacher_assignments.findOne({
            where: {
                teacher_id: TEACHER_ID,
                school_year_id: SCHOOL_YEAR_ID,
                learning_area_id: learningArea.id,
                status: 1,
            },
        });

        let isAdviserAccess = false;
        if (!assignment) {
            const lsr = await db.learner_school_records.findByPk(referenceData.learner_school_record_id);
            if (lsr && lsr.section_id) {
                isAdviserAccess = await isTeacherAdviserOfSection(TEACHER_ID, lsr.section_id);
                if (isAdviserAccess) {
                    assignment = { id: null };
                    console.log('[6/9] Teacher is ADVISER of this student\'s section — granting access');
                }
            }
        }

        console.log('[6/9] Assignment result:', assignment ? 'FOUND' : 'NOT FOUND - access denied');
        if (!assignment) {
            return res.status(403).send({ message: 'You are not assigned to this learning area' });
        }

        const subjectData = updatedStudentRecord.subjects[learningArea.name];
        console.log('[7/9] Subject data exists?:', !!subjectData);
        if (!subjectData) {
            return res.status(400).send({ message: `Subject data not found for ${learningArea.name}` });
        }

        // Find the original subject teacher for this learning area & section
        console.log('[8/9] Looking up original subject teacher...');
        const lsrForTeacher = await db.learner_school_records.findByPk(referenceData.learner_school_record_id);
        let originalSubjectTeacherId = null;
        if (lsrForTeacher && lsrForTeacher.section_id) {
            const subjectAssignment = await db.teacher_assignments.findOne({
                where: {
                    learning_area_id: learningArea.id,
                    school_year_id: SCHOOL_YEAR_ID,
                    section_id: lsrForTeacher.section_id,
                    status: 1,
                },
            });
            originalSubjectTeacherId = subjectAssignment ? subjectAssignment.teacher_id : null;
            console.log('[8/9] Original subject teacher ID:', originalSubjectTeacherId);
        }

        // Always: save snapshot for audit trail
        console.log('[9/9] Saving grade snapshot...');
        await db.grade_snapshots.create({
            learner_school_record_id: referenceData.learner_school_record_id,
            quarter_id: quarterId,
            teacher_id: originalSubjectTeacherId || TEACHER_ID,
            createdBy: TEACHER_ID,
            learning_area_id: learningArea.id,
            field: gradeChangeRecord ? gradeChangeRecord.field : 'initial_entry',
            previous_value: gradeChangeRecord ? gradeChangeRecord.previous_value : null,
            updated_value: gradeChangeRecord ? gradeChangeRecord.updated_value : null,
        });
        console.log('[9/9] Snapshot saved');

        console.log('Checking existing grade...');
        console.log('learner_school_record_id:', referenceData.learner_school_record_id);
        const existingGrade = await db.learner_grades.findOne({
            where: {
                learner_school_record_id: referenceData.learner_school_record_id,
                learning_area_id: learningArea.id,
                quarter_id: quarterId,
            },
        });
        console.log('Existing grade:', existingGrade ? `FOUND (ID: ${existingGrade.id})` : 'NOT FOUND - will create new');

        const gradeData = {
            learner_school_record_id: referenceData.learner_school_record_id,
            quarter_id: quarterId,
            teacher_id: originalSubjectTeacherId || TEACHER_ID,
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
        };

        if (!existingGrade) {
            console.log('Creating new grade record...');
            await db.learner_grades.create({ ...gradeData, status: 1 });
            console.log('Grade created successfully');
        } else {
            console.log('Updating existing grade...');
            await db.learner_grades.update(gradeData, {
                where: {
                    learner_school_record_id: referenceData.learner_school_record_id,
                    learning_area_id: learningArea.id,
                    quarter_id: quarterId,
                },
            });
            console.log('Grade updated successfully');
        }

        console.log('=== saveGradeChange response: success ===');
        res.send({ message: 'Grade saved successfully' });
    } catch (error) {
        console.error('=== saveGradeChange ERROR ===');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).send({ message: error.message });
    }
};


