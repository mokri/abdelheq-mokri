-- Resume / CV PDF that visitors can download (editable from the admin: Profile → Resume).
alter table public.profile add column if not exists resume_url text;

-- Point the existing profile at the bundled PDF until one is uploaded from the admin.
update public.profile
set resume_url = '/resume/Abdelheq-Mokri-Resume.pdf'
where id = 1 and resume_url is null;
