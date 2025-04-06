import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Who can participate? </h2>

      <div>
        <p>
          <strong> BES EXPO 2025</strong> is open for participation by
          manufacturers, dealers and distributors of products related to radio
          and TV broadcasting from India and abroad
        </p>
      </div>
    </div>
  );
}
