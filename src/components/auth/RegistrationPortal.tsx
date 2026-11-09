import React, { useState } from 'react';
import { Building2, Plus, LogIn, CheckCircle2, ShieldCheck, Factory, ArrowRight, ArrowLeft } from 'lucide-react';
import { MillTenant, UserAccount } from '../../types/auth';
import { Language, translations } from '../../utils/translations';

interface RegistrationPortalProps {
  onLogin: (user: UserAccount, mill: MillTenant) => void;
  lang: Language;
}

export const RegistrationPortal: React.FC<RegistrationPortalProps> = ({
  onLogin,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Registration Form State
  const [millNameAr, setMillNameAr] = useState('');
  const [millNameFr, setMillNameFr] = useState('');
  const [wilaya, setWilaya] = useState('سطيف (19)');
  const [commune, setCommune] = useState('');
  const [oaicNumber, setOaicNumber] = useState('');
  const [dailyCapacityQx, setDailyCapacityQx] = useState<number>(4500);
  const [rcNumber, setRcNumber] = useState('');
  const [nifNumber, setNifNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const wilayasDZ = [
    '01 - أدرار', '02 - الشلف', '03 - الأغواط', '04 - أم البواقي', '05 - باتنة',
    '06 - بجاية', '07 - بسكرة', '08 - بشار', '09 - البليدة', '10 - البويرة',
    '11 - تمنراست', '12 - تبسة', '13 - تلمسان', '14 - تيارت', '15 - تيزي وزو',
    '16 - الجزائر', '17 - الجلفة', '18 - جيجل', '19 - سطيف', '20 - سعيدة',
    '21 - سكيكدة', '22 - سيدي بلعباس', '23 - عنابة', '24 - قالمة', '25 - قسنطينة',
    '26 - المدية', '27 - مستغانم', '28 - المسيلة', '29 - معسكر', '30 - ورقلة',
    '31 - وهران', '32 - البيض', '33 - إليزي', '34 - برج بوعريريج', '35 - بومرداس',
    '36 - الطارف', '37 - تندوف', '38 - تيسمسيلت', '39 - الوادي', '40 - خنشلة',
    '41 - سوق أهراس', '42 - تيبازة', '43 - ميلة', '44 - عين الدفلى', '45 - النعامة',
    '46 - عين تموشنت', '47 - غرداية', '48 - غليزان', '49 - تيميمون', '50 - برج باجي مختار',
    '51 - أولاد جلال', '52 - بني عباس', '53 - عين صالح', '54 - عين قزام', '55 - تقرت',
    '56 - جانت', '57 - المغير', '58 - المنيعة'
  ];

  // Quick Demo Accounts for Immediate Testing
  const demoMills: { user: UserAccount; mill: MillTenant }[] = [
    {
      user: {
        id: 'usr-1',
        fullName: 'الشيخ عبد الرزاق بن علي',
        email: 'setif@moulins.dz',
        role: 'owner',
        millId: 'mill-setif'
      },
      mill: {
        id: 'mill-setif',
        nameAr: 'مطاحن الهضاب الكبرى للحبوب',
        nameFr: 'Grands Moulins des Hauts Plateaux',
        wilaya: '19 - سطيف',
        commune: 'سطيف - المنطقة الصناعية',
        oaicAgreementNumber: 'AGR-OAIC/2024/094-DZ',
        rcNumber: '19/00-0842191 B 16',
        nifNumber: '001916084219142',
        nisNumber: '0016190100452',
        articleNumber: '19018420119',
        dailyCapacityQx: 5000,
        phone: '+213 (0) 36 84 12 90',
        email: 'setif@moulins.dz',
        ownerName: 'الشيخ عبد الرزاق بن علي',
        createdAt: '2026-01-15'
      }
    },
    {
      user: {
        id: 'usr-2',
        fullName: 'الحاج مصطفى درويش',
        email: 'mitidja@moulins.dz',
        role: 'owner',
        millId: 'mill-blida'
      },
      mill: {
        id: 'mill-blida',
        nameAr: 'مطاحن متيجة الحديثة للدقيق',
        nameFr: 'Minoterie Moderne de la Mitidja',
        wilaya: '09 - البليدة',
        commune: 'بوفاريك',
        oaicAgreementNumber: 'AGR-OAIC/2025/112-DZ',
        rcNumber: '09/00-019284 B 19',
        nifNumber: '000919019284102',
        nisNumber: '0009190100293',
        articleNumber: '090129841',
        dailyCapacityQx: 4200,
        phone: '+213 (0) 25 32 10 00',
        email: 'mitidja@moulins.dz',
        ownerName: 'الحاج مصطفى درويش',
        createdAt: '2026-02-01'
      }
    },
    {
      user: {
        id: 'usr-3',
        fullName: 'عمر بلقاسم بلحرش',
        email: 'tiaret@moulins.dz',
        role: 'owner',
        millId: 'mill-tiaret'
      },
      mill: {
        id: 'mill-tiaret',
        nameAr: 'مطاحن السرسو وتيارت للقمح الصلب',
        nameFr: 'Moulins du Sersou & Tiaret',
        wilaya: '14 - تيارت',
        commune: 'مهدية',
        oaicAgreementNumber: 'AGR-OAIC/2024/077-DZ',
        rcNumber: '14/00-058192 B 18',
        nifNumber: '001418058192001',
        nisNumber: '0014180100194',
        articleNumber: '140158192',
        dailyCapacityQx: 3800,
        phone: '+213 (0) 46 41 88 20',
        email: 'tiaret@moulins.dz',
        ownerName: 'عمر بلقاسم بلحرش',
        createdAt: '2026-03-10'
      }
    }
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!millNameAr || !ownerName || !email) return;

    const newMillId = `mill-${Date.now()}`;
    const newMill: MillTenant = {
      id: newMillId,
      nameAr: millNameAr,
      nameFr: millNameFr || millNameAr,
      wilaya,
      commune: commune || 'المنطقة الصناعية',
      oaicAgreementNumber: oaicNumber || `AGR-OAIC/2026/${Math.floor(100 + Math.random() * 900)}-DZ`,
      rcNumber: rcNumber || `${wilaya.slice(0, 2)}/00-${Math.floor(100000 + Math.random() * 900000)} B 26`,
      nifNumber: nifNumber || `00${wilaya.slice(0, 2)}160842${Math.floor(10000 + Math.random() * 90000)}`,
      nisNumber: `00${wilaya.slice(0, 2)}190100${Math.floor(100 + Math.random() * 900)}`,
      articleNumber: `${wilaya.slice(0, 2)}01${Math.floor(10000 + Math.random() * 90000)}`,
      dailyCapacityQx: dailyCapacityQx || 4000,
      phone: phone || '+213 (0) 550 00 00 00',
      email,
      ownerName,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: ownerName,
      email,
      role: 'owner',
      millId: newMillId
    };

    onLogin(newUser, newMill);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundDemo = demoMills.find(d => d.user.email.toLowerCase() === loginEmail.toLowerCase());
    if (foundDemo) {
      onLogin(foundDemo.user, foundDemo.mill);
    } else {
      // Create ad-hoc session
      const customMill: MillTenant = {
        id: `mill-${loginEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
        nameAr: 'مطحنة ' + (loginEmail.split('@')[0] || 'الجزائر'),
        nameFr: 'Minoterie ' + (loginEmail.split('@')[0] || 'Algérie'),
        wilaya: '16 - الجزائر',
        commune: 'المنطقة الصناعية',
        oaicAgreementNumber: 'AGR-OAIC/2026/099-DZ',
        rcNumber: '16/00-098412 B 26',
        nifNumber: '001616084219142',
        nisNumber: '0016190100452',
        articleNumber: '16018420119',
        dailyCapacityQx: 4500,
        phone: '+213 (0) 21 00 00 00',
        email: loginEmail,
        ownerName: loginEmail.split('@')[0],
        createdAt: new Date().toISOString().split('T')[0]
      };
      const customUser: UserAccount = {
        id: 'usr-custom',
        fullName: loginEmail.split('@')[0],
        email: loginEmail,
        role: 'owner',
        millId: customMill.id
      };
      onLogin(customUser, customMill);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Mill Facility Silhouette Scrim */}
      <img
        src="/src/assets/images/mill_facility_hero_1794130776241.jpg"
        alt="Algerian Flour Mill Complex"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/90 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-2xl w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#714B67] p-6 text-white text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-bold font-mono mb-2">
            <span>منظومة أودو السحابية للمطاحن الجزائرية · Odoo Cloud DZ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            بوابة تسجيل وولوج المطاحن والصوامع
          </h1>
          <p className="text-xs text-white/80 max-w-md mx-auto">
            سجّل مطحنتك الخاصة وابدأ إدارة قبان الحبوب OAIC، الصوامع، خطوط الطحن، وحصص المخابز عبر الإنترنت فوراً.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-[#714B67] text-[#714B67] dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            تسجيل مطحنة جديدة (Créer Minoterie)
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-[#714B67] text-[#714B67] dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            تسجيل الدخول بالمطحنة (Connexion)
          </button>
        </div>

        {/* Register Tab */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800">
                1. بيانات المنشأة الصناعية ومطحنة الحبوب
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    اسم المطحنة بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مطاحن الأوراس للحبوب"
                    value={millNameAr}
                    onChange={(e) => setMillNameAr(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم بالفرنسية (Nom Commercial)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Grands Moulins des Aurès"
                    value={millNameFr}
                    onChange={(e) => setMillNameFr(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    الولاية (Wilaya) *
                  </label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  >
                    {wilayasDZ.map((w, i) => (
                      <option key={i} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    البلدية والمنطقة الصناعية
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: باتنة - المنطقة الصناعية كشيدة"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    طاقة السحق اليومية (قنطار / 24 سا) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={dailyCapacityQx}
                    onChange={(e) => setDailyCapacityQx(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الاعتماد لدى ديوان الحبوب OAIC
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: AGR-OAIC/2026/044-DZ"
                    value={oaicNumber}
                    onChange={(e) => setOaicNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800">
                2. حساب المدير المسؤول عن المطحنة
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم الكامل للمدير / المالك *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الحاج عمار بن منصور"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    البريد الإلكتروني للعمل *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="directeur@moulins-aures.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    placeholder="0550 12 34 56"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5b3c53] rounded-lg shadow-md transition-colors mt-4 flex items-center justify-center gap-2"
            >
              <Factory className="w-4 h-4" />
              <span>تأكيد تسجيل المطحنة وبدء العمل الفوري</span>
            </button>
          </form>
        )}

        {/* Login Tab */}
        {activeTab === 'login' && (
          <div className="p-6 space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  placeholder="directeur@moulins.dz"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5b3c53] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول إلى لوحة إدارة المطحنة</span>
              </button>
            </form>

            {/* Quick Demo Access Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                أو دخول تجريبي مباشر بنقرة واحدة (Comptes Démo):
              </span>

              <div className="grid grid-cols-1 gap-2">
                {demoMills.map((demo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onLogin(demo.user, demo.mill)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 text-start flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#714B67] dark:group-hover:text-amber-400">
                        {demo.mill.nameAr}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {demo.mill.wilaya} · طاقة السحق: {demo.mill.dailyCapacityQx.toLocaleString()} قنطار/يوم
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#714B67] dark:text-amber-400 flex items-center gap-1">
                      <span>دخول</span>
                      {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
