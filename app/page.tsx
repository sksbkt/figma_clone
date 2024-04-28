import dynamic from "next/dynamic";

// ? we have to disable Server-Side-Rendering since canvas doesnt work with SSR(we cant manipulate)
const App = dynamic(() => import('./app'), { ssr: false });

export default App;