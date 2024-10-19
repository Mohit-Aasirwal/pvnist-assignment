import "./App.css";
import Card from "./components/card/Card";
import CascadingForm from "./components/CascadingForm";
import { CardProvider } from "./context/CardContext";

function App() {
  return (
    <CardProvider>
      <div className="App h-screen w-full flex">
        <CascadingForm />
        <div className="flex flex-row space-x-5 w-full justify-center items-center">
          {[1].map((value, id) => (
            <Card title="Card Title" key={id} />
          ))}
        </div>
      </div>
    </CardProvider>
  );
}

export default App;
