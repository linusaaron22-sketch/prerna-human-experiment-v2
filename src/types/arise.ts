export type Gender = "Female" | "Male" | "Prefer not to say";
export type AttendanceStatus = "pending" | "checked-in" | "absent";
export type RegistrationStatus = "confirmed" | "waitlist" | "cancelled";

export type Registration = {
  id: string;
  created_at: string;
  full_name: string;
  date_of_birth: string;
  age: number;
  gender: Gender;
  congregation: string;
  city: string;
  state: string;
  whatsapp_number: string;
  email: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  food_preference: "Veg" | "Non-Veg";
  first_time: boolean;
  medical_conditions: string | null;
  guardian_name: string | null;
  guardian_contact_number: string | null;
  heard_about_arise: string;
  additional_notes: string | null;
  attendance_status: AttendanceStatus;
  registration_status: RegistrationStatus;
  coordinator: string | null;
  notes: string | null;
};

export type InterestLead = {
  id: string;
  created_at: string;
  name: string;
  whatsapp_number: string;
  congregation: string;
};
