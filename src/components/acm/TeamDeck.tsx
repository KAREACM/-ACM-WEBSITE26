import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, Linkedin, Github, Mail, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Seeding logic for local storage
const seedDataIfEmpty = () => {
  const storedDepts = localStorage.getItem('acm_departments');
  const storedMembers = localStorage.getItem('acm_members');

  const defaultDepts = [
    { id: 'dept-core', name: 'Executive Board', description: 'Governs the student chapter and guides strategy.', order: 1 },
    { id: 'dept-admin', name: 'Administration Department', description: 'Handles archives, minutes, and schedules.', order: 2 },
    { id: 'dept-finance', name: 'Finance Department', description: 'Manages chapter budgeting and corporate sponsors.', order: 3 },
    { id: 'dept-membership', name: 'Membership Department', description: 'Coordinates registrations, database, and benefits.', order: 4 },
    { id: 'dept-web', name: 'Web & Technical Department', description: 'Designs and deploys ACM Kare digital systems.', order: 5 },
    { id: 'dept-graphics', name: 'Graphics Department', description: 'Branding, vector design, and UI wireframes.', order: 6 },
    { id: 'dept-lens', name: 'Lens & Edit Department', description: 'Cinematic coverage and video archiving.', order: 7 },
    { id: 'dept-content', name: 'Content Department', description: 'Blogs, copy editing, and technical writings.', order: 8 },
    { id: 'dept-events', name: 'Events Department', description: 'Organizes registrations, stage setups, and timeline agendas.', order: 9 }
  ];

  const defaultMembers = [
    // 1. Executive Board
    { id: 'chair', name: 'Shaik Thaha', role: 'Chair', email: 'shaikthaha2005@gmail.com', contact: '7893340788', photo: '/assets/images/team/shaik_thaha.jpg', departmentId: 'dept-core', level: 'executive', skills: ['Strategic Planning', 'Leadership', 'Public Relations'], contributions: 'Presides over all chapter events, coordinates between faculty and students, and sets the chapter\'s vision.', bio: 'Motivated Computer Science undergraduate with a strong foundation in Python, JavaScript, and web development, seeking a software engineering role to build scalable and secure applications. Passionate about solving real-world problems through technology, with hands-on experience in AI-driven and full-stack development, and eager to contribute in collaborative, fast-paced environments.', linkedin: 'www.linkedin.com/in/shaik-thaha-6b10b1290', github: 'https://github.com/thaha55577' },
    { id: 'vice-chair', name: 'HARINI AEDULLA', role: 'Vice Chair', email: '99230040469@klu.ac.in', contact: '+91 98765 43211', photo: '/assets/images/team/harini_aedulla.jpg', departmentId: 'dept-core', level: 'executive', reportsTo: 'chair', skills: ['Event Management', 'Operations', 'Public Speaking'], contributions: 'Assisting the Chair in all tasks and managing the executive council\'s day-to-day operations.', bio: 'Harini manages internal operations and ensures smooth execution of all ACM KARE workshops.', linkedin: 'https://www.linkedin.com/in/hariniaedulla', github: 'https://github.com/aedullaharinireddy' },
    { id: 'president', name: 'Marcus Brody', role: 'President', email: 'marcus@klu.ac.in', contact: '+91 98765 43212', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', departmentId: 'dept-core', level: 'executive', reportsTo: 'chair', skills: ['Project Coordination', 'Budgeting', 'Outreach'], contributions: 'Directs the project leads and ensures all department deliverables are met on schedule.', bio: 'Marcus oversees all project management teams and facilitates collaborative hackathons.' },

    // 2. Administration Department
    { id: 'secretary', name: 'Gali Gargeya Mithra', role: 'Secretary', email: 'gargeyam18@gmail.com', contact: '', photo: '/assets/images/team/gali_gargeya_mithra.jpg', departmentId: 'dept-admin', level: 'executive', skills: ['Software Development', 'Machine Learning', 'Problem Solving', 'Event Organization'], contributions: 'Organizes technical events, documents minutes, and coordinates external communications.', bio: "I'm Gargeya Mithra, currently serving as the Secretary of the ACM Student Chapter. I'm a Computer Science student passionate about software development, machine learning, and problem-solving. I enjoy organizing technical events, collaborating with teams, and creating opportunities for students to learn and grow. I'm excited to contribute to ACM and help build a strong tech community.", linkedin: 'https://www.linkedin.com/in/gargeya-mithra-6102273aa/?skipRedirect=true', github: 'https://github.com/gargeya18' },
    { id: 'sec-member', name: 'Rishitha Tedlapalli', role: 'Secretary', email: 'tedlapallirishitha@gmail.com', contact: '', photo: '/assets/images/team/rishitha_tedlapalli.jpg', departmentId: 'dept-admin', level: 'executive', skills: ['Administration', 'Event Coordination', 'Record Keeping', 'Team Management'], contributions: 'Coordinates team activities, manages communications, maintains records, and organizes workshops.', bio: "As the Secretary of ACM, I ensure smooth coordination between all team members and activities. I manage communications, maintain records, and help organise events and workshops. My role is to keep everyone informed, aligned, and on track. I work behind the scenes to turn ideas into successful initiatives for our ACM community.", linkedin: 'https://www.linkedin.com/in/rishitha-tedlapalli-558480307/', github: 'https://github.com/Rishitha7272' },

    // 3. Finance Department
    { id: 'treasurer-1', name: 'Karli Tejasree', role: 'Treasurer', email: 'karlitejasree@gmail.com', contact: '', photo: '/assets/images/team/karli_tejasree.jpg', departmentId: 'dept-finance', level: 'executive', skills: ['Budgeting', 'Financial Management', 'Resource Allocation', 'Event Planning'], contributions: 'Manages the chapter\'s budget, funds technical workshops, hackathons, and guest speaker events.', bio: 'Hi everyone! I am thrilled to serve as the Treasurer of ACM Student Chapter . My focus is on managing our chapter’s budget effectively to fund high-impact tech workshops, hackathons, and guest speaker events. I look forward to keeping our organization financially healthy and maximizing value for all our members.', linkedin: 'https://www.linkedin.com/in/teju-karli-32593a402?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    { id: 'treasurer-2', name: 'Bijjam Laasya Reddy', role: 'Treasurer', email: 'laasyareddybijjam@gmail.com', contact: '', photo: '/assets/images/team/bijjam_laasya_reddy.jpg', departmentId: 'dept-finance', level: 'executive', skills: ['Financial Record Keeping', 'Excel', 'Budget Management', 'Resource Planning'], contributions: 'Responsible for managing finances, maintaining financial records, and supporting activities and events.', bio: 'Hi, I\'m Laasya Reddy, serving as the Treasurer of the ACM KARE Student Chapter. I am responsible for managing finances, maintaining financial records, and supporting the planning and execution of various ACM activities,events also ensuring the smooth functioning of the club and contributing to the growth of our ACM community.', linkedin: 'https://www.linkedin.com/in/laasya-reddy-bijjam-a32430370', github: 'https://github.com/LaasyareddyB' },

    // 4. Membership Department
    { id: 'membership-chair', name: 'Uyyuri.Bhanu Prasad', role: 'Membership Chair', email: 'uyyuribhanuprasad20@gmail.com', contact: '', photo: '/assets/images/team/uyyuri_bhanu_prasad.jpg', departmentId: 'dept-membership', level: 'executive', skills: ['Community Building', 'Outreach', 'Event Planning', 'Leadership'], contributions: 'Manages member recruitment, maintains the active student registry, and coordinates member benefits.', bio: "Hello, I am Bhanu Prasad, an Electronics and Communication Engineering student and the Membership Chair of the ACM Student Chapter. As Membership Chair, I focus on building a strong, collaborative community by encouraging student participation and creating opportunities for professional and technical growth.", linkedin: 'www.linkedin.com/in/uyyuri-bhanuprasad-39581832a', github: 'https://github.com/ubhanuprasad' },

    // 5. Web & Technical Department
    { id: 'web-master', name: 'P VENKATA SAI', role: 'Web Master', email: 'p.venkatasai07@gmail.com', contact: '', photo: '/assets/images/team/p_venkata_sai.png', departmentId: 'dept-web', level: 'lead', skills: ['React', 'Node.js', 'Python', 'Full Stack', 'Cybersecurity'], contributions: 'Created and maintained the KARE ACM website, deployment pipelines, and custom portals.', bio: 'I am a 3rd-year B.Tech CSE (IoT & Cybersecurity) student at Kalasalingam University with a strong passion for Full Stack Development and AI-powered applications. As an active member of the ACM Student Chapter, I contribute to technical events, workshops, and collaborative learning initiatives. I have experience building web applications using React, Node.js, Python, and modern development tools.', linkedin: 'https://www.linkedin.com/in/ponaka-venkata-sai?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/Venkatasai6789' },
    { id: 'web-member-1', name: 'Pasunoori Sai Muralidhar Reddy', role: 'Web Developer', email: 'pasunoorisaimuralidharreddy@gmail.com', contact: '', photo: '/assets/images/team/pasunoori_sai_muralidhar_reddy.jpg', departmentId: 'dept-web', level: 'member', reportsTo: 'web-master', skills: ['React', 'TypeScript', 'TailwindCSS', 'Web Development'], contributions: 'Contributes to frontend technical projects and develops clean, responsive user interfaces.', bio: 'I am Muralidhar Reddy, a Web Developer in ACM. I have a strong interest in web development and enjoy building modern, responsive websites. Through ACM, I aim to contribute to technical projects, learn new technologies, and work with fellow members to create a positive impact in the student community.', linkedin: 'www.linkedin.com/in/muralidhar1380', github: 'https://github.com/pasunoorisaimuralidharreddy-commits' },
    { id: 'web-member-2', name: 'Marla Singer', role: 'Technical Team Member 2', email: 'marla@klu.ac.in', contact: '+91 98765 43220', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', departmentId: 'dept-web', level: 'member', reportsTo: 'web-master', skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'], contributions: 'Architected the backend database schema and API endpoints for student registration.', bio: 'Marla designs high-performance server logic and maintains relational databases.' },
    { id: 'web-member-3', name: 'Robert Paulson', role: 'Technical Team Member 3', email: 'robert@klu.ac.in', contact: '+91 98765 43221', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80', departmentId: 'dept-web', level: 'member', reportsTo: 'web-master', skills: ['CI/CD', 'AWS', 'Linux Shell', 'Vite'], contributions: 'Configured automated deployment workflows and optimized build systems for fast page loads.', bio: 'Robert focuses on build pipelines, cloud hosting setups, and continuous integration workflows.' },

    // 6. Graphics Department
    { id: 'graphics-lead', name: 'B. Srujana Reddy', role: 'Graphics Lead', email: 'srujana10807@gmail.com', contact: '', photo: '/assets/images/team/b_srujana_reddy.jpg', departmentId: 'dept-graphics', level: 'lead', skills: ['Canva', 'Graphic Design', 'Visual Communication', 'Python', 'AI/ML'], contributions: 'Directed the design system and branding guidelines for all ACM event posters and assets.', bio: 'I am B. Srujana Reddy, a 3rd-year Computer Science and Engineering student and the Graphics Lead of the ACM Student Chapter. I design visual content and promotional creatives, and I am passionate about Python, Artificial Intelligence, Machine Learning, and graphic design.', linkedin: 'https://www.linkedin.com/in/srujana-reddy-91238a388?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/srujanareddy10807' },
    { id: 'graphics-member-1', name: 'Vankiraju Thanu Sri Sai', role: 'Graphic Designer', email: 'thanusriraju2006@gmail.com', contact: '', photo: '/assets/images/team/vankiraju_thanu_sri_sai.jpg', departmentId: 'dept-graphics', level: 'member', reportsTo: 'graphics-lead', skills: ['Graphic Design', 'Visual Communication', 'Python Programming', 'Poster Design'], contributions: 'Contributes to designing posters, promotional content, social media creatives, and event banners for various technical and non-technical events.', bio: 'I am Vankiraju Thanu Sri Sai, a B.Tech student pursuing Computer Science and Engineering. I currently serve as a Graphic Designer in the ACM Student Chapter, where I contribute to designing posters, promotional content, social media creatives, and event banners for various technical and non-technical events.\nI am passionate about both technology and design, continuously learning and improving my skills in Python Programming, Graphic Design, and Visual Communication. Through ACM and my academic journey, I strive to combine creativity with technical knowledge to create impactful solutions and engaging designs.\nThrough my involvement in ACM, I aim to enhance both my technical and creative abilities while contributing effectively to projects, events, and the student community.', linkedin: 'https://www.linkedin.com/in/thanu-sri-sai-vankiraju-b070bb380?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/thanusriraju2006', portfolio: 'https://share.google/bBO2nsZSgeauNbpjl' },
    { id: 'graphics-member-2', name: 'POLISETTI SUJITH SIVA SAI MANIKANTA', role: 'Graphic Designer', email: 'koushisuji143@gmail.com', contact: '', photo: '/assets/images/team/polisetti_sujith_siva_sai_manikanta.jpg', departmentId: 'dept-graphics', level: 'member', reportsTo: 'graphics-lead', skills: ['Graphic Design', 'Visual Arts', 'Canva', 'Creative Design'], contributions: 'Creates and drafts creative event designs and visual assets for social media.', bio: 'I am Sujith, a passionate Graphic Designer and Third-year CSE student ,Turning ideas into impactful visuals. Focused on creativity, quality, and delivering designs that leave a lasting impression.', linkedin: 'https://linkedin.com/in/sujith-siva-sai-manikanta-polisetti-babb11385', github: 'https://github.com/Sujith-Polisetti' },
    { id: 'graphics-member-3', name: 'SOUPARNIKA BAIJU', role: 'Graphic Designer', email: 'souparnikabaiju3318@gmail.com', contact: '', photo: '/assets/images/team/souparnika_baiju.jpg', departmentId: 'dept-graphics', level: 'member', reportsTo: 'graphics-lead', skills: ['Graphic Design', 'Poster Design', 'Visual Branding', 'Canva'], contributions: 'Creates engaging posters and visual content for events and workshops.', bio: 'My name is Souparnika Baiju , and my role in the club is Graphics Designer. I enjoy creating posters and visual content that make ideas more engaging and impactful. I look forward to contributing my creativity and working with the team.', linkedin: 'https://www.linkedin.com/in/souparnika-baiju-832b283b4', github: 'https://github.com/souparnika07' },
    { id: 'graphics-member-4', name: 'Sri Vishvaja', role: 'Graphic Designer', email: 'srivishvaja@gmail.com', contact: '', photo: '/assets/images/team/sri_vishvaja.jpg', departmentId: 'dept-graphics', level: 'member', reportsTo: 'graphics-lead', skills: ['Graphic Design', 'Visual Arts', 'Canva', 'Creative Design'], contributions: 'Creates and drafts creative event designs and visual assets for social media.', bio: 'I am Vishvaja, a Graphic Designer passionate about creating creative and impactful designs. As a member of ACM, I look forward to contributing to the club\'s visual identity, promoting events through engaging designs, and enhancing my skills through collaboration and learning.', linkedin: 'https://www.linkedin.com/in/sri-vishvaja-8818b3379?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/SriVishvaja' },

    // 7. Lens & Edit Department
    { id: 'lens-lead', name: 'ARYAN KARACHI', role: 'Lens & Edit Lead', email: 'Aryanavenger77@gmail.com', contact: '', photo: '/assets/images/team/aryan_karachi.jpg', departmentId: 'dept-lens', level: 'lead', skills: ['Photography', 'Videography', 'DaVinci Resolve', 'Premiere Pro', 'Visual Editing'], contributions: 'Captures event moments, produces promotional teaser videos, and manages media archives.', bio: "Hi, I'm KARACHIARYAN, the Lens and Edit Lead. I oversee photography and editing, ensuring our content is creative, engaging, and professionally presented. Glad to be part of the team", linkedin: 'https://www.linkedin.com/in/aryan-karachi-2a6aa6308?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/Aryan1v1z' },

    // 8. Content Department
    { id: 'content-lead', name: 'Lois Lane', role: 'Content Writer Lead', email: 'lois@klu.ac.in', contact: '+91 98765 43227', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', departmentId: 'dept-content', level: 'lead', skills: ['Creative Writing', 'SEO Copywriting', 'Editorial Strategy'], contributions: 'Manages the chapter blog, writes newsletters, and curates script drafts for promotional videos.', bio: 'Lois reviews all written materials and leads content planning campaigns.' },
    { id: 'content-member-1', name: 'Clark Kent', role: 'Content Member 1', email: 'clark@klu.ac.in', contact: '+91 98765 43228', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', departmentId: 'dept-content', level: 'member', reportsTo: 'content-lead', skills: ['Technical Blogging', 'Research', 'Academic Writing'], contributions: 'Researches and compiles informative deep-dives for ACM\'s monthly articles.', bio: 'Clark is a tech writer focusing on emerging AI models and security frameworks.' },
    { id: 'content-member-2', name: 'Gali Charitha', role: 'Content Writer', email: 'galicharitha710@gmail.com', contact: '', photo: '/assets/images/team/gali_charitha.jpg', departmentId: 'dept-content', level: 'member', reportsTo: 'content-lead', skills: ['Content Writing', 'Creative Writing', 'Blogging', 'Visual Communication'], contributions: 'Creates engaging content and drafts articles for ACM publications.', bio: "Hi, I'm Gali Charitha, a B.Tech 3rd year student. I enjoy writing and sharing ideas creatively. As a Content Writer in ACM, I look forward to creating engaging content and contributing to the team while improving my skills.", linkedin: 'https://www.linkedin.com/in/charitha-gali-b198a6345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', github: '' },
    { id: 'content-member-3', name: 'Swethaa S D', role: 'Content Writer', email: 'sdswethaa@gmail.com', contact: '', photo: '/assets/images/team/swethaa_s_d.png', departmentId: 'dept-content', level: 'member', reportsTo: 'content-lead', skills: ['Content Writing', 'Communication', 'Creative Writing', 'Community Building'], contributions: 'Creates and writes content highlighting ACM activities and sharing technical knowledge.', bio: "I'm Swethaa S D, a Content Writer at ACM. I enjoy writing, communication, and expressing ideas. Through this role, I aim to create and write content that highlights ACM's activities, shares knowledge, and fosters a stronger sense of community among members.", linkedin: 'https://www.linkedin.com/in/swethaa-s-d-513a51379/', github: 'https://github.com/sdswethaa-git' },
    { id: 'content-member-4', name: 'Cat Grant', role: 'Content Member 4', email: 'cat@klu.ac.in', contact: '+91 98765 43231', photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80', departmentId: 'dept-content', level: 'member', reportsTo: 'content-lead', skills: ['Interviews', 'Scriptwriting', 'Podcast Curating'], contributions: 'Drafts dialogue scripts for video modules and interviews guest technical speakers.', bio: 'Cat specializes in scripting conversations and speaker outreach logs.' },
    { id: 'content-member-5', name: 'Ron Troupe', role: 'Content Member 5', email: 'ron@klu.ac.in', contact: '+91 98765 43232', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', departmentId: 'dept-content', level: 'member', reportsTo: 'content-lead', skills: ['Newsletter Design', 'Substack Editing', 'Analytics'], contributions: 'Coordinates layout styling for ACM Newsletters and monitors subscriber engagement metrics.', bio: 'Ron designs newsletter mailings and monitors user subscriptions.' },

    // 9. Events Department
    { id: 'events-lead', name: 'BL Pavan sai markandeyulu', role: 'Overall Event Coordinator', email: 'pawank67m@gmail.com', contact: '', photo: '/assets/images/team/bl_pavan_sai_markandeyulu.jpg', departmentId: 'dept-events', level: 'lead', skills: ['Logistics', 'Event Coordination', 'Team Leadership', 'Resource Management'], contributions: 'Spearheads the logistics, permissions, and vendor coordination for all technical symposia.', bio: "Overall Event Coordinator at ACM, responsible for planning, organizing, and executing events. Coordinates teams, manages logistics, and ensures successful event delivery", linkedin: 'https://www.linkedin.com/in/pavan-sai-a9aab7324', github: 'https://github.com/Pawank67m' },
    { id: 'events-member-1', name: 'Amara Satya Gayatri Kumari', role: 'Event Coordinator', email: 'gayatriamara27@gmail.com', contact: '', photo: '/assets/images/team/amara_satya_gayatri_kumari.jpg', departmentId: 'dept-events', level: 'member', reportsTo: 'events-lead', skills: ['Event Planning', 'Team Coordination', 'Workshop Management', 'Logistics'], contributions: 'Coordinates workshops, technical sessions, and registrations for ACM initiatives.', bio: "Hello! I'm Gayathri, and I serve as the Event Coordinator of ACM. I am passionate about bringing people together through engaging events and activities. My role involves planning and coordinating workshops, technical sessions, and various ACM initiatives. I enjoy working with teams, learning new things, and creating opportunities for students to connect, grow, and enhance their skills.", linkedin: 'https://www.linkedin.com/in/amara-satya-gayatri-kumari-992748323', github: 'https://github.com/gayatriamara-tech' },
    { id: 'events-member-2', name: 'A Nanda Kishor Reddy', role: 'Event Coordinator', email: 'nandakishor1709@gmail.com', contact: '', photo: '/assets/images/team/a_nanda_kishor_reddy.jpg', departmentId: 'dept-events', level: 'member', reportsTo: 'events-lead', skills: ['Event Coordination', 'Logistics Support', 'Team Collaboration', 'Audio/Visual Setup'], contributions: 'Assists in planning and coordinates logistics and setup for event venues.', bio: 'I am Nanda Kishor Reddy working in event coordinating team.', linkedin: 'https://www.linkedin.com/in/nanda-kishor-attunuri-b29aa4325?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/Nandakishor-NKR' },
    { id: 'events-member-3', name: 'Tim Drake', role: 'Event Coordinator 3', email: 'tim@klu.ac.in', contact: '+91 98765 43236', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', departmentId: 'dept-events', level: 'member', reportsTo: 'events-lead', skills: ['Feedback Logging', 'Schedule Audits', 'Hospitality'], contributions: 'Maintains timeline agendas and coordinates travel/lodging schedules for visiting judges.', bio: 'Tim reviews feedback logs, hospitality arrangements, and event schedules.' }
  ];

  if (!storedDepts) {
    localStorage.setItem('acm_departments', JSON.stringify(defaultDepts));
  }
  if (!storedMembers) {
    localStorage.setItem('acm_members', JSON.stringify(defaultMembers));
  } else {
    // Migrate existing database in localStorage to the new chairperson details & vice-chair details
    try {
      const parsedMembers = JSON.parse(storedMembers);
      let updated = false;
      let currentMembers = [...parsedMembers];

      // 1. Add any missing default members to localStorage database
      defaultMembers.forEach((dm) => {
        const exists = currentMembers.some((m: any) => m.id === dm.id);
        if (!exists) {
          currentMembers.push({ ...dm });
          updated = true;
        }
      });

      // 2. Synchronize details (like corrected photo paths) for existing default members
      const updatedMembers = currentMembers.map((m: any) => {
        const defaultMember = defaultMembers.find(dm => dm.id === m.id);
        if (defaultMember) {
          if (
            m.name !== defaultMember.name ||
            m.photo !== defaultMember.photo ||
            m.email !== defaultMember.email ||
            m.role !== defaultMember.role ||
            m.bio !== defaultMember.bio ||
            m.linkedin !== defaultMember.linkedin ||
            m.github !== defaultMember.github
          ) {
            m.name = defaultMember.name;
            m.role = defaultMember.role;
            m.email = defaultMember.email;
            m.contact = defaultMember.contact;
            m.photo = defaultMember.photo;
            m.skills = defaultMember.skills;
            m.contributions = defaultMember.contributions;
            m.bio = defaultMember.bio;
            m.linkedin = defaultMember.linkedin;
            m.github = defaultMember.github;
            if ('portfolio' in defaultMember) {
              m.portfolio = (defaultMember as any).portfolio;
            } else {
              delete m.portfolio;
            }
            updated = true;
          }
        }
        return m;
      });
      if (updated) {
        localStorage.setItem('acm_members', JSON.stringify(updatedMembers));
      }
    } catch (e) {
      console.error('Failed to parse or migrate stored members:', e);
    }
  }
};

const facultyCoordinators = [
  {
    id: 'fc-chinnasamy',
    name: 'Dr. P. Chinnasamy',
    role: 'Associate Professor & Research Supervisor',
    image: '/assets/images/faculty/dr_p_chinnasamy.jpg',
    specializations: ['Cloud Security', 'Cryptography', 'Blockchain', 'Access Control'],
    bio: 'Anna University Research Supervisor with Ph.D. in CSE. Expert in cloud computing security with 19 SCIE publications, 15 patents, and supervises 6 PhD scholars. Co-PI on international project with UTAR Malaysia.',
    stats: { publications: '19', patents: '15', phdScholars: '6' },
    linkedin: 'https://www.linkedin.com/in/dr-p-chinnasamy-52674b3b',
    profileLink: 'https://chinnaswamyy.netlify.app/',
    email: 'chinnasamyponnusamy@gmail.com',
  },
  {
    id: 'fc-reshini',
    name: 'Ms. S. Reshini',
    role: 'Assistant Professor & AI Researcher',
    image: '/assets/images/faculty/ms_reshini.jpg',
    specializations: ['Machine Learning', 'Data Analytics', 'Emergency Vehicle Detection', 'NLP'],
    bio: 'AI researcher with 5 years of industry experience at KGISL and 2+ years in academia. Research focuses on emergency vehicle detection using YOLOv9 & R-CNN, and data analytics for E-commerce.',
    stats: { publications: '3', yearsTeaching: '2+', yearsIndustry: '5' },
    linkedin: 'https://www.linkedin.com/in/reshni-suresh-5b94061b',
    profileLink: 'https://sreshinii.netlify.app/',
    email: 's.reshini@klu.ac.in',
  },
  {
    id: 'fc-nagarajan',
    name: 'Dr. Nagarajan M.K.',
    role: 'Associate Professor & CS Research Expert',
    image: '/assets/images/faculty/dr_nagarajan.jpg',
    specializations: ['Wireless Sensor Networks', 'Cloud Computing', 'Network Security', 'IoT'],
    bio: 'Ph.D. from Anna University (2024) with 15+ years of academic excellence. Expert in energy-efficient routing, swarm intelligence algorithms. Holds 3 patents including Robotic Surgery Machine.',
    stats: { publications: '15+', patents: '3', experience: '15+' },
    linkedin: '#',
    profileLink: 'https://nagarajann.netlify.app/',
    email: 'nagarajan45@gmail.com',
  },
  {
    id: 'fc-marimuthu',
    name: 'Dr. Marimuthu',
    role: 'Assistant Professor & Researcher in Computer Science',
    image: '/assets/images/faculty/dr_marimuthu.jpg',
    specializations: ['Bio-computational Models', 'Machine Learning', 'Healthcare AI', 'Deep Learning'],
    bio: 'MCA Gold Medalist with 16+ years teaching experience. ISRO project trainee. Ph.D. in bio-computational models for dengue gene analysis. UGC Minor Research Project recipient (₹1.6L).',
    stats: { publications: '21', experience: '16+', students: '500+' },
    linkedin: '#',
    profileLink: 'https://marimuthuu.netlify.app/',
    email: 'marimuthu@klu.ac.in',
  },
  {
    id: 'fc-surendiran',
    name: 'D. Surendiran Muthukumar',
    role: 'Assistant Professor & PhD Research Scholar',
    image: '/assets/images/faculty/d_surendiran_muthukumar.jpg',
    specializations: ['Algorithm Intelligence', 'Robotics', 'Federated Learning', 'Autonomous Vehicles'],
    bio: 'Pursuing PhD at KARE with focus on federated learning in healthcare. Developed autonomous surface vehicles & underwater bio-mimics robots for NSTL & IIT Indore. 4 Scopus publications.',
    stats: { publications: '4', fundedProjects: '2', conferences: '3' },
    linkedin: '#',
    profileLink: 'https://surendirann.netlify.app/',
    email: 'd.surendiran@klu.ac.in',
  },
  {
    id: 'fc-gurusigaamani',
    name: 'Dr. Gurusigaamani',
    role: 'Assistant Professor & AI Research Expert',
    image: '/assets/images/faculty/dr_gurusigaamani.jpg',
    specializations: ['Machine Learning', 'Deep Learning', 'Healthcare AI', 'IoT Security'],
    bio: "10+ years in CS education. Pursuing PhD in CSE. Supervised 260+ students, organized Techathon'25 hackathon & multiple ACM events. Published in IEEE, authored 2 books on IoT/Big Data and AI in Cloud.",
    stats: { publications: '6+', students: '260+', experience: '10+' },
    linkedin: '#',
    profileLink: 'https://gurusigaamani.netlify.app/',
    email: 'gurusigaamani@klu.ac.in',
  }
];


const HologramCard = ({ member, onClick }: { member: any, onClick?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layoutId={`member-${member.id}`}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full aspect-[3/4] rounded-2xl cursor-pointer group"
    >
      <div className="absolute inset-0 rounded-2xl overflow-hidden acm-team-card">
        <div className="absolute inset-2 rounded-xl overflow-hidden bg-slate-900/60">
          <img 
            src={member.photo || member.image} 
            alt={member.name}
            className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 h-[15%] w-full acm-scanline-active mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        <div 
          className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-white/10 transform group-hover:-translate-y-2 transition-transform duration-500 z-10 acm-team-border-active"
          style={{ transform: "translateZ(40px)" }}
        >
          <h3 className="acm-team-text-active font-bold text-sm md:text-md truncate tracking-tight">{member.name}</h3>
          <p className="text-slate-300 text-[10px] md:text-xs font-mono tracking-widest uppercase mt-1">{member.role}</p>
        </div>
        
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 acm-team-border-active rounded-tl-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 acm-team-border-active rounded-tr-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 acm-team-border-active rounded-bl-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 acm-team-border-active rounded-br-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
};

const CinematicOverlay = ({ members, onComplete }: { members: any[], onComplete: () => void }) => {
  const [phase, setPhase] = useState<'lock' | 'zooming' | 'portal' | 'faculty' | 'leads' | 'grid'>('lock');
  const [hovered, setHovered] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout>();

  const startSequence = () => {
    if (phase !== 'lock') return;
    setPhase('zooming');
    setTimeout(() => setPhase('portal'), 1500);
    setTimeout(() => setPhase('faculty'), 2500);
    setTimeout(() => setPhase('leads'), 6500);
    setTimeout(() => setPhase('grid'), 10000);
    setTimeout(() => onComplete(), 13000);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const lead1 = members[0] || { id: 'l1', name: 'Awaiting Chair', role: 'Chair', photo: '' };
  const lead2 = members[1] || { id: 'l2', name: 'Awaiting Vice Chair', role: 'Vice Chair', photo: '' };
  const lead3 = members[2] || { id: 'l3', name: 'Awaiting President', role: 'President', photo: '' };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <button onClick={onComplete} className="absolute top-8 right-8 z-50 text-white/50 hover:text-white font-mono text-xs uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-colors hover:bg-white/10">
        Skip Intro
      </button>

      <AnimatePresence>
        {(phase === 'lock' || phase === 'zooming') && (
           <motion.div 
             key="logo"
             onMouseEnter={() => { setHovered(true); hoverTimer.current = setTimeout(startSequence, 1000); }}
             onMouseLeave={() => { setHovered(false); clearTimeout(hoverTimer.current); }}
             onClick={startSequence}
             animate={
               phase === 'zooming' 
                 ? { scale: 30, opacity: 0, filter: 'blur(20px)', y: -100 } 
                 : { scale: hovered ? 1.05 : 1, filter: hovered ? 'drop-shadow(0 0 30px rgba(6,182,212,0.6))' : 'drop-shadow(0 0 0px rgba(0,0,0,0))' }
             }
             transition={{ duration: phase === 'zooming' ? 1.5 : 0.4, ease: "easeInOut" }}
             className="relative w-64 h-64 flex flex-col items-center justify-center cursor-pointer group"
           >
              <img src="/assets/images/logo/acm_logo.png" alt="ACM KARE" className="w-full h-full object-contain relative z-10" />
              {hovered && phase === 'lock' && (
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-12 text-cyan-400 font-mono text-xs tracking-widest animate-pulse whitespace-nowrap">
                  Hold or Click to Unlock
                </motion.span>
              )}
           </motion.div>
        )}

        {phase === 'portal' && (
           <motion.div key="portal" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2 }} transition={{ duration: 1 }} className="absolute inset-0 flex items-center justify-center mix-blend-screen pointer-events-none">
               <div className="w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.3)_0%,transparent_50%)] animate-pulse"></div>
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50"></div>
           </motion.div>
        )}

        {phase === 'faculty' && (
           <motion.div key="faculty" initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }} transition={{ duration: 1, ease: "easeOut" }} className="absolute z-10 flex flex-col items-center pointer-events-none">
              <span className="text-cyan-400 font-mono tracking-[0.5em] text-xs md:text-sm uppercase mb-8 animate-pulse text-center">Faculty Coordinator</span>
              <div className="w-72 md:w-80 aspect-[3/4] pointer-events-auto">
                <HologramCard member={facultyCoordinators[0]} />
              </div>
           </motion.div>
        )}

        {phase === 'leads' && (
           <motion.div key="leads" className="absolute z-10 flex flex-col items-center w-full px-6 md:px-12 pointer-events-none">
              <span className="text-cyan-400 font-mono tracking-[0.5em] text-xs md:text-sm uppercase mb-12 animate-pulse text-center">Core Command</span>
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center w-full max-w-5xl pointer-events-auto">
                 {[lead1, lead2, lead3].map((lead, i) => (
                    <motion.div key={lead.id} initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }} transition={{ delay: i * 0.6, duration: 0.8 }} className="w-56 md:w-72 aspect-[3/4]">
                       <HologramCard member={lead} />
                    </motion.div>
                 ))}
              </div>
           </motion.div>
        )}

        {phase === 'grid' && (
           <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden pt-10 md:pt-20 pointer-events-none">
              <span className="text-cyan-400 font-mono tracking-[0.5em] text-xs md:text-sm uppercase mb-8 text-center">The Syndicate</span>
              <div className="flex gap-4 md:gap-6 overflow-hidden w-[200vw] items-center justify-center flex-wrap px-4 md:px-32 pointer-events-auto">
                 {members.slice(3).map((student, i) => (
                    <motion.div key={student.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="w-32 md:w-48 aspect-[3/4] flex-shrink-0">
                       <HologramCard member={student} />
                    </motion.div>
                 ))}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MemberModal = ({ member, onClose }: { member: any, onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(onClose, 15000);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <motion.div 
        layoutId={`member-${member.id}`} 
        className="relative w-full max-w-6xl h-[85vh] bg-[#050505] border border-cyan-500/30 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(6,182,212,0.2)] z-10"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-cyan-500 hover:text-black transition-colors backdrop-blur-md">
          <X size={20} />
        </button>

        <div className="w-full md:w-[45%] h-1/2 md:h-full relative overflow-hidden bg-black">
          <img 
            src={member.photo || member.image} 
            alt={member.name} 
            className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-100 hover:scale-[1.03] transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="absolute bottom-10 left-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-md">{member.name}</h2>
            <p className="text-cyan-400 font-mono tracking-widest uppercase mt-2 drop-shadow-md">{member.role}</p>
          </motion.div>
        </div>

        <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col justify-center relative bg-gradient-to-br from-[#050505] to-[#0a0a0a] overflow-y-auto">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <span className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em] mb-4 block">Identity Core</span>
            
            <p className="text-slate-300 leading-relaxed text-xs md:text-sm mb-8 border-l-2 border-cyan-500/30 pl-6">
              {member.bio || `${member.name} is a driving force behind the technical and administrative operations of ACM KARE.`}
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-white font-bold text-xs mb-2 uppercase tracking-widest">Contact Details</h4>
                <div className="text-slate-400 text-xs space-y-1 font-mono">
                  <p>Email: <span className="text-cyan-400">{member.email || "acm@klu.ac.in"}</span></p>
                  {(member.id === 'chair' || member.role.toLowerCase() === 'chair') && member.contact && (
                    <p>Phone: <span className="text-cyan-400">{member.contact}</span></p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-bold text-xs mb-2 uppercase tracking-widest">Core Skills</h4>
                <div className="flex gap-2 flex-wrap">
                  {(member.skills || ["System Design", "Leadership", "Full-Stack Dev"]).map((skill: string) => (
                     <span key={skill} className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] font-mono backdrop-blur-sm shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold text-xs mb-2 uppercase tracking-widest">Contributions</h4>
                <p className="text-slate-400 text-xs">{member.contributions || "Led multiple projects and organized workshops to advance computing as a science and profession."}</p>
              </div>
            </div>

            <div className="flex gap-4">
              {member.linkedin ? (
                <a 
                  href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-black hover:bg-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"
                >
                  <Linkedin size={18} />
                </a>
              ) : (
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-black hover:bg-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"><Linkedin size={18} /></a>
              )}
              {member.github ? (
                <a 
                  href={member.github.startsWith('http') ? member.github : `https://${member.github}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-black hover:bg-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"
                >
                  <Github size={18} />
                </a>
              ) : (
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-black hover:bg-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"><Github size={18} /></a>
              )}
              <a 
                href={member.email ? `mailto:${member.email}` : `mailto:acm@klu.ac.in`} 
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-black hover:bg-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"
              >
                <Mail size={18} />
              </a>
              {member.portfolio && (
                <a 
                  href={member.portfolio.startsWith('http') ? member.portfolio : `https://${member.portfolio}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-black hover:bg-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"
                >
                  <Globe size={18} />
                </a>
              )}
            </div>
            
            <button onClick={onClose} className="mt-10 text-slate-500 hover:text-cyan-400 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-2 group">
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to Syndicate
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TeamDeck = () => {
  const [introPlayed, setIntroPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [depts, setDepts] = useState<any[]>([]);
  const [studentMembers, setStudentMembers] = useState<any[]>([]);

  const loadData = () => {
    seedDataIfEmpty();
    const storedDepts = JSON.parse(localStorage.getItem('acm_departments') || '[]');
    const storedMembers = JSON.parse(localStorage.getItem('acm_members') || '[]');
    
    // Sort departments by order priority
    storedDepts.sort((a: any, b: any) => a.order - b.order);
    
    setDepts(storedDepts);
    setStudentMembers(storedMembers);
  };

  useEffect(() => {
    loadData();

    // Deep linking check
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('member');
    if (memberId && !selectedMember) {
      const storedMembers = JSON.parse(localStorage.getItem('acm_members') || '[]');
      const found = facultyCoordinators.find(m => m.id === memberId) || storedMembers.find((m: any) => m.id === memberId);
      if (found) {
        setSelectedMember(found);
        setIntroPlayed(true);
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !introPlayed && !playing && !memberId) {
        setPlaying(true);
      }
    }, { threshold: 0.3 });
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    window.addEventListener('storage', loadData);
    window.addEventListener('acm_db_update', loadData);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', loadData);
      window.removeEventListener('acm_db_update', loadData);
    };
  }, [introPlayed, playing, selectedMember]);

  useEffect(() => {
    if (depts.length > 0 && studentMembers.length > 0) {
      // Wait for DOM layout to settle, then refresh ScrollTrigger to align bottom timeline position
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [depts, studentMembers]);

  const completeIntro = () => {
    setPlaying(false);
    setIntroPlayed(true);
  };

  const renderCoreDepartment = () => {
    const coreMembers = studentMembers.filter(m => m.departmentId === 'dept-core');
    
    const chair = coreMembers.find(m => m.role.toLowerCase() === 'chair');
    const viceChair = coreMembers.find(m => m.role.toLowerCase() === 'vice chair');
    const president = coreMembers.find(m => m.role.toLowerCase() === 'president');
    const secretary = coreMembers.find(m => m.role.toLowerCase() === 'secretary');
    const secMember = coreMembers.find(m => m.role.toLowerCase() === 'secretary member');
    const treasurer1 = coreMembers.find(m => m.role.toLowerCase() === 'treasurer 1');
    const treasurer2 = coreMembers.find(m => m.role.toLowerCase() === 'treasurer 2');
    const membershipChair = coreMembers.find(m => m.role.toLowerCase() === 'membership chair');
    
    const identifiedIds = [chair?.id, viceChair?.id, president?.id, secretary?.id, secMember?.id, treasurer1?.id, treasurer2?.id, membershipChair?.id].filter(Boolean);
    const otherCoreMembers = coreMembers.filter(m => !identifiedIds.includes(m.id));

    return (
      <div className="space-y-16 max-w-6xl mx-auto flex flex-col items-center">
        {/* Tier 1: Chair */}
        {chair && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <h4 className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Commanding Officer</h4>
            <div className="w-64 aspect-[3/4]">
              <HologramCard member={chair} onClick={() => setSelectedMember(chair)} />
            </div>
          </motion.div>
        )}

        {/* Tier 2: Vice Chair & President */}
        {(viceChair || president) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl justify-center">
            {viceChair && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <h4 className="text-cyan-400/80 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Executive Council</h4>
                <div className="w-64 aspect-[3/4]">
                  <HologramCard member={viceChair} onClick={() => setSelectedMember(viceChair)} />
                </div>
              </motion.div>
            )}
            {president && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <h4 className="text-cyan-400/80 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Executive Council</h4>
                <div className="w-64 aspect-[3/4]">
                  <HologramCard member={president} onClick={() => setSelectedMember(president)} />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tier 3: Secretary & Secretary Member */}
        {(secretary || secMember) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl justify-center">
            {secretary && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <h4 className="text-cyan-400/80 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Administration</h4>
                <div className="w-64 aspect-[3/4]">
                  <HologramCard member={secretary} onClick={() => setSelectedMember(secretary)} />
                </div>
              </motion.div>
            )}
            {secMember && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <h4 className="text-cyan-400/80 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Admin Support</h4>
                <div className="w-64 aspect-[3/4]">
                  <HologramCard member={secMember} onClick={() => setSelectedMember(secMember)} />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tier 4: Treasurers & Membership Chair */}
        {(treasurer1 || treasurer2 || membershipChair) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl justify-center">
            {treasurer1 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <h4 className="text-cyan-400/80 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Treasury</h4>
                <div className="w-64 aspect-[3/4]">
                  <HologramCard member={treasurer1} onClick={() => setSelectedMember(treasurer1)} />
                </div>
              </motion.div>
            )}
            {treasurer2 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <h4 className="text-cyan-400/80 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Treasury</h4>
                <div className="w-64 aspect-[3/4]">
                  <HologramCard member={treasurer2} onClick={() => setSelectedMember(treasurer2)} />
                </div>
              </motion.div>
            )}
            {membershipChair && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <h4 className="text-cyan-400/80 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Membership</h4>
                <div className="w-64 aspect-[3/4]">
                  <HologramCard member={membershipChair} onClick={() => setSelectedMember(membershipChair)} />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Other Members added dynamically to Core */}
        {otherCoreMembers.length > 0 && (
          <div className="flex flex-col items-center w-full pt-8 border-t border-white/5">
            <h4 className="text-slate-500 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Additional Executive Members</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center w-full">
              {otherCoreMembers.map((member) => (
                <div key={member.id} className="w-full aspect-[3/4]">
                  <HologramCard member={member} onClick={() => setSelectedMember(member)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStandardDepartment = (deptId: string) => {
    const isSpecialAdmin = deptId === 'dept-admin';
    const leads = studentMembers.filter(m => m.departmentId === deptId && (m.level === 'lead' || m.level === 'executive' || (isSpecialAdmin && m.level === 'member')));
    const members = isSpecialAdmin ? [] : studentMembers.filter(m => m.departmentId === deptId && m.level === 'member');

    if (leads.length === 0 && members.length === 0) {
      return (
        <div className="text-center py-16 text-slate-500 font-mono text-sm">
          No syndicate members assigned to this department yet.
        </div>
      );
    }

    return (
      <div className="space-y-16 max-w-6xl mx-auto flex flex-col items-center">
        {leads.length > 0 && (
          <div className="flex flex-col items-center">
            <h4 className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-center">
              {leads.length === 1 ? 'Department Lead' : 'Department Officers'}
            </h4>
            <div className="flex flex-wrap justify-center gap-8">
              {leads.map(lead => (
                <motion.div 
                  key={lead.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="w-64 aspect-[3/4]"
                >
                  <HologramCard member={lead} onClick={() => setSelectedMember(lead)} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {leads.length > 0 && members.length > 0 && (
          <div className="w-[2px] h-12 bg-gradient-to-b from-cyan-500/50 to-transparent"></div>
        )}

        {members.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <h4 className="text-slate-500 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Team Syndicate</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center w-full">
              {members.map((member, i) => (
                <motion.div 
                  key={member.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: (i % 5) * 0.1, duration: 0.8 }}
                  className="w-full aspect-[3/4]"
                >
                  <HologramCard member={member} onClick={() => setSelectedMember(member)} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="container mx-auto px-6 relative z-10">
      <AnimatePresence>
        {playing && <CinematicOverlay members={studentMembers} onComplete={completeIntro} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      </AnimatePresence>

      <div className="text-center mb-20">
        <span className="acm-team-text-active font-mono text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Our Core</span>
        <h2 className="text-6xl font-black tracking-tighter text-white">The Syndicate</h2>
      </div>

      <div className="mb-28">
        <h3 className="text-3xl font-bold text-white mb-12 flex items-center justify-center gap-6">
          <span className="w-12 h-[2px] bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.8)] acm-team-border-active"></span> 
          Faculty Advisors
          <span className="w-12 h-[2px] bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.8)] acm-team-border-active"></span>
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto font-bold">
          {facultyCoordinators.map((member, i) => (
            <motion.div 
              key={member.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1, duration: 0.8 }} 
              viewport={{ once: true }}
              className="w-[calc(50%-12px)] sm:w-[calc(33.33%-16px)] md:w-[calc(25%-20px)] lg:w-[calc(20%-26px)] max-w-[210px] min-w-[170px] aspect-[3/4]"
            >
              <HologramCard member={member} onClick={() => setSelectedMember(member)} />
            </motion.div>
          ))}
        </div>
      </div>

      {depts.length > 0 && (
        <div className="w-full max-w-7xl mx-auto space-y-32">
          <h3 className="text-3xl font-bold text-white mb-12 flex items-center justify-center gap-6">
            <span className="w-12 h-[2px] bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.8)] acm-team-border-active"></span> 
            Student Committee
            <span className="w-12 h-[2px] bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.8)] acm-team-border-active"></span>
          </h3>

          {/* Render all 9 departments vertically sequentially */}
          <div className="space-y-32">
            {depts.map((dept, idx) => (
              <motion.div 
                key={dept.id} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative border-t border-white/10 pt-20 first:border-0 first:pt-0"
              >
                {/* Department Separator Line Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-1 bg-[#030712] border border-white/10 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.05)] acm-team-border-active acm-team-text-active">
                  Department 0{idx + 1}
                </div>

                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                    {dept.name}
                  </h3>
                  {dept.description && (
                    <p className="text-slate-400 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
                      {dept.description}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  {dept.id === 'dept-core' ? renderCoreDepartment() : renderStandardDepartment(dept.id)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
