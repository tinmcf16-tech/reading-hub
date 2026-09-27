// Curated Knowledge Channel TV & DepEd TV Video Catalog
// Prioritizes official Tagalog educational programming for Philippine Primary Grades:
// - Wikaharian (Filipino / Reading & Literacy / Marungko Method)
// - MathDali (Mathematics with Kuya Icko)
// - Science Says / Puno ng Buhay (Grade 3 Science)
// - Wow! / Araling Panlipunan (Makabansa / Komunidad)
// - Ready, Set, Read! (English / Phonics / Vocabulary)
// - Magandang Asal / Ugaling Pilipino (GMRC / ESP)

const videoLibrary = {
    // ==========================================
    // GRADE 1
    // ==========================================
    'g1_reading': [
        {
            weeks: [1, 2, 3, 4],
            video_id: 'v52tC8Qr4oI',
            program: 'Wikaharian • Marungko Approach',
            title: 'Titik S, M, A, I: Pagkilala at Tunog ng Letra',
            description: 'Sama-sama tayong matuto sa pagbigkas ng tamang tunog ng mga letra gamit ang Marungko Approach kasama si Teacher Michelle!'
        },
        {
            weeks: [5, 6, 7, 8, 9],
            video_id: 'VaLG5IfSTQo',
            program: 'Wikaharian • Musikantahan',
            title: 'Pagsasama ng mga Tunog at Pagbuo ng Pantig (B, E, T, U, K)',
            description: 'Panoorin kung paano pagsasamahin ang mga tunog ng letra upang makabuo ng mga unang pantig at madaling salita.'
        },
        {
            weeks: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'iWJLqtWsq3M',
            program: 'Wikaharian • Kuwento ng Wikaharian',
            title: 'Kuwento: Sampung Magkakaibigan (Pagbasa at Pag-unawa)',
            description: 'Makinig at magbasa sa masayang kuwento upang mas mapalawak ang kasanayan sa pagbasa at pag-unawa ng kuwento.'
        }
    ],

    'g1_language': [
        {
            weeks: [1, 2, 3, 4, 5, 6],
            video_id: '24Oym-0Gg5Y',
            program: 'Wikaharian • Pamilya at Pakikipagkapwa',
            title: 'Pagpapahayag ng Sarili at Pagkilala sa Salita',
            description: 'Alamin kung paano gamitin ang mga payak na salita sa paglalarawan ng sarili, pamilya, at kapwa.'
        },
        {
            weeks: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'DPvlf6fEgms',
            program: 'Wikaharian • Bahagi ng Pananalita',
            title: 'Salitang Naglalarawan at Pagbuo ng Pangungusap',
            description: 'Matutong gumamit ng mga salitang naglalarawan at wastong pananalita sa pakikipag-usap araw-araw.'
        }
    ],

    'g1_math': [
        {
            weeks: [1, 2, 3, 4, 5],
            video_id: 'LsB2FNq8ynU',
            program: 'MathDali • Knowledge Channel',
            title: 'Addition (Part 1): Pagsasama-sama ng mga Bilang',
            description: 'Kasama si Kuya Icko, tuklasin kung gaano kadali magdagdag at magbilang ng mga bagay sa paligid!'
        },
        {
            weeks: [6, 7, 8, 9, 10, 11, 12],
            video_id: 'pbF7mDbll94',
            program: 'MathDali • Knowledge Channel',
            title: 'Subtraction (Part 1): Pagbabawas ng mga Bilang',
            description: 'Alamin ang masayang paraan ng pagbabawas ng mga bilang upang mabilis malaman ang natira!'
        },
        {
            weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'Cd6D36hIErU',
            program: 'MathDali • Knowledge Channel',
            title: 'Pagkilala sa mga Hugis, Huwaran at Barya',
            description: 'Tuklasin ang iba\'t ibang hugis, pera, at patterns na nakikita natin araw-araw sa pamayanan.'
        }
    ],

    'g1_makabansa': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8],
            video_id: '24Oym-0Gg5Y',
            program: 'Knowledge Channel • Araling Panlipunan',
            title: 'Ang Aking Pamilya at Tahanan sa Pamayanan',
            description: 'Panoorin ang kahalagahan ng bawat miyembro ng pamilya at ang kanilang gampanin sa tahanan.'
        },
        {
            weeks: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'CW7OF40NVb8',
            program: 'Knowledge Channel • Wow Komunidad',
            title: 'Mga Katulong sa Pamayanan at Kapaligiran',
            description: 'Kilalanin ang mga taong tumutulong sa ating komunidad tulad ng guro, doktor, pulis, at bumbero.'
        }
    ],

    'g1_gmrc': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'DPvlf6fEgms',
            program: 'Knowledge Channel • Magandang Asal',
            title: 'Magagalang na Pananalita at Pagbati sa Kapwa',
            description: 'Matutunan ang paggamit ng "po", "opo", "salamat po", at iba pang magagalang na pananalita.'
        }
    ],

    // ==========================================
    // GRADE 2
    // ==========================================
    'g2_filipino': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8],
            video_id: 'Elu7aU8pldQ',
            program: 'Wikaharian • Knowledge Channel',
            title: 'Pangngalang Pantangi at Pangngalang Pambalana',
            description: 'Alamin ang pagkakaiba ng tanging ngalan (pantangi) at karaniwang ngalan (pambalana) kasama ang mga tauhan ng Wikaharian!'
        },
        {
            weeks: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'iWJLqtWsq3M',
            program: 'Wikaharian • Mga Kuwento ng Wikaharian',
            title: 'Pagbasa ng Kuwento at Pagtukoy sa Mahahalagang Detalye',
            description: 'Sanayin ang galing sa pagsagot sa mga tanong na Sino, Ano, Saan, Kailan, at Bakit mula sa binasang kuwento.'
        }
    ],

    'g2_english': [
        {
            weeks: [1, 2, 3, 4, 5, 6],
            video_id: 'Riz6ma4xUsk',
            program: 'Ready, Set, Read! • Knowledge Channel',
            title: 'Rhyming Words and Phonics Sounds',
            description: 'Learn fun English rhyming words, word families, and vowel sounds with catchy songs and stories!'
        },
        {
            weeks: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'aW5DbX6dy2M',
            program: 'Ready, Set, Read! • Knowledge Channel',
            title: 'Polite Expressions & Simple Sentences',
            description: 'Practice everyday polite greetings and building simple sentences to express thoughts clearly in English.'
        }
    ],

    'g2_math': [
        {
            weeks: [1, 2, 3, 4, 5, 6],
            video_id: 'LsB2FNq8ynU',
            program: 'MathDali • Knowledge Channel',
            title: 'Pagsasama ng 2 hanggang 3-Digit Numbers',
            description: 'Subaybayan si Kuya Icko sa MathDali upang mabilis at tamang mapagsama ang mas malalaking bilang!'
        },
        {
            weeks: [7, 8, 9, 10, 11, 12, 13, 14],
            video_id: 'pbF7mDbll94',
            program: 'MathDali • Knowledge Channel',
            title: 'Subtraction na may Regrouping',
            description: 'Paano magbawas kapag kailangang manghiram? Madali lang \'yan sa tulong ng MathDali tricks!'
        },
        {
            weeks: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'eH90hePDsNQ',
            program: 'MathDali • Knowledge Channel',
            title: 'Panimula sa Multiplication (Paulit-ulit na Pagdaragdag)',
            description: 'Tuklasin kung paano ang multiplication ay paulit-ulit na addition gamit ang mga masayang halimbawa.'
        }
    ],

    'g2_makabansa': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            video_id: 'CW7OF40NVb8',
            program: 'DepEd TV • Araling Panlipunan 2',
            title: 'Ang Aking Komunidad: Mga Bumubuo at Katangian Nito',
            description: 'Alamin ang iba\'t ibang bahagi ng komunidad tulad ng paaralan, simbahan, palengke, at sentrong pangkalusugan.'
        },
        {
            weeks: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: '4ZX3MWZnu78',
            program: 'DepEd TV • Araling Panlipunan 2',
            title: 'Tungkulin at Pananagutan sa Aking Komunidad',
            description: 'Panoorin kung paano makikipagtulungan ang bawat bata upang mapanatiling malinis at payapa ang komunidad.'
        }
    ],

    'g2_gmrc': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'btWGCwEnpu0',
            program: 'Knowledge Channel • Magandang Kaugalian',
            title: 'Mabuting Pag-uugali Bilang Kasapi ng Pamilya at Pamayanan',
            description: 'Mahahalagang aral sa paggalang sa nakatatanda, pagtulong sa mga gawaing-bahay, at pagmamalasakit.'
        }
    ],

    // ==========================================
    // GRADE 3
    // ==========================================
    'science': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8],
            video_id: 'goZ2JGhWKxs',
            program: 'Puno ng Buhay • Knowledge Channel',
            title: 'Mga Bagay na May Buhay (Living Things): Halaman at Hayop',
            description: 'Samahan si Kuya Bodjie sa Puno ng Buhay upang tuklasin ang kahanga-hangang daigdig ng mga halaman at hayop sa paligid!'
        },
        {
            weeks: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            video_id: 'QmQvdUaH7hE',
            program: 'Science Says • Knowledge Channel',
            title: 'Mga Katangian ng Solid, Liquid, at Gas (Matter)',
            description: 'Panoorin ang mga kapana-panabik na eksperimento na nagpapakita ng iba\'t ibang katangian ng Matter sa ating paligid.'
        },
        {
            weeks: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'FQifethQPWw',
            program: 'AgriKids • Knowledge Channel',
            title: 'Siklo ng Buhay ng mga Bagay at Pangangalaga sa Kapaligiran',
            description: 'Matutunan ang wastong pangangalaga sa kalikasan, anyong lupa, anyong tubig, at ang siklo ng buhay.'
        }
    ],

    'math': [
        {
            weeks: [1, 2, 3, 4, 5, 6],
            video_id: 'LsB2FNq8ynU',
            program: 'MathDali • Knowledge Channel',
            title: 'Addition at Subtraction ng Malalaking Bilang',
            description: 'Hasain ang kasanayan sa pagkuha ng sum at difference nang mabilis at wasto kasama si Kuya Icko!'
        },
        {
            weeks: [7, 8, 9, 10, 11, 12, 13, 14, 15],
            video_id: 'eH90hePDsNQ',
            program: 'MathDali • Knowledge Channel',
            title: 'Multiplication: Pagpaparami ng Bilang gamit ang MathDali Tricks',
            description: 'Kabisaduhin ang multiplication tables 2 hanggang 10 gamit ang mga madaling paraan at patterns.'
        },
        {
            weeks: [16, 17, 18, 19, 20, 21, 22, 23, 24],
            video_id: 'Np2H_t7ycTo',
            program: 'MathDali • Knowledge Channel',
            title: 'Division: Paghahati-hati ng mga Bilang nang May Kasiyahan',
            description: 'Alamin kung paano hahatiin ang mga grupo ng bilang nang pantay-pantay at walang kahirap-hirap!'
        },
        {
            weeks: [25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'Cd6D36hIErU',
            program: 'MathDali • Knowledge Channel',
            title: 'Fractions at Sukat ng Oras, Haba at Timbang',
            description: 'Tuklasin ang kalahati (1/2), sangkapat (1/4), at wastong pagsukat ng oras at timbang sa totoong buhay.'
        }
    ],

    'filipino': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8],
            video_id: 'Elu7aU8pldQ',
            program: 'Wikaharian • Knowledge Channel',
            title: 'Pangngalan: Pantangi at Pambalana sa Pangungusap',
            description: 'Matutunan ang wastong gamit ng malaking titik sa mga tiyak na ngalan at maliliit na titik sa karaniwang ngalan.'
        },
        {
            weeks: [9, 10, 11, 12, 13, 14, 15, 16],
            video_id: 'DPvlf6fEgms',
            program: 'Wikaharian • Knowledge Channel',
            title: 'Pandiwa: Mga Salitang Nagsasaad ng Kilos o Galaw',
            description: 'Tukuyin ang mga salitang kilos sa aspektong naganap, nagaganap, at magaganap pa lamang.'
        },
        {
            weeks: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'iWJLqtWsq3M',
            program: 'Wikaharian • Knowledge Channel',
            title: 'Pag-unawa sa Binasang Kuwento at Pagbibigay ng Wakas',
            description: 'Sanayin ang mapanuring pag-iisip sa pamamagitan ng pagbibigay ng sariling wakas sa mga aral sa kuwento.'
        }
    ],

    'english': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8],
            video_id: 'Riz6ma4xUsk',
            program: 'Ready, Set, Read! • Knowledge Channel',
            title: 'Nouns, Rhymes, and Word Families',
            description: 'Identify common and proper nouns, rhyming patterns, and expand your English vocabulary with fun examples!'
        },
        {
            weeks: [9, 10, 11, 12, 13, 14, 15, 16],
            video_id: 'aW5DbX6dy2M',
            program: 'Ready, Set, Read! • Knowledge Channel',
            title: 'Action Words (Verbs) and Complete Sentences',
            description: 'Discover how verbs bring sentences to life and practice forming complete, meaningful thoughts.'
        },
        {
            weeks: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: '_9sgbXvXt6s',
            program: 'Ready, Set, Read! • Knowledge Channel',
            title: 'Reading Comprehension and Story Elements',
            description: 'Learn the parts of a story: characters, setting, problem, and solution with interactive guides.'
        }
    ],

    'makabansa': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            video_id: '4ZX3MWZnu78',
            program: 'DepEd TV • Araling Panlipunan 3',
            title: 'Mga Anyong Lupa at Anyong Tubig sa Ating Lalawigan at Rehiyon',
            description: 'Tuklasin ang magagandang bundok, burol, ilog, at dagat na nagpapataba at nagpapayaman sa ating komunidad.'
        },
        {
            weeks: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'CW7OF40NVb8',
            program: 'Knowledge Channel • Wow Lalawigan',
            title: 'Kultura, Tradisyon, at Sagisag ng Ating Rehiyon',
            description: 'Ipagmalaki ang sariling kultura, mga pagdiriwang, at bayaning nagmula sa ating kinabibilangang rehiyon.'
        }
    ],

    'gmrc': [
        {
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            video_id: 'btWGCwEnpu0',
            program: 'Ugaling Pilipino • Knowledge Channel',
            title: 'Katapatan, Disiplina, at Pagmamalasakit sa Kapwa',
            description: 'Mahahalagang birtud at pagpapahalaga na nagpapakita ng tunay na pagiging mabuting batang Pilipino.'
        }
    ]
};

function getVideoForLesson(subjectId, weekNumber) {
    const list = videoLibrary[subjectId];
    if (!list || list.length === 0) {
        // Fallback default Tagalog educational video
        return {
            video_id: '24Oym-0Gg5Y',
            program: 'Knowledge Channel TV',
            title: 'Masayang Pag-aaral sa San Vicente Learning Hub',
            description: 'Panoorin ang opisyal na video lesson mula sa Knowledge Channel TV upang mas maunawaan ang aralin!',
            thumbnail: 'https://img.youtube.com/vi/24Oym-0Gg5Y/hqdefault.jpg'
        };
    }

    const matched = list.find(v => v.weeks && v.weeks.includes(Number(weekNumber)));
    const picked = matched || list[0];
    return {
        ...picked,
        thumbnail: `https://img.youtube.com/vi/${picked.video_id}/hqdefault.jpg`
    };
}

module.exports = {
    videoLibrary,
    getVideoForLesson
};
