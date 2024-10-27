import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./utils/auth";
import Projects from "./pages/projects";
import Login from "./utils/auth";
import Dashboard from "./pages/dashboard";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/projectDetails";
import PianoRoll from "./components/pianoroll/PianoRoll";
import LofiMidiRadioRetro from "./components/radioStation/lofistation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/new" element={<CreateProject />} /> {/* Página para crear un nuevo proyecto */}
        <Route path="/projects/:projectId" element={<ProjectDetails />} /> {/* Página para un proyecto específico */}
        <Route path="/piano-roll" element={<PianoRoll />} />
        <Route path="/LofiMidiRadioRetro" element={<LofiMidiRadioRetro />} />

        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;
