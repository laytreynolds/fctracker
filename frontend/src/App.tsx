import { Routes, Route } from 'react-router-dom';
import Layout from "@/pages/Laytout";
import PlayersPage from "@/pages/PlayersPage";
import FixturePage from "@/pages/FixturePage";

interface AppProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function App({ darkMode, setDarkMode} : AppProps) {
  return (
    <Routes>
      <Route path="/" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
      <Route path="/players" element={<PlayersPage />}/>
      <Route path="/fixtures" element={<FixturePage />}/>
      </Route>
    </Routes>
  );
}
export default App;
