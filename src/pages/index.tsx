import scss from '@/styles/landingPage.module.scss';
export default function Home() {
  return (
    <html>
<div className={scss.headerContainer}><header className={scss.header}>
 <h1>alex the programmer-web designer</h1>
<p>make clear, useful website for small teams</p> 
</header>
</div>

<main className={scss.main}>
  <section>
    <h2 className={scss.header}>HELLO, website ni angelo!</h2>
    <p>i enjoy <strong>accessible design</strong> and <em>learning new tools</em>.</p>
  </section>
</main>
<div>
    <img className={scss.image}
  src="image.png"
  alt="a photo of a cute cat"
  width="200"
  height="200"/>
  <nav className={scss.navigation} aria-label='main navigation'>
    <a href='#about'>About</a>
    <a href='#projects'>Projects</a>
    <a href='#contacts'>Contacts</a>
  </nav>
  <section className={scss.section} id='about'>
    <h3>about</h3>
    <p>A short Introduction.</p>
  </section>
  <section className={scss.section} id='projects'>
    <h3>projects</h3>
    <p>selected work goes here</p>
  </section>
</div>
<section className={scss.section}>
  <h4>here is the list of gaming apps</h4>
<ul>
<li>mobile legends</li>
<li>call of duty</li>
<li>magic chess</li>
</ul>
</section>
</html>
  );
}