import logo from '../assets/logo.png'
import { appShellStyles } from '../assets/dummyStyles.js'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
const AppShell = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [mobileOpen, setmobileOpen] = useState(false)
  const [collapsed, setcollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    } catch (error) {
      return false
    }
  })
  const [scrolled, setscrolled] = useState(false)
  const [isMobile, setisMobile] = useState(false)

  const logout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.warn('sinout error', error);
    }
    navigate('/login')
  }
  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setisMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setcollapsed(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar_collapsed", collapsed ? "true" : "false");
    } catch { }
  }, [collapsed]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => setscrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = (() => {
    if (!user) return "User";
    const name = user.fullName || user.firstName || user.username || "";
    return name.trim() || (user.email || "").split?.("@")?.[0] || "User";
  })();

  const firstName = () => {
    const parts = displayName.split(" ").filter(Boolean);
    return parts.length ? parts[0] : displayName;
  };
  const toggleSidebar = () => setcollapsed(!collapsed)

  const initials = () => {
    const parts = displayName.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const DashboardIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const InvoiceIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const CreateIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );

  const ProfileIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const LogoutIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const CollapseIcon = ({ className = "w-4 h-4", collapsed }) => (
    <svg
      className={`${className} transition-transform duration-300 ${collapsed ? "rotate-180" : ""
        }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
      />
    </svg>
  );

  /* ----- SidebarLink ----- */
  const SidebarLink = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `
        ${appShellStyles.sidebarLink}
        ${collapsed ? appShellStyles.sidebarLinkCollapsed : ""}
        ${isActive
          ? appShellStyles.sidebarLinkActive
          : appShellStyles.sidebarLinkInactive
        }
      `}
      onClick={() => setmobileOpen(false)}
    >
      {({ isActive }) => (
        <>
          <div
            className={`${appShellStyles.sidebarIcon} ${isActive
              ? appShellStyles.sidebarIconActive
              : appShellStyles.sidebarIconInactive
              }`}
          >
            {icon}
          </div>
          {!collapsed && (
            <span className={appShellStyles.sidebarText}>{children}</span>
          )}
          {!collapsed && isActive && (
            <div className={appShellStyles.sidebarActiveIndicator} />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <div className='lg:flex'>
        <aside className={`${appShellStyles.sidebar} ${collapsed ? appShellStyles.sidebarCollapsed : appShellStyles.sidebarExpanded}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/5 to-transparent pointer-events-none"></div>
          <div className="px-6 py-8 h-full flex flex-col justify-between relative z-10">
            <div>

              <div className={`${appShellStyles.logoContainer} ${collapsed ? appShellStyles.logoContainerCollapsed : ''}`}>
                <Link to='/' className="inline-flex items-center group transition-all duration-300">
                  <div className='relative'>
                    <img src={logo} alt="logo" className="h-16 w-16 object-contain drop-shadow-sm" />
                    <div className='absolute inset-0 rounded-lg blur-sm group-hover:blur-md transition-all duration-300' />
                  </div>
                  {!collapsed && (
                    <div className=''>
                      <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"></span>
                      <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 mt-1"></div>
                    </div>
                  )}
                </Link>
                {!collapsed && (
                  <button onClick={toggleSidebar} className="p-2 ml-7 rounded-lg border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all duration-300 group">
                    <CollapseIcon collapsed={collapsed} />
                  </button>
                )}
              </div>
              <nav className='space-y-2'>
                <SidebarLink to="/app/dashboard" icon={<DashboardIcon />}>
                  Dashboard
                </SidebarLink>
                <SidebarLink to="/app/invoices" icon={<InvoiceIcon />}>
                  Invoices
                </SidebarLink>
                <SidebarLink to="/app/create-invoice" icon={<CreateIcon />}>
                  Create Invoice
                </SidebarLink>
                <SidebarLink to="/app/business" icon={<ProfileIcon />}>
                  Business Profile
                </SidebarLink>
              </nav>
            </div>
            <div className='mt-auto'>
              <div className={`${appShellStyles.userDivider} ${collapsed ? appShellStyles.userDividerCollapsed : appShellStyles.userDividerExpanded
                }`}>{!collapsed ? (
                  <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-300 group">
                    <LogoutIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button onClick={logout} className='w-full flex items-center justify-center p-3 rounded-xl text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300'>
                    <LogoutIcon className='w-5 h-5 hover:scale-110 transition-transform' />
                  </button>
                )}
                <div className="mt-4 flex justify-center">
                  <button className={`${appShellStyles.collapseButtonInner} ${collapsed ? appShellStyles.collapseButtonCollapsed : ""
                    }`} onClick={toggleSidebar}>{!collapsed && (
                      <span>{collapsed ? "expand" : 'Collapse'}</span>
                    )}
                    <CollapseIcon collapsed={collapsed} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
        {/* mobile view  */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setmobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 bg-white/90 backdrop-blur-xl border-r border-gray-200/60 p-6 overflow-auto transform transition-transform duration-300">
              <div className="mb-8 flex items-center justify-between">
                <Link to='/' className="inline-flex items-center" onClick={() => setmobileOpen(false)} >
                  <img src={logo} className='h-10 w-10 object-contain' alt="logo" />
                  <span className="font-bold text-xl ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    InvoiceAI
                  </span></Link>
                <button onClick={() => setmobileOpen(false)} className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-300">
                  <svg
                    className='w-5 h-5 text-gray-600'
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* navigations */}
              <nav className='space-y-2'>
                <NavLink
                  onClick={() => setmobileOpen(false)}
                  to="/app/dashboard"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${isActive
                      ? appShellStyles.mobileNavLinkActive
                      : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  {" "}
                  <DashboardIcon /> Dashboard
                </NavLink>
                <NavLink
                  onClick={() => setmobileOpen(false)}
                  to="/app/invoices"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${isActive
                      ? appShellStyles.mobileNavLinkActive
                      : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  {" "}
                  <InvoiceIcon /> Invoices
                </NavLink>
                <NavLink
                  onClick={() => setmobileOpen(false)}
                  to="/app/create-invoice"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${isActive
                      ? appShellStyles.mobileNavLinkActive
                      : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  {" "}
                  <CreateIcon /> Create Invoice
                </NavLink>
                <NavLink
                  onClick={() => setmobileOpen(false)}
                  to="/app/business"
                  className={({ isActive }) =>
                    `${appShellStyles.mobileNavLink} ${isActive
                      ? appShellStyles.mobileNavLinkActive
                      : appShellStyles.mobileNavLinkInactive
                    }`
                  }
                >
                  {" "}
                  <ProfileIcon /> Business Profile
                </NavLink>
              </nav>
              <div className="mt-8 border-t border-gray-200/60 pt-6">
                <button onClick={() => {
                  setmobileOpen(false);
                  logout();
                }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300"><LogoutIcon />Logout</button></div>
            </div>
          </div>
        )}
        {/* main content navbar */}
        <div className='flex-1 min-w-0' style={{ position: 'relative', zIndex: 20 }}>
          <header className={`${appShellStyles.header} ${scrolled ? appShellStyles.headerScrolled : appShellStyles.headerNotScrolled}`}>
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto py-3 sm:py-0">
              <div className="flex items-center gap-3 sm:gap-6">
                <button onClick={() => setmobileOpen(true)} className="lg:hidden inline-flex items-center justify-center p-2 sm:p-3 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all duration-300">
                  <svg
                    className='w-5 h-5 text-white'
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {isMobile && (
                  <button className="hidden lg:flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:shadow-md transition-all duration-300" onClick={toggleSidebar}>
                    <CollapseIcon collapsed={collapsed} />
                  </button>
                )}
                <div className='flex flex-col'>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                    Welcome Back, {" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {firstName()}
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Ready to Create Amazing Invoices?</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pb-3 sm:pb-0 border-t border-gray-100 sm:border-t-0 pt-3 sm:pt-0">
              <button onClick={() => navigate('/app/create-invoice')} className="group inline-flex  items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 text-sm sm:text-base flex-1 sm:flex-none justify-center">
                <CreateIcon className="w-4 h-4 text-white" />
                <span className='hidden xs:inline'>Create Invoice</span>
                <span className='xs:hidden'>Create</span>
              </button>
              <div className=" lg:flex md:flex items-center gap-4 pl-4 border-l border-gray-200/60">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">{displayName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <div className='relative'>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group">{initials()}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className='p-4 sm:p-6 lg:p-8'>
            <div className='max-w-7xl mx-auto'>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppShell