import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Page = 'dashboard' | 'kunjungan' | 'verifikasi' | 'tugas' | 'pemohon' | 'proses' | 'hasil' | 'kepuasan' | 'laporan'
type Status = 'Menunggu' | 'Dalam Proses' | 'Selesai'
type Applicant = { id:number; name:string; nik:string; village:string; service:string; date:string; status:Status }
type VisitStatus = 'Menunggu Verifikasi' | 'Dijadwalkan' | 'Ditolak' | 'Selesai'
type Visit = { id:number; name:string; nik:string; age:number; category:string; address:string; village:string; companion:string; phone:string; note:string; schedule:string; officer:string; status:VisitStatus }

const initialApplicants: Applicant[] = [
  { id:1,name:'Andi Saputra',nik:'2171011204900001',village:'Sagulung Kota',service:'Aktivasi IKD',date:'2026-11-12',status:'Selesai' },
  { id:2,name:'Siti Rahma',nik:'2171015408920002',village:'Sei Langkai',service:'Aktivasi IKD',date:'2026-11-12',status:'Dalam Proses' },
  { id:3,name:'Budi Santoso',nik:'2171011707850003',village:'Tembesi',service:'Pemulihan Akun IKD',date:'2026-11-11',status:'Selesai' },
  { id:4,name:'Dewi Lestari',nik:'2171014905960004',village:'Sei Pelunggut',service:'Aktivasi IKD',date:'2026-11-11',status:'Menunggu' },
  { id:5,name:'Rizky Maulana',nik:'2171012201990005',village:'Sei Binti',service:'Perubahan Perangkat',date:'2026-11-10',status:'Dalam Proses' },
  { id:6,name:'Nur Aisyah',nik:'2171016303010006',village:'Sei Lekop',service:'Aktivasi IKD',date:'2026-11-10',status:'Selesai' },
]
const months = [['Jun',118,101],['Jul',132,119],['Agu',126,116],['Sep',148,132],['Okt',164,151],['Nov',142,128]] as const
const initialVisits:Visit[]=[{id:1,name:'Budi Setyawan',nik:'2171110405720001',age:54,category:'Lanjut usia',address:'RT 12/RW 7',village:'Tembesi',companion:'Mas Setyo',phone:'081266188662',note:'Hanya dapat dikunjungi pagi hari',schedule:'',officer:'',status:'Menunggu Verifikasi'}]
const menu:{id:Page;label:string;icon:string}[] = [
  {id:'dashboard',label:'Dashboard',icon:'grid'},{id:'pemohon',label:'Data Pemohon',icon:'users'},
  {id:'proses',label:'Dalam Proses',icon:'clock'},{id:'hasil',label:'Hasil Pelayanan',icon:'check'},
  {id:'kunjungan',label:'Jemput Bola IKD',icon:'home'},{id:'verifikasi',label:'Verifikasi Kunjungan',icon:'shield'},
  {id:'tugas',label:'Tugas Kunjungan',icon:'clock'},
  {id:'kepuasan',label:'Kepuasan',icon:'heart'},{id:'laporan',label:'Laporan',icon:'chart'},
]

function Icon({name,size=22}:{name:string;size?:number}) {
  const paths:Record<string,React.ReactNode>={
    home:<><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9 20v-6h6v6"/></>,
    grid:<><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/></>,
    users:<><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,check:<><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    heart:<path d="M12 20S4 16 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 16 12 20 12 20Z"/>,
    chart:<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,plus:<path d="M12 5v14M5 12h14"/>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,download:<><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></>,
    menu:<path d="M4 7h16M4 12h16M4 17h16"/>,close:<path d="m6 6 12 12M18 6 6 18"/>,arrow:<path d="m9 18 6-6-6-6"/>,
    shield:<><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
const maskNik=(nik:string)=>`${nik.slice(0,4)}••••••••${nik.slice(-4)}`
const niceDate=(date:string)=>new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${date}T00:00:00`))

export default function App(){
  const [authenticated,setAuthenticated]=useState(false)
  const [page,setPage]=useState<Page>('dashboard'),[applicants,setApplicants]=useState(initialApplicants)
  const [visits,setVisits]=useState(initialVisits)
  const [query,setQuery]=useState(''),[period,setPeriod]=useState('Bulan Ini'),[mobileMenu,setMobileMenu]=useState(false)
  const [modal,setModal]=useState(false),[notice,setNotice]=useState('')
  const filtered=useMemo(()=>applicants.filter(a=>`${a.name} ${a.nik} ${a.village} ${a.service}`.toLowerCase().includes(query.toLowerCase())),[applicants,query])
  const changePage=(next:Page)=>{setPage(next);setMobileMenu(false);setQuery('')}
  function addApplicant(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const data=new FormData(e.currentTarget),nik=String(data.get('nik'))
    if(!/^\d{16}$/.test(nik)){setNotice('NIK wajib berisi 16 digit.');return}
    setApplicants(a=>[{id:Date.now(),name:String(data.get('name')),nik,village:String(data.get('village')),service:String(data.get('service')),date:new Date().toISOString().slice(0,10),status:'Menunggu'},...a])
    setModal(false);setNotice('Permohonan berhasil diregistrasi.');setTimeout(()=>setNotice(''),3500)
  }
  function exportCsv(){
    const rows=[['Nama','NIK Tersamarkan','Kelurahan','Layanan','Tanggal','Status'],...applicants.map(a=>[a.name,maskNik(a.nik),a.village,a.service,a.date,a.status])]
    const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n'),link=document.createElement('a')
    link.href=URL.createObjectURL(new Blob([`\uFEFF${csv}`],{type:'text/csv;charset=utf-8'}));link.download=`laporan-ikd-sagulung-${new Date().toISOString().slice(0,10)}.csv`;link.click();URL.revokeObjectURL(link.href)
  }
  const statusFilter:Partial<Record<Page,Status>>={proses:'Dalam Proses',hasil:'Selesai'}
  const listData=statusFilter[page]?filtered.filter(a=>a.status===statusFilter[page]):filtered
  if(!authenticated)return <Login onLogin={()=>setAuthenticated(true)}/>
  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu?'open':''}`}><div className="brand"><div className="brand-mark"><Icon name="home" size={28}/></div><div><strong>RAMAH IKD</strong><span>Kecamatan Sagulung</span></div></div>
      <nav aria-label="Navigasi utama"><p>MENU UTAMA</p>{menu.map(i=><button key={i.id} className={page===i.id?'active':''} onClick={()=>changePage(i.id)}><Icon name={i.icon}/><span>{i.label}</span></button>)}</nav>
      <div className="security-note"><Icon name="shield"/><div><strong>Akses Terlindungi</strong><span>Sesi Admin • Audit aktif</span></div></div>
    </aside>{mobileMenu&&<button className="backdrop" aria-label="Tutup menu" onClick={()=>setMobileMenu(false)}/>} 
    <main><header className="topbar"><button className="menu-button" onClick={()=>setMobileMenu(true)} aria-label="Buka menu"><Icon name="menu"/></button><div><p>Sistem Monitoring Pelayanan IKD</p><strong>Kecamatan Sagulung</strong></div><div className="user"><span>AD</span><div><strong>Administrator</strong><small>Operator Kecamatan</small></div><button className="logout-button" onClick={()=>setAuthenticated(false)}>Keluar</button></div></header>
      {notice&&<div className={`toast ${notice.includes('wajib')?'error':''}`}>{notice}</div>}
      {page==='dashboard'?<Dashboard period={period} setPeriod={setPeriod} applicants={applicants} changePage={changePage} openModal={()=>setModal(true)}/>:<PageContent page={page} data={listData} query={query} setQuery={setQuery} applicants={applicants} setApplicants={setApplicants} visits={visits} setVisits={setVisits} openModal={()=>setModal(true)} exportCsv={exportCsv} notify={setNotice}/>} 
      <footer><div className="footer-brand"><Icon name="home"/><strong>RAMAH IKD</strong></div><p>Layanan Kependudukan Kecamatan Sagulung</p><span>Dashboard internal • Data terlindungi • 2026</span></footer>
    </main>
    {modal&&<div className="modal-wrap"><button className="modal-backdrop" aria-label="Tutup" onClick={()=>setModal(false)}/><form className="modal" onSubmit={addApplicant}><div className="modal-head"><div><span>REGISTRASI BARU</span><h2>Tambah Pemohon</h2></div><button type="button" onClick={()=>setModal(false)} aria-label="Tutup"><Icon name="close"/></button></div>
      <label>Nama lengkap<input name="name" required minLength={3} placeholder="Sesuai KTP"/></label><label>NIK<input name="nik" required inputMode="numeric" maxLength={16} placeholder="16 digit NIK"/></label>
      <label>Kelurahan<select name="village"><option>Sagulung Kota</option><option>Sei Langkai</option><option>Sei Pelunggut</option><option>Sei Lekop</option><option>Sei Binti</option><option>Tembesi</option></select></label>
      <label>Jenis layanan<select name="service"><option>Aktivasi IKD</option><option>Pemulihan Akun IKD</option><option>Perubahan Perangkat</option><option>Konsultasi IKD</option></select></label>
      <p className="privacy"><Icon name="shield" size={18}/>Data pribadi hanya digunakan untuk pelayanan kependudukan.</p><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setModal(false)}>Batal</button><button className="button primary">Simpan Permohonan</button></div>
    </form></div>}
  </div>
}

function Login({onLogin}:{onLogin:()=>void}){
  const [error,setError]=useState('')
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const data=new FormData(e.currentTarget);if(data.get('username')==='admin'&&data.get('password')==='ikdsagulung'){onLogin();return}setError('Username atau password tidak sesuai.')}
  return <main className="login-page"><section className="login-panel"><div className="login-brand"><div className="login-government-logo"><img src="/images/logo-pemko-batam.png" alt="Logo Pemerintah Kota Batam"/></div><div><strong>RAMAH IKD</strong><span>Kecamatan Sagulung</span></div></div><div className="login-copy"><span>PORTAL INTERNAL PEGAWAI</span><h1>Pelayanan dekat,<br/>data tetap terjaga.</h1><p>Monitoring Pelayanan IKD dan Respon Kunjungan Rumah (Ramah IKD) untuk Penyandang Disabilitas, Lanjut Usia dan Berkebutuhan Khusus.</p><div className="login-security"><Icon name="shield"/><div><strong>Akses terbatas</strong><small>Aktivitas pengguna dicatat untuk kebutuhan audit.</small></div></div></div></section><section className="login-form-wrap"><form className="login-form" onSubmit={submit}><span>MASUK KE SISTEM</span><h2>Selamat datang</h2><p>Gunakan akun pegawai untuk melanjutkan.</p>{error&&<div className="login-error">{error}</div>}<label>Username<input name="username" required autoComplete="username" placeholder="Masukkan username"/></label><label>Password<input name="password" type="password" required autoComplete="current-password" placeholder="Masukkan password"/></label><button className="button primary">Masuk ke Dashboard</button><small className="login-help">Akun prototipe: <b>admin</b> / <b>ikdsagulung</b></small></form></section></main>
}

function Dashboard({period,setPeriod,applicants,changePage,openModal}:{period:string;setPeriod:(v:string)=>void;applicants:Applicant[];changePage:(p:Page)=>void;openModal:()=>void}){
  return <div className="content"><section className="hero"><div><span className="eyebrow">DASHBOARD PELAYANAN</span><h1>Selamat datang, Admin.</h1><p>Pantau layanan IKD Kecamatan Sagulung secara ringkas dan akurat.</p></div><div className="hero-side"><span><i/> Sistem aktif</span><strong>12 November 2026</strong></div></section>
    <div className="period-row"><div><span>Periode data</span><div className="segmented">{['Hari Ini','Bulan Ini','Tahun Ini'].map(p=><button className={period===p?'active':''} onClick={()=>setPeriod(p)} key={p}>{p}</button>)}</div></div><button className="button primary" onClick={openModal}><Icon name="plus"/>Registrasi Pemohon</button></div>
    <section className="stat-grid"><Stat icon="users" value="1.250" label="Jumlah Pemohon" tone="blue" note="+12,4% dari bulan lalu"/><Stat icon="clock" value="125" label="Dalam Proses" tone="amber" note="10% dari total pemohon"/><Stat icon="check" value="1.075" label="Pelayanan Selesai" tone="green" note="86% tingkat penyelesaian"/><Stat icon="heart" value="95%" label="Kepuasan Masyarakat" tone="violet" note="Kategori sangat baik"/></section>
    <section className="dashboard-grid"><div className="card chart-card"><CardTitle eyebrow="STATISTIK BULANAN" title="Kinerja Pelayanan IKD" action="Lihat laporan" onClick={()=>changePage('laporan')}/><BarChart/></div><div className="card target-card"><CardTitle eyebrow="TARGET PENYELESAIAN" title="Capaian Bulan Ini"/><div className="progress-ring"><div><strong>86%</strong><span>Tercapai</span></div></div><p><b>1.075</b> dari 1.250 permohonan selesai</p><div className="legend"><span><i className="done"/>Selesai</span><span><i/>Tersisa</span></div></div></section>
    <section className="card recent-card"><CardTitle eyebrow="AKTIVITAS TERKINI" title="Permohonan Terbaru" action="Lihat semua" onClick={()=>changePage('pemohon')}/><ApplicantTable data={applicants.slice(0,5)}/></section>
  </div>
}
function Stat({icon,value,label,tone,note}:{icon:string;value:string;label:string;tone:string;note:string}){return <article className={`stat ${tone}`}><div className="stat-icon"><Icon name={icon}/></div><div><strong>{value}</strong><span>{label}</span><small>{note}</small></div></article>}
function CardTitle({eyebrow,title,action,onClick}:{eyebrow:string;title:string;action?:string;onClick?:()=>void}){return <div className="card-title"><div><span>{eyebrow}</span><h2>{title}</h2></div>{action&&<button onClick={onClick}>{action}<Icon name="arrow" size={17}/></button>}</div>}
function BarChart(){return <div className="chart-wrap"><div className="chart"><div className="chart-y"><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span></div><div className="bars">{months.map(([m,t,d])=><div className="bar-group" key={m}><div className="bar-pair"><i style={{height:`${t/2}px`}} data-value={t}/><i style={{height:`${d/2}px`}} data-value={d}/></div><span>{m}</span></div>)}</div></div><div className="chart-legend"><span><i/>Jumlah Pemohon</span><span><i/>Pelayanan Selesai</span></div></div>}

function PageContent({page,data,query,setQuery,applicants,setApplicants,visits,setVisits,openModal,exportCsv,notify}:{page:Page;data:Applicant[];query:string;setQuery:(v:string)=>void;applicants:Applicant[];setApplicants:React.Dispatch<React.SetStateAction<Applicant[]>>;visits:Visit[];setVisits:React.Dispatch<React.SetStateAction<Visit[]>>;openModal:()=>void;exportCsv:()=>void;notify:(v:string)=>void}){
  if(page==='kunjungan')return <VisitForm setVisits={setVisits} notify={notify}/>
  if(page==='verifikasi')return <VisitVerification visits={visits} setVisits={setVisits} notify={notify}/>
  if(page==='tugas')return <VisitTasks visits={visits} setVisits={setVisits} notify={notify}/>
  const titles:Record<Page,[string,string]>={dashboard:['',''],kunjungan:['',''],verifikasi:['',''],tugas:['',''],pemohon:['Data Pemohon','Kelola seluruh permohonan pelayanan IKD.'],proses:['Dalam Proses','Pantau permohonan yang sedang ditangani.'],hasil:['Hasil Pelayanan','Daftar pelayanan IKD yang telah selesai.'],kepuasan:['',''],laporan:['','']}
  if(page==='kepuasan')return <Satisfaction/>;if(page==='laporan')return <Report applicants={applicants} exportCsv={exportCsv}/>
  const updateStatus=(id:number,status:Status)=>setApplicants(a=>a.map(x=>x.id===id?{...x,status}:x))
  return <div className="content inner-page"><div className="page-heading"><div><span>PELAYANAN IKD</span><h1>{titles[page][0]}</h1><p>{titles[page][1]}</p></div><button className="button primary" onClick={openModal}><Icon name="plus"/>Registrasi Pemohon</button></div><section className="card table-card"><div className="table-tools"><label className="search"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari nama, NIK, kelurahan, atau layanan..."/></label><span>{data.length} data ditemukan</span></div><ApplicantTable data={data} updateStatus={updateStatus}/>{!data.length&&<div className="empty"><Icon name="search" size={32}/><strong>Data tidak ditemukan</strong><span>Coba kata pencarian lain.</span></div>}</section></div>
}
function ApplicantTable({data,updateStatus}:{data:Applicant[];updateStatus?:(id:number,status:Status)=>void}){return <div className="table-scroll"><table><thead><tr><th>Pemohon</th><th>Kelurahan</th><th>Layanan</th><th>Tanggal</th><th>Status</th>{updateStatus&&<th>Aksi</th>}</tr></thead><tbody>{data.map(a=><tr key={a.id}><td><strong>{a.name}</strong><small>{maskNik(a.nik)}</small></td><td>{a.village}</td><td>{a.service}</td><td>{niceDate(a.date)}</td><td><span className={`badge ${a.status.toLowerCase().replace(' ','-')}`}>{a.status}</span></td>{updateStatus&&<td><select className="status-select" value={a.status} onChange={e=>updateStatus(a.id,e.target.value as Status)} aria-label={`Ubah status ${a.name}`}><option>Menunggu</option><option>Dalam Proses</option><option>Selesai</option></select></td>}</tr>)}</tbody></table></div>}

function VisitForm({setVisits,notify}:{setVisits:React.Dispatch<React.SetStateAction<Visit[]>>;notify:(v:string)=>void}){
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget),nik=String(f.get('nik')),phone=String(f.get('phone')).replace(/\D/g,'');if(!/^\d{16}$/.test(nik)){notify('NIK wajib berisi 16 digit.');return}if(phone.length<10){notify('Nomor HP wajib diisi dengan benar.');return}setVisits(v=>[{id:Date.now(),name:String(f.get('name')),nik,age:Number(f.get('age')),category:String(f.get('category')),address:String(f.get('address')),village:String(f.get('village')),companion:String(f.get('companion')),phone,note:String(f.get('note')),schedule:'',officer:'',status:'Menunggu Verifikasi'},...v]);e.currentTarget.reset();notify('Permohonan kunjungan berhasil dikirim.');setTimeout(()=>notify(''),3500)}
  return <div className="content visit-page"><div className="visit-hero"><span>LAYANAN JEMPUT BOLA IKD</span><h1>Ajukan kunjungan petugas untuk aktivasi IKD</h1><p>Khusus warga lanjut usia, penyandang disabilitas, atau warga sakit menahun yang kesulitan datang ke kantor kecamatan.</p></div><form className="visit-form" onSubmit={submit}>
    <section className="card form-section"><div className="section-number">1</div><h2>Data warga</h2><div className="form-grid"><label>NIK<input name="nik" required inputMode="numeric" maxLength={16} placeholder="16 digit NIK"/></label><label>Nama lengkap<input name="name" required minLength={3}/></label><label>Usia<input name="age" type="number" required min={1} max={120}/></label><label>Kategori<select name="category"><option>Lanjut usia</option><option>Penyandang disabilitas</option><option>Sakit menahun</option></select></label><label className="wide">Catatan khusus<textarea name="note" placeholder="Contoh: perlu pendamping atau hanya bisa dikunjungi pagi hari"/></label></div></section>
    <section className="card form-section"><div className="section-number">2</div><h2>Lokasi rumah</h2><div className="form-grid"><label className="wide">Alamat lengkap<textarea name="address" required/></label><label>Kelurahan<select name="village"><option>Sagulung Kota</option><option>Sei Langkai</option><option>Sei Pelunggut</option><option>Sei Lekop</option><option>Sei Binti</option><option>Tembesi</option></select></label></div></section>
    <section className="card form-section"><div className="section-number">3</div><h2>Kontak pendamping</h2><div className="form-grid"><label>Nama pendamping<input name="companion" required/></label><label>Nomor HP / WhatsApp<input name="phone" required inputMode="tel" placeholder="08xxxxxxxxxx"/></label></div><p className="privacy"><Icon name="shield" size={18}/>Data dipakai hanya untuk penjadwalan pelayanan IKD.</p><button className="button primary submit-visit">Kirim Permohonan</button></section>
  </form></div>
}

function VisitVerification({visits,setVisits,notify}:{visits:Visit[];setVisits:React.Dispatch<React.SetStateAction<Visit[]>>;notify:(v:string)=>void}){
  const waiting=visits.filter(v=>v.status==='Menunggu Verifikasi')
  const update=(id:number,status:VisitStatus)=>{setVisits(v=>v.map(x=>x.id===id?{...x,status}:x));notify(status==='Ditolak'?'Permohonan ditolak.':'Permohonan disetujui dan masuk penjadwalan.');setTimeout(()=>notify(''),3500)}
  return <div className="content inner-page"><div className="page-heading"><div><span>JEMPUT BOLA IKD</span><h1>Verifikasi Kunjungan</h1><p>Cek kelengkapan data sebelum permohonan diteruskan ke penjadwalan.</p></div><span className="count-pill">{waiting.length} menunggu</span></div><div className="visit-list">{waiting.map(v=><article className="card visit-card" key={v.id}><div className="visit-card-head"><div><h2>{v.name}</h2><span>{v.category} • {v.age} tahun</span></div><b>Menunggu Verifikasi</b></div><dl><div><dt>NIK</dt><dd>{maskNik(v.nik)}</dd></div><div><dt>Alamat</dt><dd>{v.address}, Kel. {v.village}</dd></div><div><dt>Pendamping</dt><dd>{v.companion} • {v.phone.slice(0,4)}••••{v.phone.slice(-3)}</dd></div>{v.note&&<div><dt>Catatan</dt><dd>{v.note}</dd></div>}</dl><div className="visit-actions"><button className="button secondary reject" onClick={()=>update(v.id,'Ditolak')}>Tolak</button><button className="button primary" onClick={()=>update(v.id,'Dijadwalkan')}>Setujui</button></div></article>)}{!waiting.length&&<div className="card empty"><Icon name="check" size={34}/><strong>Semua permohonan telah diverifikasi</strong><span>Tidak ada antrean verifikasi baru.</span></div>}</div></div>
}

function VisitTasks({visits,setVisits,notify}:{visits:Visit[];setVisits:React.Dispatch<React.SetStateAction<Visit[]>>;notify:(v:string)=>void}){
  const tasks=visits.filter(v=>v.status==='Dijadwalkan'||v.status==='Selesai')
  function update(id:number,field:'schedule'|'officer',value:string){setVisits(v=>v.map(x=>x.id===id?{...x,[field]:value}:x))}
  function finish(v:Visit){if(!v.schedule||!v.officer){notify('Jadwal dan petugas wajib diisi.');return}setVisits(all=>all.map(x=>x.id===v.id?{...x,status:'Selesai'}:x));notify('Kunjungan ditandai selesai.');setTimeout(()=>notify(''),3500)}
  return <div className="content inner-page"><div className="page-heading"><div><span>OPERASIONAL LAPANGAN</span><h1>Tugas Kunjungan</h1><p>Atur jadwal, petugas, dan penyelesaian kunjungan rumah.</p></div></div><div className="visit-list">{tasks.map(v=><article className={`card visit-card ${v.status==='Selesai'?'completed':''}`} key={v.id}><div className="visit-card-head"><div><h2>{v.name}</h2><span>{v.address}, Kel. {v.village}</span></div><b>{v.status}</b></div><div className="task-fields"><label>Jadwal kunjungan<input type="datetime-local" value={v.schedule} disabled={v.status==='Selesai'} onChange={e=>update(v.id,'schedule',e.target.value)}/></label><label>Petugas<select value={v.officer} disabled={v.status==='Selesai'} onChange={e=>update(v.id,'officer',e.target.value)}><option value="">Pilih petugas</option><option>Tim IKD 1</option><option>Tim IKD 2</option><option>Operator Kelurahan</option></select></label></div>{v.status!=='Selesai'&&<div className="visit-actions"><button className="button primary" onClick={()=>finish(v)}>Tandai Selesai</button></div>}</article>)}{!tasks.length&&<div className="card empty"><Icon name="clock" size={34}/><strong>Belum ada tugas kunjungan</strong><span>Permohonan yang disetujui akan muncul di sini.</span></div>}</div></div>
}
function Satisfaction(){const items=[['Sangat Baik',74,185],['Baik',21,53],['Cukup',4,10],['Kurang',1,2]] as const;return <div className="content inner-page"><div className="page-heading"><div><span>SURVEI LAYANAN</span><h1>Kepuasan Masyarakat</h1><p>Ringkasan penilaian masyarakat terhadap pelayanan.</p></div></div><section className="satisfaction-grid"><div className="card score"><span>INDEKS KEPUASAN</span><strong>95,2</strong><b>Sangat Baik</b><p>Berdasarkan 250 respons masyarakat pada November 2026.</p></div><div className="card survey"><CardTitle eyebrow="DISTRIBUSI JAWABAN" title="Hasil Survei"/>{items.map(([l,p,c])=><div className="survey-row" key={l}><div><strong>{l}</strong><span>{c} respons</span></div><div className="survey-bar"><i style={{width:`${p}%`}}/></div><b>{p}%</b></div>)}</div></section></div>}
function Report({applicants,exportCsv}:{applicants:Applicant[];exportCsv:()=>void}){return <div className="content inner-page"><div className="page-heading"><div><span>REKAPITULASI</span><h1>Laporan Pelayanan</h1><p>Rekap kinerja pelayanan IKD Kecamatan Sagulung.</p></div><button className="button primary" onClick={exportCsv}><Icon name="download"/>Unduh CSV</button></div><section className="dashboard-grid report-grid"><div className="card chart-card"><CardTitle eyebrow="JUNI — NOVEMBER 2026" title="Tren Pelayanan"/><p className="chart-caption">Perbandingan jumlah pemohon dan pelayanan selesai per bulan</p><BarChart/></div><div className="card report-summary"><CardTitle eyebrow="RINGKASAN DATA" title="November 2026"/><dl><div><dt>Total Pemohon</dt><dd>1.250</dd></div><div><dt>Pelayanan Selesai</dt><dd>1.075</dd></div><div><dt>Dalam Proses</dt><dd>125</dd></div><div><dt>Data Simulasi Aktif</dt><dd>{applicants.length}</dd></div></dl><p><Icon name="shield" size={18}/>Berkas ekspor memakai NIK tersamarkan.</p></div></section></div>}
