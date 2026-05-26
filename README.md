older code 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aushadhi - Indian Drug Interaction Checker</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background-color: #2563eb;
            color: white;
            padding: 20px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
        }

        .logo span {
            color: #bfff00;
        }

        nav ul {
            display: flex;
            list-style: none;
        }

        nav ul li {
            margin-left: 20px;
        }

        nav ul li a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        nav ul li a:hover {
            opacity: 0.8;
        }

        .hero {
            text-align: center;
            padding: 60px 0;
            background-color: white;
            margin-bottom: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #2563eb;
        }

        .hero p {
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto 30px;
            color: #555;
        }

        .search-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }

        .search-input {
            width: 60%;
            padding: 12px 20px;
            border: 2px solid #ddd;
            border-radius: 30px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }

        .search-input:focus {
            border-color: #2563eb;
        }

        .search-button {
            padding: 12px 25px;
            margin-left: 10px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .search-button:hover {
            background-color: #1d4ed8;
        }

        .medicine-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 25px;
            margin-bottom: 30px;
            display: none;
        }

        .medicine-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .medicine-image {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            object-fit: cover;
            margin-right: 25px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .medicine-info h2 {
            font-size: 1.8rem;
            color: #2563eb;
            margin-bottom: 10px;
        }

        .medicine-info p {
            color: #555;
            margin-bottom: 5px;
        }

        .medicine-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .detail-section {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
        }

        .detail-section h3 {
            color: #2563eb;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }

        .interaction-checker {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 25px;
            margin-bottom: 30px;
            display: none;
        }

        .interaction-checker h2 {
            font-size: 1.5rem;
            color: #2563eb;
            margin-bottom: 20px;
        }

        .interaction-form {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 10px;
            margin-bottom: 20px;
        }

        .interaction-form input[type="text"] {
            padding: 12px 20px;
            border: 2px solid #ddd;
            border-radius: 30px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
        }

        .interaction-form input[type="text"]:focus {
            border-color: #2563eb;
        }

        .interaction-form button {
            padding: 12px 25px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .interaction-form button:hover {
            background-color: #1d4ed8;
        }

        .interaction-result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }

        .safe {
            background-color: #e6ffec;
            border-left: 5px solid #2ecc71;
        }

        .unsafe {
            background-color: #ffe6e6;
            border-left: 5px solid #e74c3c;
        }

        .alternatives {
            margin-top: 15px;
        }

        .alternatives ul {
            list-style-position: inside;
            margin-left: 10px;
        }

        .user-profile {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 25px;
            margin-bottom: 30px;
            display: none;
        }

        .user-profile h2 {
            font-size: 1.5rem;
            color: #2563eb;
            margin-bottom: 20px;
        }

        .profile-form label {
            display: block;
            margin-bottom: 10px;
            font-weight: 500;
        }

        .profile-form input,
        .profile-form select,
        .profile-form textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .profile-form input:focus,
        .profile-form select:focus,
        .profile-form textarea:focus {
            border-color: #2563eb;
            outline: none;
        }

        .profile-form button {
            padding: 12px 25px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        .profile-form button:hover {
            background-color: #1d4ed8;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        .modal-content h2 {
            color: #e74c3c;
            margin-bottom: 15px;
        }

        .modal-content p {
            margin-bottom: 20px;
            font-size: 16px;
        }

        .modal-content button {
            padding: 10px 20px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        }

        footer {
            background-color: #2563eb;
            color: white;
            text-align: center;
            padding: 20px 0;
            margin-top: 50px;
        }

        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                text-align: center;
            }

            nav ul {
                margin-top: 15px;
                justify-content: center;
            }

            nav ul li {
                margin: 0 10px;
            }

            .search-container {
                flex-direction: column;
                align-items: center;
            }

            .search-input {
                width: 90%;
                margin-bottom: 10px;
            }

            .search-button {
                margin-left: 0;
                width: 90%;
            }

            .medicine-header {
                flex-direction: column;
                text-align: center;
            }

            .medicine-image {
                margin-right: 0;
                margin-bottom: 15px;
            }

            .interaction-form {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState } = React;

        // Medicine database with 30 common medicines
        const medicineDatabase = [
            {
                id: 1,
                name: "Acetaminophen (Tylenol)",
                uses: "Pain reliever and fever reducer",
                dosage: "Adults: 325-650 mg every 4-6 hours (max 4000 mg/day)",
                precautions: "Avoid alcohol, don't exceed max dose (liver damage risk)",
                sideEffects: "Liver damage with overdose, nausea, rash",
                alternatives: "Ibuprofen (if no kidney issues), Aspirin (if not contraindicated)",
                image: "https://placehold.co/400x400?text=Tylenol"
            },
            {
                id: 2,
                name: "Ibuprofen (Advil, Motrin)",
                uses: "Pain, fever, inflammation",
                dosage: "Adults: 200-400 mg every 4-6 hours (max 1200 mg/day)",
                precautions: "Avoid with stomach ulcers, kidney disease, or heart disease",
                sideEffects: "Stomach pain, heartburn, dizziness, kidney damage with prolonged use",
                alternatives: "Acetaminophen (for pain/fever), Naproxen (for inflammation)",
                image: "https://placehold.co/400x400?text=Advil"
            },
            {
                id: 3,
                name: "Lisinopril (Prinivil, Zestril)",
                uses: "High blood pressure, heart failure",
                dosage: "Usually 10-40 mg once daily",
                precautions: "Avoid potassium supplements/salt substitutes",
                sideEffects: "Dry cough, dizziness, high potassium",
                alternatives: "Losartan (if cough develops), Amlodipine",
                image: "https://placehold.co/400x400?text=Lisinopril"
            },
            {
                id: 4,
                name: "Brivaracetam (Brivazen)",
                uses: "Anti Epileptic",
                dosage: "As suggested by a Doctor[Generally twice a Day]",
                precautions: "Avoid alcohol,Not suggested for patients with liver diseases",
                sideEffects: "Agitation, Aggression, Might affect Vission, Dizziness, Sedation, Neuropsychiatricsystem",
                alternatives: "Levetiracetam, Briviact",
                image: "https://placehold.co/400x400?text=Brivazen"
            },
            {
                id: 5,
                name: "Acetaminophen (Dolo)",
                uses: "Pain relief, Controls fever",
                dosage: "Usually 650 mg every 6 hours, thrice a day for an adult",
                precautions: "Severe liver and kidney disease patients should avoid",
                sideEffects: "Fatigue, Gastrointestinal Bleeding, Dizziness, Nausea, Vomiting, Weakness",
                alternatives: "Crocin, Calpol, Doliprane",
                image: "https://placehold.co/400x400?text=Dolo"
            },
            {
                id: 6,
                name: "Omeprazole (Prilosec)",
                uses: "GERD, stomach ulcers",
                dosage: "20-40 mg once daily before breakfast",
                precautions: "Long-term use may cause bone loss, low magnesium",
                sideEffects: "Headache, diarrhea, abdominal pain",
                alternatives: "Famotidine (Pepcid), calcium antacids",
                image: "https://placehold.co/400x400?text=Prilosec"
            },
            {
                id: 7,
                name: "Albuterol (Ventolin, ProAir)",
                uses: "Asthma, COPD symptoms",
                dosage: "1-2 puffs every 4-6 hours as needed",
                precautions: "Overuse can worsen asthma",
                sideEffects: "Rapid heartbeat, tremor, nervousness",
                alternatives: "Levalbuterol (Xopenex), Salmeterol (long-acting)",
                image: "https://placehold.co/400x400?text=Ventolin"
            },
            {
                id: 8,
                name: "Levothyroxine (Synthroid)",
                uses: "Hypothyroidism",
                dosage: "Dose varies by patient (typically 25-200 mcg daily)",
                precautions: "Take on empty stomach, don't take with calcium/iron",
                sideEffects: "Heart palpitations (if dose too high), hair loss (temporary)",
                alternatives: "Natural thyroid extracts (but not FDA-approved)",
                image: "https://placehold.co/400x400?text=Synthroid"
            },
            {
                id: 9,
                name: "Sertraline (Zoloft)",
                uses: "Depression, anxiety",
                dosage: "25-200 mg once daily",
                precautions: "Don't stop abruptly, may increase suicidal thoughts early on",
                sideEffects: "Nausea, insomnia, sexual dysfunction",
                alternatives: "Escitalopram (Lexapro), Fluoxetine (Prozac)",
                image: "https://placehold.co/400x400?text=Zoloft"
            },
            {
                id: 10,
                name: "Amoxicillin",
                uses: "Bacterial infections",
                dosage: "250-500 mg every 8 hours (varies by infection)",
                precautions: "Finish entire course even if symptoms improve",
                sideEffects: "Diarrhea, rash, yeast infections",
                alternatives: "Augmentin (if broader spectrum needed), Cephalexin",
                image: "https://placehold.co/400x400?text=Amoxicillin"
            },
            {
                id: 11,
                name: "Hydrochlorothiazide",
                uses: "High blood pressure, fluid retention",
                dosage: "12.5-25 mg once daily",
                precautions: "Can cause dehydration, low potassium",
                sideEffects: "Increased urination, dizziness, muscle cramps",
                alternatives: "Chlorthalidone, Furosemide (for stronger effect)",
                image: "https://placehold.co/400x400?text=Hydrochlorothiazide"
            },
            {
                id: 12,
                name: "Prednisone",
                uses: "Inflammation, autoimmune conditions",
                dosage: "Dose varies widely by condition",
                precautions: "Don't stop abruptly, increases infection risk",
                sideEffects: "Increased appetite, insomnia, mood swings",
                alternatives: "Methylprednisolone, topical steroids if localized",
                image: "https://placehold.co/400x400?text=Prednisone"
            },
            {
                id: 13,
                name: "Tramadol (Ultram)",
                uses: "Moderate pain",
                dosage: "50-100 mg every 6 hours as needed",
                precautions: "Can be addictive, risk increases with alcohol",
                sideEffects: "Dizziness, nausea, constipation",
                alternatives: "Acetaminophen/codeine, physical therapy approaches",
                image: "https://placehold.co/400x400?text=Tramadol"
            },
            {
                id: 14,
                name: "Warfarin (Coumadin)",
                uses: "Blood thinner (prevents clots)",
                dosage: "Dose varies based on INR",
                precautions: "Avoid vitamin K-rich foods (consistent intake)",
                sideEffects: "Bleeding (mouth/gums), bruising easily",
                alternatives: "NOACs like apixaban (Eliquis) if appropriate",
                image: "https://placehold.co/400x400?text=Coumadin"
            },
            {
                id: 15,
                name: "Duloxetine (Cymbalta)",
                uses: "Depression, nerve pain",
                dosage: "30-60 mg once daily",
                precautions: "Don't stop abruptly, may worsen glaucoma",
                sideEffects: "Nausea, dry mouth, drowsiness",
                alternatives: "Venlafaxine (Effexor), Amitriptyline (for pain)",
                image: "https://placehold.co/400x400?text=Cymbalta"
            },
            {
                id: 16,
                name: "Montelukast (Singulair)",
                uses: "Asthma prevention, allergies",
                dosage: "10 mg once at bedtime",
                precautions: "Report mood/behavior changes",
                sideEffects: "Headache, stomach pain, bad dreams",
                alternatives: "Inhaled corticosteroids, antihistamines",
                image: "https://placehold.co/400x400?text=Singulair"
            },
            {
                id: 17,
                name: "Pantoprazole (Protonix)",
                uses: "GERD, stomach ulcers",
                dosage: "40 mg once daily",
                precautions: "Long-term use may cause vitamin deficiencies",
                sideEffects: "Headache, diarrhea, abdominal pain",
                alternatives: "Omeprazole, H2 blockers like famotidine",
                image: "https://placehold.co/400x400?text=Protonix"
            },
            {
                id: 18,
                name: "Fluoxetine (Prozac)",
                uses: "Depression, OCD",
                dosage: "20-80 mg once daily",
                precautions: "May interact with many medications",
                sideEffects: "Nausea, insomnia, sexual dysfunction",
                alternatives: "Sertraline (Zoloft), Escitalopram (Lexapro)",
                image: "https://placehold.co/400x400?text=Prozac"
            },
            {
                id: 19,
                name: "Cetirizine (Zyrtec)",
                uses: "Allergies",
                dosage: "10 mg once daily",
                precautions: "May cause drowsiness (less than older antihistamines)",
                sideEffects: "Drowsiness, dry mouth, headache",
                alternatives: "Loratadine (Claritin), Fexofenadine (Allegra)",
                image: "https://placehold.co/400x400?text=Zyrtec"
            },
            {
                id: 20,
                name: "Gabapentin (Neurontin)",
                uses: "Nerve pain, seizures",
                dosage: "300-1200 mg three times daily",
                precautions: "Avoid abrupt withdrawal (risk seizures)",
                sideEffects: "Dizziness, drowsiness, swelling",
                alternatives: "Pregabalin (Lyrica), Amitriptyline",
                image: "https://placehold.co/400x400?text=Gabapentin"
            },
            {
                id: 21,
                name: "Metoprolol (Lopressor)",
                uses: "High blood pressure, heart disease",
                dosage: "25-100 mg twice daily",
                precautions: "Don't stop abruptly, may worsen asthma",
                sideEffects: "Fatigue, slow heartbeat, dizziness",
                alternatives: "Atenolol, Carvedilol",
                image: "https://placehold.co/400x400?text=Metoprolol"
            },
            {
                id: 22,
                name: "Losartan (Cozaar)",
                uses: "High blood pressure",
                dosage: "25-100 mg once daily",
                precautions: "Avoid potassium supplements/salt substitutes",
                sideEffects: "Dizziness, muscle cramps, back pain",
                alternatives: "Valsartan, Telmisartan",
                image: "https://placehold.co/400x400?text=Losartan"
            },
            {
                id: 23,
                name: "Alprazolam (Xanax)",
                uses: "Anxiety, panic disorders",
                dosage: "0.25-0.5 mg three times daily",
                precautions: "High potential for dependence/addiction",
                sideEffects: "Drowsiness, dizziness, memory problems",
                alternatives: "Cognitive behavioral therapy, SSRIs for long-term",
                image: "https://placehold.co/400x400?text=Xanax"
            },
            {
                id: 24,
                name: "Citalopram (Celexa)",
                uses: "Depression",
                dosage: "20-40 mg once daily",
                precautions: "May cause heart rhythm changes at high doses",
                sideEffects: "Nausea, fatigue, dry mouth",
                alternatives: "Escitalopram (Lexapro), Sertraline (Zoloft)",
                image: "https://placehold.co/400x400?text=Celexa"
            },
            {
                id: 25,
                name: "Clopidogrel (Plavix)",
                uses: "Prevents blood clots after heart attack/stroke",
                dosage: "75 mg once daily",
                precautions: "Avoid with other blood thinners unless directed",
                sideEffects: "Easy bruising/bleeding, stomach pain",
                alternatives: "Ticagrelor (Brilinta), Aspirin",
                image: "https://placehold.co/400x400?text=Plavix"
            },
            {
                id: 26,
                name: "Escitalopram (Lexapro)",
                uses: "Depression, anxiety",
                dosage: "10-20 mg once daily",
                precautions: "May increase suicidal thoughts initially",
                sideEffects: "Nausea, insomnia, sexual dysfunction",
                alternatives: "Sertraline (Zoloft), Fluoxetine (Prozac)",
                image: "https://placehold.co/400x400?text=Lexapro"
            },
            {
                id: 27,
                name: "Simvastatin (Zocor)",
                uses: "High cholesterol",
                dosage: "5-40 mg once at bedtime",
                precautions: "Avoid grapefruit juice, risk muscle pain",
                sideEffects: "Muscle pain, headache, constipation",
                alternatives: "Atorvastatin (Lipitor), Rosuvastatin (Crestor)",
                image: "https://placehold.co/400x400?text=Simvastatin"
            },
            {
                id: 28,
                name: "Venlafaxine (Effexor)",
                uses: "Depression, anxiety",
                dosage: "75-225 mg daily",
                precautions: "Don't stop abruptly (withdrawal symptoms)",
                sideEffects: "Nausea, dizziness, increased blood pressure",
                alternatives: "Duloxetine (Cymbalta), Desvenlafaxine (Pristiq)",
                image: "https://placehold.co/400x400?text=Venlafaxine"
            },
            {
                id: 29,
                name: "Amlodipine (Norvasc)",
                uses: "High blood pressure, angina",
                dosage: "2.5-10 mg once daily",
                precautions: "May cause swelling in ankles/feet",
                sideEffects: "Swelling, dizziness, flushing",
                alternatives: "Nifedipine, Felodipine",
                image: "https://placehold.co/400x400?text=Amlodipine"
            },
            {
                id: 30,
                name: "Trazodone",
                uses: "Depression, insomnia",
                dosage: "50-150 mg at bedtime",
                precautions: "Can cause severe dizziness",
                sideEffects: "Drowsiness, dizziness, dry mouth",
                alternatives: "Mirtazapine (Remeron), Doxepin",
                image: "https://placehold.co/400x400?text=Trazodone"
            }
        ];

        // Drug-drug interactions database
        const interactionDatabase = [
            { med1: "Warfarin (Coumadin)", med2: "Acetaminophen (Tylenol)", severity: "moderate", description: "May increase bleeding risk with high doses of acetaminophen", alternatives: "Acetaminophen at lower doses (<2000 mg/day)" },
            { med1: "Warfarin (Coumadin)", med2: "Ibuprofen (Advil, Motrin)", severity: "high", description: "NSAIDs increase bleeding risk significantly", alternatives: "Acetaminophen at lower doses" },
            { med1: "Lisinopril (Prinivil, Zestril)", med2: "Ibuprofen (Advil, Motrin)", severity: "moderate", description: "May reduce blood pressure control and harm kidneys", alternatives: "Acetaminophen for pain relief" },
            { med1: "Metoprolol (Lopressor)", med2: "Albuterol (Ventolin, ProAir)", severity: "moderate", description: "Beta blocker may reduce bronchodilator effects", alternatives: "Ipratropium (Atrovent) as alternative bronchodilator" },
            { med1: "Sertraline (Zoloft)", med2: "Tramadol (Ultram)", severity: "high", description: "Increased risk of serotonin syndrome (confusion, fever, seizures)", alternatives: "Acetaminophen or physical therapy approaches" },
            { med1: "Fluoxetine (Prozac)", med2: "Tramadol (Ultram)", severity: "high", description: "Increased risk of serotonin syndrome", alternatives: "Acetaminophen or physical therapy approaches" },
            { med1: "Omeprazole (Prilosec)", med2: "Clopidogrel (Plavix)", severity: "moderate", description: "May reduce clopidogrel's effectiveness", alternatives: "Pantoprazole (Protonix) or famotidine (Pepcid)" },
            { med1: "Simvastatin (Zocor)", med2: "Amiodarone", severity: "high", description: "Increased risk of muscle damage (even at low simvastatin doses)", alternatives: "Pravastatin or rosuvastatin (Crestor)" },
            { med1: "Gabapentin (Neurontin)", med2: "Hydrocodone", severity: "moderate", description: "Increased risk of respiratory depression", alternatives: "Lower gabapentin dose or alternative pain med" },
            { med1: "Alprazolam (Xanax)", med2: "Alcohol", severity: "high", description: "Dangerous sedation, respiratory depression risk", alternatives: "Avoid alcohol, cognitive behavioral therapy" }
        ];

        function App() {
            const [searchTerm, setSearchTerm] = useState("");
            const [medicine, setMedicine] = useState(null);
            const [interactionMed, setInteractionMed] = useState("");
            const [interactionResult, setInteractionResult] = useState(null);
            const [showProfileModal, setShowProfileModal] = useState(false);
            const [medicalHistory, setMedicalHistory] = useState("");
            const [currentMeds, setCurrentMeds] = useState("");
            const [allergies, setAllergies] = useState("");
            const [lifestyle, setLifestyle] = useState("");
            const [showWarningModal, setShowWarningModal] = useState(true);

            const handleSearch = () => {
                const foundMedicine = medicineDatabase.find(med => 
                    med.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                
                if (foundMedicine) {
                    setMedicine(foundMedicine);
                    setInteractionResult(null);
                } else {
                    alert("Medicine not found in our database. Please try another name.");
                    setMedicine(null);
                }
            };

            const checkInteraction = () => {
                if (!medicine) return;
                
                let foundInteraction = null;
                
                // Check both directions
                for (const interaction of interactionDatabase) {
                    if ((interaction.med1 === medicine.name && interaction.med2 === interactionMed) || 
                        (interaction.med1 === interactionMed && interaction.med2 === medicine.name)) {
                        foundInteraction = interaction;
                        break;
                    }
                }
                
                if (foundInteraction) {
                    setInteractionResult({
                        severity: foundInteraction.severity,
                        description: foundInteraction.description,
                        alternatives: foundInteraction.alternatives
                    });
                } else {
                    setInteractionResult({
                        severity: "none",
                        description: "No significant interaction found between these medications.",
                        alternatives: ""
                    });
                }
            };

            const saveProfile = () => {
                alert("Your medical profile has been saved!");
                setShowProfileModal(false);
            };

            return (
                <div>
                    <header>
                        <div className="container header-content">
                            <div className="logo">Aushadhi</div>
                            <nav>
                                <ul>
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#profile" onClick={() => setShowProfileModal(true)}>Medical Profile</a></li>
                                    <li><a href="#about">About</a></li>
                                    <li><a href="#contact">Contact</a></li>
                                </ul>
                            </nav>
                        </div>
                    </header>

                    <main className="container">
                        <section className="hero">
                            <h1>Drug Interaction Checker</h1>
                            <p>Check potential interactions between medications and get personalized recommendations based on your medical profile.</p>
                            
                            <div className="search-container">
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Enter medicine name (e.g., Tylenol, Lipitor)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button className="search-button" onClick={handleSearch}>Search</button>
                            </div>
                        </section>

                        {medicine && (
                            <section className="medicine-card" style={{ display: 'block' }}>
                                <div className="medicine-header">
                                    <img src={medicine.image} alt={`${medicine.name} medication`} className="medicine-image" />
                                    <div className="medicine-info">
                                        <h2>{medicine.name}</h2>
                                        <p><strong>Primary Use:</strong> {medicine.uses}</p>
                                        <p><strong>Typical Dosage:</strong> {medicine.dosage}</p>
                                    </div>
                                </div>
                                
                                <div className="medicine-details">
                                    <div className="detail-section">
                                        <h3>Precautions</h3>
                                        <p>{medicine.precautions}</p>
                                    </div>
                                    <div className="detail-section">
                                        <h3>Side Effects</h3>
                                        <p>{medicine.sideEffects}</p>
                                    </div>
                                    <div className="detail-section">
                                        <h3>Safer Alternatives</h3>
                                        <p>{medicine.alternatives}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {medicine && (
                            <section className="interaction-checker" style={{ display: 'block' }}>
                                <h2>Check Interaction with Another Medicine</h2>
                                <div className="interaction-form">
                                    <input 
                                        type="text" 
                                        placeholder="Enter another medicine name"
                                        value={interactionMed}
                                        onChange={(e) => setInteractionMed(e.target.value)}
                                    />
                                    <button onClick={checkInteraction}>Check</button>
                                </div>
                                
                                {interactionResult && (
                                    <div className={`interaction-result ${interactionResult.severity}`} style={{ display: 'block' }}>
                                        <h3>Interaction Result: <span style={{ 
                                            color: interactionResult.severity === 'high' ? '#e74c3c' :
                                                   interactionResult.severity === 'moderate' ? '#f39c12' : '#2ecc71'
                                        }}>
                                            {interactionResult.severity === 'none' ? 'No significant interaction' : interactionResult.severity + ' risk'}
                                        </span></h3>
                                        <p>{interactionResult.description}</p>
                                        {interactionResult.alternatives && (
                                            <div className="alternatives">
                                                <h4>Safer Alternatives:</h4>
                                                <p>{interactionResult.alternatives}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        <section className="user-profile" id="profile" style={{ display: showProfileModal ? 'block' : 'none' }}>
                            <h2>Medical Profile</h2>
                            <form className="profile-form">
                                <label>Current Medications (separate with commas)</label>
                                <input 
                                    type="text" 
                                    value={currentMeds}
                                    onChange={(e) => setCurrentMeds(e.target.value)}
                                />
                                
                                <label>Allergies</label>
                                <input 
                                    type="text" 
                                    value={allergies}
                                    onChange={(e) => setAllergies(e.target.value)}
                                />
                                
                                <label>Medical Conditions/History</label>
                                <textarea 
                                    value={medicalHistory}
                                    onChange={(e) => setMedicalHistory(e.target.value)}
                                />
                                
                                <label>Lifestyle Factors (exercise, diet, smoking, etc.)</label>
                                <textarea 
                                    value={lifestyle}
                                    onChange={(e) => setLifestyle(e.target.value)}
                                />
                                
                                <button type="button" onClick={saveProfile}>Save Profile</button>
                            </form>
                        </section>
                    </main>

                    <footer>
                        <div className="container">
                            <p>&copy; {new Date().getFullYear()} MedSafe. This service does not replace professional medical advice.</p>
                        </div>
                    </footer>

                    <div className="modal" style={{ display: showWarningModal ? 'flex' : 'none' }}>
                        <div className="modal-content">
                            <h2>Important Warning</h2>
                            <p>This tool is for informational purposes only. Medication effects can vary by individual. Always consult with a healthcare professional before making any changes to your medication regimen.</p>
                            <p>Never stop taking prescribed medication without consulting your doctor.</p>
                            <button onClick={() => setShowWarningModal(false)}>I Understand</button>
                        </div>
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
