# Novaliches High School

A Node.js/Express web application for managing high school academic records, grades, learner profiles, and administrative workflows.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL (via Sequelize ORM)
- **Frontend:** EJS views, Tailwind CSS, Webpack
- **Auth:** Session-based with encryption routes
- **Extras:** PDF generation, email service, analytics

## Project Structure

```
Novaliches_High_School/
├── .env
├── .gitignore
├── .prettierrc.js
├── LICENSE
├── README.md
├── delete.txt
├── package.json
├── package-lock.json
├── style.css
├── tailwind.config.js
├── webpack.config.js
├── config/
│   └── config.json
├── public/
│   ├── robots.txt
│   ├── assets/
│   │   ├── style.css
│   │   ├── css/
│   │   │   ├── all.min.css
│   │   │   ├── animate.min.css
│   │   │   ├── bootstrap.min.css
│   │   │   ├── class-record.css
│   │   │   ├── datepicker.min.css
│   │   │   ├── fullcalendar.min.css
│   │   │   ├── jquery.dataTables.min.css
│   │   │   ├── main.css
│   │   │   ├── normalize.css
│   │   │   ├── select2.min.css
│   │   │   └── style.css
│   │   ├── data/
│   │   │   ├── students.json
│   │   │   ├── students copy.json
│   │   │   └── students copy 2.json
│   │   ├── fonts/
│   │   │   └── flaticon.css
│   │   ├── img/
│   │   │   ├── favicon.png
│   │   │   ├── logo.png
│   │   │   ├── logo1.png
│   │   │   ├── logo2.png
│   │   │   ├── preloader.gif
│   │   │   ├── Novaliches_High_School_Logo.png
│   │   │   ├── Novaliches_High_School_Logo_1.png
│   │   │   ├── Novaliches_High_School_Logo_2.png
│   │   │   ├── Novaliches_High_School_Logo_3.png
│   │   │   ├── Novaliches_High_School_Logo_4.png
│   │   │   ├── Novaliches_High_School_Logo_5.png
│   │   │   └── figure/
│   │   │       ├── admin.jpg
│   │   │       ├── login-bg.jpg
│   │   │       ├── parents.jpg
│   │   │       ├── teacher.jpg
│   │   │       ├── user.jpg
│   │   │       ├── user1.jpg
│   │   │       ├── user2.jpg
│   │   │       ├── user3.jpg
│   │   │       ├── user4.jpg
│   │   │       ├── user5.jpg
│   │   │       ├── student.png
│   │   │       ├── student1.png
│   │   │       ├── student1.jpg
│   │   │       ├── student2.png
│   │   │       ├── student3.png
│   │   │       ├── student4.png
│   │   │       ├── student5.png
│   │   │       ├── student6.png
│   │   │       ├── student7.png
│   │   │       ├── student8.png
│   │   │       ├── student9.png
│   │   │       ├── student10.png
│   │   │       ├── student11.png
│   │   │       ├── student12.png
│   │   │       └── student13.png
│   │   ├── js/
│   │   │   ├── Chart.min.js
│   │   │   ├── bootstrap.min.js
│   │   │   ├── class-record.js
│   │   │   ├── datepicker.min.js
│   │   │   ├── fullcalendar.min.js
│   │   │   ├── google-marker-map.js
│   │   │   ├── jquery-3.3.1.min.js
│   │   │   ├── jquery.counterup.min.js
│   │   │   ├── jquery.dataTables.min.js
│   │   │   ├── jquery.scrollUp.min.js
│   │   │   ├── jquery.waypoints.min.js
│   │   │   ├── main.js
│   │   │   ├── modernizr-3.6.0.min.js
│   │   │   ├── moment.min.js
│   │   │   ├── plugins.js
│   │   │   ├── popper.min.js
│   │   │   └── select2.min.js
│   │   └── webfonts/
│   │       ├── fa-brands-400.eot
│   │       ├── fa-brands-400.ttf
│   │       ├── fa-brands-400.woff
│   │       ├── fa-brands-400.woff2
│   │       ├── fa-regular-400.eot
│   │       ├── fa-regular-400.ttf
│   │       ├── fa-regular-400.woff
│   │       ├── fa-regular-400.woff2
│   │       ├── fa-solid-900.eot
│   │       ├── fa-solid-900.ttf
│   │       ├── fa-solid-900.woff
│   │       └── fa-solid-900.woff2
│   └── view/
│       ├── class-record/
│       │   ├── class-record.ejs
│       │   └── class-record copy.ejs
│       ├── forgot-password/
│       │   └── index.ejs
│       ├── form-137/
│       │   └── form-137.ejs
│       ├── home/
│       │   └── home.ejs
│       ├── includes/
│       │   ├── footer/
│       │   │   └── index.ejs
│       │   ├── head/
│       │   │   └── index.ejs
│       │   ├── header/
│       │   │   ├── index.ejs
│       │   │   └── for-email-verification.ejs
│       │   ├── header-for-registration-page/
│       │   │   └── index.ejs
│       │   ├── header-outside-home-page/
│       │   │   └── index.ejs
│       │   ├── header-outside-home-page-with-session/
│       │   │   └── index.ejs
│       │   ├── header_avatar/
│       │   │   └── index.ejs
│       │   ├── header_cart/
│       │   │   └── index.ejs
│       │   ├── header_logo/
│       │   │   └── index.ejs
│       │   ├── header_message/
│       │   │   └── index.ejs
│       │   ├── header_notif/
│       │   │   └── index.ejs
│       │   ├── nav/
│       │   │   ├── index.ejs
│       │   │   ├── primary-navigation.ejs
│       │   │   └── primary-navigation-script.ejs
│       │   ├── profile/
│       │   │   ├── button_action.ejs
│       │   │   ├── upgradeAsTraders.ejs
│       │   │   ├── upgradeToLarge.ejs
│       │   │   └── upgradeToMedium.ejs
│       │   ├── registration/
│       │   │   └── registration_nav.ejs
│       │   └── scripts/
│       │       └── index.ejs
│       ├── login/
│       │   └── login.ejs
│       ├── modal/
│       │   ├── awt_introduction.ejs
│       │   ├── client-email-the-trader.ejs
│       │   ├── communicator_link.ejs
│       │   ├── email-if-help-and-suggest-link-not-available.ejs
│       │   └── selectionQuestion.ejs
│       ├── registration-v2/
│       │   ├── index.ejs
│       │   ├── index copy.ejs
│       │   ├── index copy 2.ejs
│       │   ├── index copy 3.ejs
│       │   ├── index copy 4.ejs
│       │   └── index copy 5.ejs
│       ├── reset-password/
│       │   └── index.ejs
│       ├── students/
│       │   └── students.ejs
│       └── test/
│           └── index.ejs
└── app/
    ├── api/
    │   ├── README.md
    │   ├── swagger.yaml
    │   └── restAPI.png
    ├── config/
    │   ├── db.config.js
    │   ├── email.config.js
    │   └── sequelize.config.js
    ├── controllers/
    │   ├── index.js
    │   ├── class_records.controller.js
    │   ├── learning_areas.controller.js
    │   ├── registration_v2.controller.js
    │   └── users-accounts.controller.js
    ├── email_controllers/
    ├── middleware/
    │   ├── index.js
    │   ├── helmet/
    │   │   └── index.js
    │   ├── nonces/
    │   │   └── index.js
    │   └── validations/
    │       ├── large-scale-company-registration.validation.js
    │       ├── login_process.validations.js
    │       ├── medium-scale-company-registration.validation.js
    │       ├── registration_v2.validations.js
    │       ├── small-scale-company-registration.validation.js
    │       └── trader-scale-company-registration.validation.js
    ├── models/
    │   ├── README.md
    │   ├── index.js
    │   ├── academic_records.model.js
    │   ├── grade_levels.model.js
    │   ├── grade_snapshots.model.js
    │   ├── learner_grades.model.js
    │   ├── learner_jhs_eligibility.model.js
    │   ├── learner_school_records.model.js
    │   ├── learners.model.js
    │   ├── learning_areas.model.js
    │   ├── remedial_classes.model.js
    │   ├── reset_tokens.model.js
    │   ├── school_years.model.js
    │   ├── schools.model.js
    │   ├── teachers.model.js
    │   ├── user_accounts.model.js
    │   ├── user_download_histories.model.js
    │   ├── user_sessions.model.js
    │   └── users.model.js
    ├── query/
    │   ├── traders_visitors.query.js
    │   ├── users.query.js
    │   └── users_accounts.query.js
    ├── routes/
    │   ├── index.js
    │   ├── email-marketing.routes.js
    │   ├── encrypt.route.js
    │   ├── forgot-password.routes.js
    │   ├── password.routes.js
    │   ├── sequelize.route.js
    │   └── upload.routes.js
    ├── services/
    │   ├── analytics.service.js
    │   ├── email.service.js
    │   ├── pdf-service.js
    │   └── pdf-trader.js
    ├── shared/
    │   ├── ecdc.js
    │   └── email-template.js
    ├── src/
    │   ├── Logger.js
    │   └── server.js
    ├── ssl/
    │   ├── README.md
    │   ├── cert.pem
    │   ├── key.pem
    │   └── https.png
    └── utils/
        └── date.utils.js
```

## Complete File Listing

```
.env
.gitignore
.prettierrc.js
LICENSE
README.md
delete.txt
package.json
package-lock.json
style.css
tailwind.config.js
webpack.config.js
config/config.json
public/robots.txt
public/assets/style.css
public/assets/css/all.min.css
public/assets/css/animate.min.css
public/assets/css/bootstrap.min.css
public/assets/css/class-record.css
public/assets/css/datepicker.min.css
public/assets/css/fullcalendar.min.css
public/assets/css/jquery.dataTables.min.css
public/assets/css/main.css
public/assets/css/normalize.css
public/assets/css/select2.min.css
public/assets/css/style.css
public/assets/data/students.json
public/assets/data/students copy.json
public/assets/data/students copy 2.json
public/assets/fonts/flaticon.css
public/assets/fonts/Flaticon.eot
public/assets/fonts/Flaticon.ttf
public/assets/fonts/Flaticon.woff
public/assets/fonts/Flaticon.woff2
public/assets/fonts/Flaticon.svg
public/assets/img/favicon.png
public/assets/img/logo.png
public/assets/img/logo1.png
public/assets/img/logo2.png
public/assets/img/preloader.gif
public/assets/img/Novaliches_High_School_Logo.png
public/assets/img/Novaliches_High_School_Logo_1.png
public/assets/img/Novaliches_High_School_Logo_2.png
public/assets/img/Novaliches_High_School_Logo_3.png
public/assets/img/Novaliches_High_School_Logo_4.png
public/assets/img/Novaliches_High_School_Logo_5.png
public/assets/img/figure/admin.jpg
public/assets/img/figure/login-bg.jpg
public/assets/img/figure/parents.jpg
public/assets/img/figure/teacher.jpg
public/assets/img/figure/user.jpg
public/assets/img/figure/user1.jpg
public/assets/img/figure/user2.jpg
public/assets/img/figure/user3.jpg
public/assets/img/figure/user4.jpg
public/assets/img/figure/user5.jpg
public/assets/img/figure/student.png
public/assets/img/figure/student1.png
public/assets/img/figure/student1.jpg
public/assets/img/figure/student2.png
public/assets/img/figure/student3.png
public/assets/img/figure/student4.png
public/assets/img/figure/student5.png
public/assets/img/figure/student6.png
public/assets/img/figure/student7.png
public/assets/img/figure/student8.png
public/assets/img/figure/student9.png
public/assets/img/figure/student10.png
public/assets/img/figure/student11.png
public/assets/img/figure/student12.png
public/assets/img/figure/student13.png
public/assets/js/Chart.min.js
public/assets/js/bootstrap.min.js
public/assets/js/class-record.js
public/assets/js/datepicker.min.js
public/assets/js/fullcalendar.min.js
public/assets/js/google-marker-map.js
public/assets/js/jquery-3.3.1.min.js
public/assets/js/jquery.counterup.min.js
public/assets/js/jquery.dataTables.min.js
public/assets/js/jquery.scrollUp.min.js
public/assets/js/jquery.waypoints.min.js
public/assets/js/main.js
public/assets/js/modernizr-3.6.0.min.js
public/assets/js/moment.min.js
public/assets/js/plugins.js
public/assets/js/popper.min.js
public/assets/js/select2.min.js
public/assets/webfonts/fa-brands-400.eot
public/assets/webfonts/fa-brands-400.ttf
public/assets/webfonts/fa-brands-400.woff
public/assets/webfonts/fa-brands-400.woff2
public/assets/webfonts/fa-regular-400.eot
public/assets/webfonts/fa-regular-400.ttf
public/assets/webfonts/fa-regular-400.woff
public/assets/webfonts/fa-regular-400.woff2
public/assets/webfonts/fa-solid-900.eot
public/assets/webfonts/fa-solid-900.ttf
public/assets/webfonts/fa-solid-900.woff
public/assets/webfonts/fa-solid-900.woff2
public/view/class-record/class-record.ejs
public/view/class-record/class-record copy.ejs
public/view/forgot-password/index.ejs
public/view/form-137/form-137.ejs
public/view/home/home.ejs
public/view/includes/footer/index.ejs
public/view/includes/head/index.ejs
public/view/includes/header/index.ejs
public/view/includes/header/for-email-verification.ejs
public/view/includes/header-for-registration-page/index.ejs
public/view/includes/header-outside-home-page/index.ejs
public/view/includes/header-outside-home-page-with-session/index.ejs
public/view/includes/header_avatar/index.ejs
public/view/includes/header_cart/index.ejs
public/view/includes/header_logo/index.ejs
public/view/includes/header_message/index.ejs
public/view/includes/header_notif/index.ejs
public/view/includes/nav/index.ejs
public/view/includes/nav/primary-navigation.ejs
public/view/includes/nav/primary-navigation-script.ejs
public/view/includes/profile/button_action.ejs
public/view/includes/profile/upgradeAsTraders.ejs
public/view/includes/profile/upgradeToLarge.ejs
public/view/includes/profile/upgradeToMedium.ejs
public/view/includes/registration/registration_nav.ejs
public/view/includes/scripts/index.ejs
public/view/login/login.ejs
public/view/modal/awt_introduction.ejs
public/view/modal/client-email-the-trader.ejs
public/view/modal/communicator_link.ejs
public/view/modal/email-if-help-and-suggest-link-not-available.ejs
public/view/modal/selectionQuestion.ejs
public/view/registration-v2/index.ejs
public/view/registration-v2/index copy.ejs
public/view/registration-v2/index copy 2.ejs
public/view/registration-v2/index copy 3.ejs
public/view/registration-v2/index copy 4.ejs
public/view/registration-v2/index copy 5.ejs
public/view/reset-password/index.ejs
public/view/students/students.ejs
public/view/test/index.ejs
app/api/README.md
app/api/swagger.yaml
app/api/restAPI.png
app/config/db.config.js
app/config/email.config.js
app/config/sequelize.config.js
app/controllers/index.js
app/controllers/class_records.controller.js
app/controllers/learning_areas.controller.js
app/controllers/registration_v2.controller.js
app/controllers/users-accounts.controller.js
app/middleware/index.js
app/middleware/helmet/index.js
app/middleware/nonces/index.js
app/middleware/validations/large-scale-company-registration.validation.js
app/middleware/validations/login_process.validations.js
app/middleware/validations/medium-scale-company-registration.validation.js
app/middleware/validations/registration_v2.validations.js
app/middleware/validations/small-scale-company-registration.validation.js
app/middleware/validations/trader-scale-company-registration.validation.js
app/models/README.md
app/models/index.js
app/models/academic_records.model.js
app/models/grade_levels.model.js
app/models/grade_snapshots.model.js
app/models/learner_grades.model.js
app/models/learner_jhs_eligibility.model.js
app/models/learner_school_records.model.js
app/models/learners.model.js
app/models/learning_areas.model.js
app/models/remedial_classes.model.js
app/models/reset_tokens.model.js
app/models/school_years.model.js
app/models/schools.model.js
app/models/teachers.model.js
app/models/user_accounts.model.js
app/models/user_download_histories.model.js
app/models/user_sessions.model.js
app/models/users.model.js
app/query/traders_visitors.query.js
app/query/users.query.js
app/query/users_accounts.query.js
app/routes/index.js
app/routes/email-marketing.routes.js
app/routes/encrypt.route.js
app/routes/forgot-password.routes.js
app/routes/password.routes.js
app/routes/sequelize.route.js
app/routes/upload.routes.js
app/services/analytics.service.js
app/services/email.service.js
app/services/pdf-service.js
app/services/pdf-trader.js
app/shared/ecdc.js
app/shared/email-template.js
app/src/Logger.js
app/src/server.js
app/ssl/README.md
app/ssl/cert.pem
app/ssl/key.pem
app/ssl/https.png
app/utils/date.utils.js
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables (see .env)
# Configure database in config/config.json

# Start development server
npm run dev

# Build assets
npm run build
```
