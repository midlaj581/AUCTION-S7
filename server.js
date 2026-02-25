const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

// Increase JSON body limit for base64 image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── IN-MEMORY IMAGE STORE ───────────────────────────────────────────────────
const imageStore = {}; // id → base64 dataUrl

app.post('/api/upload', (req, res) => {
  const { data } = req.body;
  if (!data || !data.startsWith('data:image')) return res.status(400).json({ error: 'Invalid image data' });
  const id = 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  imageStore[id] = data;
  res.json({ url: `/api/img/${id}` });
});

app.get('/api/img/:id', (req, res) => {
  const data = imageStore[req.params.id];
  if (!data) return res.status(404).send('Not found');
  const match = data.match(/^data:(.+);base64,(.+)$/);
  if (!match) return res.status(400).send('Bad data');
  res.setHeader('Content-Type', match[1]);
  res.send(Buffer.from(match[2], 'base64'));
});

// ─── CONFIG ───────────────────────────────────────────────────────────────────
let config = {
  leagueName:        'Premier Player League',
  leagueSeason:      'Season 7',
  leagueLogo:        '',
  minPlayersPerTeam: 10,
  thresholdBid:      200,
  highIncrement:     20,
  lowIncrement:      10,
  adminPassword:     'ppl2024',   // Change in Settings
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d1117&color=00e87a&size=400&bold=true&font-size=0.35`;
}

function getIncrement(currentBid) {
  return currentBid < config.thresholdBid ? config.highIncrement : config.lowIncrement;
}

function getTeamMaxBid(team) {
  const remaining = team.budget - team.spent;
  const haveNow   = team.players.length;
  const stillNeed = Math.max(0, config.minPlayersPerTeam - haveNow - 1);
  if (stillNeed === 0) return remaining;
  const pool = players
    .filter(p => p.status === 'available' && p.id !== (auctionState.currentPlayer?.id))
    .map(p => p.basePrice).sort((a, b) => a - b).slice(0, stillNeed);
  while (pool.length < stillNeed) pool.push(pool[pool.length - 1] ?? 0);
  const reserve = pool.reduce((s, v) => s + v, 0);
  return Math.max(0, remaining - reserve);
}

// ─── PLAYERS ──────────────────────────────────────────────────────────────────
let players = [
  { id:1,  name:'Arjun Menon',    position:'GK',  rating:82, basePrice:100, photo:'', status:'available' },
  { id:2,  name:'Rahul Das',      position:'CB',  rating:78, basePrice:100, photo:'', status:'available' },
  { id:3,  name:'Vishnu Kumar',   position:'CB',  rating:80, basePrice:100, photo:'', status:'available' },
  { id:4,  name:'Amal Raj',       position:'LB',  rating:75, basePrice:100, photo:'', status:'available' },
  { id:5,  name:'Siddharth Nair', position:'RB',  rating:76, basePrice:100, photo:'', status:'available' },
  { id:6,  name:'Mohammed Shan',  position:'CM',  rating:85, basePrice:100, photo:'', status:'available' },
  { id:7,  name:'Kevin Jose',     position:'CM',  rating:83, basePrice:100, photo:'', status:'available' },
  { id:8,  name:'Adil Hussain',   position:'CAM', rating:87, basePrice:100, photo:'', status:'available' },
  { id:9,  name:'Rohan Pillai',   position:'LW',  rating:84, basePrice:100, photo:'', status:'available' },
  { id:10, name:'Arshad Ali',     position:'RW',  rating:86, basePrice:100, photo:'', status:'available' },
  { id:11, name:'Sajith Thomas',  position:'ST',  rating:90, basePrice:150, photo:'', status:'available' },
  { id:12, name:'Nikhil Varma',   position:'ST',  rating:88, basePrice:150, photo:'', status:'available' },
  { id:13, name:'Faisal Moosa',   position:'GK',  rating:79, basePrice:100, photo:'', status:'available' },
  { id:14, name:'Anand Srikumar', position:'LW',  rating:81, basePrice:100, photo:'', status:'available' },
  { id:15, name:'Deepak Suresh',  position:'CDM', rating:77, basePrice:100, photo:'', status:'available' },
  { id:16, name:'Jithin George',  position:'RW',  rating:83, basePrice:100, photo:'', status:'available' },
  { id:17, name:'Vineeth Mohan',  position:'CB',  rating:74, basePrice:100, photo:'', status:'available' },
  { id:18, name:'Sarath Nair',    position:'CM',  rating:82, basePrice:100, photo:'', status:'available' },
  { id:19, name:'Bibin Chacko',   position:'LB',  rating:76, basePrice:100, photo:'', status:'available' },
  { id:20, name:'Aswin Raj',      position:'ST',  rating:85, basePrice:120, photo:'', status:'available' },
  { id:21, name:'Midhun PS',      position:'CDM', rating:78, basePrice:100, photo:'', status:'available' },
  { id:22, name:'Shafeeq Ali',    position:'CAM', rating:84, basePrice:100, photo:'', status:'available' },
  { id:23, name:'Rohit Varma',    position:'GK',  rating:81, basePrice:100, photo:'', status:'available' },
  { id:24, name:'Nirmal Dev',     position:'RB',  rating:77, basePrice:100, photo:'', status:'available' },
  { id:25, name:'Fazil Hameed',   position:'ST',  rating:88, basePrice:140, photo:'', status:'available' },
  { id:26, name:'Dipin George',   position:'LW',  rating:80, basePrice:100, photo:'', status:'available' },
  { id:27, name:'Athul Suresh',   position:'RW',  rating:82, basePrice:100, photo:'', status:'available' },
  { id:28, name:'Jibin Mathew',   position:'CM',  rating:79, basePrice:100, photo:'', status:'available' },
  { id:29, name:'Anas Farooq',    position:'CB',  rating:76, basePrice:100, photo:'', status:'available' },
  { id:30, name:'Sreejith KP',    position:'ST',  rating:86, basePrice:130, photo:'', status:'available' },
  { id:31, name:'Alan Abraham',   position:'CAM', rating:83, basePrice:100, photo:'', status:'available' },
  { id:32, name:'Rahul Mathews',  position:'CDM', rating:80, basePrice:100, photo:'', status:'available' },
  { id:33, name:'Unni Krishnan',  position:'LB',  rating:75, basePrice:100, photo:'', status:'available' },
  { id:34, name:'Pradeep CK',     position:'CB',  rating:77, basePrice:100, photo:'', status:'available' },
  { id:35, name:'Sooraj Thomas',  position:'RB',  rating:76, basePrice:100, photo:'', status:'available' },
  { id:36, name:'Muhammed Rafi',  position:'CM',  rating:81, basePrice:100, photo:'', status:'available' },
  { id:37, name:'Akash Mohan',    position:'LW',  rating:79, basePrice:100, photo:'', status:'available' },
  { id:38, name:'Vishnu Prasad',  position:'GK',  rating:78, basePrice:100, photo:'', status:'available' },
  { id:39, name:'Arif Shameer',   position:'ST',  rating:84, basePrice:110, photo:'', status:'available' },
  { id:40, name:'Joel James',     position:'RW',  rating:80, basePrice:100, photo:'', status:'available' },
];
players.forEach(p => { if (!p.photo) p.photo = avatarUrl(p.name); });

// ─── TEAMS ────────────────────────────────────────────────────────────────────
let teams = [
  { id:'T1', name:'Thunder FC',   color:'#e63946', logo:'', budget:8000, spent:0, players:[] },
  { id:'T2', name:'Strikers SC',  color:'#4895ef', logo:'', budget:8000, spent:0, players:[] },
  { id:'T3', name:'Royal Eagles', color:'#f4a261', logo:'', budget:8000, spent:0, players:[] },
  { id:'T4', name:'Green Wolves', color:'#2dc653', logo:'', budget:8000, spent:0, players:[] },
];

// ─── AUCTION STATE ────────────────────────────────────────────────────────────
let auctionState = {
  phase: 'idle', currentPlayer: null, currentBid: 0, leadingTeam: null,
  bidHistory: [], soldPlayers: [],
};

// Snapshot for undo (one level)
let previousBidSnapshot = null;

function broadcastState() {
  io.emit('stateUpdate', { auctionState, teams, players, config: { ...config, adminPassword: undefined } });
}

// ─── SOCKET ───────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  socket.emit('stateUpdate', { auctionState, teams, players, config: { ...config, adminPassword: undefined } });
  console.log(`[+] ${socket.id}`);

  // ── Admin auth
  socket.on('admin:verifyPassword', ({ password }, cb) => {
    cb && cb({ ok: password === config.adminPassword });
  });

  // ── Start auction
  socket.on('admin:startAuction', ({ playerId }) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.status !== 'available') return;
    previousBidSnapshot = null;
    auctionState = {
      phase: 'live', currentPlayer: player, currentBid: player.basePrice,
      leadingTeam: null, bidHistory: [], soldPlayers: auctionState.soldPlayers,
    };
    broadcastState();
    console.log(`[▶] ${player.name} @ ₹${player.basePrice}`);
  });

  // ── Place bid
  socket.on('placeBid', ({ teamId, amount }) => {
    if (auctionState.phase !== 'live') return;
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const remaining  = team.budget - team.spent;
    const maxBid     = getTeamMaxBid(team);
    const basePrice  = auctionState.currentPlayer?.basePrice ?? 0;

    if (amount < basePrice) {
      socket.emit('bidError', { msg: `Bid must be at least base price ₹${basePrice}` }); return;
    }
    if (amount > remaining) {
      socket.emit('bidError', { msg: `${team.name} has no budget (₹${remaining} left).` }); return;
    }
    if (amount > maxBid) {
      const need = config.minPlayersPerTeam - team.players.length - 1;
      socket.emit('bidError', { msg: `${team.name} must keep budget for ${need} more player${need !== 1 ? 's' : ''}. Max bid: ₹${maxBid}` }); return;
    }
    if (amount <= auctionState.currentBid) {
      socket.emit('bidError', { msg: `Bid ₹${amount} must exceed ₹${auctionState.currentBid}` }); return;
    }

    // Save snapshot before mutating (for undo)
    previousBidSnapshot = {
      currentBid:  auctionState.currentBid,
      leadingTeam: auctionState.leadingTeam,
      bidHistory:  [...auctionState.bidHistory],
    };

    auctionState.currentBid  = amount;
    auctionState.leadingTeam = { id: team.id, name: team.name, color: team.color, logo: team.logo };
    auctionState.bidHistory.unshift({ team: team.name, color: team.color, logo: team.logo, amount, ts: Date.now() });

    broadcastState();
    io.emit('bidFlash', { team, amount });
    console.log(`[₹] ${team.name} → ₹${amount} for ${auctionState.currentPlayer?.name}`);
  });

  // ── Undo last bid
  socket.on('admin:undoBid', () => {
    if (!previousBidSnapshot || auctionState.phase !== 'live') return;
    auctionState.currentBid  = previousBidSnapshot.currentBid;
    auctionState.leadingTeam = previousBidSnapshot.leadingTeam;
    auctionState.bidHistory  = previousBidSnapshot.bidHistory;
    previousBidSnapshot = null; // Only one level of undo
    broadcastState();
    io.emit('bidUndo');
    console.log(`[↩] Bid undone for ${auctionState.currentPlayer?.name}`);
  });

  // ── Sold
  socket.on('admin:sold', () => {
    if (auctionState.phase !== 'live' || !auctionState.leadingTeam) return;
    const player = auctionState.currentPlayer;
    const team   = teams.find(t => t.id === auctionState.leadingTeam.id);
    const price  = auctionState.currentBid;

    player.status    = 'sold';
    player.soldTo    = team.name;
    player.soldPrice = price;

    team.spent += price;
    team.players.push({ ...player });

    auctionState.phase       = 'sold';
    auctionState.soldPlayers = [...auctionState.soldPlayers, { player, team: team.name, teamColor: team.color, teamLogo: team.logo, price }];
    previousBidSnapshot = null;

    broadcastState();
    io.emit('playerSold', { player, team, price });
    console.log(`[✓] SOLD: ${player.name} → ${team.name} @ ₹${price}`);
  });

  // ── Unsold
  socket.on('admin:unsold', () => {
    if (!auctionState.currentPlayer) return;
    const p = players.find(x => x.id === auctionState.currentPlayer.id);
    if (p) p.status = 'unsold';
    auctionState.phase = 'unsold';
    previousBidSnapshot = null;
    broadcastState();
    io.emit('playerUnsold', { player: auctionState.currentPlayer });
    console.log(`[✗] UNSOLD: ${auctionState.currentPlayer?.name}`);
  });

  // ── Idle
  socket.on('admin:idle', () => {
    auctionState = { ...auctionState, phase: 'idle', currentPlayer: null, currentBid: 0, leadingTeam: null, bidHistory: [] };
    previousBidSnapshot = null;
    broadcastState();
  });

  // ── Reset ALL teams (clear squads, restore spent to 0, return sold players)
  socket.on('admin:resetAllTeams', () => {
    teams.forEach(t => { t.spent = 0; t.players = []; });
    players.forEach(p => {
      if (p.status === 'sold' || p.status === 'unsold') {
        p.status = 'available';
        delete p.soldTo;
        delete p.soldPrice;
      }
    });
    auctionState = { phase: 'idle', currentPlayer: null, currentBid: 0, leadingTeam: null, bidHistory: [], soldPlayers: [] };
    previousBidSnapshot = null;
    broadcastState();
    console.log('[RESET] All teams and players cleared');
  });

  // ── Add player
  socket.on('admin:addPlayer', (player) => {
    player.id     = Math.max(...players.map(p => p.id), 0) + 1;
    player.status = 'available';
    if (!player.photo?.trim()) player.photo = avatarUrl(player.name);
    players.push(player);
    broadcastState();
  });

  // ── Edit player
  socket.on('admin:editPlayer', (updated) => {
    const idx = players.findIndex(p => p.id === updated.id);
    if (idx !== -1) {
      if (!updated.photo?.trim()) updated.photo = avatarUrl(updated.name);
      players[idx] = { ...players[idx], ...updated };
      broadcastState();
    }
  });

  // ── Remove player
  socket.on('admin:removePlayer', ({ playerId }) => {
    players = players.filter(p => p.id !== playerId);
    broadcastState();
  });

  // ── Reset unsold player
  socket.on('admin:resetPlayer', ({ playerId }) => {
    const p = players.find(x => x.id === playerId);
    if (p) { p.status = 'available'; delete p.soldTo; delete p.soldPrice; }
    broadcastState();
  });

  // ── Save team
  socket.on('admin:saveTeam', (team) => {
    const idx = teams.findIndex(t => t.id === team.id);
    if (idx === -1) { team.spent = 0; team.players = []; teams.push(team); }
    else teams[idx] = { ...teams[idx], name: team.name, color: team.color, logo: team.logo, budget: Number(team.budget) };
    broadcastState();
  });

  // ── Remove team
  socket.on('admin:removeTeam', ({ teamId }) => {
    teams = teams.filter(t => t.id !== teamId);
    broadcastState();
  });

  // ── Update config (password handled separately)
  socket.on('admin:updateConfig', (cfg) => {
    if (cfg.adminPassword !== undefined) config.adminPassword = cfg.adminPassword;
    const { adminPassword, ...rest } = cfg;
    Object.assign(config, rest);
    broadcastState();
  });

  socket.on('disconnect', () => console.log(`[-] ${socket.id}`));
});

app.get('/api/state', (req, res) => {
  res.json({ auctionState, teams, players, config: { ...config, adminPassword: undefined } });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n⚽  PPL Auction  →  http://localhost:${PORT}`);
  console.log(`   Admin        →  http://localhost:${PORT}/admin.html`);
  console.log(`   Projector    →  http://localhost:${PORT}/projector.html`);
  console.log(`   Manager      →  http://localhost:${PORT}/manager.html`);
  console.log(`\n   Default admin password: ppl2024\n`);
});
