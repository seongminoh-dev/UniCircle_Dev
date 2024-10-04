import styles from "@/styles/loading.module.scss";

export const Loading = ({ small = false }) => {
  return (
    <div className={`${styles.loadingBox} ${small && styles.small}`}>
      <span className={`${styles.loadingText} ${small && styles.small}`}>
        Loading..
      </span>
      <section
        className={`${styles.cometSpinner} ${small && styles.small}`}
        tabIndex={1}
        aria-label="comet spinner"
      >
        <div className={`${styles.innerCircle} ${small && styles.small}`}></div>
        <div className={`${styles.comet} ${small && styles.small}`}></div>
      </section>
    </div>
  );
};

export default Loading;
