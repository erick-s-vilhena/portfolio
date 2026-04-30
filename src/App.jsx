import './styles/App.scss'
import { useEffect, useRef, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate, useOutlet } from 'react-router-dom'
import Header from './components/Header'
import Inicio from './components/Inicio'
import Luz_bg from './components/Luz_bg'
import Sobre from './components/Sobre'
import CertificadosPage from './components/CertificadosPage'
import CertificadoAberto from './components/CertificadoAberto'
import HabilidadeOpen from './components/HabilidadeOpen'
import { useContexto } from './context/Contexto'
import Projetos from './components/Projetos'
import MenuLateral from './components/MenuLateral'
import Contatos from './components/Contatos'

const ROUTES_ORDER = ['/', '/sobre', '/certificados', '/projetos', '/contatos'];
const ROUTE_TRANSITION_MS = 700;
const ROUTE_SCROLL_LOCK_MS = 820;

function Layout() {
  const { certificadoAberto, habilidadeOpen } = useContexto();
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartScrollTopRef = useRef(0);
  const touchStartMaxScrollTopRef = useRef(0);
  const transitionTimeoutRef = useRef();
  const currentPaneRef = useRef(null);
  const [currentView, setCurrentView] = useState({
    pathname: location.pathname,
    outlet,
  });
  const [previousView, setPreviousView] = useState(null);
  const [transitionDirection, setTransitionDirection] = useState('forward');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isHome = currentView.pathname === '/';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === currentView.pathname) return;

    clearTimeout(transitionTimeoutRef.current);

    const currentIndex = ROUTES_ORDER.indexOf(currentView.pathname);
    const nextIndex = ROUTES_ORDER.indexOf(location.pathname);
    const nextDirection =
      currentIndex !== -1 && nextIndex !== -1 && nextIndex < currentIndex
        ? 'backward'
        : 'forward';

    setTransitionDirection(nextDirection);
    setPreviousView(currentView);
    setCurrentView({
      pathname: location.pathname,
      outlet,
    });
    setIsTransitioning(true);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setPreviousView(null);
      setIsTransitioning(false);
    }, ROUTE_TRANSITION_MS);
  }, [currentView, location.pathname, outlet]);

  useEffect(() => {
    const paneAtual = currentPaneRef.current;
    if (!paneAtual) return;

    const elementos = paneAtual.querySelectorAll('.hidden');

    const myObserver = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          ent.target.classList.add('show');
        }
      });
    });

    elementos.forEach((ele) => {
      myObserver.observe(ele);
    });

    return () => {
      myObserver.disconnect();
    };
  }, [currentView.pathname, isTransitioning]);

  useEffect(() => {
    function navigateByDirection(direction) {
      if (certificadoAberto || habilidadeOpen) return false;
      if (wheelLockRef.current) return false;

      const currentIndex = ROUTES_ORDER.indexOf(location.pathname);
      if (currentIndex === -1) return false;

      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= ROUTES_ORDER.length) return false;

      const scrollTop = window.scrollY;
      const maxScrollTop =
        document.documentElement.scrollHeight - window.innerHeight;
      const atTop = scrollTop <= 4;
      const atBottom = maxScrollTop - scrollTop <= 4;

      if (direction > 0 && !atBottom) return false;
      if (direction < 0 && !atTop) return false;

      wheelLockRef.current = true;
      navigate(ROUTES_ORDER[nextIndex]);

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, ROUTE_SCROLL_LOCK_MS);

      return true;
    }

    function handleWheel(event) {
      if (Math.abs(event.deltaY) < 35) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const moved = navigateByDirection(direction);

      if (moved) {
        event.preventDefault();
      }
    }

    function handleTouchStart(event) {
      const touch = event.touches[0];
      if (!touch) return;

      touchStartYRef.current = touch.clientY;
      touchStartXRef.current = touch.clientX;
      touchStartScrollTopRef.current = window.scrollY;
      touchStartMaxScrollTopRef.current =
        document.documentElement.scrollHeight - window.innerHeight;
    }

    function handleTouchEnd(event) {
      if (touchStartYRef.current === null || touchStartXRef.current === null) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaY = touchStartYRef.current - touch.clientY;
      const deltaX = touchStartXRef.current - touch.clientX;

      touchStartYRef.current = null;
      touchStartXRef.current = null;

      if (Math.abs(deltaY) < 60) return;
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;

      const direction = deltaY > 0 ? 1 : -1;
      const startedAtTop = touchStartScrollTopRef.current <= 4;
      const startedAtBottom =
        touchStartMaxScrollTopRef.current - touchStartScrollTopRef.current <= 4;

      if (direction > 0 && !startedAtBottom) return;
      if (direction < 0 && !startedAtTop) return;

      navigateByDirection(direction);
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [certificadoAberto, habilidadeOpen, location.pathname, navigate]);

  useEffect(() => {
    return () => {
      clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  return (
    <div className="app">
      {certificadoAberto && <CertificadoAberto />}
      {habilidadeOpen && <HabilidadeOpen />}

      <Luz_bg trigger={location.pathname} />
      <Header />
      <main
        className={`route-content ${isTransitioning ? 'is-transitioning' : ''}`}
      >
        {previousView && (
          <div
            key={`prev-${previousView.pathname}`}
            className={`route-pane route-pane-prev ${previousView.pathname === '/' ? 'home' : 'inner'} ${transitionDirection} leave`}
          >
            {previousView.outlet}
          </div>
        )}

        <div
          key={currentView.pathname}
          ref={currentPaneRef}
          className={`route-pane route-pane-current ${isHome ? 'home' : 'inner'} ${isTransitioning ? `${transitionDirection} enter` : 'settled'}`}
        >
          {currentView.outlet}
        </div>
      </main>
      <MenuLateral />
    </div>
  );
}

function App() {
  useEffect(() => {
    if (window.location.hash !== '#/' && window.location.hash !== '') {
      window.location.replace(`${window.location.pathname}${window.location.search}#/`);
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/certificados" element={<CertificadosPage />} />
          <Route path="/habilidades" element={<Navigate to="/sobre" replace />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App

