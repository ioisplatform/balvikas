export interface PdfPageMeta {
  page: number;
  section: "intro" | "hindi" | "english" | "gk" | "math" | "plans";
  sectionTitleHi: string;
  titleHi: string;
  titleEn: string;
  badge: string;
}

export const PDF_PAGES_META: PdfPageMeta[] = [
  // Page 1: Cover & Intro
  {
    page: 1,
    section: "intro",
    sectionTitleHi: "प्राथमिक परिचय व प्रतिज्ञा",
    titleHi: "IOIS बाल विकास डिजिटल अध्ययन किट (कक्षा 1 से 5)",
    titleEn: "Cover Page & National Pledge",
    badge: "Cover Page",
  },
  // Pages 2-3: Swar
  {
    page: 2,
    section: "hindi",
    sectionTitleHi: "हिंदी स्वर ज्ञान (भाग 1)",
    titleHi: "स्वर वर्णमाला: अ, आ, इ, ई (सचित्र व तुकबंदी)",
    titleEn: "Hindi Vowels Part 1 (A, Aa, I, Ee)",
    badge: "Swar Part 1",
  },
  {
    page: 3,
    section: "hindi",
    sectionTitleHi: "हिंदी स्वर ज्ञान (भाग 2)",
    titleHi: "स्वर वर्णमाला: उ, ऊ, ऋ, ए, ऐ, ओ, औ, अं, अः व मात्राएं",
    titleEn: "Hindi Vowels Part 2 & Matra Chart",
    badge: "Swar Part 2",
  },
  // Page 4: Vyanjan Part 1
  {
    page: 4,
    section: "hindi",
    sectionTitleHi: "हिंदी व्यंजन (क वर्ग व च वर्ग)",
    titleHi: "व्यंजन वर्ण: क, ख, ग, घ, ङ • च, छ, ज, झ, ञ",
    titleEn: "Hindi Consonants Ka-Varga & Cha-Varga",
    badge: "Vyanjan 1",
  },
  // Page 5: Good English Part 1
  {
    page: 5,
    section: "english",
    sectionTitleHi: "Good English Primer (A to E)",
    titleHi: "English Alphabet Aa to Ee (4-Line Copybook & Phonics)",
    titleEn: "Alphabet Aa-Ee with 4-Line Ruling",
    badge: "English 1",
  },
  // Page 6: Vyanjan Ta-Varga
  {
    page: 6,
    section: "hindi",
    sectionTitleHi: "हिंदी व्यंजन (ट वर्ग)",
    titleHi: "व्यंजन वर्ण: ट, ठ, ड, ढ, ण (सचित्र अभ्यास)",
    titleEn: "Consonants Ta-Varga (Ta, Tha, Da, Dha, Na)",
    badge: "Vyanjan 2",
  },
  // Page 7: Vyanjan Ta2-Varga
  {
    page: 7,
    section: "hindi",
    sectionTitleHi: "हिंदी व्यंजन (त वर्ग)",
    titleHi: "व्यंजन वर्ण: त, थ, द, ध, न (सचित्र अभ्यास)",
    titleEn: "Consonants Ta-Varga (Dental)",
    badge: "Vyanjan 3",
  },
  // Page 8: Vyanjan Pa-Varga
  {
    page: 8,
    section: "hindi",
    sectionTitleHi: "हिंदी व्यंजन (प वर्ग)",
    titleHi: "व्यंजन वर्ण: प, फ, ब, भ, म (सचित्र अभ्यास)",
    titleEn: "Consonants Pa-Varga (Pa, Pha, Ba, Bha, Ma)",
    badge: "Vyanjan 4",
  },
  // Page 9: Vyanjan Antastha & Ushma
  {
    page: 9,
    section: "hindi",
    sectionTitleHi: "अन्तःस्थ व ऊष्म व्यंजन",
    titleHi: "वर्ण: य, र, ल, व • श, ष, स, ह",
    titleEn: "Consonants Ya, Ra, La, Va & Sha, Sa, Ha",
    badge: "Vyanjan 5",
  },
  // Page 10: Sanyukt Vyanjan
  {
    page: 10,
    section: "hindi",
    sectionTitleHi: "संयुक्त व्यंजन व अतिरिक्त वर्ण",
    titleHi: "संयुक्त वर्ण: क्ष, त्र, ज्ञ, श्र व ड़, ढ़",
    titleEn: "Combined Consonants Ksha, Tra, Gya, Shra",
    badge: "Sanyukt",
  },
  // Page 11: 2-Letter Words
  {
    page: 11,
    section: "hindi",
    sectionTitleHi: "दो अक्षर के अमात्रिक शब्द",
    titleHi: "सरल शब्द रचना: नल, घर, जल, फल, बस, रथ, खत",
    titleEn: "2-Letter Non-Matra Hindi Words",
    badge: "2-Letter Words",
  },
  // Page 12: 3-Letter Words
  {
    page: 12,
    section: "hindi",
    sectionTitleHi: "तीन अक्षर के अमात्रिक शब्द",
    titleHi: "सरल शब्द रचना: कमल, मटर, कलश, कलम, सड़क, भवन",
    titleEn: "3-Letter Non-Matra Hindi Words",
    badge: "3-Letter Words",
  },
  // Page 13: 4-Letter Words
  {
    page: 13,
    section: "hindi",
    sectionTitleHi: "चार अक्षर के अमात्रिक शब्द",
    titleHi: "सरल शब्द रचना: अचकन, बरगद, कसरत, उपवन, शलजम",
    titleEn: "4-Letter Non-Matra Hindi Words",
    badge: "4-Letter Words",
  },
  // Page 14: Aa Ki Matra
  {
    page: 14,
    section: "hindi",
    sectionTitleHi: "आ (ा) की मात्रा का ज्ञान",
    titleHi: "मात्रा अभ्यास: आम, कान, नाक, हाथ, तारा, राजा, बाजा",
    titleEn: "Aa Matra Words & Sentence Reading",
    badge: "Aa Matra",
  },
  // Page 15: I and Ee Ki Matra
  {
    page: 15,
    section: "hindi",
    sectionTitleHi: "इ (ि) व ई (ी) की मात्रा",
    titleHi: "मात्रा अभ्यास: दिन, रवि, कवि, नदी, घड़ी, मछली, हाथी",
    titleEn: "Short and Long 'i' Matra Words",
    badge: "I & Ee Matra",
  },
  // Page 16: U and Oo Ki Matra
  {
    page: 16,
    section: "hindi",
    sectionTitleHi: "उ (ु) व ऊ (ू) की मात्रा",
    titleHi: "मात्रा अभ्यास: पुल, मुकुट, साबुन, फूल, भालू, सूरज",
    titleEn: "Short and Long 'u' Matra Words",
    badge: "U & Oo Matra",
  },
  // Page 17: E and Ai Ki Matra
  {
    page: 17,
    section: "hindi",
    sectionTitleHi: "ए (े) व ऐ (ै) की मात्रा",
    titleHi: "मात्रा अभ्यास: सेब, केला, पेड़, शेर, पैसा, बैल, मैना",
    titleEn: "E and Ai Matra Words",
    badge: "E & Ai Matra",
  },
  // Page 18: O and Au Ki Matra
  {
    page: 18,
    section: "hindi",
    sectionTitleHi: "ओ (ो) व औ (ौ) की मात्रा",
    titleHi: "मात्रा अभ्यास: मोर, तोता, ढोलक, पौधा, नौका, खिलौना",
    titleEn: "O and Au Matra Words",
    badge: "O & Au Matra",
  },
  // Page 19: Anuswar & Chandrabindu
  {
    page: 19,
    section: "hindi",
    sectionTitleHi: "अनुस्वार (ं) व अनुनासिक (ँ)",
    titleHi: "बिंदु व चंद्रबिंदु: अंगूर, पंख, शंख, आँख, चाँद, दाँत",
    titleEn: "Anuswar & Chandrabindu Words",
    badge: "Nasal Matras",
  },
  // Page 20: Barakhadi Chart
  {
    page: 20,
    section: "hindi",
    sectionTitleHi: "हिंदी बारहखड़ी चार्ट",
    titleHi: "व्यंजनों पर संपूर्ण 12 मात्राओं का क्रमबद्ध चार्ट",
    titleEn: "Complete Hindi Barakhadi Chart",
    badge: "Barakhadi",
  },
  // Pages 21-24: Good English F to Z
  {
    page: 21,
    section: "english",
    sectionTitleHi: "Good English Primer (F to J)",
    titleHi: "Alphabet Ff to Jj (4-Line Ruling & Phonics)",
    titleEn: "English Ff to Jj with Handwriting Lines",
    badge: "English 2",
  },
  {
    page: 22,
    section: "english",
    sectionTitleHi: "Good English Primer (K to O)",
    titleHi: "Alphabet Kk to Oo (4-Line Ruling & Phonics)",
    titleEn: "English Kk to Oo with Handwriting Lines",
    badge: "English 3",
  },
  {
    page: 23,
    section: "english",
    sectionTitleHi: "Good English Primer (P to T)",
    titleHi: "Alphabet Pp to Tt (4-Line Ruling & Phonics)",
    titleEn: "English Pp to Tt with Handwriting Lines",
    badge: "English 4",
  },
  {
    page: 24,
    section: "english",
    sectionTitleHi: "Good English Primer (U to Z)",
    titleHi: "Alphabet Uu to Zz (4-Line Ruling & Phonics)",
    titleEn: "English Uu to Zz with Handwriting Lines",
    badge: "English 5",
  },
  // Page 25: Vowel Sounds
  {
    page: 25,
    section: "english",
    sectionTitleHi: "English Phonics & Vowels",
    titleHi: "5 Vowels (A, E, I, O, U) Short & Long Sounds",
    titleEn: "Phonics Vowel Sounds Course",
    badge: "Phonics Vowels",
  },
  // Page 26: 3-Letter Rhyming Words
  {
    page: 26,
    section: "english",
    sectionTitleHi: "3-Letter Rhyming Word Families",
    titleHi: "Rhyming Families: -at, -en, -in, -op, -ug Families",
    titleEn: "3-Letter CVC Word Families",
    badge: "Rhyme Families",
  },
  // Page 27: Sight Words & Sentences
  {
    page: 27,
    section: "english",
    sectionTitleHi: "Sight Words & Simple Sentences",
    titleHi: "प्राथमिक अंग्रेजी पठन: This, That, Is, Are, My, Your",
    titleEn: "Sight Words & Early Reader Sentences",
    badge: "Sight Words",
  },
  // Pages 28-34: GK Part 1
  {
    page: 28,
    section: "gk",
    sectionTitleHi: "सचित्र सामान्य ज्ञान: फल (Fruits)",
    titleHi: "मीठे व रसीले फल: आम, सेब, केला, अंगूर, संतरा, पपीता",
    titleEn: "Fruits Vocabulary (Hindi & English)",
    badge: "GK Fruits",
  },
  {
    page: 29,
    section: "gk",
    sectionTitleHi: "सचित्र सामान्य ज्ञान: सब्जियां (Vegetables)",
    titleHi: "पौष्टिक सब्जियां: आलू, टमाटर, मटर, प्याज, बैंगन, गाजर",
    titleEn: "Vegetables Vocabulary (Hindi & English)",
    badge: "GK Veggies",
  },
  {
    page: 30,
    section: "gk",
    sectionTitleHi: "सचित्र सामान्य ज्ञान: फूल (Flowers)",
    titleHi: "सुगंधित फूल: कमल, गुलाब, गेंदा, सूरजमुखी, चमेली",
    titleEn: "Flowers Vocabulary (Hindi & English)",
    badge: "GK Flowers",
  },
  {
    page: 31,
    section: "gk",
    sectionTitleHi: "सचित्र सामान्य ज्ञान: पालतू पशु",
    titleHi: "घरेलू पशु: गाय, भैंस, बकरी, घोड़ा, कुत्ता, बिल्ली",
    titleEn: "Domestic Animals (Hindi & English)",
    badge: "Domestic Animals",
  },
  {
    page: 32,
    section: "gk",
    sectionTitleHi: "सचित्र सामान्य ज्ञान: जंगली जानवर",
    titleHi: "वन्य जीव: शेर, बाघ, हाथी, भालू, चीता, हिरण, बंदर",
    titleEn: "Wild Animals (Hindi & English)",
    badge: "Wild Animals",
  },
  {
    page: 33,
    section: "gk",
    sectionTitleHi: "सचित्र सामान्य ज्ञान: पक्षी (Birds)",
    titleHi: "सुंदर पक्षी: मोर, तोता, कबूतर, चिड़िया, बत्तख, चील",
    titleEn: "Birds Vocabulary (Hindi & English)",
    badge: "GK Birds",
  },
  {
    page: 34,
    section: "gk",
    sectionTitleHi: "जलचर व कीट-पतंगे",
    titleHi: "जल व थल के जीव: मछली, कछुआ, मेंढक, तितली, मधुमक्खी",
    titleEn: "Aquatic Life & Insects",
    badge: "Aquatic & Insects",
  },
  // Pages 35-41: GK Part 2
  {
    page: 35,
    section: "gk",
    sectionTitleHi: "यातायात के साधन (Vehicles)",
    titleHi: "परिवहन साधन: साइकिल, बाइक, कार, बस, ट्रेन, हवाई जहाज",
    titleEn: "Vehicles & Transportation",
    badge: "Vehicles",
  },
  {
    page: 36,
    section: "gk",
    sectionTitleHi: "मानव शरीर के अंग (Body Parts)",
    titleHi: "शरीर के अंग: आँख, कान, नाक, मुँह, हाथ, पैर, दाँत",
    titleEn: "Human Body Parts with Uses",
    badge: "Body Parts",
  },
  {
    page: 37,
    section: "gk",
    sectionTitleHi: "रंग व आकृतियां (Colors & Shapes)",
    titleHi: "प्राथमिक रंग: लाल, पीला, नीला व वृत्त, वर्ग, त्रिभुज",
    titleEn: "Colors & Geometric Shapes",
    badge: "Colors & Shapes",
  },
  {
    page: 38,
    section: "gk",
    sectionTitleHi: "ऋतुएं व मौसम (Seasons & Weather)",
    titleHi: "भारतीय ऋतुएं: ग्रीष्म, वर्षा, शीत, वसंत व दैनिक मौसम",
    titleEn: "Seasons and Weather Types",
    badge: "Seasons",
  },
  {
    page: 39,
    section: "gk",
    sectionTitleHi: "सप्ताह के 7 दिन (Days of the Week)",
    titleHi: "दिनों के नाम: सोमवार से रविवार (Hindi & English)",
    titleEn: "7 Days of the Week & Schedule",
    badge: "Days of Week",
  },
  {
    page: 40,
    section: "gk",
    sectionTitleHi: "वर्ष के 12 महीने (Months of the Year)",
    titleHi: "कैलेंडर ज्ञान: जनवरी से दिसंबर व भारतीय चैत्र-फाल्गुन",
    titleEn: "12 Months of the Year",
    badge: "Months",
  },
  {
    page: 41,
    section: "gk",
    sectionTitleHi: "हमारे सहायक (Community Helpers)",
    titleHi: "समाज के सहायक: शिक्षक, डॉक्टर, पुलिस, किसान, सैनिक",
    titleEn: "Community Helpers & Occupations",
    badge: "Helpers",
  },
  // Pages 42-45: Math
  {
    page: 42,
    section: "math",
    sectionTitleHi: "1 से 100 तक गिनती चार्ट",
    titleHi: "अंक ज्ञान: 1 से 100 तक देवनागरी, अंक व अंग्रेजी शब्द",
    titleEn: "Counting Chart 1 to 100",
    badge: "Counting 1-100",
  },
  {
    page: 43,
    section: "math",
    sectionTitleHi: "गणित पहाड़े (1 से 10 तक)",
    titleHi: "पहाड़ा तालिका: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 पहाड़े",
    titleEn: "Multiplication Tables 1 to 10",
    badge: "Tables 1-10",
  },
  {
    page: 44,
    section: "math",
    sectionTitleHi: "गणित पहाड़े (11 से 20 तक)",
    titleHi: "पहाड़ा तालिका: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 पहाड़े",
    titleEn: "Multiplication Tables 11 to 20",
    badge: "Tables 11-20",
  },
  {
    page: 45,
    section: "math",
    sectionTitleHi: "जोड़, घटाव, गुणा व घड़ी का समय",
    titleHi: "प्रारंभिक गणित संक्रियाएं एवं घड़ी देखने का अभ्यास",
    titleEn: "Addition, Subtraction & Reading Clock Time",
    badge: "Math Operations",
  },
  // Pages 46-48: Plans & Mission
  {
    page: 46,
    section: "plans",
    sectionTitleHi: "IOIS आधिकारिक 7 प्लान्स तालिका",
    titleHi: "₹10 से ₹999 प्लान्स, लाइफटाइम एक्सेस व 50% से 70% पेआउट",
    titleEn: "IOIS 7 Membership Plans & Commission Rates",
    badge: "7 Official Plans",
  },
  {
    page: 47,
    section: "plans",
    sectionTitleHi: "डिजिटल ID कार्ड व UTR सत्यापन",
    titleHi: "डिजिटल सदस्यता आईडी कार्ड, UTR पेमेंट प्रक्रिया व नियम",
    titleEn: "Digital Member ID Card & UTR Process",
    badge: "Digital ID Card",
  },
  {
    page: 48,
    section: "plans",
    sectionTitleHi: "स्वावलंबन संकल्प व हेल्पलाइन",
    titleHi: "IOIS बाल विकास मंच संकल्प पत्र व आधिकारिक हेल्पलाइन",
    titleEn: "Bal Vikas Mission Pledge & 24x7 Support",
    badge: "Mission Pledge",
  },
];
