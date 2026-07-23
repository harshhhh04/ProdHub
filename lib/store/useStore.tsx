'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SystemMode,
  Mission,
  DailyBigThree,
  Project,
  KnowledgeNote,
  DeepWorkSession,
  Book,
  HealthLog,
  InterviewQuestion,
  PlacementApplication,
  WeeklyReview
} from '@/lib/types';

interface StoreContextType {
  mode: SystemMode;
  setMode: (mode: SystemMode) => void;
  toggleMode: () => void;
  
  missions: Mission[];
  addMission: (mission: Omit<Mission, 'id' | 'createdAt'>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  deleteMission: (id: string) => void;
  toggleSubtask: (missionId: string, subtaskId: string) => void;
  
  bigThree: DailyBigThree;
  updateBigThree: (updates: Partial<DailyBigThree>) => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  notes: KnowledgeNote[];
  addNote: (note: Omit<KnowledgeNote, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<KnowledgeNote>) => void;
  deleteNote: (id: string) => void;
  
  deepWorkSessions: DeepWorkSession[];
  addDeepWorkSession: (session: Omit<DeepWorkSession, 'id' | 'timestamp'>) => void;
  
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  
  healthLog: HealthLog;
  updateHealthLog: (updates: Partial<HealthLog>) => void;
  
  interviewQuestions: InterviewQuestion[];
  addInterviewQuestion: (q: Omit<InterviewQuestion, 'id'>) => void;
  updateInterviewQuestion: (id: string, updates: Partial<InterviewQuestion>) => void;
  
  applications: PlacementApplication[];
  addApplication: (app: Omit<PlacementApplication, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<PlacementApplication>) => void;
  deleteApplication: (id: string) => void;
  
  weeklyReviews: WeeklyReview[];
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const INITIAL_MODE: SystemMode = 'placement';

const INITIAL_BIG_THREE: DailyBigThree = {
  id: 'b3-today',
  date: new Date().toISOString().split('T')[0],
  task1: 'Debug Mutex Deadlock in RTOS Priority Inversion test suite',
  task2: 'Complete Sentinel Circular Buffer SPI Flush function',
  task3: 'Review 10 RTOS & Embedded C flashcards',
  completed1: true,
  completed2: false,
  completed3: false,
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Internship Feature Module',
    slug: 'internship',
    overview: 'High-throughput sensor payload parsing and SPI bus DMA driver optimization for industrial edge gateway.',
    status: 'active',
    category: 'internship',
    goals: ['Achieve < 50us packet processing latency', 'Zero memory leaks across 24h continuous soak test'],
    milestones: [
      { id: 'm1', title: 'DMA ring buffer architecture design', completed: true, targetDate: '2026-07-20' },
      { id: 'm2', title: 'SPI Master interrupt service routine', completed: true, targetDate: '2026-07-22' },
      { id: 'm3', title: 'Integration with cloud gateway payload stack', completed: false, targetDate: '2026-07-27' },
    ],
    resources: [
      { id: 'r1', title: 'SPI DMA App Note AN4210', url: 'https://st.com' },
      { id: 'r2', title: 'Cortex-M NVIC Interrupt Specs', url: 'https://arm.com' }
    ],
    notes: 'Remember to clear the TXE and RXNE flags in correct order to avoid SPI lockup.',
    progress: 75
  },
  {
    id: 'proj-2',
    title: 'RTOS Core & Kernel Synchronization',
    slug: 'rtos',
    overview: 'Custom preemptive real-time operating system kernel built from scratch for ARM Cortex-M4.',
    status: 'active',
    category: 'core',
    goals: ['Implement priority scheduler with bitmap lookup', 'Add Priority Inheritance Mutexes to solve inversion'],
    milestones: [
      { id: 'm10', title: 'Context switching assembly routine (PendSV)', completed: true },
      { id: 'm11', title: 'Task Control Block & Stack Initialization', completed: true },
      { id: 'm12', title: 'Priority Inheritance Mutex Implementation', completed: false, targetDate: '2026-07-26' },
      { id: 'm13', title: 'Tickless Idle low-power implementation', completed: false, targetDate: '2026-08-05' },
    ],
    resources: [
      { id: 'r10', title: 'FreeRTOS Kernel Source Reference', url: 'https://freertos.org' },
    ],
    notes: 'PSP (Process Stack Pointer) for tasks, MSP (Main Stack Pointer) for OS Kernel ISRs.',
    progress: 80
  },
  {
    id: 'proj-3',
    title: 'Sentinel Logging & Diagnostics System',
    slug: 'sentinel',
    overview: 'Ultra-lightweight binary logging framework for resource-constrained microcontrollers with non-volatile flash backend.',
    status: 'active',
    category: 'core',
    goals: ['Structured logging under 8 bytes overhead', 'Crash dump stack-unwind capability'],
    milestones: [
      { id: 'm20', title: 'Binary log formatter macro engine', completed: true },
      { id: 'm21', title: 'Circular flash buffer wear-leveling', completed: false },
      { id: 'm22', title: 'Host decoder CLI tool in Python', completed: false },
    ],
    resources: [],
    notes: 'Needs lock-free ring buffer for ISR safety.',
    progress: 45
  },
  {
    id: 'proj-4',
    title: 'SAP Revision & System Architecture',
    slug: 'sap-revision',
    overview: 'Comprehensive revision of System Architecture & Operating System fundamentals for placements.',
    status: 'active',
    category: 'core',
    goals: ['Master Paging, Virtual Memory, Cache Coherency, and Linux Kernel IPC'],
    milestones: [
      { id: 'm30', title: 'CPU Paging & TLB Hit/Miss Mechanics', completed: true },
      { id: 'm31', title: 'Linux IPC: Shared Memory, Semaphores, Pipes', completed: false },
    ],
    resources: [],
    notes: 'Focus heavily on cache lines, false sharing, and memory barriers.',
    progress: 55
  },
  {
    id: 'proj-5',
    title: 'Freelance IoT Firmware Engine',
    slug: 'freelance',
    overview: 'BLE gateway firmware for smart industrial vibration monitors.',
    status: 'paused',
    category: 'freelance',
    goals: ['Low-power BLE advertising payload customization'],
    milestones: [],
    resources: [],
    notes: 'Paused during primary placement prep window.',
    progress: 25
  }
];

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'msn-1',
    title: 'Finish RTOS Synchronization',
    description: 'Implement Priority Inheritance Mutex and verify context switch safety during priority inversion tests.',
    priority: 'P0',
    category: 'RTOS',
    status: 'in_progress',
    deadline: '2026-07-26',
    estimatedHours: 6,
    actualHours: 4.5,
    definitionOfDone: [
      { id: 'dod-1', text: 'Implement mutex_lock() with owner tracking', completed: true },
      { id: 'dod-2', text: 'Add Priority Boosting algorithm when higher task blocks', completed: true },
      { id: 'dod-3', text: 'Pass nested priority inversion test suite', completed: false }
    ],
    notes: 'Reference ARM AAPCS calling convention for register preservation.',
    projectId: 'proj-2',
    createdAt: new Date().toISOString()
  },
  {
    id: 'msn-2',
    title: 'Revise BLE Protocol Stack',
    description: 'Deep dive into BLE GAP roles, GATT profiles, MTU exchange, and security manager paired connection flow.',
    priority: 'P1',
    category: 'BLE',
    status: 'in_progress',
    deadline: '2026-07-27',
    estimatedHours: 4,
    actualHours: 2,
    definitionOfDone: [
      { id: 'dod-4', text: 'Summarize Advertising PDUs vs Data PDUs', completed: true },
      { id: 'dod-5', text: 'Write flashcard set for GATT Attributes & CCCD', completed: false }
    ],
    projectId: 'proj-5',
    createdAt: new Date().toISOString()
  },
  {
    id: 'msn-3',
    title: 'Implement Sentinel Logging Flash Driver',
    description: 'Write low-level QSPI flash write page routine with double-buffering.',
    priority: 'P0',
    category: 'Firmware',
    status: 'in_progress',
    deadline: '2026-07-29',
    estimatedHours: 8,
    actualHours: 3.5,
    definitionOfDone: [
      { id: 'dod-6', text: 'Implement SPI DMA TX/RX transfer complete callbacks', completed: true },
      { id: 'dod-7', text: 'Test 4KB sector erase wearing algorithm', completed: false }
    ],
    projectId: 'proj-3',
    createdAt: new Date().toISOString()
  },
  {
    id: 'msn-4',
    title: 'Complete Internship Feature Payload Parser',
    description: 'Finalize Zero-copy binary parser for sensor telemetry packets.',
    priority: 'P0',
    category: 'Internship',
    status: 'in_progress',
    deadline: '2026-07-25',
    estimatedHours: 10,
    actualHours: 7,
    definitionOfDone: [
      { id: 'dod-8', text: 'Write unit tests for CRC-16 hardware calculation', completed: true },
      { id: 'dod-9', text: 'Verify memory bounds checking on malformed packets', completed: true }
    ],
    projectId: 'proj-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'msn-5',
    title: 'Read 60 pages of Making Embedded Systems',
    description: 'Focus on Memory architectures and Interrupt service routines chapter.',
    priority: 'P2',
    category: 'Reading',
    status: 'backlog',
    deadline: '2026-07-28',
    estimatedHours: 3,
    actualHours: 1,
    definitionOfDone: [
      { id: 'dod-10', text: 'Extract key takeaways into Knowledge Vault', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'msn-6',
    title: 'Workout 4 times this week',
    description: 'Upper/Lower body split to maintain physical condition during intense placement grind.',
    priority: 'P2',
    category: 'Health',
    status: 'in_progress',
    deadline: '2026-07-26',
    estimatedHours: 4,
    actualHours: 3,
    definitionOfDone: [
      { id: 'dod-11', text: 'Session 1: Upper Strength', completed: true },
      { id: 'dod-12', text: 'Session 2: Lower Power', completed: true },
      { id: 'dod-13', text: 'Session 3: Upper Hypertrophy', completed: true },
      { id: 'dod-14', text: 'Session 4: Mobility & Core', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'msn-7',
    title: 'Meditate 5 times this week',
    description: '10-minute focus meditation morning sessions.',
    priority: 'P3',
    category: 'Health',
    status: 'in_progress',
    deadline: '2026-07-26',
    estimatedHours: 1,
    actualHours: 0.7,
    definitionOfDone: [
      { id: 'dod-15', text: 'Mon, Tue, Wed sessions completed', completed: true }
    ],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_NOTES: KnowledgeNote[] = [
  {
    id: 'note-1',
    title: 'RTOS Mutex vs Semaphore & Priority Inversion Solution',
    category: 'RTOS',
    content: `# RTOS Mutex vs Binary Semaphore & Priority Inversion

## 1. Core Difference
- **Binary Semaphore**: A signaling mechanism. Task A can signal Task B. Has **NO ownership**. Can be unlocked by any task/ISR.
- **Mutex (Mutual Exclusion)**: A locking mechanism. Has **ownership**. ONLY the task that acquired the mutex can release it.

## 2. Priority Inversion Problem
Occurs when a High-Priority Task ($T_H$) is blocked waiting for a Mutex held by a Low-Priority Task ($T_L$), while a Medium-Priority Task ($T_M$) preempts $T_L$ continuously.

\`\`\`c
// Priority Inheritance Protocol
void vTaskPriorityInheritance(TaskControlBlock_t *pxMutexOwner, TaskControlBlock_t *pxCurrentTask) {
    if (pxMutexOwner->uxPriority < pxCurrentTask->uxPriority) {
        // Boost low priority task to high priority task level
        pxMutexOwner->uxInheritedPriority = pxCurrentTask->uxPriority;
    }
}
\`\`\`

## 3. Key Takeaways for Interviews
- Always specify **Priority Inheritance** or **Priority Ceiling** protocols.
- Never call Mutex lock inside an Interrupt Service Routine (ISR) because ISRs cannot block!
`,
    tags: ['RTOS', 'Concurrency', 'Embedded C', 'Interview'],
    backlinks: ['RTOS Core & Kernel Synchronization'],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-2',
    title: 'BLE GATT Architecture & Advertising Parameters',
    category: 'BLE',
    content: `# Bluetooth Low Energy (BLE) GATT Architecture

## 1. Protocol Hierarchy
1. **Physical Layer (PHY)**: 2.4 GHz ISM band, 40 channels (37 data, 3 advertising: 37, 38, 39).
2. **Link Layer (LL)**: Controls Advertising, Scanning, Initiating, Connection states.
3. **L2CAP**: Multiplexes data, fragmentation and reassembly.
4. **ATT (Attribute Protocol)**: Server/Client key-value store.
5. **GATT (Generic Attribute Profile)**: Defines Services, Characteristics, and Descriptors.

## 2. Code Example: Custom Characteristic Definition
\`\`\`c
typedef struct {
    uint16_t handle;
    ble_uuid_t uuid;
    uint8_t properties; // READ | WRITE | NOTIFY
    uint8_t *value;
    uint16_t len;
} ble_gatt_char_t;
\`\`\`
`,
    tags: ['BLE', 'Wireless', 'Firmware', 'Protocols'],
    backlinks: ['Revise BLE Protocol Stack'],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-3',
    title: 'Embedded C: Volatile, Atomic Operations & Memory Barriers',
    category: 'Embedded C',
    content: `# Volatile & Memory Barriers in Firmware

## 1. When MUST you use \`volatile\`?
1. **Memory-Mapped Peripheral Registers** (e.g., \`#define USART1_DR (*(volatile uint32_t*)0x40013804)\`).
2. **Global variables modified by an Interrupt Service Routine (ISR)**.
3. **Global variables shared between threads in a multi-threaded RTOS**.

## 2. What \`volatile\` DOES NOT DO
- It does NOT guarantee **atomicity**!
- It does NOT provide **thread safety** or prevent CPU out-of-order execution without memory barriers.

\`\`\`c
// Memory barrier in ARM Cortex-M
__asm volatile ("dsb" ::: "memory"); // Data Synchronization Barrier
__asm volatile ("isb" ::: "memory"); // Instruction Synchronization Barrier
\`\`\`
`,
    tags: ['Embedded C', 'ARM Cortex-M', 'Memory', 'Interview Qs'],
    backlinks: ['Sentinel Logging System'],
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Making Embedded Systems',
    author: 'Elecia White',
    progressPercent: 85,
    totalPages: 320,
    readPages: 272,
    status: 'reading',
    keyIdeas: [
      'Architect firmware with clean state machines (FSMs) rather than messy flag variables.',
      'Always design watchdog timers with non-maskable heartbeats.'
    ],
    quotes: [
      '"Embedded systems engineering is about doing more with less and knowing your hardware inside out."'
    ],
    actionableLessons: [
      'Refactor Sentinel SPI flash driver into an explicit FSM state queue.'
    ],
    relatedProjectId: 'proj-2'
  },
  {
    id: 'book-2',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    progressPercent: 40,
    totalPages: 600,
    readPages: 240,
    status: 'reading',
    keyIdeas: [
      'Log-structured merge-trees (LSM trees) optimize sequential disk writes over random writes.'
    ],
    quotes: [
      '"Reliability is continuing to work correctly even when things go wrong."'
    ],
    actionableLessons: [
      'Use append-only log format for Sentinel non-volatile storage.'
    ],
    relatedProjectId: 'proj-3'
  }
];

const INITIAL_HEALTH: HealthLog = {
  id: 'hl-today',
  date: new Date().toISOString().split('T')[0],
  workoutDone: true,
  workoutNotes: 'Upper Body Heavy: Bench Press 85kg 4x6, Weighted Pull-ups +15kg 4x5, Overhead Press',
  meditationMinutes: 15,
  sleepHours: 7.5,
  sleepQuality: 'good',
  waterLiters: 3.2,
  walkingSteps: 8450
};

const INITIAL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'iq-1',
    question: 'Explain Priority Inversion in RTOS and how Priority Inheritance resolves it.',
    answer: 'Priority Inversion occurs when a high-priority task is blocked waiting for a mutex held by a low-priority task, while medium-priority tasks preempt the low-priority task, causing the high-priority task to wait indefinitely. Priority Inheritance temporarily boosts the low-priority task’s priority to match the blocked high-priority task until the mutex is released.',
    category: 'RTOS',
    company: 'Texas Instruments',
    confidenceLevel: 5,
    lastReviewed: new Date().toISOString()
  },
  {
    id: 'iq-2',
    question: 'What is the purpose of the `volatile` keyword in Embedded C? Give three real hardware scenarios.',
    answer: '`volatile` tells the compiler not to optimize or cache variable reads/writes in CPU registers because the variable value can change outside the immediate compiler code flow. Scenarios: 1) Hardware peripheral registers (e.g. UART DR), 2) Variables modified inside ISRs, 3) Shared flags between RTOS tasks.',
    category: 'Embedded C',
    company: 'Qualcomm',
    confidenceLevel: 5,
    lastReviewed: new Date().toISOString()
  },
  {
    id: 'iq-3',
    question: 'Compare SPI and I2C protocols in terms of wires, speed, addressability, and bus contention.',
    answer: 'SPI: 4 wires (SCLK, MOSI, MISO, CS), full-duplex, high speed (>50MHz), uses dedicated Chip Select pins per slave, no bus contention protocol. I2C: 2 wires (SCL, SDA), half-duplex, slower (100kHz-3.4MHz), open-drain with pull-ups, 7-bit/10-bit software addressing, built-in arbitration & clock stretching.',
    category: 'Protocols',
    company: 'STMicroelectronics',
    confidenceLevel: 4,
    lastReviewed: new Date().toISOString()
  },
  {
    id: 'iq-4',
    question: 'How do you debug an ARM Cortex-M HardFault exception?',
    answer: 'Read the HardFault Status Register (HFSR) and Configurable Fault Status Register (CFSR). Inspect the stack frame pushed by CPU upon exception entry to read the PC (Program Counter) and LR (Link Register). Use addr2line or GDB disassembly to pinpoint the exact instruction causing alignment fault, memory access violation, or divide-by-zero.',
    category: 'Firmware Debugging',
    company: 'ARM',
    confidenceLevel: 4,
    lastReviewed: new Date().toISOString()
  },
  {
    id: 'iq-5',
    question: 'What is the difference between a spinlock and a mutex in an RTOS context?',
    answer: 'A spinlock busy-waits in a continuous CPU loop until the lock becomes available (best for very brief critical sections or multi-core SMP). A mutex puts the calling thread into a Blocked/Waiting state and triggers a context switch, freeing the CPU for other tasks (best for longer operations, but has context-switch overhead).',
    category: 'RTOS',
    company: 'Qualcomm',
    confidenceLevel: 4,
    lastReviewed: new Date().toISOString()
  }
];

const INITIAL_APPLICATIONS: PlacementApplication[] = [
  {
    id: 'app-1',
    company: 'Texas Instruments',
    role: 'Embedded Software Engineer',
    status: 'Interview',
    interviewDate: '2026-07-28',
    notes: 'Technical Interview round focused on RTOS kernel internals, C memory management, and SPI/I2C drivers.',
    salaryLocation: 'Bangalore, India | ₹22-26 LPA',
    link: 'https://careers.ti.com'
  },
  {
    id: 'app-2',
    company: 'Qualcomm',
    role: 'Modem Firmware Engineer',
    status: 'OA',
    oaDate: '2026-07-26',
    notes: 'Online Assessment: C Data Structures, Bitwise manipulation, DMA, and ARM Assembly.',
    salaryLocation: 'Hyderabad, India | ₹24-28 LPA',
    link: 'https://qualcomm.com/careers'
  },
  {
    id: 'app-3',
    company: 'STMicroelectronics',
    role: 'Firmware Developer - Microcontrollers',
    status: 'Applied',
    deadline: '2026-08-02',
    notes: 'Applied via campus portal. Position in STM32 Peripheral Library team.',
    salaryLocation: 'Noida / Greater Noida',
    link: 'https://st.com/careers'
  },
  {
    id: 'app-4',
    company: 'ARM',
    role: 'Systems Architecture Intern',
    status: 'Applied',
    deadline: '2026-08-10',
    notes: 'Cortex-M CPU Core team application.',
    salaryLocation: 'Bangalore',
    link: 'https://arm.com/careers'
  },
  {
    id: 'app-5',
    company: 'NXP Semiconductors',
    role: 'Embedded Systems Associate',
    status: 'Offer',
    notes: 'Received offer letter! Response needed by August 15.',
    salaryLocation: 'Bangalore | ₹20 LPA',
    link: 'https://nxp.com'
  }
];

const INITIAL_DEEP_WORK: DeepWorkSession[] = [
  {
    id: 'dw-1',
    missionTitle: 'Finish RTOS Synchronization',
    durationMinutes: 90,
    accomplishments: 'Implemented Priority Inheritance logic in TCB and verified PendSV context switch.',
    interruptions: 0,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'dw-2',
    missionTitle: 'Complete Internship Feature Payload Parser',
    durationMinutes: 60,
    accomplishments: 'Wrote unit tests for CRC-16 hardware calculation and verified bounds checking.',
    interruptions: 1,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = 'engineering_os_data_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<SystemMode>(INITIAL_MODE);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [bigThree, setBigThree] = useState<DailyBigThree>(INITIAL_BIG_THREE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [notes, setNotes] = useState<KnowledgeNote[]>(INITIAL_NOTES);
  const [deepWorkSessions, setDeepWorkSessions] = useState<DeepWorkSession[]>(INITIAL_DEEP_WORK);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [healthLog, setHealthLog] = useState<HealthLog>(INITIAL_HEALTH);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>(INITIAL_INTERVIEW_QUESTIONS);
  const [applications, setApplications] = useState<PlacementApplication[]>(INITIAL_APPLICATIONS);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mode) setModeState(parsed.mode);
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.bigThree) setBigThree(parsed.bigThree);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.deepWorkSessions) setDeepWorkSessions(parsed.deepWorkSessions);
        if (parsed.books) setBooks(parsed.books);
        if (parsed.healthLog) setHealthLog(parsed.healthLog);
        if (parsed.interviewQuestions) setInterviewQuestions(parsed.interviewQuestions);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.weeklyReviews) setWeeklyReviews(parsed.weeklyReviews);
      }
    } catch (e) {
      console.error('Error loading from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      const payload = {
        mode,
        missions,
        bigThree,
        projects,
        notes,
        deepWorkSessions,
        books,
        healthLog,
        interviewQuestions,
        applications,
        weeklyReviews,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [mode, missions, bigThree, projects, notes, deepWorkSessions, books, healthLog, interviewQuestions, applications, weeklyReviews]);

  const setMode = (m: SystemMode) => setModeState(m);
  const toggleMode = () => setModeState(prev => (prev === 'placement' ? 'builder' : 'placement'));

  const addMission = (m: Omit<Mission, 'id' | 'createdAt'>) => {
    const newMission: Mission = {
      ...m,
      id: `msn-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setMissions(prev => [newMission, ...prev]);
  };

  const updateMission = (id: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMission = (id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  };

  const toggleSubtask = (missionId: string, subtaskId: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m;
      const updatedDOD = m.definitionOfDone.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
      return { ...m, definitionOfDone: updatedDOD };
    }));
  };

  const updateBigThree = (updates: Partial<DailyBigThree>) => {
    setBigThree(prev => ({ ...prev, ...updates }));
  };

  const addProject = (p: Omit<Project, 'id'>) => {
    const newProj: Project = { ...p, id: `proj-${Date.now()}` };
    setProjects(prev => [...prev, newProj]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addNote = (n: Omit<KnowledgeNote, 'id' | 'updatedAt'>) => {
    const newNote: KnowledgeNote = {
      ...n,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<KnowledgeNote>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addDeepWorkSession = (session: Omit<DeepWorkSession, 'id' | 'timestamp'>) => {
    const newSession: DeepWorkSession = {
      ...session,
      id: `dw-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setDeepWorkSessions(prev => [newSession, ...prev]);
  };

  const addBook = (b: Omit<Book, 'id'>) => {
    const newBook: Book = { ...b, id: `book-${Date.now()}` };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const updateHealthLog = (updates: Partial<HealthLog>) => {
    setHealthLog(prev => ({ ...prev, ...updates }));
  };

  const addInterviewQuestion = (q: Omit<InterviewQuestion, 'id'>) => {
    const newQ: InterviewQuestion = { ...q, id: `iq-${Date.now()}` };
    setInterviewQuestions(prev => [newQ, ...prev]);
  };

  const updateInterviewQuestion = (id: string, updates: Partial<InterviewQuestion>) => {
    setInterviewQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const addApplication = (app: Omit<PlacementApplication, 'id'>) => {
    const newApp: PlacementApplication = { ...app, id: `app-${Date.now()}` };
    setApplications(prev => [newApp, ...prev]);
  };

  const updateApplication = (id: string, updates: Partial<PlacementApplication>) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const addWeeklyReview = (r: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    const newReview: WeeklyReview = {
      ...r,
      id: `wr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setWeeklyReviews(prev => [newReview, ...prev]);
  };

  return (
    <StoreContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        missions,
        addMission,
        updateMission,
        deleteMission,
        toggleSubtask,
        bigThree,
        updateBigThree,
        projects,
        addProject,
        updateProject,
        notes,
        addNote,
        updateNote,
        deleteNote,
        deepWorkSessions,
        addDeepWorkSession,
        books,
        addBook,
        updateBook,
        healthLog,
        updateHealthLog,
        interviewQuestions,
        addInterviewQuestion,
        updateInterviewQuestion,
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        weeklyReviews,
        addWeeklyReview,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
