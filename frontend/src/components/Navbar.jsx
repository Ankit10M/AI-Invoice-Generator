import { Link, useNavigate } from 'react-router-dom'
import { navbarStyles } from '../assets/dummyStyles.js'
import logo from '../assets/logo.png'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SignedOut, useAuth, useClerk, useUser } from '@clerk/clerk-react'
const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const { user } = useUser();
    const { getToken, isSignedIn } = useAuth();
    const clerk = useClerk()
    const navigate = useNavigate();
    const profileRef = useRef(null)
    const TOKEN_KEY = 'token';
    function openSignIn() {
        try {
            if (clerk && typeof clerk.openSignIn === "function") {
                clerk.openSignIn()
            } else {
                navigate('/login')
            }
        } catch (error) {
            console.error('opensignin failed', e);
            navigate('/login')
        }
    }
    function openSignUp() {
        try {
            if (clerk && typeof clerk.openSignUp === "function") {
                clerk.openSignUp()
            } else {
                navigate('/login')
            }
        } catch (error) {
            console.error('opensignup failed', error);
            navigate('/login')
        }
    }

    const fetchAndStoreToken = useCallback(async () => {
        try {
            if (!getToken) {
                return null;
            }
            const token = await getToken().catch(() => null)
            if (token) {
                try {
                    localStorage.setItem(TOKEN_KEY, token)
                    console.log(token);
                } catch (error) {
                    // ignore error
                }
                return token;
            }
            else {
                return null
            }
        } catch (error) {
            return null
        }
    }, [getToken])

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (isSignedIn) {
                const t = await fetchAndStoreToken({ template: 'default' }).catch(() => null)
                if (!t && mounted) {
                    await fetchAndStoreToken({ forceRefresh: true }).catch(() => null)
                }
            }
            else {
                try {
                    localStorage.removeItem(TOKEN_KEY);
                } catch (error) {

                }
            }
        })();

        return () => {
            mounted = false
        }
    }, [isSignedIn, user, fetchAndStoreToken])

    useEffect(() => {
        if (isSignedIn) {
            const pathname = window.location.pathname || '/'
            if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/auth') || pathname === '/') {
                navigate('/app/dashboard', { replace: true })
            }
        }
    })
    useEffect(() => {
        function onDocClick(e) {
            if (!profileRef.current) return;
            if (!profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        if (profileOpen) {
            document.addEventListener("mousedown", onDocClick);
            document.addEventListener("touchstart", onDocClick);
        }
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("touchstart", onDocClick);
        };
    }, [profileOpen]);



    return (
        <header className="fixed w-full z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <nav className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link to='/' className="inline-flex items-center">
                            <img src={logo} alt="logo" className="h-12 w-12 object-contain" />
                            <span className="font-semibold text-lg tracking-tight">InvoiceAI</span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-6 ml-6">
                            <a href="#features" className="text-sm hover:text-indigo-600 transition">Features</a>
                            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition">Pricing</a>
                        </div>
                    </div>
                    <div className=' flex items-center gap-4'>
                        <div className="hidden md:flex items-center gap-4">
                            <SignedOut>
                                <button onClick={openSignIn} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 px-4 py-2 rounded-2xl hover:bg-gray-50/80 backdrop-blur-sm" type='button'>SignIn</button>
                                <button onClick={openSignUp} className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 overflow-hidden" type='button'>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className='relative'>Get Started</span>
                                    <svg
                                        className="w-4 h-4 relative group-hover:translate-x-1 transition-transform duration-300"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M5 12h14m-7-7l7 7-7 7" />
                                    </svg>
                                </button>
                            </SignedOut>
                        </div>
                        {/* mobile toggle */}
                        <button className="md:hidden p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105" onClick={() => setOpen(!open)}>
                            <div className="relative w-6 h-6">
                                <span className={`${navbarStyles.mobileMenuLine1}${open ? navbarStyles.mobileMenuLine1Open : navbarStyles.mobileMenuLine1Closed
                                    }`}></span>
                                <span className={`${navbarStyles.mobileMenuLine2}${open ? navbarStyles.mobileMenuLine2Open : navbarStyles.mobileMenuLine2Closed
                                    }`}></span>
                                <span className={`${navbarStyles.mobileMenuLine3}${open ? navbarStyles.mobileMenuLine3Open : navbarStyles.mobileMenuLine3Closed
                                    }`}></span>
                            </div>
                        </button>
                    </div>
                </nav>
            </div>
            <div className={`${open ? "block" : "hidden"} ${navbarStyles.mobileMenu}`}>
                <div className="px-6 py-4 space-y-3">
                    <a href="#features" className="block text-gray-700">Features</a>
                    <a href="#pricing" className="block text-gray-700">Pricing</a>
                    <div className='pt-2'>
                        <SignedOut>
                            <button className="block text-gray-700 py-2" onClick={openSignIn}>Sign In</button>
                            <button className="block mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-center" onClick={openSignUp}>Sign Up</button>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>)
}

export default Navbar