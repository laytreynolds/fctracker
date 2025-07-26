import { Routes, Route } from 'react-router-dom';
import Layout from "@/pages/Laytout";
import PlayersPage from "@/pages/PlayersPage";
import FixturePage from "@/pages/FixturePage";
import Home from '@/pages/Home';
import TeamPage from '@/pages/TeamPage';
import FixtureDetailPage from '@/pages/FixtureDetailPage';

interface AppProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function App({ darkMode, setDarkMode} : AppProps) {
  return (
    <Routes>
      <Route path="/" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
        <Route index element={<Home />}/>
        <Route path="/players" element={<PlayersPage />}/>
        <Route path="/fixtures" element={<FixturePage />}/>
        <Route path="/teams" element={<TeamPage />}/>
        <Route path="/fixtures/:id" element={<FixtureDetailPage />}/>
      </Route>
    </Routes>
  );
}
export default App;
  