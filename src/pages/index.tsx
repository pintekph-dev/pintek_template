import scss from '@styles/LandingPage.module.scss';
import SampleForm from '@components/forms/SampleForm';
// import LoginForm from '@components/forms/LoginForm';
// import AddRecord from '@components/forms/AddRecord';

export default function Home() {

  return (
    <div className={scss.appWrapper}>
      {/* <LoginForm scss={scss} /> */}
      {/* <AddRecord scss={scss} /> */}
      <SampleForm scss={scss} />
    </div>
  );
}
