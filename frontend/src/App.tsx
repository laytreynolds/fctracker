import { add, format } from 'date-fns'
import './App.css'

function App() {
  return (
    <>
    Hello World - Today's Date: {format(add(new Date(), { days: 0 }), 'dd/MM/yyyy')}
    </>
  )
}

export default App
