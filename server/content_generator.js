// Comprehensive Multi-Grade DepEd MATATAG Pedagogical Content Generator
// Generates concept-rich "Let's Learn" discussions, 5 substantive practice exercises,
// 5 interactive matching pairs, 1 challenge question, and 10 assessment questions.

function detectSubtopic(subjectKey, text) {
    const s = text.toLowerCase();
    
    if (subjectKey === 'science') {
        if (s.includes('solid') || s.includes('matigas') || s.includes('hardness')) return 'sci_solid';
        if (s.includes('liquid') || s.includes('fluid') || s.includes('dumaloy')) return 'sci_liquid';
        if (s.includes('gas') || s.includes('hangin') || s.includes('air')) return 'sci_gas';
        if (s.includes('melt') || s.includes('evaporat') || s.includes('freeze') || s.includes('temperature') || s.includes('init')) return 'sci_change';
        if (s.includes('sense') || s.includes('mata') || s.includes('tainga') || s.includes('ilong') || s.includes('dila') || s.includes('pandama') || s.includes('eye')) return 'sci_senses';
        if (s.includes('animal') || s.includes('hayop')) return 'sci_animals';
        if (s.includes('plant') || s.includes('halaman') || s.includes('dahon')) return 'sci_plants';
        if (s.includes('motion') || s.includes('force') || s.includes('push') || s.includes('pull') || s.includes('galaw')) return 'sci_force';
        if (s.includes('weather') || s.includes('panahon') || s.includes('sun') || s.includes('araw') || s.includes('ulan')) return 'sci_weather';
        return 'sci_living';
    }

    if (subjectKey === 'math') {
        if (s.includes('shape') || s.includes('triangle') || s.includes('rectangle') || s.includes('square') || s.includes('circle') || s.includes('hugis')) return 'math_shapes';
        if (s.includes('multiplication') || s.includes('multiply') || s.includes('repeated addition') || s.includes('array') || s.includes('multiples')) return 'math_multiplication';
        if (s.includes('division') || s.includes('divide') || s.includes('equal sharing') || s.includes('paghahati')) return 'math_division';
        if (s.includes('fraction') || s.includes('unit fraction') || s.includes('kalahati') || s.includes('sangkapat')) return 'math_fractions';
        if (s.includes('subtraction') || s.includes('subtract') || s.includes('difference') || s.includes('bawas')) return 'math_subtraction';
        if (s.includes('money') || s.includes('peso') || s.includes('barya') || s.includes('pera') || s.includes('coin') || s.includes('bill')) return 'math_money';
        if (s.includes('time') || s.includes('clock') || s.includes('hour') || s.includes('minute') || s.includes('oras') || s.includes('calendar')) return 'math_time';
        if (s.includes('length') || s.includes('meter') || s.includes('centimeter') || s.includes('perimeter') || s.includes('haba')) return 'math_measurement';
        if (s.includes('regrouping') || s.includes('addition') || s.includes('sum') || s.includes('dagdag') || s.includes('putting together')) return 'math_addition';
        return 'math_place_value';
    }

    if (subjectKey === 'filipino_reading') {
        if (s.includes('titik') || s.includes('tunog') || s.includes('marungko') || s.includes('letra') || s.includes('alpabeto')) return 'fil_letters';
        if (s.includes('pantig') || s.includes('blending') || s.includes('pagsasama ng tunog')) return 'fil_syllables';
        if (s.includes('pangngalan') || s.includes('pantangi') || s.includes('pambalana') || s.includes('ngalan')) return 'fil_nouns';
        if (s.includes('pandiwa') || s.includes('kilos') || s.includes('salitang kilos')) return 'fil_verbs';
        if (s.includes('pang-uri') || s.includes('naglalarawan') || s.includes('katangian') || s.includes('kulay')) return 'fil_adjectives';
        if (s.includes('kuwento') || s.includes('tauhan') || s.includes('tagpuan') || s.includes('banghay') || s.includes('pag-unawa')) return 'fil_comprehension';
        if (s.includes('magagalang') || s.includes('po at opo') || s.includes('pagbati') || s.includes('sarili')) return 'fil_polite';
        return 'fil_comprehension';
    }

    if (subjectKey === 'english') {
        if (s.includes('rhyme') || s.includes('rhyming') || s.includes('vowel') || s.includes('phonics')) return 'eng_phonics';
        if (s.includes('noun') || s.includes('naming word') || s.includes('singular') || s.includes('plural')) return 'eng_nouns';
        if (s.includes('verb') || s.includes('action word') || s.includes('tense')) return 'eng_verbs';
        if (s.includes('adjective') || s.includes('describing word')) return 'eng_adjectives';
        if (s.includes('sentence') || s.includes('punctuation') || s.includes('capital')) return 'eng_sentences';
        if (s.includes('story') || s.includes('character') || s.includes('setting') || s.includes('comprehension')) return 'eng_story';
        return 'eng_polite';
    }

    if (subjectKey === 'makabansa') {
        if (s.includes('sarili') || s.includes('pamilya') || s.includes('tahanan') || s.includes('mag-anak')) return 'maka_family';
        if (s.includes('anyong lupa') || s.includes('anyong tubig') || s.includes('bundok') || s.includes('ilog') || s.includes('dagat')) return 'maka_geography';
        if (s.includes('kultura') || s.includes('tradisyon') || s.includes('pista') || s.includes('sining') || s.includes('sagisag') || s.includes('bayani')) return 'maka_culture';
        if (s.includes('manggagawa') || s.includes('katulong') || s.includes('guro') || s.includes('doktor') || s.includes('pulis')) return 'maka_helpers';
        return 'maka_community';
    }

    if (subjectKey === 'gmrc') {
        if (s.includes('tapat') || s.includes('katapatan') || s.includes('honesty') || s.includes('totoo')) return 'gmrc_honesty';
        if (s.includes('tulong') || s.includes('pagtutulungan') || s.includes('pagmamalasakit') || s.includes('bayanihan')) return 'gmrc_help';
        if (s.includes('kalinisan') || s.includes('kalusugan') || s.includes('katawan') || s.includes('kapaligiran')) return 'gmrc_clean';
        if (s.includes('disiplina') || s.includes('masunurin') || s.includes('alituntunin') || s.includes('panuntunan')) return 'gmrc_discipline';
        return 'gmrc_respect';
    }

    return 'general';
}

function buildLessonAndActivities(topicKey, compText, weekNum, gradeLevel, subjectId = '', subjectName = '') {
    const isG1 = gradeLevel === 'Grade 1';
    const isG2 = gradeLevel === 'Grade 2';

    // ==========================================
    // 1. SCIENCE: SOLIDS
    // ==========================================
    if (topicKey === 'sci_solid') {
        const title = "Mga Katangian ng Solid Materials (Properties of Solids)";
        const explanation = `🌟 **Aralin sa Science: Mga Katangian ng Solid**

👋 **Maligayang Pagdating, Munting Siyentipiko!**
Sa linggong ito, ating tutuklasin ang isa sa pinakamahalagang anyo ng matter: ang mga **SOLID**!

📖 **1. Ano ang Solid? (Kahulugan)**
Ang **Solid** ay anyo ng matter na may sarili at tiyak na hugis, sukat, at bigat. Hindi ito madaling nagbabago ng anyo kahit ilipat sa iba't ibang lalagyan o lugar.

🔍 **2. Mahahalagang Katangian ng Solid (Observable Properties):**
• **Kulay:** May iba't ibang kulay tulad ng pula, asul, berde, at dilaw.
• **Hugis:** May tiyak na hugis tulad ng bilog, parisukat, o parihaba.
• **Tekstura:** Maaaring makinis (tulad ng mansanas o salamin) o magaspang (tulad ng hollow block o balat ng langka).
• **Tigas at Lambot:** May matitigas na solid (tulad ng bato at kahoy) at may malalambot (tulad ng espongha at bulak).
• **Flexibility:** Ang ilang solid ay nababaluktot tulad ng alambre, goma, o clay nang hindi nababasag.

💡 **3. Mga Halimbawa sa Paligid:**
• **Halimbawa 1 (Matigas na Solid):** Lamesa, upuan, hollow block, at bato.
• **Halimbawa 2 (Malambot na Solid):** Unan, espongha, bulak, at clay.
• **Halimbawa 3 (Flexible na Solid):** Rubber band at alambre.

🏆 **4. Tandaan Natin!**
✨ Ang solid ay may sariling tiyak na hugis.
✨ Hindi nagbabago ang sukat ng solid kapag inilipat sa ibang lalagyan.
✨ Maaari nating ilarawan ang solid gamit ang ating mga pandama (mata para sa kulay at hugis, kamay para sa tekstura at tigas).

🏡 **5. Pagsasabuhay sa Araw-araw:**
Sa ating silid-aralan at tahanan, ingatan natin ang ating mga kagamitang solid tulad ng lapis, aklat, at mesa upang magamit natin ang mga ito nang matagal!`;

        const practiceActivities = [
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'multiple_choice',
                title: 'Gawain 1: Katangian ng Solid', instructions: 'Piliin ang pinakawastong sagot batay sa katangian ng solid.',
                points: 10,
                question_data: {
                    question: 'Alin sa mga sumusunod ang pangunahing katangian ng isang solid?',
                    options: ['A) May tiyak na hugis at sariling sukat', 'B) Dumadaloy nang mabilis tulad ng tubig', 'C) Sumusunod sa hugis ng sisidlan', 'D) Walang sariling bigat at hindi nahahawakan']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'true_false',
                title: 'Gawain 2: Tama o Mali - Hugis ng Solid', instructions: 'Pindutin ang TAMA kung totoo ang pahayag, o MALI kung hindi.',
                points: 10,
                question_data: {
                    statement: 'Kapag inilipat mo ang isang pambura mula sa iyong bag papunta sa ibabaw ng mesa, magbabago ang hugis nito.'
                },
                correct_answers: { answer: 'false' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Gawain 3: Tekstura ng Solid', instructions: 'Tukuyin ang wastong tekstura ng bagay.',
                points: 10,
                question_data: {
                    question: 'Hinihipo ni Carlo ang balat ng langka at napansing hindi ito makinis. Anong katangian ng solid ang inilalarawan nito?',
                    options: ['A) Tekstura (magaspang)', 'B) Temperatura', 'C) Kakayahang dumaloy', 'D) Lasa']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Gawain 4: Pagkilala sa Solid', instructions: 'Piliin ang pangkat na puro solid lamang.',
                points: 10,
                question_data: {
                    question: 'Aling pangkat ng mga bagay ang PURO SOLID lamang?',
                    options: ['A) Lapis, aklat, at pambura', 'B) Gatas, toyo, at tubig', 'C) Usok, hangin, at ulap', 'D) Mantika, plato, at hangin']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'true_false',
                title: 'Gawain 5: Tama o Mali - Malambot na Solid', instructions: 'Pindutin ang TAMA kung totoo ang pahayag, o MALI kung hindi.',
                points: 10,
                question_data: {
                    statement: 'Ang espongha at bulak ay mga halimbawa pa rin ng solid kahit na ang mga ito ay malambot.'
                },
                correct_answers: { answer: 'true' }
            }
        ];

        const playPairs = [
            { left: 'Bato at Kahoy', right: 'Matigas na solid' },
            { left: 'Espongha at Bulak', right: 'Malambot na solid' },
            { left: 'Rubber Band', right: 'Nababaluktot (Flexible)' },
            { left: 'Salamin at Mansanas', right: 'Makinis ang tekstura' },
            { left: 'Balat ng Langka', right: 'Magaspang ang tekstura' }
        ];

        const challengeAct = {
            day_number: 4, section_type: 'challenge', difficulty: 'challenge', activity_type: 'multiple_choice',
            title: 'Hamon sa Pag-iisip: Pagsusuri sa Clay', instructions: 'Suriin ang sitwasyon at piliin ang pinakawastong paliwanag.',
            points: 15,
            question_data: {
                question: 'Kapag pinisil mo ang modelling clay, nagbago ang anyo nito mula sa bilog patungong parihaba. Maituturing pa rin ba itong solid?',
                options: [
                    'A) Oo, dahil nananatili pa rin itong may sariling anyo at hindi ito dumadaloy tulad ng tubig',
                    'B) Hindi, dahil naging liquid na ito nang mapisil',
                    'C) Hindi, dahil naging gas na ito sa hangin',
                    'D) Oo, dahil natutunaw ito tulad ng yelo'
                ]
            },
            correct_answers: { answer: 'A' }
        };

        const showKnowQuestions = [
            { id: 'q1', text: '1. Ano ang tawag sa anyo ng matter na may tiyak na hugis at sariling sukat?', options: ['A) Solid', 'B) Liquid', 'C) Gas', 'D) Hangin'] },
            { id: 'q2', text: '2. Alin sa mga sumusunod ang HINDI halimbawa ng solid?', options: ['A) Lapis', 'B) Sukat ng aklat', 'C) Tubig sa baso', 'D) Plato'] },
            { id: 'q3', text: '3. Kung ilalagay mo ang holen sa loob ng baso, ano ang mangyayari sa hugis ng holen?', options: ['A) Mananatiling bilog pa rin', 'B) Magiging hugis baso', 'C) Matutunaw agad', 'D) Mawawala ang hugis'] },
            { id: 'q4', text: '4. Anong pandama ang ginagamit upang madama kung ang solid ay makinis o magaspang?', options: ['A) Balat (Kamay)', 'B) Mata', 'C) Tainga', 'D) Ilong'] },
            { id: 'q5', text: '5. Aling solid ang may katangiang nababaluktot (flexible) nang hindi nababasag?', options: ['A) Alambre at goma', 'B) Bato', 'C) Salaming plato', 'D) Guwang na kahoy'] },
            { id: 'q6', text: '6. Alin sa mga sumusunod ang solid na may magaspang na tekstura?', options: ['A) Liha o hollow block', 'B) Salamin ng bintana', 'C) Makinis na papel', 'D) Porselanang tasa'] },
            { id: 'q7', text: '7. Bakit maituturing na solid ang unan kahit ito ay malambot?', options: ['A) Dahil may sarili pa rin itong hugis at espasyo', 'B) Dahil ito ay dumadaloy sa sahig', 'C) Dahil ito ay sumisingaw sa hangin', 'D) Dahil wala itong timbang'] },
            { id: 'q8', text: '8. Anong katangian ng solid ang ating inilalarawan kapag sinabi nating "pula ang mansanas"?', options: ['A) Kulay', 'B) Lasa', 'C) Sukat', 'D) Timbang'] },
            { id: 'q9', text: '9. Alin sa mga sumusunod ang tamang gawain sa pag-iingat sa mga kagamitang solid?', options: ['A) Ayusin at iligpit sa tamang lalagyan pagkatapos gamitin', 'B) Ihagis sa sahig', 'C) Basagin ang mga matitigas na bagay', 'D) Iwanan sa ulan'] },
            { id: 'q10', text: '10. Ano ang mangyayari sa dami (volume) ng solid kapag inilipat ito sa ibang puwesto?', options: ['A) Hindi magbabago ang dami o sukat nito', 'B) Dadami ito bigla', 'C) Mababawasan ito nang kusa', 'D) Maging liquid ito'] }
        ];
        const showKnowAnswers = { q1: 'A', q2: 'C', q3: 'A', q4: 'A', q5: 'A', q6: 'A', q7: 'A', q8: 'A', q9: 'A', q10: 'A' };

        return {
            title, explanation,
            story: 'Sa klase ni Teacher A, nagdala ang mga mag-aaral ng iba\'t ibang solid. Ipinakita ni Juan ang kanyang matigas na kahoy na ruler, habang ipinakita naman ni Maria ang malambot niyang pambura. Natuklasan nila na kahit magkaiba ang lambot at tigas, pareho itong may sariling hugis na hindi nagbabago.',
            examples: [
                { term: 'Tiyak na Anyo', detail: 'Hindi nagbabago ang hugis ng solid kapag inilipat ng lugar.' },
                { term: 'Tekstura', detail: 'Maaaring makinis, magaspang, matulis, o malambot.' },
                { term: 'Sukat at Timbang', detail: 'May sariling timbang at sumasakop sa espasyo.' }
            ],
            illustrations: ['🧱 Matigas na Bato', '✏️ Lapis at Pambura', '📦 Kahon ng Kagamitan'],
            practice: practiceActivities,
            play: playPairs,
            challenge: challengeAct,
            show_know: { questions: showKnowQuestions, answers: showKnowAnswers }
        };
    }

    // ==========================================
    // 2. SCIENCE: LIQUIDS
    // ==========================================
    if (topicKey === 'sci_liquid') {
        const title = "Mga Katangian ng Liquid (Properties of Liquids)";
        const explanation = `🌟 **Aralin sa Science: Mga Katangian ng Liquid**

👋 **Kumusta, Munting Mananaliksik!**
Ngayong linggo, ating sisisirin ang daigdig ng mga **LIQUID**!

📖 **1. Ano ang Liquid? (Kahulugan)**
Ang **Liquid** ay anyo ng matter na **walang sariling hugis**. Sumusunod ito sa hugis ng sisidlan o lalagyan na kinalalagyan nito. Ito ay may tiyak na dami (volume) at may kakayahang dumaloy.

🔍 **2. Mahahalagang Katangian ng Liquid:**
• **Walang Sariling Hugis:** Kapag ang tubig ay inilagay sa baso, hugis baso ito. Kapag inilipat sa bote, nagiging hugis bote ito!
• **Kakayahang Dumaloy (Fluidity):** Ang lahat ng liquid ay dumadaloy, ngunit may mabilis at may mabagal.
• **Lapot (Viscosity):** Ang tubig at alkohol ay malabnaw (mabilis dumaloy), habang ang mantika, toyo, shampoo, at pulot (honey) ay malapot (mabagal dumaloy).
• **Kulay, Amoy, at Lasa:** May liquid na walang kulay tulad ng tubig, at may may kulay tulad ng kape, gatas, at toyo.

💡 **3. Mga Halimbawa sa Tahanan:**
• **Mabilis Dumaloy:** Tubig, suka, at alkohol.
• **Mabagal Dumaloy (Malapot):** Shampoo, condensed milk, mantika, at pulot.

🏆 **4. Tandaan Natin!**
✨ Ang liquid ay sumusunod sa hugis ng lalagyan.
✨ Ang liquid ay may tiyak na volume ngunit walang sariling hugis.
✨ Mag-ingat sa mga liquid na may matapang na amoy o nakalalason tulad ng bleach o asido.

🏡 **5. Pagsasabuhay:**
Uminom ng 8 basong malinis na tubig araw-araw upang mapanatiling malakas at malusog ang ating katawan!`;

        const practiceActivities = [
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'multiple_choice',
                title: 'Gawain 1: Hugis ng Liquid', instructions: 'Piliin ang pinakawastong sagot.',
                points: 10,
                question_data: {
                    question: 'Ano ang mangyayari sa hugis ng tubig kapag ibinuhos ito mula sa pitsel papunta sa bilog na mangkok?',
                    options: ['A) Susunod ang tubig sa bilog na hugis ng mangkok', 'B) Mananatili itong hugis pitsel', 'C) Magiging hugis parisukat ito', 'D) Matutuyo agad ito']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'true_false',
                title: 'Gawain 2: Tama o Mali - Pagdaloy', instructions: 'Pindutin ang TAMA kung totoo, o MALI kung hindi.',
                points: 10,
                question_data: {
                    statement: 'Ang pulot (honey) at condensed milk ay mas mabagal dumaloy kaysa sa tubig dahil mas malapot ang mga ito.'
                },
                correct_answers: { answer: 'true' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Gawain 3: Pagkilala sa Liquid', instructions: 'Tukuyin ang bagay na liquid.',
                points: 10,
                question_data: {
                    question: 'Alin sa mga sumusunod ang halimbawa ng liquid na ginagamit sa pagluluto?',
                    options: ['A) Mantika', 'B) Kawali', 'C) Sandok', 'D) Kutsara']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Gawain 4: Katangian ng Tubig', instructions: 'Piliin ang katangian ng malinis na tubig.',
                points: 10,
                question_data: {
                    question: 'Ang malinis at maiinom na tubig ay karaniwang:',
                    options: ['A) Walang kulay at walang masamang amoy', 'B) Kulay itim at mabaho', 'C) Matigas at hindi dumadaloy', 'D) May bula at mapait']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'true_false',
                title: 'Gawain 5: Tama o Mali - Ligtas na Paggamit', instructions: 'Pindutin ang TAMA kung totoo, o MALI kung hindi.',
                points: 10,
                question_data: {
                    statement: 'Hindi natin dapat tikman o amuyin nang direkta ang mga hindi kilalang liquid sa bote tulad ng pampalinis ng banyo.'
                },
                correct_answers: { answer: 'true' }
            }
        ];

        const playPairs = [
            { left: 'Tubig sa Baso', right: 'Hugis ng baso ang anyo' },
            { left: 'Mantika at Shampoo', right: 'Mabagal dumaloy (Malapot)' },
            { left: 'Tubig at Alkohol', right: 'Mabilis dumaloy (Malabnaw)' },
            { left: 'Gatas at Kape', right: 'May kulay na liquid' },
            { left: 'Patak ng Ulan', right: 'Liquid mula sa ulap' }
        ];

        const challengeAct = {
            day_number: 4, section_type: 'challenge', difficulty: 'challenge', activity_type: 'multiple_choice',
            title: 'Hamon sa Pag-iisip: Pagsubok sa Daloy', instructions: 'Suriin ang sitwasyon at piliin ang tamang sagot.',
            points: 15,
            question_data: {
                question: 'Ibinuhos nang sabay ni Ana sa pahilig na salamin ang isang patak ng tubig at isang patak ng shampoo. Alin ang unang makararating sa ibaba at bakit?',
                options: [
                    'A) Ang tubig, dahil mas malabnaw ito at mas mabilis dumaloy kaysa sa shampoo',
                    'B) Ang shampoo, dahil mas mabigat ito kaysa sa tubig',
                    'C) Sabay silang makararating dahil parehong liquid',
                    'D) Wala sa dalawa dahil hihinto ang mga ito sa gitna'
                ]
            },
            correct_answers: { answer: 'A' }
        };

        const showKnowQuestions = [
            { id: 'q1', text: '1. Ano ang pangunahing katangian ng liquid tungkol sa hugis nito?', options: ['A) Sumusunod sa hugis ng lalagyan', 'B) May sariling matigas na hugis', 'C) Walang hugis kahit kailan', 'D) Hugis bilog palagi'] },
            { id: 'q2', text: '2. Alin sa mga sumusunod ang halimbawa ng liquid?', options: ['A) Gatas', 'B) Tinapay', 'C) Plato', 'D) Panyo'] },
            { id: 'q3', text: '3. Ano ang tawag sa katangian ng liquid na nagpapakita ng bilis o bagal ng pagdaloy?', options: ['A) Lapot (Viscosity)', 'B) Tigas', 'C) Haba', 'D) Timbang'] },
            { id: 'q4', text: '4. Aling liquid ang pinakamabilis dumaloy sa mga sumusunod?', options: ['A) Tubig', 'B) Shampoo', 'C) Condensed milk', 'D) Pulot (Honey)'] },
            { id: 'q5', text: '5. Kung may 100 mL na tubig sa tasa at inilipat ito sa bote, ano ang mangyayari sa dami ng tubig?', options: ['A) 100 mL pa rin ang dami', 'B) Magiging 200 mL', 'C) Mababawasan ito ng kusa', 'D) Magiging solid ito'] },
            { id: 'q6', text: '6. Alin sa mga sumusunod na liquid ang mapanganib at hindi dapat inumin?', options: ['A) Bleach / Zonrox', 'B) Katas ng dalandan', 'C) Sabaw ng baka', 'D) Tubig mula sa gripo'] },
            { id: 'q7', text: '7. Anong liquid ang ginagamit natin sa paglilinis ng mga kamay upang maiwasan ang mikrobyo?', options: ['A) Alkohol', 'B) Mantika', 'C) Toyo', 'D) Patis'] },
            { id: 'q8', text: '8. Paano mo ilalarawan ang toyo batay sa kulay at lasa nito?', options: ['A) Maitim at maalat', 'B) Maputi at matamis', 'C) Malinaw at maasim', 'D) Walang lasa'] },
            { id: 'q9', text: '9. Ano ang katangian na parehong taglay ng solid at liquid?', options: ['A) Pareho silang sumasakop ng espasyo at may timbang', 'B) Pareho silang may tiyak na hugis', 'C) Pareho silang dumadaloy', 'D) Pareho silang hindi nahahawakan'] },
            { id: 'q10', text: '10. Kapag natapon ang liquid sa patag na sahig, ano ang gagawin nito?', options: ['A) Kakalat at dadaloy ito sa mababang bahagi', 'B) Titindig ito na parang pader', 'C) Lilipad agad ito sa kisame', 'D) Magiging yelo agad'] }
        ];
        const showKnowAnswers = { q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A', q7: 'A', q8: 'A', q9: 'A', q10: 'A' };

        return {
            title, explanation,
            story: 'Nagluto si Nanay Rosa ng masarap na sopas. Ibinuhos ni Carlo ang gatas sa mangkok at napansin niyang agad naging hugis mangkok ang gatas. "Ganyan ang liquid, anak," paliwanag ni Nanay, "walang sariling hugis kaya laging sumusunod sa kanyang sisidlan!"',
            examples: [
                { term: 'Hugis Lalagyan', detail: 'Sumusunod sa anumang anyo ng baso, tasa, o bote.' },
                { term: 'Pagdaloy', detail: 'Kakayahang dumulas at lumipat mula sa mataas patungong mababa.' },
                { term: 'Lapot', detail: 'Pagkakaiba ng bilis ng daloy ng tubig kumpara sa mantika at shampoo.' }
            ],
            illustrations: ['🥛 Baso ng Gatas', '💧 Patak ng Tubig', '🍯 Pulot at Mantika'],
            practice: practiceActivities,
            play: playPairs,
            challenge: challengeAct,
            show_know: { questions: showKnowQuestions, answers: showKnowAnswers }
        };
    }

    // ==========================================
    // 3. MATHEMATICS: 2D/3D SHAPES
    // ==========================================
    if (topicKey === 'math_shapes') {
        const title = isG1 ? "2-Dimensional Shapes and Features" : "Geometric Shapes and Composite Figures";
        const explanation = `🌟 **Math Lesson: 2-Dimensional Shapes and Features**

👋 **Welcome Junior Mathematician!**
This week, we will discover the amazing world of **2-Dimensional (2D) Shapes** and their special features!

📖 **1. What is a 2-Dimensional Shape?**
A **2D Shape** is a flat figure that has length and width. It has flat sides and corners (vertices) where sides meet.

🔍 **2. The Four Primary 2D Shapes & Features:**
• **Triangle (Tatsulok):** Has **3 straight sides** and **3 corners**.
• **Square (Parisukat):** Has **4 equal straight sides** and **4 square corners**.
• **Rectangle (Parihaba):** Has **4 straight sides** (2 pairs of equal sides: 2 long, 2 short) and **4 corners**.
• **Circle (Bilog):** A round shape with **0 straight sides** and **0 corners**. It has a curved boundary.

💡 **3. Real-Life Examples:**
• **Triangle:** A slice of pizza, a traffic warning sign, or the roof of a nipa hut.
• **Square:** A floor tile, a chess board, or a saltine cracker.
• **Rectangle:** A classroom blackboard, a notebook, an envelope, or a cellphone screen.
• **Circle:** A 1-peso coin, a wall clock, or a bicycle wheel.

🏆 **4. Key Rules to Remember!**
✨ Count the sides (mga gilid) and corners (mga sulok) to identify the shape!
✨ A square has all 4 sides equal in length.
✨ A circle is curved with no corners.

🏡 **5. Real-World Application:**
Look around your classroom and home! How many shapes can you spot on doors, windows, and clock faces?`;

        const practiceActivities = [
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'multiple_choice',
                title: 'Practice 1: Triangle Identification', instructions: 'Select the correct number of sides and corners.',
                points: 10,
                question_data: {
                    question: 'How many sides and corners does a triangle have?',
                    options: ['A) 3 straight sides and 3 corners', 'B) 4 sides and 4 corners', 'C) 0 sides and 0 corners', 'D) 5 sides and 2 corners']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'true_false',
                title: 'Practice 2: Square Properties', instructions: 'Choose TRUE if the statement is correct, or FALSE if not.',
                points: 10,
                question_data: {
                    statement: 'All four sides of a square have the exact same length.'
                },
                correct_answers: { answer: 'true' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Practice 3: Circle Features', instructions: 'Identify the special feature of a circle.',
                points: 10,
                question_data: {
                    question: 'Which shape is round and has NO straight sides and NO corners?',
                    options: ['A) Circle', 'B) Square', 'C) Rectangle', 'D) Triangle']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Practice 4: Real-Life Shapes', instructions: 'Match the everyday object with its 2D shape.',
                points: 10,
                question_data: {
                    question: 'What 2D shape is best represented by a classroom door or notebook cover?',
                    options: ['A) Rectangle', 'B) Circle', 'C) Triangle', 'D) Pentagon']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'true_false',
                title: 'Practice 5: True or False - Composite Shapes', instructions: 'Choose TRUE or FALSE.',
                points: 10,
                question_data: {
                    statement: 'If you put two equal squares side by side, they will form a rectangle.'
                },
                correct_answers: { answer: 'true' }
            }
        ];

        const playPairs = [
            { left: 'Triangle', right: '3 sides and 3 corners' },
            { left: 'Square', right: '4 equal sides and 4 corners' },
            { left: 'Rectangle', right: '2 long sides and 2 short sides' },
            { left: 'Circle', right: 'Curved round boundary with 0 corners' },
            { left: 'One-Peso Coin', right: 'Circle-shaped object' }
        ];

        const challengeAct = {
            day_number: 4, section_type: 'challenge', difficulty: 'challenge', activity_type: 'multiple_choice',
            title: 'Challenge Me: Composing Shapes', instructions: 'Analyze the shape puzzle carefully.',
            points: 15,
            question_data: {
                question: 'Leo cut a square diagonally from one corner to the opposite corner. What two shapes did he create?',
                options: [
                    'A) Two triangles',
                    'B) Two smaller squares',
                    'C) Two circles',
                    'D) Two rectangles'
                ]
            },
            correct_answers: { answer: 'A' }
        };

        const showKnowQuestions = [
            { id: 'q1', text: '1. What geometric 2D shape has 3 sides and 3 corners?', options: ['A) Triangle', 'B) Square', 'C) Circle', 'D) Oval'] },
            { id: 'q2', text: '2. Which shape has 4 sides of equal length?', options: ['A) Square', 'B) Rectangle', 'C) Triangle', 'D) Circle'] },
            { id: 'q3', text: '3. How many corners does a circle have?', options: ['A) 0', 'B) 1', 'C) 2', 'D) 4'] },
            { id: 'q4', text: '4. A slice of pizza looks most like which 2D shape?', options: ['A) Triangle', 'B) Square', 'C) Rectangle', 'D) Hexagon'] },
            { id: 'q5', text: '5. Which shape has opposite sides that are equal in length (2 long and 2 short)?', options: ['A) Rectangle', 'B) Circle', 'C) Triangle', 'D) Square'] },
            { id: 'q6', text: '6. What do you call the point where two straight sides meet?', options: ['A) Corner (Vertex)', 'B) Line', 'C) Curve', 'D) Center'] },
            { id: 'q7', text: '7. How many sides does a rectangle have in total?', options: ['A) 4', 'B) 3', 'C) 5', 'D) 6'] },
            { id: 'q8', text: '8. If you trace the bottom of a drinking glass on a piece of paper, what shape will you get?', options: ['A) Circle', 'B) Square', 'C) Triangle', 'D) Diamond'] },
            { id: 'q9', text: '9. If you put two identical triangles together with matching bases, you can make a:', options: ['A) Square or diamond', 'B) Circle', 'C) Cylinder', 'D) Sphere'] },
            { id: 'q10', text: '10. Which statement is TRUE about 2D shapes?', options: ['A) 2D shapes are flat figures with length and width', 'B) 2D shapes can hold water inside', 'C) Triangles have 4 sides', 'D) Squares have unequal sides'] }
        ];
        const showKnowAnswers = { q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A', q7: 'A', q8: 'A', q9: 'A', q10: 'A' };

        return {
            title, explanation,
            story: 'In the art corner, Maya and Leo used colored cardboard shapes to build a dream house. Maya used a big red triangle for the roof, a sturdy yellow square for the main room, and two blue rectangles for the doors and windows. "Look!" Leo exclaimed, "everything around us is made of shapes!"',
            examples: [
                { term: 'Sides (Mga Gilid)', detail: 'The straight lines that form the outer boundary of a shape.' },
                { term: 'Corners (Mga Sulok)', detail: 'The points where two straight sides join together.' },
                { term: 'Decomposing Shapes', detail: 'Dividing a shape into smaller shapes, like cutting a square into triangles.' }
            ],
            illustrations: ['🔺 Bright Triangle', '🟦 Blue Square', '🟡 Yellow Circle'],
            practice: practiceActivities,
            play: playPairs,
            challenge: challengeAct,
            show_know: { questions: showKnowQuestions, answers: showKnowAnswers }
        };
    }

    // ==========================================
    // 4. MATHEMATICS: ADDITION & REGROUPING
    // ==========================================
    if (topicKey === 'math_addition') {
        const title = isG1 ? "Addition of Numbers (Putting Together and Counting Up)" : "Addition with Regrouping (Pagdaragdag na may Pagpapangkat)";
        const explanation = `🌟 **Math Magic: Addition and Regrouping**

👋 **Hello Math Explorer!**
This week, we master the superpower of **Addition** — combining groups and adding with regrouping!

📖 **1. What is Addition?**
Addition is putting two or more numbers together to find the total or **sum**.
• The numbers being added are called **addends**.
• The final answer is called the **sum** (kabuuan).

🔍 **2. Key Rules & Properties of Addition:**
• **Zero Property:** Any number plus zero equals that same number! (Example: 8 + 0 = 8)
• **Commutative Property:** You can switch the order of addends, and the sum stays the same! (Example: 5 + 3 = 8, and 3 + 5 = 8)
• **Regrouping (Pagpapangkat):** When the sum in the Ones column is 10 or more, we carry over 1 ten to the Tens column!

💡 **3. Step-by-Step Worked Examples:**
• **Example 1 (Basic Addition):** 7 + 6 = **13** (Count up from 7: 8, 9, 10, 11, 12, 13!)
• **Example 2 (2-Digit without Regrouping):** 24 + 13 = ?
  - Ones: 4 + 3 = 7
  - Tens: 2 + 1 = 3
  - Sum = **37**
• **Example 3 (Addition with Regrouping):** 38 + 25 = ?
  - Ones: 8 + 5 = 13 (Write 3 in Ones, carry 1 to Tens)
  - Tens: 1 (carried) + 3 + 2 = 6
  - Sum = **63**!

🏆 **4. Key Takeaways to Remember!**
✨ Always add the Ones place first, then the Tens place, then the Hundreds!
✨ If Ones reach 10 or more, carry 1 Ten to the next column.
✨ Check your work by adding backwards!

🏡 **5. Real-World Use:**
When shopping with your family, you add prices of bread and milk to know how much money you need!`;

        const practiceActivities = [
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'multiple_choice',
                title: 'Practice 1: Basic Addition', instructions: 'Solve the addition problem accurately.',
                points: 10,
                question_data: {
                    question: 'What is the sum of 8 + 7?',
                    options: ['A) 15', 'B) 14', 'C) 16', 'D) 13']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'true_false',
                title: 'Practice 2: Zero Property of Addition', instructions: 'Choose TRUE or FALSE.',
                points: 10,
                question_data: {
                    statement: 'According to the zero property, 45 + 0 is still equal to 45.'
                },
                correct_answers: { answer: 'true' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Practice 3: Addition with Regrouping', instructions: 'Add the two numbers carefully.',
                points: 10,
                question_data: {
                    question: 'Calculate: 26 + 18 = ?',
                    options: ['A) 44', 'B) 34', 'C) 42', 'D) 46']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Practice 4: Word Problem', instructions: 'Solve the word problem.',
                points: 10,
                question_data: {
                    question: 'Ella picked 15 ripe mangoes and Ben picked 25 ripe mangoes. How many mangoes did they pick in total?',
                    options: ['A) 40 mangoes', 'B) 35 mangoes', 'C) 30 mangoes', 'D) 45 mangoes']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'true_false',
                title: 'Practice 5: Commutative Property', instructions: 'Choose TRUE or FALSE.',
                points: 10,
                question_data: {
                    statement: 'Changing the order of the numbers, such as 12 + 8 and 8 + 12, gives the exact same sum of 20.'
                },
                correct_answers: { answer: 'true' }
            }
        ];

        const playPairs = [
            { left: '9 + 6', right: '15' },
            { left: '25 + 25', right: '50' },
            { left: '17 + 13', right: '30' },
            { left: '48 + 12', right: '60' },
            { left: '70 + 30', right: '100' }
        ];

        const challengeAct = {
            day_number: 4, section_type: 'challenge', difficulty: 'challenge', activity_type: 'multiple_choice',
            title: 'Challenge Me: Two-Step Addition', instructions: 'Solve the multi-step word problem.',
            points: 15,
            question_data: {
                question: 'A fruit vendor had 35 apples in the morning. He received 28 more apples at noon and 15 apples in the afternoon. How many apples did he have in all?',
                options: [
                    'A) 78 apples (35 + 28 = 63, then 63 + 15 = 78)',
                    'B) 68 apples',
                    'C) 72 apples',
                    'D) 85 apples'
                ]
            },
            correct_answers: { answer: 'A' }
        };

        const showKnowQuestions = [
            { id: 'q1', text: '1. What is the sum when you add 14 and 16?', options: ['A) 30', 'B) 28', 'C) 32', 'D) 29'] },
            { id: 'q2', text: '2. In addition, the numbers being added together are called:', options: ['A) Addends', 'B) Difference', 'C) Quotient', 'D) Product'] },
            { id: 'q3', text: '3. When the sum of the digits in the Ones column is 12, what digit do you write in the Ones place?', options: ['A) 2 (and carry 1 to Tens)', 'B) 1', 'C) 12', 'D) 0'] },
            { id: 'q4', text: '4. What is 54 + 29?', options: ['A) 83', 'B) 73', 'C) 82', 'D) 85'] },
            { id: 'q5', text: '5. Which addition property states that 9 + 0 = 9?', options: ['A) Zero Property', 'B) Commutative Property', 'C) Associative Property', 'D) Distributive Property'] },
            { id: 'q6', text: '6. Juan has 42 pesos and Maria has 38 pesos. How much money do they have combined?', options: ['A) 80 pesos', 'B) 70 pesos', 'C) 78 pesos', 'D) 82 pesos'] },
            { id: 'q7', text: '7. What is 125 + 75?', options: ['A) 200', 'B) 190', 'C) 210', 'D) 195'] },
            { id: 'q8', text: '8. If 6 + 7 = 13, what is 7 + 6?', options: ['A) 13', 'B) 14', 'C) 12', 'D) 15'] },
            { id: 'q9', text: '9. In a two-digit addition problem, which column must you always add first?', options: ['A) Ones column', 'B) Tens column', 'C) Hundreds column', 'D) It does not matter'] },
            { id: 'q10', text: '10. Farmer Berto harvested 48 sacks of rice and Mang Tomas harvested 37 sacks. How many sacks of rice were harvested in total?', options: ['A) 85 sacks', 'B) 75 sacks', 'C) 82 sacks', 'D) 88 sacks'] }
        ];
        const showKnowAnswers = { q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A', q7: 'A', q8: 'A', q9: 'A', q10: 'A' };

        return {
            title, explanation,
            story: 'At the bakery in Concepcion, Carlo helped his father pack fresh pandesal. The first tray had 28 rolls and the second tray had 34 rolls. Carlo counted carefully: 8 + 4 = 12, carry 1 ten; 1 + 2 + 3 = 6 tens! "62 warm pandesal ready for our neighbors!" Carlo smiled proudly.',
            examples: [
                { term: 'Addends', detail: 'The numbers that you combine together.' },
                { term: 'Sum', detail: 'The total answer resulting from addition.' },
                { term: 'Regrouping', detail: 'Carrying over 10 ones as 1 ten into the next column.' }
            ],
            illustrations: ['➕ Addition Sign', '🥖 Warm Pandesal Tray', '🧮 Number Abacus'],
            practice: practiceActivities,
            play: playPairs,
            challenge: challengeAct,
            show_know: { questions: showKnowQuestions, answers: showKnowAnswers }
        };
    }

    // ==========================================
    // 5. FILIPINO / READING: PANGNGALAN (NOUNS)
    // ==========================================
    if (topicKey === 'fil_nouns') {
        const title = "Pangngalang Pantangi at Pangngalang Pambalana";
        const explanation = `🌟 **Aralin sa Filipino: Pangngalan (Pantangi at Pambalana)**

👋 **Kumusta, Munting Dalubhasa sa Filipino!**
Sa linggong ito, ating pag-aaralan ang mga salitang tumutukoy sa ngalan ng tao, bagay, hayop, pook, at pangyayari — ang **PANGNGALAN**!

📖 **1. Ano ang Pangngalan? (Kahulugan)**
Ang **Pangngalan** ay bahagi ng pananalita na tumutukoy sa ngalan ng:
• **Tao:** guro, nanay, Dr. Jose Rizal
• **Bagay:** aklat, lapis, Mongol
• **Hayop:** aso, pusa, Brownie
• **Lugar / Pook:** paaralan, Romblon, San Vicente
• **Pangyayari:** kaarawan, Pasko, pista

🔍 **2. Dalawang Uri ng Pangngalan:**
1. **Pangngalang Pantangi (Proper Noun):**
   - Tiyak at tanging ngalan.
   - Nagsisimula **palagi sa malaking titik**.
   - Halimbawa: *G. Ramos, Pilipinas, Luneta Park, Tagpi*.
2. **Pangngalang Pambalana (Common Noun):**
   - Karaniwan at pangkalahatang ngalan.
   - Nagsisimula sa **maliit na titik** (maliban kung simula ng pangungusap).
   - Halimbawa: *guro, bansa, parke, aso, lapis*.

💡 **3. Mga Halimbawa sa Pangungusap:**
• Halimbawa 1: Si **Bb. Santos** (pantangi) ay isang mabait na **guro** (pambalana).
• Halimbawa 2: Ang **Pilipinas** (pantangi) ay ating mahal na **bansa** (pambalana).
• Halimbawa 3: Masayang naglalaro ang **aso** (pambalana) na si **Bantay** (pantangi).

🏆 **4. Tandaan Natin!**
✨ Pantangi = Tanging ngalan, nagsisimula sa malaking titik!
✨ Pambalana = Karaniwang ngalan, maliit na titik!

🏡 **5. Pagsasabuhay:**
Isulat nang maayos at may malaking titik ang iyong sariling pangalan at bayan upang maipakita ang wastong paggalang!`;

        const practiceActivities = [
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'multiple_choice',
                title: 'Gawain 1: Uri ng Pangngalan', instructions: 'Piliin ang pangngalang pantangi.',
                points: 10,
                question_data: {
                    question: 'Alin sa mga sumusunod ang halimbawa ng Pangngalang Pantangi?',
                    options: ['A) Pilipinas', 'B) bansa', 'C) aklat', 'D) hayop']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'true_false',
                title: 'Gawain 2: Malaking Titik', instructions: 'Pindutin ang TAMA o MALI.',
                points: 10,
                question_data: {
                    statement: 'Ang mga pangngalang pantangi tulad ng "Maynila" at "Dr. Jose Rizal" ay laging isinusulat simula sa malaking titik.'
                },
                correct_answers: { answer: 'true' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Gawain 3: Pangngalang Pambalana', instructions: 'Tukuyin ang karaniwang ngalan.',
                points: 10,
                question_data: {
                    question: 'Alin sa mga sumusunod ang pangngalang pambalana na tumutukoy sa pook?',
                    options: ['A) paaralan', 'B) San Vicente Elementary School', 'C) Maynila', 'D) Romblon']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
                title: 'Gawain 4: Ngalan ng Bagay', instructions: 'Piliin ang pangngalang tumutukoy sa bagay.',
                points: 10,
                question_data: {
                    question: 'Sa pangungusap na "Binuksan ni Lito ang aklat," alin ang pangngalan na tumutukoy sa bagay?',
                    options: ['A) aklat', 'B) binuksan', 'C) Lito', 'D) ang']
                },
                correct_answers: { answer: 'A' }
            },
            {
                day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'true_false',
                title: 'Gawain 5: Tama o Mali - Pagtukoy', instructions: 'Pindutin ang TAMA o MALI.',
                points: 10,
                question_data: {
                    statement: 'Ang salitang "tumakbo" ay isang pangngalan.'
                },
                correct_answers: { answer: 'false' }
            }
        ];

        const playPairs = [
            { left: 'Dr. Jose Rizal', right: 'Pangngalang Pantangi (Tao)' },
            { left: 'guro at doktor', right: 'Pangngalang Pambalana (Tao)' },
            { left: 'Pilipinas at Romblon', right: 'Pangngalang Pantangi (Lugar)' },
            { left: 'aso, pusa, ibon', right: 'Pangngalang Pambalana (Hayop)' },
            { left: 'Pasko at Bagong Taon', right: 'Pangngalang Pantangi (Pangyayari)' }
        ];

        const challengeAct = {
            day_number: 4, section_type: 'challenge', difficulty: 'challenge', activity_type: 'multiple_choice',
            title: 'Hamon sa Pag-iisip: Pagsusuri sa Pangungusap', instructions: 'Suriin ang mga salita sa pangungusap.',
            points: 15,
            question_data: {
                question: 'Ilang pangngalan ang makikita sa pangungusap na ito: "Bumili si Nanay ng saging sa palengke."',
                options: [
                    'A) 3 pangngalan (Nanay, saging, palengke)',
                    'B) 1 pangngalan lamang',
                    'C) 2 pangngalan lamang',
                    'D) 4 na pangngalan'
                ]
            },
            correct_answers: { answer: 'A' }
        };

        const showKnowQuestions = [
            { id: 'q1', text: '1. Ano ang tawag sa bahagi ng pananalita na ngalan ng tao, bagay, hayop, pook, o pangyayari?', options: ['A) Pangngalan', 'B) Pandiwa', 'C) Pang-uri', 'D) Pang-abay'] },
            { id: 'q2', text: '2. Alin sa mga sumusunod ang pangngalang pantangi?', options: ['A) Corazon Aquino', 'B) pangulo', 'C) babae', 'D) lider'] },
            { id: 'q3', text: '3. Paano isinusulat ang unang titik ng pangngalang pantangi?', options: ['A) Sa malaking titik', 'B) Sa maliit na titik', 'C) May gitling', 'D) Lahat malaki'] },
            { id: 'q4', text: '4. Alin ang pangngalang pambalana sa mga sumusunod?', options: ['A) sapatos', 'B) Nike', 'C) Adidas', 'D) Marikina'] },
            { id: 'q5', text: '5. Alin sa mga sumusunod ang ngalan ng hayop?', options: ['A) Kalabaw', 'B) Magsasaka', 'C) Bukid', 'D) Araro'] },
            { id: 'q6', text: '6. Aling pangngalan ang tumutukoy sa isang pangyayari?', options: ['A) Kaarawan', 'B) Regalo', 'C) Nanay', 'D) Bahay'] },
            { id: 'q7', text: '7. Ano ang katumbas na pangngalang pambalana ng pantanging "Bantay"?', options: ['A) aso', 'B) tao', 'C) pusa', 'D) lugar'] },
            { id: 'q8', text: '8. Sa pangungusap na "Nagtungo ang mag-anak sa Boracay," alin ang pangngalang pantangi?', options: ['A) Boracay', 'B) Nagtungo', 'C) mag-anak', 'D) sa'] },
            { id: 'q9', text: '9. Alin sa mga sumusunod ang HINDI pangngalan?', options: ['A) Sumayaw', 'B) Sayaw', 'C) Mananayaw', 'D) Entablado'] },
            { id: 'q10', text: '10. Bakit mahalagang matutuhan ang wastong pagsulat ng mga pangngalang pantangi?', options: ['A) Upang maipakita ang tamang gramatika at paggalang sa tanging ngalan', 'B) Upang maging mabilis magsulat', 'C) Upang dumami ang letra', 'D) Walang dahilan'] }
        ];
        const showKnowAnswers = { q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A', q6: 'A', q7: 'A', q8: 'A', q9: 'A', q10: 'A' };

        return {
            title, explanation,
            story: 'Sa silid-aralan ng Grade 2, nagpalaro si Teacher Michelle ng "Saan Ka Nabibilang?". Hawak ni Juan ang karatulang "G. Cruz" at agad siyang pumunta sa Hanay Pantangi. Hawak naman ni Maria ang "aklat" at tumayo siya sa Hanay Pambalana. Masayang nagpalakpakan ang buong klase dahil nakuha nila ang tamang sagot!',
            examples: [
                { term: 'Pantangi', detail: 'Tiyak na ngalan ng tao, bagay, hayop, o lugar na may malaking titik.' },
                { term: 'Pambalana', detail: 'Karaniwang ngalan na nagsisimula sa maliit na titik.' },
                { term: 'Kategorya', detail: 'Tao, Bagay, Hayop, Lugar, o Pangyayari.' }
            ],
            illustrations: ['🇵🇭 Watawat ng Pilipinas', '📖 Aklat at Lapis', '🏫 Paaralan'],
            practice: practiceActivities,
            play: playPairs,
            challenge: challengeAct,
            show_know: { questions: showKnowQuestions, answers: showKnowAnswers }
        };
    }

    // ==========================================
    // 6. DEFAULT / GENERAL TEMPLATE (Tailored to Competency Text)
    // ==========================================
    const isTagalog = !subjectId.includes('english') && !subjectId.includes('math');
    const title = `${subjectName}: Week ${weekNum}`;
    const safeComp = (compText || '').trim();

    const explanation = isTagalog ? `🌟 **Aralin sa ${subjectName}: Linggo ${weekNum}**

👋 **Maligayang Pagdating sa Ating Aralin!**
Sa linggong ito, ating tutuklasin ang isang mahalagang kasanayan:
👉 **"${safeComp}"**

📖 **1. Ano ang Layunin ng Araling Ito?**
Ang araling ito ay naglalayong tulungan kang maunawaan at magamit ang mga pangunahing kaalaman sa ${subjectName} upang maging handa sa iba't ibang hamon sa pag-aaral.

🔍 **2. Mahahalagang Hakbang sa Pagkatuto:**
• **Hakbang 1: Magmasid at Makinig:** Unawain ang mga panuto at detalye bago simulan ang gawain.
• **Hakbang 2: Suriin at Pag-isipan:** Isipin kung paano nauugnay ang aralin sa iyong sariling karanasan.
• **Hakbang 3: Isagawa nang Wasto:** Ipakita ang iyong galing sa pamamagitan ng matiyagang pagsasanay.

💡 **3. Mga Halimbawa at Gabay:**
• **Halimbawa 1:** Basahin nang maayos ang bawat salita o bilang bago sumagot.
• **Halimbawa 2:** Magtanong sa guro o magulang kapag may bahaging hindi naintindihan.
• **Halimbawa 3:** Ibahagi ang iyong natutuhan sa iyong mga kamag-aral.

🏆 **4. Tandaan Natin!**
✨ Ang matiyagang mag-aaral ay laging nagtatagumpay.
✨ Gamitin ang iyong natutuhan sa araw-araw na pakikipagkapwa at gawain.

🏡 **5. Pagsasabuhay:**
Maging huwaran sa tahanan at silid-aralan sa pamamagitan ng paggawa ng kabutihan at pagsisikap sa pag-aaral!`
    : `🌟 **${subjectName} Exploration: Week ${weekNum}**

👋 **Welcome to Our Learning Mission!**
This week, our key learning competency is:
👉 **"${safeComp}"**

📖 **1. What is Our Core Mission?**
This lesson is designed to strengthen your knowledge and daily skills in ${subjectName}. We will break down key concepts step by step so you can learn with confidence!

🔍 **2. Step-by-Step Learning Guide:**
• **Step 1: Observe & Listen:** Read instructions carefully and note key vocabulary words.
• **Step 2: Think & Connect:** Connect what you learn to real-life situations at home and school.
• **Step 3: Practice & Master:** Complete each activity carefully to build your mastery.

💡 **3. Guided Examples:**
• **Example 1:** Look closely at the clues and verify your steps before choosing your final answer.
• **Example 2:** Practice explaining your thinking out loud to a partner or teacher.
• **Example 3:** Check your work patiently from start to finish.

🏆 **4. Key Takeaways to Remember!**
✨ Patience and practice make every learner a champion.
✨ Apply what you learn in your everyday conversations and problem-solving!

🏡 **5. Real-Life Connection:**
Use your new knowledge to help your family and friends every day!`;

    const practiceActivities = [
        {
            day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'multiple_choice',
            title: isTagalog ? 'Gawain 1: Pangunahing Konsepto' : 'Practice 1: Core Concept',
            instructions: isTagalog ? 'Piliin ang pinakawastong sagot batay sa ating aralin.' : 'Select the best answer based on this week’s lesson.',
            points: 10,
            question_data: {
                question: isTagalog
                    ? `Ano ang pinakamainam na paraan upang lubos na maunawaan ang araling ito?`
                    : `What is the best way to master this week's lesson?`,
                options: isTagalog
                    ? ['A) Makinig nang mabuti, magbasa, at magsagawa ng pagsasanay', 'B) Manghula nang hindi nagbabasa', 'C) Huwag pansinin ang mga halimbawa', 'D) Laktawan ang mga gawain']
                    : ['A) Listen carefully, read details, and practice patiently', 'B) Guess without reading', 'C) Ignore instructions', 'D) Skip the activities']
            },
            correct_answers: { answer: 'A' }
        },
        {
            day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'true_false',
            title: isTagalog ? 'Gawain 2: Katotohanan' : 'Practice 2: True or False',
            instructions: isTagalog ? 'Pindutin ang TAMA o MALI.' : 'Choose TRUE or FALSE.',
            points: 10,
            question_data: {
                statement: isTagalog
                    ? `Ang masusing pagsasanay at pagsunod sa mga panuto ay nagdudulot ng mataas na antas ng pagkatuto.`
                    : `Careful practice and following instructions lead to strong mastery of this lesson.`
            },
            correct_answers: { answer: 'true' }
        },
        {
            day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
            title: isTagalog ? 'Gawain 3: Paglalapat' : 'Practice 3: Application',
            instructions: isTagalog ? 'Tukuyin ang pinakatamang hakbang sa sitwasyon.' : 'Identify the most accurate approach for this scenario.',
            points: 10,
            question_data: {
                question: isTagalog
                    ? `Kapag ikaw ay nagbabasa o naglutas ng gawain, ano ang pinakamahalagang unang hakbang?`
                    : `When reading or solving a task, what is the most important first step?`,
                options: isTagalog
                    ? ['A) Unawain nang mabuti ang hinihingi bago sumagot', 'B) Isulat agad ang unang maisip nang hindi nagbabasa', 'C) Iasa sa katabi ang pagsagot', 'D) Huwag basahin ang panuto']
                    : ['A) Understand carefully what is being asked before answering', 'B) Write the first thought without reading', 'C) Copy someone else', 'D) Skip the instructions']
            },
            correct_answers: { answer: 'A' }
        },
        {
            day_number: 3, section_type: 'practice', difficulty: 'practice', activity_type: 'multiple_choice',
            title: isTagalog ? 'Gawain 4: Wastong Pagpili' : 'Practice 4: Concept Drill',
            instructions: isTagalog ? 'Piliin ang pinakamainam na hakbang.' : 'Choose the best step.',
            points: 10,
            question_data: {
                question: isTagalog
                    ? `Alin sa mga sumusunod ang nagpapakita ng tunay na pagkaunawa sa aralin?`
                    : `Which of the following shows true understanding of the lesson?`,
                options: isTagalog
                    ? ['A) Naipaliliwanag at nagagamit ito sa pang-araw-araw na gawain', 'B) Kinakabisa lamang ang salita nang walang pag-unawa', 'C) Nakakalimutan agad pagkatapos ng klase', 'D) Hindi ito maipaliwanag sa iba']
                    : ['A) Being able to explain and apply it in everyday activities', 'B) Memorizing without understanding', 'C) Forgetting it immediately', 'D) Inability to demonstrate the skill']
            },
            correct_answers: { answer: 'A' }
        },
        {
            day_number: 3, section_type: 'practice', difficulty: 'basic', activity_type: 'true_false',
            title: isTagalog ? 'Gawain 5: Pagsasabuhay' : 'Practice 5: Reflection',
            instructions: isTagalog ? 'Pindutin ang TAMA o MALI.' : 'Choose TRUE or FALSE.',
            points: 10,
            question_data: {
                statement: isTagalog
                    ? `Ang batang matiyagang nag-aaral at nagtatanong sa guro kung may hindi naintindihan ay patuloy na nagtatagumpay.`
                    : `A learner who is patient and asks the teacher for guidance when confused will continue to succeed.`
            },
            correct_answers: { answer: 'true' }
        }
    ];

    const playPairs = [
        { left: isTagalog ? 'Hakbang 1: Pagmasdan' : 'Step 1: Observe', right: isTagalog ? 'Gamitin ang pandama at pansin' : 'Use your senses carefully' },
        { left: isTagalog ? 'Hakbang 2: Tukuyin' : 'Step 2: Identify', right: isTagalog ? 'Pangalanan ang mga mahalagang bahagi' : 'Name key components' },
        { left: isTagalog ? 'Hakbang 3: Unawain' : 'Step 3: Understand', right: isTagalog ? 'Isipin ang kahulugan ng aralin' : 'Reflect on the meaning' },
        { left: isTagalog ? 'Hakbang 4: Magplano' : 'Step 4: Plan', right: isTagalog ? 'Pumili ng tamang estratehiya' : 'Choose the best method' },
        { left: isTagalog ? 'Hakbang 5: Isagawa' : 'Step 5: Apply', right: isTagalog ? 'Ipakita ang natutuhang husay' : 'Demonstrate your mastery' }
    ];

    const challengeAct = {
        day_number: 4, section_type: 'challenge', difficulty: 'challenge', activity_type: 'multiple_choice',
        title: isTagalog ? 'Subukin ang Husay: Hamon sa Pag-iisip' : 'Challenge Me: Critical Thinking',
        instructions: isTagalog ? 'Suriin nang mabuti ang sitwasyon at piliin ang pinakamahusay na solusyon.' : 'Analyze the scenario carefully.',
        points: 15,
        question_data: {
            question: isTagalog
                ? `Kung ikaw ay maharap sa isang bagong sitwasyon sa iyong pamayanan o silid-aralan, paano mo gagamitin ang araling ito upang makatulong sa kapwa?`
                : `When faced with a real-life situation in school or community, how can you apply this lesson to help others?`,
            options: isTagalog
                ? [
                    'A) Ibahagi ang natutuhan sa mahinahon, magalang, at kapaki-pakinabang na paraan upang malutas ang suliranin',
                    'B) Huwag pansinin ang mga kaklaseng nangangailangan ng tulong',
                    'C) Magreklamo sa halip na humanap ng paraan upang makatulong',
                    'D) Umiwas sa lahat ng gawain upang hindi mapagod'
                ]
                : [
                    'A) Share what you learned in a kind, respectful, and constructive way to help solve the problem',
                    'B) Ignore classmates who need assistance',
                    'C) Complain instead of finding practical answers',
                    'D) Avoid taking part in activities'
                ]
        },
        correct_answers: { answer: 'A' }
    };

    const showKnowQuestions = [];
    const showKnowAnswers = {};
    for (let i = 1; i <= 10; i++) {
        const qId = `q${i}`;
        showKnowQuestions.push({
            id: qId,
            text: isTagalog
                ? `${i}. Alin sa mga sumusunod ang nagpapatunay ng tamang kasanayan sa linggong ito (Tanong ${i})?`
                : `${i}. Which of the following demonstrates correct mastery of this week's lesson (Question ${i})?`,
            options: isTagalog
                ? [
                    `A) Naisasagawa nang tumpak at may pag-unawa ang kasanayan ${i}`,
                    `B) Hindi binabasa ang mga panuto`,
                    `C) Paghula nang walang batayan`,
                    `D) Pagbalewala sa mga halimbawa`
                ]
                : [
                    `A) Accurately and thoughtfully performing skill ${i}`,
                    `B) Skipping the instructions`,
                    `C) Guessing without basis`,
                    `D) Ignoring the given examples`
                ]
        });
        showKnowAnswers[qId] = 'A';
    }

    return {
        title, explanation,
        story: isTagalog
            ? `Masiglang nag-aral ang mga bata sa klase. Sama-sama silang nagbahaginan ng mga natutuhan at natuklasan na ang bawat aralin ay may malaking tulong sa kanilang pang-araw-araw na pamumuhay.`
            : `Our learners explored this week's lesson with enthusiasm, asking thoughtful questions and finding meaningful solutions together.`,
        examples: [
            { term: isTagalog ? 'Pagsusuri' : 'Analysis', detail: isTagalog ? 'Unawain ang bawat hakbang nang mabuti.' : 'Understand each step carefully.' },
            { term: isTagalog ? 'Pagsasanay' : 'Practice', detail: isTagalog ? 'Gawin ang mga pagsasanay nang buong husay.' : 'Complete exercises with care.' },
            { term: isTagalog ? 'Pagsasabuhay' : 'Application', detail: isTagalog ? 'Gamitin ang kaalaman sa pamilya at kapwa.' : 'Use your skills to help others.' }
        ],
        illustrations: ['📚 Learning Book', '⭐ Golden Star', '💡 Bright Mind'],
        practice: practiceActivities,
        play: playPairs,
        challenge: challengeAct,
        show_know: { questions: showKnowQuestions, answers: showKnowAnswers }
    };
}

function generateModuleContent(termNum, weekNum, subjectId, subjectName, competencyText, strand, gradeLevel = 'Grade 3') {
    const cleanSub = String(subjectId).toLowerCase();
    let subjectCategory = 'other';
    if (cleanSub.includes('science')) subjectCategory = 'science';
    else if (cleanSub.includes('math')) subjectCategory = 'math';
    else if (cleanSub.includes('english')) subjectCategory = 'english';
    else if (cleanSub.includes('reading') || cleanSub.includes('filipino') || cleanSub.includes('language')) subjectCategory = 'filipino_reading';
    else if (cleanSub.includes('makabansa')) subjectCategory = 'makabansa';
    else if (cleanSub.includes('gmrc')) subjectCategory = 'gmrc';

    const combinedText = `${competencyText || ''} ${strand || ''} ${subjectName || ''}`.toLowerCase();
    const topicKey = detectSubtopic(subjectCategory, combinedText);

    const generated = buildLessonAndActivities(topicKey, competencyText, weekNum, gradeLevel, subjectId, subjectName);

    const lesson = {
        day_number: 1,
        title: generated.title,
        explanation_learn: generated.explanation,
        explore_story: generated.story,
        explore_examples: JSON.stringify(generated.examples),
        illustrations: JSON.stringify(generated.illustrations)
    };

    const activities = [
        ...generated.practice,
        {
            day_number: 4,
            section_type: 'play',
            difficulty: 'practice',
            activity_type: 'mini_game',
            title: `Laruin at Matuto: Star Match Quest (5 Pares)`,
            instructions: `Pindutin ang isang bagay sa Hanay A at itugma sa tamang katapat nito sa Hanay B!`,
            points: 15,
            question_data: {
                game_type: 'star_match',
                prompt: 'Ipares ang 5 tamang katapat:',
                pairs: generated.play
            },
            correct_answers: {
                matches: { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4' }
            }
        },
        generated.challenge,
        {
            day_number: 5,
            section_type: 'show_know',
            difficulty: 'practice',
            activity_type: 'assessment',
            title: `Pagsusulit: Ipakita ang Natutuhan (10 Aytem)`,
            instructions: `Sagutin ang 10 aytem ng pagsusulit upang masukat ang iyong buong galing ngayong linggo.`,
            points: 20,
            question_data: {
                questions: generated.show_know.questions
            },
            correct_answers: generated.show_know.answers
        }
    ];

    return { lesson, activities };
}

module.exports = {
    generateModuleContent,
    detectSubtopic
};
