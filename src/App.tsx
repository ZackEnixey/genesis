import './App.css';
import { Board } from './components';
import {useTranslation} from "react-i18next";

function App() {
  const {t, i18n} = useTranslation();

  return (
    <div className="App">
      {i18n.language}
      <Board />
    </div>
  );
}

export default App;
