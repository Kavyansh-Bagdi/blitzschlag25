'use client'
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from './Components/Navbar';
import Profile from './Pages/Profile';
import Login from './Pages/Login';
import Home from './Pages/Home';
import About from './Pages/About';
import Sponsor from './Pages/Sponsor';
import Team from './Pages/Team';
import Event from './Pages/Event';
import Schedule from './Pages/Schedule';
import CampusEmbassador from './Pages/CampusEmbassador';
import Pronite from './Pages/Pronite';
import Pass from './Pages/Pass';
import Error from './Pages/Error';
import SignUp from './Pages/SignUp';
import Model3D from './Pages/Model3D';
import Footer from './Components/Footer';
import { Tooltip } from "react-tooltip";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
  
    // Star properties
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMoving = false;
    const particles = [];
  
    // Mouse move handler
    const handleMouseMove = (e) => {
      const scrollY = window.scrollY; // Get the vertical scroll offset
      mouseX = e.clientX;
      mouseY = e.clientY + scrollY; // Adjust the mouseY position with scroll offset
      isMoving = true;
    };
    window.addEventListener('mousemove', handleMouseMove);
  
    // Animation
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      if (isMoving) {
        // Create new particles only when mouse is moving
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
  
        for (let i = 0; i < distance; i += 5) {
          const x = lastMouseX + Math.cos(angle) * i;
          const y = lastMouseY + Math.sin(angle) * i;
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            size: Math.random() * 2 + 2, // Increase base size
          });
        }
  
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        isMoving = false;
      }
  
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
  
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
  
        // Create gradient for each particle
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 2
        );
  
        // Adjust the colors to be darker and more golden
        gradient.addColorStop(0, `rgba(255, 204, 50, ${p.life})`); // Darker golden core
        gradient.addColorStop(0.4, `rgba(255, 153, 0, ${p.life * 0.3})`); // Rich golden tone
        gradient.addColorStop(1, `rgba(128, 80, 0, 0)`); // Fade to a dark brownish transparent color
  
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + (1 - p.life) * 2), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
  
      requestAnimationFrame(animate);
    };
  
    animate();
  
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Tooltip */}
      <Tooltip id="global-tooltip" />

      {/* Canvas for mouse effect */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1000 }}
      />
  
      <div className="w-screen h-screen text-white relative">
        {/* Main app content */}
        {location.pathname !== '/model3d' && <Navbar />}
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/event" element={<Event />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/our_team" element={<Team />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/campus_embassador" element={<CampusEmbassador />} />
            <Route path="/pronites" element={<Pronite />} />
            <Route path="/model3d" element={<Model3D />} />
            <Route path="/pass" element={<Pass />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
  
        {/* Footer */}
  
        {/* Toast notifications */}
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="dark"
        />
      </div>
    </>
  );
}

export default App;
