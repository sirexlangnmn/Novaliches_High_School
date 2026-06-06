module.exports = (sequelize, Sequelize) => {
    const TeacherAssignments = sequelize.define('teacher_assignments', {
        teacher_id: {
            type: Sequelize.INTEGER,
        },
        school_year_id: {
            type: Sequelize.INTEGER,
        },
        grade_level_id: {
            type: Sequelize.INTEGER,
        },
        section_id: {
            type: Sequelize.INTEGER,
        },
        learning_area_id: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
        },
    }, { timestamps: true });

    return TeacherAssignments;
};
