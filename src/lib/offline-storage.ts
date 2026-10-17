import { OfflineSafetyPack, SafeShelter } from './types';
import { SAFE_SHELTERS } from './shelters-data';

const STORAGE_KEY = 'jalsetu_offline_safety_pack_v1';
const CHECKLIST_KEY = 'jalsetu_evacuation_checklist_state';

export const DEFAULT_OFFLINE_PACK: OfflineSafetyPack = {
  lastUpdated: new Date().toISOString(),
  evacuationChecklist: [
    { id: 'c1', category: 'Immediate Essentials', item: 'Aadhaar / Voter ID / Land Deeds sealed in watertight plastic pouch', checked: false },
    { id: 'c2', category: 'Immediate Essentials', item: 'Prescription medications (7-day supply) & insulin cooler kit', checked: false },
    { id: 'c3', category: 'Water & Sustenance', item: '4 Litres drinking water per person + Chlorine / Halogen water purification tablets', checked: false },
    { id: 'c4', category: 'Water & Sustenance', item: 'Dry food rations (Chura / Gur / Sattu / High-calorie biscuits)', checked: false },
    { id: 'c5', category: 'Power & Comms', item: 'Charged power bank, battery-operated radio (tuning to AM/VHF), high-intensity torch', checked: false },
    { id: 'c6', category: 'Safety & First Aid', item: 'Sterile bandages, antiseptic liquid, ORS hydration sachets, whistle for acoustic signaling', checked: false },
    { id: 'c7', category: 'Home Pre-Evacuation', item: 'Turn off primary electrical main switch and disconnect LPG gas cylinder regulator', checked: false },
    { id: 'c8', category: 'Livestock & Animals', item: 'Untie cattle and livestock so they can swim to elevated highlands / bunds', checked: false },
  ],
  emergencyContacts: [
    { agency: 'NDRF Disaster Helpline (24x7 National)', phone: '1078 / +91-11-24363260', frequency: 'VHF Ch 16 (156.800 MHz)', operationalRole: 'Boat rescue, deep water airlift coordination' },
    { agency: 'State Emergency Operation Centre (SEOC)', phone: '1070', frequency: 'State Police Wireless 84.1 MHz', operationalRole: 'District evacuation orders & siren activation' },
    { agency: 'Integrated National Emergency (ERSS)', phone: '112', frequency: 'Dial 112 (SMS / Voice)', operationalRole: 'Police, Ambulance & Fire dispatch' },
    { agency: 'District Disaster Control Room (DDMA)', phone: '1077 / +91-5278-223456', frequency: 'VHF Ch 06 (156.300 MHz)', operationalRole: 'Shelter bed allocation & dry ration distribution' },
    { agency: 'Saryu River Irrigation & Flood Control', phone: '+91-5278-224500', frequency: 'VHF Ch 08 (156.400 MHz)', operationalRole: 'Dam discharge & embankment crest telemetry' },
  ],
  offlineShelters: SAFE_SHELTERS,
  firstAidGuide: [
    {
      title: 'Water Purification During Flood Inundation',
      steps: [
        'Do not drink untreated floodwater under any circumstances (high cholera and leptospirosis risk).',
        'Boil water vigorously for a minimum of 3 full minutes if heat source is available.',
        'Use Chlorine / Halogen tablets: Dissolve 1 tablet per 20 Litres of clear water. Wait 30 minutes before drinking.',
        'If water is turbid, filter through clean cotton cloth fold 4 times before adding chlorine.',
      ],
    },
    {
      title: 'Snakebite & Waterborne Vector Protocol',
      steps: [
        'Monsoon floods force vipers and cobras onto elevated mounds and trees.',
        'Keep victim completely still and calm. Movement accelerates venom absorption into the bloodstream.',
        'Immobilize the bitten limb with a splint at or slightly below heart level.',
        'DO NOT cut the wound, suck venom, or apply a tourniquet. Rush immediately to Civil Hospital Safe Wing.',
      ],
    },
    {
      title: 'Acoustic Distress Signaling for Rescue Boats',
      steps: [
        'Use standard whistles or metal utensils: 3 sharp blasts with a 2-second pause indicates SOS distress.',
        'Wave a bright red or orange cloth vertically from the highest roof point.',
        'At night, flash a torch in 3 short, 3 long, 3 short pulses to guide inflatable rescue boats.',
      ],
    },
  ],
};

export function getOfflineSafetyPack(): OfflineSafetyPack {
  if (typeof window === 'undefined') return DEFAULT_OFFLINE_PACK;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_OFFLINE_PACK));
      return DEFAULT_OFFLINE_PACK;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_OFFLINE_PACK;
  }
}

export function saveChecklistState(checklist: Array<{ id: string; category: string; item: string; checked: boolean }>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getOfflineSafetyPack();
    current.evacuationChecklist = checklist;
    current.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save checklist state', e);
  }
}

export function exportPrintableEmergencyCard(): string {
  const pack = getOfflineSafetyPack();
  return `=====================================================
BUBBLES CRITICAL FLOOD EVACUATION & SAFETY DOSSIER
=====================================================
Generated / Offline Cached: ${new Date(pack.lastUpdated).toLocaleString()}
Governed by: Disaster Management Act, 2005 (Act No. 53 of 2005)

1. PRIORITY EMERGENCY CONTACTS (24x7)
-----------------------------------------------------
${pack.emergencyContacts.map((c) => `- ${c.agency}: Tel: ${c.phone} | Radio: ${c.frequency} (${c.operationalRole})`).join('\n')}

2. DESIGNATED HIGH-GROUND SAFE SHELTERS
-----------------------------------------------------
${pack.offlineShelters.map((s) => `- ${s.name} (Elevation: ${s.elevationMeters}m)
  Address: ${s.address}
  Capacity: ${s.capacity} beds | Phone: ${s.phoneContact}
  Medical Facility: ${s.hasMedicalPost ? 'YES' : 'NO'} | Radio: ${s.vhfRadioChannel}`).join('\n\n')}

3. EVACUATION PROTOCOL FOR LOW-LYING SETTLEMENTS
-----------------------------------------------------
- Lowest Elevation Wards: Naya Tola (45m) & Moti Basti (46m).
- Move immediately before flood wave crests; do not wait for water to enter ground floor.
- Never attempt to drive through flooded roads (30cm of moving water sweeps passenger vehicles).
- Do not cross Purab Bridge if water warning indicator is active.
=====================================================`;
}
