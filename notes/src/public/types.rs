/// Emergency types supported by Solana SOS
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum EmergencyType {
    /// Drowning emergency
    Drowning,
    /// Heart attack emergency
    HeartAttack,
    /// Stroke emergency
    Stroke,
    /// Choking emergency
    Choking,
    /// Bleeding emergency
    Bleeding,
    /// Unconscious emergency
    Unconscious,
    /// Seizure emergency
    Seizure,
    /// Poisoning emergency
    Poisoning,
    /// Severe burns emergency
    SevereBurns,
    /// Diabetic emergency
    DiabeticEmergency,
    /// Allergic reaction emergency
    AllergicReaction,
    /// Trauma emergency
    Trauma,
    /// Suicide prevention emergency
    Suicide,
    /// Drug overdose emergency
    DrugOverdose,
    /// Hypothermia emergency
    Hypothermia,
    /// Suicide prevention emergency
    Suicide,
    /// Drug overdose emergency
    DrugOverdose,
    /// Hypothermia emergency
    Hypothermia,
    /// Suicide prevention emergency
    Suicide,
    /// Drug overdose emergency
    DrugOverdose,
    /// Hypothermia emergency
    Hypothermia,
    /// Suicide prevention emergency
    Suicide,
    /// Drug overdose emergency
    DrugOverdose,
    /// Hypothermia emergency
    Hypothermia,
}

impl EmergencyType {
    /// Gets the display name for the emergency type
    pub fn display_name(&self) -> &'static str {
        match self {
            EmergencyType::Drowning => "Drowning",
            EmergencyType::HeartAttack => "Heart Attack",
            EmergencyType::Stroke => "Stroke",
            EmergencyType::Choking => "Choking",
            EmergencyType::Bleeding => "Bleeding",
            EmergencyType::Unconscious => "Unconscious",
            EmergencyType::Seizure => "Seizure",
            EmergencyType::Poisoning => "Poisoning",
            EmergencyType::SevereBurns => "Severe Burns",
            EmergencyType::DiabeticEmergency => "Diabetic Emergency",
            EmergencyType::AllergicReaction => "Allergic Reaction",
            EmergencyType::Trauma => "Trauma",
            EmergencyType::Suicide => "Suicide Prevention",
            EmergencyType::DrugOverdose => "Drug Overdose",
            EmergencyType::Hypothermia => "Hypothermia",
            EmergencyType::Suicide => "Suicide Prevention",
            EmergencyType::DrugOverdose => "Drug Overdose",
            EmergencyType::Hypothermia => "Hypothermia",
        }
    }

    /// Gets the description for the emergency type
    pub fn description(&self) -> &'static str {
        match self {
            EmergencyType::Drowning => "Water-related emergency requiring immediate rescue",
            EmergencyType::HeartAttack => "Cardiac emergency requiring immediate medical attention",
            EmergencyType::Stroke => "Neurological emergency requiring immediate medical attention",
            EmergencyType::Choking => "Airway obstruction requiring immediate intervention",
            EmergencyType::Bleeding => "Blood loss requiring immediate control",
            EmergencyType::Unconscious => "Loss of consciousness requiring immediate assessment",
            EmergencyType::Seizure => "Neurological episode requiring immediate safety measures",
            EmergencyType::Poisoning => "Toxic substance exposure requiring immediate treatment",
            EmergencyType::SevereBurns => "Thermal injury requiring immediate cooling and care",
            EmergencyType::DiabeticEmergency => "Blood sugar emergency requiring immediate intervention",
            EmergencyType::AllergicReaction => "Severe allergic response requiring immediate treatment",
            EmergencyType::Trauma => "Physical injury requiring immediate assessment and care",
            EmergencyType::Suicide => "Mental health crisis requiring immediate human connection and support",
            EmergencyType::DrugOverdose => "Substance overdose requiring harm reduction approach and medical intervention",
            EmergencyType::Hypothermia => "Cold exposure requiring gradual rewarming and specialized care",
            EmergencyType::Suicide => "Mental health crisis requiring immediate human connection and support",
            EmergencyType::DrugOverdose => "Substance overdose requiring harm reduction approach and medical intervention",
            EmergencyType::Hypothermia => "Cold exposure requiring gradual rewarming and specialized care",
        }
    }

    /// Gets the emergency number for the emergency type
    pub fn emergency_number(&self) -> &'static str {
        match self {
            EmergencyType::Suicide => "988", // Suicide prevention hotline
            _ => "911", // All other emergencies use 911
        }
    }

    /// Gets the specialized routing information
    pub fn specialized_routing(&self) -> Option<&'static str> {
        match self {
            EmergencyType::Suicide => Some("Suicide Prevention Hotline - Immediate human connection"),
            EmergencyType::DrugOverdose => Some("Harm Reduction Specialist - Non-judgmental approach"),
            EmergencyType::Hypothermia => Some("Cold Weather Emergency - Gradual rewarming protocols"),
            _ => None,
        }
    }
}
