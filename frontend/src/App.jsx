import './App.css'
import ClerkProviderWithRoutes from './auth/ClerkProviderWithRoutes'
import {Routes, Route} from 'react-router-dom'
import {ProtectedLayout} from './layout/ProtectedLayout.jsx'
import {Generator} from './challenge/Generator.jsx'
import {PanelHistory} from './history/PanelHistory.jsx'
import {AuthPage} from './auth/AuthPage.jsx'
import {LandingPage} from './pages/LandingPage.jsx'

function App() {
  return (
    <ClerkProviderWithRoutes>  
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<AuthPage />} />
        <Route path="/sign-up/*" element={<AuthPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/generate" element={<Generator />} />
          <Route path="/history" element={<PanelHistory />} />
        </Route>
      </Routes>
    </ClerkProviderWithRoutes>
  );
}

export default App
