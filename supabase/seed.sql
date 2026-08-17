-- Optional: seed Figma sample rows after schema.sql.
-- Skip if you prefer the app's local seed until you add records from the UI.

insert into public.settings (id, "firstName", "lastName", email, phone, role, avatar, "companyName", "companyAddress", "usdRate", "rateUpdatedAt", "notifySales", "notifyDebts", "notifyLowStock")
values (1, 'Akbar', 'Aliyev', 'makatbcounselor@gmail.com', '+998 90 123 45 67', 'Super Admin', '/assets/avatars/akbar.png', 'Ombor Nazorati', 'Toshkent, Chilonzor', 12700, '16.08.2026', true, true, false)
on conflict (id) do update set email = excluded.email;
