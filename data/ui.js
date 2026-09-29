/* ════════════════════════════════════════════════════════════
   UI LABELS — نصوص الواجهة الثابتة (عناوين الأقسام، الأزرار، عناوين السيرة)
   نادراً ما تحتاج لتعديل هذا الملف. المحتوى الشخصي في data/content/*.json
   ويُعدَّل من لوحة التحكم (Pages CMS)
════════════════════════════════════════════════════════════ */

window.UI = {
    meta: {
        title:       { en: 'Saeed Ahmad Jahash | Transformational Leader', ar: 'سعيد أحمد جهاش | قائد تحويلي' },
        description: {
            en: 'Portfolio of Saeed Ahmad Jahash – CEO, PMP®, ISO 9001 Lead Auditor and transformational leader in media, quality and technology. Download the ATS-friendly CV in English or Arabic.',
            ar: 'الموقع الشخصي لسعيد أحمد جهاش – رئيس تنفيذي، معتمد PMP®، مدقق رئيسي ISO 9001 وقائد تحويلي في الإعلام والجودة والتقنية. حمّل السيرة الذاتية المتوافقة مع ATS بالعربية أو الإنجليزية.'
        }
    },

    nav: {
        about:      { en: 'About', ar: 'نبذة' },
        experience: { en: 'Experience', ar: 'الخبرة' },
        projects:   { en: 'Projects', ar: 'المشاريع' },
        achievements: { en: 'Achievements', ar: 'الإنجازات' },
        skills:     { en: 'Skills', ar: 'المهارات' },
        education:  { en: 'Education', ar: 'التعليم' },
        contact:    { en: 'Contact', ar: 'تواصل' }
    },

    hero: {
        available: { en: 'Open to Collaboration', ar: 'متاح للتعاون' },
        greeting:  { en: 'Hello, I am', ar: 'مرحباً، أنا' },
        cta:       { en: 'Discover My Journey', ar: 'اكتشف مسيرتي' }
    },

    sections: {
        about:      { tag: { en: 'About', ar: 'نبذة' },       title: [{ en: 'Who is ', ar: 'من هو ' }, { en: 'Saeed?', ar: 'سعيد؟' }] },
        experience: { tag: { en: 'Experience', ar: 'الخبرة' }, title: [{ en: 'Professional ', ar: 'المسيرة ' }, { en: 'Odyssey', ar: 'المهنية' }] },
        projects:   { tag: { en: 'Projects', ar: 'المشاريع' }, title: [{ en: 'Key ', ar: 'أبرز ' }, { en: 'Projects', ar: 'المشاريع' }] },
        achievements: { tag: { en: 'Achievements', ar: 'الإنجازات' }, title: [{ en: 'Awards & ', ar: 'الجوائز ' }, { en: 'Achievements', ar: 'والإنجازات' }] },
        skills:     { tag: { en: 'Skills', ar: 'المهارات' },   title: [{ en: 'Expertise & ', ar: 'الخبرات ' }, { en: 'Credentials', ar: 'والمؤهلات' }] },
        education:  { tag: { en: 'Education', ar: 'التعليم' }, title: [{ en: '', ar: '' }, { en: 'Education', ar: 'التعليم' }] }
    },

    labels: {
        competencies: { en: 'Core Competencies', ar: 'الكفاءات الأساسية' },
        certifications: { en: 'Certifications', ar: 'الشهادات المهنية' },
        present:      { en: 'Present', ar: 'حتى الآن' },
        inProgress:   { en: 'In Progress', ar: 'قيد الدراسة' },
        classOf:      { en: 'Class of', ar: 'دفعة' },
        email:        { en: 'Email', ar: 'البريد الإلكتروني' },
        phone:        { en: 'Phone', ar: 'الهاتف' },
        viewProfile:  { en: 'View Profile', ar: 'عرض الملف الشخصي' },
        rights:       { en: 'All Rights Reserved', ar: 'جميع الحقوق محفوظة' },
        toggleLang:   { en: 'Switch to Arabic', ar: 'التبديل إلى الإنجليزية' },
        menu:         { en: 'Menu', ar: 'القائمة' },
        skip:         { en: 'Skip to content', ar: 'تخطَّ إلى المحتوى' },
        backToTop:    { en: 'Back to top', ar: 'العودة للأعلى' },
        close:        { en: 'Close', ar: 'إغلاق' },
        visit:        { en: 'Open link', ar: 'فتح الرابط' },
        loadError:    { en: 'Content could not be loaded. Please refresh the page.', ar: 'تعذّر تحميل المحتوى. يرجى تحديث الصفحة.' }
    },

    contact: {
        title:    [{ en: "Let's ", ar: 'لنبدأ ' }, { en: 'Connect', ar: 'التواصل' }],
        subtitle: { en: 'Ready to transform your vision into reality?', ar: 'مستعد لتحويل رؤيتك إلى واقع؟' }
    },

    /* ── زر وقائمة السيرة الذاتية ── */
    cvMenu: {
        button:  { en: 'Download CV', ar: 'تحميل السيرة' },
        heading: { en: 'ATS-friendly CV (PDF)', ar: 'سيرة ذاتية متوافقة مع ATS (PDF)' },
        english: { en: 'English CV', ar: 'السيرة بالإنجليزية' },
        arabic:  { en: 'Arabic CV', ar: 'السيرة بالعربية' },
        preview: { en: 'Preview & share link', ar: 'معاينة ومشاركة الرابط' },
        hint:    {
            en: 'In the print dialog choose “Save as PDF” and turn off “Headers and footers”.',
            ar: 'في نافذة الطباعة اختر «حفظ كملف PDF» وألغِ تفعيل «الرؤوس والتذييلات».'
        }
    },

    /* ── عناوين أقسام السيرة الذاتية — عناوين قياسية تتعرف عليها أنظمة ATS ── */
    cv: {
        summary:        { en: 'Professional Summary', ar: 'الملخص المهني' },
        skills:         { en: 'Core Competencies', ar: 'الكفاءات الأساسية' },
        tools:          { en: 'Technical Skills', ar: 'المهارات التقنية' },
        experience:     { en: 'Work Experience', ar: 'الخبرة العملية' },
        projects:       { en: 'Key Projects', ar: 'أبرز المشاريع' },
        achievements:   { en: 'Awards & Achievements', ar: 'الجوائز والإنجازات' },
        education:      { en: 'Education', ar: 'التعليم' },
        certifications: { en: 'Certifications', ar: 'الشهادات المهنية' },
        languages:      { en: 'Languages', ar: 'اللغات' },
        fileName:       { en: 'Saeed-Ahmad-Jahash-CV', ar: 'سعيد-أحمد-جهاش-السيرة-الذاتية' },
        toolbar: {
            print:    { en: 'Print / Save as PDF', ar: 'طباعة / حفظ PDF' },
            back:     { en: 'Back to website', ar: 'العودة للموقع' },
            language: { en: 'CV language', ar: 'لغة السيرة' },
            copy:     { en: 'Copy link', ar: 'نسخ الرابط' },
            copied:   { en: 'Link copied', ar: 'تم نسخ الرابط' }
        }
    }
};
