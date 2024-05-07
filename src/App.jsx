import Header from './components/Header'
import PlayBoard from './components/PlayBoard'
import ScoreBoard from './components/ScoreBoard'
import Footer from './components/Footer'

function App() {

  return (
    <>
      <Header />
      <main className='flex flex-col w-full items-center'>
        <PlayBoard />
        <ScoreBoard />
      </main>
      <Footer />
    </>
  )
}

export default App
