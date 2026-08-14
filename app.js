// === إعدادات الربط السحابي التلقائي (ضع قيمك هنا لتعمل السحابة للجميع تلقائياً) ===
const SUPABASE_URL = "https://gspaayiudsngociazimg.supabase.co"; // رابط مشروعك الحالي
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcGFheWl1ZHNuZ29jaWF6aW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTk1NTYsImV4cCI6MjA5OTc5NTU1Nn0.wYfw83A_V3yVFdjTkgJzn5EoNBAbBCy2Xt7sgAfQw3A"; // مفتاح anon للاتصال التلقائي للطلاب المعلمون والطلاب

// Default Initial Data (Seed)
const INITIAL_TEACHERS = [
    { id: 'mohammed', username: 'mohammed', name: 'أ.محمد علي', password: '123456' }
];

const INITIAL_STUDENTS = [
    { id: 'stud-1', username: 'student1', name: 'أحمد الغامدي', password: '123', xp: 120, badges: ['first_step'], enrolled_courses: ['course-1'] },
    { id: 'stud-2', username: 'student2', name: 'سارة خالد', password: '123', xp: 250, badges: ['first_step', 'math_master'], enrolled_courses: ['course-1'] },
    { id: 'stud-3', username: 'student3', name: 'فيصل الشمري', password: '123', xp: 80, badges: [], enrolled_courses: [] }
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

const INITIAL_ASSIGNMENTS = [
    {
        id: 'assign-1',
        title: 'واجب المتتابعات الحسابية والقدرات الكمي',
        desc: 'أوجد حد المتتابعة الحسابية التحريرية: $٢، ٥، ٨، ١١، ...$ أوجد الحد السابع، ثم حدد الإجابة الصحيحة.',
        subject: 'qudrat',
        points: 50,
        dueDate: '2026-08-15',
        targetStudent: 'all',
        options: ['$٢٠$', '$١٧$', '$٢٣$', '$٢٦$'],
        correctOption: 0,
        image: ''
    },
    {
        id: 'assign-2',
        title: 'واجب التطبيقات والهندسة الرياضية',
        desc: 'إذا كان $س + ٣ = ٧$، أحسب قيمة $س^٢ + ٥$ مع توضيح خطوات الحل.',
        subject: 'math',
        points: 100,
        dueDate: '2026-08-20',
        targetStudent: 'all',
        options: ['$٢١$', '$١٩$', '$١٦$', '$٢٥$'],
        correctOption: 0,
        image: ''
    }
];

const BADGE_DETAILS = {
    'first_step': { name: 'الخطوة الأولى', icon: 'fa-shoe-prints', desc: 'سلمت أول واجب بنجاح' },
    'math_master': { name: 'عبقري الرياضيات', icon: 'fa-square-root-variable', desc: 'حصلت على درجة كاملة في واجب رياضيات' },
    'xp_hunter': { name: 'صائد النقاط', icon: 'fa-dragon', desc: 'وصلت إلى المستوى الثاني أو أعلى' },
    'perfectionist': { name: 'العلامة الكاملة', icon: 'fa-star', desc: 'حصلت على تقييم 10/10' }
};

function getAllBadges() {
    try {
        const custom = JSON.parse(localStorage.getItem('masar_custom_badges') || '{}');
        return { ...BADGE_DETAILS, ...custom };
    } catch(e) {
        return BADGE_DETAILS;
    }
}

const BADGE_ICONS_LIBRARY = [
    { icon: 'fa-trophy', label: 'كأس التميز' },
    { icon: 'fa-medal', label: 'ميدالية ذهبية' },
    { icon: 'fa-award', label: 'وسام التقدير' },
    { icon: 'fa-crown', label: 'تاج الأسطورة' },
    { icon: 'fa-star', label: 'نجمة التفوق' },
    { icon: 'fa-graduation-cap', label: 'قبعة التخرج' },
    { icon: 'fa-brain', label: 'عبقرية وذكاء' },
    { icon: 'fa-bolt', label: 'شرارة وسرعة' },
    { icon: 'fa-bullseye', label: 'دقة الهدف' },
    { icon: 'fa-rocket', label: 'صاروخ الإنجاز' },
    { icon: 'fa-book-open', label: 'كتاب وقراءة' },
    { icon: 'fa-gem', label: 'جوهرة نادرة' },
    { icon: 'fa-certificate', label: 'شهادة اعتماد' },
    { icon: 'fa-shield-halved', label: 'درع التأسيس' },
    { icon: 'fa-fire', label: 'شعلة حماس' },
    { icon: 'fa-lightbulb', label: 'فكرة وإضاءة' },
    { icon: 'fa-pen-fancy', label: 'قلم التفوق' },
    { icon: 'fa-square-root-variable', label: 'رياضيات وقدرات' },
    { icon: 'fa-calculator', label: 'حاسبة وإحصاء' },
    { icon: 'fa-microscope', label: 'تحصيلي واكتشاف' },
    { icon: 'fa-dragon', label: 'تنين صائد النقاط' },
    { icon: 'fa-shoe-prints', label: 'أولى الخطوات' },
    { icon: 'fa-flag-checkered', label: 'خط النهاية' },
    { icon: 'fa-heart', label: 'شغف واجتهاد' }
];

const INITIAL_TESTIMONIALS = [
    {
        id: 'rev-1',
        studentName: 'عبدالرحمن العتيبي',
        studentRole: 'طالب قدرات عامة',
        rating: 5,
        comment: 'الحمد لله ارتفعت درجتي في اختبار القدرات إلى 96%! طريقة شرح قوانين الجبر والسرعة في الحل غيرت مستواي تماماً. شكراً أستاذ محمد!',
        createdAt: '2026-07-28'
    },
    {
        id: 'rev-2',
        studentName: 'سارة خالد السبيعي',
        studentRole: 'طالبة تحصيلي رياضيات',
        rating: 5,
        comment: 'الدورة تأسيسية متكاملة بامتياز. التمارين التفاعلية والمحاكي الموقوت خلتني أروح لمركز قياس وأنا واثقة ومستعدة 100%.',
        createdAt: '2026-07-29'
    },
    {
        id: 'rev-3',
        studentName: 'فيصل الشمري',
        studentRole: 'طالب قدرات كمي ولفظي',
        rating: 5,
        comment: 'أفضل منصة اشتركت فيها، التصحيح المباشر للواجبات والتفاعل مع المعلم أولاً بأول اختصر علي وقت وجهد كبير.',
        createdAt: '2026-07-30'
    }
];

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
    messages: [],
    testimonials: []
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

// Active Student Simulator State
let activeSimulatorState = {
    quiz: null,
    currentSectionIndex: 0,
    answers: [], // array of arrays containing selected option indexes per section
    timerInterval: null,
    secondsRemaining: 0
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

// Automatic Image Compression Utility (Optimizes images for speed and clarity)
function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
    return new Promise((resolve) => {
        if (!file || !file.type || !file.type.startsWith('image/')) {
            resolve('');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = () => resolve(event.target.result);
            img.src = event.target.result;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

// Database Init
function initDatabase() {
    if (!localStorage.getItem('masar_teachers')) {
        localStorage.setItem('masar_teachers', JSON.stringify(INITIAL_TEACHERS));
    }
    if (!localStorage.getItem('masar_students') || JSON.parse(localStorage.getItem('masar_students')).length === 0) {
        localStorage.setItem('masar_students', JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem('masar_assignments') || JSON.parse(localStorage.getItem('masar_assignments')).length === 0) {
        localStorage.setItem('masar_assignments', JSON.stringify(INITIAL_ASSIGNMENTS));
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
    if (!localStorage.getItem('masar_testimonials') || JSON.parse(localStorage.getItem('masar_testimonials')).length === 0) {
        localStorage.setItem('masar_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
    }
    
    appState.teachers = JSON.parse(localStorage.getItem('masar_teachers'));
    appState.students = JSON.parse(localStorage.getItem('masar_students'));
    appState.assignments = JSON.parse(localStorage.getItem('masar_assignments'));
    appState.submissions = JSON.parse(localStorage.getItem('masar_submissions'));
    appState.courses = JSON.parse(localStorage.getItem('masar_courses'));
    appState.lessons = JSON.parse(localStorage.getItem('masar_lessons'));
    appState.quizzes = JSON.parse(localStorage.getItem('masar_quizzes'));
    appState.messages = JSON.parse(localStorage.getItem('masar_messages')) || [];
    appState.testimonials = safeJsonParse(localStorage.getItem('masar_testimonials'), INITIAL_TESTIMONIALS);
    
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

async function connectSupabase(url, key, showToasts = true) {
    try {
        if (!url || !key) throw new Error("Empty credentials");
        
        const client = supabase.createClient(url, key);
        supabaseClient = client;
        isCloudMode = true;
        
        localStorage.setItem('masar_cloud_url', url);
        localStorage.setItem('masar_cloud_key', key);
        
        updateCloudStatusUI(true);
        
        // Sync cloud tables in parallel
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

function safeJsonParse(val, fallback = null) {
    if (!val) return fallback;
    if (typeof val !== 'string') return val;
    try {
        return JSON.parse(val);
    } catch (e) {
        console.warn("safeJsonParse error caught for:", val, e);
        return fallback !== null ? fallback : val;
    }
}

// Sync all data from Supabase
async function syncFromCloud() {
    if (!isCloudMode || !supabaseClient) return;
    try {
        const [
            resTeachers,
            resStudents,
            resAssignments,
            resSubmissions,
            resCourses,
            resLessons,
            resQuizzes,
            resMessages,
            resTestimonials
        ] = await Promise.all([
            supabaseClient.from('teachers').select('*'),
            supabaseClient.from('students').select('*'),
            supabaseClient.from('assignments').select('*'),
            supabaseClient.from('submissions').select('*'),
            supabaseClient.from('courses').select('*'),
            supabaseClient.from('lessons').select('*'),
            supabaseClient.from('quizzes').select('*'),
            supabaseClient.from('messages').select('*').order('created_at', { ascending: true }),
            supabaseClient.from('testimonials').select('*')
        ]);

        const teachers = resTeachers.data || [];
        const students = resStudents.data || [];
        const assignments = resAssignments.data || [];
        const submissions = resSubmissions.data || [];
        const courses = resCourses.data || [];
        const lessons = resLessons.data || [];
        const quizzes = resQuizzes.data || [];
        const messages = resMessages.data || [];
        const testimonials = (resTestimonials && resTestimonials.data) ? resTestimonials.data : [];

        if (testimonials.length > 0) {
            appState.testimonials = testimonials.map(t => ({
                id: t.id,
                studentName: t.student_name,
                studentRole: t.student_role,
                rating: t.rating,
                comment: t.comment,
                createdAt: t.created_at
            }));
        } else {
            const localTestimonials = safeJsonParse(localStorage.getItem('masar_testimonials'), INITIAL_TESTIMONIALS);
            if (localTestimonials && localTestimonials.length > 0) {
                appState.testimonials = localTestimonials;
            }
        }
        
        appState.teachers = teachers;
        appState.messages = messages.map(m => ({
            id: m.id,
            senderId: m.sender_id,
            senderRole: m.sender_role,
            receiverId: m.receiver_id,
            receiverRole: m.receiver_role,
            content: m.content,
            createdAt: m.created_at
        }));
        
        // Map students with enrolled_courses and watched_lessons
        if (students.length > 0) {
            const localStudents = safeJsonParse(localStorage.getItem('masar_students'), []);
            appState.students = students.map(s => {
                const matchedLocal = localStudents.find(ls => String(ls.id) === String(s.id));
                return {
                    id: s.id,
                    username: s.username,
                    name: s.name,
                    password: s.password,
                    xp: s.xp || 0,
                    enrolled_courses: safeJsonParse(s.enrolled_courses, []),
                    watched_lessons: (s.watched_lessons !== undefined && s.watched_lessons !== null) 
                                        ? safeJsonParse(s.watched_lessons, {}) 
                                        : (matchedLocal && matchedLocal.watched_lessons ? matchedLocal.watched_lessons : {}),
                    badges: safeJsonParse(s.badges, []).filter(b => typeof b !== 'string' || !b.startsWith('sim_res:')),
                    simulator_results: (() => {
                        const badgesArr = safeJsonParse(s.badges, []);
                        const simStr = badgesArr.find(b => typeof b === 'string' && b.startsWith('sim_res:'));
                        if (simStr) {
                            return safeJsonParse(simStr.substring(8), {});
                        }
                        return (matchedLocal && matchedLocal.simulator_results ? matchedLocal.simulator_results : {});
                    })()
                };
            });
        } else {
            const localStudents = safeJsonParse(localStorage.getItem('masar_students'), []);
            if (localStudents && localStudents.length > 0) {
                appState.students = localStudents;
                for (const s of localStudents) {
                    try {
                        await supabaseClient.from('students').insert({
                            id: s.id,
                            username: s.username,
                            name: s.name,
                            password: s.password,
                            xp: s.xp || 0,
                            badges: s.badges,
                            enrolled_courses: s.enrolled_courses
                        });
                    } catch(e) {}
                }
            }
        }
        
        if (assignments.length > 0) {
            appState.assignments = assignments.map(a => {
                let target = a.target_student;
                if (typeof target === 'string' && (target.startsWith('[') || target.startsWith('{'))) {
                    target = safeJsonParse(target, target);
                }
                let opts = a.options;
                if (typeof opts === 'string') {
                    opts = safeJsonParse(opts, []);
                }
                return {
                    id: a.id,
                    title: a.title || '',
                    desc: a.description || '',
                    subject: a.subject || 'math',
                    points: a.points || 50,
                    dueDate: a.due_date || '',
                    targetStudent: target || 'all',
                    options: Array.isArray(opts) ? opts : [],
                    correctOption: a.correct_option !== undefined ? a.correct_option : -1,
                    image: a.image || ''
                };
            });
        } else {
            const localAssignments = safeJsonParse(localStorage.getItem('masar_assignments'), []);
            if (localAssignments && localAssignments.length > 0) {
                appState.assignments = localAssignments;
                for (const a of localAssignments) {
                    try {
                        await supabaseClient.from('assignments').insert({
                            id: a.id,
                            title: a.title,
                            description: a.desc,
                            subject: a.subject,
                            points: a.points,
                            due_date: a.dueDate,
                            target_student: Array.isArray(a.targetStudent) ? JSON.stringify(a.targetStudent) : a.targetStudent,
                            options: a.options,
                            correct_option: a.correctOption,
                            image: a.image
                        });
                    } catch(e) {}
                }
            }
        }
        
        if (submissions.length > 0) {
            appState.submissions = submissions.map(s => ({
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
        } else {
            const localSubmissions = safeJsonParse(localStorage.getItem('masar_submissions'), []);
            if (localSubmissions && localSubmissions.length > 0) {
                appState.submissions = localSubmissions;
            }
        }

        if (courses.length > 0) {
            const localCourses = safeJsonParse(localStorage.getItem('masar_courses'), []);
            appState.courses = courses.map(c => {
                const matchedLocal = localCourses.find(lc => String(lc.id) === String(c.id));
                const extracted = extractCoursePricingFromCloud(c, matchedLocal);
                return {
                    id: c.id,
                    title: c.title,
                    description: extracted.cleanDescription,
                    subject: c.subject,
                    price: extracted.price,
                    isPaid: extracted.isPaid,
                    createdAt: c.created_at || c.createdAt
                };
            });
        } else {
            const localCourses = safeJsonParse(localStorage.getItem('masar_courses'), INITIAL_COURSES);
            if (localCourses && localCourses.length > 0) {
                appState.courses = localCourses;
                for (const c of localCourses) {
                    try {
                        await supabaseClient.from('courses').insert({
                            id: c.id,
                            title: c.title,
                            description: c.description,
                            subject: c.subject,
                            created_at: c.createdAt
                        });
                    } catch(e) {}
                }
            }
        }

        if (lessons.length > 0) {
            appState.lessons = lessons.map(l => ({
                id: l.id,
                courseId: l.course_id,
                title: l.title,
                videoUrl: l.video_url,
                duration: l.duration
            }));
        } else {
            const localLessons = safeJsonParse(localStorage.getItem('masar_lessons'), INITIAL_LESSONS);
            if (localLessons && localLessons.length > 0) {
                appState.lessons = localLessons;
                for (const l of localLessons) {
                    try {
                        await supabaseClient.from('lessons').insert({
                            id: l.id,
                            course_id: l.courseId,
                            title: l.title,
                            video_url: l.videoUrl,
                            duration: l.duration
                        });
                    } catch(e) {}
                }
            }
        }

        if (quizzes.length > 0) {
            appState.quizzes = quizzes.map(q => {
                let parsedQuestions = safeJsonParse(q.questions, []);
                let qType = q.is_simulator ? 'simulator' : 'normal';
                let pTarget = 80, pHigh = '', pLow = '';
                
                if (parsedQuestions.length > 0 && parsedQuestions[0]._isPlacementMeta) {
                    const meta = parsedQuestions.shift();
                    qType = 'placement';
                    pTarget = meta.placementTarget;
                    pHigh = meta.placementHighMsg;
                    pLow = meta.placementLowMsg;
                }
                
                return {
                    id: q.id,
                    courseId: q.course_id,
                    title: q.title,
                    questions: parsedQuestions,
                    points: q.points,
                    isSimulator: q.is_simulator || false,
                    type: qType,
                    placementTarget: pTarget,
                    placementHighMsg: pHigh,
                    placementLowMsg: pLow
                };
            });
        } else {
            const localQuizzes = safeJsonParse(localStorage.getItem('masar_quizzes'), INITIAL_QUIZZES);
            if (localQuizzes && localQuizzes.length > 0) {
                appState.quizzes = localQuizzes;
                for (const q of localQuizzes) {
                    try {
                        await supabaseClient.from('quizzes').insert({
                            id: q.id,
                            course_id: q.courseId,
                            title: q.title,
                            questions: typeof q.questions === 'object' ? JSON.stringify(q.questions) : q.questions,
                            points: q.points,
                            is_simulator: q.isSimulator
                        });
                    } catch(e) {}
                }
            }
        }
        
        // Save synced cloud data to localStorage as offline/instant cache
        try {
            localStorage.setItem('masar_teachers', JSON.stringify(appState.teachers));
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
            localStorage.setItem('masar_assignments', JSON.stringify(appState.assignments));
            localStorage.setItem('masar_submissions', JSON.stringify(appState.submissions));
            localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
            localStorage.setItem('masar_lessons', JSON.stringify(appState.lessons));
            localStorage.setItem('masar_quizzes', JSON.stringify(appState.quizzes));
            localStorage.setItem('masar_messages', JSON.stringify(appState.messages));
            localStorage.setItem('masar_testimonials', JSON.stringify(appState.testimonials));
        } catch(e) {}

        console.log("Synced successfully from Supabase cloud database.");

        // Re-render UI after syncing from cloud
        if (appState.currentUser) {
            if (appState.currentUser.role === 'teacher' || appState.currentUser.role === 'supervisor') {
                renderTeacherDashboard();
            } else if (appState.currentUser.role === 'student') {
                renderStudentDashboard();
    checkPendingPlacementTest();
            }
        } else {
            renderLandingPage();
        }
    } catch (err) {
        console.error("Sync error:", err);
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
            badge.style.display = 'none';
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

// Session Security & Automatic Timeout Logic (2 Hours Inactivity Expiry)
const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours (120 minutes)

function updateLastActivity() {
    localStorage.setItem('masar_last_activity', Date.now().toString());
}

function checkAuthSession() {
    const cachedUser = sessionStorage.getItem('masar_current_user') || localStorage.getItem('masar_current_user');
    const lastActive = parseInt(localStorage.getItem('masar_last_activity') || '0', 10);
    const now = Date.now();

    if (cachedUser && lastActive && (now - lastActive < SESSION_TIMEOUT_MS)) {
        appState.currentUser = JSON.parse(cachedUser);
        updateLastActivity();
        showDashboard();
    } else {
        if (cachedUser) {
            logout(true);
        } else {
            showLandingPage();
        }
    }
}

if (typeof window !== 'undefined') {
    ['click', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
        window.addEventListener(evt, () => {
            if (appState && appState.currentUser) {
                updateLastActivity();
            }
        }, { passive: true });
    });
}

// Render Math Formula with KaTeX
function renderMath(elementId) {
    if (!window.renderMathInElement) return;
    let target = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (!target && typeof elementId === 'string' && typeof MODAL_TO_VIEW_MAP !== 'undefined' && MODAL_TO_VIEW_MAP[elementId]) {
        target = document.getElementById(MODAL_TO_VIEW_MAP[elementId]);
    }
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
                role: teacher.role || 'teacher',
                id: teacher.id,
                name: teacher.name
            };
            const roleTitle = appState.currentUser.role === 'supervisor' ? 'مشرف' : 'معلم';
            showToast(`أهلاً بك يا ${teacher.name}، تم تسجيل دخولك كـ (${roleTitle}).`, 'success');
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
                name: student.name,
                xp: student.xp || 0
            };
            showToast(`مرحباً بك يا ${student.name} في لوحة تحكم الطالب!`, 'success');
        } else {
            showToast('اسم المستخدم أو كلمة المرور غير صحيحة!', 'danger');
            return;
        }
    }
    
    sessionStorage.setItem('masar_current_user', JSON.stringify(appState.currentUser));
    localStorage.setItem('masar_current_user', JSON.stringify(appState.currentUser));
    updateLastActivity();
    showDashboard();
}

// Log out
function logout(isExpired = false) {
    sessionStorage.removeItem('masar_current_user');
    localStorage.removeItem('masar_current_user');
    localStorage.removeItem('masar_last_activity');
    appState.currentUser = null;
    showLandingPage();
    if (isExpired) {
        showToast('انتهت الجلسة تلقائياً بسبب عدم النشاط، يرجى إعادة تسجيل الدخول 🔒', 'warning');
    } else {
        showToast('تم تسجيل الخروج بنجاح', 'success');
    }
}

// Routing views & Header State
function updateHeaderUserBadge() {
    const headerName = document.getElementById('header-user-name');
    const headerBadge = document.getElementById('header-user-badge');
    const heroBtnText = document.getElementById('hero-primary-btn-text');
    
    document.getElementById('app-header').style.display = 'flex';
    
    if (appState.currentUser) {
        if (headerBadge) headerBadge.style.display = 'inline-flex';
        if (headerName) headerName.textContent = appState.currentUser.role === 'teacher' ? `المعلم: ${appState.currentUser.name}` : `الطالب: ${appState.currentUser.name}`;
        if (headerBadge) {
            headerBadge.className = appState.currentUser.role === 'teacher' ? 'user-badge teacher' : 'user-badge student';
            const dot = headerBadge.querySelector('.role-dot');
            if (dot) dot.style.background = appState.currentUser.role === 'teacher' ? 'var(--accent-orange)' : 'var(--success)';
        }
        if (heroBtnText) {
            heroBtnText.textContent = appState.currentUser.role === 'teacher' ? 'لوحة تحكم المعلم والواجبات' : 'لوحة تحكم الطالب والتقدم الدراسـي';
        }
    } else {
        if (headerBadge) headerBadge.style.display = 'none';
        if (heroBtnText) heroBtnText.textContent = 'دخول الطلاب والمعلمين';
    }
}

function handleHeroPrimaryAction() {
    if (!appState.currentUser) {
        showLogin();
    } else if (appState.currentUser.role === 'teacher') {
        showTeacherSection('t-assignments-tab');
    } else {
        openStudentDashboardModal();
    }
}

function openDrawerMenu() {
    renderDrawerMenu();
    openModal('hamburger-drawer-modal');
}

function renderDrawerMenu() {
    const optionsContainer = document.getElementById('drawer-menu-options');
    const avatarEl = document.getElementById('drawer-user-avatar');
    const nameEl = document.getElementById('drawer-user-name');
    const statusEl = document.getElementById('drawer-user-status');
    if (!optionsContainer) return;
    
    const user = appState.currentUser;
    optionsContainer.innerHTML = '';
    
    if (user && user.role === 'student') {
        const studentRecord = appState.students.find(s => String(s.id) === String(user.id));
        const studentXp = (studentRecord && studentRecord.xp !== undefined) ? studentRecord.xp : (user.xp || 0);
        const levelInfo = calculateLevel(studentXp);
        
        if (avatarEl) avatarEl.textContent = user.name.charAt(0);
        if (nameEl) nameEl.textContent = user.name;
        if (statusEl) statusEl.textContent = `طالب مسجل - ⭐ ${studentXp} XP (${levelInfo.title})`;
        
        optionsContainer.innerHTML = `
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); openStudentDashboardModal();">
                <i class="fa-solid fa-chart-line" style="color: var(--accent-orange);"></i>
                <span>لوحة تحكم الطالب والتقدم الدراسـي</span>
            </div>
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showStudentSection('s-simulators-tab');">
                <i class="fa-solid fa-bolt" style="color: var(--success);"></i>
                <span>اختبارات المحاكاة (قياس)</span>
            </div>
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showStudentSection('s-courses-tab');">
                <i class="fa-solid fa-graduation-cap" style="color: var(--warning);"></i>
                <span>الدورات ومقررات قياس والتأسيس</span>
            </div>
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showStudentSection('s-active-tab');">
                <i class="fa-solid fa-list-check" style="color: #60A5FA;"></i>
                <span>الواجبات والتمارين المطلوبة</span>
            </div>
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTestimonialsView();">
                <i class="fa-solid fa-comments" style="color: #F472B6;"></i>
                <span>آراء وتجارب الطلاب</span>
            </div>
            <div style="border-top: 1px solid var(--border-color); margin: 10px 0; padding-top: 10px;">
                <div class="drawer-option-item" style="color: var(--danger); border-color: rgba(239,68,68,0.2);" onclick="closeModal('hamburger-drawer-modal'); logout();">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>تسجيل الخروج</span>
                </div>
            </div>
        `;
    } else if (user && (user.role === 'teacher' || user.role === 'supervisor')) {
        const isSupervisor = user.role === 'supervisor';
        if (avatarEl) avatarEl.textContent = user.name.charAt(0);
        if (nameEl) nameEl.textContent = user.name;
        if (statusEl) statusEl.textContent = isSupervisor ? "مشرف المنصة (لوحة الواجبات والطلاب)" : "المعلم (لوحة التحكم الشاملة)";
        
        if (isSupervisor) {
            optionsContainer.innerHTML = `
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-assignments-tab');">
                    <i class="fa-solid fa-desktop" style="color: var(--accent-orange);"></i>
                    <span>لوحة الواجبات المضافة والتصحيح</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-students-tab');">
                    <i class="fa-solid fa-users-gear" style="color: #60A5FA;"></i>
                    <span>إدارة الطلاب والاشتراكات</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-chat-tab');">
                    <i class="fa-solid fa-comments" style="color: #F472B6;"></i>
                    <span>دردشة الطلاب والتواصل</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTestimonialsView();">
                    <i class="fa-solid fa-star" style="color: #FBBF24;"></i>
                    <span>إدارة آراء وتجارب الطلاب</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-account-tab');">
                    <i class="fa-solid fa-key" style="color: var(--warning);"></i>
                    <span>تغيير كلمة المرور والاسم</span>
                </div>
                <div style="border-top: 1px solid var(--border-color); margin: 10px 0; padding-top: 10px;">
                    <div class="drawer-option-item" style="color: var(--danger); border-color: rgba(239,68,68,0.2);" onclick="closeModal('hamburger-drawer-modal'); logout();">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <span>تسجيل الخروج</span>
                    </div>
                </div>
            `;
        } else {
            optionsContainer.innerHTML = `
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-assignments-tab');">
                    <i class="fa-solid fa-desktop" style="color: var(--accent-orange);"></i>
                    <span>لوحة تحكم المعلم والواجبات</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-courses-tab');">
                    <i class="fa-solid fa-photo-film" style="color: var(--warning);"></i>
                    <span>إدارة المقررات ودورات قياس</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-simulators-tab');">
                    <i class="fa-solid fa-bolt" style="color: var(--success);"></i>
                    <span>إدارة اختبارات المحاكاة</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-simulators-results-tab');">
                    <i class="fa-solid fa-chart-bar" style="color: #10B981;"></i>
                    <span>نتائج اختبارات المحاكاة</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-students-tab');">
                    <i class="fa-solid fa-users-gear" style="color: #60A5FA;"></i>
                    <span>تقارير الطلاب والاشتراكات</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTeacherSection('t-chat-tab');">
                    <i class="fa-solid fa-comments" style="color: #F472B6;"></i>
                    <span>دردشة الطلاب</span>
                </div>
                <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTestimonialsView();">
                    <i class="fa-solid fa-star" style="color: #FBBF24;"></i>
                    <span>إدارة آراء وتجارب الطلاب</span>
                </div>
                <div style="border-top: 1px solid var(--border-color); margin: 10px 0; padding-top: 10px;">
                    <div class="drawer-option-item" style="color: var(--danger); border-color: rgba(239,68,68,0.2);" onclick="closeModal('hamburger-drawer-modal'); logout();">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <span>تسجيل الخروج</span>
                    </div>
                </div>
            `;
        }
    } else {
        if (avatarEl) avatarEl.innerHTML = `<i class="fa-solid fa-compass"></i>`;
        if (nameEl) nameEl.textContent = "منصة مَسار التعليمية";
        if (statusEl) statusEl.textContent = "منصة التأسيس واختبارات قياس";
        
        optionsContainer.innerHTML = `
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showLogin();">
                <i class="fa-solid fa-right-to-bracket" style="color: var(--accent-orange);"></i>
                <span>تسجيل الدخول</span>
            </div>
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); openModal('student-register-modal');">
                <i class="fa-solid fa-user-plus" style="color: var(--success);"></i>
                <span>إنشاء حساب طالب جديد</span>
            </div>
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showLandingPage();">
                <i class="fa-solid fa-graduation-cap" style="color: var(--warning);"></i>
                <span>استعرض الدورات ومحاكي قياس</span>
            </div>
            <div class="drawer-option-item" onclick="closeModal('hamburger-drawer-modal'); showTestimonialsView();">
                <i class="fa-solid fa-star" style="color: #FBBF24;"></i>
                <span>آراء وتجارب الطلاب</span>
            </div>
        `;
    }
}

function openStudentDashboardModal() {
    const sId = appState.currentUser ? appState.currentUser.id : null;
    if (!sId) {
        showLogin();
        return;
    }
    
    const student = appState.students.find(s => s.id === sId);
    if (!student) return;
    
    // Stats
    const sortedStudents = [...appState.students].sort((a,b) => b.xp - a.xp);
    const myRankIndex = sortedStudents.findIndex(s => s.id === sId);
    const myRank = myRankIndex !== -1 ? (myRankIndex + 1) : '--';
    const completedHomeworks = appState.submissions.filter(s => s.studentId === sId && s.status === 'graded');
    const studentLevelInfo = calculateLevel(student.xp);
    
    const rankEl = document.getElementById('s-modal-stat-rank');
    if (rankEl) rankEl.innerHTML = `<i class="fa-solid fa-trophy" style="color: gold;"></i> #${myRank} / ${appState.students.length}`;
    
    const xpEl = document.getElementById('s-modal-stat-xp');
    if (xpEl) xpEl.textContent = `${student.xp} XP`;
    
    const compEl = document.getElementById('s-modal-stat-completed');
    if (compEl) compEl.textContent = completedHomeworks.length;
    
    const nameEl = document.getElementById('s-modal-profile-name');
    if (nameEl) nameEl.textContent = student.name;
    
    const avatarEl = document.getElementById('s-modal-profile-avatar');
    if (avatarEl) avatarEl.textContent = student.name.charAt(0);
    
    const levelEl = document.getElementById('s-modal-profile-level');
    if (levelEl) levelEl.textContent = `${studentLevelInfo.title} (مستوى ${studentLevelInfo.level})`;
    
    // Badges
    const badgesContainer = document.getElementById('s-modal-profile-badges');
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
        Object.keys(BADGE_DETAILS).forEach(badgeKey => {
            const badge = BADGE_DETAILS[badgeKey];
            const isEarned = student.badges.includes(badgeKey);
            const badgeEl = document.createElement('span');
            badgeEl.className = `badge-item ${isEarned ? 'active' : ''}`;
            badgeEl.title = badge.desc;
            badgeEl.innerHTML = `<i class="fa-solid ${badge.icon}"></i> ${badge.name}`;
            badgesContainer.appendChild(badgeEl);
        });
    }
    
    // Enrolled Courses List & Progress
    const enrolledContainer = document.getElementById('s-modal-enrolled-courses-list');
    if (enrolledContainer) {
        enrolledContainer.innerHTML = '';
        const enrolledIds = student.enrolled_courses || [];
        const enrolledCourses = appState.courses.filter(c => enrolledIds.includes(c.id));
        
        if (enrolledCourses.length === 0) {
            enrolledContainer.innerHTML = `
                <div class="empty-state" style="padding: 20px;">
                    <i class="fa-solid fa-graduation-cap" style="font-size: 36px; color: var(--accent-orange);"></i>
                    <p style="margin-top: 8px;">أنت غير مشترك في أي دورة حالياً. اشترك في دورات قياس والتأسيس لبدء التعلم!</p>
                    <button class="btn btn-primary" style="margin-top: 10px; padding: 6px 16px;" onclick="closeModal('student-dashboard-modal'); openUnpaidModal('course');">
                        تواصل للاشتراك عبر الواتساب 💬
                    </button>
                </div>`;
        } else {
            enrolledCourses.forEach(course => {
                const lessons = appState.lessons.filter(l => l.courseId === course.id);
                const quizzes = appState.quizzes.filter(q => q.courseId === course.id);
                const totalItems = lessons.length + quizzes.length;
                
                let progressPercent = 0;
                if (totalItems > 0) {
                    progressPercent = Math.min(100, Math.round((Math.max(1, lessons.length) / Math.max(1, totalItems)) * 100));
                } else {
                    progressPercent = 100;
                }
                
                const card = document.createElement('div');
                card.className = 'glass-card';
                card.style.padding = '15px';
                card.style.marginBottom = '12px';
                card.style.border = '1px solid rgba(255, 125, 63, 0.2)';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <div>
                            <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                            <h4 style="font-size: 15px; font-weight: 700; margin-top: 6px; color: var(--text-main);">${course.title}</h4>
                        </div>
                        <span style="font-size: 13px; font-weight: 800; color: var(--success);">${progressPercent}% مكتمل</span>
                    </div>
                    
                    <div class="course-progress-bar">
                        <div class="course-progress-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 12px; color: var(--text-muted);">
                        <span><i class="fa-solid fa-video" style="color: var(--accent-orange);"></i> الدروس: ${lessons.length} | <i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i> الاختبارات: ${quizzes.length}</span>
                        <button class="btn btn-primary" style="padding: 4px 12px; font-size: 11.5px;" onclick="closeModal('student-dashboard-modal'); openStudentCourseModal('${course.id}')">
                            <i class="fa-solid fa-book-open"></i> تصفح المحتوى والدروس
                        </button>
                    </div>
                `;
                enrolledContainer.appendChild(card);
            });
        }
    }
    
    openModal('student-dashboard-modal');
}

function showStudentSection(tabId) {
    document.getElementById('landing-view').style.display = 'none';
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('teacher-view').style.display = 'none';
    document.getElementById('student-view').style.display = 'block';
    
    const targetTabBtn = document.querySelector(`#student-view button[onclick*="${tabId}"]`);
    if (targetTabBtn) {
        switchTab('student', tabId, targetTabBtn);
    }
    renderStudentDashboard();
}

function hideAllViews() {
    const viewIds = [
        'landing-view', 'login-view', 'teacher-view', 'student-view', 'testimonials-page-view',
        'create-assignment-page-view', 'edit-assignment-page-view',
        'create-course-page-view', 'add-lesson-page-view', 'create-quiz-page-view', 'create-simulator-page-view',
        'solve-assignment-page-view', 'grade-assignment-page-view', 'adjust-xp-page-view', 'cloud-config-page-view',
        'teacher-course-manage-page-view', 'student-course-page-view', 'student-quiz-page-view', 'student-simulator-page-view',
        'student-register-page-view', 'student-enrollment-page-view', 'unpaid-course-page-view', 'student-dashboard-page-view',
        'edit-teacher-name-page-view', 'badge-manager-page-view'
    ];
    viewIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

function showTeacherSection(tabId) {
    hideAllViews();
    document.getElementById('teacher-view').style.display = 'block';
    
    const targetTabBtn = document.querySelector(`#teacher-view button[onclick*="${tabId}"]`);
    if (targetTabBtn) {
        switchTab('teacher', tabId, targetTabBtn);
    }
    renderTeacherDashboard();
}

function showLandingPage() {
    updateHeaderUserBadge();
    hideAllViews();
    document.getElementById('landing-view').style.display = 'block';
    
    if (isCloudMode) {
        syncFromCloud().then(() => renderLandingPage());
    } else {
        renderLandingPage();
    }
}

function showLogin() {
    updateHeaderUserBadge();
    hideAllViews();
    document.getElementById('login-view').style.display = 'flex';
    
    document.getElementById('teacher-username-input').value = '';
    document.getElementById('teacher-pwd-input').value = '';
    document.getElementById('student-username-input').value = '';
    document.getElementById('student-pwd-input').value = '';
}

async function showDashboard() {
    updateHeaderUserBadge();
    hideAllViews();
    
    if (appState.currentUser && (appState.currentUser.role === 'teacher' || appState.currentUser.role === 'supervisor')) {
        document.getElementById('teacher-view').style.display = 'block';
        await renderTeacherDashboard();
    } else if (appState.currentUser && appState.currentUser.role === 'student') {
        document.getElementById('student-view').style.display = 'block';
        await renderStudentDashboard();
    } else {
        showLandingPage();
    }
}

function showCreateAssignmentView() {
    hideAllViews();
    const page = document.getElementById('create-assignment-page-view');
    if (page) page.style.display = 'block';
    
    const form = document.getElementById('create-assignment-form');
    if (form) form.reset();
    
    const mcqContainer = document.getElementById('assign-mcq-options-container');
    if (mcqContainer) mcqContainer.style.display = 'none';

    const targetTypeSelect = document.getElementById('assign-target-type');
    if (targetTypeSelect) targetTypeSelect.value = 'all';

    const searchInput = document.getElementById('create-assign-search-input');
    if (searchInput) searchInput.value = '';

    populateCreateAssignStudentsList(true);
    toggleCreateAssignStudentsList('all');
    setupDefaultDates();
}

function showCreateCourseView() {
    hideAllViews();
    const editIdInput = document.getElementById('course-edit-id');
    if (editIdInput) editIdInput.value = '';
    
    const pageForm = document.getElementById('create-course-page-form');
    if (pageForm) pageForm.reset();
    
    const titleText = document.getElementById('course-modal-title-text');
    if (titleText) titleText.innerHTML = `<i class="fa-solid fa-folder-plus" style="color: var(--warning); margin-left: 6px;"></i> إنشاء دورة تعليمية جديدة`;
    
    const btnText = document.getElementById('course-submit-btn-text');
    if (btnText) btnText.textContent = "إنشاء الدورة الآن";

    const page = document.getElementById('create-course-page-view');
    if (page) {
        page.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showCreateSimulatorView() {
    hideAllViews();
    
    const editIdInput = document.getElementById('quiz-edit-id');
    if (editIdInput) editIdInput.value = '';
    
    const courseIdInput = document.getElementById('quiz-course-id');
    if (courseIdInput) courseIdInput.value = 'simulator';
    
    const titleInput = document.getElementById('quiz-title');
    if (titleInput) titleInput.value = '';
    
    const pointsInput = document.getElementById('quiz-points');
    if (pointsInput) pointsInput.value = 100;
    
    const isSimInput = document.getElementById('quiz-is-simulator');
    if (isSimInput) {
        isSimInput.checked = true;
        toggleQuizSimulatorEditor(true);
    }
    
    const pTitle = document.getElementById('quiz-page-course-title');
    if (pTitle) pTitle.textContent = "محاكي / تحديد مستوى";

    const sectionsContainer = document.getElementById('quiz-sections-editor-container');
    if (sectionsContainer) {
        sectionsContainer.innerHTML = '';
        addQuizSectionEditorRow();
    }
    
    const questionsContainer = document.getElementById('quiz-questions-editor-container');
    if (questionsContainer) {
        questionsContainer.innerHTML = '';
        addQuizQuestionEditorRow();
    }

    const typeGroup = document.getElementById('quiz-simulator-type-group');
    if (typeGroup) {
        typeGroup.style.display = 'block';
        const simRadio = document.querySelector('input[name="simulator_type"][value="simulator"]');
        if (simRadio) simRadio.checked = true;
        toggleSimulatorTypeEditor();
    }

    const page = document.getElementById('create-quiz-page-view');
    if (page) page.style.display = 'block';
}

function showBadgeManagerView() {
    openBadgeManagerModal();
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

// Modal & Page View routing actions
const MODAL_TO_VIEW_MAP = {
    'submit-modal': 'solve-assignment-page-view',
    'grade-modal': 'grade-assignment-page-view',
    'adjust-xp-modal': 'adjust-xp-page-view',
    'cloud-config-modal': 'cloud-config-page-view',
    'teacher-course-manage-modal': 'teacher-course-manage-page-view',
    'student-course-modal': 'student-course-page-view',
    'student-quiz-modal': 'student-quiz-page-view',
    'student-simulator-modal': 'student-simulator-page-view',
    'student-register-modal': 'student-register-page-view',
    'student-enrollment-modal': 'student-enrollment-page-view',
    'unpaid-course-modal': 'unpaid-course-page-view',
    'student-dashboard-modal': 'student-dashboard-page-view',
    'edit-teacher-name-modal': 'edit-teacher-name-page-view',
    'badge-manager-modal': 'badge-manager-page-view'
};

function openModal(id) {
    const targetPageId = MODAL_TO_VIEW_MAP[id] || id;
    const overlayModals = ['hamburger-drawer-modal', 'add-testimonial-modal', 'placement-test-modal', 'question-review-modal'];
    const isOverlayModal = overlayModals.includes(id);
    
    if (isOverlayModal) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = '';
            modal.classList.add('active');
        }
        return;
    }
    
    hideAllViews();
    const pageView = document.getElementById(targetPageId);
    if (pageView) {
        pageView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function closeModal(id) {
    const overlayModals = ['hamburger-drawer-modal', 'add-testimonial-modal', 'placement-test-modal', 'question-review-modal'];
    const isOverlayModal = overlayModals.includes(id);
    if (isOverlayModal) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = '';
        }
        
        if (id === 'question-review-modal') {
            const iframe = document.getElementById('review-modal-video-iframe');
            if (iframe) iframe.src = '';
            
            const html5Video = document.getElementById('review-modal-html5-video');
            if (html5Video) {
                html5Video.pause();
                html5Video.currentTime = 0;
            }
        }
        return;
    }
    
    if (id === 'student-course-modal' || id === 'student-course-page-view') {
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
    showDashboard();
}

function openUnpaidModal(type) {
    const title = document.getElementById('unpaid-modal-title');
    const desc = document.getElementById('unpaid-modal-desc');
    const link = document.getElementById('unpaid-modal-whatsapp-link');
    
    if (title && desc && link) {
        if (type === 'simulator') {
            title.textContent = "عذراً! محاكي الاختبار مقفل";
            desc.innerHTML = "هذا المحاكي مخصص للطلاب المشتركين فقط. لتفعيل اشتراكك والوصول الكامل لجميع أقسام المحاكي والمؤقت التفاعلي، يرجى التواصل مع المعلم الخصوصي عبر الواتساب على الرقم **0501976467** أو بالضغط مباشرة على الزر الأخضر أدناه.";
            link.href = "https://wa.me/966501976467?text=" + encodeURIComponent("مرحباً أستاذ أرغب في الاشتراك وتفعيل محاكي الاختبارات التفاعلي");
        } else {
            title.textContent = "عذراً! هذا المقرر مقفل";
            desc.innerHTML = "هذه الدورة مدفوعة ومخصصة للطلاب المشتركين فقط. لتفعيل اشتراكك والوصول لشروحات الفيديو والاختبارات التفاعلية، يرجى التواصل مع المعلم الخصوصي عبر الواتساب على الرقم **0501976467** أو بالضغط مباشرة على الزر الأخضر أدناه.";
            link.href = "https://wa.me/966501976467?text=" + encodeURIComponent("مرحباً أستاذ أرغب في الاشتراك وتفعيل دورة مسار التعليمية");
        }
    }
    openModal('unpaid-course-modal');
}

// ==========================================
// LANDING PAGE LOGIC [NEW]
// ==========================================

function handleLandingCourseClick(courseId) {
    if (!appState.currentUser) {
        showLogin();
        return;
    }
    
    if (appState.currentUser.role === 'teacher') {
        showTeacherSection('t-courses-tab');
        openTeacherCourseManageModal(courseId);
    } else {
        const student = appState.students.find(s => s.id === appState.currentUser.id);
        const enrolledList = (student && student.enrolled_courses) ? student.enrolled_courses : [];
        const isEnrolled = enrolledList.includes(courseId);
        
        if (isEnrolled) {
            showStudentSection('s-courses-tab');
            openStudentCourseModal(courseId);
        } else {
            openUnpaidModal('course');
        }
    }
}

function formatCourseDescriptionWithPrice(description, price, isPaid) {
    let cleanDesc = (description || '').replace(/\[PRICE:\d+(\.\d+)?\]/gi, '').trim();
    if (isPaid && price > 0) {
        cleanDesc += `\n[PRICE:${price}]`;
    } else {
        cleanDesc += `\n[PRICE:0]`;
    }
    return cleanDesc;
}

function getCleanDescription(description) {
    if (!description) return '';
    return description.replace(/\[PRICE:\d+(\.\d+)?\]/gi, '').trim();
}

function deriveCoursePricing(course) {
    if (!course) return { price: 0, isPaid: false, isFree: true };

    let price = (course.price !== undefined && course.price !== null && !isNaN(course.price)) ? parseFloat(course.price) : 0;
    let isPaid = (course.isPaid === true || course.is_paid === true || price > 0);

    if (!isPaid || price === 0) {
        const text = ((course.title || '') + ' ' + (course.description || '')).toLowerCase();
        const priceMatch = text.match(/(\d+)\s*(ر\.س|ريال|رس|رـس)/i);
        if (priceMatch && priceMatch[1]) {
            price = parseFloat(priceMatch[1]);
            isPaid = true;
        } else if (text.includes('مدفوع') || text.includes('رسوم') || text.includes('سعر الاشتراك') || text.includes('اشتراك')) {
            isPaid = true;
            const numMatch = text.match(/(\d+)/);
            if (numMatch && numMatch[1]) {
                price = parseFloat(numMatch[1]);
            }
        }
    }

    const finalIsPaid = isPaid || (price > 0);
    return { price, isPaid: finalIsPaid, isFree: !finalIsPaid };
}

function extractCoursePricingFromCloud(c, matchedLocal) {
    let rawDesc = c.description || '';
    let priceMatch = rawDesc.match(/\[PRICE:(\d+(\.\d+)?)\]/i);
    
    let price = 0;
    let isPaid = false;

    if (priceMatch && priceMatch[1]) {
        price = parseFloat(priceMatch[1]);
        isPaid = price > 0;
    } else if (c.price !== undefined && c.price !== null && Number(c.price) > 0) {
        price = parseFloat(c.price);
        isPaid = true;
    } else if (c.is_paid === true) {
        isPaid = true;
        price = c.price ? parseFloat(c.price) : 0;
    } else if (matchedLocal && matchedLocal.price > 0) {
        price = parseFloat(matchedLocal.price);
        isPaid = true;
    }

    if (!isPaid || price === 0) {
        const derived = deriveCoursePricing({
            title: c.title,
            description: rawDesc,
            subject: c.subject,
            price: price,
            isPaid: isPaid
        });
        price = derived.price;
        isPaid = derived.isPaid;
    }

    const cleanDesc = getCleanDescription(rawDesc);

    return {
        price,
        isPaid,
        cleanDescription: cleanDesc
    };
}

async function openQuickPriceModal(courseId) {
    const course = appState.courses.find(c => String(c.id) === String(courseId));
    if (!course) return;

    const pricing = deriveCoursePricing(course);
    const defaultVal = pricing.price > 0 ? pricing.price : '';
    const newPriceStr = prompt(
        `💰 تحديث سعر الاشتراك بالدورة:\n"${course.title}"\n\n` +
        `أدخل سعر الدورة الجديد بالريال السعودي (أو اتركه 0 إذا كانت الدورة مجانية بالكامل):`,
        defaultVal
    );

    if (newPriceStr === null) return;

    const inputVal = newPriceStr.trim();
    const newPrice = parseFloat(inputVal);

    if (isNaN(newPrice) || newPrice <= 0) {
        course.price = 0;
        course.isPaid = false;
    } else {
        course.price = newPrice;
        course.isPaid = true;
    }

    const descWithPrice = formatCourseDescriptionWithPrice(course.description, course.price, course.isPaid);

    try {
        localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
        if (isCloudMode && supabaseClient) {
            await supabaseClient.from('courses').update({
                title: course.title,
                description: descWithPrice,
                subject: course.subject
            }).eq('id', course.id);

            try {
                await supabaseClient.from('courses').update({
                    price: course.price,
                    is_paid: course.isPaid
                }).eq('id', course.id);
            } catch(err2) {}
        }
    } catch (e) {
        console.warn("Cloud update notice:", e);
    }

    showToast(`تم بنجاح تحديث وتزامن سعر الدورة على جميع الأجهزة والجوالات إلى (${course.isPaid ? course.price + ' ر.س' : 'مجانية'})! 🎉`, 'success');
    renderTeacherCourses();
    renderLandingPage();
    if (appState.currentUser && appState.currentUser.role === 'student') {
        renderStudentCourses();
    }
}

function toggleCoursePriceInput(val) {
    const group = document.getElementById('page-course-price-group');
    if (group) {
        group.style.display = (val === 'paid') ? 'block' : 'none';
    }
}

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
    } else {
        appState.courses.forEach(course => {
            const lessonsCount = appState.lessons.filter(l => String(l.courseId) === String(course.id)).length;
            const quizzesCount = appState.quizzes.filter(q => String(q.courseId) === String(course.id)).length;

            const isEnrolled = (appState.currentUser && appState.currentUser.role === 'student' && appState.currentUser.enrolled_courses) 
                                ? appState.currentUser.enrolled_courses.includes(course.id) 
                                : false;
            
            const pricing = deriveCoursePricing(course);
            
            let priceBadge = '';
            if (isEnrolled) {
                priceBadge = `<span style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 20px; font-weight: 800; font-size: 11.5px;"><i class="fa-solid fa-check-circle"></i> مشترك</span>`;
            } else {
                priceBadge = pricing.isFree 
                    ? `<span style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 20px; font-weight: 800; font-size: 11.5px;"><i class="fa-solid fa-gift"></i> مجانية</span>`
                    : `<span style="background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); padding: 3px 10px; border-radius: 20px; font-weight: 800; font-size: 11.5px;"><i class="fa-solid fa-tag"></i> ${pricing.price} ر.س</span>`;
            }

            const card = document.createElement('div');
            card.className = 'glass-card course-card';
            card.innerHTML = `
                <div>
                    <div class="course-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                        ${priceBadge}
                    </div>
                    <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main); margin-top: 6px;">${escapeHtml(course.title)}</h4>
                    <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(getCleanDescription(course.description))}</p>
                    
                    <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
                        <span><i class="fa-solid fa-video" style="color: var(--accent-orange);"></i> الدروس: ${lessonsCount}</span>
                        <span><i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i> الاختبارات: ${quizzesCount}</span>
                    </div>
                </div>
                
                <button class="btn btn-secondary" onclick="openStudentCourseModal('${course.id}')" style="width: 100%; border-color: var(--accent-orange); color: var(--text-orange); font-weight: 800;">
                    <i class="fa-solid fa-graduation-cap"></i> تصفح تفاصيل الدورة والدروس 🌟
                </button>
            `;
            grid.appendChild(card);
        });
    }

    renderLandingTestimonials();
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

    // Populate Target Student options dynamically if element exists
    const assignStudentSelect = document.getElementById('assign-student');
    if (assignStudentSelect) {
        assignStudentSelect.innerHTML = '<option value="all">كل الطلاب</option>';
        appState.students.forEach(stud => {
            const option = document.createElement('option');
            option.value = stud.id;
            option.textContent = stud.name;
            assignStudentSelect.appendChild(option);
        });
    }
    populateCreateAssignStudentsList();

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

    const isSupervisor = appState.currentUser && appState.currentUser.role === 'supervisor';
    const coursesTabBtn = document.querySelector(`button[onclick*="t-courses-tab"]`);
    const simulatorsTabBtn = document.querySelector(`button[onclick*="t-simulators-tab"]`);
    
    if (coursesTabBtn) coursesTabBtn.style.display = isSupervisor ? 'none' : 'inline-flex';
    if (simulatorsTabBtn) simulatorsTabBtn.style.display = isSupervisor ? 'none' : 'inline-flex';

    renderTeacherAssignments();
    renderTeacherSubmissions(pendingSubmissions);
    renderTeacherStudents();
    if (!isSupervisor) renderTeacherCourses();
    if (!isSupervisor) renderTeacherSimulators();
    if (!isSupervisor) renderTeacherPlacementTests();
    if (!isSupervisor) renderTeacherSimulatorResults();
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
    if (!tAssignmentsList) return;
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
            
            let targetStudentName = 'جميع الطلاب';
            let targetedCount = appState.students.length;
            
            if (Array.isArray(assign.targetStudent)) {
                const names = assign.targetStudent.map(id => appState.students.find(s => s.id === id)?.name || id);
                targetStudentName = names.length > 2 ? `${names.slice(0, 2).join(', ')}... (+${names.length - 2})` : names.join(', ');
                targetedCount = assign.targetStudent.length;
            } else if (assign.targetStudent && assign.targetStudent !== 'all') {
                targetStudentName = appState.students.find(s => s.id === assign.targetStudent)?.name || 'طالب محدد';
                targetedCount = 1;
            }
            
            const card = document.createElement('div');
            card.className = 'assignment-card';
            card.innerHTML = `
                <div class="assignment-header">
                    <div>
                        <span class="assignment-subject subject-${assign.subject}">${SUBJECT_NAMES[assign.subject] || assign.subject}</span>
                        <h4 class="assignment-title" style="margin-top: 8px;">${escapeHtml(assign.title)}</h4>
                    </div>
                    <div style="text-align: left;">
                        <span style="font-weight: 700; color: var(--text-orange); font-size: 15px;">${assign.points} XP</span>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">المستهدف: <strong>${escapeHtml(targetStudentName)}</strong></div>
                    </div>
                </div>
                
                <p style="font-size: 14px; color: var(--text-muted); white-space: pre-line; line-height: 1.5;">${escapeHtml(assign.desc)}</p>
                
                <div class="assignment-meta">
                    <span><i class="fa-regular fa-calendar"></i> تاريخ التسليم: ${assign.dueDate}</span>
                    <span><i class="fa-solid fa-users"></i> تسليمات الطلاب: ${submissionsCount} / ${targetedCount}</span>
                    <span><i class="fa-solid fa-circle-check" style="color: var(--success);"></i> تم تصحيح: ${gradedCount}</span>
                </div>
                
                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px;">
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12.5px; border-color: var(--accent-orange); color: var(--text-orange);" onclick="openEditAssignmentModal('${assign.id}')">
                        <i class="fa-regular fa-pen-to-square"></i> تعديل الواجب والطلاب
                    </button>
                    <button class="btn btn-danger btn-secondary" style="padding: 6px 12px; font-size: 12.5px;" onclick="deleteAssignment('${assign.id}')">
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
        const assignedCount = appState.assignments.filter(a => a.targetStudent === 'all' || (Array.isArray(a.targetStudent) ? a.targetStudent.includes(student.id) : a.targetStudent === student.id)).length;
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
    
    // Add Courses Header
    const courseHeader = document.createElement('h5');
    courseHeader.style.color = 'var(--text-orange)';
    courseHeader.style.margin = '10px 0 5px 0';
    courseHeader.style.fontSize = '12.5px';
    courseHeader.textContent = 'الدورات والمقررات:';
    list.appendChild(courseHeader);
    
    if (appState.courses.length === 0) {
        const span = document.createElement('span');
        span.style.fontSize = '12px';
        span.style.color = 'var(--text-muted)';
        span.style.fontStyle = 'italic';
        span.textContent = 'لا توجد دورات مضافة حالياً';
        list.appendChild(span);
    } else {
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
    }
    
    // Add Simulators Header
    const simulatorHeader = document.createElement('h5');
    simulatorHeader.style.color = 'var(--success)';
    simulatorHeader.style.margin = '15px 0 5px 0';
    simulatorHeader.style.fontSize = '12.5px';
    simulatorHeader.textContent = 'اختبارات المحاكي المستقلة:';
    list.appendChild(simulatorHeader);
    
    const simulatorQuizzes = appState.quizzes.filter(q => q.isSimulator && (!q.courseId || q.courseId === 'simulator'));
    if (simulatorQuizzes.length === 0) {
        const span = document.createElement('span');
        span.style.fontSize = '12px';
        span.style.color = 'var(--text-muted)';
        span.style.fontStyle = 'italic';
        span.textContent = 'لا توجد اختبارات محاكاة مستقلة مضافة حالياً';
        list.appendChild(span);
    } else {
        simulatorQuizzes.forEach(quiz => {
            const isChecked = enrolledList.includes(quiz.id) ? 'checked' : '';
            const label = document.createElement('label');
            label.className = 'enrollment-checkbox-item';
            label.innerHTML = `
                <input type="checkbox" value="${quiz.id}" ${isChecked}>
                <span>${quiz.title} (${quiz.points} XP)</span>
            `;
            list.appendChild(label);
        });
    }
    
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
// STUDENT TARGETING HELPER FUNCTIONS
// ==========================================

function populateCreateAssignStudentsList(forceReset = false) {
    const grid = document.getElementById('create-assign-students-grid');
    if (!grid) return;

    const currentCheckedIds = forceReset ? [] : Array.from(document.querySelectorAll('.create-assign-student-cb:checked')).map(cb => cb.value);
    grid.innerHTML = '';

    if (!appState.students || appState.students.length === 0) {
        grid.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا يوجد طلاب مسجلين بعد</span>';
        return;
    }

    appState.students.forEach(student => {
        const isChecked = currentCheckedIds.includes(student.id);
        const item = document.createElement('div');
        item.className = 'create-assign-student-item';
        item.dataset.name = (student.name || '').toLowerCase();
        item.dataset.username = (student.username || '').toLowerCase();
        item.style.cssText = `display: inline-flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; padding: 8px 12px; border-radius: 8px; background: ${isChecked ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)'}; border: ${isChecked ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)'}; user-select: none; transition: all 0.15s ease;`;

        item.onclick = function(e) {
            const cb = this.querySelector('.create-assign-student-cb');
            if (cb) {
                if (e.target !== cb) {
                    cb.checked = !cb.checked;
                }
                updateStudentItemStyle(cb);
            }
        };

        item.innerHTML = `
            <input type="checkbox" class="create-assign-student-cb" value="${student.id}" ${isChecked ? 'checked' : ''} style="accent-color: var(--accent-orange); width: 17px; height: 17px; cursor: pointer;" onclick="event.stopPropagation(); updateStudentItemStyle(this);" onchange="updateStudentItemStyle(this);">
            <strong style="color: var(--text-main); pointer-events: none;">${escapeHtml(student.name)}</strong>
            <span style="font-size: 11px; color: var(--text-muted); pointer-events: none;">(@${escapeHtml(student.username)})</span>
        `;
        grid.appendChild(item);
    });
}

function toggleCreateAssignStudentsList(type) {
    const container = document.getElementById('create-assign-students-container');
    if (container) {
        container.style.display = type === 'custom' ? 'block' : 'none';
    }
}

function filterCreateAssignStudents(query) {
    const q = (query || '').toLowerCase().trim();
    const items = document.querySelectorAll('.create-assign-student-item');
    items.forEach(item => {
        const name = item.dataset.name || '';
        const username = item.dataset.username || '';
        if (!q || name.includes(q) || username.includes(q)) {
            item.style.display = 'inline-flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function selectAllCreateAssignStudents(checkAll) {
    const cbs = document.querySelectorAll('.create-assign-student-cb');
    cbs.forEach(cb => {
        const parentItem = cb.closest('.create-assign-student-item');
        if (parentItem && parentItem.style.display !== 'none') {
            cb.checked = checkAll;
            updateStudentItemStyle(cb);
        }
    });
}

function toggleEditAssignStudentsList(val) {
    const container = document.getElementById('edit-assign-students-container');
    const grid = document.getElementById('edit-assign-students-grid');
    if (container) {
        container.style.display = val === 'custom' ? 'block' : 'none';
    } else if (grid) {
        grid.style.display = val === 'custom' ? 'flex' : 'none';
    }
}

function filterEditAssignStudents(query) {
    const q = (query || '').toLowerCase().trim();
    const items = document.querySelectorAll('.edit-assign-student-item');
    items.forEach(item => {
        const name = item.dataset.name || '';
        const username = item.dataset.username || '';
        if (!q || name.includes(q) || username.includes(q)) {
            item.style.display = 'inline-flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function selectAllEditAssignStudents(checkAll) {
    const cbs = document.querySelectorAll('.edit-assign-student-cb');
    cbs.forEach(cb => {
        const parentItem = cb.closest('.edit-assign-student-item');
        if (parentItem && parentItem.style.display !== 'none') {
            cb.checked = checkAll;
            updateStudentItemStyle(cb);
        }
    });
}

function updateStudentItemStyle(cb) {
    const item = cb.closest('.create-assign-student-item, .edit-assign-student-item');
    if (item) {
        item.style.background = cb.checked ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)';
        item.style.border = cb.checked ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)';
    }
}

// Add New Assignment (Teacher)
async function handleCreateAssignment(e) {
    e.preventDefault();
    
    const title = document.getElementById('assign-title').value.trim();
    const desc = document.getElementById('assign-desc').value.trim();
    const subject = document.getElementById('assign-subject').value;
    const points = parseInt(document.getElementById('assign-points').value) || 100;
    const dueDate = document.getElementById('assign-duedate').value;
    const type = document.getElementById('assign-type').value;

    const targetTypeSelect = document.getElementById('assign-target-type');
    const targetType = targetTypeSelect ? targetTypeSelect.value : 'all';
    let targetStudent = 'all';

    if (targetType === 'custom') {
        const checkedCbs = document.querySelectorAll('.create-assign-student-cb:checked');
        const selectedIds = Array.from(checkedCbs).map(cb => cb.value);
        if (selectedIds.length === 0) {
            showToast("يرجى اختيار طالب واحد على الأقل!", "danger");
            return;
        }
        targetStudent = selectedIds.length === 1 ? selectedIds[0] : selectedIds;
    }
    
    let options = [];
    let correctOption = -1;
    
    if (type === 'mcq') {
        let opt0 = document.getElementById('assign-opt-0').value.trim();
        let opt1 = document.getElementById('assign-opt-1').value.trim();
        let opt2 = document.getElementById('assign-opt-2').value.trim();
        let opt3 = document.getElementById('assign-opt-3').value.trim();
        
        // Auto default to أ, ب, ج, د if left empty by teacher
        opt0 = opt0 || "أ";
        opt1 = opt1 || "ب";
        opt2 = opt2 || "ج";
        opt3 = opt3 || "د";
        
        options = [opt0, opt1, opt2, opt3];
        correctOption = parseInt(document.getElementById('assign-correct').value);
    }

    let imageBase64 = '';
    const imageInput = document.getElementById('assign-image');
    if (imageInput && imageInput.files && imageInput.files[0]) {
        imageBase64 = await compressImage(imageInput.files[0]);
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
        correctOption,
        image: imageBase64
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
                target_student: Array.isArray(newAssignment.targetStudent) ? JSON.stringify(newAssignment.targetStudent) : newAssignment.targetStudent,
                options: newAssignment.options,
                correct_option: newAssignment.correctOption,
                image: newAssignment.image
            });
            if (error) throw error;
        } else {
            appState.assignments.push(newAssignment);
            localStorage.setItem('masar_assignments', JSON.stringify(appState.assignments));
        }

        if (isCloudMode && supabaseClient) {
            appState.assignments.push(newAssignment);
        }
        
        showToast('تم نشر الواجب الجديد للطلاب بنجاح! 🚀', 'success');
        document.getElementById('create-assignment-form').reset();
        toggleAssignmentOptions('text');
        setupDefaultDates();
        showTeacherSection('t-assignments-tab');
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

function removeEditAssignImage() {
    const previewContainer = document.getElementById('edit-assign-image-preview-container');
    if (previewContainer) previewContainer.style.display = 'none';
    const assignId = document.getElementById('edit-assign-id').value;
    const assign = appState.assignments.find(a => a.id === assignId);
    if (assign) {
        assign.image = '';
    }
    const imageInput = document.getElementById('edit-assign-image');
    if (imageInput) imageInput.value = '';
    showToast("تمت إزالة صورة الواجب!", "info");
}

function openEditAssignmentModal(assignId) {
    const assign = appState.assignments.find(a => a.id === assignId);
    if (!assign) return;

    document.getElementById('edit-assign-id').value = assignId;
    document.getElementById('edit-assign-title').value = assign.title || '';
    document.getElementById('edit-assign-desc').value = assign.desc || '';
    document.getElementById('edit-assign-subject').value = assign.subject || 'math';
    document.getElementById('edit-assign-points').value = assign.points || 50;
    document.getElementById('edit-assign-duedate').value = assign.dueDate || '';
    document.getElementById('edit-assign-link').value = assign.link || '';

    const searchInput = document.getElementById('edit-assign-search-input');
    if (searchInput) searchInput.value = '';

    const imageInput = document.getElementById('edit-assign-image');
    if (imageInput) imageInput.value = '';

    const previewContainer = document.getElementById('edit-assign-image-preview-container');
    const previewImg = document.getElementById('edit-assign-image-preview');
    if (previewContainer && previewImg) {
        if (assign.image) {
            previewImg.src = assign.image;
            previewContainer.style.display = 'block';
        } else {
            previewContainer.style.display = 'none';
        }
    }

    // Handle MCQ options display
    const mcqContainer = document.getElementById('edit-assign-mcq-container');
    if (assign.options && Array.isArray(assign.options) && assign.options.length > 0) {
        mcqContainer.style.display = 'block';
        document.getElementById('edit-assign-opt-0').value = assign.options[0] || 'أ';
        document.getElementById('edit-assign-opt-1').value = assign.options[1] || 'ب';
        document.getElementById('edit-assign-opt-2').value = assign.options[2] || 'ج';
        document.getElementById('edit-assign-opt-3').value = assign.options[3] || 'د';
        document.getElementById('edit-assign-correct').value = assign.correctOption !== undefined ? assign.correctOption : 0;
    } else {
        mcqContainer.style.display = 'none';
    }

    // Populate Students Checkboxes List
    const targetTypeSelect = document.getElementById('edit-assign-target-type');
    const grid = document.getElementById('edit-assign-students-grid');
    grid.innerHTML = '';

    let targetedIds = [];
    if (Array.isArray(assign.targetStudent)) {
        targetedIds = assign.targetStudent;
        targetTypeSelect.value = 'custom';
    } else if (assign.targetStudent && assign.targetStudent !== 'all') {
        targetedIds = [assign.targetStudent];
        targetTypeSelect.value = 'custom';
    } else {
        targetTypeSelect.value = 'all';
    }

    toggleEditAssignStudentsList(targetTypeSelect.value);

    appState.students.forEach(student => {
        const isChecked = targetedIds.includes(student.id);
        const item = document.createElement('div');
        item.className = 'edit-assign-student-item';
        item.dataset.name = (student.name || '').toLowerCase();
        item.dataset.username = (student.username || '').toLowerCase();
        item.style.cssText = `display: inline-flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; padding: 8px 12px; border-radius: 8px; background: ${isChecked ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)'}; border: ${isChecked ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)'}; user-select: none; transition: all 0.15s ease;`;

        item.onclick = function(e) {
            const cb = this.querySelector('.edit-assign-student-cb');
            if (cb) {
                if (e.target !== cb) {
                    cb.checked = !cb.checked;
                }
                updateStudentItemStyle(cb);
            }
        };

        item.innerHTML = `
            <input type="checkbox" class="edit-assign-student-cb" value="${student.id}" ${isChecked ? 'checked' : ''} style="accent-color: var(--accent-orange); width: 17px; height: 17px; cursor: pointer;" onclick="event.stopPropagation(); updateStudentItemStyle(this);" onchange="updateStudentItemStyle(this);">
            <strong style="color: var(--text-main); pointer-events: none;">${escapeHtml(student.name)}</strong>
            <span style="font-size: 11px; color: var(--text-muted); pointer-events: none;">(@${escapeHtml(student.username)})</span>
        `;
        grid.appendChild(item);
    });

    hideAllViews();
    document.getElementById('edit-assignment-page-view').style.display = 'block';
}

async function handleSaveEditAssignment(e) {
    e.preventDefault();
    const assignId = document.getElementById('edit-assign-id').value;
    const assign = appState.assignments.find(a => a.id === assignId);
    if (!assign) return;

    const title = document.getElementById('edit-assign-title').value.trim();
    const desc = document.getElementById('edit-assign-desc').value.trim();
    const subject = document.getElementById('edit-assign-subject').value;
    const points = parseInt(document.getElementById('edit-assign-points').value) || 50;
    const dueDate = document.getElementById('edit-assign-duedate').value;
    const link = document.getElementById('edit-assign-link').value.trim();

    if (!title || !desc || !dueDate) {
        showToast("يرجى تعبئة الحقول المطلوبة!", "danger");
        return;
    }

    let image = assign.image || '';
    const imageInput = document.getElementById('edit-assign-image');
    if (imageInput && imageInput.files && imageInput.files[0]) {
        image = await compressImage(imageInput.files[0]);
    }

    // MCQ
    let options = assign.options;
    let correctOption = assign.correctOption;
    if (options && Array.isArray(options) && options.length > 0) {
        let opt0 = document.getElementById('edit-assign-opt-0').value.trim();
        let opt1 = document.getElementById('edit-assign-opt-1').value.trim();
        let opt2 = document.getElementById('edit-assign-opt-2').value.trim();
        let opt3 = document.getElementById('edit-assign-opt-3').value.trim();
        
        opt0 = opt0 || "أ";
        opt1 = opt1 || "ب";
        opt2 = opt2 || "ج";
        opt3 = opt3 || "د";

        options = [opt0, opt1, opt2, opt3];
        correctOption = parseInt(document.getElementById('edit-assign-correct').value);
    }

    // Target Students
    const targetType = document.getElementById('edit-assign-target-type').value;
    let targetStudent = 'all';

    if (targetType === 'custom') {
        const checkedCbs = document.querySelectorAll('.edit-assign-student-cb:checked');
        const selectedIds = Array.from(checkedCbs).map(cb => cb.value);
        if (selectedIds.length === 0) {
            showToast("يرجى اختيار طالب واحد على الأقل!", "danger");
            return;
        }
        targetStudent = selectedIds.length === 1 ? selectedIds[0] : selectedIds;
    }

    const oldAssign = { ...assign };
    assign.title = title;
    assign.desc = desc;
    assign.subject = subject;
    assign.points = points;
    assign.dueDate = dueDate;
    assign.image = image;
    assign.link = link;
    assign.options = options;
    assign.correctOption = correctOption;
    assign.targetStudent = targetStudent;

    try {
        if (isCloudMode && supabaseClient) {
            const updatePayload = {
                title: assign.title,
                description: assign.desc,
                subject: assign.subject,
                points: assign.points,
                due_date: assign.dueDate,
                image: assign.image,
                options: assign.options,
                correct_option: assign.correctOption,
                target_student: Array.isArray(assign.targetStudent) ? JSON.stringify(assign.targetStudent) : assign.targetStudent
            };

            const { error } = await supabaseClient.from('assignments').update(updatePayload).eq('id', assign.id);
            if (error) {
                console.warn("Supabase update error, retrying standard payload:", error);
                const { error: retryError } = await supabaseClient.from('assignments').update(updatePayload).eq('id', assign.id);
                if (retryError) throw retryError;
            }
        }
        
        localStorage.setItem('masar_assignments', JSON.stringify(appState.assignments));
        showToast("تم تحديث وتعيين الواجب بنجاح! 📝", "success");
        showTeacherSection('t-assignments-tab');
    } catch (err) {
        console.error("Save Edit Assignment Error:", err);
        Object.assign(assign, oldAssign);
        showToast("فشل حفظ التعديلات في السحابة!", "danger");
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

// Open Adjust XP & Badges Modal
function openAdjustXPModal(studentId) {
    const student = appState.students.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('adjust-xp-student-id').value = studentId;
    document.getElementById('adjust-xp-student-name').textContent = student.name;
    document.getElementById('adjust-xp-amount').value = '';
    document.getElementById('adjust-xp-reason').value = '';
    
    // Populate Badges checkboxes for this student
    const container = document.getElementById('adjust-xp-student-badges-list');
    if (container) {
        container.innerHTML = '';
        const all = getAllBadges();
        const studentBadges = student.badges || [];
        
        Object.keys(all).forEach(key => {
            const b = all[key];
            const isChecked = studentBadges.includes(key);
            
            const label = document.createElement('label');
            label.style.display = 'inline-flex';
            label.style.alignItems = 'center';
            label.style.gap = '6px';
            label.style.padding = '4px 10px';
            label.style.borderRadius = '20px';
            label.style.fontSize = '12px';
            label.style.cursor = 'pointer';
            label.style.background = isChecked ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.05)';
            label.style.border = isChecked ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)';
            label.style.color = isChecked ? 'var(--text-main)' : 'var(--text-muted)';
            
            label.innerHTML = `
                <input type="checkbox" value="${key}" ${isChecked ? 'checked' : ''} style="accent-color: var(--accent-orange);">
                <i class="fa-solid ${b.icon}" style="color: ${isChecked ? 'var(--accent-orange)' : 'inherit'};"></i>
                <span>${escapeHtml(b.name)}</span>
            `;
            container.appendChild(label);
        });
    }
    
    openModal('adjust-xp-modal');
}

// Save Adjusted XP & Badges (Teacher)
async function handleAdjustXP(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('adjust-xp-student-id').value;
    const amountStr = document.getElementById('adjust-xp-amount').value.trim();
    const reason = document.getElementById('adjust-xp-reason').value.trim();
    
    const studentIndex = appState.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;
    
    const student = appState.students[studentIndex];
    const oldXp = student.xp;
    const oldBadges = [...(student.badges || [])];
    
    if (amountStr !== '') {
        const amount = parseInt(amountStr);
        if (!isNaN(amount)) {
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
        }
    }
    
    // Collect checked badges
    const container = document.getElementById('adjust-xp-student-badges-list');
    if (container) {
        const checkedInputs = container.querySelectorAll('input[type="checkbox"]:checked');
        student.badges = Array.from(checkedInputs).map(cb => cb.value);
    }
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('students').update({ xp: student.xp, badges: student.badges }).eq('id', studentId);
            if (error) throw error;
        } else {
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        }
        
        closeModal('adjust-xp-modal');
        showToast(`تم بنجاح حفظ بيانات وأوسمة الطالب (${student.name})! 🎉`, 'success');
        await renderTeacherDashboard();
    } catch (err) {
        console.error("XP & Badges adjust error:", err);
        student.xp = oldXp;
        student.badges = oldBadges;
        showToast("فشل حفظ التعديلات والأوسمة في السحابة!", "danger");
    }
}

async function resetAllStudentsXP() {
    if (!appState.students || appState.students.length === 0) {
        showToast("لا يوجد طلاب مسجلون بالمنصة حالياً!", "warning");
        return;
    }

    const confirmReset = confirm(
        `🚨 تصفير رصيد النقاط (XP) لجميع الطلاب:\n\n` +
        `هل أنت متأكد من رغبتك في تصفير نقاط جميع الطلاب (${appState.students.length} طالب) إلى 0؟\n\n` +
        `يُستخدم هذا الإجراء لإعادة إطلاق الفعاليات والمسابقات الشهرية من جديد، ولا يمكن التراجع عنه!`
    );

    if (!confirmReset) return;

    try {
        // Reset all local XP
        appState.students.forEach(student => {
            student.xp = 0;
        });

        // Sync with Supabase Cloud
        if (isCloudMode && supabaseClient) {
            for (const student of appState.students) {
                try {
                    await supabaseClient.from('students').update({ xp: 0 }).eq('id', student.id);
                } catch(e) {
                    console.warn(`Supabase reset XP error for ${student.id}:`, e);
                }
            }
        }

        try {
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
        } catch (e) {}

        if (appState.currentUser && appState.currentUser.role === 'student') {
            appState.currentUser.xp = 0;
        }

        showToast("تم بنجاح تصفير رصيد نقاط (XP) جميع الطلاب لبدء الفعالية الشهرية الجديدة! 🏆🔄", "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error("Reset all students XP error:", err);
        showToast("حدث خطأ أثناء تصفير نقاط الطلاب!", "danger");
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
    }
    
    const gradeImageContainer = document.getElementById('grade-modal-image-container');
    const gradeImage = document.getElementById('grade-modal-image');
    if (gradeImageContainer && gradeImage) {
        if (assign.image) {
            gradeImageContainer.style.display = 'block';
            gradeImage.src = assign.image;
        } else {
            gradeImageContainer.style.display = 'none';
            gradeImage.src = '';
        }
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
        const lessonsCount = appState.lessons.filter(l => String(l.courseId) === String(course.id)).length;
        const quizzesCount = appState.quizzes.filter(q => String(q.courseId) === String(course.id)).length;

        const pricing = deriveCoursePricing(course);
        const priceBadge = pricing.isFree 
            ? `<span style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 8px; border-radius: 12px; font-weight: 800; font-size: 11px;"><i class="fa-solid fa-gift"></i> مجانية</span>`
            : `<span style="background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); padding: 3px 8px; border-radius: 12px; font-weight: 800; font-size: 11px;"><i class="fa-solid fa-tag"></i> ${pricing.price} ر.س</span>`;

        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                    ${priceBadge}
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main); margin-top: 6px;">${escapeHtml(course.title)}</h4>
                <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(getCleanDescription(course.description))}</p>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px;">
                    <span><i class="fa-solid fa-video" style="color: var(--accent-orange);"></i> الدروس: ${lessonsCount}</span>
                    <span><i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i> الاختبارات: ${quizzesCount}</span>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                <button class="btn btn-primary" style="width: 100%; padding: 8px; font-size: 13px;" onclick="openTeacherCourseManageModal('${course.id}')">
                    <i class="fa-solid fa-gear"></i> إدارة محتويات الدورة
                </button>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary" style="flex: 1; padding: 6px; font-size: 11.5px;" onclick="openAddLessonModal('${course.id}', '${escapeHtml(course.title)}')">
                        <i class="fa-solid fa-plus"></i> درس فيديو
                    </button>
                    <button class="btn btn-secondary" style="flex: 1; padding: 6px; font-size: 11.5px;" onclick="openAddQuizModal('${course.id}', '${escapeHtml(course.title)}')">
                        <i class="fa-solid fa-plus"></i> اختبار قصير
                    </button>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary" style="flex: 1; padding: 6px; font-size: 11.5px; border-color: var(--warning); color: var(--warning);" onclick="openQuickPriceModal('${course.id}')" title="تحديث وتعيين سعر الدورة سريعا">
                        <i class="fa-solid fa-tag"></i> تعديل السعر 💰
                    </button>
                    <button class="btn btn-secondary" style="flex: 1; padding: 6px; font-size: 11.5px; border-color: var(--accent-orange); color: var(--text-orange);" onclick="openEditCourseModal('${course.id}')">
                        <i class="fa-regular fa-edit"></i> تعديل البيانات
                    </button>
                    <button class="btn btn-danger btn-secondary" style="padding: 6px 10px; font-size: 11.5px;" onclick="deleteCourse('${course.id}')" title="حذف الدورة">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function openEditCourseModal(courseId) {
    const course = appState.courses.find(c => String(c.id) === String(courseId));
    if (!course) return;
    
    hideAllViews();
    
    const editIdInput = document.getElementById('course-edit-id');
    if (editIdInput) editIdInput.value = course.id;
    
    const titleInput = document.getElementById('page-course-title') || document.getElementById('course-title');
    if (titleInput) titleInput.value = course.title;
    
    const subjectSelect = document.getElementById('page-course-subject') || document.getElementById('course-subject');
    if (subjectSelect) subjectSelect.value = course.subject;

    const isPaid = course.isPaid || (course.price > 0);
    const priceTypeSelect = document.getElementById('page-course-price-type');
    if (priceTypeSelect) {
        priceTypeSelect.value = isPaid ? 'paid' : 'free';
        toggleCoursePriceInput(priceTypeSelect.value);
    }
    
    const priceInput = document.getElementById('page-course-price');
    if (priceInput) priceInput.value = course.price || '';
    
    const descTextarea = document.getElementById('page-course-desc') || document.getElementById('course-desc');
    if (descTextarea) descTextarea.value = getCleanDescription(course.description);
    
    const titleText = document.getElementById('course-modal-title-text');
    if (titleText) titleText.innerHTML = `<i class="fa-solid fa-edit" style="color: var(--accent-orange); margin-left: 6px;"></i> تعديل بيانات المقرر الدراسي`;
    
    const btnText = document.getElementById('course-submit-btn-text');
    if (btnText) btnText.textContent = "حفظ التعديلات";
    
    const page = document.getElementById('create-course-page-view');
    if (page) {
        page.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function handleCreateCourse(e) {
    e.preventDefault();
    const editIdInput = document.getElementById('course-edit-id');
    const editId = editIdInput ? editIdInput.value : '';

    const titleInput = document.getElementById('page-course-title') || document.getElementById('course-title');
    const title = titleInput ? titleInput.value.trim() : '';

    const subjectSelect = document.getElementById('page-course-subject') || document.getElementById('course-subject');
    const subject = subjectSelect ? subjectSelect.value : 'math';

    const priceTypeSelect = document.getElementById('page-course-price-type');
    const priceType = priceTypeSelect ? priceTypeSelect.value : 'free';
    
    const priceInput = document.getElementById('page-course-price');
    const priceVal = priceInput ? parseFloat(priceInput.value) : 0;
    
    const isPaid = (priceType === 'paid');
    const price = isPaid ? (isNaN(priceVal) ? 0 : priceVal) : 0;

    const descTextarea = document.getElementById('page-course-desc') || document.getElementById('course-desc');
    const description = descTextarea ? descTextarea.value.trim() : '';

    if (!title) {
        showToast("يرجى كتابة عنوان المقرر!", "danger");
        return;
    }

    const descWithPrice = formatCourseDescriptionWithPrice(description, price, isPaid);

    if (editId) {
        // Edit Mode
        const course = appState.courses.find(c => String(c.id) === String(editId));
        if (!course) return;
        
        course.title = title;
        course.subject = subject;
        course.description = description;
        course.price = price;
        course.isPaid = isPaid;
        
        try {
            if (isCloudMode && supabaseClient) {
                await supabaseClient.from('courses').update({
                    title: course.title,
                    description: descWithPrice,
                    subject: course.subject
                }).eq('id', editId);

                try {
                    await supabaseClient.from('courses').update({
                        price: course.price,
                        is_paid: course.isPaid
                    }).eq('id', editId);
                } catch(err2) {}
            }
            localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
            const pageForm = document.getElementById('create-course-page-form');
            if (pageForm) pageForm.reset();
            showToast("تم تعديل المقرر الدراسي وتزامنه بنجاح! 🎓", "success");
            showTeacherSection('t-courses-tab');
        } catch (err) {
            console.error(err);
            localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
            const pageForm = document.getElementById('create-course-page-form');
            if (pageForm) pageForm.reset();
            showToast("تم حفظ التعديلات بنجاح! 🎓", "success");
            showTeacherSection('t-courses-tab');
        }
    } else {
        // Create Mode
        const newCourse = {
            id: 'course-' + Date.now(),
            title,
            description,
            subject,
            price,
            isPaid,
            createdAt: new Date().toISOString().split('T')[0]
        };

        appState.courses.push(newCourse);
        try {
            localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
        } catch (e) {}

        try {
            if (isCloudMode && supabaseClient) {
                await supabaseClient.from('courses').insert({
                    id: newCourse.id,
                    title: newCourse.title,
                    description: descWithPrice,
                    subject: newCourse.subject,
                    created_at: newCourse.createdAt
                });

                try {
                    await supabaseClient.from('courses').update({
                        price: newCourse.price,
                        is_paid: newCourse.isPaid
                    }).eq('id', newCourse.id);
                } catch(err2) {}
            }

            const pageForm = document.getElementById('create-course-page-form');
            if (pageForm) pageForm.reset();
            showToast("تم إنشاء المقرر الدراسي وتزامنه بنجاح! 🎓", "success");
            showTeacherSection('t-courses-tab');
        } catch (err) {
            console.error(err);
            const pageForm = document.getElementById('create-course-page-form');
            if (pageForm) pageForm.reset();
            showToast("تم إنشاء المقرر الدراسي بنجاح! 🎓", "success");
            showTeacherSection('t-courses-tab');
        }
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
    document.getElementById('lesson-edit-id').value = '';
    document.getElementById('lesson-course-id').value = courseId;
    
    const pTitle = document.getElementById('lesson-page-course-title');
    if (pTitle) pTitle.textContent = courseTitle;
    const mTitle = document.getElementById('lesson-course-title');
    if (mTitle) mTitle.textContent = courseTitle;
    
    const form = document.getElementById('create-lesson-form');
    if (form) form.reset();
    toggleVideoSourceInput('url');
    
    hideAllViews();
    document.getElementById('add-lesson-page-view').style.display = 'block';
}

function openEditLessonModal(lessonId) {
    const lesson = appState.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    const course = appState.courses.find(c => c.id === lesson.courseId);
    if (!course) return;
    
    document.getElementById('lesson-edit-id').value = lesson.id;
    document.getElementById('lesson-course-id').value = lesson.courseId;
    
    const pTitle = document.getElementById('lesson-page-course-title');
    if (pTitle) pTitle.textContent = course.title;
    const mTitle = document.getElementById('lesson-course-title');
    if (mTitle) mTitle.textContent = course.title;
    
    document.getElementById('lesson-title').value = lesson.title;
    document.getElementById('lesson-duration').value = lesson.duration || '10:00';
    
    if (lesson.videoUrl && lesson.videoUrl.startsWith('blob:')) {
        document.getElementById('lesson-video-type').value = 'local';
        toggleVideoSourceInput('local');
    } else {
        document.getElementById('lesson-video-type').value = 'url';
        toggleVideoSourceInput('url');
        document.getElementById('lesson-video-url').value = lesson.videoUrl || '';
    }
    
    hideAllViews();
    document.getElementById('add-lesson-page-view').style.display = 'block';
}

function openAddQuizModal(courseId, courseTitle) {
    document.getElementById('quiz-edit-id').value = '';
    document.getElementById('quiz-course-id').value = courseId;
    
    const pTitle = document.getElementById('quiz-page-course-title');
    if (pTitle) pTitle.textContent = courseTitle;
    const mTitle = document.getElementById('quiz-course-title');
    if (mTitle) mTitle.textContent = courseTitle;
    
    const pageForm = document.getElementById('create-quiz-page-form');
    if (pageForm) pageForm.reset();
    const form = document.getElementById('create-quiz-form');
    if (form) form.reset();
    
    document.getElementById('quiz-is-simulator').checked = false;
    toggleQuizSimulatorEditor(false);
    
    const typeGroup = document.getElementById('quiz-simulator-type-group');
    if (typeGroup) typeGroup.style.display = 'none';
    const placeSettings = document.getElementById('quiz-placement-settings');
    if (placeSettings) placeSettings.style.display = 'none';
    
    const container = document.getElementById('quiz-questions-editor-container');
    container.innerHTML = '';
    addQuizQuestionEditorRow();
    
    const sectionsContainer = document.getElementById('quiz-sections-editor-container');
    if (sectionsContainer) sectionsContainer.innerHTML = '';
    
    hideAllViews();
    document.getElementById('create-quiz-page-view').style.display = 'block';
}

function openEditQuizModal(quizId) {
    const quiz = appState.quizzes.find(q => String(q.id) === String(quizId));
    if (!quiz) return;
    const course = appState.courses.find(c => String(c.id) === String(quiz.courseId));
    const courseTitle = course ? course.title : "محاكي اختبارات مستقل (قياس)";
    
    document.getElementById('quiz-edit-id').value = quiz.id;
    document.getElementById('quiz-course-id').value = quiz.courseId || 'simulator';
    
    const pTitle = document.getElementById('quiz-page-course-title');
    if (pTitle) pTitle.textContent = courseTitle;
    const mTitle = document.getElementById('quiz-course-title');
    if (mTitle) mTitle.textContent = courseTitle;
    
    const titleText = document.getElementById('quiz-modal-title-text');
    if (titleText) {
        titleText.innerHTML = quiz.isSimulator 
            ? `<i class="fa-solid fa-bolt" style="color: var(--success); margin-left: 6px;"></i> تعديل محاكي الاختبارات / تحديد المستوى`
            : `<i class="fa-solid fa-clipboard-question" style="color: var(--accent-orange); margin-left: 6px;"></i> تعديل الاختبار التفاعلي`;
    }

    const submitBtnText = document.getElementById('quiz-submit-btn-text');
    if (submitBtnText) submitBtnText.textContent = "حفظ التعديلات";
    
    document.getElementById('quiz-title').value = quiz.title;
    document.getElementById('quiz-points').value = quiz.points;
    
    const isSim = quiz.isSimulator || false;
    document.getElementById('quiz-is-simulator').checked = isSim;
    
    const typeGroup = document.getElementById('quiz-simulator-type-group');
    if (typeGroup) typeGroup.style.display = isSim ? 'block' : 'none';
    
    const isPlacement = isSim && quiz.type === 'placement';
    if (isSim) {
        const simRadio = document.querySelector(`input[name="simulator_type"][value="${isPlacement ? 'placement' : 'simulator'}"]`);
        if (simRadio) simRadio.checked = true;
    }
    
    toggleQuizSimulatorEditor(isSim);
    if (isSim) toggleSimulatorTypeEditor();
    
    if (isPlacement) {
        document.getElementById('placement-target-percent').value = quiz.placementTarget || 80;
        document.getElementById('placement-high-msg').value = quiz.placementHighMsg || '';
        document.getElementById('placement-low-msg').value = quiz.placementLowMsg || '';
    }
    
    const container = document.getElementById('quiz-questions-editor-container');
    if (container) container.innerHTML = '';
    
    const sectionsContainer = document.getElementById('quiz-sections-editor-container');
    if (sectionsContainer) sectionsContainer.innerHTML = '';
    
    if (isSim && !isPlacement) {
        if (quiz.questions && Array.isArray(quiz.questions)) {
            quiz.questions.forEach(section => {
                addQuizSectionEditorRow(section);
            });
        }
    } else {
        if (quiz.questions && Array.isArray(quiz.questions)) {
            quiz.questions.forEach(q => {
                addQuizQuestionEditorRow(q);
            });
        }
    }
    hideAllViews();
    const page = document.getElementById('create-quiz-page-view');
    if (page) {
        page.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function handleQuestionImageSelect(inputEl) {
    if (inputEl.files && inputEl.files[0]) {
        const compressedBase64 = await compressImage(inputEl.files[0]);
        const hiddenInput = inputEl.parentElement.querySelector('.question-image-data');
        if (hiddenInput) {
            hiddenInput.value = compressedBase64;
        }
        
        let previewContainer = inputEl.parentElement.querySelector('.question-image-preview-container');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'question-image-preview-container';
            previewContainer.style.marginTop = '5px';
            inputEl.parentElement.appendChild(previewContainer);
        }
        previewContainer.innerHTML = `
            <img src="${compressedBase64}" style="max-height: 80px; border-radius: 4px; border: 1px solid var(--border-color);">
            <button type="button" class="btn btn-danger" style="padding: 2px 6px; font-size: 10px; margin-top: 4px; display: block;" onclick="removeQuestionImage(this)">حذف الصورة</button>
        `;
    }
}

function removeQuestionImage(btnEl) {
    const parent = btnEl.parentElement.parentElement;
    const hiddenInput = parent.querySelector('.question-image-data');
    const fileInput = parent.querySelector('.question-image-input');
    const previewContainer = parent.querySelector('.question-image-preview-container');
    
    if (hiddenInput) hiddenInput.value = '';
    if (fileInput) fileInput.value = '';
    if (previewContainer) previewContainer.remove();
}

function addQuizQuestionEditorRow(questionData = null) {
    const container = document.getElementById('quiz-questions-editor-container');
    const index = container.children.length + 1;
    
    const row = document.createElement('div');
    row.className = 'quiz-editor-row question-editor-row';
    
    const hasImage = questionData && questionData.image;
    const opts = (questionData && Array.isArray(questionData.options)) ? questionData.options : [];
    
    row.innerHTML = `
        <button type="button" class="remove-question-btn" onclick="this.parentElement.remove()" title="حذف هذا السؤال">&times;</button>
        <div style="font-weight: 700; font-size: 13px; color: var(--text-orange); margin-bottom: 8px;">السؤال ${index}:</div>
        <div class="form-group">
            <input type="text" class="question-text" placeholder="اكتب السؤال هنا (مثال: إذا كان $س = ٥$ فما قيمة $س^٢$؟)" value="${questionData ? escapeHtml(questionData.question) : ''}">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="form-group">
                <input type="text" class="opt-0" placeholder="الخيار الأول (أ)" value="${escapeHtml(opts[0] || 'أ')}">
            </div>
            <div class="form-group">
                <input type="text" class="opt-1" placeholder="الخيار الثاني (ب)" value="${escapeHtml(opts[1] || 'ب')}">
            </div>
            <div class="form-group">
                <input type="text" class="opt-2" placeholder="الخيار الثالث (ج)" value="${escapeHtml(opts[2] || 'ج')}">
            </div>
            <div class="form-group">
                <input type="text" class="opt-3" placeholder="الخيار الرابع (د)" value="${escapeHtml(opts[3] || 'د')}">
            </div>
        </div>
        <div class="form-group" style="margin-top: 4px;">
            <label style="font-size: 11.5px; color: var(--accent-orange); font-weight: 700;">رابط فيديو لشرح السؤال (يوتيوب اختياري):</label>
            <input type="text" class="question-video-url" placeholder="الصق رابط يوتيوب هنا..." value="${questionData && questionData.videoUrl ? escapeHtml(questionData.videoUrl) : ''}">
        </div>
        <div class="form-group" style="margin-top: 4px;">
            <label style="font-size: 11.5px; color: var(--success); font-weight: 700;">الخيار الصحيح:</label>
            <select class="correct-answer" style="padding: 4px 10px;">
                <option value="0" ${(questionData && questionData.correct === 0) ? 'selected' : ''}>الخيار الأول (أ)</option>
                <option value="1" ${(questionData && questionData.correct === 1) ? 'selected' : ''}>الخيار الثاني (ب)</option>
                <option value="2" ${(questionData && questionData.correct === 2) ? 'selected' : ''}>الخيار الثالث (ج)</option>
                <option value="3" ${(questionData && questionData.correct === 3) ? 'selected' : ''}>الخيار الرابع (د)</option>
            </select>
        </div>
        
        <div class="form-group" style="margin-top: 6px; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 6px;">
            <label style="font-size: 11.5px; color: var(--text-orange); font-weight: 700;">إرفاق صورة للسؤال (اختياري):</label>
            <input type="file" class="question-image-input" accept="image/*" style="padding: 4px; font-size: 11px; background: rgba(0,0,0,0.1); width: 100%; border: 1px solid var(--border-color); border-radius: 4px;" onchange="handleQuestionImageSelect(this)">
            <input type="hidden" class="question-image-data" value="${hasImage ? questionData.image : ''}">
            ${hasImage ? `
                <div class="question-image-preview-container" style="margin-top: 5px;">
                    <img src="${questionData.image}" style="max-height: 80px; border-radius: 4px; border: 1px solid var(--border-color);">
                    <button type="button" class="btn btn-danger" style="padding: 2px 6px; font-size: 10px; margin-top: 4px; display: block;" onclick="removeQuestionImage(this)">حذف الصورة</button>
                </div>
            ` : ''}
        </div>
    `;
    container.appendChild(row);
}

function toggleQuizSimulatorEditor(checked) {
    const normalEditor = document.getElementById('quiz-normal-editor');
    const simulatorEditor = document.getElementById('quiz-simulator-editor');
    const typeGroup = document.getElementById('quiz-simulator-type-group');
    const placeSettings = document.getElementById('quiz-placement-settings');
    const titleInput = document.getElementById('quiz-title');
    
    if (checked) {
        if (typeGroup) typeGroup.style.display = 'block';
        toggleSimulatorTypeEditor(); // Call to handle the exact state based on selected radio
        titleInput.placeholder = "مثال: محاكي اختبار القدرات التجريبي الأول";
    } else {
        if (typeGroup) typeGroup.style.display = 'none';
        if (placeSettings) placeSettings.style.display = 'none';
        if (normalEditor) normalEditor.style.display = 'block';
        if (simulatorEditor) simulatorEditor.style.display = 'none';
        titleInput.placeholder = "مثال: اختبار قصير على درس الهندسة";
    }
}

function toggleSimulatorTypeEditor() {
    const simType = document.querySelector('input[name="simulator_type"]:checked');
    if (!simType) return;
    
    const isPlacement = simType.value === 'placement';
    const normalEditor = document.getElementById('quiz-normal-editor');
    const simulatorEditor = document.getElementById('quiz-simulator-editor');
    const placeSettings = document.getElementById('quiz-placement-settings');
    const titleInput = document.getElementById('quiz-title');
    
    if (isPlacement) {
        if (normalEditor) normalEditor.style.display = 'block';
        if (simulatorEditor) simulatorEditor.style.display = 'none';
        if (placeSettings) placeSettings.style.display = 'block';
        if (titleInput) titleInput.placeholder = "مثال: اختبار تحديد مستوى مسار";
        
        const questionsContainer = document.getElementById('quiz-questions-editor-container');
        if (questionsContainer && questionsContainer.children.length === 0) {
            addQuizQuestionEditorRow();
        }
    } else {
        if (normalEditor) normalEditor.style.display = 'none';
        if (simulatorEditor) simulatorEditor.style.display = 'block';
        if (placeSettings) placeSettings.style.display = 'none';
        if (titleInput) titleInput.placeholder = "مثال: محاكي اختبار القدرات التجريبي الأول";
        
        const sectionsContainer = document.getElementById('quiz-sections-editor-container');
        if (sectionsContainer && sectionsContainer.children.length === 0) {
            addQuizSectionEditorRow();
        }
    }
}

function addQuizSectionEditorRow(sectionData = null) {
    const container = document.getElementById('quiz-sections-editor-container');
    if (!container) return;
    const index = container.children.length + 1;
    
    const sectionBlock = document.createElement('div');
    sectionBlock.className = 'simulator-section-editor-block';
    
    const sectionId = 'section-block-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    sectionBlock.id = sectionId;
    
    sectionBlock.innerHTML = `
        <button type="button" class="remove-section-btn" onclick="document.getElementById('${sectionId}').remove()" title="حذف هذا القسم">حذف القسم &times;</button>
        <div style="font-weight: 800; font-size: 13.5px; color: var(--success); margin-bottom: 12px;">القسم ${index}:</div>
        <div class="form-group">
            <label style="font-size: 11.5px; font-weight: 700;">اسم القسم (مثل: القسم الكمي الأول):</label>
            <input type="text" class="section-title-input" placeholder="ادخل اسم القسم هنا" value="${sectionData ? escapeHtml(sectionData.sectionTitle) : ''}">
        </div>
        
        <div style="margin-top: 15px; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 12px; color: var(--text-orange);">أسئلة هذا القسم:</strong>
                <button type="button" class="btn btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="addSectionQuestionDirectly('${sectionId}')">
                    <i class="fa-solid fa-plus"></i> أضف سؤالاً للقسم
                </button>
            </div>
            <div class="section-questions-container" style="display: flex; flex-direction: column; gap: 8px;">
                <!-- Questions for this section will go here -->
            </div>
        </div>
    `;
    
    container.appendChild(sectionBlock);
    
    const questionsContainer = sectionBlock.querySelector('.section-questions-container');
    if (sectionData && sectionData.questions) {
        sectionData.questions.forEach(q => {
            addQuizSectionQuestionRow(questionsContainer, q);
        });
    } else {
        addQuizSectionQuestionRow(questionsContainer);
    }
}

function addQuizSectionQuestionRow(sectionContainer, questionData = null) {
    const index = sectionContainer.children.length + 1;
    const row = document.createElement('div');
    row.className = 'quiz-editor-row section-question-editor-row';
    
    const hasImage = questionData && questionData.image;
    const opts = (questionData && Array.isArray(questionData.options)) ? questionData.options : [];
    
    row.innerHTML = `
        <button type="button" class="remove-question-btn" onclick="this.parentElement.remove()" title="حذف هذا السؤال">&times;</button>
        <div style="font-weight: 700; font-size: 12.5px; color: var(--text-orange); margin-bottom: 6px;">سؤال ${index}:</div>
        <div class="form-group">
            <input type="text" class="question-text" placeholder="اكتب السؤال هنا" value="${questionData ? escapeHtml(questionData.question) : ''}">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="form-group">
                <input type="text" class="opt-0" placeholder="الخيار الأول (أ)" value="${escapeHtml(opts[0] || 'أ')}">
            </div>
            <div class="form-group">
                <input type="text" class="opt-1" placeholder="الخيار الثاني (ب)" value="${escapeHtml(opts[1] || 'ب')}">
            </div>
            <div class="form-group">
                <input type="text" class="opt-2" placeholder="الخيار الثالث (ج)" value="${escapeHtml(opts[2] || 'ج')}">
            </div>
            <div class="form-group">
                <input type="text" class="opt-3" placeholder="الخيار الرابع (د)" value="${escapeHtml(opts[3] || 'د')}">
            </div>
        </div>
        <div class="form-group" style="margin-top: 4px;">
            <label style="font-size: 11.5px; color: var(--accent-orange); font-weight: 700;">رابط فيديو لشرح السؤال (يوتيوب اختياري):</label>
            <input type="text" class="question-video-url" placeholder="الصق رابط يوتيوب هنا..." value="${questionData && questionData.videoUrl ? escapeHtml(questionData.videoUrl) : ''}">
        </div>
        <div class="form-group" style="margin-top: 4px;">
            <label style="font-size: 11.5px; color: var(--success); font-weight: 700;">الخيار الصحيح:</label>
            <select class="correct-answer" style="padding: 4px 10px;">
                <option value="0" ${(questionData && questionData.correct === 0) ? 'selected' : ''}>الخيار الأول (أ)</option>
                <option value="1" ${(questionData && questionData.correct === 1) ? 'selected' : ''}>الخيار الثاني (ب)</option>
                <option value="2" ${(questionData && questionData.correct === 2) ? 'selected' : ''}>الخيار الثالث (ج)</option>
                <option value="3" ${(questionData && questionData.correct === 3) ? 'selected' : ''}>الخيار الرابع (د)</option>
            </select>
        </div>
        
        <div class="form-group" style="margin-top: 6px; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 6px;">
            <label style="font-size: 11.5px; color: var(--text-orange); font-weight: 700;">إرفاق صورة للسؤال (اختياري):</label>
            <input type="file" class="question-image-input" accept="image/*" style="padding: 4px; font-size: 11px; background: rgba(0,0,0,0.1); width: 100%; border: 1px solid var(--border-color); border-radius: 4px;" onchange="handleQuestionImageSelect(this)">
            <input type="hidden" class="question-image-data" value="${hasImage ? questionData.image : ''}">
            ${hasImage ? `
                <div class="question-image-preview-container" style="margin-top: 5px;">
                    <img src="${questionData.image}" style="max-height: 80px; border-radius: 4px; border: 1px solid var(--border-color);">
                    <button type="button" class="btn btn-danger" style="padding: 2px 6px; font-size: 10px; margin-top: 4px; display: block;" onclick="removeQuestionImage(this)">حذف الصورة</button>
                </div>
            ` : ''}
        </div>
    `;
    sectionContainer.appendChild(row);
}

function addSectionQuestionDirectly(sectionId) {
    const sectionBlock = document.getElementById(sectionId);
    if (sectionBlock) {
        const questionsContainer = sectionBlock.querySelector('.section-questions-container');
        if (questionsContainer) {
            addQuizSectionQuestionRow(questionsContainer);
        }
    }
}

async function handleCreateQuiz(e) {
    e.preventDefault();
    const courseId = document.getElementById('quiz-course-id').value;
    const editId = document.getElementById('quiz-edit-id').value;
    const title = document.getElementById('quiz-title').value.trim();
    const points = parseInt(document.getElementById('quiz-points').value) || 50;
    const isSimulator = document.getElementById('quiz-is-simulator').checked;
    
    let quizType = 'normal';
    let placementTarget = 80;
    let placementHighMsg = '';
    let placementLowMsg = '';
    
    if (isSimulator) {
        const simRadio = document.querySelector('input[name="simulator_type"]:checked');
        quizType = simRadio ? simRadio.value : 'simulator';
        
        if (quizType === 'placement') {
            placementTarget = parseInt(document.getElementById('placement-target-percent').value) || 80;
            placementHighMsg = document.getElementById('placement-high-msg').value.trim();
            placementLowMsg = document.getElementById('placement-low-msg').value.trim();
        }
    }

    const questions = [];

    if (isSimulator && quizType === 'simulator') {
        const sectionBlocks = document.querySelectorAll('.simulator-section-editor-block');
        if (sectionBlocks.length === 0) {
            showToast("يرجى إضافة قسم واحد على الأقل للمحاكي!", "danger");
            return;
        }

        let hasQuestions = true;
        sectionBlocks.forEach(block => {
            const sectionTitle = block.querySelector('.section-title-input').value.trim();
            const sectionQEls = block.querySelectorAll('.section-question-editor-row');
            if (sectionQEls.length === 0) {
                hasQuestions = false;
            }

            const sectionQuestions = [];
            sectionQEls.forEach(row => {
                const questionText = row.querySelector('.question-text').value.trim();
                const opt0 = row.querySelector('.opt-0').value.trim() || 'أ';
                const opt1 = row.querySelector('.opt-1').value.trim() || 'ب';
                const opt2 = row.querySelector('.opt-2').value.trim() || 'ج';
                const opt3 = row.querySelector('.opt-3').value.trim() || 'د';
                const correct = parseInt(row.querySelector('.correct-answer').value);
                const videoUrl = row.querySelector('.question-video-url') ? row.querySelector('.question-video-url').value.trim() : '';
                const imageVal = row.querySelector('.question-image-data') ? row.querySelector('.question-image-data').value : '';

                sectionQuestions.push({
                    question: questionText,
                    options: [opt0, opt1, opt2, opt3],
                    correct,
                    videoUrl,
                    image: imageVal
                });
            });

            questions.push({
                sectionTitle,
                questions: sectionQuestions
            });
        });

        if (!hasQuestions) {
            showToast("يرجى التأكد من إضافة سؤال واحد على الأقل في كل قسم!", "danger");
            return;
        }
    } else {
        const rowEls = document.querySelectorAll('#quiz-questions-editor-container .question-editor-row');
        if (rowEls.length === 0) {
            showToast("يرجى إضافة سؤال واحد على الأقل للاختبار!", "danger");
            return;
        }

        rowEls.forEach(row => {
            const questionText = row.querySelector('.question-text').value.trim();
            const opt0 = row.querySelector('.opt-0').value.trim() || 'أ';
            const opt1 = row.querySelector('.opt-1').value.trim() || 'ب';
            const opt2 = row.querySelector('.opt-2').value.trim() || 'ج';
            const opt3 = row.querySelector('.opt-3').value.trim() || 'د';
            const correct = parseInt(row.querySelector('.correct-answer').value);
            const videoUrl = row.querySelector('.question-video-url') ? row.querySelector('.question-video-url').value.trim() : '';
            const imageVal = row.querySelector('.question-image-data') ? row.querySelector('.question-image-data').value : '';

            questions.push({
                question: questionText,
                options: [opt0, opt1, opt2, opt3],
                correct,
                videoUrl,
                image: imageVal
            });
        });
    }

    if (editId) {
        // Edit Mode
        const quiz = appState.quizzes.find(q => String(q.id) === String(editId));
        if (!quiz) return;
        
        quiz.title = title;
        quiz.questions = questions;
        quiz.points = points;
        quiz.isSimulator = isSimulator;
        quiz.type = quizType;
        if (quizType === 'placement') {
            quiz.placementTarget = placementTarget;
            quiz.placementHighMsg = placementHighMsg;
            quiz.placementLowMsg = placementLowMsg;
        }
        
        try {
            if (isCloudMode && supabaseClient) {
                let cloudQuestions = [...questions];
                if (quizType === 'placement') {
                    cloudQuestions.unshift({
                        _isPlacementMeta: true,
                        placementTarget,
                        placementHighMsg,
                        placementLowMsg
                    });
                }
                const { error } = await supabaseClient.from('quizzes').update({
                    title,
                    questions: cloudQuestions,
                    points,
                    is_simulator: isSimulator
                }).eq('id', editId);
                if (error) throw error;
            }
            
            localStorage.setItem('masar_quizzes', JSON.stringify(appState.quizzes));
            showToast("تم تعديل الاختبار بنجاح!", "success");
            showDashboard();
            if (courseId !== 'simulator') renderTeacherCourseManage(courseId);
        } catch (err) {
            console.error(err);
            showToast("حدث خطأ أثناء تعديل الاختبار السحابي", "danger");
        }
    } else {
        // Create Mode
        const newQuiz = {
            id: 'quiz_' + Date.now(),
            courseId,
            title,
            questions,
            points,
            isSimulator,
            type: quizType
        };
        
        if (quizType === 'placement') {
            newQuiz.placementTarget = placementTarget;
            newQuiz.placementHighMsg = placementHighMsg;
            newQuiz.placementLowMsg = placementLowMsg;
        }

        try {
            if (isCloudMode && supabaseClient) {
                let cloudQuestions = [...questions];
                if (quizType === 'placement') {
                    cloudQuestions.unshift({
                        _isPlacementMeta: true,
                        placementTarget,
                        placementHighMsg,
                        placementLowMsg
                    });
                }
                const { data, error } = await supabaseClient.from('quizzes').insert([{
                    id: newQuiz.id,
                    course_id: courseId === 'simulator' ? null : courseId,
                    title,
                    questions: cloudQuestions,
                    points,
                    is_simulator: isSimulator
                }]);
                if (error) throw error;
            }
            
            appState.quizzes.push(newQuiz);
            localStorage.setItem('masar_quizzes', JSON.stringify(appState.quizzes));
            
            if (courseId !== 'simulator') {
                const course = appState.courses.find(c => String(c.id) === String(courseId));
                if (course) {
                    if (!course.quizzes) course.quizzes = [];
                    course.quizzes.push(newQuiz.id);
                    localStorage.setItem('masar_courses', JSON.stringify(appState.courses));
                    if (isCloudMode && supabaseClient) {
                        await supabaseClient.from('courses').update({ quizzes: course.quizzes }).eq('id', courseId);
                    }
                }
            }
            
            showToast("تم إنشاء الاختبار بنجاح!", "success");
            showDashboard();
            if (courseId !== 'simulator') renderTeacherCourseManage(courseId);
        } catch (err) {
            console.error(err);
            showToast("حدث خطأ أثناء حفظ الاختبار السحابي", "danger");
        }
    }
}

// Backup Alias for compatibility
function handleSaveQuiz(e) {
    return handleCreateQuiz(e);
}

async function deleteQuiz(quizId) {
    const quiz = appState.quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    const courseId = quiz.courseId;
    
    if (confirm(`هل أنت متأكد من حذف الاختبار "${quiz.title}"؟`)) {
        try {
            if (isCloudMode && supabaseClient) {
                const { error } = await supabaseClient.from('quizzes').delete().eq('id', quizId);
                if (error) throw error;
            } else {
                appState.quizzes = appState.quizzes.filter(q => q.id !== quizId);
                localStorage.setItem('masar_quizzes', JSON.stringify(appState.quizzes));
            }
            showToast("تم حذف الاختبار بنجاح.", "success");
            await renderTeacherDashboard();
            const cmView6 = document.getElementById('teacher-course-manage-page-view');
            if (cmView6 && cmView6.style.display !== 'none') {
                openTeacherCourseManageModal(courseId);
            }
        } catch (err) {
            console.error(err);
            showToast("فشل حذف الاختبار من السحابة!", "danger");
        }
    }
}

function openTeacherCourseManageModal(courseId) {
    const course = appState.courses.find(c => String(c.id) === String(courseId));
    if (!course) return;
    
    const titleEl = document.getElementById('t-course-manage-modal-title');
    if (titleEl) titleEl.textContent = `إدارة محتويات المقرر: ${course.title}`;
    
    const editBtn = document.getElementById('t-course-manage-edit-btn');
    if (editBtn) editBtn.onclick = () => openEditCourseModal(course.id);
    
    // Render Lessons List
    const lessonsList = document.getElementById('t-course-lessons-list');
    lessonsList.innerHTML = '';
    const courseLessons = appState.lessons.filter(l => String(l.courseId) === String(courseId));
    
    if (courseLessons.length === 0) {
        lessonsList.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا توجد دروس فيديو مضافة بعد</span>';
    } else {
        courseLessons.forEach(lesson => {
            const div = document.createElement('div');
            div.className = 'lesson-item';
            div.style.cursor = 'default';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-regular fa-circle-play" style="color: var(--accent-orange);"></i>
                        <span style="font-size: 13px; font-weight: 600;">${lesson.title}</span>
                    </div>
                    <span style="font-size: 11px; color: var(--text-muted); padding-right: 20px;">${lesson.duration}</span>
                </div>
                <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="openEditLessonModal('${lesson.id}')">
                        <i class="fa-regular fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-danger btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="deleteLesson('${lesson.id}')">
                        <i class="fa-regular fa-trash-can"></i> حذف
                    </button>
                </div>
            `;
            lessonsList.appendChild(div);
        });
    }
    
    // Render Quizzes List
    const quizzesList = document.getElementById('t-course-quizzes-list');
    quizzesList.innerHTML = '';
    const courseQuizzes = appState.quizzes.filter(q => String(q.courseId) === String(courseId));
    
    if (courseQuizzes.length === 0) {
        quizzesList.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا توجد اختبارات مضافة بعد</span>';
    } else {
        courseQuizzes.forEach(quiz => {
            const div = document.createElement('div');
            div.className = 'quiz-item';
            div.style.cursor = 'default';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i>
                        <span style="font-size: 13px; font-weight: 600;">${quiz.title}</span>
                    </div>
                    <span style="font-size: 11.5px; font-weight: 700; color: var(--text-orange); padding-right: 22px;">
                        ${quiz.points} XP ${quiz.isSimulator ? '<span style="font-size: 9.5px; background: var(--success); color: #000; padding: 2px 5px; border-radius: 4px; margin-right: 6px; font-weight: bold;"><i class="fa-solid fa-bolt"></i> محاكي</span>' : ''}
                    </span>
                </div>
                <div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="openEditQuizModal('${quiz.id}')">
                        <i class="fa-regular fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-danger btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="deleteQuiz('${quiz.id}')">
                        <i class="fa-regular fa-trash-can"></i> حذف
                    </button>
                </div>
            `;
            quizzesList.appendChild(div);
        });
    }
    
    openModal('teacher-course-manage-modal');
    renderMath('teacher-course-manage-modal');
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// ACCOUNT SETTINGS LOGIC (Teacher)
// ==========================================

function renderTeacherAccountSettings() {
    const list = document.getElementById('t-teachers-list');
    if (!list) return;
    list.innerHTML = '';

    const isSupervisor = appState.currentUser && appState.currentUser.role === 'supervisor';
    const isMainLoggedIn = appState.currentUser && appState.currentUser.id === 'mohammed';

    const createForm = document.getElementById('create-teacher-form');
    if (createForm) {
        createForm.style.display = isSupervisor ? 'none' : 'block';
    }

    appState.teachers.forEach(t => {
        const div = document.createElement('div');
        div.className = 'submission-item';
        div.style.padding = '10px';
        div.style.marginBottom = '8px';
        
        const isMainTeacher = t.id === 'mohammed';
        const isCurrentLoggedIn = t.id === appState.currentUser.id;
        const staffRole = t.role || 'teacher';
        const roleBadge = staffRole === 'supervisor' 
            ? '<span style="font-size: 10px; background: var(--purple-xp); color: white; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-right: 6px;">مشرف</span>'
            : '<span style="font-size: 10px; background: var(--accent-orange); color: white; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-right: 6px;">معلم</span>';
        
        const canEditName = !isSupervisor || isCurrentLoggedIn;
        const canDelete = !isSupervisor && !isMainTeacher && !isCurrentLoggedIn;
        const canToggleRole = isMainLoggedIn && !isMainTeacher;

        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 8px;">
                <div>
                    <strong style="font-size: 13.5px; color: var(--text-main);">${escapeHtml(t.name)}</strong> 
                    <span style="font-size: 11px; color: var(--text-muted); margin-right: 4px;">(@${escapeHtml(t.username)})</span>
                    ${roleBadge}
                    ${isCurrentLoggedIn ? '<span class="student-level" style="margin-right: 4px; padding: 2px 5px; font-size: 9.5px; background: var(--success); color: #000;">أنت</span>' : ''}
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    ${canToggleRole ? `
                        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; border-color: var(--warning); color: var(--warning);" onclick="toggleTeacherRole('${t.id}')">
                            <i class="fa-solid fa-arrows-rotate"></i> تحويل إلى ${staffRole === 'supervisor' ? 'معلم' : 'مشرف'}
                        </button>
                    ` : ''}
                    ${canEditName ? `
                        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; border-color: var(--accent-orange); color: var(--text-orange);" onclick="openEditTeacherNameModal('${t.id}')">
                            <i class="fa-regular fa-pen-to-square"></i> تعديل الاسم
                        </button>
                    ` : ''}
                    ${canDelete ? `
                        <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="deleteTeacher('${t.id}')">حذف</button>
                    ` : ''}
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

async function toggleTeacherRole(teacherId) {
    if (!appState.currentUser || appState.currentUser.id !== 'mohammed') {
        showToast("عذراً! هذه الصلاحية محصورة في حساب المعلم الرئيسي (mohammed) فقط.", "danger");
        return;
    }
    
    const teacher = appState.teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const oldRole = teacher.role || 'teacher';
    const newRole = oldRole === 'supervisor' ? 'teacher' : 'supervisor';
    teacher.role = newRole;
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('teachers').update({ role: newRole }).eq('id', teacherId);
            if (error) throw error;
        } else {
            localStorage.setItem('masar_teachers', JSON.stringify(appState.teachers));
        }
        
        const newRoleTitle = newRole === 'supervisor' ? 'مشرف' : 'معلم';
        showToast(`تم تغيير صلاحية (${teacher.name}) إلى (${newRoleTitle}) بنجاح! 🎉`, "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        teacher.role = oldRole;
        showToast("فشل تغيير الصلاحية سحابياً!", "danger");
    }
}

function openEditTeacherNameModal(teacherId) {
    const teacher = appState.teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    document.getElementById('edit-teacher-id').value = teacherId;
    document.getElementById('edit-teacher-name-input').value = teacher.name;
    openModal('edit-teacher-name-modal');
}

async function handleSaveTeacherName(e) {
    e.preventDefault();
    const teacherId = document.getElementById('edit-teacher-id').value;
    const newName = document.getElementById('edit-teacher-name-input').value.trim();
    if (!newName) {
        showToast("يرجى كتابة الاسم!", "danger");
        return;
    }
    
    const teacher = appState.teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const oldName = teacher.name;
    teacher.name = newName;
    
    if (appState.currentUser && appState.currentUser.id === teacherId) {
        appState.currentUser.name = newName;
        localStorage.setItem('masar_current_user', JSON.stringify(appState.currentUser));
        updateHeaderUserBadge();
    }
    
    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('teachers').update({ name: newName }).eq('id', teacherId);
            if (error) throw error;
        } else {
            localStorage.setItem('masar_teachers', JSON.stringify(appState.teachers));
        }
        
        closeModal('edit-teacher-name-modal');
        showToast("تم تعديل الاسم بنجاح! ✏️", "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        teacher.name = oldName;
        showToast("فشل حفظ التعديل سحابياً!", "danger");
    }
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
    const roleSelect = document.getElementById('teacher-new-role');
    const role = roleSelect ? roleSelect.value : 'teacher';

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
        password,
        role
    };

    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('teachers').insert({
                id: newTeacher.id,
                username: newTeacher.username,
                name: newTeacher.name,
                password: newTeacher.password,
                role: newTeacher.role
            });
            if (error) throw error;
        } else {
            appState.teachers.push(newTeacher);
            localStorage.setItem('masar_teachers', JSON.stringify(appState.teachers));
        }

        document.getElementById('create-teacher-form').reset();
        const roleTitle = role === 'supervisor' ? 'مشرف' : 'معلم شريك';
        showToast(`تم بنجاح تسجيل (${roleTitle}): ${name}! 🎉`, "success");
        await renderTeacherDashboard();
    } catch (err) {
        console.error(err);
        showToast("فشل تسجيل الحساب الجديد في السحابة!", "danger");
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
    renderStudentMyCourses();
    renderStudentCourses();
    renderStudentSimulators();
    renderStudentPlacementTests();

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
    
    const myAssignments = appState.assignments.filter(a => {
        if (!a.targetStudent || a.targetStudent === 'all') return true;
        if (Array.isArray(a.targetStudent)) {
            return a.targetStudent.some(id => String(id) === String(sId));
        }
        return String(a.targetStudent) === String(sId);
    });
    const activeHomeworks = myAssignments.filter(a => !appState.submissions.some(sub => String(sub.assignmentId) === String(a.id) && String(sub.studentId) === String(sId)));
    
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
                        <span class="assignment-subject subject-${assign.subject}">${SUBJECT_NAMES[assign.subject] || assign.subject}</span>
                        <h4 class="assignment-title" style="margin-top: 8px;">${escapeHtml(assign.title)}</h4>
                    </div>
                    <span style="font-weight: 700; color: var(--text-orange); font-size: 15px;">${assign.points} XP</span>
                </div>
                
                <p style="font-size: 14px; color: var(--text-muted); white-space: pre-line; line-height: 1.5;">${escapeHtml(assign.desc)}</p>
                
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
    
    const mySubmissions = appState.submissions.filter(s => String(s.studentId) === String(sId));
    
    if (mySubmissions.length === 0) {
        sHistoryList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-hourglass-start"></i>
                <p>لم تقم بتسليم أي واجب بعد. حل واجباتك ليظهر السجل هنا!</p>
            </div>`;
    } else {
        const sortedSubmissions = [...mySubmissions].reverse();
        sortedSubmissions.forEach(sub => {
            const assign = appState.assignments.find(a => String(a.id) === String(sub.assignmentId));
            if (!assign) return;
            
            const isGraded = sub.status === 'graded';
            
            const div = document.createElement('div');
            div.className = 'glass-card';
            div.style.padding = '20px';
            div.style.marginBottom = '15px';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <span class="assignment-subject subject-${assign.subject}">${SUBJECT_NAMES[assign.subject] || assign.subject}</span>
                        <h4 style="font-size: 15px; font-weight: 700; margin-top: 8px;">${escapeHtml(assign.title)}</h4>
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
                    <div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 6px; font-size: 13.5px; white-space: pre-line; border-right: 3px solid var(--accent-orange);">${escapeHtml(sub.answer || '')}</div>
                </div>
                
                ${isGraded ? `
                    <div style="background: rgba(16, 185, 129, 0.03); border: 1px solid rgba(16, 185, 129, 0.1); border-radius: 8px; padding: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                            <strong style="color: var(--success);"><i class="fa-solid fa-comment-dots"></i> تقييم المعلم:</strong>
                            <span style="color: var(--text-muted);">تاريخ التصحيح: ${sub.gradedAt || ''}</span>
                        </div>
                        <p style="font-size: 13px; color: var(--text-main); line-height: 1.5; font-style: italic;">"${escapeHtml(sub.feedback || '')}"</p>
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
    const assign = appState.assignments.find(a => String(a.id) === String(assignId));
    if (!assign) {
        console.error("Assignment not found for ID:", assignId);
        showToast("عذراً، لم يتم العثور على بيانات هذا الواجب!", "danger");
        return;
    }
    
    document.getElementById('submit-assignment-id').value = assignId;
    const titleEl = document.getElementById('submit-modal-title');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--accent-orange); margin-left: 8px;"></i> تسليم واجب: ${escapeHtml(assign.title)}`;
    }
    
    const questionEl = document.getElementById('submit-modal-question');
    if (questionEl) {
        questionEl.textContent = assign.desc || '';
    }
    
    document.getElementById('submit-answer').value = '';
    document.getElementById('submit-link').value = '';
    
    const submitImageContainer = document.getElementById('submit-modal-image-container');
    const submitImage = document.getElementById('submit-modal-image');
    if (submitImageContainer && submitImage) {
        if (assign.image) {
            submitImageContainer.style.display = 'block';
            submitImage.src = assign.image;
        } else {
            submitImageContainer.style.display = 'none';
            submitImage.src = '';
        }
    }
    
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
            btn.innerHTML = `<span class="option-indicator">${String.fromCharCode(1601 + i)}</span> <span>${escapeHtml(opt)}</span>`;
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
    renderMath('solve-assignment-page-view');
}

// Student submit assignment
async function handleSubmitAssignment(e) {
    e.preventDefault();
    
    const assignId = document.getElementById('submit-assignment-id').value;
    const answer = document.getElementById('submit-answer').value.trim();
    const link = document.getElementById('submit-link').value.trim();
    const sId = appState.currentUser.id;
    
    const assign = appState.assignments.find(a => String(a.id) === String(assignId));
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

    const sId = appState.currentUser ? appState.currentUser.id : null;
    const student = sId ? appState.students.find(s => s.id === sId) : null;
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
        const lessonsCount = appState.lessons.filter(l => String(l.courseId) === String(course.id)).length;
        const quizzesCount = appState.quizzes.filter(q => String(q.courseId) === String(course.id)).length;
        
        const isEnrolled = (student && student.enrolled_courses) ? student.enrolled_courses.some(id => String(id) === String(course.id)) : false;
        const pricing = deriveCoursePricing(course);
        
        let priceBadge = '';
        if (isEnrolled) {
            priceBadge = `<span style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 20px; font-weight: 800; font-size: 11.5px;"><i class="fa-solid fa-check-circle"></i> مشترك</span>`;
        } else {
            priceBadge = pricing.isFree 
                ? `<span style="background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 20px; font-weight: 800; font-size: 11.5px;"><i class="fa-solid fa-gift"></i> مجانية</span>`
                : `<span style="background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); padding: 3px 10px; border-radius: 20px; font-weight: 800; font-size: 11.5px;"><i class="fa-solid fa-tag"></i> ${pricing.price} ر.س</span>`;
        }

        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                    ${priceBadge}
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main); margin-top: 6px;">${escapeHtml(course.title)}</h4>
                <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(getCleanDescription(course.description))}</p>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
                    <span><i class="fa-solid fa-video" style="color: var(--accent-orange);"></i> الدروس: ${lessonsCount}</span>
                    <span><i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i> الاختبارات: ${quizzesCount}</span>
                </div>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; font-weight: 800;" onclick="openStudentCourseModal('${course.id}')">
                <i class="fa-solid fa-graduation-cap"></i> فتح تفاصيل وشروحات الدورة 🚀
            </button>
        `;
        list.appendChild(card);
    });
}

function renderStudentMyCourses() {
    const list = document.getElementById('s-my-courses-list');
    if (!list) return;
    list.innerHTML = '';

    const sId = appState.currentUser ? appState.currentUser.id : null;
    const student = sId ? appState.students.find(s => s.id === sId) : null;
    const enrolledList = (student && student.enrolled_courses) ? student.enrolled_courses : [];

    const myCourses = appState.courses.filter(c => enrolledList.some(id => String(id) === String(c.id)));

    if (myCourses.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-folder-open"></i>
                <p>أنت غير مشترك في أي دورة حالياً.</p>
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="document.querySelector('#s-courses-tab').previousElementSibling.click();">
                    تصفح الدورات المتاحة
                </button>
            </div>`;
        return;
    }

    myCourses.forEach(course => {
        const courseLessons = appState.lessons.filter(l => String(l.courseId) === String(course.id));
        const lessonsCount = courseLessons.length;
        const quizzesCount = appState.quizzes.filter(q => String(q.courseId) === String(course.id)).length;
        
        // Progress tracking (local calculation for now based on watched_lessons if available)
        const watchedList = (student && student.watched_lessons && student.watched_lessons[course.id]) ? student.watched_lessons[course.id] : [];
        const completedLessons = watchedList.length;
        const percent = lessonsCount === 0 ? 0 : Math.round((completedLessons / lessonsCount) * 100);

        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        const buttonText = (percent >= 100) ? "إعادة مشاهدة الدورة 🔄" : "إكمال الدورة 🚀";
        
        card.innerHTML = `
            <div>
                <div class="course-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="course-subject subject-${course.subject}">${SUBJECT_NAMES[course.subject] || course.subject}</span>
                    <span style="background: rgba(16, 185, 129, 0.15); color: var(--success); padding: 3px 10px; border-radius: 20px; font-weight: 800; font-size: 11.5px;"><i class="fa-solid fa-check"></i> مشترك</span>
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main); margin-top: 6px;">${escapeHtml(course.title)}</h4>
                
                <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">
                        <span>نسبة الإنجاز:</span>
                        <span style="color: var(--success); font-weight: bold;">${percent}%</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                        <div style="width: ${percent}%; height: 100%; background: var(--success); border-radius: 4px; transition: 0.3s;"></div>
                    </div>
                    <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
                        <span><i class="fa-solid fa-play"></i> اكتمل: ${completedLessons}/${lessonsCount}</span>
                        <span><i class="fa-solid fa-clipboard-question"></i> اختبارات: ${quizzesCount}</span>
                    </div>
                </div>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; font-weight: 800;" onclick="openStudentCourseModal('${course.id}')">
                <i class="fa-solid fa-forward-step"></i> ${buttonText}
            </button>
        `;
        list.appendChild(card);
    });
}

function openStudentCourseModal(courseId) {
    const course = appState.courses.find(c => String(c.id) === String(courseId));
    if (!course) return;

    hideAllViews();
    const page = document.getElementById('student-course-page-view');
    if (page) page.style.display = 'block';

    const titleEl = document.getElementById('s-course-modal-title');
    if (titleEl) titleEl.textContent = course.title;

    const descEl = document.getElementById('s-course-description-text');
    if (descEl) descEl.textContent = getCleanDescription(course.description) || 'لا يوجد وصف تفصيلي مضاف بعد لهذه الدورة.';

    const subjectBadge = document.getElementById('s-course-subject-badge');
    if (subjectBadge) {
        subjectBadge.className = `course-subject subject-${course.subject || 'math'}`;
        subjectBadge.textContent = SUBJECT_NAMES[course.subject] || course.subject || 'عام';
    }

    // Check enrollment first to use in pricing UI
    const sId = appState.currentUser ? appState.currentUser.id : null;
    const student = sId ? appState.students.find(s => s.id === sId) : null;
    const enrolledList = student ? (student.enrolled_courses || []) : [];
    const isEnrolled = enrolledList.some(id => String(id) === String(course.id));

    const pricing = deriveCoursePricing(course);
    const priceBadge = document.getElementById('s-course-price-badge');
    const statPrice = document.getElementById('s-course-stat-price');
    
    if (priceBadge) {
        if (isEnrolled) {
            priceBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            priceBadge.style.color = 'var(--success)';
            priceBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            priceBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> مشترك';
        } else {
            priceBadge.style.background = pricing.isFree ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)';
            priceBadge.style.color = pricing.isFree ? 'var(--success)' : 'var(--warning)';
            priceBadge.style.borderColor = pricing.isFree ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)';
            priceBadge.innerHTML = pricing.isFree ? '<i class="fa-solid fa-gift"></i> مجانية بالكامل' : `<i class="fa-solid fa-tag"></i> ${pricing.price} ر.س`;
        }
    }
    
    if (statPrice) {
        if (isEnrolled) {
            statPrice.textContent = 'مشترك ✅';
        } else {
            statPrice.textContent = pricing.isFree ? 'مجانية 🎁' : `${pricing.price} ر.س 💰`;
        }
    }

    const courseLessons = appState.lessons.filter(l => String(l.courseId) === String(courseId));
    const courseQuizzes = appState.quizzes.filter(q => String(q.courseId) === String(courseId));

    const statLessons = document.getElementById('s-course-stat-lessons');
    if (statLessons) statLessons.textContent = `${courseLessons.length} دروس`;

    const statQuizzes = document.getElementById('s-course-stat-quizzes');
    if (statQuizzes) statQuizzes.textContent = `${courseQuizzes.length} اختبارات`;

    const subscriptionView = document.getElementById('s-course-subscription-view');
    const contentContainer = document.getElementById('s-course-content-container');
    const subscribeBtn = document.getElementById('s-course-subscribe-btn');

    if (subscriptionView && contentContainer && subscribeBtn) {
        if (isEnrolled) {
            subscriptionView.style.display = 'none';
            contentContainer.style.display = 'grid';
        } else {
            subscriptionView.style.display = 'block';
            contentContainer.style.display = 'none';
            subscribeBtn.onclick = () => subscribeToCourse(course.id);
        }
    }

    // Reset video player
    const video = document.getElementById('s-course-video-player');
    const iframe = document.getElementById('s-course-iframe-player');
    const placeholder = document.getElementById('s-course-media-placeholder');
    if (video) { video.style.display = 'none'; video.src = ''; }
    if (iframe) { iframe.style.display = 'none'; iframe.src = ''; }
    if (placeholder) placeholder.style.display = 'flex';

    // Render Lessons List
    const lessonsList = document.getElementById('s-course-lessons-list');
    if (lessonsList) {
        lessonsList.innerHTML = '';
        if (courseLessons.length === 0) {
            lessonsList.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا توجد دروس فيديو مضافة بعد</span>';
        } else {
            const watchedList = (student && student.watched_lessons && student.watched_lessons[courseId]) ? student.watched_lessons[courseId] : [];
            let firstUnwatchedDiv = null;

            courseLessons.forEach(lesson => {
                const isWatched = watchedList.includes(lesson.id);
                const watchIcon = isWatched ? '<i class="fa-solid fa-circle-check" style="color: var(--success);"></i>' : '<i class="fa-regular fa-circle-play" style="color: var(--accent-orange);"></i>';

                const div = document.createElement('div');
                div.className = 'lesson-item';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${watchIcon}
                        <span style="font-size: 13px; font-weight: 600; ${isWatched ? 'color: var(--success);' : ''}">${escapeHtml(lesson.title)}</span>
                    </div>
                    <span style="font-size: 11px; color: var(--text-muted);">${escapeHtml(lesson.duration || '')}</span>
                `;
                div.onclick = () => {
                    document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active'));
                    div.classList.add('active');
                    playLessonVideo(lesson.videoUrl, lesson.id, courseId);
                    
                    // Optimistically update UI to checked if not already
                    if (!isWatched) {
                        div.querySelector('.fa-circle-play')?.classList.replace('fa-regular', 'fa-solid');
                        div.querySelector('.fa-circle-play')?.classList.replace('fa-circle-play', 'fa-circle-check');
                        div.querySelector('.fa-circle-check').style.color = 'var(--success)';
                        div.querySelector('span').style.color = 'var(--success)';
                    }
                };
                lessonsList.appendChild(div);

                if (!isWatched && !firstUnwatchedDiv) {
                    firstUnwatchedDiv = div;
                }
            });

            // Auto-resume logic
            if (isEnrolled && courseLessons.length > 0) {
                setTimeout(() => {
                    if (firstUnwatchedDiv) {
                        firstUnwatchedDiv.click();
                    } else if (lessonsList.firstElementChild) {
                        lessonsList.firstElementChild.click();
                    }
                }, 100);
            }
        }
    }

    // Render Quizzes List
    const quizzesList = document.getElementById('s-course-quizzes-list');
    if (quizzesList) {
        quizzesList.innerHTML = '';
        if (courseQuizzes.length === 0) {
            quizzesList.innerHTML = '<span style="font-size: 12px; color: var(--text-muted); font-style: italic;">لا توجد اختبارات مضافة بعد</span>';
        } else {
            courseQuizzes.forEach(quiz => {
                const div = document.createElement('div');
                div.className = 'quiz-item';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-clipboard-question" style="color: var(--success);"></i>
                        <span style="font-size: 13px; font-weight: 600;">${escapeHtml(quiz.title)}</span>
                        ${quiz.isSimulator ? '<span style="font-size: 9.5px; background: var(--success); color: #000; padding: 2px 5px; border-radius: 4px; margin-right: 6px; font-weight: bold;"><i class="fa-solid fa-bolt"></i> محاكي</span>' : ''}
                    </div>
                    <span style="font-size: 11.5px; font-weight: 700; color: var(--text-orange);">${quiz.points} XP</span>
                `;
                div.onclick = () => {
                    if (quiz.isSimulator) {
                        startSimulator(quiz);
                    } else {
                        startQuiz(quiz);
                    }
                };
                quizzesList.appendChild(div);
            });
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderMath('student-course-page-view');
}

async function subscribeToCourse(courseId) {
    const course = appState.courses.find(c => String(c.id) === String(courseId));
    if (!course) return;

    if (!appState.currentUser) {
        showToast("سجل دخول او انشئ حساب مجانا لتصفح الدورة 🎓", "warning");
        showLogin();
        selectLoginRole('student');
        return;
    }

    const pricing = deriveCoursePricing(course);

    if (!pricing.isFree) {
        // Show Unpaid Course Alert Page View
        hideAllViews();
        const page = document.getElementById('unpaid-course-page-view');
        if (page) {
            page.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
    }

    // Free course: instant enrollment
    const student = appState.students.find(s => s.id === appState.currentUser.id);
    if (!student) return;

    if (!student.enrolled_courses) {
        student.enrolled_courses = [];
    }
    
    if (!student.enrolled_courses.some(id => String(id) === String(courseId))) {
        student.enrolled_courses.push(courseId);
        
        try {
            if (isCloudMode && supabaseClient) {
                await supabaseClient.from('students').update({
                    enrolled_courses: student.enrolled_courses
                }).eq('id', student.id);
            }
            appState.currentUser.enrolled_courses = student.enrolled_courses;
            localStorage.setItem('masar_students', JSON.stringify(appState.students));
            localStorage.setItem('masar_currentUser', JSON.stringify(appState.currentUser));
            
            showToast('تم اشتراكك في الدورة بنجاح! 🚀', 'success');
            openStudentCourseModal(courseId); // refresh
        } catch (err) {
            console.error("Enrollment failed:", err);
            // rollback
            student.enrolled_courses = student.enrolled_courses.filter(id => id !== courseId);
            showToast('فشل الاشتراك السحابي، تفقد الاتصال!', 'danger');
        }
    }
}

async function playLessonVideo(url, lessonId, courseId) {
    const video = document.getElementById('s-course-video-player');
    const iframe = document.getElementById('s-course-iframe-player');
    const placeholder = document.getElementById('s-course-media-placeholder');
    
    placeholder.style.display = 'none';

    // Mark as watched
    const sId = appState.currentUser ? appState.currentUser.id : null;
    const student = sId ? appState.students.find(s => s.id === sId) : null;
    if (student && lessonId && courseId) {
        if (!student.watched_lessons) student.watched_lessons = {};
        if (!student.watched_lessons[courseId]) student.watched_lessons[courseId] = [];
        
        if (!student.watched_lessons[courseId].includes(lessonId)) {
            student.watched_lessons[courseId].push(lessonId);
            try {
                if (isCloudMode && supabaseClient) {
                    await supabaseClient.from('students').update({
                        watched_lessons: student.watched_lessons
                    }).eq('id', student.id);
                }
                localStorage.setItem('masar_students', JSON.stringify(appState.students));
            } catch(e) {
                console.warn("Failed to sync watched lesson:", e);
            }
        }
    }
    
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
            ${q.image ? `
                <div style="margin-top: 10px; text-align: center;">
                    <img src="${q.image}" style="max-width: 100%; max-height: 180px; border-radius: 6px; border: 1px solid var(--border-color);">
                </div>
            ` : ''}
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

// ==========================================
// EXAM SIMULATOR PLAYER LOGIC (Student)
// ==========================================

function getSimulatorSections(quiz) {
    if (!quiz) return [];
    let questionsData = quiz.questions;
    
    while (typeof questionsData === 'string') {
        try {
            const parsed = JSON.parse(questionsData);
            if (parsed === questionsData) break;
            questionsData = parsed;
        } catch (e) {
            break;
        }
    }
    
    if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
        return [];
    }
    
    const firstItem = questionsData[0];
    if (firstItem && typeof firstItem === 'object' && Array.isArray(firstItem.questions)) {
        return questionsData;
    }
    
    if (firstItem && typeof firstItem === 'object' && (firstItem.question !== undefined || firstItem.options !== undefined)) {
        return [{
            sectionTitle: 'القسم الأول',
            questions: questionsData
        }];
    }
    
    return [];
}

function startSimulator(quiz) {
    if (!quiz) return;
    activeSimulatorState.quiz = quiz;
    activeSimulatorState.sections = getSimulatorSections(quiz);
    activeSimulatorState.currentSectionIndex = 0;
    activeSimulatorState.currentQuestionIndex = 0;
    activeSimulatorState.answers = [];
    activeSimulatorState.flagged = [];
    
    if (activeSimulatorState.timerInterval) {
        clearInterval(activeSimulatorState.timerInterval);
    }
    
    const sidebar = document.getElementById('simulator-nav-sidebar');
    const layoutGrid = document.getElementById('simulator-layout-grid');
    if (sidebar) sidebar.style.display = 'block';
    if (layoutGrid) layoutGrid.style.gridTemplateColumns = '270px 1fr';
    
    const titleEl = document.getElementById('simulator-player-title');
    if (titleEl) titleEl.textContent = `محاكي الاختبار: ${quiz.title}`;
    
    hideAllViews();
    document.getElementById('student-simulator-page-view').style.display = 'block';
    
    const submitBtn = document.getElementById('simulator-submit-section-btn');
    if (submitBtn) {
        submitBtn.innerHTML = `<span id="simulator-btn-text">تسليم القسم والانتقال للقسم التالي</span> <i class="fa-solid fa-arrow-left"></i>`;
        submitBtn.onclick = () => submitSimulatorSection(false);
    }
    
    renderSimulatorSection(true);
}

function renderSimulatorNavGrid() {
    const navGrid = document.getElementById('simulator-questions-nav-grid');
    const counterBadge = document.getElementById('simulator-nav-counter-badge');
    if (!navGrid) return;
    
    navGrid.innerHTML = '';
    const sectionIdx = activeSimulatorState.currentSectionIndex;
    const sections = activeSimulatorState.sections || getSimulatorSections(activeSimulatorState.quiz);
    
    if (!sections || !sections[sectionIdx]) {
        if (counterBadge) counterBadge.textContent = '0 / 0';
        return;
    }
    
    const section = sections[sectionIdx];
    const questions = section.questions || [];
    const sectionAnswers = activeSimulatorState.answers[sectionIdx] || [];
    const sectionFlagged = activeSimulatorState.flagged ? (activeSimulatorState.flagged[sectionIdx] || []) : [];
    
    let answeredCount = 0;
    
    questions.forEach((q, qIdx) => {
        const isAnswered = sectionAnswers[qIdx] !== undefined && sectionAnswers[qIdx] !== null;
        if (isAnswered) answeredCount++;
        const isFlagged = !!sectionFlagged[qIdx];
        
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `sim-nav-btn ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''}`;
        btn.id = `sim-nav-item-${qIdx}`;
        btn.onclick = () => scrollToSimulatorQuestion(qIdx);
        
        btn.innerHTML = `
            <span>${qIdx + 1}</span>
            <span style="font-size: 10px;">${isAnswered ? '✓' : ''}</span>
        `;
        
        navGrid.appendChild(btn);
    });
    
    if (counterBadge) {
        counterBadge.textContent = `${answeredCount} / ${questions.length} مجاب`;
    }
}

function scrollToSimulatorQuestion(questionIndex) {
    activeSimulatorState.currentQuestionIndex = questionIndex;
    renderSimulatorSection();
}

function toggleFlagSimulatorQuestion(questionIndex) {
    const sectionIdx = activeSimulatorState.currentSectionIndex;
    if (!activeSimulatorState.flagged) activeSimulatorState.flagged = [];
    if (!activeSimulatorState.flagged[sectionIdx]) activeSimulatorState.flagged[sectionIdx] = [];
    
    activeSimulatorState.flagged[sectionIdx][questionIndex] = !activeSimulatorState.flagged[sectionIdx][questionIndex];
    
    renderSimulatorNavGrid();
    renderSimulatorSection(); // Re-render to update the flag button state
}

function renderSimulatorSection(isNewSection = false) {
    const sectionIdx = activeSimulatorState.currentSectionIndex;
    const sections = activeSimulatorState.sections || getSimulatorSections(activeSimulatorState.quiz);
    const body = document.getElementById('simulator-player-body');
    if (!body) return;
    
    if (sectionIdx < sections.length) {
        const sidebar = document.getElementById('simulator-nav-sidebar');
        const layoutGrid = document.getElementById('simulator-layout-grid');
        if (sidebar) sidebar.style.display = 'block';
        if (layoutGrid) layoutGrid.style.gridTemplateColumns = '270px 1fr';
    }
    
    if (!sections || sections.length === 0) {
        body.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 40px; color: var(--warning); margin-bottom: 15px;"></i>
                <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">لا توجد أقسام مسجلة في هذا المحاكي بعد!</h3>
                <p style="font-size: 13px;">يرجى التواصل مع المعلم لإضافة أقسام وأسئلة.</p>
            </div>
        `;
        const progText = document.getElementById('simulator-progress-text');
        if (progText) progText.textContent = `القسم 0 من 0`;
        const secTitle = document.getElementById('simulator-player-section-title');
        if (secTitle) secTitle.textContent = `القسم الحالي: فارغ`;
        renderSimulatorNavGrid();
        if (isNewSection) startSimulatorSectionTimer(0);
        return;
    }
    
    if (sectionIdx >= sections.length) {
        renderSimulatorResults();
        return;
    }
    
    const section = sections[sectionIdx];
    const questions = section.questions || [];
    
    // Update titles
    const secTitleEl = document.getElementById('simulator-player-section-title');
    if (secTitleEl) secTitleEl.textContent = `القسم الحالي: ${section.sectionTitle || 'القسم ' + (sectionIdx + 1)}`;
    
    const progTextEl = document.getElementById('simulator-progress-text');
    if (progTextEl) progTextEl.textContent = `القسم ${sectionIdx + 1} من ${sections.length}`;
    
    // Last section button text change
    const isLast = (sectionIdx === sections.length - 1);
    const btnTextEl = document.getElementById('simulator-btn-text');
    if (btnTextEl) btnTextEl.textContent = isLast ? "تسليم وإنهاء المحاكي" : "تسليم القسم والانتقال للقسم التالي";
    
    // Render current question
    body.innerHTML = '';
    
    if (questions.length === 0) {
        body.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 36px; color: var(--text-orange); margin-bottom: 10px;"></i>
                <p style="font-size: 14px; font-weight: 600;">لا توجد أسئلة مضافة في هذا القسم بعد.</p>
            </div>
        `;
    } else {
        try {
            const qIndex = parseInt(activeSimulatorState.currentQuestionIndex) || 0;
            const q = questions[qIndex] || questions[0];
            
            if (!q) {
                console.error("Question object is missing for index", qIndex);
                body.innerHTML = `<div style="padding: 20px; color: red; text-align: center;">خطأ: لم يتم العثور على بيانات السؤال. يرجى تحديث الصفحة.</div>`;
                return;
            }
            
            const card = document.createElement('div');
            card.className = 'simulator-question-card';
            card.id = `sim-question-card-${qIndex}`;
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            
            const questionOptions = Array.isArray(q.options) ? q.options : ['أ', 'ب', 'ج', 'د'];
            
            let selectedOptIndex = -1;
            if (activeSimulatorState.answers && activeSimulatorState.answers[sectionIdx] && activeSimulatorState.answers[sectionIdx][qIndex] !== undefined) {
                selectedOptIndex = activeSimulatorState.answers[sectionIdx][qIndex];
            }
                
            let isFlagged = false;
            if (activeSimulatorState.flagged && activeSimulatorState.flagged[sectionIdx] && activeSimulatorState.flagged[sectionIdx][qIndex]) {
                isFlagged = true;
            }
                
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 8px;">
                    <div style="font-size: 12px; color: var(--text-orange); font-weight: 800;">السؤال ${qIndex + 1} من ${questions.length}</div>
                    <button type="button" class="btn btn-secondary sim-flag-btn-${qIndex}" onclick="toggleFlagSimulatorQuestion(${qIndex})" style="padding: 4px 10px; font-size: 11.5px; border-radius: 6px; gap: 6px; ${isFlagged ? 'background: rgba(255, 125, 63, 0.2); border-color: var(--accent-orange); color: var(--text-orange);' : 'color: var(--text-muted);'}">
                        <i class="${isFlagged ? 'fa-solid' : 'fa-regular'} fa-bookmark" style="color: var(--accent-orange);"></i>
                        <span>${isFlagged ? 'مراجعة 🔖' : 'علامة للمراجعة 🔖'}</span>
                    </button>
                </div>
                
                <h4 style="font-size: 15px; font-weight: 700; line-height: 1.5; color: var(--text-main); margin-bottom: 12px; text-align: right;">${escapeHtml(q.question || 'سؤال بدون نص')}</h4>
                ${q.image ? `
                    <div style="margin-top: 10px; margin-bottom: 12px; text-align: center;">
                        <img src="${q.image}" style="max-width: 100%; max-height: 180px; border-radius: 6px; border: 1px solid var(--border-color);">
                    </div>
                ` : ''}
                
                <div class="quiz-options-list" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${questionOptions.map((opt, oIndex) => `
                        <button type="button" class="quiz-option-btn sim-q-${qIndex}-opt ${selectedOptIndex === oIndex ? 'selected' : ''}" onclick="selectSimulatorQuestionOption(${qIndex}, ${oIndex})">
                            <span class="option-indicator">${String.fromCharCode(1601 + oIndex)}</span>
                            <span>${escapeHtml(opt || '')}</span>
                        </button>
                    `).join('')}
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                    <button type="button" class="btn btn-secondary" onclick="scrollToSimulatorQuestion(${qIndex - 1})" ${qIndex === 0 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>
                        <i class="fa-solid fa-arrow-right"></i> السؤال السابق
                    </button>
                    <button type="button" class="btn btn-primary" onclick="scrollToSimulatorQuestion(${qIndex + 1})" ${qIndex >= questions.length - 1 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : 'style="background: var(--accent-orange); border-color: var(--accent-orange); color: #fff;"'}>
                        السؤال التالي <i class="fa-solid fa-arrow-left"></i>
                    </button>
                </div>
            `;
            body.appendChild(card);
        } catch (err) {
            console.error("Error rendering question:", err);
            body.innerHTML = `<div style="padding: 20px; color: red; text-align: center;">حدث خطأ في عرض السؤال. يرجى تحديث الصفحة.</div>`;
        }
    }
    
    renderMath('simulator-player-body');
    renderSimulatorNavGrid();
    
    // Start Section Timer
    if (isNewSection) {
        startSimulatorSectionTimer(questions.length);
    }
}

function selectSimulatorQuestionOption(questionIndex, optionIndex) {
    const sectionIdx = activeSimulatorState.currentSectionIndex;
    if (!activeSimulatorState.answers[sectionIdx]) {
        activeSimulatorState.answers[sectionIdx] = [];
    }
    activeSimulatorState.answers[sectionIdx][questionIndex] = optionIndex;
    
    document.querySelectorAll(`.sim-q-${questionIndex}-opt`).forEach((btn, idx) => {
        btn.classList.toggle('selected', idx === optionIndex);
    });
    
    renderSimulatorNavGrid();
}

function startSimulatorSectionTimer(numQuestions) {
    if (activeSimulatorState.timerInterval) {
        clearInterval(activeSimulatorState.timerInterval);
    }
    
    const count = Math.max(1, parseInt(numQuestions) || 1);
    const durationMinutes = count + 1;
    activeSimulatorState.secondsRemaining = durationMinutes * 60;
    
    updateSimulatorTimerDisplay();
    
    activeSimulatorState.timerInterval = setInterval(() => {
        activeSimulatorState.secondsRemaining--;
        updateSimulatorTimerDisplay();
        
        if (activeSimulatorState.secondsRemaining <= 0) {
            clearInterval(activeSimulatorState.timerInterval);
            showToast("انتهى الوقت! تم الانتقال تلقائياً.", "warning");
            submitSimulatorSection(true);
        }
    }, 1000);
}

function updateSimulatorTimerDisplay() {
    const display = document.getElementById('simulator-timer-display');
    if (!display) return;
    
    const totalSecs = Math.max(0, parseInt(activeSimulatorState.secondsRemaining) || 0);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    const isLow = totalSecs <= 60;
    const timerIcon = document.getElementById('simulator-timer-icon');
    const timerDisplayParent = display.parentElement;
    
    if (timerDisplayParent) {
        if (isLow) {
            timerDisplayParent.style.background = 'rgba(239, 68, 68, 0.25)';
            timerDisplayParent.style.color = '#EF4444';
            timerDisplayParent.style.borderColor = '#EF4444';
            if (timerIcon) timerIcon.classList.add('fa-spin');
        } else {
            timerDisplayParent.style.background = 'rgba(239, 68, 68, 0.12)';
            timerDisplayParent.style.color = 'var(--danger)';
            timerDisplayParent.style.borderColor = 'rgba(239, 68, 68, 0.25)';
            if (timerIcon) timerIcon.classList.remove('fa-spin');
        }
    }
}

function submitSimulatorSection(force = false) {
    const sectionIdx = activeSimulatorState.currentSectionIndex;
    const sections = activeSimulatorState.sections || getSimulatorSections(activeSimulatorState.quiz);
    if (!sections || sections.length === 0) return;
    
    const currentSection = sections[sectionIdx];
    const sectionQuestions = currentSection ? (currentSection.questions || []) : [];
    
    if (!force && sectionQuestions.length > 0) {
        const sectionAnswers = activeSimulatorState.answers[sectionIdx] || [];
        let unansweredCount = 0;
        for (let i = 0; i < sectionQuestions.length; i++) {
            if (sectionAnswers[i] === undefined || sectionAnswers[i] === null) {
                unansweredCount++;
            }
        }
        
        if (unansweredCount > 0) {
            if (!confirm(`لم تقم بالإجابة على ${unansweredCount} سؤال في هذا القسم. هل أنت متأكد من رغبتك في تسليم القسم؟`)) {
                return;
            }
        }
    }
    
    if (activeSimulatorState.timerInterval) {
        clearInterval(activeSimulatorState.timerInterval);
    }
    
    activeSimulatorState.currentSectionIndex++;
    activeSimulatorState.currentQuestionIndex = 0;
    renderSimulatorSection(true);
}

async function renderSimulatorResults() {
    const container = document.getElementById('simulator-player-body');
    if (!container) return;
    const quiz = activeSimulatorState.quiz;
    const sections = activeSimulatorState.sections || getSimulatorSections(quiz);
    
    let totalQuestions = 0;
    let totalCorrect = 0;
    
    sections.forEach((sect, sIdx) => {
        const sectionAnswers = activeSimulatorState.answers[sIdx] || [];
        const questions = sect.questions || [];
        questions.forEach((q, qIdx) => {
            totalQuestions++;
            const correctIndex = parseInt(q.correct) || 0;
            const myAns = sectionAnswers[qIdx];
            if (myAns === correctIndex) {
                totalCorrect++;
            }
        });
    });
    
    const percent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
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

    if (student) {
        if (!student.simulator_results) student.simulator_results = {};
        const now = new Date().toISOString();
        const existing = student.simulator_results[quiz.id];
        
        if (!existing || percent > existing.score) {
            student.simulator_results[quiz.id] = {
                score: percent,
                last_attempt: now
            };
        } else {
            existing.last_attempt = now;
        }
    }

    try {
        if (student) {
            if (!student.simulator_results) student.simulator_results = {};
            // (Simulator results are already computed above and placed in student.simulator_results)

            student.badges = student.badges.filter(b => typeof b !== 'string' || !b.startsWith('sim_res:'));
            student.badges.push('sim_res:' + JSON.stringify(student.simulator_results));

            localStorage.setItem('masar_students', JSON.stringify(appState.students));
            if (appState.currentUser && appState.currentUser.id === sId) {
                appState.currentUser = { ...appState.currentUser, xp: student.xp, badges: student.badges };
                localStorage.setItem('masar_currentUser', JSON.stringify(appState.currentUser));
            }

            if (isCloudMode && supabaseClient) {
                await supabaseClient.from('students').update({ 
                    xp: student.xp, 
                    badges: student.badges
                }).eq('id', sId);
            }
        }
    } catch (err) {
        console.error("Failed to sync simulator results:", err);
    }
    
    const sidebar = document.getElementById('simulator-nav-sidebar');
    const layoutGrid = document.getElementById('simulator-layout-grid');
    if (sidebar) sidebar.style.display = 'none';
    if (layoutGrid) layoutGrid.style.gridTemplateColumns = '1fr';

    document.getElementById('simulator-timer-display').textContent = "--:--";
    document.getElementById('simulator-progress-text').textContent = "انتهى المحاكي";
    const submitBtn = document.getElementById('simulator-submit-section-btn');
    submitBtn.innerHTML = `<span>إغلاق المحاكي</span> <i class="fa-solid fa-xmark"></i>`;
    submitBtn.onclick = () => closeModal('student-simulator-modal');
    
    let sectionsBreakdownHTML = '';
    sections.forEach((sect, sIdx) => {
        const sectionAnswers = activeSimulatorState.answers[sIdx] || [];
        let sectCorrect = 0;
        
        const questionsHTML = sect.questions.map((q, qIdx) => {
            const myAns = sectionAnswers[qIdx];
            const correctAns = q.correct;
            const isCorrect = myAns === correctAns;
            if (isCorrect) sectCorrect++;
            
            return `
                <div onclick="openQuestionReviewModal(${sIdx}, ${qIdx})" style="background: rgba(255,255,255,0.01); border: 1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-size: 12px; text-align: right; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.01)'">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <strong>س ${qIdx + 1}: ${q.question}</strong>
                        <span style="font-size: 10px; color: var(--accent-orange); background: rgba(245, 158, 11, 0.1); padding: 2px 6px; border-radius: 4px;"><i class="fa-solid fa-magnifying-glass"></i> اضغط للمراجعة</span>
                    </div>
                    <div style="margin-top: 4px;">
                        <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'};">إجابتك: ${myAns !== undefined ? q.options[myAns] : 'لم تجب'}</span>
                        ${!isCorrect ? `<div style="color: var(--success); font-size: 11px;">الإجابة الصحيحة: ${q.options[correctAns]}</div>` : ''}
                        ${q.videoUrl ? `<div style="color: var(--accent-orange); font-size: 11px; margin-top: 4px;"><i class="fa-brands fa-youtube"></i> يوجد فيديو شرح</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        sectionsBreakdownHTML += `
            <div style="margin-top: 15px; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; background: rgba(0,0,0,0.1); padding: 12px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px; margin-bottom: 10px;">
                    <strong style="color: var(--text-orange); font-size: 13px;">${sect.sectionTitle || 'قسم بدون عنوان'}</strong>
                    <span style="font-weight: bold; font-size: 12.5px; color: var(--success);">${sectCorrect} / ${sect.questions.length} صحيح</span>
                </div>
                ${questionsHTML}
            </div>
        `;
    });
    
    let finalTitle = passed ? 'تهانينا! لقد اجتزت محاكي الاختبار بنجاح' : 'حظاً أوفر! تحتاج لمراجعة المادة مجدداً';
    let finalIcon = passed ? '🏆' : '📚';
    let customMessageHtml = '';
    let isPlacement = quiz.type === 'placement';
    
    if (isPlacement) {
        const placementTarget = quiz.placementTarget || 80;
        passed = percent >= placementTarget;
        finalIcon = '🎯';
        finalTitle = passed ? 'نتيجة ممتازة! مستواك متقدم' : 'نتيجة جيدة، لكنك تحتاج للتطوير';
        
        const teacherMsg = passed ? (quiz.placementHighMsg || 'أحسنت، مستواك يؤهلك لبدء التدريب المتقدم.') : (quiz.placementLowMsg || 'ننصحك بالبدء من دورات التأسيس لضمان رفع مستواك.');
        
        customMessageHtml = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); border-radius: 12px; padding: 18px; margin: 20px 0; text-align: right;">
                <h4 style="color: var(--success); font-size: 14px; font-weight: 800; margin-bottom: 8px;"><i class="fa-solid fa-comment-dots"></i> رسالة وتوجيه من المعلم:</h4>
                <p style="font-size: 13.5px; color: var(--text-main); line-height: 1.7; white-space: pre-wrap;">${escapeHtml(teacherMsg)}</p>
            </div>
        `;
    }

    container.innerHTML = `
        <div style="text-align: center; padding: 20px 10px;">
            <div style="font-size: 55px; margin-bottom: 12px;">
                ${finalIcon}
            </div>
            <h3 style="font-size: 20px; font-weight: 800; color: ${passed ? 'var(--success)' : 'var(--warning)'};">
                ${finalTitle}
            </h3>
            
            ${customMessageHtml}
            
            <div style="background: rgba(0,0,0,0.15); border: 1px solid var(--border-color); border-radius: 12px; padding: 15px; margin: 20px 0;">
                <div style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 6px;">الدرجة الكلية للمحاكي:</div>
                <div style="font-size: 32px; font-weight: 900; color: var(--text-orange);">${totalCorrect} / ${totalQuestions}</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">نسبة النجاح الإجمالية: ${percent}%</div>
                
                ${passed ? `
                    <div style="font-size: 13px; font-weight: 700; color: var(--success); margin-top: 10px;">
                        <i class="fa-solid fa-bolt"></i> نقاط مكتسبة: +${gainedXp} XP!
                    </div>
                ` : ''}
            </div>

            <h4 style="text-align: right; font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">تفاصيل الإجابات حسب الأقسام:</h4>
            <div style="max-height: 250px; overflow-y: auto; padding-left: 5px;">
                ${sectionsBreakdownHTML}
            </div>
        </div>
    `;
    
    renderStudentDashboard();
    renderMath('simulator-player-body');
}

function openAddStandaloneSimulatorModal() {
    showCreateSimulatorView();
}

function renderTeacherPlacementTests() {
    const list = document.getElementById('t-placements-list');
    if (!list) return;
    list.innerHTML = '';
    
    const placementQuizzes = appState.quizzes.filter(q => q.isSimulator && q.type === 'placement');
    
    if (placementQuizzes.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-crosshairs" style="font-size: 40px; color: var(--success); margin-bottom: 10px;"></i>
                <p>لا يوجد اختبارات تحديد مستوى مضافة حالياً.</p>
            </div>`;
        return;
    }
    
    placementQuizzes.forEach(quiz => {
        let questionsCount = quiz.questions ? quiz.questions.length : 0;
        
        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header"><span class="course-subject subject-qudrat" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border-color: var(--success);">تحديد مستوى 🎯</span></div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">${quiz.title}</h4>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px;">
                    <span><i class="fa-solid fa-circle-question" style="color: var(--accent-orange);"></i> الأسئلة: ${questionsCount}</span>
                    <span><i class="fa-solid fa-bolt" style="color: var(--warning);"></i> النقاط: ${quiz.points} XP</span>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; display: flex; gap: 8px;">
                <button class="btn btn-secondary" style="flex: 1; padding: 8px; font-size: 12px; border-color: var(--accent-orange); color: var(--text-orange);" onclick="openEditQuizModal('${quiz.id}')">
                    <i class="fa-regular fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger btn-secondary" style="flex: 1; padding: 8px; font-size: 12px;" onclick="deleteQuiz('${quiz.id}')">
                    <i class="fa-regular fa-trash-can"></i> حذف
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderTeacherSimulators() {
    const list = document.getElementById('t-simulators-list');
    if (!list) return;
    list.innerHTML = '';
    
    const simulatorQuizzes = appState.quizzes.filter(q => q.isSimulator && (q.courseId === 'simulator' || !q.courseId));
    
    if (simulatorQuizzes.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-bolt" style="font-size: 40px; color: var(--success); margin-bottom: 10px;"></i>
                <p>لا يوجد اختبارات محاكاة مستقلة مضافة حالياً.</p>
            </div>`;
        return;
    }
    
    simulatorQuizzes.forEach(quiz => {
        const sections = getSimulatorSections(quiz);
        const sectionsCount = sections.length;
        let questionsCount = 0;
        sections.forEach(sect => {
            if (sect.questions && Array.isArray(sect.questions)) questionsCount += sect.questions.length;
        });
        
        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                ${quiz.type === 'placement' 
                    ? '<div class="course-header"><span class="course-subject subject-qudrat" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border-color: var(--success);">تحديد مستوى 🎯</span></div>'
                    : '<div class="course-header"><span class="course-subject subject-qudrat">محاكاة مستقلة ⚡</span></div>'}
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">${quiz.title}</h4>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 6px;">
                    <span><i class="fa-solid fa-layer-group" style="color: var(--success);"></i> الأقسام: ${sectionsCount}</span>
                    <span><i class="fa-solid fa-circle-question" style="color: var(--accent-orange);"></i> الأسئلة: ${questionsCount}</span>
                    <span><i class="fa-solid fa-bolt" style="color: var(--warning);"></i> النقاط: ${quiz.points} XP</span>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; display: flex; gap: 8px;">
                <button class="btn btn-secondary" style="flex: 1; padding: 8px; font-size: 12px; border-color: var(--accent-orange); color: var(--text-orange);" onclick="openEditQuizModal('${quiz.id}')">
                    <i class="fa-regular fa-edit"></i> تعديل المحاكي
                </button>
                <button class="btn btn-danger btn-secondary" style="flex: 1; padding: 8px; font-size: 12px;" onclick="deleteQuiz('${quiz.id}')">
                    <i class="fa-regular fa-trash-can"></i> حذف المحاكي
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderTeacherSimulatorResults() {
    const tbody = document.getElementById('t-simulators-results-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    let hasResults = false;
    
    appState.students.forEach(student => {
        if (student.simulator_results) {
            Object.keys(student.simulator_results).forEach(quizId => {
                const result = student.simulator_results[quizId];
                const quiz = appState.quizzes.find(q => String(q.id) === String(quizId));
                const quizName = quiz ? quiz.title : 'محاكي محذوف';
                const quizPoints = quiz ? quiz.points : 0;
                
                let scoreColor = 'var(--text-main)';
                if (result.score >= 80) scoreColor = 'var(--success)';
                else if (result.score >= 50) scoreColor = 'var(--warning)';
                else scoreColor = 'var(--danger)';
                
                const dateObj = new Date(result.last_attempt);
                const dateStr = !isNaN(dateObj) ? dateObj.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'غير معروف';

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                tr.innerHTML = `
                    <td style="padding: 15px; font-weight: bold; color: var(--text-orange);">${escapeHtml(student.name)}</td>
                    <td style="padding: 15px;">${escapeHtml(quizName)}</td>
                    <td style="padding: 15px; font-weight: 800; color: ${scoreColor};" dir="ltr">${result.score}%</td>
                    <td style="padding: 15px; color: var(--success);">${quizPoints} XP</td>
                    <td style="padding: 15px; font-size: 12px; color: var(--text-muted);">${dateStr}</td>
                `;
                tbody.appendChild(tr);
                hasResults = true;
            });
        }
    });
    
    if (!hasResults) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="padding: 30px; text-align: center; color: var(--text-muted);">
                    <i class="fa-solid fa-folder-open" style="font-size: 30px; margin-bottom: 10px; opacity: 0.5;"></i><br>
                    لا توجد نتائج مسجلة لاختبارات المحاكاة حتى الآن.
                </td>
            </tr>
        `;
    }
}

function renderStudentSimulators() {
    const list = document.getElementById('s-simulators-list');
    if (!list) return;
    list.innerHTML = '';
    
    const sId = appState.currentUser ? appState.currentUser.id : '';
    const student = appState.students.find(s => s.id === sId);
    const enrolledList = (student && student.enrolled_courses) ? student.enrolled_courses : [];
    
    const simulatorQuizzes = appState.quizzes.filter(q => q.isSimulator && q.type !== 'placement' && (q.courseId === 'simulator' || !q.courseId));
    
    if (simulatorQuizzes.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-bolt" style="font-size: 40px; color: var(--success); margin-bottom: 10px;"></i>
                <p>لا يوجد اختبارات محاكاة مستقلة متاحة حالياً.</p>
            </div>`;
        return;
    }
    
    simulatorQuizzes.forEach(quiz => {
        const sections = getSimulatorSections(quiz);
        const sectionsCount = sections.length;
        let questionsCount = 0;
        sections.forEach(sect => {
            if (sect.questions && Array.isArray(sect.questions)) questionsCount += sect.questions.length;
        });
        
        const isEnrolled = enrolledList.includes(quiz.id);
        
        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header">
                    <span class="course-subject subject-qudrat">محاكي اختبارات تفاعلي ⚡</span>
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">${quiz.title}</h4>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
                    <span><i class="fa-solid fa-layer-group" style="color: var(--success);"></i> الأقسام: ${sectionsCount}</span>
                    <span><i class="fa-solid fa-circle-question" style="color: var(--accent-orange);"></i> الأسئلة: ${questionsCount}</span>
                </div>
            </div>
            
            ${isEnrolled ? `
                <button class="btn btn-primary" style="width: 100%;" onclick="startSimulatorById('${quiz.id}')">
                    <i class="fa-solid fa-bolt"></i> ابدأ حل المحاكاة ⚡
                </button>
            ` : `
                <button class="btn btn-secondary btn-locked" style="width: 100%;" onclick="openUnpaidModal('simulator')">
                    <i class="fa-solid fa-lock"></i> غير مشترك - تواصل للمعلم للتفعيل 🔒
                </button>
            `}
        `;
        list.appendChild(card);
    });
}


function renderStudentPlacementTests() {
    const list = document.getElementById('s-placement-list');
    if (!list) return;
    list.innerHTML = '';
    
    const sId = appState.currentUser ? appState.currentUser.id : '';
    const student = appState.students.find(s => s.id === sId);
    
    const placementQuizzes = appState.quizzes.filter(q => q.isSimulator && q.type === 'placement' && (q.courseId === 'simulator' || !q.courseId));
    
    if (placementQuizzes.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-bullseye" style="font-size: 40px; color: var(--success); margin-bottom: 10px;"></i>
                <p>لا توجد اختبارات تحديد مستوى متاحة حالياً.</p>
            </div>`;
        return;
    }
    
    placementQuizzes.forEach(quiz => {
        const questionsCount = quiz.questions ? quiz.questions.length : 0;
        const lastAttempt = student && student.simulator_results && student.simulator_results[quiz.id];
        
        const card = document.createElement('div');
        card.className = 'glass-card course-card';
        card.innerHTML = `
            <div>
                <div class="course-header">
                    <span class="course-subject subject-qudrat" style="background: rgba(16, 185, 129, 0.15); color: var(--success); border-color: var(--success);">اختبار تحديد مستوى 🎯</span>
                </div>
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-main);">${quiz.title}</h4>
                
                <div style="display: flex; gap: 15px; font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
                    <span><i class="fa-solid fa-circle-question" style="color: var(--success);"></i> الأسئلة: ${questionsCount}</span>
                </div>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, var(--success), #059669); border-color: #059669;" onclick="startPlacementTestById('${quiz.id}')">
                ${lastAttempt ? '<i class="fa-solid fa-rotate-right"></i> إعادة الاختبار' : '<i class="fa-solid fa-bullseye"></i> ابدأ التقييم الآن'}
            </button>
        `;
        list.appendChild(card);
    });
}

function startSimulatorById(quizId) {
    const quiz = appState.quizzes.find(q => q.id === quizId);
    if (quiz) startSimulator(quiz);
}

// ==========================================
// BADGE MANAGER LOGIC
// ==========================================

function openBadgeManagerModal() {
    renderBadgeIconPicker();
    renderBadgeManagerList();
    resetBadgeForm();
    openModal('badge-manager-modal');
}

function renderBadgeIconPicker(selectedIcon = 'fa-trophy') {
    const grid = document.getElementById('badge-icon-picker-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    document.getElementById('badge-new-icon').value = selectedIcon;
    
    BADGE_ICONS_LIBRARY.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isSelected = item.icon === selectedIcon;
        btn.className = `btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`;
        btn.style.padding = '8px';
        btn.style.fontSize = '14px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.title = item.label;
        btn.innerHTML = `<i class="fa-solid ${item.icon}"></i>`;
        btn.onclick = () => {
            document.getElementById('badge-new-icon').value = item.icon;
            renderBadgeIconPicker(item.icon);
        };
        grid.appendChild(btn);
    });
}

function renderBadgeManagerList() {
    const list = document.getElementById('badge-manager-list');
    if (!list) return;
    list.innerHTML = '';
    
    const all = getAllBadges();
    Object.keys(all).forEach(key => {
        const badge = all[key];
        const isDefault = BADGE_DETAILS.hasOwnProperty(key);
        
        const div = document.createElement('div');
        div.className = 'submission-item';
        div.style.padding = '8px 12px';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid ${badge.icon}" style="font-size: 18px; color: var(--accent-orange);"></i>
                <div>
                    <strong style="font-size: 13px; color: var(--text-main);">${escapeHtml(badge.name)}</strong>
                    <span style="font-size: 11px; color: var(--text-muted); display: block;">${escapeHtml(badge.desc)}</span>
                </div>
            </div>
            <div style="display: flex; gap: 6px;">
                <button type="button" class="btn btn-secondary" style="padding: 3px 8px; font-size: 11px; border-color: var(--accent-orange); color: var(--text-orange);" onclick="editCustomBadge('${key}')">تعديل</button>
                ${!isDefault ? `
                    <button type="button" class="btn btn-danger" style="padding: 3px 8px; font-size: 11px;" onclick="deleteCustomBadge('${key}')">حذف</button>
                ` : ''}
            </div>
        `;
        list.appendChild(div);
    });
}

function resetBadgeForm() {
    document.getElementById('custom-badge-edit-key').value = '';
    document.getElementById('badge-new-name').value = '';
    document.getElementById('badge-new-desc').value = '';
    const titleEl = document.getElementById('badge-form-title');
    const saveBtn = document.getElementById('badge-save-btn');
    if (titleEl) titleEl.textContent = 'إضافة وسام تقديري جديد';
    if (saveBtn) saveBtn.textContent = 'حفظ الوسام';
    renderBadgeIconPicker('fa-trophy');
}

function editCustomBadge(key) {
    const all = getAllBadges();
    const badge = all[key];
    if (!badge) return;
    
    document.getElementById('custom-badge-edit-key').value = key;
    document.getElementById('badge-new-name').value = badge.name;
    document.getElementById('badge-new-desc').value = badge.desc;
    const titleEl = document.getElementById('badge-form-title');
    const saveBtn = document.getElementById('badge-save-btn');
    if (titleEl) titleEl.textContent = `تعديل الوسام: ${badge.name}`;
    if (saveBtn) saveBtn.textContent = 'تحديث الوسام';
    renderBadgeIconPicker(badge.icon);
}

function handleSaveCustomBadge(e) {
    e.preventDefault();
    const editKey = document.getElementById('custom-badge-edit-key').value;
    const name = document.getElementById('badge-new-name').value.trim();
    const desc = document.getElementById('badge-new-desc').value.trim();
    const icon = document.getElementById('badge-new-icon').value;
    
    if (!name || !desc) {
        showToast("يرجى ملء الاسم والوصف!", "danger");
        return;
    }
    
    const custom = JSON.parse(localStorage.getItem('masar_custom_badges') || '{}');
    const key = editKey || `custom_${Date.now()}`;
    
    custom[key] = { name, icon, desc };
    localStorage.setItem('masar_custom_badges', JSON.stringify(custom));
    
    showToast(`تم بنجاح حفظ الوسام: (${name})! 🎉`, "success");
    resetBadgeForm();
    renderBadgeManagerList();
    renderTeacherStudents();
}

function deleteCustomBadge(key) {
    if (BADGE_DETAILS.hasOwnProperty(key)) {
        showToast("لا يمكن حذف الأوسمة الافتراضية للنظام!", "danger");
        return;
    }
    if (confirm("هل أنت متأكد من حذف هذا الوسام التقديري؟")) {
        const custom = JSON.parse(localStorage.getItem('masar_custom_badges') || '{}');
        delete custom[key];
        localStorage.setItem('masar_custom_badges', JSON.stringify(custom));
        showToast("تم حذف الوسام بنجاح.", "info");
        renderBadgeManagerList();
        renderTeacherStudents();
    }
}

// ==========================================
// TESTIMONIALS & REVIEWS SYSTEM
// ==========================================

function renderLandingTestimonials() {
    const grid = document.getElementById('landing-testimonials-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const list = (appState.testimonials && appState.testimonials.length > 0) ? appState.testimonials : INITIAL_TESTIMONIALS;
    if (list.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; padding: 25px;">
                <i class="fa-solid fa-comments"></i>
                <p>لا توجد آراء منشورة حالياً. كن أول من يكتب رأيه وتجربته!</p>
            </div>`;
        return;
    }

    const displayList = list.slice(0, 6);
    displayList.forEach(rev => {
        const card = createTestimonialCardHTML(rev, false);
        grid.appendChild(card);
    });
}

function showTestimonialsView() {
    updateHeaderUserBadge();
    hideAllViews();
    const page = document.getElementById('testimonials-page-view');
    if (page) page.style.display = 'block';
    renderTestimonialsView();
}

function renderTestimonialsView(filterText = '') {
    const grid = document.getElementById('full-testimonials-grid');
    const countEl = document.getElementById('testimonials-total-count');
    if (!grid) return;
    grid.innerHTML = '';

    let list = (appState.testimonials && appState.testimonials.length > 0) ? appState.testimonials : INITIAL_TESTIMONIALS;
    if (filterText && filterText.trim()) {
        const q = filterText.trim().toLowerCase();
        list = list.filter(t => 
            (t.studentName && t.studentName.toLowerCase().includes(q)) || 
            (t.comment && t.comment.toLowerCase().includes(q)) || 
            (t.studentRole && t.studentRole.toLowerCase().includes(q))
        );
    }

    if (countEl) countEl.textContent = ((appState.testimonials && appState.testimonials.length > 0) ? appState.testimonials : INITIAL_TESTIMONIALS).length;

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; padding: 35px;">
                <i class="fa-solid fa-comment-slash"></i>
                <p>لا توجد نتائج مطابقة للبحث حالياً.</p>
            </div>`;
        return;
    }

    const isTeacher = appState.currentUser && (appState.currentUser.role === 'teacher' || appState.currentUser.role === 'supervisor');

    list.forEach(rev => {
        const card = createTestimonialCardHTML(rev, isTeacher);
        grid.appendChild(card);
    });
}

function createTestimonialCardHTML(rev, isTeacher) {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'padding: 22px; border-radius: 14px; display: flex; flex-direction: column; justify-content: space-between; position: relative; border-color: rgba(255,125,63,0.2); transition: transform 0.2s ease, border-color 0.2s ease;';

    let starsHtml = '';
    const ratingCount = rev.rating || 5;
    for (let i = 0; i < 5; i++) {
        if (i < ratingCount) {
            starsHtml += `<i class="fa-solid fa-star" style="color: #FBBF24; margin-left: 3px;"></i>`;
        } else {
            starsHtml += `<i class="fa-regular fa-star" style="color: var(--text-muted); margin-left: 3px;"></i>`;
        }
    }

    const deleteBtn = isTeacher ? `
        <button class="btn btn-secondary" onclick="deleteTestimonial('${rev.id}')" title="حذف هذا الرأي" style="padding: 4px 10px; font-size: 11.5px; color: var(--danger); border-color: rgba(239,68,68,0.3); border-radius: 8px;">
            <i class="fa-solid fa-trash"></i> حذف
        </button>
    ` : '';

    card.innerHTML = `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="font-size: 14px;">${starsHtml}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; color: var(--text-muted);">${rev.createdAt || ''}</span>
                    ${deleteBtn}
                </div>
            </div>
            
            <p style="font-size: 14px; color: var(--text-main); line-height: 1.6; margin-bottom: 18px; font-style: italic;">
                "${rev.comment || ''}"
            </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-orange), #FF5500); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; flex-shrink: 0;">
                ${rev.studentName ? rev.studentName.charAt(0) : 'ط'}
            </div>
            <div style="flex: 1; min-width: 0;">
                <h5 style="font-size: 14px; font-weight: 800; color: var(--text-main); margin: 0;">${rev.studentName || 'طالب منصة مسار'}</h5>
                <span style="font-size: 11.5px; color: var(--accent-orange); font-weight: 700;">${rev.studentRole || 'طالب قدرات وتأسيس'}</span>
            </div>
        </div>
    `;
    return card;
}

function openAddTestimonialModal() {
    if (!appState.currentUser) {
        showToast("سجل الآن بحساب طالب مجاناً لإضافة رأيك وتجربتك! 🎓", "info");
        openModal('student-register-modal');
        return;
    }

    const form = document.getElementById('add-testimonial-form');
    if (form) form.reset();

    const testimName = document.getElementById('testim-name');
    if (testimName && appState.currentUser) {
        testimName.value = appState.currentUser.name;
    }

    openModal('add-testimonial-modal');
}

async function handleCreateTestimonial(e) {
    e.preventDefault();
    if (!appState.currentUser) {
        showToast("سجل الآن بحساب طالب مجاناً لإضافة رأيك وتجربتك! 🎓", "info");
        closeModal('add-testimonial-modal');
        openModal('student-register-modal');
        return;
    }

    const nameInput = document.getElementById('testim-name');
    const roleInput = document.getElementById('testim-role');
    const ratingInput = document.getElementById('testim-rating');
    const commentInput = document.getElementById('testim-comment');

    const name = nameInput ? nameInput.value.trim() : (appState.currentUser ? appState.currentUser.name : '');
    const role = roleInput ? roleInput.value : 'طالب منصة مسار';
    const rating = ratingInput ? parseInt(ratingInput.value, 10) || 5 : 5;
    const comment = commentInput ? commentInput.value.trim() : '';

    if (!name || !comment) {
        showToast("يرجى كتابة اسمك ونص الرأي والتجربة!", "danger");
        return;
    }

    const newRev = {
        id: 'rev-' + Date.now(),
        studentName: name,
        studentRole: role,
        rating: rating,
        comment: comment,
        createdAt: new Date().toISOString().split('T')[0]
    };

    if (!appState.testimonials || appState.testimonials.length === 0) {
        appState.testimonials = [...INITIAL_TESTIMONIALS];
    }
    appState.testimonials.unshift(newRev);

    try {
        localStorage.setItem('masar_testimonials', JSON.stringify(appState.testimonials));
    } catch(e) {}

    try {
        if (isCloudMode && supabaseClient) {
            const { error } = await supabaseClient.from('testimonials').insert({
                id: newRev.id,
                student_name: newRev.studentName,
                student_role: newRev.studentRole,
                rating: newRev.rating,
                comment: newRev.comment,
                created_at: newRev.createdAt
            });
            if (error) {
                console.warn("Supabase insert testimonial notice:", error);
            }
        }
    } catch(err) {
        console.warn("Supabase insert testimonial catch:", err);
    }

    closeModal('add-testimonial-modal');
    showToast("شكراً لك! تم نشر رأيك وتجربتك بنجاح 🌟", "success");

    renderLandingTestimonials();
    const testimonialsView = document.getElementById('testimonials-page-view');
    if (testimonialsView && testimonialsView.style.display !== 'none') {
        renderTestimonialsView();
    }
}

async function deleteTestimonial(revId) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الرأي؟")) return;

    try {
        if (isCloudMode && supabaseClient) {
            await supabaseClient.from('testimonials').delete().eq('id', revId);
        }
    } catch(err) {
        console.warn("Supabase delete testimonial error:", err);
    }

    if (!appState.testimonials || appState.testimonials.length === 0) {
        appState.testimonials = [...INITIAL_TESTIMONIALS];
    }
    appState.testimonials = appState.testimonials.filter(t => t.id !== revId);
    try {
        localStorage.setItem('masar_testimonials', JSON.stringify(appState.testimonials));
    } catch(e) {}

    showToast("تم حذف الرأي بنجاح.", "success");

    renderLandingTestimonials();
    renderTestimonialsView();
}

function filterTestimonials(val) {
    renderTestimonialsView(val);
}


// ==========================================
// PLACEMENT TEST LOGIC
// ==========================================

let activePlacementQuizId = null;

function startPlacementTestHandler() {
    // This is called from the Landing Page
    const firstPlacementTest = appState.quizzes.find(q => q.isSimulator && q.type === 'placement');
    if (!firstPlacementTest) {
        showToast("لا يوجد اختبار تحديد مستوى متاح حالياً. يرجى مراجعة الإدارة.", "warning");
        return;
    }
    
    if (appState.currentUser && appState.currentUser.role === 'student') {
        // Logged in as student, go to the placement tests tab
        showDashboard();
        switchTab('student', 's-placement-tab', document.querySelector('.tabs button:nth-child(2)')); // approximate button
        setTimeout(() => {
            startPlacementTestById(firstPlacementTest.id);
        }, 300);
    } else if (appState.currentUser && appState.currentUser.role === 'teacher') {
        showToast("هذا الاختبار مخصص للطلاب فقط.", "info");
    } else {
        // Not logged in. Redirect to register with a flag
        sessionStorage.setItem('pendingPlacementTest', firstPlacementTest.id);
        openModal('student-register-modal');
        showToast("يرجى إنشاء حساب طالب أولاً لبدء اختبار تحديد المستوى.", "info");
    }
}

function checkPendingPlacementTest() {
    const pendingId = sessionStorage.getItem('pendingPlacementTest');
    if (pendingId && appState.currentUser && appState.currentUser.role === 'student') {
        sessionStorage.removeItem('pendingPlacementTest');
        switchTab('student', 's-placement-tab', null);
        setTimeout(() => {
            startPlacementTestById(pendingId);
        }, 500);
    }
}

function startPlacementTestById(quizId) {
    const quiz = appState.quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    const questionsCount = quiz.questions ? quiz.questions.length : 0;
    const durationMins = questionsCount + 1; // Same logic as simulator
    
    document.getElementById('placement-modal-qcount').textContent = questionsCount + " أسئلة";
    document.getElementById('placement-modal-duration').textContent = durationMins + " دقيقة";
    
    activePlacementQuizId = quizId;
    
    const startBtn = document.getElementById('placement-modal-start-btn');
    startBtn.onclick = () => {
        closeModal('placement-test-modal');
        startSimulator(quiz); // We re-use the simulator logic since it has a timer and results screen
    };
    
    openModal('placement-test-modal');
}


function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function openQuestionReviewModal(sIdx, qIdx) {
    const sections = activeSimulatorState.sections;
    if (!sections || !sections[sIdx] || !sections[sIdx].questions || !sections[sIdx].questions[qIdx]) return;
    
    const q = sections[sIdx].questions[qIdx];
    const sectionAnswers = activeSimulatorState.answers[sIdx] || [];
    const myAns = sectionAnswers[qIdx];
    const correctAns = parseInt(q.correct);
    
    document.getElementById('review-modal-title').innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> مراجعة السؤال ${qIdx + 1}`;
    document.getElementById('review-modal-question').textContent = q.question;
    
    const imgContainer = document.getElementById('review-modal-image-container');
    const imgEl = document.getElementById('review-modal-image');
    if (q.image) {
        imgEl.src = q.image;
        imgContainer.style.display = 'block';
    } else {
        imgContainer.style.display = 'none';
    }
    
    const optsContainer = document.getElementById('review-modal-options');
    optsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
        let isMyAns = (myAns === idx);
        let isCorrect = (correctAns === idx);
        
        let bgColor = 'rgba(0,0,0,0.2)';
        let borderColor = 'rgba(255,255,255,0.1)';
        let iconHtml = '';
        
        if (isCorrect) {
            bgColor = 'rgba(16, 185, 129, 0.15)';
            borderColor = 'var(--success)';
            iconHtml = '<i class="fa-solid fa-check" style="color: var(--success); margin-right: auto;"></i>';
        } else if (isMyAns && !isCorrect) {
            bgColor = 'rgba(239, 68, 68, 0.15)';
            borderColor = 'var(--danger)';
            iconHtml = '<i class="fa-solid fa-xmark" style="color: var(--danger); margin-right: auto;"></i>';
        }
        
        optsContainer.innerHTML += `
            <div style="background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 6px; padding: 10px 15px; display: flex; align-items: center; font-size: 13.5px;">
                <span style="font-weight: bold; margin-left: 8px; color: var(--text-muted);">${String.fromCharCode(1601 + idx)}:</span>
                <span style="color: ${(isCorrect || isMyAns) ? 'var(--text-main)' : 'var(--text-muted)'};">${escapeHtml(opt)}</span>
                ${iconHtml}
            </div>
        `;
    });
    
    const vidContainer = document.getElementById('review-modal-video-container');
    const ytWrapper = document.getElementById('review-modal-youtube-wrapper');
    const iframe = document.getElementById('review-modal-video-iframe');
    const html5Wrapper = document.getElementById('review-modal-html5-wrapper');
    const html5Video = document.getElementById('review-modal-html5-video');
    
    // Check if it's an mp4 direct link or similar
    const isDirectVideo = q.videoUrl && (q.videoUrl.toLowerCase().endsWith('.mp4') || q.videoUrl.toLowerCase().endsWith('.webm'));
    const yId = isDirectVideo ? null : extractYouTubeId(q.videoUrl);
    
    if (isDirectVideo) {
        html5Video.src = q.videoUrl;
        html5Wrapper.style.display = 'block';
        ytWrapper.style.display = 'none';
        iframe.src = '';
        vidContainer.style.display = 'block';
    } else if (yId) {
        iframe.src = `https://www.youtube.com/embed/${yId}?rel=0&modestbranding=1&showinfo=0&controls=1`;
        ytWrapper.style.display = 'block';
        html5Wrapper.style.display = 'none';
        html5Video.src = '';
        vidContainer.style.display = 'block';
    } else {
        iframe.src = '';
        html5Video.src = '';
        vidContainer.style.display = 'none';
    }
    
    openModal('question-review-modal');
}


function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('masar_theme', newTheme);
    
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
        if (newTheme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}
