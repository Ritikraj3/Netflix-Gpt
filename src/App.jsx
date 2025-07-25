import { Provider } from 'react-redux'
import './App.css'
import Body from './components/Body'
import appStore from './utils/appStore'
import Footer from './components/Footer'

function App() {

  return (
    <>
      <Provider store= {appStore}>
        <Body />
        <Footer/>
      </Provider>
    </>
  )
}

export default App
