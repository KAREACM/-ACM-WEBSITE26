import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, ArrowLeft, Users, FolderKanban, ShieldAlert, 
  Check, X, Sparkles, Mail, Phone, ExternalLink, Image as ImageIcon, Award 
} from 'lucide-react';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  description?: string;
  order: number;
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  email: string;
  contact: string;
  photo: string;
  departmentId: string;
  level: 'executive' | 'lead' | 'member';
  reportsTo?: string;
  skills?: string[];
  contributions?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export default function CommitteeManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [activeTab, setActiveTab] = useState<'departments' | 'members' | 'preview'>('members');
  const [filterDept, setFilterDept] = useState<string>('all');

  // Modal states
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  
  // Edit mode targets
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  // Form states - Department
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptOrder, setDeptOrder] = useState(1);

  // Form states - Member
  const [memName, setMemName] = useState('');
  const [memRole, setMemRole] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memContact, setMemContact] = useState('');
  const [memPhoto, setMemPhoto] = useState('');
  const [memDeptId, setMemDeptId] = useState('');
  const [memLevel, setMemLevel] = useState<'executive' | 'lead' | 'member'>('member');
  const [memReportsTo, setMemReportsTo] = useState('');
  const [memSkills, setMemSkills] = useState('');
  const [memBio, setMemBio] = useState('');
  const [memContributions, setMemContributions] = useState('');
  const [memLinkedin, setMemLinkedin] = useState('');
  const [memGithub, setMemGithub] = useState('');
  const [memPortfolio, setMemPortfolio] = useState('');

  // Load from database (localStorage)
  const loadData = () => {
    const storedDepts = JSON.parse(localStorage.getItem('acm_departments') || '[]');
    const storedMembers = JSON.parse(localStorage.getItem('acm_members') || '[]');
    
    // Sort departments by order priority
    storedDepts.sort((a: any, b: any) => a.order - b.order);
    
    setDepartments(storedDepts);
    setMembers(storedMembers);
    
    if (storedDepts.length > 0 && !memDeptId) {
      setMemDeptId(storedDepts[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const syncDatabase = (updatedDepts: Department[], updatedMembers: CommitteeMember[]) => {
    localStorage.setItem('acm_departments', JSON.stringify(updatedDepts));
    localStorage.setItem('acm_members', JSON.stringify(updatedMembers));
    setDepartments(updatedDepts);
    setMembers(updatedMembers);
    
    // Dispatch synchronization event to notify main website component instantly
    window.dispatchEvent(new Event('acm_db_update'));
  };

  // --- Department CRUD Actions ---
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptName('');
    setDeptDesc('');
    setDeptOrder(departments.length + 1);
    setDeptModalOpen(true);
  };

  const handleOpenEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptName(dept.name);
    setDeptDesc(dept.description || '');
    setDeptOrder(dept.order);
    setDeptModalOpen(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      toast.error('Department name is required');
      return;
    }

    let updatedDepts = [...departments];
    if (editingDept) {
      // Edit mode
      updatedDepts = updatedDepts.map(d => 
        d.id === editingDept.id ? { ...d, name: deptName, description: deptDesc, order: Number(deptOrder) } : d
      );
      toast.success('Department updated successfully');
    } else {
      // Create mode
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: deptName,
        description: deptDesc,
        order: Number(deptOrder)
      };
      updatedDepts.push(newDept);
      toast.success('Department created successfully');
    }

    updatedDepts.sort((a, b) => a.order - b.order);
    syncDatabase(updatedDepts, members);
    setDeptModalOpen(false);
  };

  const handleDeleteDept = (id: string) => {
    if (id === 'dept-core') {
      toast.error('Protected Executive Board department cannot be deleted.');
      return;
    }
    
    const count = members.filter(m => m.departmentId === id).length;
    if (count > 0) {
      if (!window.confirm(`This department contains ${count} members. Deleting the department will unassign them. Proceed?`)) {
        return;
      }
    } else {
      if (!window.confirm('Are you sure you want to delete this department?')) {
        return;
      }
    }

    const updatedDepts = departments.filter(d => d.id !== id);
    // Unassign members of deleted department
    const updatedMembers = members.map(m => 
      m.departmentId === id ? { ...m, departmentId: 'dept-core', level: 'member' as const } : m
    );

    syncDatabase(updatedDepts, updatedMembers);
    toast.success('Department deleted');
  };

  // --- Member CRUD Actions ---
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemName('');
    setMemRole('');
    setMemEmail('');
    setMemContact('');
    setMemPhoto('');
    setMemDeptId(departments[0]?.id || '');
    setMemLevel('member');
    setMemReportsTo('');
    setMemSkills('');
    setMemBio('');
    setMemContributions('');
    setMemLinkedin('');
    setMemGithub('');
    setMemPortfolio('');
    setMemberModalOpen(true);
  };

  const handleOpenEditMember = (mem: CommitteeMember) => {
    setEditingMember(mem);
    setMemName(mem.name);
    setMemRole(mem.role);
    setMemEmail(mem.email);
    setMemContact(mem.contact);
    setMemPhoto(mem.photo);
    setMemDeptId(mem.departmentId);
    setMemLevel(mem.level);
    setMemReportsTo(mem.reportsTo || '');
    setMemSkills(mem.skills ? mem.skills.join(', ') : '');
    setMemBio(mem.bio || '');
    setMemContributions(mem.contributions || '');
    setMemLinkedin(mem.linkedin || '');
    setMemGithub(mem.github || '');
    setMemPortfolio(mem.portfolio || '');
    setMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName.trim() || !memRole.trim() || !memEmail.trim()) {
      toast.error('Name, Role, and Email are required.');
      return;
    }

    // Default Avatar fallback if empty
    const fallbackPhoto = memPhoto.trim() || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=400&q=80&auto=format&fit=crop`;
    const skillsArray = memSkills.split(',').map(s => s.trim()).filter(Boolean);

    let updatedMembers = [...members];
    if (editingMember) {
      // Edit
      updatedMembers = updatedMembers.map(m => 
        m.id === editingMember.id ? { 
          ...m, 
          name: memName, 
          role: memRole, 
          email: memEmail, 
          contact: memContact, 
          photo: fallbackPhoto, 
          departmentId: memDeptId, 
          level: memLevel,
          reportsTo: memReportsTo || undefined,
          skills: skillsArray,
          bio: memBio,
          contributions: memContributions,
          linkedin: memLinkedin,
          github: memGithub,
          portfolio: memPortfolio
        } : m
      );
      toast.success('Member details updated');
    } else {
      // Add
      const newMember: CommitteeMember = {
        id: `mem-${Date.now()}`,
        name: memName,
        role: memRole,
        email: memEmail,
        contact: memContact,
        photo: fallbackPhoto,
        departmentId: memDeptId,
        level: memLevel,
        reportsTo: memReportsTo || undefined,
        skills: skillsArray,
        bio: memBio,
        contributions: memContributions,
        linkedin: memLinkedin,
        github: memGithub,
        portfolio: memPortfolio
      };
      updatedMembers.push(newMember);
      toast.success('New member registered');
    }

    syncDatabase(departments, updatedMembers);
    setMemberModalOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    if (!window.confirm('Remove this member from the committee registry?')) {
      return;
    }
    const updatedMembers = members.filter(m => m.id !== id);
    // Reset reporting fields targeting the deleted member
    const cleanedMembers = updatedMembers.map(m => 
      m.reportsTo === id ? { ...m, reportsTo: undefined } : m
    );
    syncDatabase(departments, cleanedMembers);
    toast.success('Member removed');
  };

  const filteredMembers = filterDept === 'all' 
    ? members 
    : members.filter(m => m.departmentId === filterDept);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans relative">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      <div className="absolute top-0 left-1/4 w-[50vw] h-[40vh] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 py-10 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4 group transition-colors">
              <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" /> Back to Website
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Syndicate Control
            </h1>
            <p className="text-slate-400 text-sm mt-1">Student Committee Management System</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm shadow-xl min-w-[280px]">
            <div className="flex-1 text-center border-r border-white/10 pr-2">
              <div className="text-2xl font-black text-cyan-400">{departments.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Departments</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-2xl font-black text-cyan-400">{members.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Syndicate Size</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/5 pb-px mb-8 overflow-x-auto gap-4">
          <div className="flex gap-4">
            {(['members', 'departments', 'preview'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'border-cyan-500 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'preview' ? 'Org Tree Preview' : tab}
              </button>
            ))}
          </div>

          <div className="pb-2">
            {activeTab === 'departments' && (
              <button 
                onClick={handleOpenAddDept}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-cyan-500 text-black rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={14} /> Add Department
              </button>
            )}
            {activeTab === 'members' && (
              <button 
                onClick={handleOpenAddMember}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-cyan-500 text-black rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={14} /> Register Member
              </button>
            )}
          </div>
        </div>

        {/* --- MAIN CONTENT PANELS --- */}
        <AnimatePresence mode="wait">
          {/* TAB 1: MEMBERS REGISTRY */}
          {activeTab === 'members' && (
            <motion.div 
              key="members" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Filter Team:</span>
                  <select 
                    value={filterDept} 
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-[#050811] border border-white/15 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Showing {filteredMembers.length} of {members.length} members
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-950/40 text-[10px] uppercase font-bold tracking-widest font-mono text-slate-400">
                        <th className="p-5">Member</th>
                        <th className="p-5">Department</th>
                        <th className="p-5">Role & Level</th>
                        <th className="p-5">Contacts</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => {
                          const dept = departments.find(d => d.id === member.departmentId);
                          return (
                            <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="p-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-slate-900 shrink-0">
                                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{member.name}</h3>
                                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ID: {member.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-5">
                                <span className="text-slate-300 font-medium">
                                  {dept ? dept.name : <span className="text-red-400 font-mono text-xs">Unassigned</span>}
                                </span>
                              </td>
                              <td className="p-5">
                                <div className="space-y-1">
                                  <div className="font-semibold text-white">{member.role}</div>
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest font-mono ${
                                    member.level === 'executive' 
                                      ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400' 
                                      : member.level === 'lead'
                                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                                      : 'bg-slate-500/10 border border-slate-500/20 text-slate-400'
                                  }`}>
                                    {member.level}
                                  </span>
                                </div>
                              </td>
                              <td className="p-5">
                                <div className="space-y-1 text-xs text-slate-400 font-mono">
                                  <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                                    <Mail size={12} className="shrink-0 text-cyan-500/70" />
                                    <span>{member.email}</span>
                                  </div>
                                  {(member.role.toLowerCase() === 'chair' || member.id === 'chair') && member.contact && (
                                    <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                                      <Phone size={12} className="shrink-0 text-cyan-500/70" />
                                      <span>{member.contact}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleOpenEditMember(member)}
                                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:scale-105"
                                    title="Edit details"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all hover:scale-105"
                                    title="Delete member"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center p-12 text-slate-500 font-mono">
                            No committee members registered in this view.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DEPARTMENTS MANAGEMENT */}
          {activeTab === 'departments' && (
            <motion.div 
              key="departments" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {departments.map((dept) => {
                const count = members.filter(m => m.departmentId === dept.id).length;
                const lead = members.find(m => m.departmentId === dept.id && (m.level === 'lead' || m.level === 'executive'));
                
                return (
                  <div 
                    key={dept.id} 
                    className="relative bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group backdrop-blur-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-[0.2em]">Priority Order: {dept.order}</span>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{dept.name}</h3>
                        </div>
                        <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                          {count} {count === 1 ? 'member' : 'members'}
                        </span>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed min-h-[48px]">
                        {dept.description || "No description provided."}
                      </p>

                      {lead ? (
                        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/20 shrink-0">
                            <img src={lead.photo} alt={lead.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{lead.name}</div>
                            <div className="text-[9px] text-cyan-400 font-mono tracking-wider uppercase mt-0.5">Lead: {lead.role}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                          No lead assigned
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => handleOpenEditDept(dept)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-500/50 bg-white/5 text-slate-400 hover:text-cyan-400 text-xs font-mono transition-all"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteDept(dept.id)}
                        disabled={dept.id === 'dept-core'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                          dept.id === 'dept-core' 
                            ? 'border-transparent text-slate-700 cursor-not-allowed bg-transparent'
                            : 'border-white/10 hover:border-red-500/50 bg-white/5 text-slate-400 hover:text-red-400'
                        }`}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 3: TREE PREVIEW */}
          {activeTab === 'preview' && (
            <motion.div 
              key="preview" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#050811]/30 border border-white/5 rounded-3xl p-6 overflow-x-auto backdrop-blur-sm shadow-xl"
            >
              <div className="min-w-[1000px] flex flex-col items-center gap-12 py-8">
                {/* Level 0: Chair */}
                {members.find(m => m.role.toLowerCase() === 'chair') ? (
                  (() => {
                    const chair = members.find(m => m.role.toLowerCase() === 'chair')!;
                    const children = members.filter(m => m.reportsTo === chair.id);
                    return (
                      <div className="flex flex-col items-center">
                        <div className="px-5 py-3 rounded-2xl bg-slate-950 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-center w-56">
                          <h4 className="text-white text-sm font-black tracking-tight">{chair.name}</h4>
                          <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-wider mt-0.5">{chair.role}</p>
                        </div>
                        {children.length > 0 && <div className="w-[2px] h-10 bg-gradient-to-b from-cyan-400 to-purple-500"></div>}
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-slate-500 font-mono text-xs p-4 border border-dashed border-white/10 rounded-xl">No Chair defined in the database.</div>
                )}

                {/* Level 1: Core Officers & Leads */}
                <div className="flex justify-center gap-8 flex-wrap max-w-5xl">
                  {departments.map((dept) => {
                    const lead = members.find(m => m.departmentId === dept.id && (m.level === 'lead' || m.level === 'executive') && m.role.toLowerCase() !== 'chair');
                    if (!lead) return null;
                    const reportingCount = members.filter(m => m.reportsTo === lead.id).length;
                    
                    return (
                      <div key={dept.id} className="flex flex-col items-center border border-white/5 bg-white/[0.01] p-4 rounded-2xl min-w-[200px] shadow-md">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-2">{dept.name}</span>
                        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-purple-500/50 text-center w-full">
                          <div className="text-white text-xs font-bold truncate">{lead.name}</div>
                          <div className="text-purple-400 font-mono text-[8px] uppercase mt-0.5">{lead.role}</div>
                        </div>
                        {reportingCount > 0 && (
                          <div className="text-[9px] text-cyan-400 font-mono mt-2 bg-cyan-400/5 px-2 py-0.5 rounded-full border border-cyan-400/10">
                            {reportingCount} Reporting {reportingCount === 1 ? 'Member' : 'Members'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Add/Edit Department Modal */}
      <AnimatePresence>
        {deptModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setDeptModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-[0_0_50px_rgba(6,182,212,0.25)] z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FolderKanban className="text-cyan-400" size={20} />
                  {editingDept ? 'Modify Department' : 'Establish New Department'}
                </h3>
                <button onClick={() => setDeptModalOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveDept} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Department Name</label>
                  <input 
                    type="text" 
                    value={deptName} 
                    onChange={(e) => setDeptName(e.target.value)} 
                    placeholder="e.g. Quantum Computing Team" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Display Priority Order</label>
                  <input 
                    type="number" 
                    value={deptOrder} 
                    onChange={(e) => setDeptOrder(Number(e.target.value))} 
                    placeholder="e.g. 10 (Higher numbers sorted last)" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Adjusts ordering of navigation tabs on landing page.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Mission / Description</label>
                  <textarea 
                    value={deptDesc} 
                    onChange={(e) => setDeptDesc(e.target.value)} 
                    placeholder="Describe this department's goals and scope..." 
                    rows={3} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setDeptModalOpen(false)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-cyan-500 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Add/Edit Member Modal */}
      <AnimatePresence>
        {memberModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setMemberModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 md:p-8 w-full max-w-2xl h-[85vh] overflow-y-auto shadow-[0_0_50px_rgba(6,182,212,0.25)] z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="text-cyan-400" size={20} />
                  {editingMember ? 'Edit Member Registry' : 'Register New Syndicate Member'}
                </h3>
                <button onClick={() => setMemberModalOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={memName} 
                      onChange={(e) => setMemName(e.target.value)} 
                      placeholder="e.g. John Doe" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Role / Designation</label>
                    <input 
                      type="text" 
                      value={memRole} 
                      onChange={(e) => setMemRole(e.target.value)} 
                      placeholder="e.g. Web Master" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className={`space-y-1 ${(memRole.toLowerCase() === 'chair' || editingMember?.id === 'chair') ? '' : 'md:col-span-2'}`}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={memEmail} 
                      onChange={(e) => setMemEmail(e.target.value)} 
                      placeholder="john@klu.ac.in" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono"
                    />
                  </div>

                  {(memRole.toLowerCase() === 'chair' || editingMember?.id === 'chair') && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Phone</label>
                      <input 
                        type="text" 
                        value={memContact} 
                        onChange={(e) => setMemContact(e.target.value)} 
                        placeholder="+91 98765 43210" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Assigned Department</label>
                    <select 
                      value={memDeptId} 
                      onChange={(e) => setMemDeptId(e.target.value)}
                      className="w-full bg-[#050811] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Hierarchy Level</label>
                    <select 
                      value={memLevel} 
                      onChange={(e) => setMemLevel(e.target.value as any)}
                      className="w-full bg-[#050811] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                    >
                      <option value="executive">Executive (Core Officers)</option>
                      <option value="lead">Department Lead</option>
                      <option value="member">Syndicate Member</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Reports to (Parent Node)</label>
                    <select 
                      value={memReportsTo} 
                      onChange={(e) => setMemReportsTo(e.target.value)}
                      className="w-full bg-[#050811] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                    >
                      <option value="">No Direct Reporting Parent (Root)</option>
                      {members
                        .filter(m => m.id !== editingMember?.id) // Prevent self-reporting loops
                        .map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Profile Photo URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={memPhoto} 
                        onChange={(e) => setMemPhoto(e.target.value)} 
                        placeholder="https://images.unsplash.com/... or blank" 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Core Skills (comma separated)</label>
                  <input 
                    type="text" 
                    value={memSkills} 
                    onChange={(e) => setMemSkills(e.target.value)} 
                    placeholder="React, CSS Grid, Branding, Photography" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">LinkedIn Profile</label>
                    <input 
                      type="text" 
                      value={memLinkedin} 
                      onChange={(e) => setMemLinkedin(e.target.value)} 
                      placeholder="linkedin.com/in/username" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">GitHub Profile Link</label>
                    <input 
                      type="text" 
                      value={memGithub} 
                      onChange={(e) => setMemGithub(e.target.value)} 
                      placeholder="github.com/username" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Portfolio / Website Link</label>
                  <input 
                    type="text" 
                    value={memPortfolio} 
                    onChange={(e) => setMemPortfolio(e.target.value)} 
                    placeholder="https://share.google/... or personal website" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Member Biography</label>
                    <textarea 
                      value={memBio} 
                      onChange={(e) => setMemBio(e.target.value)} 
                      placeholder="Brief intro details..." 
                      rows={3} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Key Contributions</label>
                    <textarea 
                      value={memContributions} 
                      onChange={(e) => setMemContributions(e.target.value)} 
                      placeholder="Special milestones and event organization details..." 
                      rows={3} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setMemberModalOpen(false)}
                    className="flex-1 py-3.5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3.5 bg-cyan-500 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all font-bold"
                  >
                    Commit Registry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
