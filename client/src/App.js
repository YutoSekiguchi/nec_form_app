// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import New from './pages/new';
import Home from './pages/home';
import Top from './pages/top';
import AllView from './pages/all_view';



function App() {
  // 共同編集フォームの状態

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* フォームのidとgroupのid */}
          <Route path="/" element={<Top />} />
          <Route path="/new" element={<New />} />
          <Route path="/all/view" element={<AllView />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
