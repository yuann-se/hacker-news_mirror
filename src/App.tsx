import './index.css';
import { Layout } from 'antd';
import { Header } from './components/Header';
import { NewsList } from './components/NewsList';


function App() {
  return (
    <Layout>
      <Header />
      <NewsList />
    </Layout>
  );
}

export default App;
