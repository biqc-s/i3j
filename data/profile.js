/* ════════════════════════════════════════════════════════════
   PROFILE DATA — المصدر الوحيد لكل محتوى الموقع والسيرة الذاتية
   ------------------------------------------------------------
   عدّل هذا الملف فقط لتحديث الموقع + السيرة الذاتية (ATS) معاً.

   قواعد سريعة:
   • كل نص ثنائي اللغة يُكتب هكذا:  { en: '...', ar: '...' }
   • النص الذي لا يحتاج ترجمة (مثل PMP أو ERP) يمكن كتابته كنص عادي: 'ERP'
   • التواريخ بصيغة 'YYYY-MM' مثل '2024-04'، واترك end: null للوظيفة الحالية.
   • الأيقونات من Font Awesome 6 (https://fontawesome.com/icons) مثل 'fa-rocket'
   • لإخفاء عنصر من السيرة الذاتية فقط (مع بقائه في الموقع): cv: false
   • لإخفاء عنصر من الموقع فقط (مع بقائه في السيرة): site: false
   • الترتيب في القوائم = الترتيب في الموقع والسيرة (الأحدث أولاً).
   • يُسمح بوسم <strong> داخل النصوص للتمييز (يُحذف تلقائياً في السيرة).

   بعد التعديل شغّل (اختياري):  node scripts/validate-profile.mjs
   للتأكد من عدم نسيان أي ترجمة أو تاريخ خاطئ.
════════════════════════════════════════════════════════════ */

window.PROFILE = {

    /* ── البيانات الشخصية ── */
    person: {
        name:      { en: 'Saeed Ahmad Jahash', ar: 'سعيد أحمد جهاش' },
        // طريقة عرض الاسم في الواجهة: [السطر الأول، السطر الثاني، الكلمة المميزة بالذهبي]
        nameLines: { en: ['Saeed', 'Ahmad', 'Jahash'], ar: ['سعيد', 'أحمد', 'جهاش'] },
        initials:  'SJ',
        // المسمى الذي يظهر أعلى السيرة الذاتية مباشرة تحت الاسم
        headline: {
            en: 'Chief Executive Officer | PMP® | ISO 9001 Lead Auditor | Digital Transformation',
            ar: 'رئيس تنفيذي | PMP® | مدقق رئيسي ISO 9001 | التحول الرقمي'
        },
        location: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
        email:        's@i3j.io',
        phone:        '+966506090612',
        phoneDisplay: '+966 50 609 0612',
        linkedin:     'https://www.linkedin.com/in/saeedj',
        website:      'https://i3j.io',
        // شارة "متاح للتعاون" في الواجهة — اجعلها false لإخفائها
        available: true
    },

    /* ── الألقاب المتحركة (Typewriter) في الواجهة ── */
    titles: {
        en: ['Transformational Leader', 'CEO & Strategist', 'PMP® Certified', 'ISO 9001 Lead Auditor', 'Digital Innovator'],
        ar: ['قائد تحويلي', 'رئيس تنفيذي واستراتيجي', 'معتمد PMP®', 'مدقق رئيسي ISO 9001', 'مبتكر رقمي']
    },

    /* ── الأرقام في الواجهة ──
       value: قيمة ثابتة تكتبها بنفسك
       auto:  'projects' | 'certifications' | 'experience' | 'years' (تُحسب تلقائياً من البيانات)
       suffix: لاحقة اختيارية مثل '+' */
    stats: [
        { value: '5', suffix: '+', label: { en: 'Years', ar: 'سنوات' } },
        { auto: 'projects', suffix: '+', label: { en: 'Projects', ar: 'مشاريع' } },
        { auto: 'certifications', label: { en: 'Certifications', ar: 'شهادات' } }
    ],

    /* ── الشارات العائمة حول الأحرف الأولى في الواجهة (حتى 3) ── */
    badges: [
        { icon: 'fa-certificate', text: 'PMP®' },
        { icon: 'fa-shield-alt',  text: 'ISO 9001' },
        { icon: 'fa-robot',       text: 'AI / ML' }
    ],

    /* ── الملخص المهني (يظهر أعلى السيرة الذاتية) — 3 إلى 4 أسطر مليئة بالكلمات المفتاحية ── */
    summary: {
        en: 'Transformational executive and PMP®-certified project leader with dual degrees in Media and Information Technology and an IRCA-certified ISO 9001:2015 Lead Auditor credential. Proven record leading cooperative operations as CEO, driving ERP-based digital transformation, and delivering quality, risk and compliance programs for the Ministry of Tourism aligned with Vision 2030. Skilled in governance, strategic planning, data visualization, AI and Unreal Engine, turning complex data into actionable strategies.',
        ar: 'قائد تنفيذي تحويلي ومدير مشاريع معتمد PMP® يحمل شهادتين في الإعلام وتقنية المعلومات، ومدقق رئيسي معتمد من IRCA في ISO 9001:2015. سجل مثبت في قيادة عمليات الجمعيات التعاونية كرئيس تنفيذي، وقيادة التحول الرقمي القائم على أنظمة ERP، وتنفيذ برامج الجودة والمخاطر والامتثال لوزارة السياحة بما يتوافق مع رؤية 2030. متمكن في الحوكمة والتخطيط الاستراتيجي وتصوير البيانات والذكاء الاصطناعي وUnreal Engine لتحويل البيانات المعقدة إلى استراتيجيات قابلة للتنفيذ.'
    },

    /* ── قسم "من هو سعيد" في الموقع ── */
    about: [
        {
            en: 'I am a transformational leader with a unique blend of technical mastery and strategic vision. Holding dual degrees in <strong>Media</strong> and <strong>Information Technology</strong>, I bridge the gap between digital innovation and institutional excellence.',
            ar: 'أنا قائد تحويلي يجمع بين الإتقان التقني والرؤية الاستراتيجية. أحمل شهادتين في <strong>الإعلام</strong> و<strong>تقنية المعلومات</strong>، وأجسّر الفجوة بين الابتكار الرقمي والتميز المؤسسي.'
        },
        {
            en: 'My journey is defined by a commitment to quality and efficiency. From leading smart inspection systems across public sectors to governing agricultural cooperatives, I leverage <strong>AI, Data Visualization, and Unreal Engine</strong> to turn complex data into actionable strategies.',
            ar: 'رحلتي محددة بالالتزام بالجودة والكفاءة. من قيادة أنظمة التفتيش الذكية عبر القطاعات العامة إلى إدارة التعاونيات الزراعية، أستثمر <strong>الذكاء الاصطناعي وتصور البيانات وUnreal Engine</strong> لتحويل البيانات المعقدة إلى استراتيجيات قابلة للتنفيذ.'
        },
        {
            en: 'Driven by the vision of <strong>Digital Leadership</strong>, I build tools that enhance transparency, empower communities, and align with national transformation goals.',
            ar: 'مدفوعاً برؤية <strong>القيادة الرقمية</strong>، أبني أدوات تعزز الشفافية وتمكّن المجتمعات وتتوافق مع أهداف التحول الوطني.'
        }
    ],

    highlights: [
        { icon: 'fa-rocket',       title: { en: 'Digital Pioneer', ar: 'رائد رقمي' },       text: { en: 'Bridging tech & strategy', ar: 'جسر بين التقنية والاستراتيجية' } },
        { icon: 'fa-vr-cardboard', title: { en: 'VR / AR Creator', ar: 'مبدع الواقع الافتراضي' }, text: { en: 'Unreal Engine & Mixed Reality', ar: 'Unreal Engine والواقع المختلط' } },
        { icon: 'fa-sitemap',      title: { en: 'Data Architect', ar: 'مهندس البيانات' },    text: { en: 'AI & Data Visualization', ar: 'الذكاء الاصطناعي وتصور البيانات' } },
        { icon: 'fa-award',        title: { en: 'Quality Leader', ar: 'قائد الجودة' },       text: { en: 'ISO 9001 & PMP Certified', ar: 'معتمد ISO 9001 و PMP' } }
    ],

    /* ── الخبرات العملية (الأحدث أولاً) ── */
    experience: [
        {
            role:     { en: 'Chief Executive Officer', ar: 'الرئيس التنفيذي' },
            org:      { en: 'Rijal Almaa Agricultural Cooperative Association', ar: 'جمعية رجال ألمع الزراعية التعاونية' },
            location: { en: 'Rijal Almaa, Aseer', ar: 'رجال ألمع، عسير' },
            start: '2024-04', end: '2024-10',
            tag:  { en: 'Leadership', ar: 'قيادة' },
            icon: 'fa-crown',
            points: [
                { en: 'Directed multi-sector operations ensuring compliance with agricultural and financial regulations.', ar: 'قاد عمليات متعددة القطاعات مع ضمان الامتثال للوائح الزراعية والمالية.' },
                { en: 'Implemented ERP-based workflows streamlining internal operations.', ar: 'نفّذ سير عمل قائم على نظام ERP لتبسيط العمليات الداخلية.' },
                { en: 'Developed digital ID systems (NFC, QR, Code128) for member traceability.', ar: 'طوّر أنظمة هوية رقمية (NFC وQR وCode128) لتتبع الأعضاء.' },
                { en: 'Empowered local startups through digital inclusion initiatives.', ar: 'مكّن الشركات الناشئة المحلية من خلال مبادرات الشمول الرقمي.' }
            ]
        },
        {
            role:     { en: 'Sales Executive', ar: 'مدير المبيعات' },
            org:      { en: 'Marwan Alshaali Group', ar: 'مجموعة مروان الشعالي' },
            location: { en: 'Riyadh', ar: 'الرياض' },
            start: '2023-11', end: '2024-02',
            tag:  { en: 'Sales', ar: 'مبيعات' },
            icon: 'fa-handshake',
            points: [
                { en: 'Managed B2B sales for global automotive brands (CFMOTO, Greenman).', ar: 'أدار مبيعات قطاع الأعمال (B2B) لعلامات سيارات عالمية (CFMOTO وGreenman).' },
                { en: 'Secured strategic deals across government and private sectors.', ar: 'حقق صفقات استراتيجية عبر القطاعين الحكومي والخاص.' },
                { en: 'Delivered client-focused solutions for premium electric mobility products.', ar: 'قدّم حلولاً موجهة للعميل لمنتجات التنقل الكهربائي المميزة.' }
            ]
        },
        {
            role:     { en: 'Quality Controller', ar: 'مراقب الجودة' },
            org:      { en: 'Ministry of Tourism (via TÜV Rheinland)', ar: 'وزارة السياحة (عبر TÜV Rheinland)' },
            start: '2023-04', end: '2023-06',
            tag:  { en: 'Quality', ar: 'جودة' },
            icon: 'fa-magnifying-glass',
            points: [
                { en: 'Spearheaded risk and compliance audits aligned with Vision 2030.', ar: 'قاد عمليات تدقيق المخاطر والامتثال المتوافقة مع رؤية 2030.' },
                { en: 'Applied advanced QA methodologies (FMEA, SPC, HACCP).', ar: 'طبّق منهجيات ضمان الجودة المتقدمة (FMEA وSPC وHACCP).' },
                { en: 'Delivered data-driven insights to boost investor confidence.', ar: 'قدّم رؤى مستندة إلى البيانات لتعزيز ثقة المستثمرين.' }
            ]
        },
        {
            role:     { en: 'Control Specialist', ar: 'أخصائي رقابة' },
            org:      { en: 'Ministry of Tourism (via Emdad Al Khebrat – ELM)', ar: 'وزارة السياحة (عبر إمداد الخبرات – علم)' },
            start: '2021-12', end: '2023-01',
            tag:  { en: 'Control', ar: 'رقابة' },
            icon: 'fa-satellite-dish',
            points: [
                { en: 'Oversaw field operations ensuring regulatory compliance.', ar: 'أشرف على العمليات الميدانية وضمان الامتثال التنظيمي.' },
                { en: 'Introduced GPS-based digital tracking for streamlined field tasks.', ar: 'أدخل تتبعاً رقمياً يعتمد على GPS لتبسيط المهام الميدانية.' },
                { en: 'Acted as liaison for new policies and inspector training.', ar: 'عمل حلقة وصل للسياسات الجديدة وتدريب المفتشين.' }
            ]
        },
        {
            role:     { en: 'Quality Inspector', ar: 'مفتش جودة' },
            org:      { en: 'Ministry of Tourism (via TÜV Rheinland)', ar: 'وزارة السياحة (عبر TÜV Rheinland)' },
            location: { en: 'Aseer', ar: 'عسير' },
            start: '2020-02', end: '2021-02',
            tag:  { en: 'Inspection', ar: 'تفتيش' },
            icon: 'fa-clipboard-check',
            points: [
                { en: 'One of the first field inspectors for the national tourism quality program in Aseer.', ar: 'أحد أوائل المفتشين الميدانيين لبرنامج الجودة السياحي الوطني في عسير.' },
                { en: 'Conducted detailed evaluations of tourism facilities.', ar: 'أجرى تقييمات تفصيلية للمرافق السياحية.' },
                { en: 'Collaborated in rolling out tourism modernization initiatives.', ar: 'شارك في إطلاق مبادرات تحديث القطاع السياحي.' }
            ]
        }
    ],

    /* ── المشاريع ── featured: true يميز البطاقة بإطار ذهبي، award: نص الجائزة */
    projects: [
        {
            title: { en: 'Tourism Inspector Training Program', ar: 'برنامج تدريب مفتشي السياحة' },
            description: { en: 'Designed and led a national training initiative for Ministry of Tourism inspectors using a personalized, data-driven approach.', ar: 'صمّم وقاد مبادرة تدريبية وطنية لمفتشي وزارة السياحة باستخدام نهج شخصي قائم على البيانات.' },
            icon: 'fa-chalkboard-teacher',
            tags: [{ en: 'Training', ar: 'تدريب' }, { en: 'Government', ar: 'حكومي' }]
        },
        {
            title: { en: 'Ajaweed 3: Bottleneck Initiative', ar: 'أجاويد 3: مبادرة عنق الزجاجة' },
            description: { en: 'Spearheaded a media tracking and evaluation system. Developed dashboards and synthesized field data into actionable insights.', ar: 'قاد نظام تتبع وتقييم إعلامي، وطوّر لوحات بيانات وحوّل البيانات الميدانية إلى رؤى قابلة للتنفيذ.' },
            icon: 'fa-chart-line',
            tags: [{ en: 'Analytics', ar: 'تحليلات' }, { en: 'Media', ar: 'إعلام' }]
        },
        {
            title: { en: 'ERP-Driven Operations', ar: 'العمليات المدعومة بأنظمة ERP' },
            description: { en: 'Architected smart business workflows using ERP platforms (Daftra) for a commercial laundromat and a regional cooperative.', ar: 'صمّم سير عمل تجاري ذكي باستخدام منصات ERP (دفترة) لمغسلة تجارية وجمعية تعاونية إقليمية.' },
            icon: 'fa-network-wired',
            tags: ['ERP', { en: 'Operations', ar: 'عمليات' }]
        },
        {
            title: { en: 'Smart Membership Cards', ar: 'بطاقات العضوية الذكية' },
            description: { en: 'Designed NFC, QR and barcode-enabled cards integrating identity, access and digital governance features.', ar: 'صمّم بطاقات تدعم NFC وQR والباركود تجمع بين الهوية والوصول وميزات الحوكمة الرقمية.' },
            icon: 'fa-id-card',
            tags: ['NFC', { en: 'Digital ID', ar: 'هوية رقمية' }]
        },
        {
            title: { en: 'Ghadah – Virtual World', ar: 'غادة – العالم الافتراضي' },
            description: { en: 'Award-nominated VR experience for the Museums Commission, combining diverse aesthetics and regional storytelling in Unreal Engine.', ar: 'تجربة واقع افتراضي مرشحة لجائزة لصالح هيئة المتاحف، تجمع جماليات متنوعة وسرداً إقليمياً باستخدام Unreal Engine.' },
            icon: 'fa-vr-cardboard',
            tags: ['Unreal Engine', 'VR / AR'],
            award: { en: 'Award-Nominated', ar: 'مرشح لجائزة' },
            featured: true
        },
        {
            title: { en: 'SeedLTech – Coffee Innovation', ar: 'SeedLTech – ابتكار القهوة' },
            description: { en: 'Rural-tech initiative combining coffee seedling traceability with UV leaf scanning and mixed reality interfaces.', ar: 'مبادرة تقنية ريفية تجمع تتبع شتلات القهوة مع فحص الأوراق بالأشعة فوق البنفسجية وواجهات الواقع المختلط.' },
            icon: 'fa-seedling',
            tags: [{ en: 'AgriTech', ar: 'تقنية زراعية' }, { en: 'Mixed Reality', ar: 'واقع مختلط' }]
        }
    ],

    /* ── الكفاءات الأساسية (تظهر في الموقع وفي قسم المهارات في السيرة) ── */
    competencies: [
        { icon: 'fa-list-check',     name: { en: 'Project Management', ar: 'إدارة المشاريع' } },
        { icon: 'fa-microchip',      name: { en: 'Digital Transformation', ar: 'التحول الرقمي' } },
        { icon: 'fa-circle-check',   name: { en: 'Quality Assurance', ar: 'ضمان الجودة' } },
        { icon: 'fa-database',       name: { en: 'ERP & Data Systems', ar: 'أنظمة ERP والبيانات' } },
        { icon: 'fa-robot',          name: { en: 'AI & Unreal Engine', ar: 'الذكاء الاصطناعي وUnreal Engine' } },
        { icon: 'fa-scale-balanced', name: { en: 'Governance & Compliance', ar: 'الحوكمة والامتثال' } },
        { icon: 'fa-chess',          name: { en: 'Strategic Planning', ar: 'التخطيط الاستراتيجي' } }
    ],

    /* ── مهارات تقنية إضافية — تظهر في السيرة الذاتية فقط لرفع مطابقة الكلمات المفتاحية في ATS ── */
    tools: [
        'Risk Management', 'Internal Auditing', 'FMEA', 'SPC', 'HACCP', 'ERP (Daftra)',
        'Data Visualization', 'Dashboards', 'Python', 'Unreal Engine', 'VR / AR / MR',
        'NFC / QR / Barcode Systems', 'B2B Sales', 'Stakeholder Management', 'Training & Development'
    ],

    /* ── الشهادات المهنية ── year اختياري */
    certifications: [
        { icon: 'fa-certificate',  name: { en: 'PMP® – Project Management Professional', ar: 'PMP® – محترف إدارة المشاريع' }, issuer: 'PMI' },
        { icon: 'fa-shield-alt',   name: { en: 'IRCA Certified Lead Auditor (ISO 9001:2015)', ar: 'مدقق رئيسي معتمد من IRCA (ISO 9001:2015)' }, issuer: 'IRCA' },
        { icon: 'fa-code',         name: { en: 'Python Programming', ar: 'البرمجة بلغة Python' }, issuer: { en: 'Saudi Digital Academy', ar: 'الأكاديمية الرقمية السعودية' } },
        { icon: 'fa-brain',        name: { en: 'AI & Machine Learning', ar: 'الذكاء الاصطناعي وتعلم الآلة' }, issuer: { en: 'King Khalid University', ar: 'جامعة الملك خالد' } },
        { icon: 'fa-vr-cardboard', name: { en: 'VR / AR / MR Technologies', ar: 'تقنيات الواقع الافتراضي والمعزز والمختلط' }, issuer: { en: 'Applied Tech Series', ar: 'سلسلة التقنية التطبيقية' } }
    ],

    /* ── التعليم ── inProgress: true للدراسة الحالية، وإلا اكتب سنة التخرج في year */
    education: [
        { icon: 'fa-laptop-code',     degree: { en: 'B.S. Information Technology', ar: 'بكالوريوس تقنية المعلومات' }, school: { en: 'Saudi Electronic University', ar: 'الجامعة السعودية الإلكترونية' }, inProgress: true },
        { icon: 'fa-broadcast-tower', degree: { en: 'B.A. Communications & Media', ar: 'بكالوريوس الاتصال والإعلام' }, school: { en: 'King Khalid University', ar: 'جامعة الملك خالد' }, year: 2018 },
        { icon: 'fa-hard-hat',        degree: { en: 'Higher Diploma in Civil Technology', ar: 'دبلوم عالٍ في التقنية المدنية' }, school: { en: 'Technical College – Abha', ar: 'الكلية التقنية – أبها' }, year: 2014 }
    ],

    /* ── اللغات (تظهر في السيرة الذاتية) ── */
    languages: [
        { name: { en: 'Arabic', ar: 'العربية' },   level: { en: 'Native', ar: 'اللغة الأم' } },
        { name: { en: 'English', ar: 'الإنجليزية' }, level: { en: 'Professional working proficiency', ar: 'إجادة مهنية' } }
    ]
};
