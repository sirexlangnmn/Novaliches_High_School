module.exports = (sequelize, Sequelize) => {
    const LearnerSchoolRecords = sequelize.define('learner_school_records', {
        academic_record_id: {
            type: Sequelize.INTEGER,
        },
        school_id: {
            type: Sequelize.INTEGER,
        },
        school_year_id: {
            type: Sequelize.INTEGER,
        },
        grade_level_id: {
            type: Sequelize.INTEGER,
        },
        teacher_id: {
            type: Sequelize.INTEGER,
        },
        section: {
            type: Sequelize.STRING,
        },
        remedial_from: {
            type: Sequelize.DATEONLY,
        },
        remedial_to: {
            type: Sequelize.DATEONLY,
        },
        remedial_subject_1: {
            type: Sequelize.STRING,
        },
        remedial_final_rating_1: {
            type: Sequelize.DECIMAL(5, 2),
        },
        remedial_mark_1: {
            type: Sequelize.DECIMAL(5, 2),
        },
        recomputed_grade_1: {
            type: Sequelize.DECIMAL(5, 2),
        },
        remedial_remarks_1: {
            type: Sequelize.STRING,
        },
        remedial_subject_2: {
            type: Sequelize.STRING,
        },
        remedial_final_rating_2: {
            type: Sequelize.DECIMAL(5, 2),
        },
        remedial_mark_2: {
            type: Sequelize.DECIMAL(5, 2),
        },
        recomputed_grade_2: {
            type: Sequelize.DECIMAL(5, 2),
        },
        remedial_remarks_2: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    });

    return LearnerSchoolRecords;
};
