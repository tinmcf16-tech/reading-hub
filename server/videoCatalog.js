// Comprehensive Aligned Educational Video Catalog
// Curated Knowledge Channel TV, Sineskwela, MathDali, Wikaharian, and DepEd TV Educational Programming
// Strictly aligned to DepEd Budget of Work (BOW) competencies for Grades 1, 2, and 3.

const topicVideoMatchers = [
    // --- SCIENCE (Grade 3) ---
    {
        subjectKey: 'science',
        keywords: ['solid', 'matigas', 'hugis', 'properties of solid', 'katangian ng solid'],
        video_id: 'K7ldxzJ699o',
        program: 'DepEd TV • Grade 3 Science',
        title: 'Mga Katangian ng Solid Materials (Properties of Solids)',
        description: 'Tuklasin ang iba\'t ibang katangian ng solid tulad ng kulay, hugis, sukat, at tigas sa tulong ng DepEd TV Science!'
    },
    {
        subjectKey: 'science',
        keywords: ['liquid', 'fluidity', 'container', 'dumaloy', 'katangian ng liquid', 'viscosity'],
        video_id: 'kYJ5tL3J-b0',
        program: 'Sineskwela • Science Education',
        title: 'Mga Katangian ng Liquid (Properties of Liquids)',
        description: 'Panoorin sa Sineskwela kung bakit ang liquid ay walang sariling hugis, sumusunod sa lalagyan, at dumadaloy nang may iba\'t ibang lapot!'
    },
    {
        subjectKey: 'science',
        keywords: ['gas', 'hangin', 'air', 'diffusion', 'presence', 'katangian ng gas'],
        video_id: 'w1NL5WAxmCs',
        program: 'Sineskwela • Science Education',
        title: 'Katangian ng Gas at Hangin (Properties of Gases)',
        description: 'Alamin kung paano kumikilos ang mga molecules ng gas at kung bakit mahalaga ang hangin sa ating paligid kasama si Anatom!'
    },
    {
        subjectKey: 'science',
        keywords: ['melt', 'evaporat', 'condens', 'freeze', 'change', 'temperature', 'init', 'lamig', 'pagbabago sa matter'],
        video_id: 'QmQvdUaH7hE',
        program: 'Science Says • Knowledge Channel',
        title: 'Mga Pagbabago sa Anyo ng Matter (Changes in Matter)',
        description: 'Subaybayan ang mga kamangha-manghang eksperimento sa epekto ng init at lamig sa solid, liquid, at gas!'
    },
    {
        subjectKey: 'science',
        keywords: ['sense', 'paningin', 'pandinig', 'pang-amoy', 'panlasa', 'pandama', 'eye', 'ear', 'nose', 'tongue', 'skin'],
        video_id: '3ZcOUBMqD1E',
        program: 'Sineskwela • Knowledge Channel',
        title: 'The Sense Organs: Ang Limang Pandama ng Katawan',
        description: 'Kilalanin ang mata, tainga, ilong, dila, at balat at ang kanilang mahalagang papel sa pagtanggap ng impormasyon sa paligid.'
    },
    {
        subjectKey: 'science',
        keywords: ['living', 'halaman', 'hayop', 'plant', 'animal', 'may buhay', 'organism'],
        video_id: 'goZ2JGhWKxs',
        program: 'Puno ng Buhay • Knowledge Channel',
        title: 'Mga Bagay na May Buhay: Halaman at Hayop (Living Things)',
        description: 'Samahan si Kuya Bodjie sa Puno ng Buhay upang alamin ang mga katangian, pangangailangan, at bahagi ng halaman at hayop!'
    },
    {
        subjectKey: 'science',
        keywords: ['habitat', 'environment', 'kapaligiran', 'ecosystem', 'tahanan ng hayop', 'pangangalaga'],
        video_id: 'FQifethQPWw',
        program: 'AgriKids • Knowledge Channel',
        title: 'Pangangalaga sa Kapaligiran at Tirahan ng mga May Buhay',
        description: 'Matutunan ang kahalagahan ng malinis na hangin, lupa, at tubig para sa kalusugan ng lahat ng may buhay.'
    },
    {
        subjectKey: 'science',
        keywords: ['motion', 'force', 'push', 'pull', 'galaw', 'puwersa', 'gravity', 'magnet'],
        video_id: '4ZX3MWZnu78',
        program: 'DepEd TV • Grade 3 Science',
        title: 'Puwersa at Paggalaw ng mga Bagay (Force and Motion)',
        description: 'Alamin kung paano pinagagalaw ng tulak (push) at hila (pull) ang iba\'t ibang bagay sa ating paligid.'
    },
    {
        subjectKey: 'science',
        keywords: ['weather', 'sun', 'earth', 'panahon', 'araw', 'kalawakan', 'clouds', 'ulan'],
        video_id: 'QmQvdUaH7hE',
        program: 'Science Says • Knowledge Channel',
        title: 'Ang Panahon at ang Araw sa Ating Mundo',
        description: 'Tuklasin ang iba\'t ibang uri ng panahon at ang kahalagahan ng init at liwanag ng araw sa daigdig.'
    },

    // --- MATHEMATICS (Grades 1, 2, 3) ---
    {
        subjectKey: 'math',
        keywords: ['shape', '2-dimensional', 'triangle', 'rectangle', 'square', 'circle', 'hugis', 'composite'],
        video_id: 'jlY8hXdTiKI',
        program: 'DepEd TV • Elementary Mathematics',
        title: 'Mga Hugis: 2-Dimensional at 3-Dimensional Shapes',
        description: 'Alamin ang katangian ng tatsulok, parihaba, parisukat, at bilog kasama ang kanilang mga sulok at gilid!'
    },
    {
        subjectKey: 'math',
        keywords: ['count up to 100', 'bilang 1-100', 'numerals up to 100', '1 more', '1 less', 'labis ng isa'],
        video_id: 'eUUV2gxitos',
        program: 'DepEd TV • Grade 1 Mathematics',
        title: 'Pagbilang at Pagsulat ng mga Bilang 1 hanggang 100',
        description: 'Mabilis at masayang pagbilang pasulong, paatras, at pagtukoy sa labis ng isa o kulang ng isa sa mga numero!'
    },
    {
        subjectKey: 'math',
        keywords: ['regrouping', 'expanded form', 'addition with regrouping', 'pagpapangkat', 'may regrouping'],
        video_id: 'IEKug13c8H8',
        program: 'MathDali • Knowledge Channel',
        title: 'Addition with Regrouping (Pagdaragdag na may Pagpapangkat)',
        description: 'Kasama si Kuya Icko sa MathDali, tuklasin ang madaling paraan ng pagpapangkat sa ones at tens kapag lumampas sa 9!'
    },
    {
        subjectKey: 'math',
        keywords: ['addition', 'sum', 'putting together', 'counting up', 'dagdag', 'plus', 'kabuuan'],
        video_id: 'LsB2FNq8ynU',
        program: 'MathDali • Knowledge Channel',
        title: 'Addition (Part 1): Pagsasama-sama ng mga Bilang',
        description: 'Matutong kumuha ng tamang sum gamit ang mga blocks, number line, at mental math techniques ni Kuya Icko.'
    },
    {
        subjectKey: 'math',
        keywords: ['subtraction', 'difference', 'bawas', 'minus', 'take away', 'pagbabawas'],
        video_id: 'pbF7mDbll94',
        program: 'MathDali • Knowledge Channel',
        title: 'Subtraction: Mabilis at Wastong Pagbabawas ng Bilang',
        description: 'Tuklasin kung paano mabilis magbawas at kumuha ng difference kahit may panghihiram o regrouping!'
    },
    {
        subjectKey: 'math',
        keywords: ['multiplication', 'repeated addition', 'array', 'multiples', 'multiply', 'times', 'pagpaparami'],
        video_id: 'eH90hePDsNQ',
        program: 'MathDali • Knowledge Channel',
        title: 'Multiplication: Paulit-ulit na Pagdaragdag at Arrays',
        description: 'Kabisaduhin ang multiplication tables 2 hanggang 10 gamit ang masayang patterns at awitin sa MathDali!'
    },
    {
        subjectKey: 'math',
        keywords: ['division', 'equal sharing', 'divide', 'hati', 'paghahati', 'equal groups'],
        video_id: 'Np2H_t7ycTo',
        program: 'MathDali • Knowledge Channel',
        title: 'Division: Pantay na Paghahati-hati ng mga Bilang',
        description: 'Alamin ang division bilang kabaligtaran ng multiplication at pantay na pamamahagi sa bawat grupo!'
    },
    {
        subjectKey: 'math',
        keywords: ['fraction', 'unit fraction', 'similar fraction', 'kalahati', 'sangkapat', 'numerator', 'denominator'],
        video_id: 'Cd6D36hIErU',
        program: 'MathDali • Knowledge Channel',
        title: 'Fractions: Pagkilala sa Kalahati (1/2), Sangkapat (1/4) at Similar Fractions',
        description: 'Matutong magbasa, magsulat, at maghambing ng mga fractions gamit ang mga pizza, keyk, at fraction bars!'
    },
    {
        subjectKey: 'math',
        keywords: ['money', 'peso', 'barya', 'salapi', 'pera', 'coins', 'bills'],
        video_id: 'Cd6D36hIErU',
        program: 'MathDali • Knowledge Channel',
        title: 'Philippine Currency: Barya at Salaping Papel hanggang ₱1000',
        description: 'Kilalanin ang halaga ng bawat barya at perang papel ng Pilipinas at paano magkuwenta ng sukli!'
    },
    {
        subjectKey: 'math',
        keywords: ['time', 'clock', 'hour', 'minute', 'oras', 'calendar', 'elapsed time'],
        video_id: 'Cd6D36hIErU',
        program: 'MathDali • Knowledge Channel',
        title: 'Pagsasabi at Pagsusulat ng Oras sa Analog at Digital Clock',
        description: 'Matutong magbasa ng orasan sa oras at minuto (a.m. at p.m.) at magbilang ng lumipas na oras!'
    },
    {
        subjectKey: 'math',
        keywords: ['perimeter', 'length', 'meter', 'centimeter', 'haba', 'sukat'],
        video_id: 'Cd6D36hIErU',
        program: 'MathDali • Knowledge Channel',
        title: 'Pagsukat ng Haba at Pagkuha ng Perimeter',
        description: 'Alamin kung paano kukunin ang kabuuang sukat sa paligid ng mga hugis tulad ng tatsulok at parihaba.'
    },

    // --- READING & LITERACY / FILIPINO / LANGUAGE ---
    {
        subjectKey: 'filipino_reading',
        keywords: ['titik', 'tunog', 'marungko', 'letra', 'tunog ng letra', 'alpabeto'],
        video_id: 'v52tC8Qr4oI',
        program: 'Wikaharian • Marungko Approach',
        title: 'Titik S, M, A, I: Pagkilala at Tunog ng mga Letra',
        description: 'Sama-sama tayong matuto sa pagbigkas ng tamang tunog ng mga letra gamit ang Marungko Approach kasama si Teacher Michelle!'
    },
    {
        subjectKey: 'filipino_reading',
        keywords: ['pantig', 'pagsasama ng tunog', 'blending', 'salita', 'pagbuo ng pantig'],
        video_id: 'VaLG5IfSTQo',
        program: 'Wikaharian • Musikantahan',
        title: 'Pagsasama ng mga Tunog at Pagbuo ng Pantig (B, E, T, U, K)',
        description: 'Panoorin kung paano pagsasamahin ang mga tunog ng letra upang makabuo ng mga unang pantig at madaling salita.'
    },
    {
        subjectKey: 'filipino_reading',
        keywords: ['pangngalan', 'pantangi', 'pambalana', 'ngalan ng tao', 'noun'],
        video_id: 'Elu7aU8pldQ',
        program: 'Wikaharian • Knowledge Channel',
        title: 'Pangngalang Pantangi at Pangngalang Pambalana',
        description: 'Alamin ang pagkakaiba ng tanging ngalan (pantangi) at karaniwang ngalan (pambalana) kasama ang mga tauhan ng Wikaharian!'
    },
    {
        subjectKey: 'filipino_reading',
        keywords: ['pandiwa', 'kilos', 'verb', 'aksyon', 'salitang kilos'],
        video_id: 'DPvlf6fEgms',
        program: 'Wikaharian • Bahagi ng Pananalita',
        title: 'Salitang Kilos (Pandiwa) at Wastong Paggamit sa Pangungusap',
        description: 'Tuklasin ang mga salitang nagpapahayag ng galaw at kilos sa iba\'t ibang aspekto ng panahon.'
    },
    {
        subjectKey: 'filipino_reading',
        keywords: ['pang-uri', 'naglalarawan', 'adjective', 'katangian', 'anyo', 'kulay'],
        video_id: 'DPvlf6fEgms',
        program: 'Wikaharian • Bahagi ng Pananalita',
        title: 'Salitang Naglalarawan (Pang-uri) sa Tao, Bagay, at Lugar',
        description: 'Matutong gumamit ng mga salitang naglalarawan ng kulay, laki, hugis, at bilang upang maging makulay ang pananalita.'
    },
    {
        subjectKey: 'filipino_reading',
        keywords: ['kuwento', 'pag-unawa', 'detalye', 'comprehension', 'tauhan', 'tagpuan', 'banghay'],
        video_id: 'iWJLqtWsq3M',
        program: 'Wikaharian • Mga Kuwento ng Wikaharian',
        title: 'Pagbasa ng Kuwento: Sampung Magkakaibigan at Pag-unawa',
        description: 'Makinig at magbasa sa masayang kuwento upang mas mapalawak ang kasanayan sa pagsagot sa Sino, Ano, Saan, at Bakit.'
    },
    {
        subjectKey: 'filipino_reading',
        keywords: ['magagalang', 'pagbati', 'po at opo', 'pakikipag-usap', 'sarili'],
        video_id: '24Oym-0Gg5Y',
        program: 'Wikaharian • Pakikipagkapwa',
        title: 'Pagpapahayag ng Sarili at Magagalang na Pananalita',
        description: 'Alamin kung paano gamitin ang mga magagalang na pagbati at salita sa pakikipag-usap sa kapwa at nakatatanda.'
    },

    // --- ENGLISH ---
    {
        subjectKey: 'english',
        keywords: ['rhyme', 'rhyming', 'sound', 'phonics', 'word family', 'vowel'],
        video_id: 'Riz6ma4xUsk',
        program: 'Ready, Set, Read! • Knowledge Channel',
        title: 'Rhyming Words, Phonics, and Short Vowel Sounds',
        description: 'Learn fun English rhyming words, word families, and short vowel sounds with catchy songs and stories!'
    },
    {
        subjectKey: 'english',
        keywords: ['polite', 'greeting', 'expression', 'simple sentence', 'speaking'],
        video_id: 'aW5DbX6dy2M',
        program: 'Ready, Set, Read! • Knowledge Channel',
        title: 'Polite Expressions and Building Simple Sentences',
        description: 'Practice everyday polite greetings and constructing simple sentences to express thoughts clearly in English.'
    },
    {
        subjectKey: 'english',
        keywords: ['noun', 'naming word', 'person', 'place', 'thing', 'plural', 'singular'],
        video_id: 'Riz6ma4xUsk',
        program: 'Ready, Set, Read! • Knowledge Channel',
        title: 'Naming Words (Nouns) and High-Frequency Words',
        description: 'Discover how to identify persons, places, animals, and things, and master common high-frequency sight words.'
    },
    {
        subjectKey: 'english',
        keywords: ['verb', 'action word', 'doing word', 'tenses', 'present', 'past'],
        video_id: 'aW5DbX6dy2M',
        program: 'Ready, Set, Read! • Knowledge Channel',
        title: 'Action Words (Verbs) and Sentence Formation',
        description: 'Spot action words in stories and write complete sentences showing what people and animals do every day.'
    },
    {
        subjectKey: 'english',
        keywords: ['story', 'character', 'setting', 'plot', 'comprehension', 'retell'],
        video_id: 'aW5DbX6dy2M',
        program: 'Ready, Set, Read! • Knowledge Channel',
        title: 'Reading Short Stories: Characters, Setting, and Main Idea',
        description: 'Read exciting tales, identify key story elements, and answer who, what, where, when, and why questions.'
    },

    // --- MAKABANSA ---
    {
        subjectKey: 'makabansa',
        keywords: ['sarili', 'pamilya', 'tahanan', 'mag-anak', 'tungkulin sa pamilya'],
        video_id: '24Oym-0Gg5Y',
        program: 'Knowledge Channel • Araling Panlipunan',
        title: 'Ang Aking Pamilya at Tahanan sa Pamayanan',
        description: 'Panoorin ang kahalagahan ng bawat miyembro ng pamilya at ang kanilang tungkulin sa pagpapanatili ng masayang tahanan.'
    },
    {
        subjectKey: 'makabansa',
        keywords: ['anyong lupa', 'anyong tubig', 'bundok', 'ilog', 'dagat', 'heograpiya', 'bulkan'],
        video_id: '4ZX3MWZnu78',
        program: 'DepEd TV • Araling Panlipunan',
        title: 'Mga Anyong Lupa at Anyong Tubig sa Ating Lalawigan at Rehiyon',
        description: 'Tuklasin ang magagandang bundok, burol, ilog, at dagat na nagpapayaman sa ating komunidad at bansa.'
    },
    {
        subjectKey: 'makabansa',
        keywords: ['komunidad', 'bumubuo', 'institusyon', 'paaralan', 'barangay', 'palatandaan', 'mapa'],
        video_id: 'CW7OF40NVb8',
        program: 'DepEd TV • Wow Komunidad',
        title: 'Ang Aking Komunidad: Mga Bumubuo at Katangian Nito',
        description: 'Alamin ang iba\'t ibang bahagi ng komunidad tulad ng paaralan, simbahan, sentrong pangkalusugan, at barangay hall.'
    },
    {
        subjectKey: 'makabansa',
        keywords: ['kultura', 'tradisyon', 'pista', 'sining', 'sagisag', 'bayani', 'lalawigan'],
        video_id: 'CW7OF40NVb8',
        program: 'Knowledge Channel • Wow Lalawigan',
        title: 'Kultura, Tradisyon, at Sagisag ng Ating Rehiyon',
        description: 'Ipagmalaki ang sariling kultura, mga pagdiriwang, sining, at bayaning nagmula sa ating kinabibilangang lalawigan.'
    },

    // --- GMRC ---
    {
        subjectKey: 'gmrc',
        keywords: ['magalang', 'po at opo', 'pagbati', 'respeto', 'nakatatanda'],
        video_id: 'DPvlf6fEgms',
        program: 'Knowledge Channel • Magandang Asal',
        title: 'Magagalang na Pananalita at Paggalang sa Nakatatanda',
        description: 'Matutunan ang paggamit ng "po", "opo", "salamat po", at pagpapakita ng tunay na paggalang sa kapwa.'
    },
    {
        subjectKey: 'gmrc',
        keywords: ['tapat', 'katapatan', 'honesty', 'pagsasabi ng totoo'],
        video_id: 'btWGCwEnpu0',
        program: 'Ugaling Pilipino • Knowledge Channel',
        title: 'Katapatan sa Lahat ng Oras: Ang Batang Matapat',
        description: 'Mahalagang aral ukol sa pagsasabi ng totoo, pagsasauli ng napulot na gamit, at pagiging mapagkakatiwalaan.'
    },
    {
        subjectKey: 'gmrc',
        keywords: ['tulong', 'pagtutulungan', 'pagmamalasakit', 'kapwa', 'bayanihan'],
        video_id: 'btWGCwEnpu0',
        program: 'Ugaling Pilipino • Knowledge Channel',
        title: 'Pagmamalasakit, Pagbabahagi, at Pagtutulungan sa Kapwa',
        description: 'Panoorin kung paano nagdudulot ng kapayapaan at ligaya ang kusang-loob na pagtulong sa mga nangangailangan.'
    },
    {
        subjectKey: 'gmrc',
        keywords: ['kalinisan', 'disiplina', 'masunurin', 'alituntunin', 'kaayusan'],
        video_id: 'DPvlf6fEgms',
        program: 'Knowledge Channel • Magandang Asal',
        title: 'Disiplina sa Sarili at Pangangalaga sa Kapaligiran',
        description: 'Wastong pagsunod sa mga alituntunin sa tahanan, paaralan, at komunidad upang mapanatili ang kaayusan.'
    }
];

function getVideoForLesson(subjectId, weekNumber, termId = 1, competencyText = '', title = '', strand = '') {
    const combinedSearchText = `${competencyText} ${title} ${strand}`.toLowerCase();
    const cleanSub = String(subjectId).toLowerCase();

    // Map subject to broad category
    let category = 'other';
    if (cleanSub.includes('science')) category = 'science';
    else if (cleanSub.includes('math')) category = 'math';
    else if (cleanSub.includes('english')) category = 'english';
    else if (cleanSub.includes('reading') || cleanSub.includes('filipino') || cleanSub.includes('language')) category = 'filipino_reading';
    else if (cleanSub.includes('makabansa')) category = 'makabansa';
    else if (cleanSub.includes('gmrc')) category = 'gmrc';

    // 1. First priority: Find specific topic matcher within the same category
    for (const matcher of topicVideoMatchers) {
        if (matcher.subjectKey === category) {
            const hasKeyword = matcher.keywords.some(kw => combinedSearchText.includes(kw));
            if (hasKeyword) {
                return {
                    video_id: matcher.video_id,
                    program: matcher.program,
                    title: matcher.title,
                    description: matcher.description,
                    thumbnail: `https://img.youtube.com/vi/${matcher.video_id}/hqdefault.jpg`
                };
            }
        }
    }

    // 2. Second priority: If no keyword matched, pick the best baseline for that subject
    const fallbackByCategory = topicVideoMatchers.find(m => m.subjectKey === category);
    if (fallbackByCategory) {
        return {
            video_id: fallbackByCategory.video_id,
            program: fallbackByCategory.program,
            title: fallbackByCategory.title,
            description: fallbackByCategory.description,
            thumbnail: `https://img.youtube.com/vi/${fallbackByCategory.video_id}/hqdefault.jpg`
        };
    }

    // 3. Universal Fallback
    return {
        video_id: '24Oym-0Gg5Y',
        program: 'Knowledge Channel TV',
        title: 'Masayang Pag-aaral sa San Vicente Learning Hub',
        description: 'Panoorin ang opisyal na video lesson mula sa Knowledge Channel TV upang mas maunawaan ang aralin!',
        thumbnail: 'https://img.youtube.com/vi/24Oym-0Gg5Y/hqdefault.jpg'
    };
}

module.exports = {
    getVideoForLesson,
    topicVideoMatchers
};
