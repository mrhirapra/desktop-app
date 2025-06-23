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
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
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
                setShowMemberDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (showMemberDropdown) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [showMemberDropdown]);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 px-2 transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 relative">
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
                            <div className="relative" ref={memberInputRef}>
                                <button
                                    type="button"
                                    className={`flex items-center w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all shadow-sm ${showMemberDropdown ? 'ring-2 ring-blue-400' : ''}`}
                                    onClick={() => setShowMemberDropdown(v => !v)}
                                    aria-haspopup="listbox"
                                    aria-expanded={showMemberDropdown}
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
                                    <ChevronDownIcon className="h-5 w-5 ml-auto text-gray-400" />
                                </button>
                                {showMemberDropdown && (
                                    <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-96 overflow-auto animate-fade-in">
                                        <div className="p-2">
                                            <input
                                                type="text"
                                                className="w-full rounded border border-gray-200 dark:border-gray-600 px-2 py-1 mb-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                placeholder="Search people…"
                                                value={memberSearch}
                                                onChange={e => setMemberSearch(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        {filteredMembers.length > 0 ? (
                                            filteredMembers.map(m => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    className={`flex items-center w-full px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-white ${assigned === m.id ? 'bg-blue-50 dark:bg-blue-800' : ''}`}
                                                    onClick={() => {
                                                        setAssigned(m.id);
                                                        setMemberSearch("");
                                                        setShowMemberDropdown(false);
                                                    }}
                                                >
                                                    <img src={m.avatar} alt="avatar" className="h-6 w-6 rounded-full mr-2" />
                                                    <span>{m.name}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500 dark:text-gray-300">No people found.</div>
                                        )}
                                    </div>
                                )}
                            </div>
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
