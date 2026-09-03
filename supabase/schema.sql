create extension if not exists pgcrypto;

create table if not exists interest_list (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) >= 2),
  whatsapp_number text not null check (char_length(trim(whatsapp_number)) >= 8),
  congregation text not null check (char_length(trim(congregation)) >= 2)
);

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(trim(full_name)) >= 2),
  date_of_birth date not null,
  age int not null check (age between 10 and 120),
  gender text not null check (gender in ('Female', 'Male', 'Prefer not to say')),
  congregation text not null,
  city text not null,
  state text not null,
  whatsapp_number text not null,
  email text not null unique,
  emergency_contact_name text not null,
  emergency_contact_number text not null,
  food_preference text not null check (food_preference in ('Veg', 'Non-Veg')),
  first_time boolean not null default false,
  medical_conditions text,
  guardian_name text,
  guardian_contact_number text,
  heard_about_arise text not null,
  additional_notes text,
  attendance_status text not null default 'pending' check (attendance_status in ('pending', 'checked-in', 'absent')),
  registration_status text not null default 'waitlist' check (registration_status in ('confirmed', 'waitlist', 'cancelled')),
  coordinator text,
  notes text
);

alter table registrations alter column registration_status set default 'waitlist';
alter table registrations drop column if exists alternate_contact_number;

alter table interest_list enable row level security;
alter table registrations enable row level security;

create policy "Anyone can join interest list"
on interest_list for insert
to anon, authenticated
with check (true);

create policy "Admins can view interest list"
on interest_list for select
to authenticated
using (true);

create policy "Admins can manage interest list"
on interest_list for update
to authenticated
using (true)
with check (true);

create policy "Anyone can register when enabled in app"
on registrations for insert
to anon, authenticated
with check (true);

create policy "Admins can view registrations"
on registrations for select
to authenticated
using (true);

create policy "Admins can update registrations"
on registrations for update
to authenticated
using (true)
with check (true);

create policy "Admins can delete registrations"
on registrations for delete
to authenticated
using (true);
