import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    ExclamationCircleIcon,
    UserCircleIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/outline";

// Generate 100+ mock projects
const projects = Array.from({ length: 120 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Project ${i + 1}`,
}));

// Mock people with avatars
const teamMembers = [
    { id: "1", name: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "2", name: "Bob Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: "3", name: "Charlie Lee", avatar: "https://randomuser.me/api/portraits/men/65.jpg" },
    { id: "4", name: "Dana White", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    { id: "5", name: "Charlie Lee", avatar: "https://randomuser.me/api/portraits/men/65.jpg" },
    { id: "6", name: "Dana White", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
];

const DashboardPage = () => {
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [projectSearch, setProjectSearch] = useState("");
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [descCount, setDescCount] = useState(0);
    const [assigned, setAssigned] = useState<string>("");
    const [memberSearch, setMemberSearch] = useState("");
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const projectInputRef = useRef<HTMLInputElement>(null);
    const memberInputRef = useRef<HTMLInputElement>(null);

    // Filtered lists
    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase()));
    const filteredMembers = teamMembers.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()));

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                projectInputRef.current &&
                !projectInputRef.current.contains(e.target as Node)
            ) {
                setShowProjectDropdown(false);
            }
            if (
                memberInputRef.current &&
                !memberInputRef.current.contains(e.target as Node)
            ) {
                setShowMemberModal(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (showMemberModal) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [showMemberModal]);

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!selectedProject || !taskName.trim() || !taskDesc.trim() || !assigned) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/timer", {
                state: {
                    project: projects.find(p => p.id === selectedProject),
                    taskName,
                    taskDesc,
                    assigned: teamMembers.find(m => m.id === assigned),
                    startTime: Date.now()
                },
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#858585] dark:bg-[#131313] flex flex-col items-center py-8 px-2 transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-[#202020] rounded-2xl shadow-2xl p-6 md:p-10 relative">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Task Dashboard</h1>
                {/* Project Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="project-select">
                        Project
                    </label>
                    <div className="relative" ref={projectInputRef}>
                        <button
                            type="button"
                            className={`flex items-center w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all shadow-sm ${showProjectDropdown ? 'ring-2 ring-blue-400' : ''}`}
                            onClick={() => setShowProjectDropdown(v => !v)}
                            aria-haspopup="listbox"
                            aria-expanded={showProjectDropdown}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-gray-400" />
                            <span className={selectedProject ? '' : 'text-gray-400 dark:text-gray-500'}>
                                {selectedProject ? projects.find(p => p.id === selectedProject)?.name : 'Select a Project…'}
                            </span>
                            <ChevronDownIcon className="h-5 w-5 ml-auto text-gray-400" />
                        </button>
                        {showProjectDropdown && (
                            <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-64 overflow-auto animate-fade-in">
                                <div className="p-2">
                                    <input
                                        type="text"
                                        className="w-full rounded border border-gray-200 dark:border-gray-600 px-2 py-1 mb-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Search projects…"
                                        value={projectSearch}
                                        onChange={e => setProjectSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            className={`w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-white ${selectedProject === p.id ? 'bg-blue-50 dark:bg-blue-800' : ''}`}
                                            onClick={() => {
                                                setSelectedProject(p.id);
                                                setProjectSearch("");
                                                setShowProjectDropdown(false);
                                            }}
                                        >
                                            {p.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500 dark:text-gray-300">No projects found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Info message if no project selected */}
                {!selectedProject && (
                    <div className="flex items-center gap-2 mb-5 p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded transition-all shadow-sm">
                        <ExclamationCircleIcon className="h-5 w-5" />
                        <span>Please select a project to proceed.</span>
                    </div>
                )}
                {/* Task Form */}
                <form
                    className={`space-y-8 transition-all duration-500 ${selectedProject ? 'opacity-100 max-h-[2000px] scale-100' : 'opacity-0 max-h-0 scale-95 pointer-events-none'}`}
                    onSubmit={handleStart}
                    aria-label="Task creation form"
                >
                    <fieldset disabled={!selectedProject || loading} className="transition-opacity" aria-disabled={!selectedProject || loading}>
                        {/* Task Name */}
                        <div>
                            <label htmlFor="task-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Task Name
                            </label>
                            <input
                                id="task-name"
                                type="text"
                                value={taskName}
                                onChange={e => setTaskName(e.target.value)}
                                placeholder="Enter task name"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                aria-label="Task Name"
                            />
                        </div>
                        {/* Task Description */}
                        <div className="mt-5">
                            <label htmlFor="task-desc" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Task Description
                            </label>
                            <textarea
                                id="task-desc"
                                rows={4}
                                maxLength={500}
                                value={taskDesc}
                                onChange={e => {
                                    setTaskDesc(e.target.value);
                                    setDescCount(e.target.value.length);
                                }}
                                placeholder="Describe the task in detail…"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all shadow-sm resize-y min-h-[96px] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                aria-label="Task Description"
                            />
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">{descCount}/500</div>
                        </div>
                        {/* Assigned Person */}
                        <div>
                            <label htmlFor="assign-member" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Who is this task assigned to?
                            </label>
                            <button
                                type="button"
                                className="flex items-center w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all shadow-sm"
                                onClick={() => setShowMemberModal(true)}
                                aria-haspopup="dialog"
                                aria-expanded={showMemberModal}
                            >
                                {assigned ? (
                                    <>
                                        <img src={teamMembers.find(m => m.id === assigned)?.avatar} alt="avatar" className="h-6 w-6 rounded-full mr-2" />
                                        <span>{teamMembers.find(m => m.id === assigned)?.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <UserCircleIcon className="h-6 w-6 mr-2 text-gray-400" />
                                        <span className="text-gray-400 dark:text-gray-500">Select a person…</span>
                                    </>
                                )}
                            </button>
                            {showMemberModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center">
                                    {/* Blurred, animated overlay */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in" />
                                    <div className="relative bg-white/80 dark:bg-[#131313]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-5 max-w-sm w-full mx-2 animate-scale-in flex flex-col items-center">
                                        {/* Modern close button */}
                                        <button
                                            className="w-9 h-9 absolute top-3 right-3 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1 shadow-md transition-all"
                                            onClick={() => setShowMemberModal(false)}
                                            aria-label="Close"
                                            tabIndex={0}
                                        >
                                            ×
                                        </button>
                                        <h2 className="text-xl font-extrabold mb-4 text-gray-900 dark:text-white text-center tracking-tight drop-shadow">Select a Person</h2>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 mb-4 text-gray-900 dark:text-white bg-white/60 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm text-base"
                                            placeholder="Search people..."
                                            value={memberSearch}
                                            onChange={e => setMemberSearch(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="w-full max-h-60 overflow-y-auto overflow-x-hidden space-y-1 mb-3 pr-1 custom-scrollbar-wow">
                                            {filteredMembers.length > 0 ? (
                                                filteredMembers.map(m => (
                                                    <button
                                                        key={m.id}
                                                        type="button"
                                                        className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-150 text-base font-medium gap-2 shadow-sm border border-transparent hover:border-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-400 ${assigned === m.id ? 'bg-blue-600/90 text-white shadow-lg scale-105' : 'bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white'}`}
                                                        onClick={() => {
                                                            setAssigned(m.id);
                                                            setMemberSearch("");
                                                            setShowMemberModal(false);
                                                        }}
                                                    >
                                                        <img src={m.avatar} alt="avatar" className="h-7 w-7 rounded-full border-2 border-blue-400 shadow mr-2" />
                                                        <span className="flex-1 text-left">{m.name}</span>
                                                        {assigned === m.id && (
                                                            <svg className="h-5 w-5 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                        )}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500 dark:text-gray-300 text-center">No people found.</div>
                                            )}
                                        </div>
                                        {/* <button
                                            className="w-full rounded-lg bg-gradient-to-r from-gray-300/80 to-gray-400/80 dark:from-gray-700/80 dark:to-gray-800/80 text-gray-800 dark:text-gray-200 py-2 font-semibold text-base hover:from-gray-400 hover:to-gray-500 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all shadow-md mt-1"
                                            onClick={() => setShowMemberModal(false)}
                                            type="button"
                                        >
                                            Cancel
                                        </button> */}
                                    </div>
                                    {/* Animations and custom scrollbar */}
                                    <style>{`
                                        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                                        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                                        .animate-fade-in { animation: fade-in 0.3s ease; }
                                        .animate-scale-in { animation: scale-in 0.35s cubic-bezier(.4,2,.6,1) forwards; }
                                        .custom-scrollbar-wow::-webkit-scrollbar {
                                            width: 10px;
                                            background: transparent;
                                        }
                                        .custom-scrollbar-wow::-webkit-scrollbar-thumb {
                                            background: linear-gradient(135deg, #60a5fa 40%, #818cf8 100%);
                                            border-radius: 8px;
                                            box-shadow: 0 2px 8px 0 rgba(60,60,120,0.15);
                                            border: 2px solid #e0e7ef;
                                            min-height: 40px;
                                            transition: background 0.3s;
                                        }
                                        .custom-scrollbar-wow::-webkit-scrollbar-thumb:hover {
                                            background: linear-gradient(135deg, #2563eb 40%, #7c3aed 100%);
                                        }
                                        .custom-scrollbar-wow::-webkit-scrollbar-track {
                                            background: transparent;
                                            margin: 8px 0;
                                        }
                                        .custom-scrollbar-wow {
                                            scrollbar-width: thin;
                                            scrollbar-color: #818cf8 #e0e7ef;
                                        }
                                    `}</style>
                                </div>
                            )}
                        </div>
                        {error && (
                            <div className="text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded px-3 py-2 transition-all duration-300 mt-2" role="alert">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 mt-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 text-lg shadow-lg"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            ) : (
                                <>
                                    <PlayCircleIcon className="h-6 w-6" /> Start Task Timer
                                </>
                            )}
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default DashboardPage;
