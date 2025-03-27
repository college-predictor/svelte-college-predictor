interface ExamCalendar {
    "application_start_date": string;
    "application_end_date": string;
    "exam_date": string;
    "result_date": string;
}

interface ExamCutoff {
    general_cutoff: number;
    obc_cutoff: number;
    sc_cutoff: number;
    st_cutoff: number;
    pwd_cutoff: number;
}

interface Exam {
    id: string;
    name: string;
    category: 'Engineering' | 'Medical' | 'Commerce' | 'Govt';
    instructor: string;
    progress: number;
    image: string;
    syllabus: string;
    cutoff: ExamCutoff;
    calendar: ExamCalendar;
    official_website: string;
    duration: string;
    start_preparation: string;
}

export const examData: Exam[] = [
    {
        id: 'jee-main',
        name: 'JEE Mains',
        category: 'Engineering',
        instructor: 'Jane Smith',
        progress: 85,
        image: '/assets/jee-main.svg',
        syllabus: 'https://example.com/jee-syllabus',
        cutoff: {
            general_cutoff: 23,
            obc_cutoff: 30,
            sc_cutoff: 15,
            st_cutoff: 10,
            pwd_cutoff: 5
        },
        calendar: {
            application_start_date: '23/03/24',
            application_end_date: '30/04/24',
            exam_date: '01/06/24',
            result_date: '30/06/24'
        },
        official_website: 'https://jeemain.nta.nic.in',
        duration: '3+3 hours',
        start_preparation: 'https://example.com/jee-preparation'
    },
    {
        id: 'jee-advance',
        name: 'JEE Advance',
        category: 'Engineering',
        instructor: 'Alex Johnson',
        progress: 42,
        image: '/assets/jee-advance.svg',
        syllabus: 'https://example.com/jee-advance-syllabus',
        cutoff: {
            general_cutoff: 25,
            obc_cutoff: 22,
            sc_cutoff: 18,
            st_cutoff: 15,
            pwd_cutoff: 12
        },
        calendar: {
            application_start_date: '15/08/23',
            application_end_date: '30/09/23',
            exam_date: '03/02/24',
            result_date: '16/03/24'
        },
        official_website: 'https://gate.iitkgp.ac.in',
        duration: '3 hours',
        start_preparation: 'https://example.com/gate-preparation'
    },
    {
        id: 'bits',
        name: 'BITS Pilani',
        category: 'Engineering',
        instructor: 'Emily Brown',
        progress: 19,
        image: '/assets/bits.svg',
        syllabus: 'https://example.com/bits-syllabus',
        cutoff: {
            general_cutoff: 95,
            obc_cutoff: 90,
            sc_cutoff: 85,
            st_cutoff: 80,
            pwd_cutoff: 75
        },
        calendar: {
            application_start_date: '01/08/24',
            application_end_date: '15/09/24',
            exam_date: '24/11/24',
            result_date: '02/01/25'
        },
        official_website: 'https://iimcat.ac.in',
        duration: '2 hours',
        start_preparation: 'https://example.com/cat-preparation'
    },
    {
        id: 'rpet',
        name: 'RPET',
        category: 'Engineering',
        instructor: 'Michael Wilson',
        progress: 35,
        image: '/assets/rpet.svg',
        syllabus: 'https://example.com/rpet-syllabus',
        cutoff: {
            general_cutoff: 98,
            obc_cutoff: 96,
            sc_cutoff: 92,
            st_cutoff: 90,
            pwd_cutoff: 85
        },
        calendar: {
            application_start_date: '14/02/24',
            application_end_date: '05/03/24',
            exam_date: '26/05/24',
            result_date: '15/06/24'
        },
        official_website: 'https://upsc.gov.in',
        duration: '6 hours',
        start_preparation: 'https://example.com/upsc-preparation'
    },
    {
        id: 'neet',
        name: 'NEET',
        syllabus: 'https://example.com/neet-syllabus',
        cutoff: {
            general_cutoff: 120,
            obc_cutoff: 108,
            sc_cutoff: 90,
            st_cutoff: 90,
            pwd_cutoff: 90
        },
        calendar: {
            application_start_date: '01/04/24',
            application_end_date: '15/05/24',
            exam_date: '05/07/24',
            result_date: '15/08/24'
        },
        official_website: 'https://neet.nta.nic.in',
        duration: '3 hours',
        start_preparation: 'https://example.com/neet-preparation',
        category: "Medical",
        instructor: "",
        progress: 0,
        image: '/assets/rpet.svg',
    }
];