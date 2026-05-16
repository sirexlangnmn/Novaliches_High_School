let currentLearningArea = null;
let studentsData = [];

function initClassRecord() {
    loadLearningAreas();
    document.getElementById('learning-areas').addEventListener('change', onLearningAreaChange);
}

function loadLearningAreas() {
    fetch('/api/get/learning-areas/all', { method: 'POST' })
        .then(function (res) { return res.json(); })
        .then(function (areas) {
            var select = document.getElementById('learning-areas');
            select.innerHTML = '<option value="">Select Learning Area</option>';
            areas.forEach(function (area) {
                var opt = document.createElement('option');
                opt.value = area.code;
                opt.textContent = area.name;
                select.appendChild(opt);
            });
        })
        .catch(function (err) { return console.error('Error loading learning areas:', err); });
}

function onLearningAreaChange() {
    var code = this.value;
    if (!code) {
        document.getElementById('student-rows').innerHTML = '';
        document.getElementById('subject-display').textContent = '\u2014';
        document.getElementById('teacher-name').textContent = '';
        currentLearningArea = null;
        studentsData = [];
        return;
    }
    fetchClassRecords(code);
}

function fetchClassRecords(code) {
    console.log('Fetching class records for learning area code:', code);
    var loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) loadingEl.style.display = 'inline';

    fetch('/api/get/class-records/by-learning-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learningAreaCode: code }),
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (loadingEl) loadingEl.style.display = 'none';
            if (data.message) {
                console.error('API error:', data.message);
                return;
            }
            currentLearningArea = data.learningArea;
            studentsData = data.students || [];
            document.getElementById('subject-display').textContent = data.learningArea.name;
            var teacher = data.students.length > 0 && data.students[0].teacher
                ? data.students[0].teacher : '';
            document.getElementById('teacher-name').textContent = teacher;
            populateTable();
        })
        .catch(function (err) {
            if (loadingEl) loadingEl.style.display = 'none';
            console.error('Error loading class records:', err);
        });
}

function populateTable() {
    var tbody = document.getElementById('student-rows');
    tbody.innerHTML = '';
    if (studentsData.length === 0) {
        var emptyRow = document.createElement('tr');
        var emptyCell = document.createElement('td');
        emptyCell.style.border = '1px solid #000';
        emptyCell.style.textAlign = 'center';
        emptyCell.style.padding = '20px';
        emptyCell.style.fontSize = '16px';
        emptyCell.style.color = '#999';
        emptyCell.textContent = 'No records found for this learning area.';
        emptyCell.colSpan = 7;
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        return;
    }
    studentsData.forEach(function (student, index) {
        var row = createStudentRow(student, index);
        tbody.appendChild(row);
    });
}

function createStudentRow(student, index) {
    var row = document.createElement('tr');

    var nameCell = document.createElement('td');
    nameCell.className = 'student-name';
    nameCell.style.border = '1px solid #000';
    nameCell.style.textAlign = 'left';
    nameCell.style.paddingLeft = '10px';
    nameCell.textContent = (index + 1) + '. ' + student.name;
    row.appendChild(nameCell);

    row.appendChild(createGradeCell(student.q1));
    row.appendChild(createGradeCell(student.q2));
    row.appendChild(createGradeCell(student.q3));
    row.appendChild(createGradeCell(student.q4));
    row.appendChild(createGradeCell(student.finalRating, true));

    var remarksCell = document.createElement('td');
    remarksCell.style.border = '1px solid #000';
    remarksCell.style.fontSize = '16px';
    remarksCell.style.textAlign = 'center';
    remarksCell.textContent = student.remarks || '';
    if (student.finalRating !== null && parseFloat(student.finalRating) < 75) {
        remarksCell.style.color = 'red';
        remarksCell.style.fontWeight = 'bold';
    }
    row.appendChild(remarksCell);

    return row;
}

function createGradeCell(value, bold) {
    var cell = document.createElement('td');
    cell.style.border = '1px solid #000';
    cell.style.fontSize = '16px';
    cell.style.textAlign = 'center';
    var num = parseFloat(value);
    cell.textContent = isNaN(num) ? '' : num.toFixed(2);
    if (bold) cell.style.fontWeight = 'bold';
    if (!isNaN(num) && num < 75) {
        cell.style.color = 'red';
    }
    return cell;
}

function collectAllData() {
    return {
        learningArea: currentLearningArea,
        students: studentsData,
    };
}
