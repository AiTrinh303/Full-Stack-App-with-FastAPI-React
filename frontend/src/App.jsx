import './App.css'
import ClerkProviderWithRoutes from './auth/ClerkProviderWithRoutes'
import {Routes, Route} from 'react-router-dom'
import {Layout} from './layout/Layout.jsx'
import {Generator} from './challenge/Generator.jsx'
import {PanelHistory} from './history/PanelHistory.jsx'
import {AuthPage} from './auth/AuthPage.jsx'

function App() {
  return (
    <ClerkProviderWithRoutes>  
      <Routes>
        <Route path="/sign-in/*" element={<AuthPage />} />
        <Route path="/sign-up/*" element={<AuthPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Generator />} />
          <Route path="/history" element={<PanelHistory />} />
        </Route>
      </Routes>
    </ClerkProviderWithRoutes>
  );
}

export default App
