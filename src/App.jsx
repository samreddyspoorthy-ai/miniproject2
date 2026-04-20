import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AnalyticsLabPage from './pages/AnalyticsLabPage';
import AuthPage from './pages/AuthPage';
import FeatureHubPage from './pages/FeatureHubPage';
import InputPage from './pages/InputPage';
import OptionsPage from './pages/OptionsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import ResearchLabPage from './pages/ResearchLabPage';
import ResultPage from './pages/ResultPage';
import SmartCitySupportPage from './pages/SmartCitySupportPage';
import StartPage from './pages/StartPage';
import SuggestionPage from './pages/SuggestionPage';
import SustainabilityPage from './pages/SustainabilityPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<StartPage />} />
        <Route path="/hub" element={<FeatureHubPage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/smart-city" element={<SmartCitySupportPage />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/suggestions" element={<SuggestionPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/sustainability" element={<SustainabilityPage />} />
        <Route path="/analytics-lab" element={<AnalyticsLabPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/research-lab" element={<ResearchLabPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
