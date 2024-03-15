import Book from "./components/Book"
import Bookings from "./components/Bookings"
import Cabs from "./components/Cabs" 
import NavBar from "./components/navbar"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <Router>
      <NavBar/>
        <Routes>
          <Route exact path="/" element={<Book/> } />
          <Route path="/Bookings" element={<Bookings/>} />
          <Route path="/Cabs" element={<Cabs/> } />
        </Routes>
        </Router>
    </>
  )
}

export default App
