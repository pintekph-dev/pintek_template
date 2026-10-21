import scss from '@styles/LandingPage.module.scss';
export default function Home() {
  return (
    <div className={scss.appWrapper}>
      <p>test</p>
      <div className={scss.cards}>
        <div className={scss.card+' '+scss.w33}>
          1
        </div>
        <div className={scss.card+' '+scss.w33}>
          2
        </div>
        <div className={scss.card+' '+scss.w33}>
          3
        </div>
        <div className={scss.card+' '+scss.w50}>
          4
        </div>
        <div className={scss.card+' '+scss.w50}>
          5
        </div>
        <div className={scss.card+' '+scss.w20}>
          6
        </div>
        <div className={scss.card+' '+scss.w80}>
          7
        </div>
        <div className={scss.card+' '+scss.w25}>
          8
        </div>
        <div className={scss.card+' '+scss.w75}>
          9
        </div>
        <div className={scss.card+' '+scss.w60}>
          10
        </div>
        <div className={scss.card+' '+scss.w20}>
          11
        </div>
        <div className={scss.card+' '+scss.w20}>
          12
        </div>
      </div>
    </div>
  );
}
