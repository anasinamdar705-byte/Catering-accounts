import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import {Wallet, TrendingUp, Receipt, Users, Search, Utensils, RefreshCw} from 'lucide-react';
import './style.css';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:8080/api'});
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(Number(n||0));
function App(){
 const [data,setData]=useState(null),[mobile,setMobile]=useState(''),[client,setClient]=useState(null),[events,setEvents]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 async function refresh(){setLoading(true);setError('');try{const r=await api.get('/dashboard');setData(r.data)}catch(e){setError('Cannot connect to backend. Start Spring Boot and check the database settings.')}finally{setLoading(false)}}
 useEffect(()=>{refresh()},[]);
 async function searchClient(e){e.preventDefault();setError('');setClient(null);setEvents([]);try{const c=(await api.get('/customers/search',{params:{mobile:mobile.trim()}})).data;setClient(c);setEvents((await api.get(`/customers/${c.id}/functions`)).data)}catch(e){setError(e.response?.status===404?'No client found for that mobile number.': 'Search failed. Check the backend connection.')}}
 const cards=data?[['Total revenue',money(data.totalRevenue),TrendingUp],['Payments received',money(data.paymentsReceived),Wallet],['Pending from clients',money(data.pendingClientPayments),Receipt],['Total expenses',money(data.totalExpenses),Wallet],['Estimated profit',money(data.estimatedProfit),TrendingUp],['Customers',data.customerCount,Users]]:[];
 return <main className="shell"><header><div className="brand"><div className="brand-icon"><Utensils size={22}/></div><div><h1>Catering Accounts</h1><p>Your business, in one place</p></div></div><button className="icon-btn" onClick={refresh} aria-label="Refresh"><RefreshCw size={19}/></button></header>
 <section className="welcome"><span className="eyebrow">BUSINESS OVERVIEW</span><h2>Good morning 👋</h2><p>Track your functions, payments and profit.</p></section>
 {error&&<div className="alert">{error}</div>}
 <section className="metrics">{cards.length?cards.map(([label,value,Icon])=><article className="metric" key={label}><div className="metric-top"><span>{label}</span><Icon size={18}/></div><strong>{value}</strong></article>):<article className="metric loading">{loading?'Loading accounts…':'No dashboard data yet. Add your first records using the API.'}</article>}</section>
 <section className="panel"><div className="panel-title"><div><h3>Find a client</h3><p>Search by their mobile number</p></div><Search size={21}/></div><form className="search-form" onSubmit={searchClient}><input value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,'').slice(0,15))} inputMode="numeric" minLength="10" maxLength="15" placeholder="Enter mobile number" required/><button type="submit">Search</button></form>
 {client&&<div className="client-card"><div><h4>{client.name}</h4><p>{client.mobile}</p><small>{client.address||'No address saved'}</small></div><div className="event-list"><b>Functions ({events.length})</b>{events.length?events.map(f=><div className="event" key={f.id}><div><b>{f.eventName}</b><small>{f.eventDate} · {f.venue||'Venue not set'}</small></div><strong>{money(f.agreedAmount)}</strong></div>):<p>No functions recorded for this client.</p>}</div></div>}</section>
 <section className="panel note"><h3>Next: enter your first records</h3><p>This starter dashboard is connected to the Spring Boot API. The next build stage adds forms for creating customers and functions, recording payments and expenses, and viewing the supplier ledger.</p></section>
 <footer>₹ INR · Admin accounting · Keep regular backups</footer></main>
}

createRoot(document.getElementById('root')).render(<App/>);
