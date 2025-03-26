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
    syllabus: string;
    cutoff: ExamCutoff;
    calendar: ExamCalendar;
    official_website: string;
    duration: string;
    start_preparation: string;
}

export const examData: Exam[] = [
    {
        id: 'jee',
        name: 'JEE Main & Advanced',
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
        start_preparation: 'https://example.com/neet-preparation'
    }
];