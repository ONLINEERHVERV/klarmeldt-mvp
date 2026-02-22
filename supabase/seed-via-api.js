const { createClient } = require('@supabase/supabase-js');

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fpapsexgsaagqqyfgbqb.supabase.co';
const SERVICE_KEY = process.env.SERVICE_ROLE_KEY || process.argv[2];
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_6ot5oojyx6KdICJvvfK2WQ_3oaHPZ-D';

if (!SERVICE_KEY) { console.log('Usage: node seed-via-api.js <service_role_key>'); process.exit(1); }

const sb = createClient(URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const anon = createClient(URL, ANON_KEY);

async function main() {
  // Get user IDs
  const { data: { users } } = await sb.auth.admin.listUsers();
  const uid = (email) => users.find(u => u.email === email)?.id;

  const pieter   = uid('pieter@goldschmidt.dk');
  const frederico = uid('frederico@goldschmidt.dk');
  const phillip  = uid('phillip@malergruppen.dk');
  const idris    = uid('info@jigulvservice.dk');
  const lars     = uid('lars@tp.dk');
  const ahmed    = uid('ahmed@elek.dk');
  const maria    = uid('maria@proclean.dk');

  if (!pieter) { console.log('ERROR: Users not found. Run admin.createUser first.'); return; }
  console.log('Users found:', users.length);

  // Trades
  const { error: e1 } = await sb.from('trades').upsert([
    { key: 'maler', label: 'Maler', color: '#3B82F6', bg_color: '#EFF6FF', emoji: '🎨' },
    { key: 'tomrer', label: 'Tømrer', color: '#F59E0B', bg_color: '#FFFBEB', emoji: '🪚' },
    { key: 'gulv', label: 'Gulv', color: '#10B981', bg_color: '#ECFDF5', emoji: '🪵' },
    { key: 'el', label: 'Elektriker', color: '#8B5CF6', bg_color: '#F5F3FF', emoji: '⚡' },
    { key: 'vvs', label: 'VVS', color: '#EF4444', bg_color: '#FEF2F2', emoji: '🔧' },
    { key: 'rengoring', label: 'Rengøring', color: '#EC4899', bg_color: '#FDF2F8', emoji: '✨' },
    { key: 'murer', label: 'Murer', color: '#78716C', bg_color: '#F5F5F4', emoji: '🧱' },
  ], { onConflict: 'key' });
  console.log('Trades:', e1 ? 'ERROR ' + e1.message : 'OK');

  // Contractors
  const { data: conData, error: e2 } = await sb.from('contractors').insert([
    { user_id: phillip, name: 'Maler Gruppen ApS', contact_person: 'Phillip Lundholm', email: 'phillip@malergruppen.dk', phone: '29384756', trade_key: 'maler', rate_dkk: 425, lang: 'da', rating: 4.7, completed_jobs: 34, error_rate: 3.2, on_time_rate: 94 },
    { user_id: idris, name: 'Electi Gulvservice ApS', contact_person: 'Idris', email: 'info@jigulvservice.dk', phone: '41413341', trade_key: 'gulv', rate_dkk: 475, lang: 'da', rating: 4.5, completed_jobs: 22, error_rate: 5.1, on_time_rate: 88 },
    { user_id: lars, name: 'Tømrer Pedersen', contact_person: 'Lars Pedersen', email: 'lars@tp.dk', phone: '51234567', trade_key: 'tomrer', rate_dkk: 450, lang: 'da', rating: 3.8, completed_jobs: 28, error_rate: 11.4, on_time_rate: 79 },
    { user_id: ahmed, name: 'El-Eksperten', contact_person: 'Ahmed Hassan', email: 'ahmed@elek.dk', phone: '60123456', trade_key: 'el', rate_dkk: 495, lang: 'en', rating: 4.9, completed_jobs: 15, error_rate: 1.2, on_time_rate: 97 },
    { user_id: maria, name: 'ProClean', contact_person: 'Maria Sørensen', email: 'maria@proclean.dk', phone: '42345678', trade_key: 'rengoring', rate_dkk: 350, lang: 'da', rating: 4.6, completed_jobs: 41, error_rate: 2.8, on_time_rate: 95 },
  ]).select('id, name');
  console.log('Contractors:', e2 ? 'ERROR ' + e2.message : 'OK');
  if (e2) return;

  const cid = (name) => conData.find(c => c.name === name)?.id;

  // Projects
  const { data: projData, error: e3 } = await sb.from('projects').insert([
    { address: 'Klosterparken 14, 2. th', zip: '4100 Ringsted', status: 'igangvaerende', property_name: 'Klosterparken', unit: '14-2th', area_m2: 78, rooms: 3, floor: 2, move_out_date: '2025-11-01', start_date: '2025-11-03', deadline_date: '2025-11-14', inspection_at: '2025-11-14T10:00:00+01:00', created_by: pieter, tenant_years: 4, created_at: '2025-10-15T09:37:00+02:00' },
    { address: 'Klosterparken 8, 1. tv', zip: '4100 Ringsted', status: 'kommende', property_name: 'Klosterparken', unit: '8-1tv', area_m2: 65, rooms: 2, floor: 1, move_out_date: '2025-12-01', start_date: '2025-12-02', deadline_date: '2025-12-13', inspection_at: '2025-12-13T09:00:00+01:00', created_by: frederico, tenant_years: 7, created_at: '2025-10-28T14:12:00+01:00' },
    { address: 'Frederiksbro 22, 3. mf', zip: '3400 Hillerød', status: 'kommende', property_name: 'Frederiksbro', unit: '22-3mf', area_m2: 92, rooms: 4, floor: 3, move_out_date: '2026-01-01', start_date: '2026-01-02', deadline_date: '2026-01-16', inspection_at: '2026-01-16T10:00:00+01:00', created_by: pieter, tenant_years: 2, created_at: '2025-11-05T08:50:00+01:00' },
    { address: 'Klosterparken 3, st. th', zip: '4100 Ringsted', status: 'afsluttet', property_name: 'Klosterparken', unit: '3-stth', area_m2: 55, rooms: 2, floor: 0, move_out_date: '2025-10-01', start_date: '2025-10-02', deadline_date: '2025-10-11', inspection_at: '2025-10-11T13:00:00+02:00', created_by: pieter, tenant_years: 3, created_at: '2025-09-10T10:00:00+02:00' },
  ]).select('id, address');
  console.log('Projects:', e3 ? 'ERROR ' + e3.message : 'OK');
  if (e3) return;

  const pid = (s) => projData.find(p => p.address.includes(s))?.id;
  const p1 = pid('14, 2');
  const p2 = pid('8, 1');
  const p4 = pid('3, st');

  // Tasks
  const { data: taskData, error: e4 } = await sb.from('tasks').insert([
    { project_id: p1, trade_key: 'maler', description: 'Malerarbejde – vægge og lofter i alle rum', status: 'igang', assigned_to: cid('Maler Gruppen ApS'), estimated_hours: 16, room: 'Stue', notes: 'Ekstra lag i køkken pga. fedtpletter', sort_order: 1 },
    { project_id: p1, trade_key: 'maler', description: 'Maling af karme og fodpaneler', status: 'igang', assigned_to: cid('Maler Gruppen ApS'), estimated_hours: 4, room: 'Entré', notes: '', sort_order: 2 },
    { project_id: p1, trade_key: 'tomrer', description: 'Udskift dørgreb i entré + montér 3 dørstop', status: 'afventer', assigned_to: cid('Tømrer Pedersen'), estimated_hours: 3, room: 'Entré', notes: '', sort_order: 3 },
    { project_id: p1, trade_key: 'tomrer', description: 'Reparér listværk i soveværelse', status: 'afventer', assigned_to: cid('Tømrer Pedersen'), estimated_hours: 2, room: 'Soveværelse 1', notes: 'Lister er knækket ved vindue', sort_order: 4 },
    { project_id: p1, trade_key: 'gulv', description: 'Slibning og lakering af trægulv', status: 'afventer', assigned_to: cid('Electi Gulvservice ApS'), estimated_hours: 8, room: 'Stue', notes: 'Dybe ridser ved vindue', sort_order: 5 },
    { project_id: p1, trade_key: 'gulv', description: 'Slibning af gulv i soveværelse', status: 'afventer', assigned_to: cid('Electi Gulvservice ApS'), estimated_hours: 4, room: 'Soveværelse 1', notes: '', sort_order: 6 },
    { project_id: p1, trade_key: 'el', description: 'Kontrollér stikkontakter + udskift spots i bad', status: 'afventer', assigned_to: cid('El-Eksperten'), estimated_hours: 2, room: 'Badeværelse', notes: '', sort_order: 7 },
    { project_id: p1, trade_key: 'rengoring', description: 'Hovedrengøring efter håndværkere', status: 'afventer', assigned_to: cid('ProClean'), estimated_hours: 4, room: null, notes: '', sort_order: 8 },
    { project_id: p2, trade_key: 'maler', description: 'Malerarbejde i alle rum', status: 'afventer', assigned_to: cid('Maler Gruppen ApS'), estimated_hours: 14, room: null, notes: '', sort_order: 1 },
    { project_id: p2, trade_key: 'gulv', description: 'Gulvslibning i entré og stue', status: 'afventer', assigned_to: cid('Electi Gulvservice ApS'), estimated_hours: 6, room: 'Stue', notes: '', sort_order: 2 },
    { project_id: p2, trade_key: 'rengoring', description: 'Hovedrengøring', status: 'afventer', assigned_to: cid('ProClean'), estimated_hours: 3, room: null, notes: '', sort_order: 3 },
    { project_id: p4, trade_key: 'maler', description: 'Malerarbejde – vægge', status: 'godkendt', assigned_to: cid('Maler Gruppen ApS'), estimated_hours: 10, room: null, notes: '', sort_order: 1 },
    { project_id: p4, trade_key: 'rengoring', description: 'Hovedrengøring afsluttet', status: 'godkendt', assigned_to: cid('ProClean'), estimated_hours: 3, room: null, notes: '', sort_order: 2 },
  ]).select('id, description');
  console.log('Tasks:', e4 ? 'ERROR ' + e4.message : 'OK');
  if (e4) return;

  // Messages
  const { error: e5 } = await sb.from('messages').insert([
    { project_id: p1, sender_id: pieter, text: 'Hej alle – projektet er oprettet. Maler starter mandag d. 3/11.', created_at: '2025-10-15T10:00:00+02:00' },
    { project_id: p1, sender_id: phillip, text: 'Modtaget! Vi er klar mandag morgen kl. 7.', created_at: '2025-10-15T11:23:00+02:00' },
    { project_id: p1, sender_id: idris, text: 'Fint – regner med at starte onsdag d. 5/11 efter maler er færdig i stuen.', created_at: '2025-10-15T14:05:00+02:00' },
  ]);
  console.log('Messages:', e5 ? 'ERROR ' + e5.message : 'OK');

  // Time logs
  const tid = (desc) => taskData.find(t => t.description.includes(desc))?.id;
  const { error: e6 } = await sb.from('time_logs').insert([
    { task_id: tid('vægge og lofter'), logged_by: phillip, hours: 11.5, description: 'Malerarbejde i stue, køkken, soveværelser', logged_date: '2025-11-05' },
    { task_id: tid('karme og fodpaneler'), logged_by: phillip, hours: 2.0, description: 'Karme og fodpaneler i entré', logged_date: '2025-11-04' },
    { task_id: tid('Malerarbejde – vægge'), logged_by: phillip, hours: 9.5, description: 'Malerarbejde afsluttet', logged_date: '2025-10-08' },
    { task_id: tid('Hovedrengøring afsluttet'), logged_by: maria, hours: 3.0, description: 'Hovedrengøring afsluttet', logged_date: '2025-10-10' },
  ]);
  console.log('Time logs:', e6 ? 'ERROR ' + e6.message : 'OK');

  // Liability items
  const { error: e7 } = await sb.from('liability_items').insert([
    { project_id: p1, party: 'lejer', description: 'Ridser i gulv ved vindue (stue)', sort_order: 1 },
    { project_id: p1, party: 'lejer', description: 'Rengøring af ovn', sort_order: 2 },
    { project_id: p1, party: 'udlejer', description: 'Malerarbejde (normal slitage)', sort_order: 1 },
    { project_id: p1, party: 'udlejer', description: 'Udskiftning af dørgreb', sort_order: 2 },
    { project_id: p1, party: 'udlejer', description: 'Reparation af listværk', sort_order: 3 },
    { project_id: p4, party: 'lejer', description: 'Rengøring af ovn', sort_order: 1 },
    { project_id: p4, party: 'udlejer', description: 'Maling (slitage)', sort_order: 1 },
  ]);
  console.log('Liability:', e7 ? 'ERROR ' + e7.message : 'OK');

  // Inspection
  const { data: inspData, error: e8 } = await sb.from('inspection_data').insert({
    project_id: p4, completed: true, inspection_date: '2025-10-11', pass_rate: 100, conducted_by: pieter
  }).select('id').single();
  console.log('Inspection:', e8 ? 'ERROR ' + e8.message : 'OK');
  if (!e8) {
    const { error: e9 } = await sb.from('inspection_rooms').insert([
      { inspection_id: inspData.id, room_name: 'Stue', status: 'godkendt' },
      { inspection_id: inspData.id, room_name: 'Køkken', status: 'godkendt' },
      { inspection_id: inspData.id, room_name: 'Soveværelse 1', status: 'godkendt' },
      { inspection_id: inspData.id, room_name: 'Badeværelse', status: 'godkendt' },
    ]);
    console.log('Inspection rooms:', e9 ? 'ERROR ' + e9.message : 'OK');
  }

  // Final verification
  console.log('\n=== VERIFICATION ===');
  const { data: a1, error: ve1 } = await anon.auth.signInWithPassword({ email: 'pieter@goldschmidt.dk', password: 'demo1234' });
  if (ve1) { console.log('Admin login FAILED:', ve1.message); return; }
  const { data: vp1 } = await anon.from('profiles').select('full_name, role').eq('id', a1.session.user.id).single();
  console.log('Admin login:', vp1?.full_name, '|', vp1?.role);
  await anon.auth.signOut();

  const { data: a2, error: ve2 } = await anon.auth.signInWithPassword({ email: 'phillip@malergruppen.dk', password: 'demo1234' });
  if (ve2) { console.log('Craft login FAILED:', ve2.message); return; }
  const { data: vp2 } = await anon.from('profiles').select('full_name, role').eq('id', a2.session.user.id).single();
  const { data: vc } = await anon.from('contractors').select('name').eq('user_id', a2.session.user.id).single();
  console.log('Craft login:', vp2?.full_name, '|', vp2?.role, '|', vc?.name);
  await anon.auth.signOut();

  console.log('\n=== ALL DONE ===');
}

main();
