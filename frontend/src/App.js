// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import New from './pages/new';
import Home from './pages/home';
import Top from './pages/top';



function App() {
  // 共同編集フォームの状態

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* フォームのidとgroupのid */}
          <Route path="/" element={<Top />} />
          <Route path="/new" element={<New />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/weather/:id" element={<Weather />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
