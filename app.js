// === إعدادات الربط السحابي التلقائي (ضع قيمك هنا لتعمل السحابة للجميع تلقائياً) ===
const SUPABASE_URL = "https://iqobbavjpnrofpvrgptq.supabase.co"; // رابط مشروعك الحالي
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxb2JiYXZqcG5yb2ZwdnJncHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzYyNTUsImV4cCI6MjEwMzg1MjI1NX0.0sZLEP2ak-oHMLuOT2m81vD2XvikkqOlggDaZ0nf0dE"; // مفتاح anon للاتصال التلقائي للطلاب المعلمون والطلاب

// Default Initial Data (Seed)
const INITIAL_TEACHERS = [
    { id: 'mohammed', username: 'mohammed', name: 'أ.محمد علي', password: '123456' }
];

const INITIAL_COURSES = [
    {
        id: 'course-1',
        title: 'دورة تأسيس الجبر والهندسة',
        description: 'دورة تأسيسية متكاملة لشرح موضوعات الجبر، الهندسة الفراغية، والتناسب لطلاب القدرات والتحصيلي.',
        subject: 'qudrat',
        createdAt: '2026-07-12'
    }
];

const INITIAL_LESSONS = [
    {
        id: 'lesson-1',
        courseId: 'course-1',
        title: 'الدرس الأول: قوانين حساب مساحة المثلث والمربع',
        videoUrl: 'https://www.youtube.com/embed/V9_51dZ3D00',
        duration: '12:45'
    }
];

const INITIAL_QUIZZES = [
    {
        id: 'quiz-1',
        courseId: 'course-1',
        title: 'اختبار تشخيصي في الرياضيات والهندسة',
        points: 50,
        questions: [
            {
                question: 'ما مساحة مثلث طول قاعدته $٦$ سم وارتفاعه $٤$ سم؟',
                options: ['$١٢$ سم²', '$٢٤$ سم²', '$١٠$ سم²', '$٨$ سم²'],
                correct: 0
            },
            {
                question: 'إذا كان $س + ٣ = ٧$، فما قيمة $س^٢$؟',
                options: ['$٤$', '$١٦$', '$٩$', '$٢$'],
                correct: 1
            }
        ]
    }
];

const BADGE_DETAILS = {
    'first_step': { name: 'الخطوة الأولى', icon: 'fa-shoe-prints', desc: 'سلمت أول واجب بنجاح' },
    'math_master': { name: 'عبقري الرياضيات', icon: 'fa-square-root-variable', desc: 'حصلت على درجة كاملة في واجب رياضيات' },
    'xp_hunter': { name: 'صائد النقاط', icon: 'fa-dragon', desc: 'وصلت إلى المستوى الثاني أو أعلى' },
    'perfectionist': { name: 'العلامة الكاملة', icon: 'fa-star', desc: 'حصلت على تقييم 10/10' }
};

const SUBJECT_NAMES = {
    'math': 'رياضيات',
    'qudrat': 'قدرات',
    'tahsili': 'تحصيلي'
};

// Global App State
let appState = {
    currentUser: null, // { role: 'teacher'|'student', id: string, name: string }
    teachers: [],
    students: [],
    assignments: [],
    submissions: [],
    courses: [],
    lessons: [],
    quizzes: [],
    messages: []
};

// Cloud Client variables
let supabaseClient = null;
let isCloudMode = false;

// Active Student Quiz State
let activeQuizState = {
    quiz: null,
    currentQuestionIndex: 0,
    answers: [], // selected option indexes
    correctCount: 0
};

// MCQ active selection state for homework submission
let selectedSubmissionOptionTemp = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    checkAuthSession();
    setupDefaultDates();
    setupFormListeners();
    
    // Check for secret config query param (?config=true) to show settings buttons
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('config')) {
        const btn1 = document.getElementById('cloud-config-btn-container');
        const btn2 = document.getElementById('cloud-sync-setup-container');
        const btn3 = document.getElementById('header-cloud-btn');
        if (btn1) btn1.style.display = 'block';
        if (btn2) btn2.style.display = 'block';
        if (btn3) btn3.style.display = 'block';
    }
});

// Setup date input to default to tomorrow
function setupDefaultDates() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('assign-duedate');
    if (dateInput) {
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

// Setup Form Listeners
function setupFormListeners() {
    // Add default row in quiz creator modal
    const qContainer = document.getElementById('quiz-questions-editor-container');
    if (qContainer && qContainer.children.length === 0) {
        addQuizQuestionEditorRow();
    }
    
    // Wire cloud settings form
    const configForm = document.getElementById('cloud-config-form');
    if (configForm) {
        configForm.addEventListener('submit', handleSaveCloudConfig);
    }

    // Wire student self-registration form
    const regForm = document.getElementById('student-register-form');
    if (regForm) {
        regForm.addEventListener('submit', handleStudentRegister);
    }

    // Wire student chat send form
    const studentChatForm = document.getElementById('s-chat-send-form');
    if (studentChatForm) {
        studentChatForm.addEventListener('submit', handleSendStudentMessage);
    }
    
    // Wire teacher chat send form
    const teacherChatForm = document.getElementById('t-chat-send-form');
    if (teacherChatForm) {
        teacherChatForm.addEventListener('submit', handleSendTeacherMessage);
    }
}

// Database Init
function initDatabase() {
    if (!localStorage.getItem('masar_teachers')) {
        localStorage.setItem('masar_teachers', JSON.stringify(INITIAL_TEACHERS));
    }
    if (!localStorage.getItem('masar_students')) {
        localStorage.setItem('masar_students', JSON.stringify([]));
    }
    if (!localStorage.getItem('masar_assignments')) {
        localStorage.setItem('masar_assignments', JSON.stringify([]));
    }
    if (!localStorage.getItem('masar_submissions')) {
        localStorage.setItem('masar_submissions', JSON.stringify([]));
    }
    if (!localStorage.getItem('masar_courses')) {
        localStorage.setItem('masar_courses', JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem('masar_lessons')) {
        localStorage.setItem('masar_lessons', JSON.stringify(INITIAL_LESSONS));
    }
    if (!localStorage.getItem('masar_quizzes')) {
        localStorage.setItem('masar_quizzes', JSON.stringify(INITIAL_QUIZZES));
    }
    if (!localStorage.getItem('masar_messages')) {
        localStorage.setItem('masar_messages', JSON.stringify([]));
    }
    
    appState.teachers = JSON.parse(localStorage.getItem('masar_teachers'));
    appState.students = JSON.parse(localStorage.getItem('masar_students'));
    appState.assignments = JSON.parse(localStorage.getItem('masar_assignments'));
    appState.submissions = JSON.parse(localStorage.getItem('masar_submissions'));
    appState.courses = JSON.parse(localStorage.getItem('masar_courses'));
    appState.lessons = JSON.parse(localStorage.getItem('masar_lessons'));
    appState.quizzes = JSON.parse(localStorage.getItem('masar_quizzes'));
    appState.messages = JSON.parse(localStorage.getItem('masar_messages')) || [];
    
    // Connect to Supabase if config is hardcoded or saved in localStorage
    const savedUrl = localStorage.getItem('masar_cloud_url');
    const savedKey = localStorage.getItem('masar_cloud_key');
    
    const activeUrl = SUPABASE_URL || savedUrl;
    const activeKey = SUPABASE_KEY || savedKey;
    
    if (activeUrl && activeKey) {
        if (document.getElementById('cloud-url')) document.getElementById('cloud-url').value = activeUrl;
        if (document.getElementById('cloud-key')) document.getElementById('cloud-key').value = activeKey;
        
        connectSupabase(activeUrl, activeKey, false).then(() => {
            if (appState.currentUser) {
                showDashboard();
            } else {
                renderLandingPage();
            }
        });
    } else {
        updateCloudStatusUI(false);
        renderLandingPage();
    }
}

// Connect Supabase
async function connectSupabase(url, key, showToasts = true) {
    try {
        if (!url || !key) throw new Error("Empty credentials");
        
        const client = supabase.createClient(url, key);
        
        // Test query (fetch one row from teachers)
        const { data, error } = await client.from('teachers').select('id').limit(1);
        if (error) throw error;
        
        // Success
        supabaseClient = client;
        isCloudMode = true;
        
        localStorage.setItem('masar_cloud_url', url);
        localStorage.setItem('masar_cloud_key', key);
        
        updateCloudStatusUI(true);
        
        // Seed database if empty
        await checkAndSeedCloudDatabase();
        
        // Sync
        await syncFromCloud();
        
        if (showToasts) {
            showToast("متصل بقاعدة البيانات السحابية بنجاح! ⚡", "success");
        }
        return true;
    } catch (err) {
        console.error("Supabase Connection Error:", err);
        isCloudMode = false;
        supabaseClient = null;
        updateCloudStatusUI(false);
        if (showToasts) {
            showToast("فشل الاتصال بالسحابة! تفقد الرابط ومفتاح الاتصال.", "danger");
        }
        return false;
    }
}

// Sync all data from Supabase
async function syncFromCloud() {
    if (!isCloudMode || !supabaseClient) return;
    try {
        const { data: teachers, error: err0 } = await supabaseClient.from('teachers').select('*');
        const { data: students, error: err1 } = await supabaseClient.from('students').select('*');
        const { data: assignments, error: err2 } = await supabaseClient.from('assignments').select('*');
        const { data: submissions, error: err3 } = await supabaseClient.from('submissions').select('*');
        const { data: courses, error: err4 } = await supabaseClient.from('courses').select('*');
        const { data: lessons, error: err5 } = await supabaseClient.from('lessons').select('*');
        const { data: quizzes, error: err6 } = await supabaseClient.from('quizzes').select('*');
        
        let messages = [];
        try {
            const { data: msgs, error: err7 } = await supabaseClient.from('messages').select('*').order('created_at', { ascending: true });
            if (msgs) messages = msgs;
        } catch (msgErr) {
            console.warn("Messages table sync bypassed (Run SQL script to enable chat):", msgErr);
        }
        
        if (err0 || err1 || err2 || err3 || err4 || err5 || err6) throw new Error("Fetch failed");
        
        appState.teachers = teachers || [];
        appState.messages = (messages || []).map(m => ({
            id: m.id,
            senderId: m.sender_id,
            senderRole: m.sender_role,
            receiverId: m.receiver_id,
            receiverRole: m.receiver_role,
            content: m.content,
            createdAt: m.created_at
        }));
        
        // Map students with enrolled_courses column
        appState.students = (students || []).map(s => ({
            id: s.id,
            username: s.username,
            name: s.name,
            password: s.password,
            xp: s.xp || 0,
            badges: s.badges || [],
            enrolled_courses: s.enrolled_courses || []
        }));
        
        appState.assignments = (assignments || []).map(a => ({
            id: a.id,
            title: a.title,
            desc: a.description,
            subject: a.subject,
            points: a.points,
            dueDate: a.due_date,
            targetStudent: a.target_student,
            options: a.options || [],
            correctOption: a.correct_option !== undefined ? a.correct_option : -1
        }));
        
        appState.submissions = (submissions || []).map(s => ({
            id: s.id,
            assignmentId: s.assignment_id,
            studentId: s.student_id,
            answer: s.answer,
            link: s.link,
            status: s.status,
            grade: s.grade,
            feedback: s.feedback,
            submittedAt: s.submitted_at,
            gradedAt: s.graded_at,
            bonusXp: s.bonus_xp,
            selectedOption: s.selected_option !== undefined ? s.selected_option : -1
        }));

        appState.courses = (courses || []).map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            subject: c.subject,
            createdAt: c.created_at
        }));

        appState.lessons = (lessons || []).map(l => ({
            id: l.id,
            courseId: l.course_id,
            title: l.title,
            videoUrl: l.video_url,
            duration: l.duration
        }));

        appState.quizzes = (quizzes || []).map(q => ({
            id: q.id,
            courseId: q.course_id,
            title: q.title,
            questions: typeof q.questions === 'string' ? JSON.parse(q.questions) : q.questions,
            points: q.points
        }));
        
        console.log("Synced successfully from Supabase cloud database.");
    } catch (err) {
        console.error("Sync error:", err);
        showToast("خطأ أثناء مزامنة البيانات من السحابة!", "danger");
    }
}

// Seed cloud DB if empty
async function checkAndSeedCloudDatabase() {
    if (!isCloudMode || !supabaseClient) return;
    try {
        const { count, error } = await supabaseClient
            .from('teachers')
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        if (count === 0) {
            console.log("Cloud Database is empty. Seeding teacher...");
            
            // Seed teachers
            await supabaseClient.from('teachers').insert(INITIAL_TEACHERS);
            
            // Seed initial courses if course table is empty
            const { count: cCount } = await supabaseClient.from('courses').select('*', { count: 'exact', head: true });
            if (cCount === 0) {
                const mappedCourses = INITIAL_COURSES.map(c => ({
                    id: c.id,
                    title: c.title,
                    description: c.description,
                    subject: c.subject,
                    created_at: c.createdAt
                }));
                await supabaseClient.from('courses').insert(mappedCourses);

                const mappedLessons = INITIAL_LESSONS.map(l => ({
                    id: l.id,
                    course_id: l.courseId,
                    title: l.title,
                    video_url: l.videoUrl,
                    duration: l.duration
                }));
                await supabaseClient.from('lessons').insert(mappedLessons);

                const mappedQuizzes = INITIAL_QUIZZES.map(q => ({
                    id: q.id,
                    course_id: q.courseId,
                    title: q.title,
                    questions: q.questions,
                    points: q.points
                }));
                await supabaseClient.from('quizzes').insert(mappedQuizzes);
            }
            
            console.log("Successfully seeded starter data on Supabase!");
        }
    } catch (err) {
        console.error("Error seeding cloud DB:", err);
    }
}

// Save Cloud Config Form
async function handleSaveCloudConfig(e) {
    e.preventDefault();
    const url = document.getElementById('cloud-url').value.trim();
    const key = document.getElementById('cloud-key').value.trim();
    const feedback = document.getElementById('cloud-config-feedback');
    
    if (!url || !key) {
        showToast("يرجى إدخال الرابط والمفتاح", "danger");
        return;
    }
    
    feedback.style.display = 'block';
    feedback.className = '';
    feedback.style.background = 'rgba(255, 255, 255, 0.05)';
    feedback.style.color = 'var(--text-muted)';
    feedback.textContent = "جاري الاتصال واختبار الجداول...";
    
    const success = await connectSupabase(url, key, true);
    
    if (success) {
        feedback.className = 'success';
        feedback.textContent = "تم الاتصال بنجاح وتفعيل التزامن السحابي!";
        setTimeout(() => {
            closeModal('cloud-config-modal');
            showDashboard();
        }, 1500);
    } else {
        feedback.className = 'error';
        feedback.textContent = "فشل الاتصال! يرجى تهيئة الجداول في سوبابيس (SQL Editor) أولاً.";
    }
}

// Disconnect Cloud Mode
function clearCloudConfig() {
    localStorage.removeItem('masar_cloud_url');
    localStorage.removeItem('masar_cloud_key');
    isCloudMode = false;
    supabaseClient = null;
    updateCloudStatusUI(false);
    
    // Load local database
    appState.teachers = JSON.parse(localStorage.getItem('masar_teachers')) || INITIAL_TEACHERS;
    appState.students = JSON.parse(localStorage.getItem('masar_students')) || [];
    appState.assignments = JSON.parse(localStorage.getItem('masar_assignments')) || [];
    appState.submissions = JSON.parse(localStorage.getItem('masar_submissions')) || [];
    appState.courses = JSON.parse(localStorage.getItem('masar_courses')) || INITIAL_COURSES;
    appState.lessons = JSON.parse(localStorage.getItem('masar_lessons')) || INITIAL_LESSONS;
    appState.quizzes = JSON.parse(localStorage.getItem('masar_quizzes')) || INITIAL_QUIZZES;
    appState.messages = JSON.parse(localStorage.getItem('masar_messages')) || [];
    
    document.getElementById('cloud-url').value = '';
    document.getElementById('cloud-key').value = '';
    
    const feedback = document.getElementById('cloud-config-feedback');
    feedback.style.display = 'block';
    feedback.className = 'error';
    feedback.style.background = 'rgba(245, 158, 11, 0.1)';
    feedback.style.color = 'var(--warning)';
    feedback.textContent = "تم قطع الاتصال والتحول للوضع المحلي.";
    
    showToast("تم التحول إلى وضع التشغيل المحلي 🔌", "warning");
    
    setTimeout(() => {
        closeModal('cloud-config-modal');
        showDashboard();
    }, 1500);
}

// Update Cloud badge UI
function updateCloudStatusUI(connected) {
    const badge = document.getElementById('cloud-status-badge');
    const text = document.getElementById('cloud-status-text');
    const loginIndicator = document.getElementById('login-cloud-indicator');
    
    if (connected) {
        if (badge) {
            badge.style.display = 'inline-flex';
            badge.className = 'cloud-badge cloud';
            text.textContent = 'سحابة نشطة';
        }
        if (loginIndicator) {
            loginIndicator.textContent = 'الوضع السحابي نشط ⚡';
            loginIndicator.style.color = 'var(--success)';
        }
    } else {
        if (badge) {
            badge.style.display = 'none';
            badge.className = 'cloud-badge local';
            text.textContent = 'وضع محلي';
        }
        if (loginIndicator) {
            loginIndicator.textContent = 'تفعيل الربط السحابي (مزامنة الأجهزة)';
            loginIndicator.style.color = 'var(--accent-orange)';
        }
    }
}

// Reset data to defaults
function resetDemoData() {
    // Hidden / Deleted
}

// Check session
function checkAuthSession() {
    const cachedUser = localStorage.getItem('masar_current_user');
    if (cachedUser) {
        appState.currentUser = JSON.parse(cachedUser);
        showDashboard();
    } else {
        showLandingPage();
    }
}

// Render Math Formula with KaTeX
function renderMath(elementId) {
    if (!window.renderMathInElement) return;
    const target = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (target) {
        renderMathInElement(target, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

// Toast Notification
function showToast(message, type = 'orange') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'fa-info-circle';
    if (type === 'success') {
        icon = 'fa-circle-check';
        toast.style.borderRightColor = 'var(--success)';
    } else if (type === 'danger') {
        icon = 'fa-triangle-exclamation';
        toast.style.borderRightColor = 'var(--danger)';
    } else if (type === 'warning') {
        icon = 'fa-circle-exclamation';
        toast.style.borderRightColor = 'var(--warning)';
    }
    
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Handle Login Screen Role Toggle
let selectedRole = 'teacher';
function selectLoginRole(role) {
    selectedRole = role;
    document.getElementById('role-teacher').classList.toggle('active', role === 'teacher');
    document.getElementById('role-student').classList.toggle('active', role === 'student');
    
    const studentInputs = document.getElementById('student-login-inputs');
    const teacherInputs = document.getElementById('teacher-login-inputs');
    
    if (role === 'student') {
        studentInputs.style.display = 'block';
        teacherInputs.style.display = 'none';
    } else {
        studentInputs.style.display = 'none';
        teacherInputs.style.display = 'block';
    }
}

// Execute Login
async function handleLogin(e) {
    e.preventDefault();
    
    if (isCloudMode) await syncFromCloud();
    
    if (selectedRole === 'teacher') {
        const usernameInput = document.getElementById('teacher-username-input').value.trim().toLowerCase();
        const pwdInput = document.getElementById('teacher-pwd-input').value.trim();
        
        if (!usernameInput || !pwdInput) {
            showToast('يرجى كتابة اسم المستخدم وكلمة المرور للمعلم!', 'danger');
            return;
        }
        
        const teacher = appState.teachers.find(t => t.username === usernameInput && t.password === pwdInput);
        
        if (teacher) {
            appState.currentUser = {
                role: 'teacher',
                id: teacher.id,
                name: teacher.name
            };
            showToast(`أهلاً بك يا ${teacher.name}، تم تسجيل دخولك كمعلم شريك.`, 'success');
        } else {
            showToast('بيانات دخول المعلم غير صحيحة!', 'danger');
            return;
        }
    } else {
        const usernameInput = document.getElementById('student-username-input').value.trim().toLowerCase();
        const pwdInput = document.getElementById('student-pwd-input').value.trim();
        
        if (!usernameInput || !pwdInput) {
            showToast('يرجى ملء جميع الحقول', 'danger');
            return;
        }
        
        const student = appState.students.find(s => s.username === usernameInput && s.password === pwdInput);
        
        if (student) {
            appState.currentUser = {
                role: 'student',
                id: student.id,
                name: student.name
            };
            showToast(`مرحباً بك يا ${student.name} في لوحة تحكم الطالب!`, 'success');
        } else {
            showToast('اسم المستخدم أو كلمة المرور غير صحيحة!', 'danger');
            return;
        }
    }
    
    localStorage.setItem('masar_current_user', JSON.stringify(appState.currentUser));
    showDashboard();
}

// Log out
function logout() {
    localStorage.removeItem('masar_current_user');
    appState.currentUser = null;
    showLandingPage();
    showToast('تم تسجيل الخروج بنجاح', 'success');
}

// Routing views
function showLandingPage() {
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('landing-view').style.display = 'block';
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('teacher-view').style.display = 'none';
    document.getElementById('student-view').style.display = 'none';
    
    if (isCloudMode) {
        syncFromCloud().then(() => renderLandingPage());
    } else {
        renderLandingPage();
    }
}

function showLogin() {
    document.getElementById('app-header').style.display = 'none';
    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('login-view').style.display = 'flex';
    document.getElementById('teacher-view').style.display = 'none';
    document.getElementById('student-view').style.display = 'none';
    
    document.getElementById('teacher-username-input').value = '';
    document.getElementById('teacher-pwd-input').value = '';
    document.getElementById('student-username-input').value = '';
    document.getElementById('student-pwd-input').value = '';
}

async function showDashboard() {
    document.getElementById('app-header').style.display = 'block';
    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('login-view').style.display = 'none';
    
    const headerName = document.getElementById('header-user-name');
    const headerBadge = document.getElementById('header-user-badge');
    
    headerName.textContent = appState.currentUser.name;
    
    if (appState.currentUser.role === 'teacher') {
        headerBadge.className = 'user-badge teacher';
        headerBadge.querySelector('.role-dot').style.background = 'var(--accent-orange)';
        document.getElementById('teacher-view').style.display = 'block';
        document.getElementById('student-view').style.display = 'none';
        await renderTeacherDashboard();
    } else {
        headerBadge.className = 'user-badge student';
        headerBadge.querySelector('.role-dot').style.background = 'var(--success)';
        document.getElementById('teacher-view').style.display = 'none';
        document.getElementById('student-view').style.display = 'block';
        await renderStudentDashboard();
    }
}

// Switch interior tabs
function switchTab(dashboardRole, tabId, btnEl) {
    const viewContainerId = dashboardRole === 'teacher' ? 'teacher-view' : 'student-view';
    const container = document.getElementById(viewContainerId);
    
    container.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
    
    container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Calculate level dynamically based on XP
function calculateLevel(xp) {
    const level = Math.floor(xp / 200) + 1;
    const currentXpInLevel = xp % 200;
    const progressPercent = (currentXpInLevel / 200) * 100;
    
    let title = 'مبتدئ';
    if (level === 2) title = 'مكافح ⚡';
    if (level === 3) title = 'ذكي 🧠';
    if (level >= 4) title = 'أسطوري 🏆';
    
    return { level, currentXpInLevel, progressPercent, title };
}

// Modal actions
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        
        if (id === 'student-course-modal') {
            const video = document.getElementById('s-course-video-player');
            const iframe = document.getElementById('s-course-iframe-player');
            if (video) {
                video.pause();
                video.src = '';
            }
            if (iframe) {
                iframe.src = '';
            }
        }
    }
}

// ==========================================
// LANDING PAGE LOGIC [NEW]
// ==========================================

function renderLandingPage() {
    const grid = document.getElementById('landing-courses-grid');
    const countEl = document.getElementById('landing-courses-count');
    if (!grid) return;
    
    grid.innerHTML = '';
    countEl.textContent = `${appState.courses.length} دورات متاحة`;
    
    if (appState.courses.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-graduation-cap"></i>
                <p>لا توجد دورات تعليمية منشورة حالياً في المنصة.</p>
            </div>`;
        return;
    }
    
    appState.courses.forEach(course => {
        const lessonsCount = appState.lessons.filter(l => l.courseId === course.id).length;
        const quizzesCount = appState.quizzes.filter(q => q.courseId === course.id).length;

        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header">
                    <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">${course.title}</h4>
                <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px;">${course.description}</p>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
                    <span><i class="fa-solid fa-video" style="color: var(--accent-orange);"></i> الدروس: ${lessonsCount}</span>
                    <span><i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i> الاختبارات: ${quizzesCount}</span>
                </div>
            </div>
            
            <button class="btn btn-secondary" onclick="showLogin()" style="width: 100%; border-color: var(--accent-orange); color: var(--accent-orange);">
                <i class="fa-solid fa-lock"></i> سجل دخول للتصفح والاشتراك
            </button>
        `;
        grid.appendChild(card);
    });
}

// Student self registration handler
async function handleStudentRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const password = document.getElementById('reg-pwd').value.trim();
    
    if (!name || !username || !password) {
        showToast("يرجى ملء جميع الحقول!", "danger");
        return;
    }
    
    if (username === 'mohammed') {
        showToast("اسم المستخدم محجوز لحساب المعلم!", "danger");
        return;
    }
    
    if (isCloudMode) await syncFromCloud();
    
    const duplicate = appState.students.some(s => s.username === username) || appState.teachers.some(t => t.username === username);
    if (duplicate) {
        showToast("اسم المستخدم هذا مسجل مسبقاً!", "danger");
        return;
    }
    
    const newStudent = {
        id: username,
        username: username,
        name: name,
        password: password,
        xp: 0,
        badges: [],
        enrolled_courses: []
    };
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('students').insert({
                id: newStudent.id,
                username: newStudent.username,
                name: newStudent.name,
                password: newStudent.password,
                xp: newStudent.xp,
                badges: newStudent.badges,
                enrolled_courses: newStudent.enrolled_courses
            });
            if (error) throw error;
        } else {
            appState.students.push(newStudent);
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        }
        
        closeModal('student-register-modal');
        document.getElementById('student-register-form').reset();
        showToast(`تهانينا يا ${name}! تم إنشاء حسابك بنجاح.`, "success");
        
        // Log them in immediately
        appState.currentUser = {
            role: 'student',
            id: newStudent.id,
            name: newStudent.name
        };
        localStorage.setItem('masar_current_user', JSON.stringify(appState.currentUser));
        showDashboard();
    } catch (err) {
        console.error(err);
        showToast("فشل إنشاء الحساب سحابياً!", "danger");
    }
}

// ==========================================
// TEACHER DASHBOARD LOGIC
// ==========================================

async function renderTeacherDashboard() {
    if (isCloudMode) await syncFromCloud();

    // Populate Target Student options dynamically
    const assignStudentSelect = document.getElementById('assign-student');
    assignStudentSelect.innerHTML = '<option value="all">كل الطلاب</option>';
    appState.students.forEach(stud => {
        const option = document.createElement('option');
        option.value = stud.id;
        option.textContent = stud.name;
        assignStudentSelect.appendChild(option);
    });

    // Stats
    document.getElementById('t-stat-students').textContent = appState.students.length;
    const pendingSubmissions = appState.submissions.filter(s => s.status === 'pending');
    document.getElementById('t-stat-pending').textContent = pendingSubmissions.length;
    
    const badge = document.getElementById('t-submission-badge');
    if (pendingSubmissions.length > 0) {
        badge.textContent = pendingSubmissions.length;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
    
    document.getElementById('t-stat-courses').textContent = appState.courses.length;
    document.getElementById('t-assignments-count').textContent = `${appState.assignments.length} واجبات مضافة`;

    renderTeacherAssignments();
    renderTeacherSubmissions(pendingSubmissions);
    renderTeacherStudents();
    renderTeacherCourses();
    renderTeacherAccountSettings();
    
    // Populate Students Select inside Chat Tab
    const studentSelect = document.getElementById('t-chat-student-select');
    if (studentSelect) {
        const previousVal = studentSelect.value;
        studentSelect.innerHTML = '';
        appState.students.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = s.name;
            studentSelect.appendChild(option);
        });
        if (previousVal && appState.students.some(s => s.id === previousVal)) {
            studentSelect.value = previousVal;
        }
        renderTeacherChatHistory();
    }
    
    renderMath('teacher-view');
}

function renderTeacherAssignments() {
    const tAssignmentsList = document.getElementById('t-assignments-list');
    tAssignmentsList.innerHTML = '';
    
    if (appState.assignments.length === 0) {
        tAssignmentsList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open"></i>
                <p>لا يوجد واجبات حالياً. ابدأ بإنشاء واجبك الأول!</p>
            </div>`;
    } else {
        const sortedAssignments = [...appState.assignments].reverse();
        sortedAssignments.forEach(assign => {
            const submissionsCount = appState.submissions.filter(s => s.assignmentId === assign.id).length;
            const gradedCount = appState.submissions.filter(s => s.assignmentId === assign.id && s.status === 'graded').length;
            const targetStudentName = assign.targetStudent === 'all' ? 'جميع الطلاب' : (appState.students.find(s => s.id === assign.targetStudent)?.name || 'طالب محدد');
            
            const card = document.createElement('div');
            card.className = 'assignment-card';
            card.innerHTML = `
                <div class="assignment-header">
                    <div>
                        <span class="assignment-subject subject-${assign.subject}">${SUBJECT_NAMES[assign.subject]}</span>
                        <h4 class="assignment-title" style="margin-top: 8px;">${assign.title}</h4>
                    </div>
                    <div style="text-align: left;">
                        <span style="font-weight: 700; color: var(--text-orange); font-size: 15px;">${assign.points} XP</span>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">المستهدف: ${targetStudentName}</div>
                    </div>
                </div>
                
                <p style="font-size: 14px; color: var(--text-muted); white-space: pre-line; line-height: 1.5;">${assign.desc}</p>
                
                <div class="assignment-meta">
                    <span><i class="fa-regular fa-calendar"></i> تاريخ التسليم: ${assign.dueDate}</span>
                    <span><i class="fa-solid fa-users"></i> تسليمات الطلاب: ${submissionsCount} / ${assign.targetStudent === 'all' ? appState.students.length : 1}</span>
                    <span><i class="fa-solid fa-circle-check" style="color: var(--success);"></i> تم تصحيح: ${gradedCount}</span>
                </div>
                
                <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                    <button class="btn btn-danger btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="deleteAssignment('${assign.id}')">
                        <i class="fa-regular fa-trash-can"></i> حذف الواجب
                    </button>
                </div>
            `;
            tAssignmentsList.appendChild(card);
        });
    }
}

function renderTeacherSubmissions(pendingSubmissions) {
    const tSubmissionsList = document.getElementById('t-submissions-list');
    tSubmissionsList.innerHTML = '';
    
    if (pendingSubmissions.length === 0) {
        tSubmissionsList.innerHTML = `
            <div class="empty-state" style="padding: 60px 20px;">
                <i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 48px;"></i>
                <p style="margin-top: 15px;">رائع! لا يوجد تسليمات بانتظار التصحيح حالياً.</p>
            </div>`;
    } else {
        pendingSubmissions.forEach(sub => {
            const student = appState.students.find(s => s.id === sub.studentId);
            const assign = appState.assignments.find(a => a.id === sub.assignmentId);
            
            if (!student || !assign) return;
            
            const div = document.createElement('div');
            div.className = 'submission-item';
            div.innerHTML = `
                <div class="submission-header">
                    <div class="submission-student-info">
                        <div class="student-avatar" style="width: 32px; height: 32px; font-size: 14px;">${student.name.charAt(0)}</div>
                        <div>
                            <strong>${student.name}</strong>
                            <span style="font-size: 11px; color: var(--text-muted); margin-right: 6px;">تاريخ الإرسال: ${sub.submittedAt}</span>
                        </div>
                    </div>
                    <span class="assignment-subject subject-${assign.subject}">${SUBJECT_NAMES[assign.subject]}</span>
                </div>
                
                <div>
                    <span style="font-size: 12px; color: var(--text-muted);">حل واجب:</span>
                    <strong style="font-size: 14px; color: var(--text-main); display: block; margin: 2px 0 6px 0;">${assign.title}</strong>
                </div>
                
                <div class="submission-content-preview">
                    ${sub.answer.length > 120 ? sub.answer.substring(0, 120) + '...' : sub.answer}
                </div>
                
                <div class="submission-grade-action">
                    <span style="font-size: 13px; color: var(--text-orange); font-weight: 700;">
                        <i class="fa-solid fa-bolt"></i> يستحق: ${assign.points} XP
                    </span>
                    <button class="btn btn-primary" style="padding: 8px 16px; font-size: 13px;" onclick="openGradeModal('${sub.id}')">
                        <i class="fa-solid fa-pen-fancy"></i> تصحيح وإعطاء درجة
                    </button>
                </div>
            `;
            tSubmissionsList.appendChild(div);
        });
    }
}

function renderTeacherStudents() {
    const tStudentsList = document.getElementById('t-students-list');
    tStudentsList.innerHTML = '';
    
    appState.students.forEach(student => {
        const studentLevelInfo = calculateLevel(student.xp);
        const assignedCount = appState.assignments.filter(a => a.targetStudent === 'all' || a.targetStudent === student.id).length;
        const studentSubmissions = appState.submissions.filter(s => s.studentId === student.id && s.status === 'graded');
        const completionRate = assignedCount > 0 ? Math.round((studentSubmissions.length / assignedCount) * 100) : 0;
        
        let badgesHtml = '';
        student.badges.forEach(bKey => {
            const b = BADGE_DETAILS[bKey];
            if (b) {
                badgesHtml += `<span class="badge-item active" title="${b.desc}"><i class="fa-solid ${b.icon}"></i> ${b.name}</span>`;
            }
        });
        
        if (badgesHtml === '') {
            badgesHtml = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا توجد أوسمة بعد</span>';
        }
        
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.padding = '20px';
        card.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="student-avatar" style="width: 44px; height: 44px; font-size: 16px;">${student.name.charAt(0)}</div>
                    <div>
                        <h4 style="font-size: 15px; font-weight: 700;">${student.name}</h4>
                        <span class="student-level">${studentLevelInfo.title} (مستوى ${studentLevelInfo.level})</span>
                    </div>
                </div>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="deleteStudent('${student.id}')" title="حذف حساب الطالب">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
            
            <div style="background: rgba(0,0,0,0.15); border-radius: 8px; padding: 8px; margin-bottom: 15px; font-size: 12px; border: 1px solid rgba(255,255,255,0.03);">
                <div><strong>اسم المستخدم:</strong> <code style="color: var(--text-orange);">${student.username}</code></div>
                <div style="margin-top: 2px;"><strong>كلمة المرور:</strong> <code>${student.password}</code></div>
                <div style="margin-top: 4px; color: var(--success); font-weight: 700;"><strong>الدورات المشترك بها:</strong> ${(student.enrolled_courses || []).length}</div>
            </div>
            
            <div class="xp-bar-container" style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 2px;">
                    <span>النقاط: ${student.xp} XP</span>
                    <span>${Math.round(studentLevelInfo.progressPercent)}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${studentLevelInfo.progressPercent}%; background: var(--purple-xp);"></div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 12px;">
                <span style="color: var(--text-muted);">نسبة الإنجاز:</span>
                <strong>${completionRate}% (${studentSubmissions.length}/${assignedCount})</strong>
            </div>
            
            <div style="margin-bottom: 15px;">
                <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">الأوسمة:</span>
                <div class="badges-container">
                    ${badgesHtml}
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; display: flex; gap: 8px;">
                <button class="btn btn-secondary" style="flex: 1; padding: 6px; font-size: 12.5px; border-color: var(--accent-orange); color: var(--text-orange);" onclick="openAdjustXPModal('${student.id}')">
                    <i class="fa-solid fa-sliders"></i> تعديل النقاط (XP)
                </button>
                <button class="btn btn-primary" style="flex: 1; padding: 6px; font-size: 12.5px;" onclick="openEnrollmentModal('${student.id}')">
                    <i class="fa-solid fa-graduation-cap"></i> إدارة الاشتراكات
                </button>
            </div>
        `;
        tStudentsList.appendChild(card);
    });
}

// Student Course Enrollment functions [NEW]
function openEnrollmentModal(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('enrollment-student-id').value = studentId;
    document.getElementById('enrollment-student-name').textContent = student.name;
    
    const list = document.getElementById('enrollment-courses-list');
    list.innerHTML = '';
    
    const enrolledList = student.enrolled_courses || [];
    
    if (appState.courses.length === 0) {
        list.innerHTML = '<span style="font-size: 12.5px; color: var(--text-muted); font-style: italic;">لا توجد دورات مضافة بالمنصة لربطها للطالب</span>';
        return;
    }
    
    appState.courses.forEach(course => {
        const isChecked = enrolledList.includes(course.id) ? 'checked' : '';
        const label = document.createElement('label');
        label.className = 'enrollment-checkbox-item';
        label.innerHTML = `
            <input type="checkbox" value="${course.id}" ${isChecked}>
            <span>${course.title} (${SUBJECT_NAMES[course.subject] || course.subject})</span>
        `;
        list.appendChild(label);
    });
    
    openModal('student-enrollment-modal');
}

async function handleSaveEnrollment(e) {
    e.preventDefault();
    const studentId = document.getElementById('enrollment-student-id').value;
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;
    
    const checkboxes = document.querySelectorAll('#enrollment-courses-list input[type="checkbox"]');
    const enrolledList = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            enrolledList.push(cb.value);
        }
    });
    
    const oldEnrolled = student.enrolled_courses;
    student.enrolled_courses = enrolledList;
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient
                .from('students')
                .update({ enrolled_courses: enrolledList })
                .eq('id', studentId);
            if (error) throw error;
        } else {
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        }
        
        closeModal('student-enrollment-modal');
        showToast(`تم تحديث اشتراكات الطالب ${student.name} بنجاح!`, "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        student.enrolled_courses = oldEnrolled; // rollback
        showToast("فشل حفظ الاشتراكات في السحابة!", "danger");
    }
}

// Toggle Assignment MCQ Inputs
function toggleAssignmentOptions(type) {
    const container = document.getElementById('assign-mcq-options-container');
    if (container) {
        container.style.display = type === 'mcq' ? 'block' : 'none';
    }
}
// ==========================================
// Image Compression for Assignments
// ==========================================
async function handleImageSelection(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('image-compress-status');
    statusEl.style.display = 'block';
    statusEl.style.color = 'var(--primary-color)';
    statusEl.textContent = 'جاري ضغط الصورة ومعالجتها... ⏳';

    try {
        // Compress image to a max width of 600px and 60% JPEG quality
        const compressedBase64 = await compressImage(file, 600, 0.6);
        
        // Append to description as Markdown
        const descEl = document.getElementById('assign-desc');
        descEl.value += `\n\n![صورة مرفقة](${compressedBase64})\n`;
        
        statusEl.style.color = 'var(--success-color)';
        statusEl.textContent = 'تم ضغط الصورة بنجاح وتضمينها في السؤال! ✅ (الحجم الآن صغير جداً)';
        setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
        
        // Clear input so they can add another if needed
        event.target.value = '';
    } catch (error) {
        console.error("Image compression error:", error);
        statusEl.style.color = 'var(--danger-color)';
        statusEl.textContent = 'حدث خطأ أثناء ضغط الصورة ❌';
    }
}

function compressImage(file, maxWidth = 600, quality = 0.6) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Export as JPEG with specified quality
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// Add New Assignment (Teacher)
async function handleCreateAssignment(e) {
    e.preventDefault();
    
    const title = document.getElementById('assign-title').value;
    const desc = document.getElementById('assign-desc').value;
    const subject = document.getElementById('assign-subject').value;
    const targetStudent = document.getElementById('assign-student').value;
    const points = parseInt(document.getElementById('assign-points').value) || 100;
    const dueDate = document.getElementById('assign-duedate').value;
    const type = document.getElementById('assign-type').value;
    
    let options = [];
    let correctOption = -1;
    
    if (type === 'mcq') {
        const opt0 = document.getElementById('assign-opt-0').value.trim();
        const opt1 = document.getElementById('assign-opt-1').value.trim();
        const opt2 = document.getElementById('assign-opt-2').value.trim();
        const opt3 = document.getElementById('assign-opt-3').value.trim();
        
        if (!opt0 || !opt1 || !opt2 || !opt3) {
            showToast("يرجى تعبئة جميع خيارات السؤال الاختياري!", "danger");
            return;
        }
        
        options = [opt0, opt1, opt2, opt3];
        correctOption = parseInt(document.getElementById('assign-correct').value);
    }
    
    const newAssignment = {
        id: 'assign-' + Date.now(),
        title,
        desc,
        subject,
        points,
        dueDate,
        targetStudent,
        options,
        correctOption
    };
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('assignments').insert({
                id: newAssignment.id,
                title: newAssignment.title,
                description: newAssignment.desc,
                subject: newAssignment.subject,
                points: newAssignment.points,
                due_date: newAssignment.dueDate,
                target_student: newAssignment.targetStudent,
                options: newAssignment.options,
                correct_option: newAssignment.correctOption
            });
            if (error) throw error;
        } else {
            appState.assignments.push(newAssignment);
            localStorage.setItem('masar_assignments', JSON.stringify(appState.assignments));
        }
        
        showToast('تم نشر الواجب الجديد للطلاب بنجاح! 🚀', 'success');
        document.getElementById('create-assignment-form').reset();
        toggleAssignmentOptions('text'); // reset toggle
        setupDefaultDates();
        await renderTeacherDashboard();
    } catch (err) {
        console.error("Save Assignment Error:", err);
        showToast("فشل نشر الواجب في السحابة! تفقد الاتصال.", "danger");
    }
}

// Delete Assignment
async function deleteAssignment(assignId) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الواجب؟ سيتم حذف جميع تسليمات الطلاب المتعلقة به.')) {
        try {
            if (isCloudMode && supabaseClient) {
                const { error: e1 } = await supabaseClient.from('assignments').delete().eq('id', assignId);
                const { error: e2 } = await supabaseClient.from('submissions').delete().eq('assignment_id', assignId);
                if (e1 || e2) throw new Error("Delete failed");
            } else {
                appState.assignments = appState.assignments.filter(a => a.id !== assignId);
                appState.submissions = appState.submissions.filter(s => s.assignmentId !== assignId);
                
                localStorage.setItem('masar_assignments', JSON.stringify(appState.assignments));
                localStorage.setItem('masar_submissions', JSON.stringify(appState.submissions));
            }
            
            showToast('تم حذف الواجب والتسليمات المرتبطة به.', 'success');
            await renderTeacherDashboard();
        } catch (err) {
            console.error("Delete error:", err);
            showToast("فشل حذف الواجب من السحابة!", "danger");
        }
    }
}

// Register Student Manually (Teacher)
async function handleCreateStudent(e) {
    e.preventDefault();
    
    const name = document.getElementById('student-new-name').value.trim();
    const username = document.getElementById('student-new-username').value.trim().toLowerCase();
    const password = document.getElementById('student-new-pwd').value.trim();
    
    if (!name || !username || !password) {
        showToast('يرجى كتابة كافة الحقول لإنشاء الطالب!', 'danger');
        return;
    }
    
    if (username === 'mohammed') {
        showToast('اسم المستخدم "mohammed" محجوز لحساب المعلم!', 'danger');
        return;
    }
    
    const duplicate = appState.students.some(s => s.username === username);
    if (duplicate) {
        showToast('اسم المستخدم هذا مسجل مسبقاً لطالب آخر!', 'danger');
        return;
    }
    
    const newStudent = {
        id: username,
        username: username,
        name: name,
        password: password,
        xp: 0,
        badges: [],
        enrolled_courses: []
    };
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('students').insert({
                id: newStudent.id,
                username: newStudent.username,
                name: newStudent.name,
                password: newStudent.password,
                xp: newStudent.xp,
                badges: newStudent.badges,
                enrolled_courses: newStudent.enrolled_courses
            });
            if (error) throw error;
        } else {
            appState.students.push(newStudent);
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        }
        
        showToast(`تم تسجيل الطالب ${name} بنجاح! 🎉`, 'success');
        document.getElementById('create-student-form').reset();
        await renderTeacherDashboard();
    } catch (err) {
        console.error("Create Student Error:", err);
        showToast("فشل تسجيل الطالب في السحابة!", "danger");
    }
}

// Delete Student (Teacher)
async function deleteStudent(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;
    
    if (confirm(`هل أنت متأكد من حذف حساب الطالب "${student.name}"؟ سيتم حذف جميع واجباته وتسليماته بشكل نهائي.`)) {
        try {
            if (isCloudMode && supabaseClient) {
                const { error: e1 } = await supabaseClient.from('students').delete().eq('id', studentId);
                const { error: e2 } = await supabaseClient.from('submissions').delete().eq('student_id', studentId);
                if (e1 || e2) throw new Error("Delete failed");
            } else {
                appState.students = appState.students.filter(s => s.id !== studentId);
                appState.submissions = appState.submissions.filter(s => s.studentId !== studentId);
                
                localStorage.setItem('masar_students', JSON.stringify(appState.students));
                localStorage.setItem('masar_submissions', JSON.stringify(appState.submissions));
            }
            
            showToast(`تم حذف حساب الطالب ${student.name} بالكامل.`, 'success');
            await renderTeacherDashboard();
        } catch (err) {
            console.error("Delete student error:", err);
            showToast("فشل حذف حساب الطالب من السحابة!", "danger");
        }
    }
}

// Open Adjust XP Modal
function openAdjustXPModal(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('adjust-xp-student-id').value = studentId;
    document.getElementById('adjust-xp-student-name').textContent = student.name;
    document.getElementById('adjust-xp-amount').value = '';
    document.getElementById('adjust-xp-reason').value = '';
    
    openModal('adjust-xp-modal');
}

// Save Adjusted XP (Teacher)
async function handleAdjustXP(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('adjust-xp-student-id').value;
    const amount = parseInt(document.getElementById('adjust-xp-amount').value);
    const reason = document.getElementById('adjust-xp-reason').value.trim();
    
    if (isNaN(amount)) return;
    
    const studentIndex = appState.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;
    
    const student = appState.students[studentIndex];
    const oldXp = student.xp;
    
    student.xp += amount;
    if (student.xp < 0) student.xp = 0;
    
    const oldLevelInfo = calculateLevel(oldXp);
    const newLevelInfo = calculateLevel(student.xp);
    
    if (newLevelInfo.level > oldLevelInfo.level) {
        showToast(`ترقى الطالب ${student.name} إلى المستوى ${newLevelInfo.level}! 🌟`, 'success');
        if (newLevelInfo.level >= 2 && !student.badges.includes('xp_hunter')) {
            student.badges.push('xp_hunter');
        }
    }
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('students').update({ xp: student.xp, badges: student.badges }).eq('id', studentId);
            if (error) throw error;
        } else {
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        }
        
        closeModal('adjust-xp-modal');
        
        if (amount > 0) {
            showToast(`تم بنجاح إضافة ${amount} XP للطالب ${student.name} ${reason ? `بسبب: ${reason}` : ''}`, 'success');
        } else {
            showToast(`تم بنجاح خصم ${Math.abs(amount)} XP من الطالب ${student.name}`, 'warning');
        }
        
        await renderTeacherDashboard();
    } catch (err) {
        console.error("XP adjust error:", err);
        showToast("فشل حفظ تعديل النقاط في السحابة!", "danger");
        student.xp = oldXp; // rollback
    }
}

// Open grading modal
function openGradeModal(submissionId) {
    const sub = appState.submissions.find(s => s.id === submissionId);
    if (!sub) return;
    
    const student = appState.students.find(s => s.id === sub.studentId);
    const assign = appState.assignments.find(a => a.id === sub.assignmentId);
    
    if (!student || !assign) return;
    
    document.getElementById('grade-submission-id').value = submissionId;
    document.getElementById('grade-modal-student').textContent = student.name;
    document.getElementById('grade-modal-assignment-title').textContent = assign.title;
    document.getElementById('grade-modal-answer').textContent = sub.answer || "لا توجد طريقة حل مكتوبة.";
    
    const linkContainer = document.getElementById('grade-modal-link-container');
    if (sub.link) {
        linkContainer.style.display = 'block';
        document.getElementById('grade-modal-link').href = sub.link;
    } else {
        linkContainer.style.display = 'none';
    }
    
    // MCQ display logic
    const gradeMcqInfo = document.getElementById('grade-modal-mcq-info');
    const gradeAnswerLabel = document.getElementById('grade-modal-answer-label');
    
    if (assign.options && assign.options.length > 0) {
        gradeMcqInfo.style.display = 'flex';
        
        const studentOpt = sub.selectedOption !== undefined ? sub.selectedOption : -1;
        const correctOpt = assign.correctOption !== undefined ? assign.correctOption : -1;
        const isCorrect = studentOpt === correctOpt;
        
        const optionLetters = ['أ', 'ب', 'ج', 'د'];
        const studentOptText = studentOpt !== -1 ? `${optionLetters[studentOpt]}) ${assign.options[studentOpt]}` : 'لم يحدد خياراً';
        const correctOptText = correctOpt !== -1 ? `${optionLetters[correctOpt]}) ${assign.options[correctOpt]}` : 'غير محدد';
        
        document.getElementById('grade-modal-student-option').textContent = studentOptText;
        document.getElementById('grade-modal-correct-option').textContent = correctOptText;
        
        const badge = document.getElementById('grade-modal-mcq-badge');
        if (isCorrect) {
            badge.textContent = "إجابة صحيحة ✅";
            badge.style.background = 'rgba(16, 185, 129, 0.15)';
            badge.style.color = 'var(--success)';
        } else {
            badge.textContent = "إجابة خاطئة ❌";
            badge.style.background = 'rgba(239, 68, 68, 0.15)';
            badge.style.color = 'var(--danger)';
        }
        
        gradeAnswerLabel.innerHTML = '<i class="fa-solid fa-comment-dots"></i> طريقة الحل المكتوبة من الطالب:';
    } else {
        gradeMcqInfo.style.display = 'none';
        gradeAnswerLabel.innerHTML = '<i class="fa-solid fa-comment-dots"></i> إجابة الطالب:';
    }
    
    document.getElementById('grade-value').value = "10";
    document.getElementById('grade-bonus-xp').value = "0";
    document.getElementById('grade-feedback').value = "";
    
    openModal('grade-modal');
    renderMath('grade-modal');
}

// Save grading submission
async function handleGradeAssignment(e) {
    e.preventDefault();
    
    const subId = document.getElementById('grade-submission-id').value;
    const grade = document.getElementById('grade-value').value;
    const bonusXp = parseInt(document.getElementById('grade-bonus-xp').value) || 0;
    const feedback = document.getElementById('grade-feedback').value || "عمل رائع!";
    
    const subIndex = appState.submissions.findIndex(s => s.id === subId);
    if (subIndex === -1) return;
    
    const submission = appState.submissions[subIndex];
    const oldStatus = submission.status;
    const oldGrade = submission.grade;
    const oldFeedback = submission.feedback;
    const oldBonusXp = submission.bonusXp;
    const oldGradedAt = submission.gradedAt;
    
    submission.status = 'graded';
    submission.grade = grade;
    submission.feedback = feedback;
    submission.bonusXp = bonusXp;
    submission.gradedAt = new Date().toISOString().split('T')[0];
    
    const studentIndex = appState.students.findIndex(s => s.id === submission.studentId);
    if (studentIndex === -1) return;
    
    const student = appState.students[studentIndex];
    const assign = appState.assignments.find(a => a.id === submission.assignmentId);
    const baseXP = assign ? assign.points : 100;
    
    const oldXp = student.xp;
    const gainedXp = baseXP + bonusXp;
    student.xp += gainedXp;
    
    if (grade === "10" && assign && assign.subject === 'math' && !student.badges.includes('math_master')) {
        student.badges.push('math_master');
        showToast(`حصل الطالب ${student.name} على وسام: عبقري الرياضيات! 🏆`, 'success');
    }
    
    if (grade === "10" && !student.badges.includes('perfectionist')) {
        student.badges.push('perfectionist');
    }
    
    const oldLevelInfo = calculateLevel(oldXp);
    const newLevelInfo = calculateLevel(student.xp);
    if (newLevelInfo.level > oldLevelInfo.level) {
        showToast(`ترقى الطالب ${student.name} إلى المستوى ${newLevelInfo.level}! 🌟`, 'success');
        if (newLevelInfo.level >= 2 && !student.badges.includes('xp_hunter')) {
            student.badges.push('xp_hunter');
        }
    }
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error: e1 } = await supabaseClient.from('submissions').update({
                status: 'graded',
                grade: grade,
                feedback: feedback,
                bonus_xp: bonusXp,
                graded_at: submission.gradedAt
            }).eq('id', subId);
            
            if (e1) throw e1;
            
            const { error: e2 } = await supabaseClient.from('students').update({
                xp: student.xp,
                badges: student.badges
            }).eq('id', submission.studentId);
            
            if (e2) throw e2;
        } else {
            localStorage.setItem('masar_submissions', JSON.stringify(appState.submissions));
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        }
        
        closeModal('grade-modal');
        showToast('تم تصحيح الواجب بنجاح وإرسال التقييم للطالب! 📝', 'success');
        await renderTeacherDashboard();
    } catch (err) {
        console.error("Grading submit error:", err);
        showToast("فشل اعتماد الدرجة في السحابة!", "danger");
        // rollback
        submission.status = oldStatus;
        submission.grade = oldGrade;
        submission.feedback = oldFeedback;
        submission.bonusXp = oldBonusXp;
        submission.gradedAt = oldGradedAt;
        student.xp = oldXp;
    }
}

// ==========================================
// COURSE MANAGEMENT LOGIC (Teacher)
// ==========================================

function renderTeacherCourses() {
    const list = document.getElementById('t-courses-list');
    list.innerHTML = '';
    
    if (appState.courses.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-graduation-cap"></i>
                <p>لا يوجد مقررات تعليمية مضافة حالياً. أنشئ دورتك الأولى الآن!</p>
            </div>`;
        return;
    }

    appState.courses.forEach(course => {
        const lessonsCount = appState.lessons.filter(l => l.courseId === course.id).length;
        const quizzesCount = appState.quizzes.filter(q => q.courseId === course.id).length;

        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header">
                    <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">${course.createdAt || ''}</span>
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">${course.title}</h4>
                <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px;">${course.description}</p>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px;">
                    <span><i class="fa-solid fa-video" style="color: var(--accent-orange);"></i> الدروس: ${lessonsCount}</span>
                    <span><i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i> الاختبارات: ${quizzesCount}</span>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary" style="flex: 1; padding: 6px; font-size: 11.5px;" onclick="openAddLessonModal('${course.id}', '${course.title}')">
                        <i class="fa-solid fa-plus"></i> درس فيديو
                    </button>
                    <button class="btn btn-secondary" style="flex: 1; padding: 6px; font-size: 11.5px;" onclick="openAddQuizModal('${course.id}', '${course.title}')">
                        <i class="fa-solid fa-plus"></i> اختبار قصير
                    </button>
                </div>
                <button class="btn btn-danger btn-secondary" style="width: 100%; padding: 6px; font-size: 11.5px;" onclick="deleteCourse('${course.id}')">
                    <i class="fa-regular fa-trash-can"></i> حذف المقرر بالكامل
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

async function handleCreateCourse(e) {
    e.preventDefault();
    const title = document.getElementById('course-title').value.trim();
    const subject = document.getElementById('course-subject').value;
    const description = document.getElementById('course-desc').value.trim();

    const newCourse = {
        id: 'course-' + Date.now(),
        title,
        description,
        subject,
        createdAt: new Date().toISOString().split('T')[0]
    };

    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('courses').insert({
                id: newCourse.id,
                title: newCourse.title,
                description: newCourse.description,
                subject: newCourse.subject,
                created_at: newCourse.createdAt
            });
            if (error) throw error;
        } else {
            appState.courses.push(newCourse);
            localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
        }

        closeModal('create-course-modal');
        document.getElementById('create-course-form').reset();
        showToast("تم إنشاء المقرر الدراسي بنجاح! 🎓", "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        showToast("فشل إنشاء المقرر في السحابة!", "danger");
    }
}

async function deleteCourse(courseId) {
    if (confirm("هل أنت متأكد من حذف هذا المقرر بالكامل؟ سيتم حذف جميع الفيديوهات والاختبارات التابعة له.")) {
        try {
            if (isCloudMode && supabaseClient) {
                const { error } = await supabaseClient.from('courses').delete().eq('id', courseId);
                if (error) throw error;
            } else {
                appState.courses = appState.courses.filter(c => c.id !== courseId);
                appState.lessons = appState.lessons.filter(l => l.courseId !== courseId);
                appState.quizzes = appState.quizzes.filter(q => q.courseId !== courseId);
                
                localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
                localStorage.setItem('masar_lessons', JSON.stringify(appState.lessons));
                localStorage.setItem('masar_quizzes', JSON.stringify(appState.quizzes));
            }

            showToast("تم حذف المقرر بنجاح.", "success");
            await renderTeacherDashboard();
        } catch (err) {
            console.error(err);
            showToast("فشل حذف المقرر من السحابة!", "danger");
        }
    }
}

function toggleVideoSourceInput(type) {
    const urlGroup = document.getElementById('lesson-video-url-group');
    const fileGroup = document.getElementById('lesson-video-file-group');
    
    if (type === 'url') {
        urlGroup.style.display = 'block';
        fileGroup.style.display = 'none';
    } else {
        urlGroup.style.display = 'none';
        fileGroup.style.display = 'block';
    }
}

function openAddLessonModal(courseId, courseTitle) {
    document.getElementById('lesson-course-id').value = courseId;
    document.getElementById('lesson-course-title').textContent = courseTitle;
    document.getElementById('create-lesson-form').reset();
    toggleVideoSourceInput('url');
    openModal('create-lesson-modal');
}

async function handleCreateLesson(e) {
    e.preventDefault();
    const courseId = document.getElementById('lesson-course-id').value;
    const title = document.getElementById('lesson-title').value.trim();
    const videoSourceType = document.getElementById('lesson-video-type').value;
    const duration = document.getElementById('lesson-duration').value.trim() || '10:00';
    
    let videoUrl = '';
    
    if (videoSourceType === 'url') {
        videoUrl = document.getElementById('lesson-video-url').value.trim();
    } else {
        const fileInput = document.getElementById('lesson-video-file');
        if (fileInput.files.length === 0) {
            showToast("يرجى اختيار ملف الفيديو أولاً!", "danger");
            return;
        }
        const file = fileInput.files[0];
        videoUrl = URL.createObjectURL(file);
    }

    const newLesson = {
        id: 'lesson-' + Date.now(),
        courseId,
        title,
        videoUrl,
        duration
    };

    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('lessons').insert({
                id: newLesson.id,
                course_id: newLesson.courseId,
                title: newLesson.title,
                video_url: newLesson.videoUrl,
                duration: newLesson.duration
            });
            if (error) throw error;
        } else {
            appState.lessons.push(newLesson);
            localStorage.setItem('masar_lessons', JSON.stringify(appState.lessons));
        }

        closeModal('create-lesson-modal');
        showToast("تمت إضافة درس الفيديو بنجاح! 🎥", "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        showToast("فشل إضافة درس الفيديو في السحابة!", "danger");
    }
}

function openAddQuizModal(courseId, courseTitle) {
    document.getElementById('quiz-course-id').value = courseId;
    document.getElementById('quiz-course-title').textContent = courseTitle;
    document.getElementById('create-quiz-form').reset();
    
    const container = document.getElementById('quiz-questions-editor-container');
    container.innerHTML = '';
    addQuizQuestionEditorRow();
    
    openModal('create-quiz-modal');
}

function addQuizQuestionEditorRow() {
    const container = document.getElementById('quiz-questions-editor-container');
    const index = container.children.length + 1;
    
    const row = document.createElement('div');
    row.className = 'quiz-editor-row question-editor-row';
    row.innerHTML = `
        <button type="button" class="remove-question-btn" onclick="this.parentElement.remove()" title="حذف هذا السؤال">&times;</button>
        <div style="font-weight: 700; font-size: 13px; color: var(--text-orange); margin-bottom: 8px;">السؤال ${index}:</div>
        <div class="form-group">
            <input type="text" class="question-text" required placeholder="اكتب السؤال هنا (مثال: إذا كان $س = ٥$ فما قيمة $س^٢$؟)">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="form-group">
                <input type="text" class="opt-0" required placeholder="الخيار الأول (أ)">
            </div>
            <div class="form-group">
                <input type="text" class="opt-1" required placeholder="الخيار الثاني (ب)">
            </div>
            <div class="form-group">
                <input type="text" class="opt-2" required placeholder="الخيار الثالث (ج)">
            </div>
            <div class="form-group">
                <input type="text" class="opt-3" required placeholder="الخيار الرابع (د)">
            </div>
        </div>
        <div class="form-group" style="margin-top: 4px;">
            <label style="font-size: 11.5px; color: var(--success); font-weight: 700;">الخيار الصحيح:</label>
            <select class="correct-answer" style="padding: 4px 10px;">
                <option value="0">الخيار الأول (أ)</option>
                <option value="1">الخيار الثاني (ب)</option>
                <option value="2">الخيار الثالث (ج)</option>
                <option value="3">الخيار الرابع (د)</option>
            </select>
        </div>
    `;
    container.appendChild(row);
}

async function handleCreateQuiz(e) {
    e.preventDefault();
    const courseId = document.getElementById('quiz-course-id').value;
    const title = document.getElementById('quiz-title').value.trim();
    const points = parseInt(document.getElementById('quiz-points').value) || 50;

    const rowEls = document.querySelectorAll('.question-editor-row');
    if (rowEls.length === 0) {
        showToast("يرجى إضافة سؤال واحد على الأقل للاختبار!", "danger");
        return;
    }

    const questions = [];
    rowEls.forEach(row => {
        const questionText = row.querySelector('.question-text').value.trim();
        const opt0 = row.querySelector('.opt-0').value.trim();
        const opt1 = row.querySelector('.opt-1').value.trim();
        const opt2 = row.querySelector('.opt-2').value.trim();
        const opt3 = row.querySelector('.opt-3').value.trim();
        const correct = parseInt(row.querySelector('.correct-answer').value);

        questions.push({
            question: questionText,
            options: [opt0, opt1, opt2, opt3],
            correct
        });
    });

    const newQuiz = {
        id: 'quiz-' + Date.now(),
        courseId,
        title,
        questions,
        points
    };

    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('quizzes').insert({
                id: newQuiz.id,
                course_id: newQuiz.courseId,
                title: newQuiz.title,
                questions: JSON.stringify(newQuiz.questions),
                points: newQuiz.points
            });
            if (error) throw error;
        } else {
            appState.quizzes.push(newQuiz);
            localStorage.setItem('masar_quizzes', JSON.stringify(appState.quizzes));
        }

        closeModal('create-quiz-modal');
        showToast("تم نشر الاختبار التفاعلي الجديد بنجاح! 📝", "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        showToast("فشل نشر الاختبار في السحابة!", "danger");
    }
}

// ==========================================
// ACCOUNT SETTINGS LOGIC (Teacher)
// ==========================================

function renderTeacherAccountSettings() {
    const list = document.getElementById('t-teachers-list');
    list.innerHTML = '';

    appState.teachers.forEach(t => {
        const div = document.createElement('div');
        div.className = 'submission-item';
        div.style.padding = '10px';
        div.style.marginBottom = '8px';
        
        const isMainTeacher = t.id === 'mohammed';
        const isCurrentLoggedIn = t.id === appState.currentUser.id;
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div>
                    <strong style="font-size: 13.5px; color: var(--text-main);">${t.name}</strong> 
                    <span style="font-size: 11px; color: var(--text-muted); margin-right: 6px;">(@${t.username})</span>
                    ${isCurrentLoggedIn ? '<span class="student-level" style="margin-right: 6px; padding: 2px 5px; font-size: 9.5px; background: var(--success); color: #000;">أنت</span>' : ''}
                </div>
                <div>
                    ${(isMainTeacher || isCurrentLoggedIn) ? `
                        <span style="font-size: 11px; color: var(--text-muted); font-style: italic;">حساب محمي</span>
                    ` : `
                        <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="deleteTeacher('${t.id}')">حذف</button>
                    `}
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

async function handleChangePassword(e) {
    e.preventDefault();
    const oldPwd = document.getElementById('pwd-old').value;
    const newPwd = document.getElementById('pwd-new').value;
    const confirmPwd = document.getElementById('pwd-confirm').value;

    const teacher = appState.teachers.find(t => t.id === appState.currentUser.id);
    if (!teacher) return;

    if (teacher.password !== oldPwd) {
        showToast("كلمة المرور الحالية غير صحيحة!", "danger");
        return;
    }

    if (newPwd.length < 6) {
        showToast("كلمة المرور الجديدة قصيرة جداً! (6 أحرف/أرقام كحد أدنى)", "danger");
        return;
    }

    if (newPwd !== confirmPwd) {
        showToast("تأكيد كلمة المرور الجديدة غير متطابق!", "danger");
        return;
    }

    const oldSavedPwd = teacher.password;
    teacher.password = newPwd;

    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('teachers').update({ password: newPwd }).eq('id', teacher.id);
            if (error) throw error;
        } else {
            localStorage.setItem('masar_teachers', JSON.stringify(appState.teachers));
        }

        document.getElementById('change-password-form').reset();
        showToast("تم تحديث كلمة المرور الخاصة بك بنجاح! 🔑", "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        teacher.password = oldSavedPwd;
        showToast("فشل تحديث كلمة المرور سحابياً!", "danger");
    }
}

async function handleCreateTeacher(e) {
    e.preventDefault();
    const name = document.getElementById('teacher-new-name').value.trim();
    const username = document.getElementById('teacher-new-username').value.trim().toLowerCase();
    const password = document.getElementById('teacher-new-pwd').value.trim();

    if (username === 'mohammed') {
        showToast("اسم المستخدم محجوز لحساب المعلم الرئيسي!", "danger");
        return;
    }

    const duplicate = appState.teachers.some(t => t.username === username) || appState.students.some(s => s.username === username);
    if (duplicate) {
        showToast("اسم المستخدم مسجل مسبقاً في المنصة لوزمي/طالب!", "danger");
        return;
    }

    if (password.length < 6) {
        showToast("يجب أن لا تقل كلمة المرور عن 6 أحرف!", "danger");
        return;
    }

    const newTeacher = {
        id: username,
        username,
        name,
        password
    };

    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('teachers').insert({
                id: newTeacher.id,
                username: newTeacher.username,
                name: newTeacher.name,
                password: newTeacher.password
            });
            if (error) throw error;
        } else {
            appState.teachers.push(newTeacher);
            localStorage.setItem('masar_teachers', JSON.stringify(appState.teachers));
        }

        document.getElementById('create-teacher-form').reset();
        showToast(`تم بنجاح تسجيل المعلم الشريك: ${name}! 🎉`, "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        showToast("فشل تسجيل المعلم الجديد في السحابة!", "danger");
    }
}

async function deleteTeacher(teacherId) {
    if (confirm("هل أنت متأكد من حذف حساب المعلم الشريك هذا؟ لن يتمكن من تسجيل الدخول للمنصة.")) {
        try {
            if (isCloudMode && supabaseClient) {
                const { error } = await supabaseClient.from('teachers').delete().eq('id', teacherId);
                if (error) throw error;
            } else {
                appState.teachers = appState.teachers.filter(t => t.id !== teacherId);
                localStorage.setItem('masar_teachers', JSON.stringify(appState.teachers));
            }

            showToast("تم حذف حساب المعلم الشريك.", "success");
            await renderTeacherDashboard();
        } catch (err) {
            console.error(err);
            showToast("فشل الحذف من السحابة!", "danger");
        }
    }
}

// ==========================================
// STUDENT DASHBOARD LOGIC
// ==========================================

async function renderStudentDashboard() {
    if (isCloudMode) await syncFromCloud();

    const sId = appState.currentUser.id;
    const student = appState.students.find(s => s.id === sId);
    if (!student) return;
    
    // Calculate Rank
    const sortedStudents = [...appState.students].sort((a,b) => b.xp - a.xp);
    const myRankIndex = sortedStudents.findIndex(s => s.id === sId);
    const myRank = myRankIndex !== -1 ? (myRankIndex + 1) : '--';
    
    const completedHomeworks = appState.submissions.filter(s => s.studentId === sId && s.status === 'graded');
    
    document.getElementById('s-stat-rank').innerHTML = `<i class="fa-solid fa-trophy" style="color: gold; margin-left: 6px;"></i> ${myRank} / ${appState.students.length}`;
    document.getElementById('s-stat-xp').textContent = `${student.xp} XP`;
    document.getElementById('s-stat-completed').textContent = completedHomeworks.length;

    // Update Profile sidebar card
    const studentLevelInfo = calculateLevel(student.xp);
    document.getElementById('s-profile-name').textContent = student.name;
    document.getElementById('s-profile-avatar').textContent = student.name.charAt(0);
    document.getElementById('s-profile-level').textContent = `${studentLevelInfo.title} (مستوى ${studentLevelInfo.level})`;
    
    const nextLevelXpGoal = studentLevelInfo.level * 200;
    const currentLevelBaseXp = (studentLevelInfo.level - 1) * 200;
    const currentXpGainedInLevel = student.xp - currentLevelBaseXp;
    
    document.getElementById('s-profile-xp-text').textContent = `${currentXpGainedInLevel} / 200 XP`;
    document.getElementById('s-profile-xp-fill').style.width = `${studentLevelInfo.progressPercent}%`;

    // Render Badges
    const sBadgesContainer = document.getElementById('s-profile-badges');
    sBadgesContainer.innerHTML = '';
    
    Object.keys(BADGE_DETAILS).forEach(badgeKey => {
        const badge = BADGE_DETAILS[badgeKey];
        const isEarned = student.badges.includes(badgeKey);
        
        const badgeEl = document.createElement('span');
        badgeEl.className = `badge-item ${isEarned ? 'active' : ''}`;
        badgeEl.title = badge.desc;
        badgeEl.innerHTML = `<i class="fa-solid ${badge.icon}"></i> ${badge.name}`;
        sBadgesContainer.appendChild(badgeEl);
    });

    // Render Leaderboard
    const sLeaderboardList = document.getElementById('s-leaderboard-list');
    sLeaderboardList.innerHTML = '';
    
    sortedStudents.forEach((stud, index) => {
        const studLevelInfo = calculateLevel(stud.xp);
        const isMe = stud.id === sId;
        
        let medalHtml = '';
        if (index === 0) medalHtml = '🥇';
        else if (index === 1) medalHtml = '🥈';
        else if (index === 2) medalHtml = '🥉';
        else medalHtml = `#${index + 1}`;
        
        const div = document.createElement('div');
        div.className = `leaderboard-item ${isMe ? 'active' : ''}`;
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 700; font-size: 13px; color: var(--text-orange); width: 25px;">${medalHtml}</span>
                <div class="student-avatar" style="width: 28px; height: 28px; font-size: 12px;">${stud.name.charAt(0)}</div>
                <strong>${stud.name}</strong>
            </div>
            <div style="text-align: left;">
                <div style="font-weight: 800; font-size: 13px; color: var(--text-main);">${stud.xp} XP</div>
                <div style="font-size: 10px; color: var(--text-muted);">مستوى ${studLevelInfo.level}</div>
            </div>
        `;
        sLeaderboardList.appendChild(div);
    });

    renderStudentActiveHomeworks(sId);
    renderStudentHomeworkHistory(sId);
    renderStudentCourses();

    // Populate Teachers Select inside Chat Tab
    const teacherSelect = document.getElementById('s-chat-teacher-select');
    if (teacherSelect) {
        const previousVal = teacherSelect.value;
        teacherSelect.innerHTML = '';
        appState.teachers.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.name;
            teacherSelect.appendChild(option);
        });
        if (previousVal && appState.teachers.some(t => t.id === previousVal)) {
            teacherSelect.value = previousVal;
        }
        renderStudentChatHistory();
    }

    renderMath('student-view');
}

function renderStudentActiveHomeworks(sId) {
    const sActiveList = document.getElementById('s-active-list');
    sActiveList.innerHTML = '';
    
    const myAssignments = appState.assignments.filter(a => a.targetStudent === 'all' || a.targetStudent === sId);
    const activeHomeworks = myAssignments.filter(a => !appState.submissions.some(sub => sub.assignmentId === a.id && sub.studentId === sId));
    
    document.getElementById('s-active-count').textContent = `${activeHomeworks.length} واجبات متبقية`;
    
    if (activeHomeworks.length === 0) {
        sActiveList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-face-smile" style="color: var(--success); font-size: 44px;"></i>
                <p style="margin-top: 10px;">لا يوجد واجبات مطلوبة منك حالياً، عمل رائع!</p>
            </div>`;
    } else {
        activeHomeworks.forEach(assign => {
            const card = document.createElement('div');
            card.className = 'assignment-card';
            card.innerHTML = `
                <div class="assignment-header">
                    <div>
                        <span class="assignment-subject subject-${assign.subject}">${SUBJECT_NAMES[assign.subject]}</span>
                        <h4 class="assignment-title" style="margin-top: 8px;">${assign.title}</h4>
                    </div>
                    <span style="font-weight: 700; color: var(--text-orange); font-size: 15px;">${assign.points} XP</span>
                </div>
                
                <p style="font-size: 14px; color: var(--text-muted); white-space: pre-line; line-height: 1.5;">${assign.desc}</p>
                
                <div class="assignment-meta" style="justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 12px;">
                    <span><i class="fa-regular fa-calendar"></i> آخر موعد للتسليم: ${assign.dueDate}</span>
                    <button class="btn btn-primary" onclick="openSubmitModal('${assign.id}')">
                        <i class="fa-solid fa-paper-plane"></i> بدء حل الواجب
                    </button>
                </div>
            `;
            sActiveList.appendChild(card);
        });
    }
}

function renderStudentHomeworkHistory(sId) {
    const sHistoryList = document.getElementById('s-history-list');
    sHistoryList.innerHTML = '';
    
    const mySubmissions = appState.submissions.filter(s => s.studentId === sId);
    
    if (mySubmissions.length === 0) {
        sHistoryList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-hourglass-start"></i>
                <p>لم تقم بتسليم أي واجب بعد. حل واجباتك ليظهر السجل هنا!</p>
            </div>`;
    } else {
        const sortedSubmissions = [...mySubmissions].reverse();
        sortedSubmissions.forEach(sub => {
            const assign = appState.assignments.find(a => a.id === sub.assignmentId);
            if (!assign) return;
            
            const isGraded = sub.status === 'graded';
            
            const div = document.createElement('div');
            div.className = 'glass-card';
            div.style.padding = '20px';
            div.style.marginBottom = '15px';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <span class="assignment-subject subject-${assign.subject}">${SUBJECT_NAMES[assign.subject]}</span>
                        <h4 style="font-size: 15px; font-weight: 700; margin-top: 8px;">${assign.title}</h4>
                    </div>
                    <div>
                        ${isGraded ? `
                            <span class="status-badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2);">
                                الدرجة: ${sub.grade} / 10
                            </span>
                        ` : `
                            <span class="status-badge" style="background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.2);">
                                قيد الانتظار للتصحيح
                            </span>
                        `}
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">إجابتك المرسلة:</span>
                    <div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 6px; font-size: 13.5px; white-space: pre-line; border-right: 3px solid var(--accent-orange);">${sub.answer}</div>
                </div>
                
                ${isGraded ? `
                    <div style="background: rgba(16, 185, 129, 0.03); border: 1px solid rgba(16, 185, 129, 0.1); border-radius: 8px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                            <strong style="color: var(--success);"><i class="fa-solid fa-comment-dots"></i> تقييم المعلم:</strong>
                            <span style="color: var(--text-muted);">تاريخ التصحيح: ${sub.gradedAt}</span>
                        </div>
                        <p style="font-size: 13px; color: var(--text-main); line-height: 1.5; font-style: italic;">"${sub.feedback}"</p>
                        <div style="margin-top: 8px; font-size: 12px; color: var(--text-orange); font-weight: 700; display: flex; gap: 15px;">
                            <span><i class="fa-solid fa-bolt"></i> نقاط مكتسبة: +${assign.points} XP</span>
                            ${sub.bonusXp > 0 ? `<span>🥇 نقاط تشجيعية: +${sub.bonusXp} XP</span>` : ''}
                        </div>
                    </div>
                ` : ''}
            `;
            sHistoryList.appendChild(div);
        });
    }
}

// Open assignment submit dialog
function openSubmitModal(assignId) {
    const assign = appState.assignments.find(a => a.id === assignId);
    if (!assign) return;
    
    document.getElementById('submit-assignment-id').value = assignId;
    document.getElementById('submit-modal-title').textContent = `تسليم واجب: ${assign.title}`;
    document.getElementById('submit-modal-question').textContent = assign.desc;
    document.getElementById('submit-answer').value = '';
    document.getElementById('submit-link').value = '';
    
    const submitMcqContainer = document.getElementById('submit-mcq-container');
    const submitMcqOptionsList = document.getElementById('submit-mcq-options-list');
    const answerLabel = document.getElementById('submit-answer-label');
    const answerInput = document.getElementById('submit-answer');
    
    selectedSubmissionOptionTemp = null;
    
    if (assign.options && assign.options.length > 0) {
        submitMcqContainer.style.display = 'block';
        submitMcqOptionsList.innerHTML = '';
        
        assign.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `<span class="option-indicator">${String.fromCharCode(1601 + i)}</span> <span>${opt}</span>`;
            btn.onclick = () => {
                selectedSubmissionOptionTemp = i;
                document.querySelectorAll('#submit-mcq-options-list .quiz-option-btn').forEach((b, idx) => {
                    b.classList.toggle('selected', idx === i);
                });
            };
            submitMcqOptionsList.appendChild(btn);
        });
        
        answerLabel.textContent = "طريقة الحل والتفصيل (اختياري):";
        answerInput.removeAttribute('required');
    } else {
        submitMcqContainer.style.display = 'none';
        answerLabel.textContent = "إجابتك (تدعم الرموز بين علامة $):";
        answerInput.setAttribute('required', 'true');
    }
    
    openModal('submit-modal');
    renderMath('submit-modal');
}

// Student submit assignment
async function handleSubmitAssignment(e) {
    e.preventDefault();
    
    const assignId = document.getElementById('submit-assignment-id').value;
    const answer = document.getElementById('submit-answer').value.trim();
    const link = document.getElementById('submit-link').value.trim();
    const sId = appState.currentUser.id;
    
    const assign = appState.assignments.find(a => a.id === assignId);
    if (!assign) return;
    
    const isMcq = assign.options && assign.options.length > 0;
    const selectedOption = isMcq && selectedSubmissionOptionTemp !== null ? selectedSubmissionOptionTemp : -1;
    
    if (isMcq && selectedSubmissionOptionTemp === null) {
        showToast('يرجى اختيار أحد الخيارات للإجابة على السؤال أولاً!', 'danger');
        return;
    }
    
    if (!isMcq && !answer) {
        showToast('يرجى كتابة حل الواجب أولاً!', 'danger');
        return;
    }
    
    const newSubmission = {
        id: 'sub-' + Date.now(),
        assignmentId: assignId,
        studentId: sId,
        answer,
        link,
        status: 'pending',
        grade: null,
        feedback: null,
        submittedAt: new Date().toISOString().split('T')[0],
        gradedAt: null,
        bonusXp: 0,
        selectedOption: selectedOption
    };
    
    const student = appState.students.find(s => s.id === sId);
    let earnedFirstStepBadge = false;
    if (student && !student.badges.includes('first_step')) {
        student.badges.push('first_step');
        earnedFirstStepBadge = true;
    }
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error: e1 } = await supabaseClient.from('submissions').insert({
                id: newSubmission.id,
                assignment_id: newSubmission.assignmentId,
                student_id: newSubmission.studentId,
                answer: newSubmission.answer,
                link: newSubmission.link,
                status: newSubmission.status,
                selected_option: newSubmission.selectedOption
            });
            if (e1) throw e1;
            
            if (earnedFirstStepBadge) {
                const { error: e2 } = await supabaseClient.from('students').update({ badges: student.badges }).eq('id', sId);
                if (e2) throw e2;
            }
        } else {
            appState.submissions.push(newSubmission);
            localStorage.setItem('masar_submissions', JSON.stringify(appState.submissions));
            if (earnedFirstStepBadge) {
                localStorage.setItem('masar_students', JSON.stringify(appState.students));
            }
        }
        
        closeModal('submit-modal');
        showToast('تم إرسال حل الواجب لمعلمك بنجاح! 🚀', 'success');
        if (earnedFirstStepBadge) {
            showToast('تهانينا! حصلت على وسام "الخطوة الأولى" 🎉', 'success');
        }
        await renderStudentDashboard();
    } catch (err) {
        console.error("Submit assignment error:", err);
        showToast("فشل تسليم الواجب سحابياً! تفقد الاتصال بالشبكة.", "danger");
    }
}

// Render student courses with paid locks logic [NEW]
function renderStudentCourses() {
    const list = document.getElementById('s-courses-list');
    list.innerHTML = '';

    const sId = appState.currentUser.id;
    const student = appState.students.find(s => s.id === sId);
    const enrolledList = (student && student.enrolled_courses) ? student.enrolled_courses : [];

    if (appState.courses.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-graduation-cap"></i>
                <p>لا يوجد دورات تعليمية منشورة حالياً.</p>
            </div>`;
        return;
    }

    appState.courses.forEach(course => {
        const lessonsCount = appState.lessons.filter(l => l.courseId === course.id).length;
        const quizzesCount = appState.quizzes.filter(q => q.courseId === course.id).length;
        
        const isEnrolled = enrolledList.includes(course.id);

        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header">
                    <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">${course.title}</h4>
                <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px;">${course.description}</p>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
                    <span><i class="fa-solid fa-video" style="color: var(--accent-orange);"></i> الدروس: ${lessonsCount}</span>
                    <span><i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i> الاختبارات: ${quizzesCount}</span>
                </div>
            </div>
            
            ${isEnrolled ? `
                <button class="btn btn-primary" style="width: 100%;" onclick="openStudentCourseModal('${course.id}')">
                    <i class="fa-solid fa-book-open"></i> تصفح المحتوى والدروس
                </button>
            ` : `
                <button class="btn btn-secondary btn-locked" style="width: 100%;" onclick="openModal('unpaid-course-modal')">
                    <i class="fa-solid fa-lock"></i> غير مشترك - تواصل للمعلم للتفعيل 🔒
                </button>
            `}
        `;
        list.appendChild(card);
    });
}

function openStudentCourseModal(courseId) {
    const course = appState.courses.find(c => c.id === courseId);
    if (!course) return;

    document.getElementById('s-course-modal-title').textContent = course.title;
    
    const video = document.getElementById('s-course-video-player');
    const iframe = document.getElementById('s-course-iframe-player');
    const placeholder = document.getElementById('s-course-media-placeholder');
    video.style.display = 'none';
    video.src = '';
    iframe.style.display = 'none';
    iframe.src = '';
    placeholder.style.display = 'flex';

    // Render Lessons List
    const lessonsList = document.getElementById('s-course-lessons-list');
    lessonsList.innerHTML = '';
    const courseLessons = appState.lessons.filter(l => l.courseId === courseId);

    if (courseLessons.length === 0) {
        lessonsList.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا توجد دروس فيديو مضافة بعد</span>';
    } else {
        courseLessons.forEach(lesson => {
            const div = document.createElement('div');
            div.className = 'lesson-item';
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-regular fa-circle-play" style="color: var(--accent-orange);"></i>
                    <span style="font-size: 13px; font-weight: 600;">${lesson.title}</span>
                </div>
                <span style="font-size: 11px; color: var(--text-muted);">${lesson.duration}</span>
            `;
            div.onclick = () => {
                document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active'));
                div.classList.add('active');
                playLessonVideo(lesson.videoUrl);
            };
            lessonsList.appendChild(div);
        });
    }

    // Render Quizzes List
    const quizzesList = document.getElementById('s-course-quizzes-list');
    quizzesList.innerHTML = '';
    const courseQuizzes = appState.quizzes.filter(q => q.courseId === courseId);

    if (courseQuizzes.length === 0) {
        quizzesList.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا توجد اختبارات مضافة بعد</span>';
    } else {
        courseQuizzes.forEach(quiz => {
            const div = document.createElement('div');
            div.className = 'quiz-item';
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i>
                    <span style="font-size: 13px; font-weight: 600;">${quiz.title}</span>
                </div>
                <span style="font-size: 11.5px; font-weight: 700; color: var(--text-orange);">${quiz.points} XP</span>
            `;
            div.onclick = () => {
                closeModal('student-course-modal');
                startQuiz(quiz);
            };
            quizzesList.appendChild(div);
        });
    }

    openModal('student-course-modal');
    renderMath('student-course-modal');
}

function playLessonVideo(url) {
    const video = document.getElementById('s-course-video-player');
    const iframe = document.getElementById('s-course-iframe-player');
    const placeholder = document.getElementById('s-course-media-placeholder');
    
    placeholder.style.display = 'none';
    
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube.com/embed')) {
        let videoId = '';
        if (url.includes('youtube.com/embed/')) {
            videoId = url.split('youtube.com/embed/')[1].split('?')[0];
        } else if (url.includes('v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.style.display = 'block';
        video.style.display = 'none';
        video.pause();
    } else {
        video.src = url;
        video.style.display = 'block';
        iframe.style.display = 'none';
        iframe.src = '';
        video.play().catch(e => console.log("Autoplay failed/blocked", e));
    }
}

// Interactive Quiz Player
function startQuiz(quiz) {
    activeQuizState.quiz = quiz;
    activeQuizState.currentQuestionIndex = 0;
    activeQuizState.answers = [];
    activeQuizState.correctCount = 0;
    
    document.getElementById('student-quiz-title').textContent = quiz.title;
    openModal('student-quiz-modal');
    
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const container = document.getElementById('quiz-player-body');
    const qIndex = activeQuizState.currentQuestionIndex;
    const questions = activeQuizState.quiz.questions;
    
    if (qIndex >= questions.length) {
        renderQuizResults();
        return;
    }
    
    const q = questions[qIndex];
    
    container.innerHTML = `
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">السؤال ${qIndex + 1} من ${questions.length}</div>
        <div class="quiz-question-card" id="quiz-question-card-el">
            <h4 style="font-size: 15px; font-weight: 700; line-height: 1.5; color: var(--text-main);">${q.question}</h4>
        </div>
        
        <div class="quiz-options-list">
            ${q.options.map((opt, i) => `
                <button type="button" class="quiz-option-btn" onclick="selectQuizOption(${i})">
                    <span class="option-indicator">${String.fromCharCode(1601 + i)}</span>
                    <span>${opt}</span>
                </button>
            `).join('')}
        </div>
        
        <div style="display: flex; justify-content: flex-end; margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 15px;">
            <button type="button" class="btn btn-primary" id="quiz-next-btn" disabled onclick="submitQuizAnswer()" style="padding: 8px 24px;">
                <span>السؤال التالي</span>
                <i class="fa-solid fa-arrow-left"></i>
            </button>
        </div>
    `;
    
    renderMath('quiz-player-body');
}

let selectedOptionTemp = null;
function selectQuizOption(index) {
    selectedOptionTemp = index;
    document.querySelectorAll('.quiz-option-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
    
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
        nextBtn.removeAttribute('disabled');
    }
}

function submitQuizAnswer() {
    if (selectedOptionTemp === null) return;
    
    const qIndex = activeQuizState.currentQuestionIndex;
    const correctIndex = activeQuizState.quiz.questions[qIndex].correct;
    
    activeQuizState.answers.push(selectedOptionTemp);
    if (selectedOptionTemp === correctIndex) {
        activeQuizState.correctCount++;
    }
    
    selectedOptionTemp = null;
    activeQuizState.currentQuestionIndex++;
    renderQuizQuestion();
}

async function renderQuizResults() {
    const container = document.getElementById('quiz-player-body');
    const quiz = activeQuizState.quiz;
    const questions = quiz.questions;
    const score = activeQuizState.correctCount;
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= 50;
    const gainedXp = passed ? quiz.points : 0;
    
    const sId = appState.currentUser.id;
    const student = appState.students.find(s => s.id === sId);
    const oldXp = student ? student.xp : 0;
    
    if (passed && student) {
        student.xp += gainedXp;
        const oldLevelInfo = calculateLevel(oldXp);
        const newLevelInfo = calculateLevel(student.xp);
        if (newLevelInfo.level > oldLevelInfo.level) {
            showToast(`ترقيت للمستوى ${newLevelInfo.level}! 🏆`, "success");
            if (newLevelInfo.level >= 2 && !student.badges.includes('xp_hunter')) {
                student.badges.push('xp_hunter');
            }
        }
    }

    try {
        if (passed && student && isCloudMode && supabaseClient) {
            await supabaseClient.from('students').update({ xp: student.xp, badges: student.badges }).eq('id', sId);
        } else if (passed && student) {
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        }
    } catch (err) {
        console.error(err);
    }

    container.innerHTML = `
        <div style="text-align: center; padding: 20px 10px;">
            <div style="font-size: 55px; margin-bottom: 12px;">
                ${passed ? '🎉' : '📚'}
            </div>
            <h3 style="font-size: 20px; font-weight: 800; color: ${passed ? 'var(--success)' : 'var(--danger)'};">
                ${passed ? 'تهانينا! لقد اجتزت الاختبار بنجاح' : 'حظاً أوفر! تحتاج لمراجعة المادة مجدداً'}
            </h3>
            
            <div style="background: rgba(0,0,0,0.15); border: 1px solid var(--border-color); border-radius: 12px; padding: 15px; margin: 20px 0;">
                <div style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 6px;">درجتك النهائية:</div>
                <div style="font-size: 32px; font-weight: 900; color: var(--text-orange);">${score} / ${questions.length}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">نسبة النجاح: ${percent}%</div>
                
                ${passed ? `
                    <div style="font-size: 13px; font-weight: 700; color: var(--success); margin-top: 10px;">
                        <i class="fa-solid fa-bolt"></i> نقاط مكتسبة: +${gainedXp} XP!
                    </div>
                ` : ''}
            </div>

            <h4 style="text-align: right; font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">مراجعة إجاباتك:</h4>
            <div style="max-height: 200px; overflow-y: auto; text-align: right; margin-bottom: 20px; padding-left: 5px;">
                ${questions.map((q, i) => {
                    const myAns = activeQuizState.answers[i];
                    const correctAns = q.correct;
                    const isCorrect = myAns === correctAns;
                    return `
                        <div style="background: rgba(255,255,255,0.01); border: 1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; border-radius: 8px; padding: 8px; margin-bottom: 8px; font-size: 12.5px;">
                            <strong>س ${i+1}:</strong> ${q.question}
                            <div style="margin-top: 4px;">
                                <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'};">إجابتك: ${q.options[myAns] || ''}</span>
                                ${!isCorrect ? `<div style="color: var(--success); font-size: 11px;">الإجابة الصحيحة: ${q.options[correctAns]}</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <button type="button" class="btn btn-primary" onclick="closeModal('student-quiz-modal')" style="width: 100%;">
                إنهاء ومتابعة
            </button>
        </div>
    `;
    
    renderStudentDashboard();
    renderMath('quiz-player-body');
}

// ==========================================
// CHAT SYSTEM LOGIC (NEW)
// ==========================================

// Render Student Chat History
function renderStudentChatHistory() {
    const chatHistory = document.getElementById('s-chat-history');
    const teacherSelect = document.getElementById('s-chat-teacher-select');
    if (!chatHistory || !teacherSelect) return;
    
    const selectedTeacherId = teacherSelect.value;
    const sId = appState.currentUser.id;
    
    chatHistory.innerHTML = '';
    
    if (!selectedTeacherId) {
        chatHistory.innerHTML = '<span style="font-size: 13px; color: var(--text-muted); text-align: center; margin-top: auto;">يرجى اختيار معلم للبدء بالمحادثة.</span>';
        return;
    }
    
    const directMessages = appState.messages.filter(m => 
        (m.senderId === sId && m.receiverId === selectedTeacherId) || 
        (m.senderId === selectedTeacherId && m.receiverId === sId)
    );
    
    if (directMessages.length === 0) {
        chatHistory.innerHTML = '<span style="font-size: 13px; color: var(--text-muted); text-align: center; margin-top: auto;">لا توجد رسائل سابقة. ابدأ المحادثة بطرح سؤالك!</span>';
        return;
    }
    
    directMessages.forEach(msg => {
        const isSentByMe = msg.senderId === sId;
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isSentByMe ? 'sent' : 'received'}`;
        
        let dateStr = '';
        if (msg.createdAt) {
            const date = new Date(msg.createdAt);
            dateStr = date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        }
        
        bubble.innerHTML = `
            <div style="font-weight: bold; font-size: 11.5px; margin-bottom: 4px; color: ${isSentByMe ? 'var(--text-main)' : 'var(--text-orange)'};">
                ${isSentByMe ? 'أنت' : (appState.teachers.find(t => t.id === selectedTeacherId)?.name || 'المعلم')}
            </div>
            <div>${msg.content}</div>
            <div class="chat-bubble-meta">${dateStr}</div>
        `;
        chatHistory.appendChild(bubble);
    });
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Student Sends Message to Teacher
async function handleSendStudentMessage(e) {
    e.preventDefault();
    const input = document.getElementById('s-chat-input');
    const teacherSelect = document.getElementById('s-chat-teacher-select');
    if (!input || !teacherSelect) return;
    
    const content = input.value.trim();
    const selectedTeacherId = teacherSelect.value;
    const sId = appState.currentUser.id;
    
    if (!content || !selectedTeacherId) return;
    
    const newMsg = {
        id: 'msg-' + Date.now(),
        senderId: sId,
        senderRole: 'student',
        receiverId: selectedTeacherId,
        receiverRole: 'teacher',
        content: content,
        createdAt: new Date().toISOString()
    };
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('messages').insert({
                id: newMsg.id,
                sender_id: newMsg.senderId,
                sender_role: newMsg.senderRole,
                receiver_id: newMsg.receiverId,
                receiver_role: newMsg.receiverRole,
                content: newMsg.content
            });
            if (error) throw error;
        } else {
            appState.messages.push(newMsg);
            localStorage.setItem('masar_messages', JSON.stringify(appState.messages));
        }
        
        input.value = '';
        await syncFromCloud();
        renderStudentChatHistory();
    } catch (err) {
        console.error(err);
        showToast("فشل إرسال الرسالة سحابياً!", "danger");
    }
}

// Render Teacher Chat History
function renderTeacherChatHistory() {
    const chatHistory = document.getElementById('t-chat-history');
    const studentSelect = document.getElementById('t-chat-student-select');
    if (!chatHistory || !studentSelect) return;
    
    const selectedStudentId = studentSelect.value;
    const tId = appState.currentUser.id;
    
    chatHistory.innerHTML = '';
    
    if (!selectedStudentId) {
        chatHistory.innerHTML = '<span style="font-size: 13px; color: var(--text-muted); text-align: center; margin-top: auto;">يرجى اختيار طالب لعرض المحادثة.</span>';
        return;
    }
    
    const directMessages = appState.messages.filter(m => 
        (m.senderId === tId && m.receiverId === selectedStudentId) || 
        (m.senderId === selectedStudentId && m.receiverId === tId)
    );
    
    if (directMessages.length === 0) {
        chatHistory.innerHTML = '<span style="font-size: 13px; color: var(--text-muted); text-align: center; margin-top: auto;">لا توجد رسائل سابقة مع هذا الطالب.</span>';
        return;
    }
    
    directMessages.forEach(msg => {
        const isSentByMe = msg.senderId === tId;
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isSentByMe ? 'sent' : 'received'}`;
        
        let dateStr = '';
        if (msg.createdAt) {
            const date = new Date(msg.createdAt);
            dateStr = date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        }
        
        bubble.innerHTML = `
            <div style="font-weight: bold; font-size: 11.5px; margin-bottom: 4px; color: ${isSentByMe ? 'var(--text-main)' : 'var(--text-orange)'};">
                ${isSentByMe ? 'أنت' : (appState.students.find(s => s.id === selectedStudentId)?.name || 'الطالب')}
            </div>
            <div>${msg.content}</div>
            <div class="chat-bubble-meta">${dateStr}</div>
        `;
        chatHistory.appendChild(bubble);
    });
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Teacher Sends Message to Student
async function handleSendTeacherMessage(e) {
    e.preventDefault();
    const input = document.getElementById('t-chat-input');
    const studentSelect = document.getElementById('t-chat-student-select');
    if (!input || !studentSelect) return;
    
    const content = input.value.trim();
    const selectedStudentId = studentSelect.value;
    const tId = appState.currentUser.id;
    
    if (!content || !selectedStudentId) return;
    
    const newMsg = {
        id: 'msg-' + Date.now(),
        senderId: tId,
        senderRole: 'teacher',
        receiverId: selectedStudentId,
        receiverRole: 'student',
        content: content,
        createdAt: new Date().toISOString()
    };
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('messages').insert({
                id: newMsg.id,
                sender_id: newMsg.senderId,
                sender_role: newMsg.senderRole,
                receiver_id: newMsg.receiverId,
                receiver_role: newMsg.receiverRole,
                content: newMsg.content
            });
            if (error) throw error;
        } else {
            appState.messages.push(newMsg);
            localStorage.setItem('masar_messages', JSON.stringify(appState.messages));
        }
        
        input.value = '';
        await syncFromCloud();
        renderTeacherChatHistory();
    } catch (err) {
        console.error(err);
        showToast("فشل إرسال الرسالة سحابياً!", "danger");
    }
}

// Auto-polling for new messages
setInterval(async () => {
    const sChatTab = document.getElementById('s-chat-tab');
    const tChatTab = document.getElementById('t-chat-tab');
    
    const isStudentChatVisible = sChatTab && sChatTab.classList.contains('active') && sChatTab.style.display !== 'none';
    const isTeacherChatVisible = tChatTab && tChatTab.classList.contains('active') && tChatTab.style.display !== 'none';
    
    if (isStudentChatVisible || isTeacherChatVisible) {
        if (isCloudMode && supabaseClient) {
            try {
                const { data: msgs, error } = await supabaseClient.from('messages').select('*').order('created_at', { ascending: true });
                if (!error && msgs) {
                    appState.messages = msgs.map(m => ({
                        id: m.id,
                        senderId: m.sender_id,
                        senderRole: m.sender_role,
                        receiverId: m.receiver_id,
                        receiverRole: m.receiver_role,
                        content: m.content,
                        createdAt: m.created_at
                    }));
                    if (isStudentChatVisible) renderStudentChatHistory();
                    if (isTeacherChatVisible) renderTeacherChatHistory();
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }
    }
}, 5000);
