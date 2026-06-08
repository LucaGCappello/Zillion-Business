/* =========================================================
   ZILLION BUSINESS — Módulo de Autenticação
   Para usar backend real, defina API_URL com o endpoint.
   ========================================================= */
window.ZB = window.ZB || {};

ZB.Auth = (function () {
  'use strict';

  // → Substitua pelo URL do seu backend quando estiver pronto
  // ex: 'https://api.zillionbusiness.com/auth/login'
  const API_URL = null;

  const DEMO_USERS = [
    { email: 'admin@zillionbusiness.com', password: 'zillion2024', name: 'Admin Zillion', role: 'admin' },
    { email: 'demo@zillionbusiness.com',  password: 'demo123',      name: 'Utilizador Demo', role: 'user' }
  ];

  function persist(token, user, remember) {
    const store = remember ? localStorage : sessionStorage;
    store.setItem('zb_token', token);
    store.setItem('zb_user', JSON.stringify(user));
  }

  function getSession() {
    const token = localStorage.getItem('zb_token') || sessionStorage.getItem('zb_token');
    const raw   = localStorage.getItem('zb_user')  || sessionStorage.getItem('zb_user');
    if (!token || !raw) return null;
    try { return { token, user: JSON.parse(raw) }; } catch { return null; }
  }

  async function apiLogin(email, password, remember) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Credenciais inválidas');
    }
    const data = await res.json();
    persist(data.token, data.user, remember);
    return data;
  }

  function demoLogin(email, password, remember) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
          reject(new Error('Email ou palavra-passe incorretos'));
          return;
        }
        const user  = { email: found.email, name: found.name, role: found.role };
        const token = btoa(JSON.stringify({ ...user, exp: Date.now() + 86_400_000 }));
        persist(token, user, remember);
        resolve({ token, user });
      }, 850);
    });
  }

  return {
    login(email, password, remember = false) {
      return API_URL ? apiLogin(email, password, remember) : demoLogin(email, password, remember);
    },

    getSession,

    isLoggedIn() { return !!getSession(); },

    getUser() {
      const s = getSession();
      return s ? s.user : null;
    },

    logout() {
      ['zb_token', 'zb_user'].forEach(k => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
      window.location.href = 'index.html';
    }
  };
}());
