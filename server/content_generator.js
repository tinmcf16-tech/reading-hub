// Comprehensive Multi-Grade Content Generator for Grades 1, 2, and 3
// Generates child-friendly, pedagogically sound DepEd MATATAG content for all learning modules.

function generateModuleContent(termNum, weekNum, subjectId, subjectName, competencyText, strand, gradeLevel = 'Grade 3') {
    const isTagalog = (
        subjectId === 'filipino' || subjectId === 'gmrc' || subjectId === 'makabansa' ||
        subjectId === 'g1_language' || subjectId === 'g1_gmrc' || subjectId === 'g1_makabansa' ||
        subjectId === 'g2_filipino' || subjectId === 'g2_gmrc' || subjectId === 'g2_makabansa'
    );

    const safeComp = (competencyText || '').trim();
    const shortComp = safeComp.length > 90 ? safeComp.substring(0, 90) + '...' : safeComp;
    const safeStrand = strand || subjectName;

    // 1. Child-friendly "Let's Learn" & "Explore"
    let learnTitle = '';
    let learnExplanation = '';
    let exploreStory = '';
    let exploreExamples = [];
    let illustrations = [];

    // --- GRADE 1 GENERATOR ---
    if (gradeLevel === 'Grade 1' || subjectId.startsWith('g1_')) {
        if (subjectId === 'g1_reading') {
            learnTitle = `Reading Stars: ${safeStrand} - Week ${weekNum}`;
            learnExplanation = `Hello little Grade 1 Explorer! ⭐ This week, we will discover: **${shortComp}**\n\nLetters make sounds, and sounds make words! When we listen, point to letters, and sing rhymes, learning to read becomes an exciting adventure!`;
            exploreStory = `In our colorful Grade 1 classroom, little Ben found a picture book of friendly animals. "Look at the cat, the dog, and the duck!" teacher smiled and helped Ben sound out the letters: /c/ /a/ /t/ makes CAT! Ben clapped his hands with joy!`;
            exploreExamples = [
                { term: 'Letter Sound', detail: 'Listen carefully to the first sound you hear in each word.' },
                { term: 'Word Picture', detail: 'Match the picture with the correct letter shape.' },
                { term: 'Daily Cheer', detail: 'Point with your finger under each word as you read aloud!' }
            ];
            illustrations = ['🐱 Friendly Cat', '📚 Colorful Picture Book', '⭐ Golden Star'];
        } else if (subjectId === 'g1_language') {
            learnTitle = `Wikang Masaya: ${safeStrand} - Linggo ${weekNum}`;
            learnExplanation = `Kumusta, masiglang mag-aaral ng Grade 1! 👋 Sa linggong ito, ating matututuhan: **${shortComp}**\n\nAng pakikipag-usap at pakikinig sa ating mga kalaro at guro ay nakatutulong upang maipahayag natin ang ating mga ideya at damdamin nang may ngiti at galang.`;
            exploreStory = `Masayang pumasok si Lito sa paaralan. Binati niya si Teacher nang buong galang: "Magandang umaga po!" Ipinakilala rin niya ang kanyang sarili sa kanyang bagong katabi. Lahat sila ay nagtawanan at nagbahaginan ng paboritong kulay.`;
            exploreExamples = [
                { term: 'Magagalang na Salita', detail: 'Laging gumamit ng "po" at "opo" sa pakikipag-usap.' },
                { term: 'Malinaw na Pagbigkas', detail: 'Bigkasin nang maayos ang bawat pantig ng salita.' },
                { term: 'Pakikinig nang Mabuti', detail: 'Tumingin sa nagsasalita kapag may nagkukuwento.' }
            ];
            illustrations = ['🗣️ Masayang Usapan', '🏫 Silid-Aralan', '🎈 Makulay na Lobo'];
        } else if (subjectId === 'g1_gmrc') {
            learnTitle = `Batang May Magandang Asal - Linggo ${weekNum}`;
            learnExplanation = `Mabuhay, munting bata! 🤝 Sa GMRC, natututuhan natin ang pagiging mabait, magalang, at mapagmahal sa pamilya at kapwa.\n\nAralin: **${shortComp}**\nAng batang magalang ay kinagigiliwan ng lahat!`;
            exploreStory = `Sa hapag-kainan, tinulungan ni Ana ang kanyang nanay sa pag-abot ng baso. "Salamat, munting Ana," sabi ng kanyang nanay. Nagpasalamat din si Ana bago kumain. Payapa at masaya ang kanilang tahanan dahil sa pagmamalasakit.`;
            exploreExamples = [
                { term: 'Munting Tulong', detail: 'Tumulong sa simpleng gawaing-bahay tulad ng pagligpit ng laruan.' },
                { term: 'Paggalang', detail: 'Magpaalam nang maayos bago umalis o humiram ng gamit.' },
                { term: 'Kabutihan', detail: 'Magbahagi ng ngiti at tulong sa kaklase.' }
            ];
            illustrations = ['🤝 Pagtulong', '💖 Puso ng Pasasalamat', '🏡 Masayang Tahanan'];
        } else if (subjectId === 'g1_makabansa') {
            learnTitle = `Munting Makabansa - Linggo ${weekNum}`;
            learnExplanation = `Mahal natin ang ating bayang Pilipinas! 🏛️\n\nAting tutuklasin: **${shortComp}**\nBilang batang Pilipino sa Grade 1, kikilalanin natin ang ating sarili, pamilya, paaralan, at ang mga sagisag ng ating bansa.`;
            exploreStory = `Sa flag ceremony tuwing Lunes, tumayo nang tuwid si Gabriel at inilagay ang kanang kamay sa kanyang dibdib habang inaawit ang Lupang Hinirang. Proud na proud siyang maging batang Pilipino!`;
            exploreExamples = [
                { term: 'Ating Watawat', detail: 'Igalang ang watawat ng Pilipinas sa lahat ng oras.' },
                { term: 'Aking Paaralan', detail: 'Alagaan ang kalinisan ng ating silid-aralan at bakuran.' },
                { term: 'Aking Pamilya', detail: 'Mahalin at igalang ang bawat kasapi ng pamilya.' }
            ];
            illustrations = ['🇵🇭 Watawat ng Pilipinas', '🏫 Aking Paaralan', '🎨 Guhit ng Pamilya'];
        } else if (subjectId === 'g1_math') {
            learnTitle = `Fun Math Counting: ${safeStrand} - Week ${weekNum}`;
            learnExplanation = `Numbers are our best friends! 🔢\n\nThis week's exciting mission: **${shortComp}**\nLet's count, group, sort, and discover how numbers help us every single day!`;
            exploreStory = `Lina had 3 ripe yellow bananas. Her brother gave her 2 more sweet bananas. Lina counted them on her fingers: 1, 2, 3, 4, 5! "I have 5 sweet bananas!" she shouted happily. Math is everywhere!`;
            exploreExamples = [
                { term: 'Count Step by Step', detail: 'Point to each object as you say the number: 1, 2, 3!' },
                { term: 'Shapes & Patterns', detail: 'Look around you: circles, squares, and stars are everywhere.' },
                { term: 'Math Tip', detail: 'Use your fingers and counters to check your answer.' }
            ];
            illustrations = ['🔢 Number Cards', '🍌 Sweet Bananas', '⭐ 5 Bright Stars'];
        }
    }
    // --- GRADE 2 GENERATOR ---
    else if (gradeLevel === 'Grade 2' || subjectId.startsWith('g2_')) {
        if (subjectId === 'g2_english') {
            learnTitle = `English Explorers: ${safeStrand} - Week ${weekNum}`;
            learnExplanation = `Welcome Grade 2 Reader! 🇬🇧 This week, our journey focuses on: **${shortComp}**\n\nAs we read sentences, learn new sight words, and retell stories, our English communication becomes clearer and brighter!`;
            exploreStory = `Carlo and Bea were reading a story about a brave puppy named Sparky. "Sparky helped a lost kitten find its mother," read Bea with expression. Carlo smiled and said, "Now I understand what true bravery means!"`;
            exploreExamples = [
                { term: 'Sight Word Power', detail: 'Spot familiar words instantly to read smoothly.' },
                { term: 'Story Details', detail: 'Remember the characters, the setting, and the big event.' },
                { term: 'Sentence Clues', detail: 'Use the words around the hard word to unlock its meaning.' }
            ];
            illustrations = ['🐶 Brave Sparky', '📖 Adventure Book', '💡 Bright Lightbulb'];
        } else if (subjectId === 'g2_filipino') {
            learnTitle = `Wikang Filipino: ${safeStrand} - Linggo ${weekNum}`;
            learnExplanation = `Kumusta, masigasig na mag-aaral ng Grade 2! 🇵🇭 Ang ating aralin ngayon: **${shortComp}**\n\nSa pamamagitan ng pagbasa ng mga maiikling kuwento at tula sa Filipino, lalo nating napapalawak ang ating talasalitaan at pagkaunawa sa ating kapwa.`;
            exploreStory = `Isang hapon, binasa ni Carlo ang isang tula tungkol sa sipag ng langgam. Naunawaan niya na ang pagtutulungan ng bawat isa ay nagdudulot ng kaginhawahan sa pamilya. Ibinahagi niya ang kuwentong ito sa kanyang mga kaklase nang buong husay.`;
            exploreExamples = [
                { term: 'Pangunahing Diwa', detail: 'Tukuyin ang pinakamahalagang mensahe ng binasang talata.' },
                { term: 'Bagong Salita', detail: 'Gamitin ang mga bagong salita sa sariling pangungusap.' },
                { term: 'Wastong Baybay', detail: 'Isulat nang wasto ang mga titik ng bawat salita.' }
            ];
            illustrations = ['🇵🇭 Watawat at Aklat', '🐜 Masipag na Langgam', '📝 Papel at Lapis'];
        } else if (subjectId === 'g2_gmrc') {
            learnTitle = `GMRC: Kagandahang Asal - Linggo ${weekNum}`;
            learnExplanation = `Mabuhay, mag-aaral ng Grade 2! 🤝 Ating pag-aaralan: **${shortComp}**\n\nAng pagpapakita ng respeto, pagiging tapat, at pagtulong sa ating komunidad ay tanda ng isang huwarang batang Pilipino.`;
            exploreStory = `Nang makakita si Mateo ng pitaka na naiwan sa upuan sa kantina, agad niya itong dinala sa tanggapan ng punong-guro. "Salamat sa iyong katapatan, Mateo," wika ng guro. Masarap sa pakiramdam ang gumawa ng tama kahit walang nakakakita!`;
            exploreExamples = [
                { term: 'Katapatan', detail: 'Maging tapat sa salita at sa gawa sa lahat ng pagkakataon.' },
                { term: 'Pakikipagkapwa', detail: 'Igalang ang opinyon at damdamin ng kapwa bata.' },
                { term: 'Pagsunod sa Alituntunin', detail: 'Sumunod sa mga babala at batas ng paaralan at pamayanan.' }
            ];
            illustrations = ['🤝 Puso ng Katapatan', '🏫 Punong-guro at Mag-aaral', '🌟 Huwarang Asal'];
        } else if (subjectId === 'g2_makabansa') {
            learnTitle = `Makabansa: Ating Pamayanan - Linggo ${weekNum}`;
            learnExplanation = `Ipinagmamalaki natin ang ating kultura at pamayanan! 🏛️\n\nAting tutuklasin: **${shortComp}**\nSa Grade 2, ating kinikilala ang mga namumuno, mga manggagawa, at ang mga natatanging yamang-kultural sa ating bayan.`;
            exploreStory = `Pumunta ang klase sa barangay hall. Nakilala nila ang kapitan, ang mga barangay tanod, at ang mga health workers na nag-aalaga sa kalusugan ng mga mamamayan. "Sila ang mga bayani ng ating pamayanan," sabi ng guro.`;
            exploreExamples = [
                { term: 'Mga Manggagawa sa Pamayanan', detail: 'Pahalagahan ang mga guro, doktor, pulis, at magsasaka.' },
                { term: 'Kalinisan ng Kapaligiran', detail: 'Itapon ang basura sa tamang basurahan upang mapanatiling ligtas ang bayan.' },
                { term: 'Kultura at Tradisyon', detail: 'Makibahagi sa mga pagdiriwang at pista ng sariling bayan nang may paggalang.' }
            ];
            illustrations = ['🏛️ Barangay Hall', '👩‍⚕️ Manggagawa sa Kalusugan', '🌳 Malinis na Pamayanan'];
        } else if (subjectId === 'g2_math') {
            learnTitle = `Grade 2 Math Adventures: ${safeStrand} - Week ${weekNum}`;
            learnExplanation = `Get ready for Math Magic! 🔢\n\nOur weekly mission: **${shortComp}**\nWe will work with 2-digit and 3-digit numbers, solve real word problems, and discover patterns like real junior mathematicians!`;
            exploreStory = `At the bakery, Ella counted 25 pandesal in the first tray and 35 in the second tray. Ella added: 25 + 35 = 60 fresh rolls! "60 warm pandesal ready for breakfast!" Ella's quick math helped the baker pack them fast!`;
            exploreExamples = [
                { term: 'Place Value', detail: 'Know your Ones, Tens, and Hundreds place.' },
                { term: 'Problem Solving', detail: 'Read the word problem, find the given numbers, and choose the operation.' },
                { term: 'Check & Verify', detail: 'Check if your answer makes realistic sense in daily life.' }
            ];
            illustrations = ['🔢 Number Abacus', '🥖 Fresh Bread Tray', '🧮 Math Notebook'];
        }
    }
    // --- GRADE 3 GENERATOR (Existing rich baseline) ---
    else {
        if (subjectId === 'english') {
            learnTitle = `Mastering ${safeStrand} - Week ${weekNum}`;
            learnExplanation = `Hello Grade 3 Champion! 👋 This week, we will explore: **${shortComp}**\n\nWhen we read carefully and practice word patterns, our reading superpowers grow stronger every day! Let's listen, look at the clues, and speak with confidence!`;
            exploreStory = `Once upon a time in a sunny schoolyard in Romblon, Maya and Leo found an old mystery notebook under the shade of a mango tree. "Look!" Leo exclaimed, "every riddle can only be solved if we read the words clearly and understand the clues!" Together, they traced the words, sounded out the letters, and found a hidden map leading to the reading garden!`;
            exploreExamples = [
                { term: 'Key Concept 1', detail: 'Listen carefully to the sounds in each word before speaking.' },
                { term: 'Key Concept 2', detail: 'Look at the pictures and sentence clues to understand the meaning.' },
                { term: 'Daily Tip', detail: 'Read each sentence out loud with feeling and correct pauses!' }
            ];
            illustrations = ['📖 Story Book', '🌳 Reading Tree', '⭐ Golden Star'];
        } else if (subjectId === 'filipino') {
            learnTitle = `Ating Alamin: ${safeStrand} - Linggo ${weekNum}`;
            learnExplanation = `Kumusta, masipag na mag-aaral! 🇵🇭 Sa linggong ito, ating pag-aaralan ang: **${shortComp}**\n\nAng wikang Filipino ay nagbibigay sa atin ng boses upang maipahayag ang ating damdamin, magkuwento, at magkaunawaan sa ating pamayanan. Halina't magbasa at magsulat nang may ngiti!`;
            exploreStory = `Isang umaga sa San Vicente, masiglang gumising si Juan at Maria. "Ate, sabay na tayong pumasok sa paaralan!" Masaya silang naglakad habang nagbabasa ng mga karatula sa daan. Napansin nila ang kagandahan ng paligid at nagkuwentuhan gamit ang magagalang na pananalita tulad ng "po" at "opo."`;
            exploreExamples = [
                { term: 'Halimbawa 1', detail: 'Gamitin ang magagalang na pananalita sa pakikipag-usap sa kapwa.' },
                { term: 'Halimbawa 2', detail: 'Tukuyin ang wastong tunog at baybay ng bawat salita bago ito isulat.' },
                { term: 'Gintong Aral', detail: 'Ang batang palabasa ay laging handang matuto at tumulong.' }
            ];
            illustrations = ['🇵🇭 Watawat ng Pilipinas', '🏫 Masayang Paaralan', '📝 Kwaderno at Lapis'];
        } else if (subjectId === 'gmrc') {
            learnTitle = `Gintong Pagpapahalaga - Linggo ${weekNum}`;
            learnExplanation = `Mabuhay! Sa GMRC, natututuhan natin kung paano maging mabuting tao, masunurin sa magulang, at mapagmalasakit sa kapwa. 🤝\n\nAng ating aralin: **${shortComp}**\nAng paggawa ng kabutihan ay nagpapasaya hindi lamang sa iba kundi maging sa ating sarili!`;
            exploreStory = `Sa klase ni Teacher A sa Section Masinadyahon, nagtulungan ang mga bata sa paglilinis ng silid-aralan. Nang makita ni Mateo na nahulog ang mga aklat ng kanyang kaklase, agad niya itong pinulot nang may ngiti. "Salamat, Mateo!" wika nito. Napatunayan nila na ang pagtutulungan at pagmamalasakit ay nagdudulot ng kapayapaan at ligaya.`;
            exploreExamples = [
                { term: 'Mabuting Kilos', detail: 'Maging tapat at magalang sa lahat ng oras.' },
                { term: 'Sa Tahanan at Paaralan', detail: 'Sumunod sa mga alituntunin at igalang ang mga nakatatanda.' },
                { term: 'Hamong Pansarili', detail: 'Magbahagi ng tulong sa kaklaseng nangangailangan nang walang hinihintay na kapalit.' }
            ];
            illustrations = ['🤝 Pagtutulungan', '💖 Masayang Puso', '🌟 Huwarang Mag-aaral'];
        } else if (subjectId === 'makabansa') {
            learnTitle = `Makabansa: ${safeStrand} - Linggo ${weekNum}`;
            learnExplanation = `Ipinagmamalaki natin ang ating bayan at kultura! 🏛️\n\nAting tutuklasin: **${shortComp}**\nBilang batang Pilipino, mahalagang malaman natin ang kasaysayan, sining, at mga bayani sa ating sariling komunidad upang mahalin at ipagtanggol natin ang ating inang bayan!`;
            exploreStory = `Nilibot ng mag-anak nina Aling Rosa at Mang Berto ang lumang plasa sa bayan. Nakita ng mga bata ang lumang simbahan, ang bantayog ng bayani, at ang makukulay na likhang-sining ng mga katutubong manghahabi. "Dito nakatatak ang galing at kasipagan ng ating mga ninuno," paliwanag ng kanilang guro.`;
            exploreExamples = [
                { term: 'Ating Komunidad', detail: 'Bawat lugar ay may natatanging kasaysayan at mga taong naglingkod dito.' },
                { term: 'Sining at Kultura', detail: 'Ang ating mga awit, sayaw, at pista ay sumasalamin sa ating pagka-Pilipino.' },
                { term: 'Tungkulin ng Bata', detail: 'Pangalagaan ang kalinisan at kapayapaan sa ating barangay at paaralan.' }
            ];
            illustrations = ['🏛️ Makasaysayang Gusali', '🎨 Likhang Sining', '🗺️ Mapa ng Romblon'];
        } else if (subjectId === 'math') {
            learnTitle = `Math Explorers: ${safeStrand} - Week ${weekNum}`;
            learnExplanation = `Numbers are everywhere and math is your superpower! 🔢\n\nThis week's mission: **${shortComp}**\nStep by step, we will count, group, calculate, and solve real-world puzzles with ease!`;
            exploreStory = `At the local market in Concepcion, Carlo helped his grandmother arrange fresh sweet mangoes in neat baskets. "If we put 6 mangoes in each basket and we have 8 baskets, how many mangoes are ready for our neighbors?" Carlo counted using skip counting: 6, 12, 18, 24, 30, 36, 42, 48! "48 mangoes, Lola!" Lola smiled proudly at Carlo's quick math skills!`;
            exploreExamples = [
                { term: 'Step 1: Understand', detail: 'Read the numbers and identify what is being asked.' },
                { term: 'Step 2: Plan', detail: 'Choose the right operation or model (addition, subtraction, multiplication, division).' },
                { term: 'Step 3: Solve & Check', detail: 'Calculate clearly and check if your answer makes realistic sense!' }
            ];
            illustrations = ['🔢 Number Grid', '🧺 Fruit Baskets', '🧮 Math Abacus'];
        } else if (subjectId === 'science') {
            learnTitle = `Junior Scientists: ${safeStrand} - Week ${weekNum}`;
            learnExplanation = `Welcome young scientist! The world around us is full of wonder! 🔬\n\nOur investigation: **${shortComp}**\nUsing our five senses, observation skills, and safe experiments, we can discover how nature works!`;
            exploreStory = `During science hour, the Grade 3 learners stepped into the school garden with magnifying lenses and science journals. They observed how dewdrops formed on leaves, watched tiny ants carry crumbs, and felt the warm sunlight shining through the trees. They recorded their findings and shared their hypotheses with their teacher!`;
            exploreExamples = [
                { term: 'Observation', detail: 'Look closely, listen, feel safely, and record what you notice.' },
                { term: 'Experimentation', detail: 'Test your idea step by step using safe materials.' },
                { term: 'Conclusion', detail: 'Explain what happened and why it matters in daily life!' }
            ];
            illustrations = ['🔬 Magnifying Glass', '🌱 Growing Plant', '☀️ Bright Sunshine'];
        }
    }

    // Fallbacks if any field is empty
    if (!learnTitle) learnTitle = `${subjectName}: ${safeStrand} - Week ${weekNum}`;
    if (!learnExplanation) learnExplanation = `Welcome to ${gradeLevel} ${subjectName}! This week we focus on: **${shortComp}**`;
    if (!exploreStory) exploreStory = `Our learners in ${gradeLevel} explored this lesson enthusiastically, asking curious questions and finding great answers together.`;
    if (exploreExamples.length === 0) {
        exploreExamples = [
            { term: 'Core Idea', detail: 'Understand the concept with patience and practice.' },
            { term: 'Real-Life Application', detail: 'Apply what you learn in your daily interactions.' }
        ];
    }
    if (illustrations.length === 0) {
        illustrations = ['📚 Learning Book', '⭐ Golden Star', '💡 Bright Mind'];
    }

    // 2. Interactive Activities: 5 days structured
    // Day 3: Let's Practice (5 items)
    // Day 4: Let's Play (Star Quest 5 pairs) & Challenge Me (1 item)
    // Day 5: Show What You Know (5-item summative assessment)

    const activities = [
        // Activity 1: Practice 1 - Concept Understanding
        {
            day_number: 3,
            section_type: 'practice',
            difficulty: 'basic',
            activity_type: 'multiple_choice',
            title: isTagalog ? 'Gawain 1: Pangunahing Konsepto' : "Practice 1: Core Concept",
            instructions: isTagalog ? 'Piliin ang pinakawastong sagot batay sa ating aralin.' : 'Select the best answer based on this week’s lesson.',
            points: 10,
            question_data: {
                question: isTagalog 
                    ? `Ano ang pangunahing layunin ng ating aralin ukol sa: "${shortComp}"?`
                    : `What is the key goal of our lesson on: "${shortComp}"?`,
                options: isTagalog 
                    ? [
                        'A) Upang maunawaan at maisagawa nang wasto ang kasanayan',
                        'B) Upang balewalain ang mga hakbang',
                        'C) Upang manghula nang walang pagbasa',
                        'D) Wala sa mga nabanggit'
                    ]
                    : [
                        'A) To understand and perform the competency with accuracy',
                        'B) To ignore instructions and skip steps',
                        'C) To guess without reading the details',
                        'D) None of the above'
                    ]
            },
            correct_answers: { answer: 'A' }
        },
        // Activity 2: Practice 2 - Fact Verification
        {
            day_number: 3,
            section_type: 'practice',
            difficulty: 'practice',
            activity_type: 'true_false',
            title: isTagalog ? 'Gawain 2: Tama o Mali - Katotohanan' : "Practice 2: True or False",
            instructions: isTagalog ? 'Pindutin ang TAMA kung ang pahayag ay totoo, o MALI kung hindi.' : 'Choose TRUE if the statement is correct, or FALSE if it is not.',
            points: 10,
            question_data: {
                statement: isTagalog
                    ? `Ang masusing pagsasanay at pagsunod sa mga panuto sa ${gradeLevel} ay nagdudulot ng mataas na antas ng pagkatuto.`
                    : `Careful practice and following instructions in ${gradeLevel} lead to strong mastery of this lesson.`
            },
            correct_answers: { answer: 'true' }
        },
        // Activity 3: Practice 3 - Application Drill
        {
            day_number: 3,
            section_type: 'practice',
            difficulty: 'practice',
            activity_type: 'multiple_choice',
            title: isTagalog ? 'Gawain 3: Paglalapat ng Kasanayan' : "Practice 3: Application Drill",
            instructions: isTagalog ? 'Tukuyin ang pinakatamang pamamaraan sa sitwasyong ito.' : 'Identify the most accurate approach for this scenario.',
            points: 10,
            question_data: {
                question: isTagalog
                    ? `Kapag ikaw ay nagbabasa o naglutas ng gawain, ano ang pinakamahalagang unang hakbang?`
                    : `When reading or solving a task, what is the most important first step?`,
                options: isTagalog
                    ? [
                        'A) Unawain nang mabuti ang hinihingi bago sumagot',
                        'B) Isulat agad ang unang maisip nang hindi nagbabasa',
                        'C) Iasa sa katabi ang pagsagot',
                        'D) Huwag basahin ang panuto'
                    ]
                    : [
                        'A) Understand carefully what is being asked before answering',
                        'B) Write the first thing that comes to mind without reading',
                        'C) Rely on others without trying yourself',
                        'D) Skip reading the instructions'
                    ]
            },
            correct_answers: { answer: 'A' }
        },
        // Activity 4: Practice 4 - Concept Distinction
        {
            day_number: 3,
            section_type: 'practice',
            difficulty: 'practice',
            activity_type: 'multiple_choice',
            title: isTagalog ? 'Gawain 4: Wastong Pagpili' : "Practice 4: Concept Distinction",
            instructions: isTagalog ? 'Piliin ang pinakamainam na hakbang sa pagsasagawa ng aralin.' : 'Choose the best step in carrying out this learning area.',
            points: 10,
            question_data: {
                question: isTagalog
                    ? `Alin sa mga sumusunod ang nagpapakita ng tunay na pagkaunawa sa ${safeStrand}?`
                    : `Which of the following shows true understanding of ${safeStrand}?`,
                options: isTagalog
                    ? [
                        'A) Naipaliliwanag at nagagamit ito sa pang-araw-araw na gawain',
                        'B) Kinakabisa lamang ang salita nang walang pag-unawa',
                        'C) Nakakalimutan agad pagkatapos ng klase',
                        'D) Hindi ito maipaliwanag sa iba'
                    ]
                    : [
                        'A) Being able to explain and apply it in everyday activities',
                        'B) Memorizing words without knowing what they mean',
                        'C) Forgetting it immediately after class',
                        'D) Inability to demonstrate or use the skill'
                    ]
            },
            correct_answers: { answer: 'A' }
        },
        // Activity 5: Practice 5 - Values & Reflection
        {
            day_number: 3,
            section_type: 'practice',
            difficulty: 'basic',
            activity_type: 'true_false',
            title: isTagalog ? 'Gawain 5: Tama o Mali - Pagsasabuhay' : "Practice 5: Real-Life Reflection",
            instructions: isTagalog ? 'Pindutin ang TAMA kung ang pahayag ay totoo, o MALI kung hindi.' : 'Choose TRUE if the statement is correct, or FALSE if it is not.',
            points: 10,
            question_data: {
                statement: isTagalog
                    ? `Ang batang matiyagang nag-aaral at nagtatanong sa guro kung may hindi naintindihan ay patuloy na nagtatagumpay.`
                    : `A learner who is patient and asks the teacher for guidance when confused will continue to succeed.`
            },
            correct_answers: { answer: 'true' }
        },
        // Activity 6: Play - Star Quest (5 Pairs)
        {
            day_number: 4,
            section_type: 'play',
            difficulty: 'practice',
            activity_type: 'mini_game',
            title: isTagalog ? 'Laruin at Matuto: Star Quest (5 Hamon)' : "Let's Play: Star Quest (5 Pairs)",
            instructions: isTagalog ? 'Ipares ang 5 tamang hakbang upang mapanalunan ang lahat ng gintong bituin!' : 'Match all 5 pairs to power up your spaceship and earn stars!',
            points: 15,
            question_data: {
                game_type: 'star_match',
                prompt: isTagalog ? 'Ipares ang 5 hakbang sa tamang katapat nito:' : 'Match the 5 concepts with their correct real-life applications:',
                pairs: [
                    { left: isTagalog ? 'Hakbang 1: Pagmasdan' : 'Step 1: Observe', right: isTagalog ? 'Gamitin ang pandama at pansin' : 'Use your senses carefully' },
                    { left: isTagalog ? 'Hakbang 2: Tukuyin' : 'Step 2: Identify', right: isTagalog ? 'Pangalanan ang mga mahalagang bahagi' : 'Name the key components' },
                    { left: isTagalog ? 'Hakbang 3: Unawain' : 'Step 3: Understand', right: isTagalog ? 'Isipin ang kahulugan ng aralin' : 'Reflect on what it means' },
                    { left: isTagalog ? 'Hakbang 4: Magplano' : 'Step 4: Plan', right: isTagalog ? 'Pumili ng tamang estratehiya' : 'Choose the best method' },
                    { left: isTagalog ? 'Hakbang 5: Isagawa' : 'Step 5: Apply', right: isTagalog ? 'Ipakita ang natutuhang husay' : 'Demonstrate your mastery' }
                ]
            },
            correct_answers: {
                matches: { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4' }
            }
        },
        // Activity 7: Challenge Me
        {
            day_number: 4,
            section_type: 'challenge',
            difficulty: 'challenge',
            activity_type: 'multiple_choice',
            title: isTagalog ? 'Subukin ang Husay: Hamon sa Pag-iisip' : 'Challenge Me: Critical Thinking',
            instructions: isTagalog ? 'Suriin nang mabuti ang sitwasyon at piliin ang pinakamahusay na solusyon.' : 'Analyze the scenario carefully and choose the best solution.',
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
                        'D) Avoid taking part in group activities'
                    ]
            },
            correct_answers: { answer: 'A' }
        },
        // Activity 8: Show What You Know (5 Questions)
        {
            day_number: 5,
            section_type: 'show_know',
            difficulty: 'practice',
            activity_type: 'assessment',
            title: isTagalog ? 'Pagsusulit: Ipakita ang Natutuhan (5 Aytem)' : 'Show What You Know: 5-Question Assessment',
            instructions: isTagalog ? 'Sagutin ang 5 aytem ng pagsusulit upang masukat ang iyong buong galing ngayong linggo.' : 'Answer all 5 questions to earn your mastery trophy for this week.',
            points: 20,
            question_data: {
                questions: [
                    {
                        id: 'q1',
                        text: isTagalog ? '1. Ano ang pangunahing aral na dapat mong tandaan mula sa linggong ito?' : '1. What is the central lesson you should remember from this week?',
                        options: isTagalog 
                            ? ['A) Ang sipag, tiyaga, at tamang pamamaraan ay nagbubunga ng tagumpay', 'B) Hindi mahalaga ang pag-aaral', 'C) Mas mainam ang manghula nang mabilis', 'D) Umiwas sa paggawa']
                            : ['A) Diligence, careful practice, and good methods lead to true mastery', 'B) Learning does not matter', 'C) It is better to just guess randomly', 'D) Avoid working altogether'],
                        correct: 'A'
                    },
                    {
                        id: 'q2',
                        text: isTagalog ? '2. Paano mo maipakikita ang kahusayan sa araling ito araw-araw?' : '2. How can you demonstrate your mastery in daily life?',
                        options: isTagalog
                            ? ['A) Sa pamamagitan ng paglalapat nito sa bahay, paaralan, at komunidad', 'B) Sa pamamagitan ng pagkalimot rito', 'C) Sa pamamagitan ng hindi pakikinig', 'D) Sa pananahimik lagi']
                            : ['A) By applying what I learned at home, in class, and in our community', 'B) By forgetting it immediately', 'C) By refusing to listen to others', 'D) By staying silent always'],
                        correct: 'A'
                    },
                    {
                        id: 'q3',
                        text: isTagalog ? '3. Kapag may nakaharap kang mahirap na gawain o tanong, ano ang tamang hakbang?' : '3. When facing a challenging problem or question, what is the best step?',
                        options: isTagalog
                            ? ['A) Balikan ang mga halimbawa at humingi ng payo sa guro o magulang', 'B) Sumuko agad at magalit', 'C) Iwanang walang sagot ang papel', 'D) Kopyahin ang sagot ng iba']
                            : ['A) Review the examples and ask guidance from the teacher or parents', 'B) Give up immediately and be upset', 'C) Leave the worksheet completely blank', 'D) Copy someone else without trying'],
                        correct: 'A'
                    },
                    {
                        id: 'q4',
                        text: isTagalog ? `4. Bakit mahalagang matutuhan nang wasto ang mga kasanayan sa ${gradeLevel}?` : `4. Why is it important to learn ${gradeLevel} competencies thoroughly?`,
                        options: isTagalog
                            ? ['A) Dahil ito ang matibay na pundasyon para sa mas mataas na antas ng pag-aaral', 'B) Dahil wala nang ibang magagawa sa paaralan', 'C) Para lamang matapos ang oras', 'D) Hindi ito makatutulong sa hinaharap']
                            : ['A) Because it serves as a strong foundation for higher learning levels', 'B) Because there is nothing else to do at school', 'C) Just to pass the time', 'D) It will not help in the future'],
                        correct: 'A'
                    },
                    {
                        id: 'q5',
                        text: isTagalog ? '5. Alin sa mga sumusunod ang nagpapakita ng magandang asal bilang mag-aaral ng San Vicente ES?' : '5. Which of the following reflects good conduct as a learner of San Vicente ES?',
                        options: isTagalog
                            ? ['A) Pagiging masigasig, magalang, at matulungin sa kapwa bata', 'B) Pagiging makasarili sa silid-aralan', 'C) Hindi pagrespeto sa mga alituntunin', 'D) Pagliban nang walang dahilan']
                            : ['A) Being diligent, respectful, and helpful to classmates', 'B) Being selfish in the classroom', 'C) Disrespecting school rules', 'D) Being absent without valid reason'],
                        correct: 'A'
                    }
                ]
            },
            correct_answers: { q1: 'A', q2: 'A', q3: 'A', q4: 'A', q5: 'A' }
        }
    ];

    return {
        lesson: {
            day_number: 1,
            title: learnTitle,
            explanation_learn: learnExplanation,
            explore_story: exploreStory,
            explore_examples: JSON.stringify(exploreExamples),
            illustrations: JSON.stringify(illustrations)
        },
        activities
    };
}

module.exports = { generateModuleContent };
