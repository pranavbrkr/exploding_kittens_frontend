import WelcomePage from "./pages/WelcomePage"

function App() {
  const handleNameSubmit = (name) => {
    console.log(`Name submitted: ${name}`)
  }

  return <WelcomePage onSubmitName={handleNameSubmit} />
}
export default App