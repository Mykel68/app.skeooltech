const roles = [
  {
    role_id: 1,
    name: "Super Admin",
    description: "Has full system access",
  },
  {
    role_id: 2,
    name: "Admin",
    description: "Manages school-level operations",
  },
  {
    role_id: 3,
    name: "Teacher",
    description: "Manages classes and students",
  },
  {
    role_id: 4,
    name: "Class Teacher",
    description:
      "Assigned to a specific class to oversee students' academics and welfare",
  },
  {
    role_id: 5,
    name: "Vice Principal",
    description: "Assists the principal with school management",
  },
  {
    role_id: 6,
    name: "Exam Officer",
    description: "Oversees exam setup, grading, and result management",
  },
  {
    role_id: 7,
    name: "Bursar",
    description: "Manages school finances and billing",
  },
  {
    role_id: 8,
    name: "Librarian",
    description: "Manages library resources and student access",
  },
  {
    role_id: 9,
    name: "Student",
    description: "Attends classes and accesses learning materials",
  },
  { role_id: 10, name: "Parent", description: "Views student progress" },
];

export default roles;

export type Role = (typeof roles)[number];
