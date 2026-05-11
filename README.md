# BalanceHub.mn

AI хоол & дасгалын төлөвлөгч.

## Хийх зүйлс (дарааллаар)

### 1. Данс нээх (бүгд үнэгүй)

- github.com → бүртгүүлэх
- vercel.com → GitHub-аараа нэвтрэх
- supabase.com → бүртгүүлэх
- merchant.qpay.mn → бизнес данс нээх (1-3 хоног баталгаажна)
- console.anthropic.com → бүртгүүлж API key авах

### 2. Компьютер дээрээ Node.js суулгах

https://nodejs.org → "LTS" товч дарж татах → суулгах.

### 3. Энэ проектийг ажиллуулах

Терминал (Mac: Terminal, Windows: Command Prompt) нээгээд:

```
cd balancehub
npm install
```

### 4. Тохиргоо хийх

`.env.example` файлыг `.env.local` гэж хуулна:

```
cp .env.example .env.local
```

Дараа нь `.env.local` файлыг нээж, өөрийн key-үүдийг бичнэ:

- ANTHROPIC_API_KEY → console.anthropic.com → API Keys-ээс
- NEXT_PUBLIC_SUPABASE_URL → supabase.com → Project → Settings → API
- NEXT_PUBLIC_SUPABASE_ANON_KEY → мөн тэндээс
- SUPABASE_SERVICE_ROLE_KEY → мөн тэндээс (service_role гэсэн)
- QPAY хэсэг → merchant.qpay.mn-ээс

### 5. Database тохируулах

supabase.com → SQL Editor → New query →
`supabase-setup.sql` файлын агуулгыг хуулж paste-лээд "Run" дарна.

### 6. Ажиллуулах

```
npm run dev
```

Дараа нь browser-ээр http://localhost:3000 руу орно.

### 7. Интернэтэд нийтлэх (Deploy)

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ЧИНИЙ_НЭРЭЭР/balancehub.git
git push -u origin main
```

Дараа нь vercel.com → Add New Project → GitHub repo-гоо сонгох →
Environment Variables хэсэгт `.env.local` дотор байгаа бүх key-үүдийг нэмэх →
Deploy дарна.

Ингээд `balancehub.vercel.app` дээр сайт нь live болно!

### 8. Домэйн холбох (хүсвэл)

- domain.mn эсвэл nic.mn-ээс `balancehub.mn` авна
- Vercel → Settings → Domains → домэйнээ нэмнэ
- DNS тохиргоог Vercel-ийн заасанаар хийнэ

Дууслаа! 🚀
