// src/data/schoolData.ts
import { RecentActivity, School, SchoolDonor,
 } from '../types';

export const schoolsData: School[] = [
  {
    id: 1,
    name: "Greenfield Elementary",
    address: "123 Oak Street, Springfield, IL",
    logo: "🏫",
    goal: 50000,
    funded: 37500,
    percentage: 75,
    category: "elementary",
    description: "Greenfield Elementary is dedicated to providing a nurturing environment...",
    panelGridConfigs: [ // <--- NEW
      { gridId: "section_A", gridTitle: "Main Array - Section A", rows: 4, cols: 6 }, // 24 panels
      { gridId: "section_B", gridTitle: "Main Array - Section B", rows: 4, cols: 6 }, // 24 panels
      { gridId: "roof_top", gridTitle: "Rooftop Annex", rows: 3, cols: 8 },      // 24 panels
    ]
  },
  {
    id: 2,
    name: "Riverside High School",
    address: "456 River Road, Riverside, CA",
    logo: "🎓",
    goal: 100000,
    funded: 45000,
    percentage: 45,
    category: "high",
    description: "Riverside High aims to equip students with the knowledge...",
    panelGridConfigs: [
      { gridId: "main_field", gridTitle: "Field Installation", rows: 10, cols: 10 }, // 100 panels
      { gridId: "gym_roof", gridTitle: "Gymnasium Roof", rows: 5, cols: 8 },     // 40 panels
    ]
  },
  {
    id: 3,
    name: "Sunset Middle School",
    address: "789 Sunset Blvd, Phoenix, AZ",
    logo: "📚",
    goal: 75000,
    funded: 67500,
    percentage: 90,
    category: "middle",
    description: "At Sunset Middle School, we foster critical thinking...",
    panelGridConfigs: [
      { gridId: "primary_array", gridTitle: "Primary Array", rows: 8, cols: 8 }, // 64 panels
    ]
  }
  // Add more schools if needed
];
export const schoolDonorsData: SchoolDonor[] = [
  // Donors for Greenfield Elementary (id: 1)
  { id: 'd1', donorName: "The Generous Unicorn", amount: 500, date: "June 1, 2025", schoolId: 1, message: "Keep up the great work!", avatar: '🦄' },
  { id: 'd2', donorName: "John D.", amount: 100, date: "May 28, 2025", schoolId: 1, avatar: '🧑' },
  { id: 'd3', donorName: "Green Future Inc.", amount: 1500, date: "May 25, 2025", schoolId: 1, avatar: '🏢' },
  { id: 'd4', donorName: "Local Bakery", amount: 250, date: "May 22, 2025", schoolId: 1, message: "Happy to help!", avatar: '🥐' },

  // Donors for Riverside High School (id: 2)
  { id: 'd5', donorName: "Sarah M.", amount: 250, date: "June 2, 2025", schoolId: 2, avatar: '👩' },
  { id: 'd6', donorName: "Alumni Fund Chapter '98", amount: 2000, date: "May 30, 2025", schoolId: 2, avatar: '🧑‍🎓', message: "Go Rhinos!" },
  { id: 'd7', donorName: "Riverside Reads", amount: 300, date: "May 27, 2025", schoolId: 2, avatar: '📖' },


  // Donors for Sunset Middle School (id: 3)
  { id: 'd8', donorName: "Tech Corp Global", amount: 5000, date: "June 3, 2025", schoolId: 3, avatar: '💼', message: "Happy to support education." },
  { id: 'd9', donorName: "Maria G.", amount: 75, date: "May 29, 2025", schoolId: 3, avatar: '💁‍♀️' },
  { id: 'd10', donorName: "The Art Collective", amount: 400, date: "May 26, 2025", schoolId: 3, message: "Powering creativity!", avatar: '🎨' },
  { id: 'd11', donorName: "Anonymous", amount: 1000, date: "May 24, 2025", schoolId: 3 },
];

export const recentActivitiesData: RecentActivity[] = [ // Keep this for the main page if still used
  { donor: "Anonymous", amount: 500, school: "Greenfield Elementary", time: "2 hours ago" },
  { donor: "Sarah M.", amount: 250, school: "Riverside High", time: "5 hours ago" },
  { donor: "Tech Corp", amount: 5000, school: "Sunset Middle", time: "1 day ago" },
  { donor: "John D.", amount: 100, school: "Greenfield Elementary", time: "2 days ago" }
];