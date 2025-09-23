import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './components/Home'
import EditorPage from './components/EditorPage'
import { Toaster } from 'react-hot-toast'
function App() {


  return (
    <>
    <div>
      <Toaster
      position='top-right'
      toastOptions={{
        style: {
          borderRadius: '8px',
          background: '#fff',
          color: 'black',
        },
      }}
      >
      </Toaster>
    </div>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/editor/:roomId' element={<EditorPage />} />
        </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
